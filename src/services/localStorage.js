// Local Storage Service for RecoverWise - Enhanced for Dynamic User Management
const STORAGE_KEYS = {
  CURRENT_USER: 'recoverwise_current_user',
  USERS: 'recoverwise_users',
  CONSUMPTION_LOGS: 'recoverwise_consumption_logs',
  JOURNAL_ENTRIES: 'recoverwise_journal_entries',
  USER_ACTIVITIES: 'recoverwise_user_activities',
  HABIT_REPLACEMENTS: 'recoverwise_habit_replacements',
  CRISIS_EVENTS: 'recoverwise_crisis_events'
}

// Utility functions
const getFromStorage = (key, defaultValue = []) => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error(`Error reading from localStorage key ${key}:`, error)
    return defaultValue
  }
}

const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
    return true
  } catch (error) {
    console.error(`Error saving to localStorage key ${key}:`, error)
    return false
  }
}

// User Management
export const userStorage = {
  // Save a new user
  saveUser: (user) => {
    const users = getFromStorage(STORAGE_KEYS.USERS, [])
    const existingIndex = users.findIndex(u => u.id === user.id)
    
    if (existingIndex >= 0) {
      users[existingIndex] = user
    } else {
      users.push(user)
    }
    
    saveToStorage(STORAGE_KEYS.USERS, users)
    saveToStorage(STORAGE_KEYS.CURRENT_USER, user)
    return user
  },

  // Update existing user
  updateUser: (updatedUser) => {
    const users = getFromStorage(STORAGE_KEYS.USERS, [])
    const userIndex = users.findIndex(u => u.id === updatedUser.id)
    
    if (userIndex >= 0) {
      users[userIndex] = updatedUser
      saveToStorage(STORAGE_KEYS.USERS, users)
      saveToStorage(STORAGE_KEYS.CURRENT_USER, updatedUser)
      return updatedUser
    }
    return null
  },

  // Get current user
  getCurrentUser: () => {
    return getFromStorage(STORAGE_KEYS.CURRENT_USER, null)
  },

  // Get all users
  getAllUsers: () => {
    return getFromStorage(STORAGE_KEYS.USERS, [])
  },

  // Clear all user data
  clearAllData: () => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key)
    })
  }
}

// Consumption Logging
export const consumptionStorage = {
  // Add consumption log
  addConsumptionLog: (log) => {
    const logs = getFromStorage(STORAGE_KEYS.CONSUMPTION_LOGS, [])
    
    // Check if log for this date already exists
    const existingIndex = logs.findIndex(l => l.date === log.date && l.userId === log.userId)
    
    if (existingIndex >= 0) {
      logs[existingIndex] = log
    } else {
      logs.push(log)
    }
    
    // Sort by date (newest first)
    logs.sort((a, b) => new Date(b.date) - new Date(a.date))
    
    saveToStorage(STORAGE_KEYS.CONSUMPTION_LOGS, logs)
    return log
  },

  // Get consumption logs for a user
  getConsumptionLogs: (days = 30, userId = null) => {
    const currentUser = userId || userStorage.getCurrentUser()?.id
    if (!currentUser) return []
    
    const logs = getFromStorage(STORAGE_KEYS.CONSUMPTION_LOGS, [])
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)
    
    return logs
      .filter(log => log.userId === currentUser)
      .filter(log => new Date(log.date) >= cutoffDate)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  },

  // Get consumption statistics
  getConsumptionStats: (days = 30, userId = null) => {
    const logs = consumptionStorage.getConsumptionLogs(days, userId)
    
    if (logs.length === 0) {
      return {
        totalDrinks: 0,
        averageDrinks: 0,
        daysLogged: 0,
        soberDays: 0,
        heaviestDay: 0,
        currentStreak: 0
      }
    }
    
    const totalDrinks = logs.reduce((sum, log) => sum + log.drinksConsumed, 0)
    const soberDays = logs.filter(log => log.drinksConsumed === 0).length
    const heaviestDay = Math.max(...logs.map(log => log.drinksConsumed))
    
    // Calculate current streak
    let currentStreak = 0
    const today = new Date()
    for (let i = 0; i < days; i++) {
      const checkDate = new Date(today)
      checkDate.setDate(today.getDate() - i)
      const dateStr = checkDate.toISOString().split('T')[0]
      
      const dayLog = logs.find(log => log.date === dateStr)
      if (dayLog && dayLog.drinksConsumed === 0) {
        currentStreak++
      } else if (dayLog && dayLog.drinksConsumed > 0) {
        break
      }
    }
    
    return {
      totalDrinks,
      averageDrinks: totalDrinks / logs.length,
      daysLogged: logs.length,
      soberDays,
      heaviestDay,
      currentStreak
    }
  }
}

// Journal Management
export const journalStorage = {
  // Add journal entry
  addJournalEntry: (entry) => {
    const entries = getFromStorage(STORAGE_KEYS.JOURNAL_ENTRIES, [])
    entries.push(entry)
    
    // Sort by creation date (newest first)
    entries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    
    saveToStorage(STORAGE_KEYS.JOURNAL_ENTRIES, entries)
    return entry
  },

  // Get journal entries for a user
  getJournalEntries: (days = 30, userId = null) => {
    const currentUser = userId || userStorage.getCurrentUser()?.id
    if (!currentUser) return []
    
    const entries = getFromStorage(STORAGE_KEYS.JOURNAL_ENTRIES, [])
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)
    
    return entries
      .filter(entry => entry.userId === currentUser)
      .filter(entry => new Date(entry.createdAt) >= cutoffDate)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  },

  // Update journal entry
  updateJournalEntry: (entryId, updatedEntry) => {
    const entries = getFromStorage(STORAGE_KEYS.JOURNAL_ENTRIES, [])
    const entryIndex = entries.findIndex(e => e.id === entryId)
    
    if (entryIndex >= 0) {
      entries[entryIndex] = { ...entries[entryIndex], ...updatedEntry }
      saveToStorage(STORAGE_KEYS.JOURNAL_ENTRIES, entries)
      return entries[entryIndex]
    }
    return null
  },

  // Delete journal entry
  deleteJournalEntry: (entryId) => {
    const entries = getFromStorage(STORAGE_KEYS.JOURNAL_ENTRIES, [])
    const filteredEntries = entries.filter(e => e.id !== entryId)
    saveToStorage(STORAGE_KEYS.JOURNAL_ENTRIES, filteredEntries)
    return true
  }
}

