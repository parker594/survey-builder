/**
 * Survey Model - Smart Survey Tool
 * MongoDB Schema for Survey Data
 * Government of India - Ministry of Statistics and Programme Implementation
 */

const mongoose = require('mongoose');
const { Schema } = mongoose;

// Survey Schema Definition
const SurveySchema = new Schema({
  // Basic Survey Information
  title: {
    type: String,
    required: [true, 'Survey title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
    index: true
  },
  
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  
  category: {
    type: String,
    required: [true, 'Survey category is required'],
    enum: [
      'census', 'economic', 'social', 'health', 'education',
      'agriculture', 'employment', 'infrastructure', 'environment', 'other'
    ],
    index: true
  },
  
  targetAudience: {
    type: String,
    required: [true, 'Target audience is required'],
    enum: [
      'general_public', 'rural_population', 'urban_population',
      'farmers', 'entrepreneurs', 'students', 'government_employees',
      'healthcare_workers', 'teachers'
    ]
  },

  // Organization and Ownership
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Survey creator is required'],
    index: true
  },
  
  organizationId: {
    type: Schema.Types.ObjectId,
    ref: 'Organization',
    required: [true, 'Organization is required'],
    index: true
  },
  
  // Questions and Structure
  questions: [{
    type: Schema.Types.ObjectId,
    ref: 'Question'
  }],
  
  // Conditional Logic and Flow
  conditionalLogic: [{
    questionId: {
      type: Schema.Types.ObjectId,
      ref: 'Question',
      required: true
    },
    condition: {
      operator: {
        type: String,
        enum: ['equals', 'not_equals', 'contains', 'greater_than', 'less_than', 'in', 'not_in'],
        required: true
      },
      value: Schema.Types.Mixed,
      values: [Schema.Types.Mixed]
    },
    action: {
      type: {
        type: String,
        enum: ['show_question', 'hide_question', 'skip_to', 'end_survey'],
        required: true
      },
      targetQuestionId: {
        type: Schema.Types.ObjectId,
        ref: 'Question'
      },
      targetSectionId: String
    }
  }],

  // AI Configuration
  aiEnabled: {
    type: Boolean,
    default: true
  },
  
  aiConfiguration: {
    questionGeneration: {
      enabled: { type: Boolean, default: true },
      confidence_threshold: { type: Number, default: 0.8, min: 0, max: 1 }
    },
    responseValidation: {
      enabled: { type: Boolean, default: true },
      quality_threshold: { type: Number, default: 0.7, min: 0, max: 1 }
    },
    adaptiveQuestioning: {
      enabled: { type: Boolean, default: false },
      max_adaptive_questions: { type: Number, default: 3, min: 0, max: 10 }
    },
    insightGeneration: {
      enabled: { type: Boolean, default: true },
      auto_generate: { type: Boolean, default: false }
    }
  },

  // Multilingual Support
  languages: [{
    type: String,
    enum: ['en', 'hi', 'bn', 'te', 'ta', 'mr', 'gu', 'kn', 'pa', 'or', 'as', 'ml'],
    default: ['en']
  }],
  
  defaultLanguage: {
    type: String,
    enum: ['en', 'hi', 'bn', 'te', 'ta', 'mr', 'gu', 'kn', 'pa', 'or', 'as', 'ml'],
    default: 'en'
  },

  // Delivery Channels
  deliveryChannels: [{
    type: String,
    enum: ['web', 'mobile', 'whatsapp', 'sms', 'phone', 'email'],
    default: ['web']
  }],
  
  channelConfiguration: {
    web: {
      enabled: { type: Boolean, default: true },
      customDomain: String,
      theme: String,
      embeddable: { type: Boolean, default: false }
    },
    mobile: {
      enabled: { type: Boolean, default: false },
      appId: String,
      pushNotifications: { type: Boolean, default: false }
    },
    whatsapp: {
      enabled: { type: Boolean, default: false },
      businessAccountId: String,
      phoneNumberId: String,
      templateId: String
    },
    sms: {
      enabled: { type: Boolean, default: false },
      shortCode: String,
      template: String
    },
    phone: {
      enabled: { type: Boolean, default: false },
      ivr_flow: String,
      voice_language: String
    },
    email: {
      enabled: { type: Boolean, default: false },
      template: String,
      reminderSchedule: [Date]
    }
  },

  // Survey Settings
  settings: {
    // Response Collection
    expectedResponses: {
      type: Number,
      min: [1, 'Expected responses must be at least 1'],
      default: 100
    },
    
    maxResponses: {
      type: Number,
      min: 1
    },
    
    multipleSubmissions: {
      type: Boolean,
      default: false
    },
    
    anonymousResponses: {
      type: Boolean,
      default: true
    },
    
    // Timing and Scheduling
    estimatedDuration: {
      type: Number, // in minutes
      min: 1,
      default: 10
    },
    
    timeLimit: {
      type: Number, // in minutes, null for no limit
      min: 1
    },
    
    launchDate: {
      type: Date,
      default: Date.now
    },
    
    expiryDate: {
      type: Date,
      validate: {
        validator: function(value) {
          return !value || value > this.launchDate;
        },
        message: 'Expiry date must be after launch date'
      }
    },
    
    // Access Control
    accessControl: {
      type: String,
      enum: ['public', 'authenticated', 'invite_only', 'restricted'],
      default: 'public'
    },
    
    inviteList: [{
      email: String,
      phone: String,
      identifier: String,
      invitedAt: { type: Date, default: Date.now },
      respondedAt: Date
    }],
    
    // Data Collection
    collectGeolocation: {
      type: Boolean,
      default: false
    },
    
    collectDeviceInfo: {
      type: Boolean,
      default: true
    },
    
    requireConsent: {
      type: Boolean,
      default: true
    },
    
    consentText: {
      type: String,
      default: "I consent to participate in this survey and agree to the data collection and privacy terms."
    },
    
    // Quality Control
    enableDuplicateDetection: {
      type: Boolean,
      default: true
    },
    
    enableSpamPrevention: {
      type: Boolean,
      default: true
    },
    
    minimumResponseTime: {
      type: Number, // in seconds
      default: 30
    }
  },

  // Metadata and Status
  metadata: {
    status: {
      type: String,
      enum: ['draft', 'review', 'published', 'paused', 'completed', 'archived', 'deleted'],
      default: 'draft',
      index: true
    },
    
    version: {
      type: String,
      default: '1.0.0'
    },
    
    publishedAt: Date,
    
    completedAt: Date,
    
    lastModifiedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    
    tags: [{
      type: String,
      trim: true
    }],
    
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    },
    
    // Government Specific
    departmentCode: String,
    schemeCode: String,
    projectCode: String,
    budgetCode: String,
    approvalNumber: String,
    complianceStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'needs_review'],
      default: 'pending'
    }
  },

  // Analytics and Performance
  analytics: {
    totalViews: { type: Number, default: 0 },
    totalStarted: { type: Number, default: 0 },
    totalCompleted: { type: Number, default: 0 },
    totalDropouts: { type: Number, default: 0 },
    averageCompletionTime: { type: Number, default: 0 }, // in seconds
    completionRate: { type: Number, default: 0 }, // percentage
    lastCalculated: Date,
    
    channelPerformance: {
      web: { views: { type: Number, default: 0 }, completions: { type: Number, default: 0 } },
      mobile: { views: { type: Number, default: 0 }, completions: { type: Number, default: 0 } },
      whatsapp: { views: { type: Number, default: 0 }, completions: { type: Number, default: 0 } },
      sms: { views: { type: Number, default: 0 }, completions: { type: Number, default: 0 } },
      phone: { views: { type: Number, default: 0 }, completions: { type: Number, default: 0 } },
      email: { views: { type: Number, default: 0 }, completions: { type: Number, default: 0 } }
    },
    
    languageDistribution: [{
      language: String,
      responses: { type: Number, default: 0 },
      completionRate: { type: Number, default: 0 }
    }],
    
    qualityMetrics: {
      averageResponseQuality: { type: Number, default: 0 }, // 0-10 scale
      flaggedResponses: { type: Number, default: 0 },
      averageResponseLength: { type: Number, default: 0 },
      duplicateResponses: { type: Number, default: 0 }
    }
  },

  // AI Generated Insights
  aiInsights: {
    lastGenerated: Date,
    summary: String,
    keyFindings: [String],
    recommendations: [String],
    qualityScore: { type: Number, min: 0, max: 10 },
    confidence: { type: Number, min: 0, max: 1 },
    patterns: [{
      type: String,
      description: String,
      significance: { type: Number, min: 0, max: 1 }
    }]
  },

  // Data Export and Integration
  dataExports: [{
    exportedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    exportedAt: { type: Date, default: Date.now },
    format: {
      type: String,
      enum: ['csv', 'xlsx', 'json', 'pdf', 'xml']
    },
    fileSize: Number,
    downloadUrl: String,
    expiresAt: Date
  }],

  // Backup and Archival
  backupInfo: {
    lastBackup: Date,
    backupLocation: String,
    backupSize: Number,
    retentionPolicy: {
      type: String,
      enum: ['7_years', '10_years', 'permanent'],
      default: '7_years'
    }
  }

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for Performance
SurveySchema.index({ createdBy: 1, 'metadata.status': 1 });
SurveySchema.index({ organizationId: 1, category: 1 });
SurveySchema.index({ 'metadata.status': 1, 'settings.launchDate': 1 });
SurveySchema.index({ title: 'text', description: 'text' });
SurveySchema.index({ 'metadata.tags': 1 });
SurveySchema.index({ createdAt: -1 });

// Virtual Properties
S