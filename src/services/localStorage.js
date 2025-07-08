// Local Storage Service for RecoverWise
// Provides complete data persistence using browser localStorage for privacy

const STORAGE_KEYS = {
  USER: 'recoverwise_user',
  CONSUMPTION_LOGS: 'recoverwise_consumption_logs',
  HABIT_REPLACEMENTS: 'recoverwise_habit_replacements',
  USER_ACTIVITIES: 'recoverwise_user_activities',
  JOURNAL_ENTRIES: 'recoverwise_journal_entries',
  CRISIS_EVENTS: 'recoverwise_crisis_events',
  APP_SETTINGS: 'recoverwise_app_settings'
}

// Utility functions
const generateId = () => Date.now() + Math.random().toString(36).substr(2, 9)
const getCurrentDate = () => new Date().toISOString().split('T')[0]
const getCurrentDateTime = () => new Date().toISOString()

// Calculate WHO risk level based on drinks per day and gender
const calculateWHORiskLevel = (drinksPerDay, gender) => {
  if (gender === 'female') {
    if (drinksPerDay <= 1) return 'low'
    if (drinksPerDay <= 2) return 'medium'
    if (drinksPerDay <= 4) return 'high'
    return 'very_high'
  } else {
    if (drinksPerDay <= 2) return 'low'
    if (drinksPerDay <= 3) return 'medium'
    if (drinksPerDay <= 6) return 'high'
    return 'very_high'
  }
}

