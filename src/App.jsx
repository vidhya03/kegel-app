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

// Sun icon for light mode
function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 32 32" fill="currentColor">
      <circle cx="16" cy="16" r="6"/>
      <path d="M16 4v3M16 25v3M4 16H7M25 16h3M7.1 7.1l2.1 2.1M22.8 22.8l2.1 2.1M7.1 24.9l2.1-2.1M22.8 9.2l2.1-2.1"/>
      <path d="M16 2v4M16 26v4M2 16h4M26 16h4M5.6 5.6l2.8 2.8M23.6 23.6l2.8 2.8M5.6 26.4l2.8-2.8M23.6 8.4l2.8-2.8" stroke="currentColor" strokeWidth="2" fill="none"/>
    </svg>
  )
}

// Moon icon for dark mode
function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 32 32" fill="currentColor">
      <path d="M13.502 5.414a15.075 15.075 0 0 0 11.594 17.99 11.936 11.936 0 0 1-9.594 4.444C9.04 27.848 4 22.768 4 16.5A12.015 12.015 0 0 1 13.502 5.414z"/>
    </svg>
  )
}

// App.jsx — global state and screen routing (no React Router)
export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home')

  // Theme — always starts in dark mode; toggle switches for current session
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
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
      {/* Theme toggle — fixed top-right, hidden during active session */}
      {currentScreen !== 'session' && (
        <button
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          style={{
            position: 'fixed',
            top: '0.75rem',
            right: '0.75rem',
            zIndex: 200,
            background: 'var(--cds-layer-02)',
            border: '1px solid var(--cds-border-subtle-01)',
            color: 'var(--cds-text-secondary)',
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          {theme === 'dark' ? <MoonIcon /> : <SunIcon />}
        </button>
      )}

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
        <BottomNav currentScreen={currentScreen} onNavigate={handleNavigate} />
      )}
    </div>
  )
}
