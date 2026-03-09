import { useState, useMemo } from 'react'

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
]
const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

function buildMonthGrid(year, month, sessions) {
  const today = new Date()
  const firstDay = new Date(year, month, 1)
  const startDow = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const lookup = {}
  for (const s of sessions) {
    const d = new Date(s.date)
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
    lookup[key] = (lookup[key] || 0) + 1
  }

  const cells = []
  const prevMonthDays = new Date(year, month, 0).getDate()
  for (let i = startDow - 1; i >= 0; i--) {
    cells.push({ dateNum: prevMonthDays - i, inMonth: false, sessionCount: 0, isToday: false })
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, month, day)
    const key = `${year}-${month}-${day}`
    cells.push({ dateNum: day, inMonth: true, sessionCount: lookup[key] || 0, isToday: d.toDateString() === today.toDateString() })
  }
  const remaining = (7 - (cells.length % 7)) % 7
  for (let i = 1; i <= remaining; i++) {
    cells.push({ dateNum: i, inMonth: false, sessionCount: 0, isToday: false })
  }
  const weeks = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))
  return weeks
}

// ProgressScreen — all stats + calendar on one screen, no scroll needed
export default function ProgressScreen({ sessions, allTimeStats, weekSessions }) {
  const now = new Date()
  const [viewYear, setViewYear] = useState(now.getFullYear())
  const [viewMonth, setViewMonth] = useState(now.getMonth())

  const weeks = useMemo(
    () => buildMonthGrid(viewYear, viewMonth, sessions),
    [viewYear, viewMonth, sessions]
  )

  const monthSessionCount = useMemo(() => {
    return sessions.filter(s => {
      const d = new Date(s.date)
      return d.getFullYear() === viewYear && d.getMonth() === viewMonth
    }).length
  }, [sessions, viewYear, viewMonth])

  const isCurrentMonth = viewYear === now.getFullYear() && viewMonth === now.getMonth()

  const goToPrev = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  const goToNext = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  const weekTarget = 14
  const weekPct = Math.min((weekSessions.length / weekTarget) * 100, 100)

  return (
    <div className="screen" style={{ gap: '0.625rem', display: 'flex', flexDirection: 'column' }}>

      {/* Stats row — 4 cards including this week */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.375rem' }}>
        {[
          { value: allTimeStats.totalSessions, label: 'Sessions' },
          { value: allTimeStats.totalReps,     label: 'Reps' },
          { value: `${allTimeStats.totalMinutes}m`, label: 'Time' },
          { value: `${weekSessions.length}/14`, label: 'This Wk' },
        ].map(s => (
          <div key={s.label} style={{
            background: 'var(--cds-layer-01)',
            border: '1px solid var(--cds-border-subtle-01)',
            padding: '0.5rem 0.625rem'
          }}>
            <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--cds-text-primary)', lineHeight: 1 }}>
              {s.value}
            </div>
            <div style={{ fontSize: '0.625rem', color: 'var(--cds-text-secondary)', marginTop: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Week progress bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', color: 'var(--cds-text-secondary)', marginBottom: '0.25rem' }}>
          <span>This week</span>
          <span>{weekSessions.length} / {weekTarget} sessions</span>
        </div>
        <div style={{ height: 6, background: 'var(--cds-layer-02)' }}>
          <div style={{ height: '100%', width: `${weekPct}%`, background: '#0f62fe', transition: 'width 0.4s' }} />
        </div>
      </div>

      {/* Calendar */}
      <div style={{ background: 'var(--cds-layer-01)', border: '1px solid var(--cds-border-subtle-01)', flex: 1 }}>

        {/* Compact month header — all on one line */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--cds-border-subtle-01)' }}>
          <button onClick={goToPrev} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--cds-text-primary)', fontSize: '1.1rem', padding: '0 0.25rem' }}>‹</button>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--cds-text-primary)' }}>
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--cds-text-secondary)', marginLeft: '0.5rem' }}>
              · {monthSessionCount} session{monthSessionCount !== 1 ? 's' : ''}
            </span>
            {!isCurrentMonth && (
              <button onClick={() => { setViewYear(now.getFullYear()); setViewMonth(now.getMonth()) }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0f62fe', fontSize: '0.75rem', marginLeft: '0.5rem', textDecoration: 'underline' }}>
                Today
              </button>
            )}
          </div>
          <button onClick={goToNext} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--cds-text-primary)', fontSize: '1.1rem', padding: '0 0.25rem' }}>›</button>
        </div>

        {/* Day labels */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', padding: '0.375rem 0.375rem 0', gap: '2px' }}>
          {DAY_LABELS.map((d, i) => (
            <div key={i} style={{ textAlign: 'center', fontSize: '0.625rem', fontWeight: 600, color: 'var(--cds-text-secondary)', textTransform: 'uppercase' }}>
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div style={{ padding: '0.25rem 0.375rem 0.375rem', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {weeks.map((week, wi) => (
            <div key={wi} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
              {week.map((cell, ci) => (
                <div key={ci} style={{
                  aspectRatio: '1',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  background: cell.isToday ? '#0f62fe'
                    : cell.sessionCount > 0 && cell.inMonth ? 'var(--cds-layer-02)'
                    : 'transparent',
                  border: cell.isToday ? '2px solid #0f62fe'
                    : cell.sessionCount > 0 && cell.inMonth ? '1px solid var(--cds-border-subtle-01)'
                    : '1px solid transparent',
                  opacity: cell.inMonth ? 1 : 0.25
                }}>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: cell.isToday || cell.sessionCount > 0 ? 700 : 400,
                    color: cell.isToday ? '#fff' : 'var(--cds-text-primary)',
                    lineHeight: 1
                  }}>
                    {cell.dateNum}
                  </span>
                  {cell.sessionCount > 0 && cell.inMonth && (
                    <span style={{ fontSize: '0.5rem', color: cell.isToday ? '#fff' : '#42be65', lineHeight: 1, marginTop: '1px', fontWeight: 700 }}>
                      {cell.sessionCount > 1 ? `×${cell.sessionCount}` : '●'}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Inline legend — single compact row */}
        <div style={{ display: 'flex', gap: '0.875rem', padding: '0.375rem 0.75rem 0.5rem', borderTop: '1px solid var(--cds-border-subtle-01)', fontSize: '0.625rem', color: 'var(--cds-text-secondary)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span style={{ width: 10, height: 10, background: '#0f62fe', display: 'inline-block' }} /> Today
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span style={{ color: '#42be65' }}>●</span> Done
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span style={{ color: '#42be65', fontWeight: 700 }}>×2</span> Multi
          </span>
        </div>
      </div>
    </div>
  )
}
