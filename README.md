# 🇮🇳 AI-Powered Smart Survey Tool

## Government of India - Ministry of Statistics and Programme Implementation

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/Node.js-16%2B-green.svg)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6%2B-green.svg)](https://mongodb.com/)

> A comprehensive, AI-powered survey platform designed for efficient data collection across multiple channels with advanced analytics and real-time insights.

## 🌟 Features

### ✨ Core Features
- **🤖 AI-Powered Question Generation** - Generate intelligent questions using GPT-4
- **📊 Real-time Analytics Dashboard** - Live insights and data visualization
- **🌐 Multi-language Support** - Support for 12+ Indian languages with auto-translation
- **📱 Multi-channel Delivery** - Web, Mobile, WhatsApp, SMS, Phone, Email
- **🔍 Smart Response Validation** - AI-driven quality assurance and anomaly detection
- **📈 Adaptive Questioning** - Dynamic follow-up questions based on responses
- **🎯 Conditional Logic** - Complex survey flows with skip patterns
- **🔒 Enterprise Security** - End-to-end encryption and compliance features

### 🏛️ Government-Specific Features
- **📋 NSS Standards Compliance** - Adheres to National Sample Survey standards
- **🗺️ Geographic Mapping** - GPS coordinates and location-based analytics
- **📊 Census Integration** - Compatible with census and survey methodologies
- **🔐 Data Privacy** - GDPR compliant with government data protection standards
- **📈 Multi-level Analytics** - District, State, and National level reporting
- **🏢 Organization Management** - Department-wise access control and workflows

### 🤖 AI Capabilities
- **Natural Language Processing** - Intelligent question understanding and generation
- **Response Quality Analysis** - Automatic detection of low-quality responses
- **Pattern Recognition** - Identify trends and insights in survey data
- **Multilingual Translation** - Real-time translation with cultural context
- **Predictive Analytics** - Forecast response patterns and completion rates
- **Automated Insights** - Generate actionable recommendations from data

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   AI Services   │
│   React.js      │◄──►│   Node.js       │◄──►│   Python        │
│   Material-UI   │    │   Express.js    │    │   OpenAI GPT-4  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Apps     │    │   Database      │    │   External APIs │
│   Web/Mobile    │    │   MongoDB       │    │   Twilio/AWS    │
│   WhatsApp/SMS  │    │   Redis Cache   │    │   Google Cloud  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** 16.x or higher ([Download](https://nodejs.org/))
- **Python** 3.8+ ([Download](https://python.org/))
- **MongoDB** 6.0+ ([Download](https://mongodb.com/try/download/community))
- **Redis** 6.0+ ([Download](https://redis.io/download))
- **Git** ([Download](https://git-scm.com/))

### 1. Clone Repository
```bash
git clone https://github.com/mospi/smart-survey-tool.git
cd smart-survey-tool
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your API keys (see API Keys section below)
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env if needed
npm start
```

### 4. AI Services Setup
```bash
cd ai-services
pip install -r requirements.txt
python app.py
```

### 5. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **AI Services**: http://localhost:8000
- **Health Check**: http://localhost:5000/health

## 🔑 API Keys Setup Guide

### Required API Keys

#### 1. OpenAI API Key (REQUIRED)
**Purpose**: AI question generation, response validation, insights
```bash
# Get from: https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-your-openai-api-key-here
```
**Steps**:
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign up or log in
3. Click "Create new secret key"
4. Copy the key and add to `.env`
5. **Note**: You'll need billing enabled for GPT-4 access

#### 2. MongoDB Database (REQUIRED)
**Purpose**: Primary database for surveys and responses
```bash
# Option 1: MongoDB Atlas (Recommended)
# Get from: https://www.mongodb.com/atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smart_survey_tool

# Option 2: Local MongoDB
MONGODB_URI=mongodb://localhost:27017/smart_survey_tool
```
**Atlas Setup**:
1. Visit [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create free account and cluster
3. Create database user
4. Get connection string
5. Replace `<password>` with your password

#### 3. Redis Cache (REQUIRED)
**Purpose**: Session management and caching
```bash
# Option 1: Redis Cloud
# Get from: https://redis.com/
REDIS_URL=redis://username:password@host:port

# Option 2: Local Redis
REDIS_URL=redis://localhost:6379
```

#### 4. Google Cloud APIs (Recommended)
**Purpose**: Translation, speech services
```bash
# Get from: https://console.cloud.google.com/
GOOGLE_CLOUD_API_KEY=your-google-cloud-api-key
```
**Setup**:
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Enable APIs: Translate API, Speech-to-Text API
4. Create API key in Credentials section
5. Copy key to `.env`

#### 5. Twilio (Optional - for SMS)
**Purpose**: SMS survey delivery
```bash
# Get from: https://www.twilio.com/console
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890
```

#### 6. SendGrid (Optional - for Email)
**Purpose**: Email notifications and surveys
```bash
# Get from: https://sendgrid.com/
SENDGRID_API_KEY=SG.your-sendgrid-api-key-here
```

#### 7. WhatsApp Business API (Optional)
**Purpose**: WhatsApp survey delivery
```bash
# Get from: https://developers.facebook.com/docs/whatsapp
WHATSAPP_BUSINESS_ACCOUNT_ID=your-business-account-id
WHATSAPP_ACCESS_TOKEN=your-access-token
```

#### 8. AWS S3 (Optional - for file storage)
**Purpose**: File uploads and storage
```bash
# Get from: https://aws.amazon.com/s3/
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_S3_BUCKET=your-s3-bucket-name
```

## 📦 Installation Methods

### Method 1: Manual Installation (Recommended for Development)
Follow the Quick Start guide above.

### Method 2: Docker Installation
```bash
# Clone repository
git clone https://github.com/mospi/smart-survey-tool.git
cd smart-survey-tool

# Set up environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# Edit .env files with your API keys

# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f
```

### Method 3: Production Installation
```bash
# Install production dependencies
cd backend && npm ci --production
cd frontend && npm ci --production && npm run build

# Start production servers
cd backend && npm start
cd frontend && serve -s build -l 3000
```

## 🗄️ Database Setup

### MongoDB Collections
The application automatically creates these collections:
- `surveys` - Survey definitions and metadata
- `questions` - Individual survey questions
- `responses` - Survey response data
- `users` - User accounts and authentication
- `organizations` - Department/organization data
- `analytics` - Performance and usage analytics
- `sessions` - User session management

### Sample Data (Optional)
```bash
# Seed database with sample surveys
cd backend
npm run seed
```

## 🔧 Configuration

### Environment Variables
```bash
# Core Settings
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/smart_survey_tool
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your-super-secure-jwt-secret-key
JWT_EXPIRE=7d

# AI Services (Required)
OPENAI_API_KEY=sk-your-openai-api-key-here

# Communication (Optional)
TWILIO_ACCOUNT_SID=your-twilio-sid
SENDGRID_API_KEY=your-sendgrid-key
WHATSAPP_ACCESS_TOKEN=your-whatsapp-token

# File Storage (Optional)
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_S3_BUCKET=your-bucket-name
```

### Frontend Configuration
```bash
# Frontend .env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_AI_URL=http://localhost:8000
REACT_APP_SOCKET_URL=http://localhost:5000
```

## 📱 Usage Guide

### Creating Your First Survey

1. **Access the Application**
   - Open http://localhost:3000
   - Register a new account or login
   - Navigate to "Create Survey"

2. **Basic Information**
   - Enter survey title and description
   - Select category (census, economic, social, etc.)
   - Choose target audience
   - Enable AI features

3. **Add Questions**
   - Click "Add Question" for manual creation
   - Or click "AI Assistant" for automatic generation
   - Configure question types: text, multiple choice, rating, etc.
   - Set validation rules and conditional logic

4. **Configure AI Features**
   - Enable smart validation
   - Set up multi-language support
   - Configure adaptive questioning
   - Choose delivery channels

5. **Preview and Publish**
   - Use preview feature to test survey
   - Review AI-generated insights
   - Publish survey across selected channels

### AI-Powered Features

#### Question Generation
```javascript
// AI generates questions based on context
const questionPrompts = [
  "household income and expenditure patterns",
  "employment status and job satisfaction",
  "access to government services"
];

// AI creates relevant, culturally appropriate questions
```

#### Smart Validation
```javascript
// AI validates responses in real-time
{
  "response": "I earn 50000000 per month",
  "validation": {
    "isValid": false,
    "confidence": 0.95,
    "issues": ["Unusually high income value"],
    "suggestion": "Please verify income amount"
  }
}
```

#### Multi-language Support
```javascript
// AI translates questions automatically
{
  "en": "What is your monthly household income?",
  "hi": "आपकी मासिक घरेलू आय क्या है?",
  "bn": "আপনার মাসিক পারিবারিক আয় কত?",
  "te": "మీ మాసిక కుటుంब ఆదాయం ఎంత?"
}
```

## 🔐 Security Features

### Data Protection
- **Encryption at Rest**: All sensitive data encrypted in database
- **Encryption in Transit**: HTTPS/TLS for all communications
- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: Granular permissions system
- **API Rate Limiting**: Protection against abuse
- **Input Validation**: Comprehensive data sanitization

### Privacy Compliance
- **Data Anonymization**: PII protection features
- **Consent Management**: Built-in consent workflows
- **Right to Deletion**: GDPR compliance features
- **Audit Logging**: Complete activity tracking
- **Data Retention**: Configurable retention policies

## 📊 Analytics Dashboard

### Real-time Metrics
- **Response Rate**: Live completion statistics
- **Geographic Distribution**: Map-based response visualization
- **Channel Performance**: Cross-channel analytics
- **Quality Metrics**: AI-powered data quality scores
- **Demographic Insights**: Population-based analytics

### AI-Generated Insights
- **Trend Analysis**: Automatic pattern detection
- **Anomaly Detection**: Unusual response flagging
- **Predictive Analytics**: Response rate forecasting
- **Recommendation Engine**: Data-driven suggestions
- **Executive Summaries**: AI-generated reports

## 🛠️ Development Guide

### Project Structure
```
smart-survey-tool/
├── backend/                 # Node.js Express API
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Custom middleware
│   │   ├── services/        # Business logic
│   │   └── utils/           # Helper functions
│   ├── tests/               # Backend tests
│   └── package.json
├── frontend/                # React.js application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── context/         # React context
│   │   ├── hooks/           # Custom hooks
│   │   └── utils/           # Helper functions
│   ├── public/              # Static assets
│   └── package.json
├── ai-services/             # Python AI services
│   ├── nlp/                 # Natural language processing
│   ├── validation/          # Response validation
│   ├── analytics/           # Data analysis
│   └── requirements.txt
├── docs/                    # Documentation
├── docker/                  # Docker configurations
└── scripts/                 # Utility scripts
```

### Adding New Features

#### Backend API Endpoint
```javascript
// backend/src/routes/surveys.js
router.post('/surveys/:id/questions', async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);
    const question = new Question({
      ...req.body,
      surveyId: survey._id
    });
    await question.save();
    res.json({ success: true, data: question });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

#### Frontend Component
```javascript
// frontend/src/components/QuestionEditor.js
import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';

const QuestionEditor = ({ onSave }) => {
  const [question, setQuestion] = useState('');
  
  const handleSave = () => {
    onSave({ text: question, type: 'text' });
  };
  
  return (
    <div>
      <TextField
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        label="Question Text"
        fullWidth
      />
      <Button onClick={handleSave}>Save Question</Button>
    </div>
  );
};

export default QuestionEditor;
```

#### AI Service Integration
```python
# ai-services/nlp/questionGenerator.py
from openai import OpenAI
import json

class QuestionGenerator:
    def __init__(self, api_key):
        self.client = OpenAI(api_key=api_key)
    
    def generate_questions(self, context, count=5):
        prompt = f"Generate {count} survey questions for: {context}"
        response = self.client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}]
        )
        return json.loads(response.choices[0].message.content)
```

### Testing

#### Backend Tests
```bash
cd backend
npm test                    # Run all tests
npm run test:coverage       # Run with coverage
npm run test:watch         # Watch mode
```

#### Frontend Tests
```bash
cd frontend
npm test                    # Run React tests
npm run test:coverage       # Run with coverage
```

#### Integration Tests
```bash
# Run full test suite
npm run test:all
```

## 🚀 Deployment

### Development Deployment
```bash
# Start all services in development mode
npm run dev:all

# Or start individually
npm run dev:backend
npm run dev:frontend
npm run dev:ai
```

### Production Deployment

#### Option 1: Traditional Deployment
```bash
# Backend
cd backend
npm ci --production
pm2 start src/server.js --name "survey-backend"

# Frontend
cd frontend
npm ci --production
npm run build
serve -s build -l 3000

# AI Services
cd ai-services
pip install -r requirements.txt
gunicorn -w 4 -b 0.0.0.0:8000 app:app
```

#### Option 2: Docker Deployment
```bash
# Build images
docker-compose -f docker-compose.prod.yml build

# Deploy
docker-compose -f docker-compose.prod.yml up -d

# Scale services
docker-compose -f docker-compose.prod.yml up -d --scale backend=3
```

#### Option 3: Cloud Deployment

##### AWS Deployment
```bash
# Deploy to AWS ECS
aws ecs create-service --cluster smart-survey --service-name survey-backend

# Deploy to AWS Lambda (for API endpoints)
serverless deploy --stage production
```

##### Azure Deployment
```bash
# Deploy to Azure Container Instances
az container create --resource-group smart-survey --name survey-app

# Deploy to Azure Web Apps
az webapp up --name smart-survey-tool
```

##### Google Cloud Deployment
```bash
# Deploy to Google Cloud Run
gcloud run deploy survey-backend --source .

# Deploy to Google Kubernetes Engine
kubectl apply -f k8s/
```

### Environment-Specific Configurations

#### Production Environment Variables
```bash
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://prod-user:password@cluster.mongodb.net/survey_prod
REDIS_URL=redis://prod-redis:6379
FRONTEND_URL=https://survey.mospi.gov.in

# Security
JWT_SECRET=production-super-secure-secret
ENCRYPTION_KEY=32-character-production-key
CORS_ORIGIN=https://survey.mospi.gov.in

# Performance
CACHE_TTL=3600
RATE_LIMIT_MAX_REQUESTS=100
```

## 📈 Performance Optimization

### Database Optimization
```javascript
// Add indexes for better query performance
db.surveys.createIndex({ "organizationId": 1, "metadata.status": 1 });
db.responses.createIndex({ "surveyId": 1, "createdAt": -1 });
db.users.createIndex({ "email": 1 }, { unique: true });
```

### Caching Strategy
```javascript
// Redis caching for frequently accessed data
const redis = require('redis');
const client = redis.createClient();

// Cache survey data
app.get('/api/surveys/:id', async (req, res) => {
  const cacheKey = `survey:${req.params.id}`;
  let survey = await client.get(cacheKey);
  
  if (!survey) {
    survey = await Survey.findById(req.params.id);
    await client.setex(cacheKey, 3600, JSON.stringify(survey));
  }
  
  res.json(survey);
});
```

### Frontend Optimization
```javascript
// Code splitting for better load times
import { lazy, Suspense } from 'react';

const SurveyBuilder = lazy(() => import('./components/SurveyBuilder'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SurveyBuilder />
    </Suspense
