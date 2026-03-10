import { useState, useCallback, useEffect } from 'react'
import { useProgress } from './hooks/useProgress'
import { useReminders } from './hooks/useReminders'
import HomeScreen from './screens/HomeScreen'
import SessionScreen from './screens/SessionScreen'
import CompleteScreen from './screens/CompleteScreen'
import SettingsScreen from './screens/SettingsScreen'
import ProgressScreen from './screens/ProgressScreen'
import FeedbackScreen from './screens/FeedbackScreen'
import BottomNav from './components/BottomNav'

// App.jsx — global state and screen routing (no React Router)
export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home')

  // Theme — always starts in dark mode; toggle switches for current session
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    // Switch Carbon theme class — cds--g10 (light) or cds--g100 (dark)
    document.documentElement.className = theme === 'light' ? 'cds--g10' : 'cds--g100'
    document.documentElement.setAttribute('data-theme', theme === 'light' ? 'light' : '')
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme(t => t === 'dark' ? 'light' : 'dark')
  }, [])
  const [completedSession, setCompletedSession] = useState(null)
  const [sessionExercises, setSessionExercises] = useState(null)

  const progressManager = useProgress()
  const progress = progressManager.getProgress()
  const settings = progressManager.getSettings()
  // Run reminder check globally — not just when Settings screen is open
  useReminders(settings)
  const todaySessions = progressManager.getTodaySessions()
  const weekCalendar = progressManager.getWeekCalendar()
  const allTimeStats = progressManager.getAllTimeStats()
  const weekSessions = progressManager.getWeekSessions()

  const handleStart = useCallback((exercises) => {
    setSessionExercises(exercises)
    setCurrentScreen('session')
  }, [])

  const handleSessionComplete = useCallback((session) => {
    progressManager.saveSession(session)
    setCompletedSession(session)
    setCurrentScreen('complete')
  }, [progressManager])

  const handleStop = useCallback(() => {
    setCurrentScreen('home')
  }, [])

  const handleGoHome = useCallback(() => {
    setCompletedSession(null)
    setCurrentScreen('home')
  }, [])

  const handleDoAnother = useCallback(() => {
    setCompletedSession(null)
    setCurrentScreen('session')
  }, [])

  const handleNavigate = useCallback((screen) => {
    // Prevent navigating away from active session
    if (currentScreen === 'session') return
    setCurrentScreen(screen)
  }, [currentScreen])

  const handleSaveSettings = useCallback((newSettings) => {
    progressManager.saveSettings(newSettings)
  }, [progressManager])

  const handleResetProgress = useCallback(() => {
    progressManager.resetProgress()
    setCurrentScreen('home')
  }, [progressManager])

  const showNav = currentScreen !== 'session'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', overflow: 'hidden' }}>
      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
        {currentScreen === 'home' && (
          <HomeScreen
            onStart={handleStart}
            onSetWeek={progressManager.setWeek}
            progress={progress}
            todaySessions={todaySessions}
          />
        )}
        {currentScreen === 'session' && (
          <SessionScreen
            onComplete={handleSessionComplete}
            onStop={handleStop}
            settings={settings}
            progress={progress}
            exercises={sessionExercises}
          />
        )}
        {currentScreen === 'complete' && (
          <CompleteScreen
            session={completedSession}
            onGoHome={handleGoHome}
            onDoAnother={handleDoAnother}
          />
        )}
        {currentScreen === 'settings' && (
          <SettingsScreen
            settings={settings}
            onSave={handleSaveSettings}
            onResetProgress={handleResetProgress}
          />
        )}
        {currentScreen === 'progress' && (
          <ProgressScreen
            sessions={progress.sessions || []}
            allTimeStats={allTimeStats}
            weekSessions={weekSessions}
          />
        )}
        {currentScreen === 'feedback' && (
          <FeedbackScreen />
        )}
      </div>

      {showNav && (
        <BottomNav currentScreen={currentScreen} onNavigate={handleNavigate} theme={theme} onToggleTheme={toggleTheme} />
      )}
    </div>
  )
}
