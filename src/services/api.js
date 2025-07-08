// API service functions for communicating with the backend
// Privacy-first: Uses local storage by default, backend is optional

import { API_BASE_URL, USE_LOCAL_STORAGE_ONLY } from '../config/environment.js'
import { 
  userStorage, 
  consumptionStorage, 
  habitStorage, 
  journalStorage, 
  crisisStorage 
} from './localStorage.js'

// Helper function to make API calls when backend is available
const makeApiCall = async (endpoint, options = {}) => {
  if (USE_LOCAL_STORAGE_ONLY || !API_BASE_URL) {
    // Return null to indicate local-only mode
    return null
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    })

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.warn('API call failed, falling back to local storage:', error.message)
    return null
  }
}

// User API functions
export const userApi = {
  async getUsers() {
    const apiResult = await makeApiCall('/users')
    if (apiResult) return apiResult
    
    // Fallback to local storage
    const currentUser = userStorage.getCurrentUser()
    return currentUser ? [currentUser] : []
  },

  async createUser(userData) {
    const apiResult = await makeApiCall('/users', {
      method: 'POST',
      body: JSON.stringify(userData)
    })
    if (apiResult) return apiResult
    
    // Fallback to local storage
    return userStorage.saveUser(userData)
  },

  async updateUser(userId, userData) {
    const apiResult = await makeApiCall(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    })
    if (apiResult) return apiResult
    
    // Fallback to local storage
    return userStorage.updateUser(userData)
  },

  async getUserProfile(userId) {
    const apiResult = await makeApiCall(`/users/${userId}/profile`)
    if (apiResult) return apiResult
    
    // Fallback to local storage
    return userStorage.getCurrentUser()
  }
}

// Consumption API functions
export const consumptionApi = {
  async getConsumptionLogs(userId, days = 30) {
    const apiResult = await makeApiCall(`/consumption?user_id=${userId}&days=${days}`)
    if (apiResult) return apiResult
    
    // Fallback to local storage
    return consumptionStorage.getConsumptionLogs(days)
  },

  async addConsumptionLog(logData) {
    const apiResult = await makeApiCall('/consumption', {
      method: 'POST',
      body: JSON.stringify(logData)
    })
    if (apiResult) return apiResult
    
    // Fallback to local storage
    return consumptionStorage.addConsumptionLog(logData)
  },

  async getConsumptionStats(userId, days = 30) {
    const apiResult = await makeApiCall(`/consumption/stats?user_id=${userId}&days=${days}`)
    if (apiResult) return apiResult
    
    // Fallback to local storage
    return consumptionStorage.getConsumptionStats(days)
  }
}

// Habits API functions
export const habitsApi = {
  async getHabitReplacements(category = null, drinkingType = null) {
    const apiResult = await makeApiCall(`/habits/replacements?category=${category || ''}&drinking_type=${drinkingType || ''}`)
    if (apiResult) return apiResult
    
    // Fallback to local storage
    return habitStorage.getHabitReplacements(category, drinkingType)
  },

  async addUserActivity(activityData) {
    const apiResult = await makeApiCall('/habits/activities', {
      method: 'POST',
      body: JSON.stringify(activityData)
    })
    if (apiResult) return apiResult
    
    // Fallback to local storage
    return habitStorage.addUserActivity(activityData)
  },

  async getHabitEffectiveness(userId, days = 30) {
    const apiResult = await makeApiCall(`/habits/effectiveness?user_id=${userId}&days=${days}`)
    if (apiResult) return apiResult
    
    // Fallback to local storage
    return habitStorage.getHabitEffectiveness(days)
  }
}

// Journal API functions
export const journalApi = {
  async getJournalEntries(userId, days = 30) {
    const apiResult = await makeApiCall(`/journal?user_id=${userId}&days=${days}`)
    if (apiResult) return apiResult
    
    // Fallback to local storage
    return journalStorage.getJournalEntries(days)
  },

  async addJournalEntry(entryData) {
    const apiResult = await makeApiCall('/journal', {
      method: 'POST',
      body: JSON.stringify(entryData)
    })
    if (apiResult) return apiResult
    
    // Fallback to local storage
    return journalStorage.addJournalEntry(entryData)
  }
}

// Crisis API functions
export const crisisApi = {
  async getCrisisEvents(userId, days = 30) {
    const apiResult = await makeApiCall(`/crisis-events?user_id=${userId}&days=${days}`)
    if (apiResult) return apiResult
    
    // Fallback to local storage
    return crisisStorage.getCrisisEvents(days)
  },

  async addCrisisEvent(eventData) {
    const apiResult = await makeApiCall('/crisis-events', {
      method: 'POST',
      body: JSON.stringify(eventData)
    })
    if (apiResult) return apiResult
    
    // Fallback to local storage
    return crisisStorage.addCrisisEvent(eventData)
  },

  async getCrisisStats(userId, days = 30) {
    const apiResult = await makeApiCall(`/crisis-events/stats?user_id=${userId}&days=${days}`)
    if (apiResult) return apiResult
    
    // Fallback to local storage
    return crisisStorage.getCrisisStats(days)
  }
}

// Health check function
export const healthCheck = async () => {
  if (USE_LOCAL_STORAGE_ONLY || !API_BASE_URL) {
    return { status: 'local-only', message: 'Running in privacy mode with local storage only' }
  }

  try {
    const response = await fetch(`${API_BASE_URL}/health`)
    if (response.ok) {
      return { status: 'connected', message: 'Backend API is available' }
    }
  } catch (error) {
    console.warn('Backend not available, using local storage only')
  }
  
  return { status: 'local-fallback', message: 'Backend unavailable, using local storage' }
}

