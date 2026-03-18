import { useMemo, useState } from 'react'
import StatCard from '../components/StatCard'
import HowToModal from '../components/HowToModal'
import { PROGRAM, estimateDuration } from '../data/program'

const WEEKS = [
  { week: 1,  label: 'Week 1',  name: 'Foundation',     difficulty: 1 },
  { week: 2,  label: 'Week 2',  name: 'Endurance',      difficulty: 2 },
  { week: 3,  label: 'Week 3',  name: 'Strength',       difficulty: 3 },
  { week: 4,  label: 'Week 4',  name: 'Power',          difficulty: 4 },
  { week: 5,  label: 'Week 5',  name: 'Strengthening',  difficulty: 4 },
  { week: 6,  label: 'Week 6',  name: 'Elevator',       difficulty: 4 },
  { week: 7,  label: 'Week 7',  name: 'Rep Density',    difficulty: 4 },
  { week: 8,  label: 'Week 8',  name: 'Peak Strength',  difficulty: 4 },
  { week: 9,  label: 'Week 9',  name: 'Consolidation',  difficulty: 4 },
  { week: 10, label: 'Week 10', name: 'Endurance Push', difficulty: 4 },
  { week: 11, label: 'Week 11', name: 'Elite Control',  difficulty: 4 },
  { week: 12,            label: 'Week 12',     name: 'Graduation',     difficulty: 4 },
  { week: 'maintenance', label: 'Maintenance', name: 'For Life',       difficulty: 4 },
]

function DifficultyDots({ level }) {
  return (
    <span style={{ display: 'inline-flex', gap: '3px', verticalAlign: 'middle' }}>
      {[1, 2, 3, 4].map(i => (
        <span key={i} style={{
          width: 6, height: 6, borderRadius: '50%',
          background: i <= level ? 'currentColor' : 'var(--cds-border-subtle-01)',
          display: 'inline-block'
        }} />
      ))}
    </span>
  )
}

// Play button — solid IBM Blue, triangle icon
function PlayBtn({ onClick, label }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      style={{
        flexShrink: 0,
        width: 40, height: 40,
        background: '#0f62fe',
        border: 'none',
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff'
      }}
    >
      {/* Triangle play icon */}
      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
        <path d="M3 2l11 6-11 6z"/>
      </svg>
    </button>
  )
}

// HomeScreen — week selector + exercise rows with inline play buttons + stats
export default function HomeScreen({ onStart, onSetWeek, progress, todaySessions }) {
  const week = progress.week
  const day = progress.day
  const weekKey = week === 'maintenance' ? 'maintenance' : `week${week}`
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

  const alreadyDoneTarget = doneToday >= sessionsPerDay
  const activeWeekMeta = WEEKS.find(w => w.week === week)

  // Auto-show for first-time users (no sessions yet and haven't seen it)
  const isFirstTime = !progress.sessions?.length && !localStorage.getItem('kc_seen_howto')
  const [showHowTo, setShowHowTo] = useState(isFirstTime)

  const handleCloseHowTo = () => {
    localStorage.setItem('kc_seen_howto', '1')
    setShowHowTo(false)
  }

  return (
    <div className="screen">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--cds-text-primary)' }}>KegelCoach</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => setShowHowTo(true)}
            aria-label="How to do Kegel exercises"
            title="How to do Kegel exercises"
            style={{
              background: 'none',
              border: '1px solid var(--cds-interactive)',
              color: 'var(--cds-interactive)',
              padding: '0.25rem 0.625rem',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '0.3rem',
              fontSize: '0.75rem', fontWeight: 600
            }}
          >
            <span style={{ fontSize: '0.875rem', fontWeight: 700, lineHeight: 1 }}>?</span> How to
          </button>
          <span style={{ fontSize: '0.8125rem', color: 'var(--cds-text-secondary)' }}>Day {day}</span>
        </div>
      </div>

      {/* Week selector — scrollable tab strip */}
      <div style={{ background: 'var(--cds-layer-01)', border: '1px solid var(--cds-border-subtle-01)', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', overflowX: 'auto', scrollbarWidth: 'none' }}>
          {WEEKS.map(w => {
            const isActive = week === w.week
            return (
              <button
                key={w.week}
                onClick={() => onSetWeek(w.week)}
                style={{
                  flexShrink: 0,
                  padding: '0.75rem 0.875rem',
                  background: isActive ? '#0f62fe22' : 'transparent',
                  border: 'none',
                  borderBottom: `3px solid ${isActive ? '#0f62fe' : '#393939'}`,
                  color: isActive ? '#0f62fe' : 'var(--cds-text-secondary)',
                  fontWeight: isActive ? 700 : 400,
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                  transition: 'color 0.15s, border-color 0.15s, background 0.15s',
                  whiteSpace: 'nowrap'
                }}
              >
                {w.label}
              </button>
            )
          })}
        </div>

        {/* Week info */}
        <div style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
            <div style={{ color: '#0f62fe' }}>
              <DifficultyDots level={activeWeekMeta?.difficulty} />
            </div>
          </div>
        </div>
      </div>

      {/* Exercise rows with inline play buttons */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--cds-text-secondary)', marginBottom: '0.5rem' }}>
          Choose Exercise
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>

          {/* Full session row */}
          <div style={{
            background: 'var(--cds-layer-01)',
            border: '1px solid var(--cds-border-subtle-01)',
            display: 'flex', alignItems: 'center'
          }}>
            <div style={{ flex: 1, padding: '0.75rem 1rem' }}>
              <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--cds-text-primary)', marginBottom: '0.15rem' }}>
                Full Session
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--cds-text-secondary)' }}>
                All {exercises.length} exercise{exercises.length !== 1 ? 's' : ''} · ~{estimateDuration(exercises)} min
              </div>
            </div>
            <PlayBtn onClick={() => onStart(exercises)} label="Start full session" />
          </div>

          {/* Individual exercise rows */}
          {exercises.map((ex, i) => (
            <div
              key={ex.id}
              style={{
                background: 'var(--cds-layer-01)',
                border: '1px solid var(--cds-border-subtle-01)',
                display: 'flex', alignItems: 'center'
              }}
            >
              {/* Number badge */}
              <div style={{
                width: 32, alignSelf: 'stretch', flexShrink: 0,
                background: 'var(--cds-layer-02)',
                borderRight: '1px solid var(--cds-border-subtle-01)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.75rem', fontWeight: 700, color: 'var(--cds-text-secondary)'
              }}>
                {i + 1}
              </div>

              {/* Exercise info */}
              <div style={{ flex: 1, padding: '0.75rem 0.875rem' }}>
                <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--cds-text-primary)', marginBottom: '0.15rem' }}>
                  {ex.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--cds-text-secondary)', marginBottom: '0.15rem' }}>
                  {ex.holdSeconds}s hold · {ex.restSeconds}s rest · {ex.reps} reps · {ex.sets} sets · ~{estimateDuration([ex])} min
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--cds-text-secondary)', fontStyle: 'italic' }}>
                  {ex.description}
                </div>
              </div>

              {/* Inline play button */}
              <PlayBtn onClick={() => onStart([ex])} label={`Start ${ex.name}`} />
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
          fontSize: '0.875rem'
        }}>
          Well done! Target sessions complete today ({doneToday}/{sessionsPerDay})
        </div>
      )}

      {showHowTo && <HowToModal onClose={handleCloseHowTo} />}
    </div>
  )
}
