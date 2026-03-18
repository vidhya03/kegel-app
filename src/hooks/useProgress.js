import { useState, useCallback } from 'react'

// localStorage keys — all prefixed with kc_ to avoid conflicts
const KEYS = {
  week: 'kc_current_week',
  day: 'kc_current_day',
  sessions: 'kc_sessions',
  streak: 'kc_streak',
  lastSession: 'kc_last_session',
  settings: 'kc_settings'
}

const DEFAULT_SETTINGS = {
  soundEnabled: true,
  soundType: 'voice',
  volume: 0.7,
  vibrationEnabled: true,
  squeezePattern: 'short-short',
  releasePattern: 'soft',
  reminderEnabled: false,
  reminderTime: '08:00'
}

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

// Check if a date string is today
function isToday(isoString) {
  if (!isoString) return false
  const d = new Date(isoString)
  const now = new Date()
  return d.toDateString() === now.toDateString()
}

// Check if a date string was yesterday
function isYesterday(isoString) {
  if (!isoString) return false
  const d = new Date(isoString)
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return d.toDateString() === yesterday.toDateString()
}

export function useProgress() {
  const [, forceUpdate] = useState(0)

  const refresh = useCallback(() => forceUpdate(n => n + 1), [])

  const getProgress = useCallback(() => {
    return {
      week: readJSON(KEYS.week, 1),
      day: readJSON(KEYS.day, 1),
      sessions: readJSON(KEYS.sessions, []),
      streak: readJSON(KEYS.streak, 0),
      lastSession: localStorage.getItem(KEYS.lastSession) || null
    }
  }, [])

  const saveSession = useCallback((session) => {
    const sessions = readJSON(KEYS.sessions, [])
    sessions.push(session)
    writeJSON(KEYS.sessions, sessions)

    // Read lastSession BEFORE updating it — used for streak + day progression
    const lastSession = localStorage.getItem(KEYS.lastSession)
    const isNewDay = !isToday(lastSession)

    // Update streak
    let streak = readJSON(KEYS.streak, 0)
    if (isToday(lastSession)) {
      // Already did a session today — streak unchanged
    } else if (isYesterday(lastSession)) {
      streak += 1
    } else {
      // Missed a day or first session
      streak = 1
    }
    writeJSON(KEYS.streak, streak)
    localStorage.setItem(KEYS.lastSession, new Date().toISOString())

    // Auto-advance program day/week on first session of a new calendar day
    if (isNewDay) {
      let day = readJSON(KEYS.day, 1)
      let week = readJSON(KEYS.week, 1)
      // Don't auto-advance if already on maintenance
      if (week !== 'maintenance') {
        day += 1
        if (day > 7) {
          day = 1
          week = Math.min(week + 1, 12) // cap at week 12; user switches to maintenance manually
        }
        writeJSON(KEYS.day, day)
        writeJSON(KEYS.week, week)
      }
    }

    refresh()
  }, [refresh])

  const getSettings = useCallback(() => {
    return readJSON(KEYS.settings, DEFAULT_SETTINGS)
  }, [])

  const saveSettings = useCallback((obj) => {
    writeJSON(KEYS.settings, obj)
    refresh()
  }, [refresh])

  // Manually set the active week (1–12 or 'maintenance') — resets day to 1
  const setWeek = useCallback((week) => {
    const value = week === 'maintenance' ? 'maintenance' : Math.min(Math.max(week, 1), 12)
    writeJSON(KEYS.week, value)
    writeJSON(KEYS.day, 1)
    refresh()
  }, [refresh])

  const resetProgress = useCallback(() => {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k))
    refresh()
  }, [refresh])

  const getTodaySessions = useCallback(() => {
    const sessions = readJSON(KEYS.sessions, [])
    return sessions.filter(s => isToday(s.date))
  }, [])

  const getWeekSessions = useCallback(() => {
    const week = readJSON(KEYS.week, 1)
    const sessions = readJSON(KEYS.sessions, [])
    return sessions.filter(s => s.week === week)
  }, [])

  // Returns array of 7 objects for Mon–Sun of the current week
  // Each: { date: Date, label: 'Mon', sessionCount: number, isToday: bool }
  const getWeekCalendar = useCallback(() => {
    const sessions = readJSON(KEYS.sessions, [])
    const now = new Date()
    // Get Monday of current week
    const dayOfWeek = now.getDay() === 0 ? 6 : now.getDay() - 1 // 0=Mon
    const monday = new Date(now)
    monday.setDate(now.getDate() - dayOfWeek)
    monday.setHours(0, 0, 0, 0)

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    return days.map((label, i) => {
      const date = new Date(monday)
      date.setDate(monday.getDate() + i)
      const dateStr = date.toDateString()
      const count = sessions.filter(s => new Date(s.date).toDateString() === dateStr).length
      return {
        date,
        label,
        sessionCount: count,
        isToday: date.toDateString() === now.toDateString()
      }
    })
  }, [])

  // All-time aggregate stats
  const getAllTimeStats = useCallback(() => {
    const sessions = readJSON(KEYS.sessions, [])
    return {
      totalSessions: sessions.length,
      totalReps: sessions.reduce((sum, s) => sum + (s.totalReps || 0), 0),
      totalMinutes: Math.floor(
        sessions.reduce((sum, s) => sum + (s.durationSeconds || 0), 0) / 60
      )
    }
  }, [])

  return {
    getProgress,
    saveSession,
    getSettings,
    saveSettings,
    setWeek,
    resetProgress,
    getTodaySessions,
    getWeekSessions,
    getWeekCalendar,
    getAllTimeStats
  }
}
