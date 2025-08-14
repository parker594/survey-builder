/**
 * Survey Builder Component - Smart Survey Tool
 * AI-Powered Drag & Drop Survey Builder
 * Government of India - Ministry of Statistics and Programme Implementation
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Alert,
  Tooltip,
  CircularProgress,
  Fab
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIcon,
  Psychology as AIIcon,
  Preview as PreviewIcon,
  Save as SaveIcon,
  Publish as PublishIcon,
  Settings as SettingsIcon,
  Translate as TranslateIcon,
  SmartToy as SmartToyIcon
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useSnackbar } from 'notistack';

import { useSurvey } from '../../context/SurveyContext';
import { useAuth } from '../../context/AuthContext';
import AIAssistant from '../ai/AIAssistant';
import QuestionEditor from './QuestionEditor';
import ConditionalLogicEditor from './ConditionalLogicEditor';
import SurveyPreview from './SurveyPreview';
import { surveyAPI, aiAPI } from '../../services/api';

const SurveyBuilder = ({ surveyId, onSave, onPublish }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();
  const { currentSurvey, updateSurvey } = useSurvey();

  // Component state
  const [survey, setSurvey] = useState({
    title: '',
    description: '',
    category: 'census',
    targetAudience: 'general_public',
    languages: ['en', 'hi'],
    deliveryChannels: ['web'],
    aiEnabled: true,
    questions: [],
    conditionalLogic: [],
    metadata: {
      status: 'draft',
      estimatedTime: 0
    }
  });

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [aiGenerating, setAIGenerating] = useState(false);

  // Question types available for creation
  const questionTypes = [
    { value: 'text', label: 'Text Input', icon: '📝' },
    { value: 'multiple_choice', label: 'Multiple Choice', icon: '🔘' },
    { value: 'rating', label: 'Rating Scale', icon: '⭐' },
    { value: 'number', label: 'Number Input', icon: '🔢' },
    { value: 'date', label: 'Date Picker', icon: '📅' },
    { value: 'boolean', label: 'Yes/No', icon: '✅' },
    { value: 'dropdown', label: 'Dropdown', icon: '📋' },
    { value: 'matrix', label: 'Matrix/Grid', icon: '📊' }
  ];

  // Survey categories
  const categories = [
    'census', 'economic', 'social', 'health', 'education', 
    'agriculture', 'employment', 'infrastructure', 'environment', 'other'
  ];

  // Target audiences
  const audiences = [
    'general_public', 'rural_population', 'urban_population', 
    'farmers', 'entrepreneurs', 'students', 'government_employees', 
    'healthcare_workers', 'teachers'
  ];

  // Survey creation steps
  const steps = [
    'Basic Information',
    'Question Design',
    'AI Configuration',
    'Logic & Flow',
    'Preview & Publish'
  ];

  // Load existing survey if editing
  useEffect(() => {
    if (surveyId) {
      loadSurvey(surveyId);
    }
  }, [surveyId]);

  // Auto-save functionality
  useEffect(() => {
    const autoSaveTimer = setTimeout(() => {
      if (survey.title && survey.questions.length > 0 && !saving) {
        handleAutoSave();
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearTimeout(autoSaveTimer);
  }, [survey, saving]);

  const loadSurvey = async (id) => {
    try {
      setLoading(true);
      const response = await surveyAPI.getSurvey(id);
      if (response.data.success) {
        setSurvey(response.data.data.survey);
        updateSurvey(response.data.data.survey);
      }
    } catch (error) {
      enqueueSnackbar('Failed to load survey', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAutoSave = async () => {
    try {
      setSaving(true);
      if (surveyId) {
        await surveyAPI.updateSurvey(surveyId, survey);
      } else {
        const response = await surveyAPI.createSurvey(survey);
        if (response.data.success && !surveyId) {
          // New survey created, update URL
          window.history.replaceState(null, '', `/surveys/${response.data.data.survey._id}/edit`);
        }
      }
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleSurveyInfoChange = (field, value) => {
    setSurvey(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddQuestion = (type = 'text') => {
    const newQuestion = {
      id: `q_${Date.now()}`,
      type,
      text: '',
      description: '',
      required: false,
      options: type === 'multiple_choice' || type === 'dropdown' ? [''] : [],
      validation: {},
      order: survey.questions.length + 1,
      aiGenerated: false,
      translations: {}
    };

    setSurvey(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));

    setSelectedQuestion(newQuestion.id);
  };

  const handleUpdateQuestion = (questionId, updates) => {
    setSurvey(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId ? { ...q, ...updates } : q
      )
    }));
  };

  const handleDeleteQuestion = (questionId) => {
    setSurvey(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId),
      conditionalLogic: prev.conditionalLogic.filter(logic => 
        logic.questionId !== questionId && logic.targetQuestionId !== questionId
      )
    }));
    
    if (selectedQuestion === questionId) {
      setSelectedQuestion(null);
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(survey.questions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order numbers
    const reorderedQuestions = items.map((q, index) => ({
      ...q,
      order: index + 1
    }));

    setSurvey(prev => ({
      ...prev,
      questions: reorderedQuestions
    }));
  };

  const handleAIGeneration = async (prompts) => {
    try {
      setAIGenerating(true);
      enqueueSnackbar('AI is generating questions...', { variant: 'info' });

      const response = await aiAPI.generateQuestions({
        prompts: Array.isArray(prompts) ? prompts : [prompts],
        category: survey.category,
        targetAudience: survey.targetAudience,
        language: survey.languages[0] || 'en',
        questionCount: 10
      });

      if (response.data.success) {
        const aiQuestions = response.data.data.questions.map((q, index) => ({
          ...q,
          id: `ai_q_${Date.now()}_${index}`,
          order: survey.questions.length + index + 1,
          aiGenerated: true
        }));

        setSurvey(prev => ({
          ...prev,
          questions: [...prev.questions, ...aiQuestions]
        }));

        enqueueSnackbar(`Generated ${aiQuestions.length} AI questions`, { 
          variant: 'success' 
        });
      }
    } catch (error) {
      enqueueSnackbar('AI question generation failed', { variant: 'error' });
    } finally {
      setAIGenerating(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      if (!survey.title.trim()) {
        enqueueSnackbar('Survey title is required', { variant: 'error' });
        return;
      }

      if (survey.questions.length === 0) {
        enqueueSnackbar('Add at least one question', { variant: 'error' });
        return;
      }

      let response;
      if (surveyId) {
        response = await surveyAPI.updateSurvey(surveyId, survey);
      } else {
        response = await surveyAPI.createSurvey(survey);
      }

      if (response.data.success) {
        enqueueSnackbar('Survey saved successfully', { variant: 'success' });
        updateSurvey(response.data.data.survey);
        onSave && onSave(response.data.data.survey);
      }
    } catch (error) {
      enqueueSnackbar('Failed to save survey', { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    try {
      if (!surveyId) {
        enqueueSnackbar('Please save the survey first', { variant: 'error' });
        return;
      }

      const response = await surveyAPI.publishSurvey(surveyId, {
        targetChannels: survey.deliveryChannels,
        launchDate: new Date()
      });

      if (response.data.success) {
        enqueueSnackbar('Survey published successfully', { variant: 'success' });
        setSurvey(prev => ({
          ...prev,
          metadata: { ...prev.metadata, status: 'published' }
        }));
        onPublish && onPublish(response.data.data.survey);
      }
    } catch (error) {
      enqueueSnackbar('Failed to publish survey', { variant: 'error' });
    }
  };

  const renderBasicInformation = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Survey Title"
          value={survey.title}
          onChange={(e) => handleSurveyInfoChange('title', e.target.value)}
          required
          variant="outlined"
          placeholder="Enter a clear, descriptive title for your survey"
        />
      </Grid>
      
      <Grid item xs={12}>
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Survey Description"
          value={survey.description}
          onChange={(e) => handleSurveyInfoChange('description', e.target.value)}
          variant="outlined"
          placeholder="Describe the purpose and scope of this survey"
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <FormControl fullWidth variant="outlined">
          <InputLabel>Category</InputLabel>
          <Select
            value={survey.category}
            onChange={(e) => handleSurveyInfoChange('category', e.target.value)}
            label="Category"
          >
            {categories.map(cat => (
              <MenuItem key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1).replace('_', ' ')}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} md={6}>
        <FormControl fullWidth variant="outlined">
          <InputLabel>Target Audience</InputLabel>
          <Select
            value={survey.targetAudience}
            onChange={(e) => handleSurveyInfoChange('targetAudience', e.target.value)}
            label="Target Audience"
          >
            {audiences.map(audience => (
              <MenuItem key={audience} value={audience}>
                {audience.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Switch
              checked={survey.aiEnabled}
              onChange={(e) => handleSurveyInfoChange('aiEnabled', e.target.checked)}
              color="primary"
            />
          }
          label="Enable AI-Powered Features"
        />
        <Typography variant="caption" color="textSecondary" display="block">
          AI will help generate questions, validate responses, and provide insights
        </Typography>
      </Grid>
    </Grid>
  );

  const renderQuestionDesign = () => (
    <Box>
      {/* Question Creation Toolbar */}
      <Card sx={{ mb: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="h6" display="flex" alignItems="center">
              <SmartToyIcon sx={{ mr: 1 }} />
              Question Design Studio
            </Typography>
            
            <Box>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<AIIcon />}
                onClick={() => setShowAIAssistant(true)}
                disabled={aiGenerating}
                sx={{ mr: 1 }}
              >
                {aiGenerating ? <CircularProgress size={20} /> : 'AI Assistant'}
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<PreviewIcon />}
                onClick={() => setShowPreview(true)}
                sx={{ color: 'white', borderColor: 'white' }}
              >
                Preview
              </Button>
            </Box>
          </Box>

          <Box display="flex" flexWrap="wrap" gap={1}>
            {questionTypes.map(type => (
              <Button
                key={type.value}
                variant="outlined"
                size="small"
                onClick={() => handleAddQuestion(type.value)}
                startIcon={<span>{type.icon}</span>}
                sx={{ color: 'white', borderColor: 'white' }}
              >
                {type.label}
              </Button>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Questions List */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="questions">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {survey.questions.map((question, index) => (
                <Draggable key={question.id} draggableId={question.id} index={index}>
                  {(provided, snapshot) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      sx={{
                        mb: 2,
                        opacity: snapshot.isDragging ? 0.8 : 1,
                        transform: snapshot.isDragging ? 'rotate(3deg)' : 'none',
                        border: selectedQuestion === question.id ? '2px solid' : '1px solid',
                        borderColor: selectedQuestion === question.id ? 'primary.main' : 'divider'
                      }}
                      onClick={() => setSelectedQuestion(question.id)}
                    >
                      <CardContent>
                        <Box display="flex" alignItems="flex-start">
                          <IconButton
                            {...provided.dragHandleProps}
                            size="small"
                            sx={{ mt: -1, mr: 1, cursor: 'grab' }}
                          >
                            <DragIcon />
                          </IconButton>
                          
                          <Box flexGrow={1}>
                            <Box display="flex" alignItems="center" mb={1}>
                              <Typography variant="subtitle2" sx={{ mr: 1 }}>
                                Q{question.order}: {questionTypes.find(t => t.value === question.type)?.label}
                              </Typography>
                              
                              {question.aiGenerated && (
                                <Chip
                                  icon={<AIIcon />}
                                  label="AI Generated"
                                  size="small"
                                  color="secondary"
                                  variant="outlined"
                                />
                              )}
                              
                              {question.required && (
                                <Chip label="Required" size="small" color="error" variant="outlined" sx={{ ml: 1 }} />
                              )}
                            </Box>
                            
                            <Typography variant="body1" sx={{ mb: 1 }}>
                              {question.text || <em>Click to edit question text</em>}
                            </Typography>
                            
                            {question.description && (
                              <Typography variant="body2" color="textSecondary">
                                {question.description}
                              </Typography>
                            )}
                            
                            {question.options && question.options.length > 0 && (
                              <Box mt={1}>
                                {question.options.slice(0, 3).map((option, idx) => (
                                  <Chip
                                    key={idx}
                                    label={option || `Option ${idx + 1}`}
                                    size="small"
                                    variant="outlined"
                                    sx={{ mr: 0.5, mb: 0.5 }}
                                  />
                                ))}
                                {question.options.length > 3 && (
                                  <Chip label={`+${question.options.length - 3} more`} size="small" />
                                )}
                              </Box>
                            )}
                          </Box>
                          
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteQuestion(question.id);
                            }}
                            size="small"
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  )}
                </Draggable>
              ))}