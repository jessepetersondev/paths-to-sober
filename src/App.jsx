import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Heart, Calendar, Target, TrendingDown, BookOpen, Users, Phone, AlertTriangle } from 'lucide-react'
import { userStorage, consumptionStorage, journalStorage, habitStorage, crisisStorage } from './services/localStorage.js'
import './App.css'

function App() {
  // Core state
  const [currentUser, setCurrentUser] = useState(null)
  const [isOnboarding, setIsOnboarding] = useState(false)
  const [userStats, setUserStats] = useState(null)
  
  // Dialog states
  const [showLogDialog, setShowLogDialog] = useState(false)
  const [showJournalDialog, setShowJournalDialog] = useState(false)
  const [showHabitsDialog, setShowHabitsDialog] = useState(false)
  const [showCrisisDialog, setShowCrisisDialog] = useState(false)
  
  // Onboarding form state
  const [onboardingData, setOnboardingData] = useState({
    username: '',
    age: '',
    gender: '',
    drinkingType: '',
    goalType: '',
    currentDrinksPerDay: '',
    targetDrinksPerDay: ''
  })
  
  // Consumption log form state
  const [logData, setLogData] = useState({
    drinksConsumed: '',
    drinkTypes: '',
    triggers: '',
    moodBefore: 5,
    moodAfter: 5,
    notes: ''
  })
  
  // Journal form state
  const [journalData, setJournalData] = useState({
    entryType: 'Daily Reflection',
    title: '',
    content: '',
    mood: 5,
    stress: 5,
    confidence: 5
  })
  
  // Habit activity form state
  const [habitData, setHabitData] = useState({
    activityName: '',
    category: '',
    duration: '',
    effectiveness: 5,
    notes: ''
  })

  // Initialize app - check for existing user or start onboarding
  useEffect(() => {
    const user = userStorage.getCurrentUser()
    if (user) {
      setCurrentUser(user)
      loadUserStats(user.id)
    } else {
      setIsOnboarding(true)
    }
  }, [])

  // Load user statistics and progress
  const loadUserStats = (userId) => {
    const logs = consumptionStorage.getConsumptionLogs(30)
    const stats = consumptionStorage.getConsumptionStats(30)
    const journalEntries = journalStorage.getJournalEntries(30)
    
    // Calculate current streak
    let currentStreak = 0
    const today = new Date()
    for (let i = 0; i < 30; i++) {
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
    
    // Calculate average consumption
    const recentLogs = logs.slice(-7) // Last 7 days
    const avgConsumption = recentLogs.length > 0 
      ? recentLogs.reduce((sum, log) => sum + log.drinksConsumed, 0) / recentLogs.length
      : 0
    
    // Calculate WHO risk level
    const getWHORiskLevel = (avgDrinks) => {
      if (avgDrinks === 0) return { level: 'NONE', color: 'green' }
      if (avgDrinks <= 1) return { level: 'LOW', color: 'green' }
      if (avgDrinks <= 2) return { level: 'MEDIUM', color: 'yellow' }
      if (avgDrinks <= 4) return { level: 'HIGH', color: 'orange' }
      return { level: 'VERY HIGH', color: 'red' }
    }
    
    const riskLevel = getWHORiskLevel(avgConsumption)
    
    setUserStats({
      currentStreak,
      longestStreak: Math.max(currentStreak, currentUser?.longestStreak || 0),
      currentIntake: avgConsumption,
      targetIntake: currentUser?.targetDrinksPerDay || 0,
      totalLogs: logs.length,
      journalEntries: journalEntries.length,
      riskLevel,
      progressPercent: currentUser?.targetDrinksPerDay > 0 
        ? Math.max(0, Math.min(100, ((currentUser.targetDrinksPerDay - avgConsumption) / currentUser.targetDrinksPerDay) * 100))
        : 0
    })
  }

  // Handle onboarding completion
  const completeOnboarding = () => {
    if (!onboardingData.username || !onboardingData.age || !onboardingData.drinkingType || !onboardingData.goalType) {
      alert('Please fill in all required fields')
      return
    }
    
    const newUser = {
      id: Date.now().toString(),
      username: onboardingData.username,
      age: parseInt(onboardingData.age),
      gender: onboardingData.gender,
      drinkingType: onboardingData.drinkingType,
      goalType: onboardingData.goalType,
      currentDrinksPerDay: parseFloat(onboardingData.currentDrinksPerDay) || 0,
      targetDrinksPerDay: parseFloat(onboardingData.targetDrinksPerDay) || 0,
      currentStreak: 0,
      longestStreak: 0,
      createdAt: new Date().toISOString()
    }
    
    userStorage.saveUser(newUser)
    setCurrentUser(newUser)
    setIsOnboarding(false)
    loadUserStats(newUser.id)
  }

  // Handle consumption logging
  const saveConsumptionLog = () => {
    if (logData.drinksConsumed === '') {
      alert('Please enter the number of drinks consumed')
      return
    }
    
    const newLog = {
      id: Date.now().toString(),
      userId: currentUser.id,
      date: new Date().toISOString().split('T')[0],
      drinksConsumed: parseFloat(logData.drinksConsumed),
      drinkTypes: logData.drinkTypes,
      triggers: logData.triggers,
      moodBefore: parseInt(logData.moodBefore),
      moodAfter: parseInt(logData.moodAfter),
      notes: logData.notes,
      createdAt: new Date().toISOString()
    }
    
    consumptionStorage.addConsumptionLog(newLog)
    
    // Update user streak if applicable
    if (newLog.drinksConsumed === 0) {
      const updatedUser = { ...currentUser, currentStreak: (userStats?.currentStreak || 0) + 1 }
      if (updatedUser.currentStreak > updatedUser.longestStreak) {
        updatedUser.longestStreak = updatedUser.currentStreak
      }
      userStorage.updateUser(updatedUser)
      setCurrentUser(updatedUser)
    }
    
    // Reset form and close dialog
    setLogData({
      drinksConsumed: '',
      drinkTypes: '',
      triggers: '',
      moodBefore: 5,
      moodAfter: 5,
      notes: ''
    })
    setShowLogDialog(false)
    
    // Reload stats
    loadUserStats(currentUser.id)
  }

  // Handle journal entry
  const saveJournalEntry = () => {
    if (!journalData.title || !journalData.content) {
      alert('Please fill in the title and content')
      return
    }
    
    const newEntry = {
      id: Date.now().toString(),
      userId: currentUser.id,
      entryType: journalData.entryType,
      title: journalData.title,
      content: journalData.content,
      mood: parseInt(journalData.mood),
      stress: parseInt(journalData.stress),
      confidence: parseInt(journalData.confidence),
      createdAt: new Date().toISOString()
    }
    
    journalStorage.addJournalEntry(newEntry)
    
    // Reset form and close dialog
    setJournalData({
      entryType: 'Daily Reflection',
      title: '',
      content: '',
      mood: 5,
      stress: 5,
      confidence: 5
    })
    setShowJournalDialog(false)
    
    // Reload stats
    loadUserStats(currentUser.id)
  }

  // Handle habit activity
  const saveHabitActivity = () => {
    if (!habitData.activityName) {
      alert('Please enter an activity name')
      return
    }
    
    const newActivity = {
      id: Date.now().toString(),
      userId: currentUser.id,
      activityName: habitData.activityName,
      category: habitData.category,
      duration: parseInt(habitData.duration) || 0,
      effectiveness: parseInt(habitData.effectiveness),
      notes: habitData.notes,
      createdAt: new Date().toISOString()
    }
    
    habitStorage.addUserActivity(newActivity)
    
    // Reset form and close dialog
    setHabitData({
      activityName: '',
      category: '',
      duration: '',
      effectiveness: 5,
      notes: ''
    })
    setShowHabitsDialog(false)
  }

  // Handle crisis event
  const logCrisisEvent = (eventType) => {
    const crisisEvent = {
      id: Date.now().toString(),
      userId: currentUser.id,
      eventType,
      createdAt: new Date().toISOString()
    }
    
    crisisStorage.addCrisisEvent(crisisEvent)
    setShowCrisisDialog(false)
  }

  // Reset user data (for testing/demo purposes)
  const resetUserData = () => {
    if (confirm('Are you sure you want to reset all your data? This cannot be undone.')) {
      userStorage.clearAllData()
      setCurrentUser(null)
      setUserStats(null)
      setIsOnboarding(true)
    }
  }

  // Onboarding Component
  if (isOnboarding) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Heart className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">RecoverWise</h1>
            </div>
            <CardTitle className="text-2xl">Welcome to Your Recovery Journey</CardTitle>
            <CardDescription>
              Let's set up your personalized recovery plan. All information stays private on your device.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="username">Name *</Label>
                <Input
                  id="username"
                  placeholder="Enter your name"
                  value={onboardingData.username}
                  onChange={(e) => setOnboardingData({...onboardingData, username: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="age">Age *</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Enter your age"
                  value={onboardingData.age}
                  onChange={(e) => setOnboardingData({...onboardingData, age: e.target.value})}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="gender">Gender</Label>
              <Select value={onboardingData.gender} onValueChange={(value) => setOnboardingData({...onboardingData, gender: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="non-binary">Non-binary</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="drinkingType">What describes your drinking pattern? *</Label>
              <Select value={onboardingData.drinkingType} onValueChange={(value) => setOnboardingData({...onboardingData, drinkingType: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select drinking pattern" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stress">Stress Drinker - I drink when stressed or anxious</SelectItem>
                  <SelectItem value="social">Social Drinker - I mainly drink in social situations</SelectItem>
                  <SelectItem value="boredom">Boredom Drinker - I drink when I'm bored or have nothing to do</SelectItem>
                  <SelectItem value="habit">Habit Drinker - Drinking is part of my daily routine</SelectItem>
                  <SelectItem value="emotional">Emotional Drinker - I drink to cope with emotions</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="goalType">What's your recovery goal? *</Label>
              <Select value={onboardingData.goalType} onValueChange={(value) => setOnboardingData({...onboardingData, goalType: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="abstinence">Complete Abstinence - Stop drinking entirely</SelectItem>
                  <SelectItem value="harm-reduction">Harm Reduction - Reduce drinking to safer levels</SelectItem>
                  <SelectItem value="moderation">Moderation - Drink occasionally and responsibly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="currentDrinks">Current drinks per day (average)</Label>
                <Input
                  id="currentDrinks"
                  type="number"
                  step="0.5"
                  placeholder="e.g., 3.5"
                  value={onboardingData.currentDrinksPerDay}
                  onChange={(e) => setOnboardingData({...onboardingData, currentDrinksPerDay: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="targetDrinks">Target drinks per day</Label>
                <Input
                  id="targetDrinks"
                  type="number"
                  step="0.5"
                  placeholder="e.g., 1.0"
                  value={onboardingData.targetDrinksPerDay}
                  onChange={(e) => setOnboardingData({...onboardingData, targetDrinksPerDay: e.target.value})}
                />
              </div>
            </div>
            
            <Button onClick={completeOnboarding} className="w-full" size="lg">
              Start My Recovery Journey
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Main Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Heart className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">RecoverWise</h1>
            </div>
            <div className="flex items-center gap-4">
              {userStats?.riskLevel && (
                <Badge variant={userStats.riskLevel.color === 'green' ? 'default' : 'destructive'}>
                  WHO Risk: {userStats.riskLevel.level}
                </Badge>
              )}
              <Button variant="outline" size="sm" onClick={() => setShowCrisisDialog(true)}>
                <Phone className="h-4 w-4 mr-2" />
                Crisis Support
              </Button>
              <Button variant="ghost" size="sm" onClick={resetUserData}>
                Reset Data
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {currentUser?.username}!
          </h2>
          <p className="text-gray-600">
            {userStats?.currentStreak > 0 
              ? `You're on day ${userStats.currentStreak} of your journey. Keep going!`
              : "Ready to track your progress today?"
            }
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {userStats?.currentStreak || 0} days
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Longest Streak</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {userStats?.longestStreak || 0} days
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Intake</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {userStats?.currentIntake?.toFixed(1) || '0.0'} drinks/day
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Target Intake</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {currentUser?.targetDrinksPerDay?.toFixed(1) || '0.0'} drinks/day
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Section */}
        {currentUser?.targetDrinksPerDay > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Reduction Progress
              </CardTitle>
              <CardDescription>
                Your progress toward your target consumption goal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Current: {userStats?.currentIntake?.toFixed(1) || '0.0'} drinks/day</span>
                  <span>Target: {currentUser.targetDrinksPerDay.toFixed(1)} drinks/day</span>
                </div>
                <Progress value={userStats?.progressPercent || 0} className="h-2" />
                <p className="text-sm text-muted-foreground">
                  {userStats?.progressPercent?.toFixed(1) || '0.0'}% progress toward your goal
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Button 
            onClick={() => setShowLogDialog(true)} 
            className="h-24 flex flex-col gap-2"
            variant="outline"
          >
            <Calendar className="h-6 w-6" />
            Log Today
          </Button>
          
          <Button 
            onClick={() => setShowJournalDialog(true)} 
            className="h-24 flex flex-col gap-2"
            variant="outline"
          >
            <BookOpen className="h-6 w-6" />
            Journal Entry
          </Button>
          
          <Button 
            onClick={() => setShowHabitsDialog(true)} 
            className="h-24 flex flex-col gap-2"
            variant="outline"
          >
            <Users className="h-6 w-6" />
            Habit Activities
          </Button>
          
          <Button 
            onClick={() => setShowCrisisDialog(true)} 
            className="h-24 flex flex-col gap-2"
            variant="outline"
          >
            <AlertTriangle className="h-6 w-6" />
            Crisis Mode
          </Button>
        </div>
      </main>

      {/* Consumption Log Dialog */}
      <Dialog open={showLogDialog} onOpenChange={setShowLogDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Log Today's Consumption</DialogTitle>
            <DialogDescription>
              Track your drinking for today and note any triggers or feelings
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="drinks">Drinks Consumed *</Label>
              <Input
                id="drinks"
                type="number"
                step="0.5"
                placeholder="0"
                value={logData.drinksConsumed}
                onChange={(e) => setLogData({...logData, drinksConsumed: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="drinkTypes">Types of Drinks</Label>
              <Input
                id="drinkTypes"
                placeholder="e.g., Beer, Wine, Spirits"
                value={logData.drinkTypes}
                onChange={(e) => setLogData({...logData, drinkTypes: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="triggers">Triggers</Label>
              <Input
                id="triggers"
                placeholder="e.g., Stress, Social event, Boredom"
                value={logData.triggers}
                onChange={(e) => setLogData({...logData, triggers: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="moodBefore">Mood Before (1-10)</Label>
                <Input
                  id="moodBefore"
                  type="number"
                  min="1"
                  max="10"
                  value={logData.moodBefore}
                  onChange={(e) => setLogData({...logData, moodBefore: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="moodAfter">Mood After (1-10)</Label>
                <Input
                  id="moodAfter"
                  type="number"
                  min="1"
                  max="10"
                  value={logData.moodAfter}
                  onChange={(e) => setLogData({...logData, moodAfter: e.target.value})}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any additional thoughts or observations..."
                value={logData.notes}
                onChange={(e) => setLogData({...logData, notes: e.target.value})}
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={() => setShowLogDialog(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button onClick={saveConsumptionLog} className="flex-1">
                Save Log
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Journal Entry Dialog */}
      <Dialog open={showJournalDialog} onOpenChange={setShowJournalDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Journal Entry</DialogTitle>
            <DialogDescription>
              Reflect on your day and track your progress
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="entryType">Entry Type</Label>
              <Select value={journalData.entryType} onValueChange={(value) => setJournalData({...journalData, entryType: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Daily Reflection">Daily Reflection</SelectItem>
                  <SelectItem value="Trigger Analysis">Trigger Analysis</SelectItem>
                  <SelectItem value="Goal Setting">Goal Setting</SelectItem>
                  <SelectItem value="Gratitude">Gratitude</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="What's on your mind?"
                value={journalData.title}
                onChange={(e) => setJournalData({...journalData, title: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                placeholder="Write your thoughts..."
                value={journalData.content}
                onChange={(e) => setJournalData({...journalData, content: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="mood">Mood (1-10)</Label>
                <Input
                  id="mood"
                  type="number"
                  min="1"
                  max="10"
                  value={journalData.mood}
                  onChange={(e) => setJournalData({...journalData, mood: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="stress">Stress (1-10)</Label>
                <Input
                  id="stress"
                  type="number"
                  min="1"
                  max="10"
                  value={journalData.stress}
                  onChange={(e) => setJournalData({...journalData, stress: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="confidence">Confidence (1-10)</Label>
                <Input
                  id="confidence"
                  type="number"
                  min="1"
                  max="10"
                  value={journalData.confidence}
                  onChange={(e) => setJournalData({...journalData, confidence: e.target.value})}
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={() => setShowJournalDialog(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button onClick={saveJournalEntry} className="flex-1">
                Save Entry
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Habit Activities Dialog */}
      <Dialog open={showHabitsDialog} onOpenChange={setShowHabitsDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Log Habit Activity</DialogTitle>
            <DialogDescription>
              Track alternative activities you did instead of drinking
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="activityName">Activity *</Label>
              <Input
                id="activityName"
                placeholder="e.g., Went for a walk, Called a friend"
                value={habitData.activityName}
                onChange={(e) => setHabitData({...habitData, activityName: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={habitData.category} onValueChange={(value) => setHabitData({...habitData, category: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="physical">Physical Activity</SelectItem>
                  <SelectItem value="social">Social Connection</SelectItem>
                  <SelectItem value="creative">Creative Expression</SelectItem>
                  <SelectItem value="mindfulness">Mindfulness/Meditation</SelectItem>
                  <SelectItem value="learning">Learning/Reading</SelectItem>
                  <SelectItem value="self-care">Self-Care</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                placeholder="30"
                value={habitData.duration}
                onChange={(e) => setHabitData({...habitData, duration: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="effectiveness">How effective was this? (1-10)</Label>
              <Input
                id="effectiveness"
                type="number"
                min="1"
                max="10"
                value={habitData.effectiveness}
                onChange={(e) => setHabitData({...habitData, effectiveness: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="habitNotes">Notes</Label>
              <Textarea
                id="habitNotes"
                placeholder="How did this activity help you?"
                value={habitData.notes}
                onChange={(e) => setHabitData({...habitData, notes: e.target.value})}
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={() => setShowHabitsDialog(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button onClick={saveHabitActivity} className="flex-1">
                Save Activity
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Crisis Support Dialog */}
      <Dialog open={showCrisisDialog} onOpenChange={setShowCrisisDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Crisis Support</DialogTitle>
            <DialogDescription>
              Immediate help and resources when you need them most
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <Button 
                onClick={() => logCrisisEvent('urge')} 
                variant="outline" 
                className="h-auto p-4 text-left"
              >
                <div>
                  <div className="font-semibold">I'm having an urge to drink</div>
                  <div className="text-sm text-muted-foreground">Get immediate coping strategies</div>
                </div>
              </Button>
              
              <Button 
                onClick={() => logCrisisEvent('anxiety')} 
                variant="outline" 
                className="h-auto p-4 text-left"
              >
                <div>
                  <div className="font-semibold">I'm feeling anxious or stressed</div>
                  <div className="text-sm text-muted-foreground">Access calming techniques</div>
                </div>
              </Button>
              
              <Button 
                onClick={() => logCrisisEvent('relapse')} 
                variant="outline" 
                className="h-auto p-4 text-left"
              >
                <div>
                  <div className="font-semibold">I had a drink/relapsed</div>
                  <div className="text-sm text-muted-foreground">Get back on track guidance</div>
                </div>
              </Button>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-2">Emergency Resources</h4>
              <div className="space-y-2 text-sm">
                <div>SAMHSA Helpline: <strong>1-800-662-4357</strong></div>
                <div>Crisis Text Line: Text <strong>HOME</strong> to <strong>741741</strong></div>
                <div>National Suicide Prevention: <strong>988</strong></div>
              </div>
            </div>
            
            <Button onClick={() => setShowCrisisDialog(false)} className="w-full">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default App

