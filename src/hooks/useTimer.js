import { useState, useRef, useCallback, useEffect } from 'react'

// useTimer — manages the squeeze/release countdown sequence
// Supports multi-exercise sessions with sets and reps
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
