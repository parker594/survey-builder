/**
 * Smart Survey Tool - Frontend Application
 * Government of India - Ministry of Statistics and Programme Implementation
 * AI-Powered Survey Data Collection System
 */

import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { SurveyProvider } from './context/SurveyContext';
import { ThemeContextProvider } from './context/ThemeContext';

// Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Loading from './components/common/Loading';
import ErrorBoundary from './components/common/ErrorBoundary';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Lazy loaded pages for better performance
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./components/auth/Login'));
const Register = lazy(() => import('./components/auth/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const SurveyCreate = lazy(() => import('./pages/SurveyCreate'));
const SurveyList = lazy(() => import('./pages/SurveyList'));
const SurveyTake = lazy(() => import('./pages/SurveyTake'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));

// Custom theme for Government of India styling
const theme = createTheme({
  palette: {
    primary: {
      main: '#FF7F00', // India Saffron
      light: '#FFB347',
      dark: '#CC5500',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#128807', // India Green
      light: '#4CAF50',
      dark: '#0D5D03',
      contrastText: '#FFFFFF',
    },
    tertiary: {
      main: '#000080', // Navy Blue for Ashoka Chakra
      light: '#4169E1',
      dark: '#000066',
    },
    background: {
      default: '#FAFAFA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
    success: {
      main: '#4CAF50',
    },
    warning: {
      main: '#FF9800',
    },
    error: {
      main: '#F44336',
    },
    info: {
      main: '#2196F3',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
      fontSize: '2.5rem',
      color: '#212121',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      color: '#212121',
    },
    h3: {
      fontWeight: 500,
      fontSize: '1.5rem',
      color: '#212121',
    },
    h4: {
      fontWeight: 500,
      fontSize: '1.25rem',
      color: '#212121',
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.1rem',
      color: '#212121',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1rem',
      color: '#212121',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
          padding: '10px 24px',
          fontWeight: 500,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          },
        },
        contained: {
          background: 'linear-gradient(45deg, #FF7F00 30%, #FFB347 90%)',
          color: '#FFFFFF',
          '&:hover': {
            background: 'linear-gradient(45deg, #CC5500 30%, #FF7F00 90%)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          border: '1px solid #E0E0E0',
          '&:hover': {
            boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(90deg, #FF7F00 0%, #128807 50%, #000080 100%)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

// Main App Component
function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ThemeContextProvider>
          <AuthProvider>
            <Survey
