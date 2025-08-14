/**
 * AI Service - Smart Survey Tool
 * OpenAI GPT-4 Integration for Intelligent Survey Operations
 * Government of India - Ministry of Statistics and Programme Implementation
 */

const OpenAI = require('openai');
const logger = require('../utils/logger');
const { promisify } = require('util');
const redis = require('redis');

class AIService {
  constructor() {
    // Initialize OpenAI client
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Redis client for caching AI responses
    this.redisClient = redis.createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });
    
    this.redisClient.connect().catch(err => {
      logger.error('Redis connection failed:', err);
    });

    // System prompts for different AI operations
    this.systemPrompts = {
      questionGeneration: `You are an expert survey designer for the Government of India's Ministry of Statistics and Programme Implementation. 
      Generate high-quality, culturally appropriate survey questions that comply with Indian data collection standards and are suitable for diverse populations including rural and urban demographics.
      Ensure questions are clear, unbiased, and respect cultural sensitivities.`,
      
      responseValidation: `You are a data validation expert for government surveys in India. 
      Analyze responses for consistency, completeness, and quality. Flag potential issues while being sensitive to cultural context and language variations.`,
      
      insightGeneration: `You are a data analyst for government statistical operations in India. 
      Generate actionable insights from survey data that can inform policy decisions and program improvements.`
    };
  }

  /**
   * Generate intelligent survey questions based on prompts and context
   */
  async generateQuestions(params) {
    try {
      const { prompts, category, targetAudience, language = 'en', questionCount = 10 } = params;

      // Create cache key
      const cacheKey = `ai_questions:${JSON.stringify(params)}`;
      
      // Check cache first
      try {
        const cached = await this.redisClient.get(cacheKey);
        if (cached) {
          logger.info('Returning cached AI-generated questions');
          return JSON.parse(cached);
        }
      } catch (cacheError) {
        logger.warn('Cache read failed:', cacheError.message);
      }

      const prompt = `
Generate ${questionCount} survey questions for the following context:

Category: ${category}
Target Audience: ${targetAudience}
Language: ${language}
Context Prompts: ${Array.isArray(prompts) ? prompts.join(', ') : prompts}

Requirements:
1. Questions must be appropriate for Indian context and demographics
2. Include a mix of question types (multiple choice, text, rating scales)
3. Ensure cultural sensitivity and language accessibility
4. Include proper validation rules for each question
5. Consider rural and urban populations
6. Follow Government of India survey standards

For each question, provide:
- type: (text, multiple_choice, rating, number, date, boolean)
- text: The question text
- description: Helper text or context
- required: boolean indicating if mandatory
- options: array for multiple choice questions
- validation: object with validation rules
- translations: object with translations for other Indian languages
- confidence: AI confidence score (0-1)

Return as valid JSON array.`;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: this.systemPrompts.questionGeneration },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
        response_format: { type: "json_object" }
      });

      let generatedContent;
      try {
        const responseText = completion.choices[0].message.content;
        generatedContent = JSON.parse(responseText);
        
        // Ensure we have an array of questions
        if (!Array.isArray(generatedContent.questions)) {
          throw new Error('Invalid response format');
        }
      } catch (parseError) {
        logger.error('Failed to parse AI response:', parseError);
        throw new Error('Invalid AI response format');
      }

      const questions = generatedContent.questions.map((q, index) => ({
        type: q.type || 'text',
        text: q.text,
        description: q.description || '',
        required: q.required || false,
        options: q.options || [],
        validation: q.validation || {},
        translations: q.translations || {},
        confidence: q.confidence || 0.8,
        order: index + 1,
        metadata: {
          aiGenerated: true,
          generatedAt: new Date(),
          model: 'gpt-4',
          category,
          targetAudience
        }
      }));

      // Cache the results for 24 hours
      try {
        await this.redisClient.setex(cacheKey, 86400, JSON.stringify(questions));
      } catch (cacheError) {
        logger.warn('Cache write failed:', cacheError.message);
      }

      logger.info(`Generated ${questions.length} AI questions for category: ${category}`);
      return questions;

    } catch (error) {
      logger.error('AI question generation failed:', error);
      throw new Error(`AI question generation failed: ${error.message}`);
    }
  }

  /**
   * Validate survey responses using AI
   */
  async validateResponse(responseData, questionContext) {
    try {
      const prompt = `
Analyze this survey response for quality, consistency, and completeness:

Question: ${questionContext.text}
Question Type: ${questionContext.type}
Response: ${JSON.stringify(responseData.answer)}
Respondent Context: ${JSON.stringify(responseData.metadata || {})}

Check for:
1. Response relevance and appropriateness
2. Potential spam or low-quality responses
3. Inconsistencies or logical errors
4. Missing required information
5. Cultural appropriateness for Indian context

Return analysis as JSON with:
- isValid: boolean
- confidence: score 0-1
- issues: array of identified issues
- suggestions: array of improvement suggestions
- quality_score: overall quality rating 0-10
`;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: this.systemPrompts.responseValidation },
          { role: "user", content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 500,
        response_format: { type: "json_object" }
      });

      const validationResult = JSON.parse(completion.choices[0].message.content);

      logger.info(`AI response validation completed with confidence: ${validationResult.confidence}`);
      return validationResult;

    } catch (error) {
      logger.error('AI response validation failed:', error);
      return {
        isValid: true, // Default to valid if AI fails
        confidence: 0.5,
        issues: ['AI validation unavailable'],
        suggestions: [],
        quality_score: 5
      };
    }
  }

  /**
   * Generate adaptive follow-up questions based on responses
   */
  async generateAdaptiveQuestions(params) {
    try {
      const { previousResponses, surveyContext, currentQuestionIndex } = params;

      const prompt = `
Based on the following survey responses, generate 1-3 adaptive follow-up questions:

Survey Context: ${JSON.stringify(surveyContext)}
Previous Responses: ${JSON.stringify(previousResponses)}
Current Question Index: ${currentQuestionIndex}

Generate follow-up questions that:
1. Build upon previous responses
2. Explore interesting patterns or anomalies
3. Gather deeper insights
4. Maintain survey flow and respondent engagement
5. Are appropriate for Indian demographic context

Return as JSON array with same format as generateQuestions.
`;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: this.systemPrompts.questionGeneration },
          { role: "user", content: prompt }
        ],
        temperature: 0.8,
        max