// Base storage operations
const getFromStorage = (key, defaultValue = null) => {
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

// Initialize default habit replacements
const initializeHabitReplacements = () => {
  const existingHabits = getFromStorage(STORAGE_KEYS.HABIT_REPLACEMENTS, [])
  if (existingHabits.length === 0) {
    const defaultHabits = [
      {
        id: generateId(),
        title: "Deep Breathing Exercise",
        description: "Practice 4-7-8 breathing technique to reduce stress and anxiety",
        category: "stress_relief",
        drinking_types: ["stress", "emotional"],
        duration_minutes: 5,
        difficulty_level: 1,
        location_required: "anywhere",
        equipment_needed: [],
        instructions: "Inhale for 4 counts, hold for 7 counts, exhale for 8 counts. Repeat 4 times.",
        is_active: true,
        created_at: getCurrentDateTime()
      },
      {
        id: generateId(),
        title: "10-Minute Walk",
        description: "Take a brisk walk around the block or in nature",
        category: "physical",
        drinking_types: ["stress", "boredom", "habit"],
        duration_minutes: 10,
        difficulty_level: 2,
        location_required: "outdoors",
        equipment_needed: ["comfortable shoes"],
        instructions: "Put on comfortable shoes and walk at a moderate pace for 10 minutes. Focus on your surroundings and breathing.",
        is_active: true,
        created_at: getCurrentDateTime()
      },
      {
        id: generateId(),
        title: "Mindful Tea Ceremony",
        description: "Prepare and mindfully drink herbal tea as a replacement ritual",
        category: "mindfulness",
        drinking_types: ["habit", "social", "stress"],
        duration_minutes: 15,
        difficulty_level: 1,
        location_required: "home",
        equipment_needed: ["herbal tea", "favorite mug"],
        instructions: "Choose a calming herbal tea. Focus on the preparation process, the aroma, and taste. Drink slowly and mindfully.",
        is_active: true,
        created_at: getCurrentDateTime()
      },
      {
        id: generateId(),
        title: "Gratitude Journaling",
        description: "Write down three things you're grateful for today",
        category: "creative",
        drinking_types: ["emotional", "stress", "boredom"],
        duration_minutes: 10,
        difficulty_level: 1,
        location_required: "anywhere",
        equipment_needed: ["journal", "pen"],
        instructions: "Write down three specific things you're grateful for today. Include why each one matters to you.",
        is_active: true,
        created_at: getCurrentDateTime()
      },
      {
        id: generateId(),
        title: "Progressive Muscle Relaxation",
        description: "Systematically tense and relax muscle groups to reduce physical tension",
        category: "stress_relief",
        drinking_types: ["stress", "emotional"],
        duration_minutes: 20,
        difficulty_level: 2,
        location_required: "quiet space",
        equipment_needed: ["comfortable surface"],
        instructions: "Start with your toes, tense for 5 seconds, then relax. Work your way up through each muscle group.",
        is_active: true,
        created_at: getCurrentDateTime()
      },
      {
        id: generateId(),
        title: "Call a Friend",
        description: "Reach out to a supportive friend or family member",
        category: "social",
        drinking_types: ["social", "emotional", "boredom"],
        duration_minutes: 15,
        difficulty_level: 1,
        location_required: "anywhere",
        equipment_needed: ["phone"],
        instructions: "Call someone who makes you feel good. Share something positive or ask about their day.",
        is_active: true,
        created_at: getCurrentDateTime()
      },
      {
        id: generateId(),
        title: "Creative Drawing",
        description: "Express yourself through simple drawing or doodling",
        category: "creative",
        drinking_types: ["boredom", "emotional", "stress"],
        duration_minutes: 20,
        difficulty_level: 2,
        location_required: "anywhere",
        equipment_needed: ["paper", "pencil or pen"],
        instructions: "Draw whatever comes to mind. Don't worry about skill - focus on the process and expression.",
        is_active: true,
        created_at: getCurrentDateTime()
      },
      {
        id: generateId(),
        title: "Hydration Break",
        description: "Drink a large glass of water with lemon or cucumber",
        category: "physical",
        drinking_types: ["habit", "boredom"],
        duration_minutes: 5,
        difficulty_level: 1,
        location_required: "anywhere",
        equipment_needed: ["water", "lemon or cucumber"],
        instructions: "Prepare a large glass of water with fresh lemon or cucumber. Drink slowly and mindfully.",
        is_active: true,
        created_at: getCurrentDateTime()
      }
    ]
    saveToStorage(STORAGE_KEYS.HABIT_REPLACEMENTS, defaultHabits)
  }
}

// User Management
export const userStorage = {
  // Get current user
  getCurrentUser: () => {
    return getFromStorage(STORAGE_KEYS.USER)
  },

  // Create or update user
  saveUser: (userData) => {
    const existingUser = getFromStorage(STORAGE_KEYS.USER)
    const user = {
      id: existingUser?.id || generateId(),
      username: userData.username || 'User',
      email: userData.email || '',
      created_at: existingUser?.created_at || getCurrentDateTime(),
      age: userData.age || 25,
      gender: userData.gender || 'other',
      drinking_type: userData.drinking_type || 'stress',
      goal_type: userData.goal_type || 'harm_reduction',
      current_drinks_per_day: userData.current_drinks_per_day || 0,
      target_drinks_per_day: userData.target_drinks_per_day || 0,
      current_streak: userData.current_streak || 0,
      longest_streak: userData.longest_streak || 0,
      last_drink_date: userData.last_drink_date || null,
      updated_at: getCurrentDateTime()
    }
    
    // Calculate WHO risk level
    user.current_who_risk_level = calculateWHORiskLevel(user.current_drinks_per_day, user.gender)
    
    saveToStorage(STORAGE_KEYS.USER, user)
    return user
  },

  // Update user streak
  updateStreak: (streakData) => {
    const user = getFromStorage(STORAGE_KEYS.USER)
    if (!user) return null

    user.current_streak = streakData.current_streak || user.current_streak
    user.longest_streak = Math.max(user.longest_streak, user.current_streak)
    user.last_drink_date = streakData.last_drink_date || user.last_drink_date
    user.updated_at = getCurrentDateTime()

    saveToStorage(STORAGE_KEYS.USER, user)
    return user
  },

  // Delete user data
  deleteUser: () => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key)
    })
    return true
  }
}

