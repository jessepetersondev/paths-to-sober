import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import { Heart, Target, Calendar, TrendingDown, Shield, BookOpen, Users, Phone, Plus, Activity, Brain, Coffee, Zap } from 'lucide-react'
import { 
  userStorage, 
  consumptionStorage, 
  habitStorage, 
  journalStorage, 
  crisisStorage, 
  initializeApp 
} from './services/localStorage.js'
import './App.css'

// Onboarding Component
function OnboardingFlow({ onComplete }) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    age: 25,
    gender: 'other',
    drinking_type: 'stress',
    goal_type: 'harm_reduction',
    current_drinks_per_day: 0,
    target_drinks_per_day: 0
  })

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1)
    } else {
      // Complete onboarding
      const user = userStorage.saveUser(formData)
      onComplete(user)
    }
  }

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Heart className="h-6 w-6 text-blue-600 mr-2" />
            Welcome to RecoverWise
          </CardTitle>
          <CardDescription>Step {step} of 4 - Let's personalize your journey</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 1 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="username">What should we call you?</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  placeholder="Enter your name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email (optional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                  min="18"
                  max="100"
                />
              </div>
              <div className="space-y-2">
                <Label>Gender (for WHO risk assessment)</Label>
                <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other/Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="space-y-2">
                <Label>What describes your drinking pattern best?</Label>
                <Select value={formData.drinking_type} onValueChange={(value) => handleInputChange('drinking_type', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stress">Stress drinking - I drink when stressed or anxious</SelectItem>
                    <SelectItem value="social">Social drinking - I mainly drink in social situations</SelectItem>
                    <SelectItem value="boredom">Boredom drinking - I drink when I'm bored or idle</SelectItem>
                    <SelectItem value="habit">Habitual drinking - It's part of my daily routine</SelectItem>
                    <SelectItem value="emotional">Emotional drinking - I drink to cope with emotions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>What's your recovery goal?</Label>
                <Select value={formData.goal_type} onValueChange={(value) => handleInputChange('goal_type', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="abstinence">Complete abstinence - I want to stop drinking entirely</SelectItem>
                    <SelectItem value="harm_reduction">Harm reduction - I want to drink less and safer</SelectItem>
                    <SelectItem value="moderation">Moderation - I want to drink within healthy limits</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="current_drinks">How many drinks do you have per day on average?</Label>
                <Input
                  id="current_drinks"
                  type="number"
                  step="0.5"
                  value={formData.current_drinks_per_day}
                  onChange={(e) => handleInputChange('current_drinks_per_day', parseFloat(e.target.value))}
                  min="0"
                  max="20"
                />
                <p className="text-sm text-gray-600">1 drink = 12oz beer, 5oz wine, or 1.5oz spirits</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="target_drinks">What's your target drinks per day?</Label>
                <Input
                  id="target_drinks"
                  type="number"
                  step="0.5"
                  value={formData.target_drinks_per_day}
                  onChange={(e) => handleInputChange('target_drinks_per_day', parseFloat(e.target.value))}
                  min="0"
                  max={formData.current_drinks_per_day}
                />
              </div>
            </>
          )}

          {step === 4 && (
            <div className="text-center space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900">Your Personalized Plan</h3>
                <p className="text-sm text-blue-700 mt-2">
                  Based on your {formData.drinking_type} drinking pattern and {formData.goal_type} goal,
                  we'll help you reduce from {formData.current_drinks_per_day} to {formData.target_drinks_per_day} drinks per day.
                </p>
              </div>
              <p className="text-sm text-gray-600">
                Your data is stored locally on your device for privacy. Ready to start your journey?
              </p>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <Button 
              variant="outline" 
              onClick={handlePrevious} 
              disabled={step === 1}
            >
              Previous
            </Button>
            <Button onClick={handleNext}>
              {step === 4 ? 'Start Journey' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Landing Page Component
function LandingPage({ onGetStarted }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">RecoverWise</h1>
          </div>
          <Button onClick={onGetStarted} className="bg-blue-600 hover:bg-blue-700">
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Your Journey to <span className="text-blue-600">Mindful Drinking</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Evidence-based support for reducing alcohol consumption through habit replacement, 
            behavioral therapy, and personalized guidance. Focus on changing behaviors, not just counting drinks.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center">
                <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Personalized Plans</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Tailored reduction strategies based on your drinking patterns, triggers, and goals.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center">
                <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Habit Replacement</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Replace drinking habits with healthier alternatives using proven behavioral techniques.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center">
                <TrendingDown className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Progress Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Monitor your WHO risk levels, streaks, and habit effectiveness with detailed analytics.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12">
            <Button 
              onClick={onGetStarted} 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3"
            >
              Start Your Journey Today
            </Button>
          </div>
          
          <div className="mt-8 p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-800">
              🔒 <strong>Privacy First:</strong> All your data is stored locally on your device. 
              No servers, no tracking, complete privacy.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

// Consumption Logging Component
function ConsumptionLogger({ user, onUpdate }) {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    drinks_consumed: 0,
    drink_types: [],
    triggers: [],
    mood_before: 5,
    mood_after: 5,
    notes: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const log = consumptionStorage.addConsumptionLog(formData)
    if (log) {
      // Update user's streak if they had 0 drinks
      if (formData.drinks_consumed === 0) {
        const updatedUser = userStorage.updateStreak({
          current_streak: user.current_streak + 1
        })
        onUpdate(updatedUser)
      }
      setIsOpen(false)
      setFormData({
        date: new Date().toISOString().split('T')[0],
        drinks_consumed: 0,
        drink_types: [],
        triggers: [],
        mood_before: 5,
        mood_after: 5,
        notes: ''
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="h-20 flex-col space-y-2" variant="outline">
          <Calendar className="h-6 w-6" />
          <span>Log Today</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Log Your Day</DialogTitle>
          <DialogDescription>
            Track your consumption and mood for today
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="drinks">Drinks consumed</Label>
            <Input
              id="drinks"
              type="number"
              step="0.5"
              min="0"
              value={formData.drinks_consumed}
              onChange={(e) => setFormData(prev => ({ ...prev, drinks_consumed: parseFloat(e.target.value) || 0 }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mood_before">Mood before (1-10)</Label>
            <Input
              id="mood_before"
              type="number"
              min="1"
              max="10"
              value={formData.mood_before}
              onChange={(e) => setFormData(prev => ({ ...prev, mood_before: parseInt(e.target.value) }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mood_after">Mood after (1-10)</Label>
            <Input
              id="mood_after"
              type="number"
              min="1"
              max="10"
              value={formData.mood_after}
              onChange={(e) => setFormData(prev => ({ ...prev, mood_after: parseInt(e.target.value) }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="How did you feel? What triggered you?"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Log</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Journal Component
function JournalEntry({ onUpdate }) {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    entry_type: 'daily_reflection',
    mood_rating: 5,
    stress_level: 5,
    confidence_level: 5
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const entry = journalStorage.addJournalEntry(formData)
    if (entry) {
      setIsOpen(false)
      setFormData({
        title: '',
        content: '',
        entry_type: 'daily_reflection',
        mood_rating: 5,
        stress_level: 5,
        confidence_level: 5
      })
      if (onUpdate) onUpdate()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="h-20 flex-col space-y-2" variant="outline">
          <BookOpen className="h-6 w-6" />
          <span>Journal Entry</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Journal Entry</DialogTitle>
          <DialogDescription>
            Reflect on your day and track your progress
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="entry_type">Entry Type</Label>
            <Select value={formData.entry_type} onValueChange={(value) => setFormData(prev => ({ ...prev, entry_type: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily_reflection">Daily Reflection</SelectItem>
                <SelectItem value="trigger_analysis">Trigger Analysis</SelectItem>
                <SelectItem value="goal_setting">Goal Setting</SelectItem>
                <SelectItem value="gratitude">Gratitude</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="What's on your mind?"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Write your thoughts..."
              rows={4}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mood">Mood (1-10)</Label>
              <Input
                id="mood"
                type="number"
                min="1"
                max="10"
                value={formData.mood_rating}
                onChange={(e) => setFormData(prev => ({ ...prev, mood_rating: parseInt(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stress">Stress (1-10)</Label>
              <Input
                id="stress"
                type="number"
                min="1"
                max="10"
                value={formData.stress_level}
                onChange={(e) => setFormData(prev => ({ ...prev, stress_level: parseInt(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confidence">Confidence (1-10)</Label>
              <Input
                id="confidence"
                type="number"
                min="1"
                max="10"
                value={formData.confidence_level}
                onChange={(e) => setFormData(prev => ({ ...prev, confidence_level: parseInt(e.target.value) }))}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Entry</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Habit Activities Component
function HabitActivities({ user, onUpdate }) {
  const [isOpen, setIsOpen] = useState(false)
  const [habits, setHabits] = useState([])
  const [selectedHabit, setSelectedHabit] = useState(null)
  const [activityData, setActivityData] = useState({
    duration_minutes: 0,
    effectiveness_rating: 5,
    replaced_drinking_urge: false,
    notes: ''
  })

  useEffect(() => {
    if (isOpen) {
      const userHabits = habitStorage.getHabitReplacements(null, user.drinking_type)
      setHabits(userHabits)
    }
  }, [isOpen, user.drinking_type])

  const handleHabitSelect = (habit) => {
    setSelectedHabit(habit)
    setActivityData(prev => ({ ...prev, duration_minutes: habit.duration_minutes }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!selectedHabit) return

    const activity = habitStorage.addUserActivity({
      habit_replacement_id: selectedHabit.id,
      ...activityData
    })

    if (activity) {
      setIsOpen(false)
      setSelectedHabit(null)
      setActivityData({
        duration_minutes: 0,
        effectiveness_rating: 5,
        replaced_drinking_urge: false,
        notes: ''
      })
      if (onUpdate) onUpdate()
    }
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'stress_relief': return <Brain className="h-5 w-5" />
      case 'physical': return <Activity className="h-5 w-5" />
      case 'mindfulness': return <Coffee className="h-5 w-5" />
      case 'creative': return <Zap className="h-5 w-5" />
      default: return <Activity className="h-5 w-5" />
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="h-20 flex-col space-y-2" variant="outline">
          <Users className="h-6 w-6" />
          <span>Habit Activities</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Habit Replacement Activities</DialogTitle>
          <DialogDescription>
            Choose a healthy activity to replace drinking urges
          </DialogDescription>
        </DialogHeader>

        {!selectedHabit ? (
          <div className="space-y-4">
            <h3 className="font-semibold">Recommended for {user.drinking_type} drinkers:</h3>
            <div className="grid gap-3">
              {habits.map((habit) => (
                <Card 
                  key={habit.id} 
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleHabitSelect(habit)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="text-blue-600">
                        {getCategoryIcon(habit.category)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{habit.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{habit.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>⏱️ {habit.duration_minutes} min</span>
                          <span>📍 {habit.location_required}</span>
                          <span>⭐ Level {habit.difficulty_level}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900">{selectedHabit.title}</h3>
              <p className="text-sm text-blue-700 mt-1">{selectedHabit.description}</p>
              <div className="mt-2 p-2 bg-white rounded text-sm">
                <strong>Instructions:</strong> {selectedHabit.instructions}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">How long did you do this activity? (minutes)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                value={activityData.duration_minutes}
                onChange={(e) => setActivityData(prev => ({ ...prev, duration_minutes: parseInt(e.target.value) }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="effectiveness">How effective was it? (1-10)</Label>
              <Input
                id="effectiveness"
                type="number"
                min="1"
                max="10"
                value={activityData.effectiveness_rating}
                onChange={(e) => setActivityData(prev => ({ ...prev, effectiveness_rating: parseInt(e.target.value) }))}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="replaced_urge"
                checked={activityData.replaced_drinking_urge}
                onChange={(e) => setActivityData(prev => ({ ...prev, replaced_drinking_urge: e.target.checked }))}
              />
              <Label htmlFor="replaced_urge">This activity helped me avoid drinking</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                value={activityData.notes}
                onChange={(e) => setActivityData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="How did this make you feel?"
              />
            </div>

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => setSelectedHabit(null)}>
                Back to Activities
              </Button>
              <Button type="submit">Complete Activity</Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

// Crisis Mode Component
function CrisisMode({ onUpdate }) {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [crisisData, setCrisisData] = useState({
    crisis_type: 'urge',
    trigger_description: '',
    severity_level: 5
  })

  const handleCrisisSubmit = () => {
    const event = crisisStorage.addCrisisEvent({
      ...crisisData,
      coping_strategy_used: 'Used crisis mode',
      outcome: 'Seeking help',
      resolved: false
    })
    
    if (event && onUpdate) onUpdate()
    setStep(1)
    setIsOpen(false)
  }

  const crisisStrategies = [
    {
      title: "Deep Breathing",
      description: "Take 10 slow, deep breaths. Focus only on your breathing.",
      action: "Start breathing exercise"
    },
    {
      title: "Call Someone",
      description: "Reach out to a trusted friend, family member, or support hotline.",
      action: "Open contacts"
    },
    {
      title: "Change Environment",
      description: "Go to a different room, step outside, or change your surroundings.",
      action: "Move to safe space"
    },
    {
      title: "Grounding Exercise",
      description: "Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste.",
      action: "Start grounding"
    }
  ]

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="h-20 flex-col space-y-2 bg-red-50 border-red-200 text-red-700 hover:bg-red-100">
          <Shield className="h-6 w-6" />
          <span>Crisis Mode</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-red-700">Crisis Support</DialogTitle>
          <DialogDescription>
            You're not alone. Let's get through this together.
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4">
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="text-red-800 font-semibold">You're experiencing a crisis moment.</p>
              <p className="text-red-700 text-sm mt-1">This feeling will pass. You are stronger than this urge.</p>
            </div>

            <div className="space-y-2">
              <Label>What type of crisis are you experiencing?</Label>
              <Select value={crisisData.crisis_type} onValueChange={(value) => setCrisisData(prev => ({ ...prev, crisis_type: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="urge">Strong drinking urge</SelectItem>
                  <SelectItem value="stress">Overwhelming stress</SelectItem>
                  <SelectItem value="emotional">Emotional crisis</SelectItem>
                  <SelectItem value="social">Social pressure</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Intensity level (1-10)</Label>
              <Input
                type="number"
                min="1"
                max="10"
                value={crisisData.severity_level}
                onChange={(e) => setCrisisData(prev => ({ ...prev, severity_level: parseInt(e.target.value) }))}
              />
            </div>

            <Button onClick={() => setStep(2)} className="w-full bg-red-600 hover:bg-red-700">
              Get Immediate Help
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-red-700">Immediate Coping Strategies</h3>
            <div className="space-y-3">
              {crisisStrategies.map((strategy, index) => (
                <Card key={index} className="border-red-200">
                  <CardContent className="p-4">
                    <h4 className="font-semibold">{strategy.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{strategy.description}</p>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={handleCrisisSubmit}
                      className="border-red-200 text-red-700 hover:bg-red-50"
                    >
                      {strategy.action}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg">
              <p className="text-yellow-800 text-sm">
                <strong>Emergency Resources:</strong><br />
                • SAMHSA Helpline: 1-800-662-4357<br />
                • Crisis Text Line: Text HOME to 741741<br />
                • National Suicide Prevention: 988
              </p>
            </div>

            <Button onClick={() => setStep(1)} variant="outline" className="w-full">
              Back
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

// Dashboard Component
function Dashboard({ user, onUserUpdate }) {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    // Load consumption stats
    const consumptionStats = consumptionStorage.getConsumptionStats(30)
    const habitStats = habitStorage.getHabitEffectiveness(30)
    const crisisStats = crisisStorage.getCrisisStats(30)
    
    setStats({
      consumption: consumptionStats,
      habits: habitStats,
      crisis: crisisStats
    })
  }, [user])

  const getRiskLevelColor = (level) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'very_high': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const progressPercentage = user.target_drinks_per_day === 0 
    ? (user.current_drinks_per_day === 0 ? 100 : 0)
    : Math.max(0, Math.min(100, 
        ((user.current_drinks_per_day - user.target_drinks_per_day) / user.current_drinks_per_day) * 100
      ))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">RecoverWise</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className={getRiskLevelColor(user.current_who_risk_level)}>
                WHO Risk: {user.current_who_risk_level.replace('_', ' ').toUpperCase()}
              </Badge>
              <Button variant="outline" size="sm">
                <Phone className="h-4 w-4 mr-2" />
                Crisis Support
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.username}!
          </h2>
          <p className="text-gray-600">
            You're on day {user.current_streak} of your journey. Keep going!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Current Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{user.current_streak} days</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Longest Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{user.longest_streak} days</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Current Intake</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{user.current_drinks_per_day.toFixed(1)} drinks/day</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Target Intake</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{user.target_drinks_per_day.toFixed(1)} drinks/day</div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Reduction Progress
            </CardTitle>
            <CardDescription>
              Your progress toward your target consumption goal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Current: {user.current_drinks_per_day.toFixed(1)} drinks/day</span>
                <span>Target: {user.target_drinks_per_day.toFixed(1)} drinks/day</span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
              <p className="text-sm text-gray-600">
                {progressPercentage.toFixed(1)}% progress toward your goal
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ConsumptionLogger user={user} onUpdate={onUserUpdate} />
          <JournalEntry onUpdate={() => {}} />
          <HabitActivities user={user} onUpdate={() => {}} />
          <CrisisMode onUpdate={() => {}} />
        </div>

        {/* Recent Activity Summary */}
        {stats && (
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">30-Day Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Sober days:</span>
                    <span className="font-semibold text-green-600">{stats.consumption.sober_days}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Drinking days:</span>
                    <span className="font-semibold text-orange-600">{stats.consumption.drinking_days}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total drinks:</span>
                    <span className="font-semibold">{stats.consumption.total_drinks}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top Habits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {stats.habits.slice(0, 3).map((habit, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="truncate">{habit.title}</span>
                      <span className="font-semibold text-blue-600">{habit.avg_effectiveness.toFixed(1)}/10</span>
                    </div>
                  ))}
                  {stats.habits.length === 0 && (
                    <p className="text-gray-500">No habit activities yet</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Crisis Support</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Crisis events:</span>
                    <span className="font-semibold">{stats.crisis.total_events}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Resolution rate:</span>
                    <span className="font-semibold text-green-600">{stats.crisis.resolution_rate.toFixed(0)}%</span>
                  </div>
                  {stats.crisis.total_events === 0 && (
                    <p className="text-green-600">Great job staying stable!</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}

// Main App Component
function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [isOnboarded, setIsOnboarded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize app and check for existing user
  useEffect(() => {
    initializeApp()
    
    const existingUser = userStorage.getCurrentUser()
    if (existingUser) {
      setCurrentUser(existingUser)
      setIsOnboarded(true)
    }
    
    setIsLoading(false)
  }, [])

  const handleOnboardingComplete = (user) => {
    setCurrentUser(user)
    setIsOnboarded(true)
  }

  const handleGetStarted = () => {
    // Start onboarding flow
    setIsOnboarded(false)
  }

  const handleUserUpdate = (updatedUser) => {
    setCurrentUser(updatedUser)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading RecoverWise...</p>
        </div>
      </div>
    )
  }

  if (!isOnboarded) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />
  }

  if (!currentUser) {
    return <LandingPage onGetStarted={handleGetStarted} />
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard user={currentUser} onUserUpdate={handleUserUpdate} />} />
        <Route path="/dashboard" element={<Dashboard user={currentUser} onUserUpdate={handleUserUpdate} />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  )
}

export default App

