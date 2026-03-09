// BottomNav — persists across Home, Progress, Complete, and Settings screens
export default function BottomNav({ currentScreen, onNavigate, theme, onToggleTheme }) {
  return (
    <nav className="bottom-nav">
      <button
        className={`bottom-nav__item ${currentScreen === 'home' ? 'bottom-nav__item--active' : ''}`}
        onClick={() => onNavigate('home')}
        aria-label="Home"
      >
        <svg width="20" height="20" viewBox="0 0 32 32" fill="currentColor">
          <path d="M16 2L2 14h4v16h8v-8h4v8h8V14h4z"/>
        </svg>
        <span>Home</span>
      </button>

      <button
        className={`bottom-nav__item ${currentScreen === 'progress' ? 'bottom-nav__item--active' : ''}`}
        onClick={() => onNavigate('progress')}
        aria-label="Progress"
      >
        <svg width="20" height="20" viewBox="0 0 32 32" fill="currentColor">
          <path d="M27 28H5a1 1 0 0 1-1-1V5h2v21h21v2z"/>
          <path d="M30 9l-7 7-4-4-8 8-1.41-1.41L19 9.17l4 4L28.59 7.59z"/>
        </svg>
        <span>Progress</span>
      </button>

      <button
        className={`bottom-nav__item ${currentScreen === 'feedback' ? 'bottom-nav__item--active' : ''}`}
        onClick={() => onNavigate('feedback')}
        aria-label="Feedback"
      >
        <svg width="20" height="20" viewBox="0 0 32 32" fill="currentColor">
          <path d="M17.74 30L16 29l4-7h6a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h9v2H6a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4h20a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4h-4.84z"/>
          <path d="M8 10h16v2H8zm0 6h10v2H8z"/>
        </svg>
        <span>Feedback</span>
      </button>

      <button
        className={`bottom-nav__item ${currentScreen === 'settings' ? 'bottom-nav__item--active' : ''}`}
        onClick={() => onNavigate('settings')}
        aria-label="Settings"
      >
        <svg width="20" height="20" viewBox="0 0 32 32" fill="currentColor">
          <path d="M27 16.76V16l2-3.63-4-6.93-4.11 1.1A9.94 9.94 0 0 0 19 5.38L18 1h-4l-1 4.38a9.94 9.94 0 0 0-1.89 1.16L7 5.44l-4 6.93L5 15.24A10.06 10.06 0 0 0 5 16v.76l-2 3.63 4 6.93 4.11-1.1a9.94 9.94 0 0 0 1.89 1.16L14 31h4l1-4.38a9.94 9.94 0 0 0 1.89-1.16L25 26.56l4-6.93zM16 22a6 6 0 1 1 6-6 6 6 0 0 1-6 6z"/>
        </svg>
        <span>Settings</span>
      </button>

      {/* Theme toggle — lives in nav to avoid overlapping screen content */}
      <button
        className="bottom-nav__item"
        onClick={onToggleTheme}
        aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      >
        {theme === 'dark' ? (
          <svg width="20" height="20" viewBox="0 0 32 32" fill="currentColor">
            <circle cx="16" cy="16" r="6"/>
            <path stroke="currentColor" strokeWidth="2" fill="none" d="M16 2v4M16 26v4M2 16h4M26 16h4M5.6 5.6l2.8 2.8M23.6 23.6l2.8 2.8M5.6 26.4l2.8-2.8M23.6 8.4l2.8-2.8"/>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 32 32" fill="currentColor">
            <path d="M13.502 5.414a15.075 15.075 0 0 0 11.594 17.99 11.936 11.936 0 0 1-9.594 4.444C9.04 27.848 4 22.768 4 16.5A12.015 12.015 0 0 1 13.502 5.414z"/>
          </svg>
        )}
        <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
      </button>
    </nav>
  )
}