// Consumption Tracking
export const consumptionStorage = {
  // Get consumption logs
  getConsumptionLogs: (startDate = null, endDate = null) => {
    const logs = getFromStorage(STORAGE_KEYS.CONSUMPTION_LOGS, [])
    
    if (!startDate && !endDate) return logs
    
    return logs.filter(log => {
      const logDate = log.date
      if (startDate && logDate < startDate) return false
      if (endDate && logDate > endDate) return false
      return true
    })
  },

  // Add consumption log
  addConsumptionLog: (logData) => {
    const logs = getFromStorage(STORAGE_KEYS.CONSUMPTION_LOGS, [])
    const newLog = {
      id: generateId(),
      date: logData.date || getCurrentDate(),
      drinks_consumed: logData.drinks_consumed || 0,
      drink_types: logData.drink_types || [],
      triggers: logData.triggers || [],
      mood_before: logData.mood_before || 5,
      mood_after: logData.mood_after || 5,
      notes: logData.notes || '',
      created_at: getCurrentDateTime()
    }
    
    logs.push(newLog)
    saveToStorage(STORAGE_KEYS.CONSUMPTION_LOGS, logs)
    
    // Update user's current drinks per day average
    this.updateUserAverageConsumption()
    
    return newLog
  },

  // Update consumption log
  updateConsumptionLog: (logId, logData) => {
    const logs = getFromStorage(STORAGE_KEYS.CONSUMPTION_LOGS, [])
    const index = logs.findIndex(log => log.id === logId)
    
    if (index === -1) return null
    
    logs[index] = { ...logs[index], ...logData, updated_at: getCurrentDateTime() }
    saveToStorage(STORAGE_KEYS.CONSUMPTION_LOGS, logs)
    
    this.updateUserAverageConsumption()
    
    return logs[index]
  },

  // Delete consumption log
  deleteConsumptionLog: (logId) => {
    const logs = getFromStorage(STORAGE_KEYS.CONSUMPTION_LOGS, [])
    const filteredLogs = logs.filter(log => log.id !== logId)
    
    saveToStorage(STORAGE_KEYS.CONSUMPTION_LOGS, filteredLogs)
    this.updateUserAverageConsumption()
    
    return true
  },

  // Update user's average consumption
  updateUserAverageConsumption: () => {
    const logs = getFromStorage(STORAGE_KEYS.CONSUMPTION_LOGS, [])
    const user = getFromStorage(STORAGE_KEYS.USER)
    
    if (!user || logs.length === 0) return
    
    // Calculate average from last 7 days
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const recentLogs = logs.filter(log => new Date(log.date) >= sevenDaysAgo)
    
    if (recentLogs.length > 0) {
      const totalDrinks = recentLogs.reduce((sum, log) => sum + log.drinks_consumed, 0)
      user.current_drinks_per_day = totalDrinks / recentLogs.length
      user.current_who_risk_level = calculateWHORiskLevel(user.current_drinks_per_day, user.gender)
      user.updated_at = getCurrentDateTime()
      
      saveToStorage(STORAGE_KEYS.USER, user)
    }
  },

  // Get consumption statistics
  getConsumptionStats: (days = 30) => {
    const logs = getFromStorage(STORAGE_KEYS.CONSUMPTION_LOGS, [])
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)
    
    const recentLogs = logs.filter(log => new Date(log.date) >= cutoffDate)
    
    if (recentLogs.length === 0) {
      return {
        total_drinks: 0,
        average_per_day: 0,
        drinking_days: 0,
        sober_days: days,
        most_common_triggers: [],
        mood_improvement: 0
      }
    }
    
    const totalDrinks = recentLogs.reduce((sum, log) => sum + log.drinks_consumed, 0)
    const drinkingDays = recentLogs.filter(log => log.drinks_consumed > 0).length
    const moodChanges = recentLogs
      .filter(log => log.mood_before && log.mood_after)
      .map(log => log.mood_after - log.mood_before)
    
    const avgMoodChange = moodChanges.length > 0 
      ? moodChanges.reduce((sum, change) => sum + change, 0) / moodChanges.length 
      : 0
    
    // Count triggers
    const triggerCounts = {}
    recentLogs.forEach(log => {
      log.triggers.forEach(trigger => {
        triggerCounts[trigger] = (triggerCounts[trigger] || 0) + 1
      })
    })
    
    const mostCommonTriggers = Object.entries(triggerCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([trigger]) => trigger)
    
    return {
      total_drinks: totalDrinks,
      average_per_day: totalDrinks / days,
      drinking_days: drinkingDays,
      sober_days: days - drinkingDays,
      most_common_triggers: mostCommonTriggers,
      mood_improvement: avgMoodChange
    }
  }
}

