/**
 * Survey Controller - Smart Survey Tool
 * Handles all survey-related operations with AI integration
 * Government of India - Ministry of Statistics and Programme Implementation
 */

const Survey = require('../models/Survey');
const Question = require('../models/Question');
const Response = require('../models/Response');
const aiService = require('../services/aiService');
const nlpService = require('../services/nlpService');
const validationService = require('../services/validationService');
const analyticsService = require('../services/analyticsService');
const logger = require('../utils/logger');
const { validationResult } = require('express-validator');

class SurveyController {
  /**
   * Create a new survey with AI-powered question generation
   */
  static async createSurvey(req, res) {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const {
        title,
        description,
        category,
        targetAudience,
        expectedResponses,
        languages,
        deliveryChannels,
        aiEnabled,
        questionPrompts,
        conditionalLogic
      } = req.body;

      // Create survey document
      const survey = new Survey({
        title,
        description,
        category,
        targetAudience,
        expectedResponses,
        languages: languages || ['en', 'hi'],
        deliveryChannels: deliveryChannels || ['web'],
        createdBy: req.user.id,
        organizationId: req.user.organizationId,
        aiEnabled,
        conditionalLogic: conditionalLogic || [],
        metadata: {
          createdAt: new Date(),
          version: '1.0.0',
          status: 'draft'
        }
      });

      // AI-powered question generation if enabled
      if (aiEnabled && questionPrompts && questionPrompts.length > 0) {
        logger.info(`Generating AI questions for survey: ${title}`);
        
        const generatedQuestions = await aiService.generateQuestions({
          prompts: questionPrompts,
          category,
          targetAudience,
          languages: languages[0] || 'en'
        });

        // Process and validate generated questions
        const processedQuestions = await Promise.all(
          generatedQuestions.map(async (q, index) => {
            const question = new Question({
              surveyId: survey._id,
              type: q.type || 'text',
              text: q.text,
              description: q.description,
              required: q.required || false,
              options: q.options || [],
              validation: q.validation || {},
              order: index + 1,
              aiGenerated: true,
              translations: q.translations || {},
              metadata: {
                confidence: q.confidence || 0.8,
                source: 'ai_generated',
                prompt: questionPrompts[Math.floor(index / (generatedQuestions.length / questionPrompts.length))]
              }
            });

            return question;
          })
        );

        // Save all questions
        const savedQuestions = await Question.insertMany(processedQuestions);
        survey.questions = savedQuestions.map(q => q._id);
        
        logger.info(`Generated ${savedQuestions.length} AI questions for survey ${survey._id}`);
      }

      // Save survey
      const savedSurvey = await survey.save();

      // Generate multilingual versions if required
      if (languages && languages.length > 1) {
        await nlpService.generateTranslations(savedSurvey._id, languages);
      }

      // Log survey creation
      logger.info(`Survey created successfully: ${savedSurvey._id} by user: ${req.user.id}`);

      res.status(201).json({
        success: true,
        message: 'Survey created successfully',
        data: {
          survey: savedSurvey,
          questionsGenerated: survey.questions ? survey.questions.length : 0,
          aiEnabled: aiEnabled
        }
      });

    } catch (error) {
      logger.error('Survey creation error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create survey',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Get all surveys with filters and pagination
   */
  static async getSurveys(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        category,
        status,
        search,
        createdBy,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      // Build query
      const query = {};
      
      // Organization filter
      if (req.user.role !== 'admin') {
        query.organizationId = req.user.organizationId;
      }

      // Additional filters
      if (category) query.category = category;
      if (status) query['metadata.status'] = status;
      if (createdBy) query.createdBy = createdBy;
      
      // Search functionality
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } }
        ];
      }

      // Execute query with pagination
      const surveys = await Survey.find(query)
        .populate('createdBy', 'name email')
        .populate('questions')
        .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit));

      // Get total count for pagination
      const totalSurveys = await Survey.countDocuments(query);

      // Add analytics data for each survey
      const surveysWithAnalytics = await Promise.all(
        surveys.map(async (survey) => {
          const analytics = await analyticsService.getSurveyBasicStats(survey._id);
          return {
            ...survey.toObject(),
            analytics
          };
        })
      );

      res.json({
        success: true,
        data: {
          surveys: surveysWithAnalytics,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalSurveys / parseInt(limit)),
            totalSurveys,
            limit: parseInt(limit)
          }
        }
      });

    } catch (error) {
      logger.error('Get surveys error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch surveys',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Get single survey by ID with detailed information
   */
  static async getSurveyById(req, res) {
    try {
      const { id } = req.params;
      const { includeAnalytics = true, includeResponses = false } = req.query;

      const survey = await Survey.findById(id)
        .populate('createdBy', 'name email')
        .populate('questions')
        .populate('organizationId', 'name');

      if (!survey) {
        return res.status(404).json({
          success: false,
          message: 'Survey not found'
        });
      }

      // Check permissions
      if (req.user.role !== 'admin' && 
          survey.organizationId._id.toString() !== req.user.organizationId.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      let surveyData = survey.toObject();

      // Include analytics if requested
      if (includeAnalytics === 'true') {
        const analytics = await analyticsService.getDetailedSurveyAnalytics(id);
        surveyData.analytics = analytics;
      }

      // Include recent responses if requested
      if (includeResponses === 'true') {
        const recentResponses = await Response.find({ surveyId: id })
          .limit(10)
          .sort({ createdAt: -1 })
          .populate('respondent', 'name email');
        
        surveyData.recentResponses = recentResponses;
      }

      res.json({
        success: true,
        data: {
          survey: surveyData
        }
      });

    } catch (error) {
      logger.error('Get survey by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch survey',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Update survey with AI-powered optimizations
   */
  static async updateSurvey(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const survey = await Survey.findById(id);
      if (!survey) {
        return res.status(404).json({
          success: false,
          message: 'Survey not found'
        });
      }

      // Check permissions
      if (req.user.role !== 'admin' && 
          survey.createdBy.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      // Check if survey is published and has responses
      if (survey.metadata.status === 'published') {
        const responseCount = await Response.countDocuments({ surveyId: id });
        if (responseCount > 0 && updates.questions) {
          return res.status(400).json({
            success: false,
            message: 'Cannot modify questions of published survey with responses'
          });
        }
      }

      // AI-powered question optimization if requested
      if (updates.optimizeWithAI && survey.aiEnabled) {
        logger.info(`Optimizing survey ${id} with AI`);
        
        const optimizationResults = await aiService.optimizeSurvey({
          surveyId: id,
          currentQuestions: survey.questions,
          responseData: await analyticsService.getSurveyResponsePatterns(id)
        });

        if (optimizationResults.suggestions && optimizationResults.suggestions.length > 0) {
          updates.aiOptimizations = optimizationResults.suggestions;
          updates.metadata = {
            ...survey.metadata,
            lastOptimized: new Date(),
            optimizationScore: optimizationResults.score
          };
        }
      }

      // Update survey
      const updatedSurvey = await Survey.findByIdAndUpdate(
        id,
        {
          ...updates,
          'metadata.updatedAt': new Date(),
          'metadata.version': survey.metadata.version + 0.1
        },
        { new: true, runValidators: true }
      ).populate('questions');

      logger.info(`Survey updated successfully: ${id} by user: ${req.user.id}`);

      res.json({
        success: true,
        message: 'Survey updated successfully',
        data: {
          survey: updatedSurvey
        }
      });

    } catch (error) {
      logger.error('Update survey error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update survey',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Publish survey and activate data collection
   */
  static async publishSurvey(req, res) {
    try {
      const { id } = req.params;
      const { launchDate, expiryDate, targetChannels } = req.body;

      const survey = await Survey.findById(id).populate('questions');
      if (!survey) {
        return res.status(404).json({
          success: false,
          message: 'Survey not found'
        });
      }

      // Validation checks before publishing
      if (survey.questions.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Cannot publish survey without questions'
        });
      }

      // AI-powered pre-launch validation
      if (survey.aiEnabled) {
        const validationResults = await validationService.validateSurveyForLaunch(id);
        if (!validationResults.isValid) {
          return res.status(400).json({
            success: false,
            message: 'Survey validation failed',
            issues: validationResults.issues
          });
        }
      }

      // Update survey status
      survey.metadata.status = 'published';
      survey.metadata.publishedAt = launchDate || new Date();
      survey.metadata.expiryDate = expiryDate;
      survey.deliveryChannels = targetChannels || survey.deliveryChannels;

      await survey.save();

      // Initialize multi-channel deployment
      if (targetChannels && targetChannels.includes('whatsapp')) {
        await require('../services/whatsappService').deploySurvey(id);
      }
      
      if (targetChannels && targetChannels.includes('sms')) {
        await require('../services/smsService').deploySurvey(id);
      }

      logger.info(`Survey published successfully: ${id} by user: ${req.user.id}`);

      res.json({
        success: true,
        message: 'Survey published successfully',
        data: {
          survey,
          deploymentChannels: targetChannels || survey.deliveryChannels
        }
      });

    } catch (error) {
      logger.error('Publish survey error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to publish survey',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Delete survey (soft delete)
   */
  static async deleteSurvey(req, res) {
    try {
      const { id } = req.params;

      const survey = await Survey.findById(id);
      if (!survey) {
        return res.status(404).json({
          success: false,
          message: 'Survey not found'
        });
      }

      // Check permissions
      if (req.user.role !== 'admin' && 
          survey.createdBy.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      // Check if survey has responses
      const responseCount = await Response.countDocuments({ surveyId: id });
      if (responseCount > 0) {
        // Soft delete to preserve data integrity
        survey.metadata.status = 'deleted';
        survey.metadata.deletedAt = new Date();
        await survey.save();
        
        logger.info(`Survey soft deleted (has responses): ${id} by user: ${req.user.id}`);
      } else {
        // Hard delete if no responses
        await Survey.findByIdAndDelete(id);
        await Question.deleteMany({ surveyId: id });
        
        logger.info(`Survey hard deleted (no responses): ${id} by user: ${req.user.id}`);
      }

      res.json({
        success: true,
        message: 'Survey deleted successfully',
        data: {
          responseCount,
          deletionType: responseCount > 0 ? 'soft' : 'hard'
        }
      });

    } catch (error) {
      logger.error('Delete survey error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete survey',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Generate survey preview with AI insights
   */
  static async generateSurveyPreview(req, res) {
    try {
      const { id } = req.params;
      const { language = 'en', channel = 'web' } = req.query;

      const survey = await Survey.findById(id)
        .populate('questions')
        .populate('createdBy', 'name');

      if (!survey) {
        return res.status(404).json({
          success: false,
          message: 'Survey not found'
        });
      }

      // Generate preview based on channel
      let preview = {
        survey: {
          title: survey.title,
          description: survey.description,
          estimatedTime: await aiService.estimateSurveyTime(survey.questions),
          totalQuestions: survey.questions.length
        },
        questions: survey.questions,
        metadata: {
          language,
          channel,
          generatedAt: new Date(),
          version: survey.metadata.version
        }
      };

      // Apply language translations if available
      if (language !== 'en' && survey.languages.includes(language)) {
        preview = await nlpService.translateSurveyPreview(preview, language);
      }

      // Channel-specific formatting
      if (channel === 'whatsapp') {
        preview = await require('../services/whatsappService').formatForWhatsApp(preview);
      } else if (channel === 'sms') {
        preview = await require('../services/smsService').formatForSMS(preview);
      }

      res.json({
        success: true,
        data: {
          preview
        }
      });

    } catch (error) {
      logger.error('Generate survey preview error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate survey preview',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Get survey analytics and insights
   */
  static async getSurveyAnalytics(req, res) {
    try {
      const { id } = req.params;
      const { period = '7d', includeAI = true } = req.query;

      const survey = await Survey.findById(id);
      if (!survey) {
        return res.status(404).json({
          success: false,
          message: 'Survey not found'
        });
      }

      // Get comprehensive analytics
      const analytics = await analyticsService.getComprehensiveAnalytics({
        surveyId: id,
        period,
        includeAI: includeAI === 'true'
      });

      // AI-powered insights if enabled
      if (survey.aiEnabled && includeAI === 'true') {
        const insights = await aiService.generateSurveyInsights({
          surveyId: id,
          analyticsData: analytics,
          responseData: await Response.find({ surveyId: id }).limit(1000)
        });
        
        analytics.aiInsights = insights;
      }

      res.json({
        success: true,
        data: {
          analytics
        }
      });

    } catch (error) {
      logger.error('Get survey analytics error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch survey analytics',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
}

module.exports = SurveyController;
