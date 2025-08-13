# survey-builder
# AI-Powered Smart Survey Tool for Data Collection

## 🚀 Project Overview
A comprehensive AI-powered survey platform for government data collection with advanced features like natural language processing, multi-channel delivery, real-time validation, and intelligent data analysis.

## 📁 Project Structure

```
smart-survey-tool/
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   ├── favicon.ico
│   │   └── manifest.json
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Header.js
│   │   │   │   ├── Footer.js
│   │   │   │   ├── Loading.js
│   │   │   │   └── ErrorBoundary.js
│   │   │   ├── survey/
│   │   │   │   ├── SurveyBuilder.js
│   │   │   │   ├── SurveyRenderer.js
│   │   │   │   ├── QuestionTypes.js
│   │   │   │   └── ConditionalLogic.js
│   │   │   ├── dashboard/
│   │   │   │   ├── AdminDashboard.js
│   │   │   │   ├── EnumeratorDashboard.js
│   │   │   │   ├── QualityMetrics.js
│   │   │   │   └── DataVisualization.js
│   │   │   ├── ai/
│   │   │   │   ├── AIChat.js
│   │   │   │   ├── SmartValidation.js
│   │   │   │   ├── NLPProcessor.js
│   │   │   │   └── AdaptiveQuestioning.js
│   │   │   └── auth/
│   │   │       ├── Login.js
│   │   │       ├── Register.js
│   │   │       └── ProtectedRoute.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── SurveyCreate.js
│   │   │   ├── SurveyList.js
│   │   │   ├── SurveyTake.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Analytics.js
│   │   │   ├── Profile.js
│   │   │   └── Settings.js
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── auth.js
│   │   │   ├── survey.js
│   │   │   ├── ai.js
│   │   │   └── analytics.js
│   │   ├── utils/
│   │   │   ├── validation.js
│   │   │   ├── helpers.js
│   │   │   ├── constants.js
│   │   │   └── formatters.js
│   │   ├── styles/
│   │   │   ├── globals.css
│   │   │   ├── components.css
│   │   │   └── themes.css
│   │   ├── context/
│   │   │   ├── AuthContext.js
│   │   │   ├── SurveyContext.js
│   │   │   └── ThemeContext.js
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useSurvey.js
│   │   │   └── useLocalStorage.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── routes.js
│   ├── package.json
│   └── .env.example
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── surveyController.js
│   │   │   ├── responseController.js
│   │   │   ├── aiController.js
│   │   │   ├── analyticsController.js
│   │   │   └── userController.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Survey.js
│   │   │   ├── Question.js
│   │   │   ├── Response.js
│   │   │   ├── Session.js
│   │   │   └── Analytics.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── surveys.js
│   │   │   ├── responses.js
│   │   │   ├── ai.js
│   │   │   ├── analytics.js
│   │   │   └── users.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── validation.js
│   │   │   ├── rateLimiting.js
│   │   │   ├── encryption.js
│   │   │   └── logging.js
│   │   ├── services/
│   │   │   ├── aiService.js
│   │   │   ├── nlpService.js
│   │   │   ├── validationService.js
│   │   │   ├── emailService.js
│   │   │   ├── smsService.js
│   │   │   ├── whatsappService.js
│   │   │   └── analyticsService.js
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   ├── redis.js
│   │   │   ├── ai.js
│   │   │   └── constants.js
│   │   ├── utils/
│   │   │   ├── helpers.js
│   │   │   ├── encryption.js
│   │   │   ├── validators.js
│   │   │   └── logger.js
│   │   ├── app.js
│   │   └── server.js
│   ├── package.json
│   └── .env.example
├── ai-services/
│   ├── nlp/
│   │   ├── questionGenerator.py
│   │   ├── responseAnalyzer.py
│   │   ├── languageDetector.py
│   │   └── translator.py
│   ├── validation/
│   │   ├── smartValidator.py
│   │   ├── anomalyDetector.py
│   │   └── qualityAssurance.py
│   ├── analytics/
│   │   ├── dataProcessor.py
│   │   ├── insightGenerator.py
│   │   └── reportBuilder.py
│   └── requirements.txt
├── mobile/
│   ├── src/
│   │   ├── screens/
│   │   ├── components/
│   │   └── services/
│   └── package.json
├── docs/
│   ├── API.md
│   ├── DEPLOYMENT.md
│   ├── USER_GUIDE.md
│   └── DEVELOPMENT.md
├── docker/
│   ├── Dockerfile.frontend
│   ├── Dockerfile.backend
│   ├── Dockerfile.ai
│   └── docker-compose.yml
├── scripts/
│   ├── setup.sh
│   ├── deploy.sh
│   └── seed-database.js
├── tests/
│   ├── frontend/
│   ├── backend/
│   └── ai/
├── .gitignore
├── README.md
└── LICENSE

```

## 🔧 Tech Stack

### Frontend
- **React.js 18** with hooks and context
- **React Router** for routing
- **Axios** for API calls
- **Material-UI** for components
- **Chart.js** for data visualization
- **Socket.io-client** for real-time updates

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Redis** for caching and sessions
- **JWT** for authentication
- **Socket.io** for real-time communication
- **Multer** for file uploads

### AI/ML Services
- **Python** with Flask/FastAPI
- **OpenAI GPT-4** for natural language processing
- **Google Translate API** for multi-language support
- **TensorFlow/PyTorch** for custom ML models
- **spaCy** for NLP processing

