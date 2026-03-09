import { useMemo } from 'react'
import StatCard from '../components/StatCard'
import { PROGRAM, estimateDuration } from '../data/program'

const WEEKS = [
  { week: 1, label: 'Week 1', name: 'Foundation', difficulty: 1 },
  { week: 2, label: 'Week 2', name: 'Endurance',  difficulty: 2 },
  { week: 3, label: 'Week 3', name: 'Strength',   difficulty: 3 },
  { week: 4, label: 'Week 4', name: 'Power',       difficulty: 4 },
]

function DifficultyDots({ level }) {
  return (
    <span style={{ display: 'inline-flex', gap: '3px', verticalAlign: 'middle' }}>
      {[1, 2, 3, 4].map(i => (
        <span
          key={i}
          style={{
            width: 6, height: 6, borderRadius: '50%',
            background: i <= level ? 'currentColor' : 'var(--cds-border-subtle-01)',
            display: 'inline-block'
          }}
        />
      ))}
    </span>
  )
}

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
  const activeWeekMeta = WEEKS.find(w => w.week === week)

  return (
    <div className="screen">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--cds-text-primary)' }}>KegelCoach</h1>
        <span style={{ fontSize: '0.8125rem', color: 'var(--cds-text-secondary)' }}>Day {day}</span>
      </div>

      {/* Week selector — tab strip */}
      <div style={{
        background: 'var(--cds-layer-01)',
        border: '1px solid var(--cds-border-subtle-01)',
        marginBottom: '1rem'
      }}>
        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--cds-border-subtle-01)' }}>
          {WEEKS.map(w => {
            const isActive = week === w.week
            return (
              <button
                key={w.week}
                onClick={() => onSetWeek(w.week)}
                style={{
                  flex: 1,
                  padding: '0.75rem 0',
                  background: 'none',
                  border: 'none',
                  borderBottom: isActive ? '3px solid var(--cds-interactive)' : '3px solid transparent',
                  marginBottom: -1,
                  color: isActive ? 'var(--cds-interactive)' : 'var(--cds-text-secondary)',
                  fontWeight: isActive ? 700 : 400,
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                  transition: 'color 0.15s, border-color 0.15s',
                  whiteSpace: 'nowrap'
                }}
              >
                {w.label}
              </button>
            )
          })}
        </div>

        {/* Active week info panel — fixed height, no layout shift */}
        <div style={{ padding: '0.75rem 1rem', minHeight: '4rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--cds-text-primary)', marginBottom: '0.2rem' }}>
              {activeWeekMeta?.name}
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--cds-text-secondary)' }}>
              {weekData?.goal}
            </div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '1rem' }}>
            <div style={{ fontSize: '0.6875rem', color: 'var(--cds-text-secondary)', marginBottom: '0.25rem' }}>Difficulty</div>
            <div style={{ color: 'var(--cds-interactive)' }}>
              <DifficultyDots level={activeWeekMeta?.difficulty} />
            </div>
          </div>
        </div>
      </div>

      {/* Exercise list — scrollable, fixed max-height to prevent layout shift */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--cds-text-secondary)', marginBottom: '0.5rem' }}>
          Exercises · {exercises.length} · ~{duration} min
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
          {exercises.map((ex, i) => (
            <div key={ex.id} style={{
              background: 'var(--cds-layer-01)',
              border: '1px solid var(--cds-border-subtle-01)',
              padding: '0.875rem 1rem',
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'flex-start'
            }}>
              {/* Exercise number badge */}
              <div style={{
                width: 24, height: 24, flexShrink: 0,
                background: 'var(--cds-interactive)',
                color: '#fff',
                fontSize: '0.75rem',
                fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {i + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--cds-text-primary)', marginBottom: '0.25rem' }}>
                  {ex.name}
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--cds-text-secondary)', marginBottom: '0.25rem' }}>
                  {ex.holdSeconds}s hold · {ex.restSeconds}s rest · {ex.reps} reps · {ex.sets} sets
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--cds-text-secondary)', fontStyle: 'italic' }}>
                  {ex.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <StatCard value={progress.streak || 0} label="Day Streak" />
        <StatCard value={`${weekSessions}/${sessionsPerDay * 7}`} label="This Week" />
        <StatCard value={`${totalMinutes}m`} label="Total Time" />
      </div>

      {/* Done today banner */}
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
