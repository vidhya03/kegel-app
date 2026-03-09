import { useState, useRef, useCallback, useEffect } from 'react'

// useTimer — manages the squeeze/release countdown sequence
// Supports multi-exercise sessions with sets and reps
// Handles background tab/minimize via Page Visibility API
// Requests Screen Wake Lock to keep screen on during session
export function useTimer({ onPhaseChange, onComplete } = {}) {
  const [timeLeft, setTimeLeft] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [phase, setPhase] = useState('idle') // 'squeeze' | 'release' | 'idle'
  const [currentRep, setCurrentRep] = useState(0)
  const [currentSet, setCurrentSet] = useState(0)
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [sessionComplete, setSessionComplete] = useState(false)

  // Internal refs for interval and mutable state (avoid stale closures)
  const intervalRef = useRef(null)
  const hiddenAtRef = useRef(null)   // timestamp when page was hidden
  const wakeLockRef = useRef(null)   // Screen Wake Lock handle
  const stateRef = useRef({
    exercises: [],
    phase: 'idle',
    timeLeft: 0,
    rep: 0,
    set: 0,
    exerciseIndex: 0,
    isPaused: false
  })

  const clearTick = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  // Transition to a new phase — updates both ref and React state
  const enterPhase = useCallback((newPhase, seconds, rep, set, exerciseIndex) => {
    stateRef.current.phase = newPhase
    stateRef.current.timeLeft = seconds
    stateRef.current.rep = rep
    stateRef.current.set = set
    stateRef.current.exerciseIndex = exerciseIndex

    setPhase(newPhase)
    setTimeLeft(seconds)
    setCurrentRep(rep)
    setCurrentSet(set)
    setCurrentExerciseIndex(exerciseIndex)

    if (onPhaseChange) onPhaseChange(newPhase)
  }, [onPhaseChange])

  // Advance to the next step in the sequence
  const advance = useCallback(() => {
    const { exercises, phase, rep, set, exerciseIndex } = stateRef.current
    const ex = exercises[exerciseIndex]

    if (phase === 'squeeze') {
      // Move to release phase
      enterPhase('release', ex.restSeconds, rep, set, exerciseIndex)
      return
    }

    // Release just ended — move to next rep/set/exercise
    const nextRep = rep + 1

    if (nextRep <= ex.reps) {
      // More reps in this set
      enterPhase('squeeze', ex.holdSeconds, nextRep, set, exerciseIndex)
      return
    }

    // All reps done — move to next set
    const nextSet = set + 1

    if (nextSet <= ex.sets) {
      enterPhase('squeeze', ex.holdSeconds, 1, nextSet, exerciseIndex)
      return
    }

    // All sets done — move to next exercise
    const nextExerciseIndex = exerciseIndex + 1

    if (nextExerciseIndex < exercises.length) {
      const nextEx = exercises[nextExerciseIndex]
      enterPhase('squeeze', nextEx.holdSeconds, 1, 1, nextExerciseIndex)
      return
    }

    // All exercises done — session complete
    clearTick()
    setIsRunning(false)
    setPhase('idle')
    setSessionComplete(true)
    stateRef.current.phase = 'idle'
    if (onComplete) onComplete()
  }, [enterPhase, onComplete])

  // Start the interval tick
  const startTick = useCallback(() => {
    clearTick()
    intervalRef.current = setInterval(() => {
      if (stateRef.current.isPaused) return

      stateRef.current.timeLeft -= 1
      setTimeLeft(stateRef.current.timeLeft)

      if (stateRef.current.timeLeft <= 0) {
        advance()
      }
    }, 1000)
  }, [advance])

  // Public: start a new session with an array of exercises
  const start = useCallback((exercises) => {
    clearTick()
    const ex = exercises[0]
    stateRef.current = {
      exercises,
      phase: 'squeeze',
      timeLeft: ex.holdSeconds,
      rep: 1,
      set: 1,
      exerciseIndex: 0,
      isPaused: false
    }

    setSessionComplete(false)
    setIsRunning(true)
    enterPhase('squeeze', ex.holdSeconds, 1, 1, 0)
    startTick()
  }, [enterPhase, startTick])

  const pause = useCallback(() => {
    stateRef.current.isPaused = true
    setIsRunning(false)
  }, [])

  const resume = useCallback(() => {
    stateRef.current.isPaused = false
    setIsRunning(true)
    // Restart tick if not running (in case it was cleared)
    if (!intervalRef.current) startTick()
  }, [startTick])

  const stop = useCallback(() => {
    clearTick()
    stateRef.current.isPaused = false
    stateRef.current.phase = 'idle'
    setIsRunning(false)
    setPhase('idle')
    setTimeLeft(0)
    setCurrentRep(0)
    setCurrentSet(0)
    setCurrentExerciseIndex(0)
    setSessionComplete(false)
  }, [])

  const skipRep = useCallback(() => {
    // Immediately advance to next rep
    stateRef.current.timeLeft = 0
    advance()
  }, [advance])

  // Screen Wake Lock — keep screen on while session is active
  useEffect(() => {
    if (!isRunning) return
    let released = false

    const acquireWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLockRef.current = await navigator.wakeLock.request('screen')
          wakeLockRef.current.addEventListener('release', () => {
            if (!released) wakeLockRef.current = null
          })
        }
      } catch {
        // Wake lock denied or unsupported — timer still works
      }
    }

    // Re-acquire wake lock after page becomes visible again (browser releases it on hide)
    const handleVisibility = () => {
      if (!document.hidden && isRunning && !wakeLockRef.current) acquireWakeLock()
    }

    acquireWakeLock()
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      released = true
      document.removeEventListener('visibilitychange', handleVisibility)
      if (wakeLockRef.current) {
        wakeLockRef.current.release()
        wakeLockRef.current = null
      }
    }
  }, [isRunning])

  // Page Visibility API — fast-forward timer when returning from background
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        // Record when app went to background
        hiddenAtRef.current = Date.now()
      } else if (hiddenAtRef.current && !stateRef.current.isPaused && stateRef.current.phase !== 'idle') {
        // App returned from background — fast-forward elapsed time
        let elapsed = Math.floor((Date.now() - hiddenAtRef.current) / 1000)
        hiddenAtRef.current = null

        // Drain elapsed seconds through phases
        while (elapsed > 0 && stateRef.current.phase !== 'idle') {
          if (elapsed >= stateRef.current.timeLeft) {
            elapsed -= stateRef.current.timeLeft
            stateRef.current.timeLeft = 0
            advance()
          } else {
            stateRef.current.timeLeft -= elapsed
            elapsed = 0
          }
        }
        setTimeLeft(stateRef.current.timeLeft)
      }
    }

    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [advance])

  // Cleanup interval on unmount
  useEffect(() => () => clearTick(), [])

  return {
    timeLeft,
    isRunning,
    phase,
    currentRep,
    currentSet,
    currentExerciseIndex,
    sessionComplete,
    start,
    pause,
    resume,
    stop,
    skipRep
  }
}
