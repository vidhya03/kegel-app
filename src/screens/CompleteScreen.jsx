// CompleteScreen — shown after a session finishes with stats and motivational message
const MESSAGES = {
  1: 'Great start! Consistency is everything.',
  2: 'Building strong foundations!',
  3: "You're getting stronger every day.",
  4: 'Elite level control incoming!'
}

export default function CompleteScreen({ session, onGoHome, onDoAnother }) {
  const minutes = Math.floor((session?.durationSeconds || 0) / 60)
  const seconds = (session?.durationSeconds || 0) % 60
  const message = MESSAGES[session?.week] || MESSAGES[1]

  return (
    <div className="screen" style={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      {/* Animated checkmark */}
      <div className="complete-check">
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="40" cy="40" r="36" stroke="#42be65" strokeWidth="4" />
          <path
            d="M22 40 L35 53 L58 28"
            stroke="#42be65"
            strokeWidth="4"
            strokeLinecap="square"
            strokeLinejoin="miter"
            style={{
              strokeDasharray: 60,
              strokeDashoffset: 0,
              animation: 'drawCheck 0.5s ease forwards'
            }}
          />
          <style>{`
            @keyframes drawCheck {
              from { stroke-dashoffset: 60; }
              to { stroke-dashoffset: 0; }
            }
          `}</style>
        </svg>
      </div>

      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--cds-text-primary)', marginBottom: '0.5rem' }}>
        Session Complete!
      </h1>

      <p style={{ color: 'var(--cds-support-success)', fontSize: '1rem', marginBottom: '1.5rem' }}>
        {message}
      </p>

      {/* Stats summary */}
      <div style={{
        background: 'var(--cds-layer-01)',
        border: '1px solid var(--cds-border-subtle-01)',
        padding: '1rem',
        width: '100%',
        marginBottom: '2rem',
        textAlign: 'left'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ color: 'var(--cds-text-secondary)' }}>Total Reps</span>
          <span style={{ color: 'var(--cds-text-primary)', fontWeight: 600 }}>{session?.totalReps || 0}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ color: 'var(--cds-text-secondary)' }}>Duration</span>
          <span style={{ color: 'var(--cds-text-primary)', fontWeight: 600 }}>
            {minutes}:{String(seconds).padStart(2, '0')}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--cds-text-secondary)' }}>Exercises</span>
          <span style={{ color: 'var(--cds-text-primary)', fontWeight: 600 }}>{session?.exercisesCompleted || 0}</span>
        </div>
      </div>

      {/* Buttons */}
      <button
        className="cds--btn cds--btn--primary"
        style={{ width: '100%', maxWidth: '100%', justifyContent: 'center', marginBottom: '0.5rem' }}
        onClick={onGoHome}
      >
        Go Home
      </button>
      <button
        className="cds--btn cds--btn--secondary"
        style={{ width: '100%', maxWidth: '100%', justifyContent: 'center' }}
        onClick={onDoAnother}
      >
        Do Another Session
      </button>
    </div>
  )
}
