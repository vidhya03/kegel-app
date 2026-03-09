import { useState, useMemo } from 'react'
import StatCard from '../components/StatCard'

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

// Build a grid of weeks for a given year/month
// Each cell: { date, dateNum, inMonth, sessionCount, isToday }
function buildMonthGrid(year, month, sessions) {
  const today = new Date()
  const firstDay = new Date(year, month, 1)
  // 0=Sun…6=Sat → convert to 0=Mon…6=Sun
  const startDow = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  // Build a lookup: "YYYY-MM-DD" → session count
  const lookup = {}
  for (const s of sessions) {
    const d = new Date(s.date)
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
    lookup[key] = (lookup[key] || 0) + 1
  }

  const cells = []

  // Pad before first day (previous month days)
  const prevMonthDays = new Date(year, month, 0).getDate()
  for (let i = startDow - 1; i >= 0; i--) {
    const d = new Date(year, month - 1, prevMonthDays - i)
    cells.push({ date: d, dateNum: prevMonthDays - i, inMonth: false, sessionCount: 0, isToday: false })
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, month, day)
    const key = `${year}-${month}-${day}`
    cells.push({
      date: d,
      dateNum: day,
      inMonth: true,
      sessionCount: lookup[key] || 0,
      isToday: d.toDateString() === today.toDateString()
    })
  }

  // Pad after last day to complete final week row
  const remaining = (7 - (cells.length % 7)) % 7
  for (let i = 1; i <= remaining; i++) {
    const d = new Date(year, month + 1, i)
    cells.push({ date: d, dateNum: i, inMonth: false, sessionCount: 0, isToday: false })
  }

  // Split into weeks
  const weeks = []
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7))
  }
  return weeks
}

