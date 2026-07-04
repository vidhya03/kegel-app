// Shared inline style constants — avoids repeating the same object literals

// Carbon-themed text input style used by FeedbackScreen form fields
export const FORM_INPUT_STYLE = {
  width: '100%',
  background: 'var(--cds-layer-02)',
  border: '1px solid var(--cds-border-subtle-01)',
  borderBottom: '1px solid var(--cds-text-secondary)',
  color: 'var(--cds-text-primary)',
  padding: '0.625rem 0.75rem',
  fontSize: '0.9375rem',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit'
}

// Social/external link card style used by FeedbackScreen
export const SOCIAL_LINK_STYLE = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.875rem',
  background: 'var(--cds-layer-01)',
  border: '1px solid var(--cds-border-subtle-01)',
  padding: '0.75rem 1rem',
  textDecoration: 'none',
  color: 'var(--cds-text-primary)'
}
