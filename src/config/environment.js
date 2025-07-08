// Environment configuration for API endpoints
// This allows the app to work with or without a backend

const config = {
  // Development environment
  development: {
    API_BASE_URL: 'http://localhost:5004/api',
    USE_LOCAL_STORAGE_ONLY: false
  },
  
  // Production environment (GitHub Pages + Railway)
  production: {
    API_BASE_URL: process.env.REACT_APP_API_URL || 'https://your-railway-app.railway.app/api',
    USE_LOCAL_STORAGE_ONLY: true // Privacy-first: use only local storage
  },
  
  // Local-only mode (no backend required)
  local: {
    API_BASE_URL: null,
    USE_LOCAL_STORAGE_ONLY: true
  }
}

// Determine current environment
const getEnvironment = () => {
  if (process.env.NODE_ENV === 'development') {
    return 'development'
  }
  
  // Check if we're running on GitHub Pages
  if (window.location.hostname.includes('github.io')) {
    return 'production'
  }
  
  // Default to local-only mode for privacy
  return 'local'
}

const currentEnv = getEnvironment()
const currentConfig = config[currentEnv]

export const API_BASE_URL = currentConfig.API_BASE_URL
export const USE_LOCAL_STORAGE_ONLY = currentConfig.USE_LOCAL_STORAGE_ONLY
export const ENVIRONMENT = currentEnv

export default currentConfig

