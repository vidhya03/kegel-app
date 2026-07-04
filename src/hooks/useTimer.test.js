import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTimer } from './useTimer'

describe('useTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  const singleExercise = [
    { id: 'test', holdSeconds: 3, restSeconds: 2, reps: 2, sets: 1 }
  ]

  it('starts in idle state', () => {
    const { result } = renderHook(() => useTimer())

    expect(result.current.phase).toBe('idle')
    expect(result.current.isRunning).toBe(false)
    expect(result.current.timeLeft).toBe(0)
    expect(result.current.currentRep).toBe(0)
    expect(result.current.currentSet).toBe(0)
    expect(result.current.sessionComplete).toBe(false)
  })

  it('starts session with squeeze phase', () => {
    const { result } = renderHook(() => useTimer())

    act(() => {
      result.current.start(singleExercise)
    })

    expect(result.current.phase).toBe('squeeze')
    expect(result.current.isRunning).toBe(true)
    expect(result.current.timeLeft).toBe(3)
    expect(result.current.currentRep).toBe(1)
    expect(result.current.currentSet).toBe(1)
    expect(result.current.currentExerciseIndex).toBe(0)
  })

  it('counts down each second', () => {
    const { result } = renderHook(() => useTimer())

    act(() => {
      result.current.start(singleExercise)
    })

    act(() => { vi.advanceTimersByTime(1000) })
    expect(result.current.timeLeft).toBe(2)

    act(() => { vi.advanceTimersByTime(1000) })
    expect(result.current.timeLeft).toBe(1)
  })

  it('transitions from squeeze to release after hold time', () => {
    const { result } = renderHook(() => useTimer())

    act(() => {
      result.current.start(singleExercise)
    })

    // Advance through 3s hold
    act(() => { vi.advanceTimersByTime(3000) })

    expect(result.current.phase).toBe('release')
    expect(result.current.timeLeft).toBe(2)
  })

  it('transitions from release to next rep squeeze', () => {
    const { result } = renderHook(() => useTimer())

    act(() => {
      result.current.start(singleExercise)
    })

    // Squeeze phase (3s) + Release phase (2s)
    act(() => { vi.advanceTimersByTime(5000) })

    expect(result.current.phase).toBe('squeeze')
    expect(result.current.currentRep).toBe(2)
    expect(result.current.timeLeft).toBe(3)
  })

  it('completes session after all reps and sets', () => {
    const onComplete = vi.fn()
    const { result } = renderHook(() => useTimer({ onComplete }))

    act(() => {
      result.current.start(singleExercise)
    })

    // 2 reps * (3s hold + 2s rest) = 10s total
    act(() => { vi.advanceTimersByTime(10000) })

    expect(result.current.sessionComplete).toBe(true)
    expect(result.current.phase).toBe('idle')
    expect(result.current.isRunning).toBe(false)
    expect(onComplete).toHaveBeenCalledOnce()
  })

  it('handles multiple sets', () => {
    const exercises = [
      { id: 'test', holdSeconds: 2, restSeconds: 1, reps: 1, sets: 2 }
    ]
    const { result } = renderHook(() => useTimer())

    act(() => {
      result.current.start(exercises)
    })

    // Set 1, rep 1: 2s squeeze + 1s release
    act(() => { vi.advanceTimersByTime(3000) })
    expect(result.current.currentSet).toBe(2)
    expect(result.current.currentRep).toBe(1)

    // Set 2, rep 1: 2s squeeze + 1s release
    act(() => { vi.advanceTimersByTime(3000) })
    expect(result.current.sessionComplete).toBe(true)
  })

  it('handles multiple exercises', () => {
    const exercises = [
      { id: 'ex1', holdSeconds: 2, restSeconds: 1, reps: 1, sets: 1 },
      { id: 'ex2', holdSeconds: 3, restSeconds: 1, reps: 1, sets: 1 }
    ]
    const { result } = renderHook(() => useTimer())

    act(() => {
      result.current.start(exercises)
    })

    // Exercise 1: 2s squeeze + 1s release
    act(() => { vi.advanceTimersByTime(3000) })
    expect(result.current.currentExerciseIndex).toBe(1)
    expect(result.current.phase).toBe('squeeze')
    expect(result.current.timeLeft).toBe(3)

    // Exercise 2: 3s squeeze + 1s release
    act(() => { vi.advanceTimersByTime(4000) })
    expect(result.current.sessionComplete).toBe(true)
  })

  it('calls onPhaseChange on each phase transition', () => {
    const onPhaseChange = vi.fn()
    const { result } = renderHook(() => useTimer({ onPhaseChange }))

    act(() => {
      result.current.start(singleExercise)
    })

    // Initial squeeze
    expect(onPhaseChange).toHaveBeenCalledWith('squeeze', singleExercise[0])
    onPhaseChange.mockClear()

    // After hold time -> release
    act(() => { vi.advanceTimersByTime(3000) })
    expect(onPhaseChange).toHaveBeenCalledWith('release', singleExercise[0])
  })

  describe('pause / resume', () => {
    it('pauses the timer', () => {
      const { result } = renderHook(() => useTimer())

      act(() => {
        result.current.start(singleExercise)
      })

      act(() => { vi.advanceTimersByTime(1000) })
      expect(result.current.timeLeft).toBe(2)

      act(() => {
        result.current.pause()
      })

      expect(result.current.isRunning).toBe(false)

      // Time should not advance while paused
      act(() => { vi.advanceTimersByTime(2000) })
      expect(result.current.timeLeft).toBe(2)
    })

    it('resumes the timer after pause', () => {
      const { result } = renderHook(() => useTimer())

      act(() => {
        result.current.start(singleExercise)
      })

      act(() => { vi.advanceTimersByTime(1000) })
      act(() => { result.current.pause() })
      act(() => { vi.advanceTimersByTime(5000) })

      expect(result.current.timeLeft).toBe(2)

      act(() => { result.current.resume() })
      act(() => { vi.advanceTimersByTime(1000) })

      expect(result.current.timeLeft).toBe(1)
    })
  })

  describe('stop', () => {
    it('resets everything to idle', () => {
      const { result } = renderHook(() => useTimer())

      act(() => {
        result.current.start(singleExercise)
      })

      act(() => { vi.advanceTimersByTime(1000) })

      act(() => {
        result.current.stop()
      })

      expect(result.current.phase).toBe('idle')
      expect(result.current.isRunning).toBe(false)
      expect(result.current.timeLeft).toBe(0)
      expect(result.current.currentRep).toBe(0)
      expect(result.current.currentSet).toBe(0)
      expect(result.current.sessionComplete).toBe(false)
    })
  })

  describe('skipRep', () => {
    it('advances to the next phase immediately', () => {
      const { result } = renderHook(() => useTimer())

      act(() => {
        result.current.start(singleExercise)
      })

      expect(result.current.phase).toBe('squeeze')

      act(() => {
        result.current.skipRep()
      })

      expect(result.current.phase).toBe('release')
    })
  })
})
