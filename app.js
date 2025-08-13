

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const Redis = require('redis');

// Import routes
const authRoutes = require('./src/routes/auth');
const surveyRoutes = require('./src/routes/surveys');
const responseRoutes = require('./src/routes/responses');
const aiRoutes = require('./src/routes/ai');
const analyticsRoutes = require('./src/routes/analytics');
const userRoutes = require('./src/routes/users');

// Import middleware
const authMiddleware = require('./src/middleware/auth');
const errorHandler = require('./src/middleware/errorHandler');
const logger = require('./src/utils/logger');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO for real-time features
const io = socketIo(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    }
});

// Initialize Redis client for caching and sessions
const redisClient = Redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => {
    logger.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
    logger.info('Redis Client Connected Successfully');
});

// Connect to Redis
redisClient.connect();

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: process.env.NODE_ENV === 'production' ? 100 : 1000, // limit each IP
    message: {
        error: 'Too many requests from this IP, please try again later.',
        retryAfter: 15 * 60 * 1000
    }
});

app.use(limiter);

// CORS configuration
app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins = [
            'http://localhost:3000',
            'http://localhost:3001',
            process.env.FRONTEND_URL
        ].filter(Boolean);
        
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
app.use(morgan('combined', {
    stream: {
        write: (message) => logger.info(message.trim())
    }
}));

// Database connection
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smart_survey_tool', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        logger.info(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        logger.error('Database connection failed:', error.message);
        process.exit(1);
    }
};

// Connect to database
connectDB();

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV,
        version: process.env.npm_package_version || '1.0.0'
    });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/surveys', authMiddleware, surveyRoutes);
app.use('/api/responses', authMiddleware, responseRoutes);
app.use('/api/ai', authMiddleware, aiRoutes);
app.use('/api/analytics', authMiddleware, analyticsRoutes);
app.use('/api/users', authMiddleware, userRoutes);

// Socket.IO connection handling for real-time features
io.use((socket, next) => {
    // Socket authentication middleware
    const token = socket.handshake.auth.token;
    if (token) {
        // Verify JWT token here
        next();
    } else {
        next(new Error('Authentication error'));
    }
});

io.on('connection', (socket) => {
    logger.info(`User connected: ${socket.id}`);
    
    // Join survey room for real-time updates
    socket.on('join-survey', (surveyId) => {
        socket.join(`survey-${surveyId}`);
        logger.info(`User ${socket.id} joined survey room: survey-${surveyId}`);
    });
    
    // Handle real-time survey responses
    socket.on('survey-response', async (data) => {
        try {
            // Broadcast response to survey room
            socket.to(`survey-${data.surveyId}`).emit('new-response', {
                responseId: data.responseId,
                timestamp: new Date().toISOString(),
                progress: data.progress
            });
        } catch (error) {
            logger.error('Socket survey response error:', error);
        }
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
        logger.info(`User disconnected: ${socket.id}`);
    });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'API endpoint not found',
        path: req.originalUrl,
        method: req.method
    });
});

// Graceful shutdown
const gracefulShutdown = (signal) => {
    logger.info(`Received ${signal}. Starting graceful shutdown...`);
    
    server.close(() => {
        logger.info('HTTP server closed');
        
        mongoose.connection.close(false, () => {
            logger.info('MongoDB connection closed');
            
            redisClient.disconnect().then(() => {
                logger.info('Redis connection closed');
                process.exit(0);
            });
        });
    });
    
    // Force close after 10 seconds
    setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    logger.error('Unhandled Promise Rejection:', err);
    gracefulShutdown('unhandledRejection');
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception:', err);
    gracefulShutdown('uncaughtException');
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    logger.info(`
    🚀 Smart Survey Tool Server Running!
    🌐 Environment: ${process.env.NODE_ENV || 'development'}
    📡 Port: ${PORT}
    🔗 Health Check: http://localhost:${PORT}/health
    📊 API Base URL: http://localhost:${PORT}/api
    🏛️  Ministry of Statistics and Programme Implementation
    🇮🇳 Government of India
    `);
});

// Export for testing
module.exports = { app, server, io };
