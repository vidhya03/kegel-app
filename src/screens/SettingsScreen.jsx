import { useState } from 'react'
import { useSound } from '../hooks/useSound'
import { useVibration } from '../hooks/useVibration'
import { useReminders } from '../hooks/useReminders'

// SettingsScreen — sound, vibration, reminders, and progress reset controls
export default function SettingsScreen({ settings, onSave, onResetProgress }) {
  const [local, setLocal] = useState(settings)
  const [confirmReset, setConfirmReset] = useState(false)

  const sound = useSound(local)
  const vibration = useVibration(local)
  const reminders = useReminders(local)

  const update = (key, value) => {
    const next = { ...local, [key]: value }
    setLocal(next)
    onSave(next)
  }

  const runDemo = () => {
    // Mini demo: squeeze cue → vibrate → release cue → vibrate
    sound.playSqueezeSound()
    vibration.vibrateOnSqueeze()
    setTimeout(() => {
      sound.playReleaseSound()
      vibration.vibrateOnRelease()
    }, 1500)
  }

  const handleReset = () => {
    if (confirmReset) {
      onResetProgress()
      setConfirmReset(false)
    } else {
      setConfirmReset(true)
    }
  }

  return (
    <div className="screen" style={{ overflowY: 'auto' }}>
      <h1 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--cds-text-primary)' }}>
        Settings
      </h1>

      {/* Sound section */}
      <div className="settings-section">
        <div className="settings-section__title">Sound</div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <span style={{ color: 'var(--cds-text-primary)' }}>Sound</span>
          <button
            className={`cds--btn cds--btn--sm ${local.soundEnabled ? 'cds--btn--primary' : 'cds--btn--secondary'}`}
            onClick={() => update('soundEnabled', !local.soundEnabled)}
          >
            {local.soundEnabled ? 'ON' : 'OFF'}
          </button>
        </div>

        {local.soundEnabled && (
          <>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)', marginBottom: '0.5rem' }}>Sound Type</div>
              <div className="pattern-selector">
                {['tones', 'voice'].map(type => (
                  <button
                    key={type}
                    className={`pattern-btn ${local.soundType === type ? 'pattern-btn--active' : ''}`}
                    onClick={() => update('soundType', type)}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)', marginBottom: '0.5rem' }}>
                Volume: {Math.round(local.volume * 100)}%
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={local.volume}
                onChange={e => update('volume', parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--cds-interactive)' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <button className="cds--btn cds--btn--sm cds--btn--ghost" onClick={sound.playSqueezeSound}>
                Preview Squeeze
              </button>
              <button className="cds--btn cds--btn--sm cds--btn--ghost" onClick={sound.playReleaseSound}>
                Preview Release
              </button>
            </div>
          </>
        )}
      </div>

      {/* Vibration section */}
      <div className="settings-section">
        <div className="settings-section__title">Vibration</div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <span style={{ color: 'var(--cds-text-primary)' }}>Vibration</span>
          <button
            className={`cds--btn cds--btn--sm ${local.vibrationEnabled ? 'cds--btn--primary' : 'cds--btn--secondary'}`}
            onClick={() => update('vibrationEnabled', !local.vibrationEnabled)}
          >
            {local.vibrationEnabled ? 'ON' : 'OFF'}
          </button>
        </div>

        {local.vibrationEnabled && (
          <>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)', marginBottom: '0.5rem' }}>Squeeze Pattern</div>
              <div className="pattern-selector">
                {[
                  { key: 'short-short', label: 'Short-Short' },
                  { key: 'long', label: 'Long Buzz' },
                  { key: 'pulse', label: 'Pulse' }
                ].map(p => (
                  <button
                    key={p.key}
                    className={`pattern-btn ${local.squeezePattern === p.key ? 'pattern-btn--active' : ''}`}
                    onClick={() => update('squeezePattern', p.key)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)', marginBottom: '0.5rem' }}>Release Pattern</div>
              <div className="pattern-selector">
                {['soft', 'none'].map(p => (
                  <button
                    key={p}
                    className={`pattern-btn ${local.releasePattern === p ? 'pattern-btn--active' : ''}`}
                    onClick={() => update('releasePattern', p)}
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <button className="cds--btn cds--btn--sm cds--btn--ghost" onClick={() => vibration.testVibration()}>
              Test Vibration
            </button>
          </>
        )}
      </div>

      {/* Test My Settings */}
      <div className="settings-section">
        <div className="settings-section__title">Test</div>
        <button
          className="cds--btn cds--btn--secondary"
          style={{ width: '100%', justifyContent: 'center' }}
          onClick={runDemo}
        >
          Test My Settings (Mini Demo)
        </button>
      </div>

      {/* Progress */}
      <div className="settings-section">
        <div className="settings-section__title">Progress</div>
        <button
          className="cds--btn cds--btn--danger"
          style={{ width: '100%', justifyContent: 'center' }}
          onClick={handleReset}
        >
          {confirmReset ? 'Tap again to confirm reset' : 'Reset All Progress'}
        </button>
        {confirmReset && (
          <p style={{ fontSize: '0.8125rem', color: 'var(--cds-support-error)', marginTop: '0.5rem' }}>
            This will permanently delete all your progress. Tap the button again to confirm.
          </p>
        )}
      </div>

      {/* Reminders section */}
      <div className="settings-section">
        <div className="settings-section__title">Daily Reminder</div>

        {reminders.permission === 'unsupported' && (
          <p style={{ fontSize: '0.8125rem', color: 'var(--cds-text-secondary)' }}>
            Notifications not supported in this browser.
          </p>
        )}

        {reminders.permission === 'denied' && (
          <p style={{ fontSize: '0.8125rem', color: 'var(--cds-support-error)' }}>
            Notifications blocked. Enable them in browser settings, then return here.
          </p>
        )}

        {reminders.permission !== 'unsupported' && reminders.permission !== 'denied' && (
          <>
            {reminders.permission === 'default' && (
              <button
                className="cds--btn cds--btn--secondary"
                style={{ width: '100%', justifyContent: 'center', marginBottom: '1rem' }}
                onClick={reminders.requestPermission}
              >
                Allow Notifications
              </button>
            )}

            {reminders.permission === 'granted' && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span style={{ color: 'var(--cds-text-primary)' }}>Daily Reminder</span>
                  <button
                    className={`cds--btn cds--btn--sm ${local.reminderEnabled ? 'cds--btn--primary' : 'cds--btn--secondary'}`}
                    onClick={() => update('reminderEnabled', !local.reminderEnabled)}
                  >
                    {local.reminderEnabled ? 'ON' : 'OFF'}
                  </button>
                </div>

                {local.reminderEnabled && (
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)', marginBottom: '0.5rem' }}>
                      Remind me at
                    </div>
                    <input
                      type="time"
                      value={local.reminderTime || '08:00'}
                      onChange={e => update('reminderTime', e.target.value)}
                      style={{
                        background: 'var(--cds-layer-02)',
                        border: '1px solid var(--cds-border-subtle-01)',
                        color: 'var(--cds-text-primary)',
                        padding: '0.5rem 0.75rem',
                        fontSize: '1rem',
                        width: '100%',
                        outline: 'none'
                      }}
                    />
                    <p style={{ fontSize: '0.75rem', color: 'var(--cds-text-secondary)', marginTop: '0.375rem' }}>
                      Reminder fires when the app is open at this time.
                    </p>
                  </div>
                )}

                <button
                  className="cds--btn cds--btn--sm cds--btn--ghost"
                  onClick={reminders.sendTestNotification}
                >
                  Send Test Notification
                </button>
              </>
            )}
          </>
        )}
      </div>

      {/* About */}
      <div className="settings-section">
        <div className="settings-section__title">About</div>
        <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)' }}>
          KegelCoach v1.0
        </p>
      </div>
    </div>
  )
}