// Habit Activities Management
export const habitStorage = {
  // Add user activity
  addUserActivity: (activity) => {
    const activities = getFromStorage(STORAGE_KEYS.USER_ACTIVITIES, [])
    activities.push(activity)
    
    // Sort by creation date (newest first)
    activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    
    saveToStorage(STORAGE_KEYS.USER_ACTIVITIES, activities)
    return activity
  },

  // Get user activities
  getUserActivities: (days = 30, userId = null) => {
    const currentUser = userId || userStorage.getCurrentUser()?.id
    if (!currentUser) return []
    
    const activities = getFromStorage(STORAGE_KEYS.USER_ACTIVITIES, [])
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)
    
    return activities
      .filter(activity => activity.userId === currentUser)
      .filter(activity => new Date(activity.createdAt) >= cutoffDate)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  },

  // Get habit replacement suggestions
  getHabitReplacements: () => {
    const defaultReplacements = [
      {
        id: '1',
        name: 'Take a 10-minute walk',
        category: 'physical',
        description: 'Fresh air and movement can help reduce cravings',
        effectiveness: 8
      },
      {
        id: '2',
        name: 'Call a friend or family member',
        category: 'social',
        description: 'Social connection provides emotional support',
        effectiveness: 9
      },
      {
        id: '3',
        name: 'Practice deep breathing',
        category: 'mindfulness',
        description: '5 minutes of focused breathing to calm the mind',
        effectiveness: 7
      },
      {
        id: '4',
        name: 'Drink a glass of water or herbal tea',
        category: 'self-care',
        description: 'Hydration and ritual replacement',
        effectiveness: 6
      },
      {
        id: '5',
        name: 'Write in your journal',
        category: 'creative',
        description: 'Process emotions and thoughts through writing',
        effectiveness: 8
      },
      {
        id: '6',
        name: 'Listen to music or a podcast',
        category: 'creative',
        description: 'Engage your mind with audio content',
        effectiveness: 7
      },
      {
        id: '7',
        name: 'Do a quick workout or yoga',
        category: 'physical',
        description: 'Release endorphins naturally',
        effectiveness: 9
      },
      {
        id: '8',
        name: 'Take a hot shower or bath',
        category: 'self-care',
        description: 'Relaxation and self-care ritual',
        effectiveness: 8
      }
    ]
    
    return getFromStorage(STORAGE_KEYS.HABIT_REPLACEMENTS, defaultReplacements)
  },

  // Add custom habit replacement
  addHabitReplacement: (replacement) => {
    const replacements = habitStorage.getHabitReplacements()
    replacements.push(replacement)
    saveToStorage(STORAGE_KEYS.HABIT_REPLACEMENTS, replacements)
    return replacement
  }
}

// Crisis Events Management
export const crisisStorage = {
  // Add crisis event
  addCrisisEvent: (event) => {
    const events = getFromStorage(STORAGE_KEYS.CRISIS_EVENTS, [])
    events.push(event)
    
    // Sort by creation date (newest first)
    events.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    
    saveToStorage(STORAGE_KEYS.CRISIS_EVENTS, events)
    return event
  },

  // Get crisis events for a user
  getCrisisEvents: (days = 30, userId = null) => {
    const currentUser = userId || userStorage.getCurrentUser()?.id
    if (!currentUser) return []
    
    const events = getFromStorage(STORAGE_KEYS.CRISIS_EVENTS, [])
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)
    
    return events
      .filter(event => event.userId === currentUser)
      .filter(event => new Date(event.createdAt) >= cutoffDate)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }
}

// Data Export/Import
export const dataManagement = {
  // Export all user data
  exportUserData: (userId = null) => {
    const currentUser = userId || userStorage.getCurrentUser()?.id
    if (!currentUser) return null
    
    return {
      user: userStorage.getCurrentUser(),
      consumptionLogs: consumptionStorage.getConsumptionLogs(365, currentUser),
      journalEntries: journalStorage.getJournalEntries(365, currentUser),
      userActivities: habitStorage.getUserActivities(365, currentUser),
      crisisEvents: crisisStorage.getCrisisEvents(365, currentUser),
      exportDate: new Date().toISOString()
    }
  },

  // Get storage usage info
  getStorageInfo: () => {
    const info = {}
    Object.entries(STORAGE_KEYS).forEach(([key, storageKey]) => {
      const data = getFromStorage(storageKey, [])
      info[key] = {
        itemCount: Array.isArray(data) ? data.length : (data ? 1 : 0),
        sizeKB: Math.round(JSON.stringify(data).length / 1024 * 100) / 100
      }
    })
    return info
  }
}

// Initialize default data if needed
export const initializeDefaultData = () => {
  // Ensure habit replacements are available
  habitStorage.getHabitReplacements()
}

// Auto-initialize when module loads
initializeDefaultData()

