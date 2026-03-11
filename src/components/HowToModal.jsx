// HowToModal — first-time user guide for squeeze and release technique
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

        {/* Find your muscles */}
        <Section title="1. Find the right muscles">
          <p>Imagine you are trying to stop the flow of urine mid-stream. The muscles you tighten to do that are your pelvic floor muscles.</p>
          <p>You can also try to lift and squeeze as if you are picking up a small object with your pelvic floor.</p>
          <Tip>Do not tighten your stomach, thighs, or buttocks — only the pelvic floor.</Tip>
        </Section>

        {/* Squeeze */}
        <Section title="2. SQUEEZE — tighten and hold">
          <PhaseTag phase="squeeze" />
          <p>Contract your pelvic floor muscles firmly. Hold for the number of seconds shown in the timer.</p>
          <p>Breathe normally throughout — do not hold your breath.</p>
          <Tip>Think of lifting upward and inward, not pushing outward.</Tip>
        </Section>

        {/* Release */}
        <Section title="3. RELEASE — fully relax">
          <PhaseTag phase="release" />
          <p>Completely let go of the muscles. Allow them to relax for the full rest period shown.</p>
          <p>The release phase is just as important as the squeeze. Muscles need recovery to grow stronger.</p>
          <Tip>You should feel a clear difference between the tight hold and the full relaxation.</Tip>
        </Section>

        {/* Tips */}
        <Section title="Common mistakes to avoid">
          <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--cds-text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
            <li>Holding your breath during the squeeze</li>
            <li>Pushing down instead of lifting up</li>
            <li>Tensing abs, glutes, or inner thighs</li>
            <li>Shortening the release / rest period</li>
            <li>Exercising with a full bladder</li>
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