// Habit Replacements
export const habitStorage = {
  // Get habit replacements
  getHabitReplacements: (category = null, drinkingType = null) => {
    const habits = getFromStorage(STORAGE_KEYS.HABIT_REPLACEMENTS, [])
    
    return habits.filter(habit => {
      if (!habit.is_active) return false
      if (category && habit.category !== category) return false
      if (drinkingType && !habit.drinking_types.includes(drinkingType)) return false
      return true
    })
  },

  // Get user activities
  getUserActivities: (startDate = null, endDate = null) => {
    const activities = getFromStorage(STORAGE_KEYS.USER_ACTIVITIES, [])
    
    if (!startDate && !endDate) return activities
    
    return activities.filter(activity => {
      const activityDate = activity.date
      if (startDate && activityDate < startDate) return false
      if (endDate && activityDate > endDate) return false
      return true
    })
  },

  // Add user activity
  addUserActivity: (activityData) => {
    const activities = getFromStorage(STORAGE_KEYS.USER_ACTIVITIES, [])
    const newActivity = {
      id: generateId(),
      habit_replacement_id: activityData.habit_replacement_id,
      date: activityData.date || getCurrentDate(),
      duration_minutes: activityData.duration_minutes || 0,
      effectiveness_rating: activityData.effectiveness_rating || 5,
      notes: activityData.notes || '',
      replaced_drinking_urge: activityData.replaced_drinking_urge || false,
      created_at: getCurrentDateTime()
    }
    
    activities.push(newActivity)
    saveToStorage(STORAGE_KEYS.USER_ACTIVITIES, activities)
    
    return newActivity
  },

  // Update user activity
  updateUserActivity: (activityId, activityData) => {
    const activities = getFromStorage(STORAGE_KEYS.USER_ACTIVITIES, [])
    const index = activities.findIndex(activity => activity.id === activityId)
    
    if (index === -1) return null
    
    activities[index] = { ...activities[index], ...activityData, updated_at: getCurrentDateTime() }
    saveToStorage(STORAGE_KEYS.USER_ACTIVITIES, activities)
    
    return activities[index]
  },

  // Delete user activity
  deleteUserActivity: (activityId) => {
    const activities = getFromStorage(STORAGE_KEYS.USER_ACTIVITIES, [])
    const filteredActivities = activities.filter(activity => activity.id !== activityId)
    
    saveToStorage(STORAGE_KEYS.USER_ACTIVITIES, filteredActivities)
    return true
  },

  // Get habit effectiveness stats
  getHabitEffectiveness: (days = 30) => {
    const activities = getFromStorage(STORAGE_KEYS.USER_ACTIVITIES, [])
    const habits = getFromStorage(STORAGE_KEYS.HABIT_REPLACEMENTS, [])
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)
    
    const recentActivities = activities.filter(activity => new Date(activity.date) >= cutoffDate)
    
    const effectiveness = {}
    
    recentActivities.forEach(activity => {
      const habit = habits.find(h => h.id === activity.habit_replacement_id)
      if (!habit) return
      
      if (!effectiveness[habit.title]) {
        effectiveness[habit.title] = {
          title: habit.title,
          category: habit.category,
          total_uses: 0,
          avg_effectiveness: 0,
          avg_duration: 0,
          urges_replaced: 0
        }
      }
      
      const stats = effectiveness[habit.title]
      stats.total_uses++
      stats.avg_effectiveness = (stats.avg_effectiveness * (stats.total_uses - 1) + activity.effectiveness_rating) / stats.total_uses
      stats.avg_duration = (stats.avg_duration * (stats.total_uses - 1) + activity.duration_minutes) / stats.total_uses
      if (activity.replaced_drinking_urge) stats.urges_replaced++
    })
    
    return Object.values(effectiveness).sort((a, b) => b.avg_effectiveness - a.avg_effectiveness)
  }
}

