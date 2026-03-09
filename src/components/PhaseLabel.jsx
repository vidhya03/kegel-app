// PhaseLabel — shows SQUEEZE or RELEASE with appropriate Carbon token color
export default function PhaseLabel({ phase }) {
  const label = phase === 'squeeze' ? 'SQUEEZE'
    : phase === 'release' ? 'RELEASE'
    : 'READY'

  return (
    <div className={`phase-label phase-label--${phase || 'idle'}`}>
      {label}
    </div>
  )
}