// ProgressScreen — monthly calendar with date numbers, month/year nav, and all-time stats
export default function ProgressScreen({ sessions, allTimeStats, weekSessions }) {
  const now = new Date()
  const [viewYear, setViewYear] = useState(now.getFullYear())
  const [viewMonth, setViewMonth] = useState(now.getMonth())

  const weeks = useMemo(
    () => buildMonthGrid(viewYear, viewMonth, sessions),
    [viewYear, viewMonth, sessions]
  )

  // Sessions in the viewed month
  const monthSessionCount = useMemo(() => {
    return sessions.filter(s => {
      const d = new Date(s.date)
      return d.getFullYear() === viewYear && d.getMonth() === viewMonth
    }).length
  }, [sessions, viewYear, viewMonth])

  const goToPrevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }

  const goToNextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  const goToToday = () => {
    setViewYear(now.getFullYear())
    setViewMonth(now.getMonth())
  }

  const isCurrentMonth = viewYear === now.getFullYear() && viewMonth === now.getMonth()

  return (
    <div className="screen" style={{ overflowY: 'auto' }}>
      <h1 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--cds-text-primary)' }}>
        Progress
      </h1>

      {/* All-time stats row */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <StatCard value={allTimeStats.totalSessions} label="Sessions" />
        <StatCard value={allTimeStats.totalReps} label="Total Reps" />
        <StatCard value={`${allTimeStats.totalMinutes}m`} label="Total Time" />
      </div>

      {/* Calendar section */}
      <div style={{
        background: 'var(--cds-layer-01)',
        border: '1px solid var(--cds-border-subtle-01)',
        marginBottom: '1.5rem'
      }}>
        {/* Month/Year header with navigation */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.75rem 1rem',
          borderBottom: '1px solid var(--cds-border-subtle-01)'
        }}>
          <button
            onClick={goToPrevMonth}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--cds-text-primary)', padding: '0.25rem 0.5rem', fontSize: '1.25rem'
            }}
            aria-label="Previous month"
          >
            ‹
          </button>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--cds-text-primary)' }}>
              {MONTH_NAMES[viewMonth]} {viewYear}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--cds-text-secondary)', marginTop: '0.125rem' }}>
              {monthSessionCount} session{monthSessionCount !== 1 ? 's' : ''} this month
            </div>
          </div>

          <button
            onClick={goToNextMonth}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--cds-text-primary)', padding: '0.25rem 0.5rem', fontSize: '1.25rem'
            }}
            aria-label="Next month"
          >
            ›
          </button>
        </div>

        {/* Today shortcut — only visible when not on current month */}
        {!isCurrentMonth && (
          <div style={{ padding: '0.375rem 1rem', borderBottom: '1px solid var(--cds-border-subtle-01)', textAlign: 'right' }}>
            <button
              onClick={goToToday}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--cds-interactive)', fontSize: '0.8125rem', textDecoration: 'underline'
              }}
            >
              Back to today
            </button>
          </div>
        )}

        {/* Day-of-week headers */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
          padding: '0.5rem 0.5rem 0',
          gap: '2px'
        }}>
          {DAY_LABELS.map(d => (
            <div key={d} style={{
              textAlign: 'center', fontSize: '0.6875rem', fontWeight: 600,
              color: 'var(--cds-text-secondary)', padding: '0.25rem 0',
              textTransform: 'uppercase', letterSpacing: '0.04em'
            }}>
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div style={{ padding: '0.25rem 0.5rem 0.5rem', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {weeks.map((week, wi) => (
            <div key={wi} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
              {week.map((cell, ci) => (
                <div
                  key={ci}
                  style={{
                    aspectRatio: '1',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    background: cell.isToday
                      ? 'var(--cds-interactive)'
                      : cell.sessionCount > 0 && cell.inMonth
                        ? 'var(--cds-layer-02)'
                        : 'transparent',
                    border: cell.isToday
                      ? '2px solid var(--cds-interactive)'
                      : cell.sessionCount > 0 && cell.inMonth
                        ? '1px solid var(--cds-border-subtle-01)'
                        : '1px solid transparent',
                    opacity: cell.inMonth ? 1 : 0.3
                  }}
                >
                  {/* Date number */}
                  <span style={{
                    fontSize: '0.8125rem',
                    fontWeight: cell.isToday ? 700 : cell.sessionCount > 0 ? 600 : 400,
                    color: cell.isToday
                      ? '#fff'
                      : cell.inMonth
                        ? 'var(--cds-text-primary)'
                        : 'var(--cds-text-secondary)',
                    lineHeight: 1
                  }}>
                    {cell.dateNum}
                  </span>

                  {/* Session dot/count */}
                  {cell.sessionCount > 0 && cell.inMonth && (
                    <span style={{
                      fontSize: '0.5625rem',
                      fontWeight: 700,
                      color: cell.isToday ? '#fff' : 'var(--cds-support-success)',
                      lineHeight: 1,
                      marginTop: '2px'
                    }}>
                      {cell.sessionCount > 1 ? `×${cell.sessionCount}` : '●'}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div style={{
          display: 'flex', gap: '1rem', padding: '0.5rem 1rem 0.75rem',
          borderTop: '1px solid var(--cds-border-subtle-01)',
          fontSize: '0.6875rem', color: 'var(--cds-text-secondary)'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <span style={{ width: 12, height: 12, background: 'var(--cds-interactive)', display: 'inline-block' }} />
            Today
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <span style={{ color: 'var(--cds-support-success)', fontSize: '0.75rem' }}>●</span>
            Session done
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <span style={{ color: 'var(--cds-support-success)', fontSize: '0.6875rem', fontWeight: 700 }}>×2</span>
            Multiple sessions
          </span>
        </div>
      </div>

      {/* This week summary */}
      <div style={{
        background: 'var(--cds-layer-01)',
        border: '1px solid var(--cds-border-subtle-01)',
        padding: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--cds-text-secondary)', marginBottom: '0.25rem' }}>
            Sessions this week
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--cds-text-primary)' }}>
            {weekSessions.length}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--cds-text-secondary)', marginBottom: '0.25rem' }}>
            Target
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--cds-text-secondary)' }}>
            14
          </div>
        </div>
      </div>
    </div>
  )
}
