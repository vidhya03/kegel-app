import { useState } from 'react'

function encode(data) {
  return Object.keys(data)
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(data[k]))
    .join('&')
}

// FeedbackScreen — Netlify Forms contact form + social links
export default function FeedbackScreen() {
  const [form, setForm] = useState({ name: '', email: '', role: '', message: '' })
  const [status, setStatus] = useState('idle') // 'idle' | 'sending' | 'sent' | 'error'

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setStatus('sending')
    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({ 'form-name': 'feedback', ...form })
      })
      setStatus('sent')
      setForm({ name: '', email: '', role: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="screen" style={{ overflowY: 'auto' }}>
      <h1 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem', color: 'var(--cds-text-primary)' }}>
        Feedback
      </h1>
      <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)', marginBottom: '1.5rem' }}>
        Found a bug or have a suggestion? Let me know.
      </p>

      {/* Success state */}
      {status === 'sent' ? (
        <div style={{
          padding: '1.5rem', textAlign: 'center',
          background: 'var(--cds-layer-01)',
          border: '1px solid var(--cds-support-success)'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✓</div>
          <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--cds-support-success)', marginBottom: '0.25rem' }}>
            Message sent!
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)' }}>
            Thanks for your feedback.
          </div>
          <button
            className="cds--btn cds--btn--ghost"
            style={{ marginTop: '1rem' }}
            onClick={() => setStatus('idle')}
          >
            Send another
          </button>
        </div>
      ) : (
        <form
          name="feedback"
          data-netlify="true"
          data-netlify-honeypot="bot-field"
          onSubmit={handleSubmit}
          style={{ marginBottom: '1.5rem' }}
        >
          {/* Honeypot — hidden from real users, catches bots */}
          <input type="hidden" name="form-name" value="feedback" />
          <p style={{ display: 'none' }}>
            <label>Don't fill this out: <input name="bot-field" /></label>
          </p>

          <p style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--cds-text-secondary)', marginBottom: '0.375rem' }}>
              Your Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              required
              style={{
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
              }}
            />
          </p>

          <p style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--cds-text-secondary)', marginBottom: '0.375rem' }}>
              Your Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
              style={{
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
              }}
            />
          </p>

       

          <p style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--cds-text-secondary)', marginBottom: '0.375rem' }}>
              Message
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Bug report, feature idea, or general feedback..."
              required
              rows={4}
              style={{
                width: '100%',
                background: 'var(--cds-layer-02)',
                border: '1px solid var(--cds-border-subtle-01)',
                borderBottom: '1px solid var(--cds-text-secondary)',
                color: 'var(--cds-text-primary)',
                padding: '0.625rem 0.75rem',
                fontSize: '0.9375rem',
                outline: 'none',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
                resize: 'vertical',
                minHeight: '100px'
              }}
            />
          </p>

          {status === 'error' && (
            <p style={{ fontSize: '0.8125rem', color: 'var(--cds-support-error)', marginBottom: '0.75rem' }}>
              Failed to send. Please try again or reach out via Instagram.
            </p>
          )}

          <p>
            <button
              type="submit"
              className="cds--btn cds--btn--primary"
              style={{ width: '100%', justifyContent: 'center' }}
              disabled={status === 'sending'}
            >
              {status === 'sending' ? 'Sending...' : 'Send'}
            </button>
          </p>
        </form>
      )}

      {/* Social links */}
      <div style={{ borderTop: '1px solid var(--cds-border-subtle-01)', paddingTop: '1.25rem' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--cds-text-secondary)', marginBottom: '0.75rem' }}>
          Connect
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {/* Instagram */}
          <a
            href="https://instagram.com/03vidhya"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: '0.875rem',
              background: 'var(--cds-layer-01)',
              border: '1px solid var(--cds-border-subtle-01)',
              padding: '0.75rem 1rem',
              textDecoration: 'none',
              color: 'var(--cds-text-primary)'
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E1306C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <circle cx="12" cy="12" r="4"/>
              <circle cx="17.5" cy="6.5" r="1" fill="#E1306C" stroke="none"/>
            </svg>
            <div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 600 }}>@03vidhya</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--cds-text-secondary)' }}>Instagram</div>
            </div>
          </a>

          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/in/vidhyadharan/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: '0.875rem',
              background: 'var(--cds-layer-01)',
              border: '1px solid var(--cds-border-subtle-01)',
              padding: '0.75rem 1rem',
              textDecoration: 'none',
              color: 'var(--cds-text-primary)'
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#0A66C2">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
              <circle cx="4" cy="4" r="2"/>
            </svg>
            <div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 600 }}>Vidhyadharan</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--cds-text-secondary)' }}>LinkedIn</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}
