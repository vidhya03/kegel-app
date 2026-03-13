import { useEffect, useRef, useState } from 'react'
import CircularTimer from '../components/CircularTimer'
import PhaseLabel from '../components/PhaseLabel'
import { useTimer } from '../hooks/useTimer'
import { useSound } from '../hooks/useSound'
import { useVibration } from '../hooks/useVibration'
import { PROGRAM } from '../data/program'

// SessionScreen — real-time timer with squeeze/release phases
// exercises prop: specific selection from HomeScreen, falls back to full week program
export default function SessionScreen({ onComplete, onStop, settings, progress, exercises: exercisesProp }) {
  const startTimeRef = useRef(Date.now())
  const [paused, setPaused] = useState(false)
  const [totalReps, setTotalReps] = useState(0)

  const sound = useSound(settings)
  const vibration = useVibration(settings)

  const weekKey = `week${progress.week}`
  const dayData = PROGRAM[weekKey]?.days?.[progress.day - 1]
  const exercises = exercisesProp || dayData?.exercises || []

  // On mount: start keep-alive audio + pre-schedule ALL tones for the full session.
  // Pre-scheduling uses AudioContext's native clock which runs even when iOS is locked.
  // Voice mode can't be pre-scheduled, so it falls back to handlePhaseChange.
  useEffect(() => {
    const init = async () => {
      await sound.startKeepAlive()
      sound.scheduleAllSounds(exercises)
    }
    init()

    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: 'Kegel Session',
        artist: 'KegelCoach',
      })
      navigator.mediaSession.playbackState = 'playing'
    }

    return () => {
      sound.stopKeepAlive() // also cancels scheduled sounds
      if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'none'
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handlePhaseChange = (phase) => {
    if (phase === 'squeeze') {
      // Tones are pre-scheduled — only play here for voice mode to avoid double-play
      if (settings.soundType === 'voice') sound.playSqueezeSound()
      vibration.vibrateOnSqueeze()
    } else if (phase === 'release') {
      if (settings.soundType === 'voice') sound.playReleaseSound()
      vibration.vibrateOnRelease()
      setTotalReps(r => r + 1)
    }
  }

  const handleComplete = () => {
    sound.playCompleteSound()
    const durationSeconds = Math.round((Date.now() - startTimeRef.current) / 1000)
    const ex = exercises
    const exercisesCompleted = ex.length
    const allReps = ex.reduce((sum, e) => sum + e.sets * e.reps, 0)

    onComplete({
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      week: progress.week,
      day: progress.day,
      exercisesCompleted,
      totalReps: allReps,
      durationSeconds
    })
  }

  const timer = useTimer({ onPhaseChange: handlePhaseChange, onComplete: handleComplete })

  // Auto-start on mount
  useEffect(() => {
    if (exercises.length > 0) {
      timer.start(exercises)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const currentEx = exercises[timer.currentExerciseIndex] || exercises[0]
  const totalSeconds = timer.phase === 'squeeze'
    ? (currentEx?.holdSeconds || 1)
    : (currentEx?.restSeconds || 1)

  // Total progress across entire session
  const totalSteps = exercises.reduce((sum, ex) => sum + ex.sets * ex.reps * 2, 0) // *2 for squeeze+release
  const completedSteps = exercises.slice(0, timer.currentExerciseIndex).reduce(
    (sum, ex) => sum + ex.sets * ex.reps * 2, 0
  ) + (timer.currentSet - 1) * (currentEx?.reps || 0) * 2 + (timer.currentRep - 1) * 2 +
    (timer.phase === 'release' ? 1 : 0)
  const overallProgress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0

  const handlePause = () => {
    timer.pause()
    sound.cancelScheduledSounds()
    setPaused(true)
  }

  const handleResume = () => {
    timer.resume()
    // Re-schedule remaining sounds from current position when resuming
    sound.scheduleAllSounds(exercises.slice(timer.currentExerciseIndex))
    setPaused(false)
  }

  const handleStop = () => {
    timer.stop()
    onStop()
  }

  return (
    <div className="screen" style={{ position: 'relative' }}>
      {/* Top bar */}
      <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
        <div style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--cds-text-primary)' }}>
          {currentEx?.name}
        </div>
        <div style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)' }}>
          Set {timer.currentSet} of {currentEx?.sets} · Exercise {timer.currentExerciseIndex + 1}/{exercises.length}
        </div>
      </div>

      {/* Circular timer */}
      <CircularTimer
        timeLeft={timer.timeLeft}
        totalSeconds={totalSeconds}
        phase={timer.phase}
      />

      {/* Phase label */}
      <PhaseLabel phase={timer.phase} />

      {/* Plain-language cue */}
      <div style={{ textAlign: 'center', marginTop: '0.375rem', fontSize: '0.8125rem', color: 'var(--cds-text-secondary)', fontStyle: 'italic' }}>
        {timer.phase === 'squeeze' ? 'Tighten like stopping pee — hold it' : 'Fully relax — let go completely'}
      </div>

      {/* Rep counter */}
      <div style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '1rem', color: 'var(--cds-text-secondary)' }}>
        Rep {timer.currentRep} / {currentEx?.reps}
      </div>

      {/* Overall progress bar */}
      <div style={{ margin: '1rem 0', height: '4px', background: 'var(--cds-layer-02)' }}>
        <div style={{
          height: '100%',
          width: `${overallProgress}%`,
          background: 'var(--cds-interactive)',
          transition: 'width 0.5s ease'
        }} />
      </div>

      {/* Controls */}
      <div className="session-controls">
        {!paused ? (
          <button className="cds--btn cds--btn--secondary" onClick={handlePause}>
            Pause
          </button>
        ) : (
          <button className="cds--btn cds--btn--primary" onClick={handleResume}>
            Resume
          </button>
        )}
        <button className="cds--btn cds--btn--danger--tertiary" onClick={handleStop}>
          Stop
        </button>
        <button className="cds--btn cds--btn--ghost" onClick={timer.skipRep} style={{ fontSize: '0.8125rem' }}>
          Skip Rep
        </button>
      </div>

      {/* Pause overlay */}
      {paused && (
        <div className="pause-overlay">
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--cds-text-primary)', marginBottom: '0.5rem' }}>
            Paused
          </div>
          <button className="cds--btn cds--btn--primary" style={{ width: '200px', justifyContent: 'center' }} onClick={handleResume}>
            Resume
          </button>
          <button className="cds--btn cds--btn--secondary" style={{ width: '200px', justifyContent: 'center' }} onClick={handleStop}>
            Stop Session
          </button>
        </div>
      )}
    </div>
  )
}
