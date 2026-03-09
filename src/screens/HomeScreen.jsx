import { useMemo } from 'react'
import StatCard from '../components/StatCard'
import { PROGRAM, estimateDuration } from '../data/program'

const WEEK_LABELS = [
  { week: 1, short: 'Wk 1', label: 'Foundation', difficulty: '●○○○' },
  { week: 2, short: 'Wk 2', label: 'Endurance',  difficulty: '●●○○' },
  { week: 3, short: 'Wk 3', label: 'Strength',   difficulty: '●●●○' },
  { week: 4, short: 'Wk 4', label: 'Power',       difficulty: '●●●●' },
]

// HomeScreen — shows today's workout, week selector, stats, and start button
export default function HomeScreen({ onStart, onSetWeek, progress, todaySessions }) {
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
        <span style={{ fontSize: '0.75rem', color: 'var(--cds-text-secondary)' }}>Day {day}</span>
      </div>

      {/* Week selector tabs */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--cds-text-secondary)', marginBottom: '0.5rem' }}>
          Choose Program Week
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.375rem' }}>
          {WEEK_LABELS.map(w => {
            const isActive = week === w.week
            return (
              <button
                key={w.week}
                onClick={() => onSetWeek(w.week)}
                style={{
                  padding: '0.625rem 0.25rem',
                  background: isActive ? 'var(--cds-interactive)' : 'var(--cds-layer-01)',
                  border: `1px solid ${isActive ? 'var(--cds-interactive)' : 'var(--cds-border-subtle-01)'}`,
                  color: isActive ? '#fff' : 'var(--cds-text-secondary)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.15s'
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.2rem' }}>{w.short}</div>
                <div style={{ fontSize: '0.625rem', opacity: 0.85 }}>{w.label}</div>
                <div style={{ fontSize: '0.625rem', marginTop: '0.2rem', letterSpacing: '-1px', color: isActive ? 'rgba(255,255,255,0.7)' : 'var(--cds-text-secondary)' }}>
                  {w.difficulty}
                </div>
              </button>
            )
          })}
        </div>

        {/* Selected week goal */}
        <p style={{ marginTop: '0.625rem', fontSize: '0.875rem', color: 'var(--cds-text-secondary)' }}>
          <span style={{ color: 'var(--cds-interactive)', fontWeight: 600 }}>{weekData?.label}</span>
          {' — '}{weekData?.goal}
        </p>
      </div>

      {/* Today's workout card */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--cds-text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Exercises · {exercises.length} total
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
