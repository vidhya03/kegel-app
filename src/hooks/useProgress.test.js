import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useProgress } from './useProgress'

describe('useProgress', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('getProgress', () => {
    it('returns defaults when localStorage is empty', () => {
      const { result } = renderHook(() => useProgress())
      const progress = result.current.getProgress()
      expect(progress.week).toBe(1)
      expect(progress.day).toBe(1)
      expect(progress.sessions).toEqual([])
      expect(progress.streak).toBe(0)
      expect(progress.lastSession).toBeNull()
    })

    it('reads stored values from localStorage', () => {
      localStorage.setItem('kc_current_week', '3')
      localStorage.setItem('kc_current_day', '5')
      localStorage.setItem('kc_sessions', JSON.stringify([{ id: 1 }]))
      localStorage.setItem('kc_streak', '7')
      localStorage.setItem('kc_last_session', '2025-01-01T00:00:00.000Z')

      const { result } = renderHook(() => useProgress())
      const progress = result.current.getProgress()
      expect(progress.week).toBe(3)
      expect(progress.day).toBe(5)
      expect(progress.sessions).toEqual([{ id: 1 }])
      expect(progress.streak).toBe(7)
      expect(progress.lastSession).toBe('2025-01-01T00:00:00.000Z')
    })
  })

  describe('getSettings / saveSettings', () => {
    it('returns default settings when none saved', () => {
      const { result } = renderHook(() => useProgress())
      const settings = result.current.getSettings()
      expect(settings.soundEnabled).toBe(true)
      expect(settings.soundType).toBe('voice')
      expect(settings.volume).toBe(0.7)
      expect(settings.vibrationEnabled).toBe(true)
      expect(settings.reminderEnabled).toBe(false)
      expect(settings.reminderTime).toBe('08:00')
    })

    it('saves and retrieves custom settings', () => {
      const { result } = renderHook(() => useProgress())
      const custom = { soundEnabled: false, soundType: 'tones', volume: 0.5 }

      act(() => {
        result.current.saveSettings(custom)
      })

      const stored = JSON.parse(localStorage.getItem('kc_settings'))
      expect(stored.soundEnabled).toBe(false)
      expect(stored.soundType).toBe('tones')
      expect(stored.volume).toBe(0.5)
    })
  })

  describe('saveSession', () => {
    it('appends session to stored sessions', () => {
      const { result } = renderHook(() => useProgress())
      const session = { date: new Date().toISOString(), week: 1, totalReps: 20 }

      act(() => {
        result.current.saveSession(session)
      })

      const sessions = JSON.parse(localStorage.getItem('kc_sessions'))
      expect(sessions).toHaveLength(1)
      expect(sessions[0].totalReps).toBe(20)
    })

    it('sets streak to 1 on first session', () => {
      const { result } = renderHook(() => useProgress())

      act(() => {
        result.current.saveSession({ date: new Date().toISOString(), week: 1 })
      })

      expect(JSON.parse(localStorage.getItem('kc_streak'))).toBe(1)
    })

    it('does not change streak for second session same day', () => {
      const { result } = renderHook(() => useProgress())

      act(() => {
        result.current.saveSession({ date: new Date().toISOString(), week: 1 })
      })

      act(() => {
        result.current.saveSession({ date: new Date().toISOString(), week: 1 })
      })

      expect(JSON.parse(localStorage.getItem('kc_streak'))).toBe(1)
    })

    it('increments streak for consecutive day session', () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      localStorage.setItem('kc_last_session', yesterday.toISOString())
      localStorage.setItem('kc_streak', '3')

      const { result } = renderHook(() => useProgress())

      act(() => {
        result.current.saveSession({ date: new Date().toISOString(), week: 1 })
      })

      expect(JSON.parse(localStorage.getItem('kc_streak'))).toBe(4)
    })

    it('resets streak to 1 after a missed day', () => {
      const twoDaysAgo = new Date()
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)
      localStorage.setItem('kc_last_session', twoDaysAgo.toISOString())
      localStorage.setItem('kc_streak', '5')

      const { result } = renderHook(() => useProgress())

      act(() => {
        result.current.saveSession({ date: new Date().toISOString(), week: 1 })
      })

      expect(JSON.parse(localStorage.getItem('kc_streak'))).toBe(1)
    })

    it('updates kc_last_session to current time', () => {
      const { result } = renderHook(() => useProgress())

      act(() => {
        result.current.saveSession({ date: new Date().toISOString(), week: 1 })
      })

      const last = localStorage.getItem('kc_last_session')
      expect(last).toBeTruthy()
      const diff = Date.now() - new Date(last).getTime()
      expect(diff).toBeLessThan(5000)
    })

    it('auto-advances day on first session of a new calendar day', () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      localStorage.setItem('kc_last_session', yesterday.toISOString())
      localStorage.setItem('kc_current_day', '3')
      localStorage.setItem('kc_current_week', '1')

      const { result } = renderHook(() => useProgress())

      act(() => {
        result.current.saveSession({ date: new Date().toISOString(), week: 1 })
      })

      expect(JSON.parse(localStorage.getItem('kc_current_day'))).toBe(4)
    })

    it('advances week when day exceeds 7', () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      localStorage.setItem('kc_last_session', yesterday.toISOString())
      localStorage.setItem('kc_current_day', '7')
      localStorage.setItem('kc_current_week', '2')

      const { result } = renderHook(() => useProgress())

      act(() => {
        result.current.saveSession({ date: new Date().toISOString(), week: 2 })
      })

      expect(JSON.parse(localStorage.getItem('kc_current_day'))).toBe(1)
      expect(JSON.parse(localStorage.getItem('kc_current_week'))).toBe(3)
    })

    it('caps week at 12', () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      localStorage.setItem('kc_last_session', yesterday.toISOString())
      localStorage.setItem('kc_current_day', '7')
      localStorage.setItem('kc_current_week', '12')

      const { result } = renderHook(() => useProgress())

      act(() => {
        result.current.saveSession({ date: new Date().toISOString(), week: 12 })
      })

      expect(JSON.parse(localStorage.getItem('kc_current_week'))).toBe(12)
      expect(JSON.parse(localStorage.getItem('kc_current_day'))).toBe(1)
    })

    it('does not auto-advance when on maintenance', () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      localStorage.setItem('kc_last_session', yesterday.toISOString())
      localStorage.setItem('kc_current_week', JSON.stringify('maintenance'))
      localStorage.setItem('kc_current_day', '3')

      const { result } = renderHook(() => useProgress())

      act(() => {
        result.current.saveSession({ date: new Date().toISOString(), week: 'maintenance' })
      })

      expect(JSON.parse(localStorage.getItem('kc_current_day'))).toBe(3)
    })
  })

  describe('setWeek', () => {
    it('sets week and resets day to 1', () => {
      localStorage.setItem('kc_current_day', '5')

      const { result } = renderHook(() => useProgress())

      act(() => {
        result.current.setWeek(3)
      })

      expect(JSON.parse(localStorage.getItem('kc_current_week'))).toBe(3)
      expect(JSON.parse(localStorage.getItem('kc_current_day'))).toBe(1)
    })

    it('clamps week to 1-12 range', () => {
      const { result } = renderHook(() => useProgress())

      act(() => {
        result.current.setWeek(0)
      })
      expect(JSON.parse(localStorage.getItem('kc_current_week'))).toBe(1)

      act(() => {
        result.current.setWeek(99)
      })
      expect(JSON.parse(localStorage.getItem('kc_current_week'))).toBe(12)
    })

    it('accepts maintenance as week value', () => {
      const { result } = renderHook(() => useProgress())

      act(() => {
        result.current.setWeek('maintenance')
      })

      expect(JSON.parse(localStorage.getItem('kc_current_week'))).toBe('maintenance')
    })
  })

  describe('resetProgress', () => {
    it('removes all kc_ keys from localStorage', () => {
      localStorage.setItem('kc_current_week', '3')
      localStorage.setItem('kc_current_day', '5')
      localStorage.setItem('kc_sessions', '[]')
      localStorage.setItem('kc_streak', '2')
      localStorage.setItem('kc_last_session', '2025-01-01')
      localStorage.setItem('kc_settings', '{}')

      const { result } = renderHook(() => useProgress())

      act(() => {
        result.current.resetProgress()
      })

      expect(localStorage.getItem('kc_current_week')).toBeNull()
      expect(localStorage.getItem('kc_current_day')).toBeNull()
      expect(localStorage.getItem('kc_sessions')).toBeNull()
      expect(localStorage.getItem('kc_streak')).toBeNull()
      expect(localStorage.getItem('kc_last_session')).toBeNull()
      expect(localStorage.getItem('kc_settings')).toBeNull()
    })
  })

  describe('getTodaySessions', () => {
    it('returns only sessions from today', () => {
      const today = new Date().toISOString()
      const yesterday = new Date(Date.now() - 86400000).toISOString()
      localStorage.setItem('kc_sessions', JSON.stringify([
        { date: today, id: 1 },
        { date: yesterday, id: 2 },
        { date: today, id: 3 }
      ]))

      const { result } = renderHook(() => useProgress())
      const todaySessions = result.current.getTodaySessions()
      expect(todaySessions).toHaveLength(2)
      expect(todaySessions.map(s => s.id)).toEqual([1, 3])
    })
  })

  describe('getWeekSessions', () => {
    it('returns sessions matching current week', () => {
      localStorage.setItem('kc_current_week', '2')
      localStorage.setItem('kc_sessions', JSON.stringify([
        { week: 1, id: 1 },
        { week: 2, id: 2 },
        { week: 2, id: 3 },
        { week: 3, id: 4 }
      ]))

      const { result } = renderHook(() => useProgress())
      const weekSessions = result.current.getWeekSessions()
      expect(weekSessions).toHaveLength(2)
      expect(weekSessions.map(s => s.id)).toEqual([2, 3])
    })
  })

  describe('getAllTimeStats', () => {
    it('returns zeros for no sessions', () => {
      const { result } = renderHook(() => useProgress())
      const stats = result.current.getAllTimeStats()
      expect(stats.totalSessions).toBe(0)
      expect(stats.totalReps).toBe(0)
      expect(stats.totalMinutes).toBe(0)
    })

    it('aggregates stats from multiple sessions', () => {
      localStorage.setItem('kc_sessions', JSON.stringify([
        { totalReps: 20, durationSeconds: 120 },
        { totalReps: 30, durationSeconds: 180 },
        { totalReps: 10, durationSeconds: 60 }
      ]))

      const { result } = renderHook(() => useProgress())
      const stats = result.current.getAllTimeStats()
      expect(stats.totalSessions).toBe(3)
      expect(stats.totalReps).toBe(60)
      expect(stats.totalMinutes).toBe(6)
    })

    it('handles sessions with missing fields', () => {
      localStorage.setItem('kc_sessions', JSON.stringify([
        { totalReps: 10 },
        { durationSeconds: 120 }
      ]))

      const { result } = renderHook(() => useProgress())
      const stats = result.current.getAllTimeStats()
      expect(stats.totalSessions).toBe(2)
      expect(stats.totalReps).toBe(10)
      expect(stats.totalMinutes).toBe(2)
    })
  })

  describe('getWeekCalendar', () => {
    it('returns 7 day entries for the current week', () => {
      const { result } = renderHook(() => useProgress())
      const cal = result.current.getWeekCalendar()
      expect(cal).toHaveLength(7)
      expect(cal[0].label).toBe('Mon')
      expect(cal[6].label).toBe('Sun')
    })

    it('marks exactly one day as today', () => {
      const { result } = renderHook(() => useProgress())
      const cal = result.current.getWeekCalendar()
      const todayCount = cal.filter(d => d.isToday).length
      expect(todayCount).toBe(1)
    })

    it('counts sessions per day correctly', () => {
      const today = new Date()
      const dateStr = today.toISOString()
      localStorage.setItem('kc_sessions', JSON.stringify([
        { date: dateStr },
        { date: dateStr }
      ]))

      const { result } = renderHook(() => useProgress())
      const cal = result.current.getWeekCalendar()
      const todayEntry = cal.find(d => d.isToday)
      expect(todayEntry.sessionCount).toBe(2)
    })
  })
})
