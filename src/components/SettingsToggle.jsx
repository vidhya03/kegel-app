// SettingsToggle — reusable ON/OFF toggle row used across settings sections
export default function SettingsToggle({ label, enabled, onToggle }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
      <span style={{ color: 'var(--cds-text-primary)' }}>{label}</span>
      <button
        className={`cds--btn cds--btn--sm ${enabled ? 'cds--btn--primary' : 'cds--btn--secondary'}`}
        onClick={onToggle}
      >
        {enabled ? 'ON' : 'OFF'}
      </button>
    </div>
  )
}