### DevOps & Infrastructure
- **Docker** for containerization
- **PostgreSQL** for structured data (alternative to MongoDB)
- **AWS S3** for file storage
- **Redis** for caching
- **JWT** for secure authentication

## 🔑 Required API Keys & Setup

### 1. OpenAI API Key
- **Where to get**: [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- **Usage**: Natural language processing, question generation, response analysis
- **Add to**: `backend/.env` as `OPENAI_API_KEY=your_key_here`

### 2. Google Cloud APIs
- **Where to get**: [https://console.cloud.google.com/](https://console.cloud.google.com/)
- **Required APIs**: 
  - Translate API
  - Speech-to-Text API
  - Text-to-Speech API
- **Add to**: `backend/.env` as `GOOGLE_CLOUD_KEY=your_key_here`

### 3. WhatsApp Business API
- **Where to get**: [https://developers.facebook.com/docs/whatsapp](https://developers.facebook.com/docs/whatsapp)
- **Usage**: Multi-channel survey delivery
- **Add to**: `backend/.env` as `WHATSAPP_TOKEN=your_token_here`

### 4. Twilio API (for SMS)
- **Where to get**: [https://www.twilio.com/console](https://www.twilio.com/console)
- **Usage**: SMS survey delivery and notifications
- **Add to**: `backend/.env` as `TWILIO_SID=your_sid` and `TWILIO_TOKEN=your_token`

### 5. Email Service (SendGrid)
- **Where to get**: [https://sendgrid.com/](https://sendgrid.com/)
- **Usage**: Email notifications and survey invitations
- **Add to**: `backend/.env` as `SENDGRID_API_KEY=your_key_here`

### 6. Database & Storage
- **MongoDB Atlas**: [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas)
- **Redis Cloud**: [https://redis.com/](https://redis.com/)
- **AWS S3**: [https://aws.amazon.com/s3/](https://aws.amazon.com/s3/)

## 📦 Installation & Setup

### Prerequisites
```bash
# Install Node.js (v16 or higher)
# Install Python (v3.8 or higher)
# Install Docker (optional)
```

### Quick Start
```bash
# Clone the repository
git clone <repository-url>
cd smart-survey-tool

# Setup backend
cd backend
npm install
cp .env.example .env
# Edit .env with your API keys
npm run dev

# Setup frontend (new terminal)
cd frontend
npm install
cp .env.example .env
npm start

# Setup AI services (new terminal)
cd ai-services
pip install -r requirements.txt
python app.py
```

## 🌟 Key Features Implemented

### ✅ Core Survey Features
- **No-code survey builder** with drag-and-drop interface
- **Multi-language support** with automatic translation
- **Conditional logic** and skip patterns
- **Multi-channel delivery** (Web, WhatsApp, SMS, Phone)
- **Real-time validation** with AI-powered checks

### ✅ AI-Powered Features
- **Natural language question generation**
- **Adaptive questioning** based on responses
- **Smart data validation** and anomaly detection
- **Automated response categorization**
- **Intelligent survey routing**

### ✅ Data & Analytics
- **Real-time dashboard** with quality metrics
- **Advanced data visualization**
- **Automated reporting** and insights
- **Data export** in multiple formats
- **Quality assurance** monitoring

### ✅ Security & Compliance
- **End-to-end encryption** for all data
- **Role-based access control**
- **Audit logging** for all actions
- **GDPR/Privacy compliance** features
- **Secure API** with rate limiting

## 🎯 User Roles

1. **System Administrator**
   - Manage users and permissions
   - Configure system settings
   - Monitor system performance

2. **Survey Designer**
   - Create and edit surveys
   - Configure AI features
   - Manage question banks

3. **Field Enumerator**
   - Conduct surveys
   - Real-time data entry
   - Offline capability

4. **Data Analyst**
   - View analytics and reports
   - Export data
   - Quality monitoring

5. **Respondent**
   - Take surveys
   - Multi-language interface
   - Multi-device support

## 🚀 Deployment

### Development
```bash
npm run dev          # Backend
npm start            # Frontend
python app.py        # AI Services
```

### Production
```bash
docker-compose up -d  # Full stack deployment
```

## 📋 Environment Variables

Create `.env` files in both `frontend/` and `backend/` directories:

### Backend `.env`
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_connection_string
REDIS_URL=your_redis_connection_string
JWT_SECRET=your_jwt_secret_key
OPENAI_API_KEY=your_openai_api_key
GOOGLE_CLOUD_KEY=your_google_cloud_api_key
TWILIO_SID=your_twilio_account_sid
TWILIO_TOKEN=your_twilio_auth_token
WHATSAPP_TOKEN=your_whatsapp_business_token
SENDGRID_API_KEY=your_sendgrid_api_key
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_BUCKET_NAME=your_s3_bucket_name
```

### Frontend `.env`
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_AI_URL=http://localhost:8000
REACT_APP_SOCKET_URL=http://localhost:5000
```

## 📖 Documentation

- [API Documentation](docs/API.md)
- [User Guide](docs/USER_GUIDE.md)
- [Development Guide](docs/DEVELOPMENT.md)
- [Deployment Guide](docs/DEPLOYMENT.md)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Email: support@smartsurvey.gov.in
- Documentation: [User Guide](docs/USER_GUIDE.md)

---

**Note**: This is a prototype implementation. For production deployment, ensure proper security auditing, performance optimization, and compliance verification.