// Journal Management
export const journalStorage = {
  // Get journal entries
  getJournalEntries: (entryType = null, startDate = null, endDate = null) => {
    const entries = getFromStorage(STORAGE_KEYS.JOURNAL_ENTRIES, [])
    
    return entries.filter(entry => {
      if (entryType && entry.entry_type !== entryType) return false
      if (startDate && entry.date < startDate) return false
      if (endDate && entry.date > endDate) return false
      return true
    })
  },

  // Add journal entry
  addJournalEntry: (entryData) => {
    const entries = getFromStorage(STORAGE_KEYS.JOURNAL_ENTRIES, [])
    const newEntry = {
      id: generateId(),
      date: entryData.date || getCurrentDate(),
      entry_type: entryData.entry_type || 'daily_reflection',
      title: entryData.title || '',
      content: entryData.content || '',
      mood_rating: entryData.mood_rating || 5,
      stress_level: entryData.stress_level || 5,
      confidence_level: entryData.confidence_level || 5,
      created_at: getCurrentDateTime()
    }
    
    entries.push(newEntry)
    saveToStorage(STORAGE_KEYS.JOURNAL_ENTRIES, entries)
    
    return newEntry
  },

  // Update journal entry
  updateJournalEntry: (entryId, entryData) => {
    const entries = getFromStorage(STORAGE_KEYS.JOURNAL_ENTRIES, [])
    const index = entries.findIndex(entry => entry.id === entryId)
    
    if (index === -1) return null
    
    entries[index] = { ...entries[index], ...entryData, updated_at: getCurrentDateTime() }
    saveToStorage(STORAGE_KEYS.JOURNAL_ENTRIES, entries)
    
    return entries[index]
  },

  // Delete journal entry
  deleteJournalEntry: (entryId) => {
    const entries = getFromStorage(STORAGE_KEYS.JOURNAL_ENTRIES, [])
    const filteredEntries = entries.filter(entry => entry.id !== entryId)
    
    saveToStorage(STORAGE_KEYS.JOURNAL_ENTRIES, filteredEntries)
    return true
  }
}

// Crisis Management
export const crisisStorage = {
  // Get crisis events
  getCrisisEvents: (crisisType = null, startDate = null, endDate = null) => {
    const events = getFromStorage(STORAGE_KEYS.CRISIS_EVENTS, [])
    
    return events.filter(event => {
      if (crisisType && event.crisis_type !== crisisType) return false
      if (startDate && event.timestamp < startDate) return false
      if (endDate && event.timestamp > endDate) return false
      return true
    })
  },

  // Add crisis event
  addCrisisEvent: (eventData) => {
    const events = getFromStorage(STORAGE_KEYS.CRISIS_EVENTS, [])
    const newEvent = {
      id: generateId(),
      timestamp: eventData.timestamp || getCurrentDateTime(),
      crisis_type: eventData.crisis_type || 'urge',
      trigger_description: eventData.trigger_description || '',
      coping_strategy_used: eventData.coping_strategy_used || '',
      outcome: eventData.outcome || '',
      severity_level: eventData.severity_level || 5,
      resolved: eventData.resolved || false,
      created_at: getCurrentDateTime()
    }
    
    events.push(newEvent)
    saveToStorage(STORAGE_KEYS.CRISIS_EVENTS, events)
    
    return newEvent
  },

  // Update crisis event
  updateCrisisEvent: (eventId, eventData) => {
    const events = getFromStorage(STORAGE_KEYS.CRISIS_EVENTS, [])
    const index = events.findIndex(event => event.id === eventId)
    
    if (index === -1) return null
    
    events[index] = { ...events[index], ...eventData, updated_at: getCurrentDateTime() }
    saveToStorage(STORAGE_KEYS.CRISIS_EVENTS, events)
    
    return events[index]
  },

  // Get crisis statistics
  getCrisisStats: (days = 30) => {
    const events = getFromStorage(STORAGE_KEYS.CRISIS_EVENTS, [])
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)
    
    const recentEvents = events.filter(event => new Date(event.timestamp) >= cutoffDate)
    
    if (recentEvents.length === 0) {
      return {
        total_events: 0,
        resolved_events: 0,
        resolution_rate: 0,
        most_common_triggers: [],
        average_severity: 0,
        most_effective_strategies: []
      }
    }
    
    const resolvedEvents = recentEvents.filter(event => event.resolved).length
    const avgSeverity = recentEvents.reduce((sum, event) => sum + event.severity_level, 0) / recentEvents.length
    
    // Count triggers and strategies
    const triggerCounts = {}
    const strategyCounts = {}
    
    recentEvents.forEach(event => {
      if (event.trigger_description) {
        triggerCounts[event.trigger_description] = (triggerCounts[event.trigger_description] || 0) + 1
      }
      if (event.coping_strategy_used && event.resolved) {
        strategyCounts[event.coping_strategy_used] = (strategyCounts[event.coping_strategy_used] || 0) + 1
      }
    })
    
    const mostCommonTriggers = Object.entries(triggerCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([trigger]) => trigger)
    
    const mostEffectiveStrategies = Object.entries(strategyCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([strategy]) => strategy)
    
    return {
      total_events: recentEvents.length,
      resolved_events: resolvedEvents,
      resolution_rate: (resolvedEvents / recentEvents.length) * 100,
      most_common_triggers: mostCommonTriggers,
      average_severity: avgSeverity,
      most_effective_strategies: mostEffectiveStrategies
    }
  }
}

