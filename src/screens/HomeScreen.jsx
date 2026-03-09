import { useMemo } from 'react'
import StatCard from '../components/StatCard'
import { PROGRAM, estimateDuration } from '../data/program'

// HomeScreen — shows today's workout, stats, and start button
export default function HomeScreen({ onStart, progress, todaySessions }) {
  const week = progress.week
  const day = progress.day
  const weekKey = `week${week}`
  const weekData = PROGRAM[weekKey]
  const dayData = weekData?.days?.[day - 1]
  const exercises = dayData?.exercises || []
  const sessionsPerDay = dayData?.sessionsPerDay || 2
  const doneToday = todaySessions.length

  const totalMinutes = useMemo(() => {
    const allSessions = progress.sessions || []
    const total = allSessions.reduce((sum, s) => sum + (s.durationSeconds || 0), 0)
    return Math.floor(total / 60)
  }, [progress.sessions])

  const weekSessions = useMemo(() => {
    const all = progress.sessions || []
    return all.filter(s => s.week === week).length
  }, [progress.sessions, week])

  const duration = estimateDuration(exercises)
  const alreadyDoneTarget = doneToday >= sessionsPerDay

  return (
    <div className="screen">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--cds-text-primary)' }}>KegelCoach</h1>
      </div>

      {/* Week badge */}
      <div style={{ marginBottom: '1.25rem' }}>
        <span className="week-badge">Week {week} · Day {day}</span>
        <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--cds-text-secondary)' }}>
          {weekData?.goal}
        </p>
      </div>

      {/* Today's workout card */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--cds-text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Today's Workout
        </h2>
        {exercises.map(ex => (
          <div key={ex.id} className="exercise-card">
            <div className="exercise-card__name">{ex.name}</div>
            <div className="exercise-card__meta">
              {ex.holdSeconds}s hold · {ex.restSeconds}s rest · {ex.reps} reps · {ex.sets} sets
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--cds-text-secondary)', marginTop: '0.25rem' }}>
              {ex.description}
            </div>
          </div>
        ))}
        <div style={{ fontSize: '0.8125rem', color: 'var(--cds-text-secondary)', marginTop: '0.5rem' }}>
          Estimated duration: ~{duration} min
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <StatCard value={progress.streak || 0} label="Day Streak" />
        <StatCard value={`${weekSessions}/${sessionsPerDay * 7}`} label="This Week" />
        <StatCard value={`${totalMinutes}m`} label="Total Time" />
      </div>

      {/* Done today status */}
      {alreadyDoneTarget && (
        <div style={{
          padding: '0.75rem 1rem',
          background: 'var(--cds-layer-01)',
          border: '1px solid var(--cds-support-success)',
          color: 'var(--cds-support-success)',
          fontSize: '0.875rem',
          marginBottom: '0.75rem'
        }}>
          Well done! Target sessions complete today ({doneToday}/{sessionsPerDay})
        </div>
      )}

      {/* Start button */}
      <button
        className="cds--btn cds--btn--primary"
        style={{ width: '100%', maxWidth: '100%', justifyContent: 'center', fontSize: '1rem', padding: '1rem' }}
        onClick={onStart}
      >
        {alreadyDoneTarget ? 'Do Another Session' : 'Start Session'}
      </button>
    </div>
  )
}
