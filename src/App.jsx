import { useState, useCallback } from 'react'
import { useProgress } from './hooks/useProgress'
import { useReminders } from './hooks/useReminders'
import HomeScreen from './screens/HomeScreen'
import SessionScreen from './screens/SessionScreen'
import CompleteScreen from './screens/CompleteScreen'
import SettingsScreen from './screens/SettingsScreen'
import ProgressScreen from './screens/ProgressScreen'
import BottomNav from './components/BottomNav'

// App.jsx — global state and screen routing (no React Router)
export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home')
  const [completedSession, setCompletedSession] = useState(null)

  const progressManager = useProgress()
  const progress = progressManager.getProgress()
  const settings = progressManager.getSettings()
  // Run reminder check globally — not just when Settings screen is open
  useReminders(settings)
  const todaySessions = progressManager.getTodaySessions()
  const weekCalendar = progressManager.getWeekCalendar()
  const allTimeStats = progressManager.getAllTimeStats()
  const weekSessions = progressManager.getWeekSessions()

  const handleStart = useCallback(() => {
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
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {currentScreen === 'home' && (
          <HomeScreen
            onStart={handleStart}
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
      </div>

      {showNav && (
        <BottomNav currentScreen={currentScreen} onNavigate={handleNavigate} />
      )}
    </div>
  )
}