// App Settings
export const settingsStorage = {
  // Get app settings
  getSettings: () => {
    return getFromStorage(STORAGE_KEYS.APP_SETTINGS, {
      theme: 'light',
      notifications_enabled: true,
      reminder_frequency: 'daily',
      privacy_mode: true,
      data_export_format: 'json'
    })
  },

  // Update app settings
  updateSettings: (newSettings) => {
    const currentSettings = getFromStorage(STORAGE_KEYS.APP_SETTINGS, {})
    const updatedSettings = { ...currentSettings, ...newSettings }
    saveToStorage(STORAGE_KEYS.APP_SETTINGS, updatedSettings)
    return updatedSettings
  }
}

// Data Export/Import
export const dataStorage = {
  // Export all user data
  exportAllData: () => {
    const data = {
      user: getFromStorage(STORAGE_KEYS.USER),
      consumption_logs: getFromStorage(STORAGE_KEYS.CONSUMPTION_LOGS, []),
      user_activities: getFromStorage(STORAGE_KEYS.USER_ACTIVITIES, []),
      journal_entries: getFromStorage(STORAGE_KEYS.JOURNAL_ENTRIES, []),
      crisis_events: getFromStorage(STORAGE_KEYS.CRISIS_EVENTS, []),
      settings: getFromStorage(STORAGE_KEYS.APP_SETTINGS, {}),
      export_date: getCurrentDateTime(),
      app_version: '1.0.0'
    }
    
    return data
  },

  // Import user data
  importData: (data) => {
    try {
      if (data.user) saveToStorage(STORAGE_KEYS.USER, data.user)
      if (data.consumption_logs) saveToStorage(STORAGE_KEYS.CONSUMPTION_LOGS, data.consumption_logs)
      if (data.user_activities) saveToStorage(STORAGE_KEYS.USER_ACTIVITIES, data.user_activities)
      if (data.journal_entries) saveToStorage(STORAGE_KEYS.JOURNAL_ENTRIES, data.journal_entries)
      if (data.crisis_events) saveToStorage(STORAGE_KEYS.CRISIS_EVENTS, data.crisis_events)
      if (data.settings) saveToStorage(STORAGE_KEYS.APP_SETTINGS, data.settings)
      
      return true
    } catch (error) {
      console.error('Error importing data:', error)
      return false
    }
  },

  // Clear all data
  clearAllData: () => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key)
    })
    return true
  }
}

// Initialize the app with default data
export const initializeApp = () => {
  initializeHabitReplacements()
  
  // Create default user if none exists
  const existingUser = getFromStorage(STORAGE_KEYS.USER)
  if (!existingUser) {
    userStorage.saveUser({
      username: 'demo_user',
      email: 'demo@example.com',
      age: 30,
      gender: 'other',
      drinking_type: 'stress',
      goal_type: 'harm_reduction',
      current_drinks_per_day: 3.5,
      target_drinks_per_day: 1.5,
      current_streak: 5,
      longest_streak: 12
    })
  }
}

// Export utility functions
export { generateId, getCurrentDate, getCurrentDateTime, calculateWHORiskLevel }

