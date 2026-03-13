// HowToModal — first-time user guide, plain everyday language
export default function HowToModal({ onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.85)',
        display: 'flex', alignItems: 'flex-end',
        zIndex: 200
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 480,
          margin: '0 auto',
          background: 'var(--cds-layer-01)',
          borderTop: '2px solid var(--cds-interactive)',
          padding: '1.5rem 1rem 2rem',
          maxHeight: '85dvh',
          overflowY: 'auto'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--cds-text-primary)', margin: 0 }}>
            How to do Kegel exercises
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'none', border: 'none',
              color: 'var(--cds-text-secondary)',
              fontSize: '1.5rem', cursor: 'pointer',
              lineHeight: 1, padding: '0.25rem'
            }}
          >
            ×
          </button>
        </div>

        {/* Plain-English intro */}
        <div style={{
          background: 'var(--cds-layer-02)',
          border: '1px solid var(--cds-border-subtle-01)',
          padding: '0.875rem 1rem',
          marginBottom: '1.25rem',
          fontSize: '0.9375rem',
          color: 'var(--cds-text-primary)',
          lineHeight: 1.6
        }}>
          Think of it like this: <strong>imagine you are trying to stop yourself from peeing mid-stream.</strong> The muscles you squeeze to do that — those are the ones you train here. That's it.
        </div>

        {/* Find your muscles */}
        <Section title="1. Find the right muscles">
          <p>Try to squeeze and lift that stopping-pee feeling right now. Hold for 2 seconds, then let go completely.</p>
          <p>If you felt something tighten inside — that's it. You found the right muscles.</p>
          <Tip>Only those inner muscles should move. Your belly, thighs, and bum should stay relaxed.</Tip>
        </Section>

        {/* Squeeze */}
        <Section title="2. SQUEEZE — tighten and hold">
          <PhaseTag phase="squeeze" />
          <p>Tighten that stopping-pee feeling and hold it for the time shown on the timer.</p>
          <p>Keep breathing normally. Don't hold your breath.</p>
          <Tip>Think: lift and squeeze inward — not push outward.</Tip>
        </Section>

        {/* Release */}
        <Section title="3. RELEASE — fully let go">
          <PhaseTag phase="release" />
          <p>Completely relax those muscles. Go fully loose for the whole rest time shown.</p>
          <p>The rest is just as important as the squeeze — your muscles need it to get stronger.</p>
          <Tip>You should feel a clear difference: tight during squeeze, fully loose during release.</Tip>
        </Section>

        {/* Mistakes */}
        <Section title="Common mistakes">
          <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--cds-text-secondary)', fontSize: '0.875rem', lineHeight: 1.7 }}>
            <li>Holding your breath during the squeeze</li>
            <li>Tensing your stomach, bum, or thighs instead</li>
            <li>Pushing outward instead of lifting inward</li>
            <li>Cutting the rest short before the timer ends</li>
            <li>Doing this with a full bladder</li>
          </ul>
        </Section>

        <button
          onClick={onClose}
          className="cds--btn cds--btn--primary"
          style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
        >
          Got it — start training
        </button>
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <div style={{
        fontSize: '0.75rem', fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '0.05em',
        color: 'var(--cds-text-secondary)',
        borderBottom: '1px solid var(--cds-border-subtle-01)',
        paddingBottom: '0.375rem', marginBottom: '0.625rem'
      }}>
        {title}
      </div>
      <div style={{ fontSize: '0.875rem', color: 'var(--cds-text-primary)', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
        {children}
      </div>
    </div>
  )
}

function Tip({ children }) {
  return (
    <div style={{
      borderLeft: '3px solid var(--cds-interactive)',
      paddingLeft: '0.75rem',
      color: 'var(--cds-text-secondary)',
      fontSize: '0.8125rem',
      fontStyle: 'italic'
    }}>
      {children}
    </div>
  )
}

function PhaseTag({ phase }) {
  const isSqueeze = phase === 'squeeze'
  return (
    <div style={{
      display: 'inline-block',
      padding: '0.2rem 0.625rem',
      marginBottom: '0.375rem',
      fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.06em',
      color: isSqueeze ? 'var(--cds-interactive)' : 'var(--cds-support-success)',
      border: `1px solid ${isSqueeze ? 'var(--cds-interactive)' : 'var(--cds-support-success)'}`,
      background: 'transparent'
    }}>
      {isSqueeze ? 'SQUEEZE' : 'RELEASE'}
    </div>
  )
}
