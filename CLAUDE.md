# KegelCoach — Project Memory for Claude Code

> This file is the persistent memory for this project.
> Claude Code reads this automatically at the start of every session.
> Never delete this file.

---

## 🧠 What This Project Is

**KegelCoach** — A personal pelvic floor trainer PWA for men.
Guides users through a structured 4-week Kegel exercise program with:
- Real-time squeeze/release timer
- Sound cues (Web Audio API + SpeechSynthesis)
- Vibration feedback (Navigator.vibrate)
- Session progress saved to localStorage
- IBM Carbon Dark design system

**Stack:** React + Vite + `@carbon/styles` (selective SCSS imports) + `sass`
**Platform:** Mobile-first PWA (installable on phone)

---

## 🎨 Design Rules — NEVER BREAK THESE

- Theme: **IBM Carbon Dark** (`g100` theme token) only
- Font: **IBM Plex Sans** (body) + **IBM Plex Mono** (timer) — loaded via `@carbon/styles`
- **Zero border radius** — sharp corners everywhere
- **No other UI libraries** — no MUI, Ant Design, Carbon React components
- Use **official Carbon SCSS tokens** via `@carbon/styles` — never hardcode hex values
- Squeeze state color: `$interactive` token → `#0f62fe`
- Release state color: `$support-success` token → `#42be65`
- Background: `$background` → `#161616` | Surface: `$layer-01` → `#262626`
- Border: `$border-subtle-01` → `#393939`
- Text: `$text-primary` → `#f4f4f4` | `$text-secondary` → `#c6c6c6`

---

## 📁 Project Structure

```
kegel-coach/
├── public/
│   ├── manifest.json
│   └── favicon.svg
├── src/
│   ├── main.jsx
│   ├── App.jsx                ← global state + screen switching
│   ├── styles/
│   │   ├── index.scss         ← selective Carbon imports + custom overrides
│   │   └── _overrides.scss    ← app-specific style overrides
│   ├── data/
│   │   └── program.js         ← 4-week program data
│   ├── hooks/
│   │   ├── useTimer.js        ← countdown + phase logic
│   │   ├── useSound.js        ← Web Audio API
│   │   ├── useVibration.js    ← Navigator.vibrate
│   │   └── useProgress.js     ← localStorage manager
│   ├── screens/
│   │   ├── HomeScreen.jsx
│   │   ├── SessionScreen.jsx
│   │   └── CompleteScreen.jsx
│   │   └── SettingsScreen.jsx
│   └── components/
│       ├── BottomNav.jsx
│       ├── CircularTimer.jsx
│       ├── PhaseLabel.jsx
│       └── StatCard.jsx
├── vite.config.js
└── package.json
```

---

## 🔄 Navigation Flow

```
Home → Session → Complete → Home
Any screen → Settings (gear icon)
Session → Home (on STOP)
```

No React Router — screen state in `App.jsx`:
```javascript
const [currentScreen, setCurrentScreen] = useState('home')
// values: 'home' | 'session' | 'complete' | 'settings'
```

---

## 💾 localStorage Keys

All prefixed with `kc_` to avoid conflicts:

| Key | Type | Description |
|-----|------|-------------|
| `kc_current_week` | number | 1–4 |
| `kc_current_day` | number | 1–7 |
| `kc_sessions` | JSON array | All completed sessions |
| `kc_streak` | number | Consecutive days |
| `kc_last_session` | ISO string | Date of last session |
| `kc_settings` | JSON object | Sound + vibration prefs |

---

## ⚙️ Settings Object Shape

```javascript
{
  soundEnabled: true,
  soundType: "tones",         // "tones" | "voice"
  volume: 0.7,                // 0.0 to 1.0
  vibrationEnabled: true,
  squeezePattern: "short-short", // "short-short" | "long" | "pulse"
  releasePattern: "soft"      // "soft" | "none"
}
```

---

## 🏗️ Build Phases

| Phase | Status | Features |
|-------|--------|---------|
| **Phase 1** | 🔨 In Progress | Timer, sound, vibration, settings, session save |
| **Phase 2** | ⏳ Pending | Weekly calendar, progress charts, streak display |
| **Phase 3** | ⏳ Pending | Daily reminders, auto week progression |

---

## ✅ Phase 1 Checklist

- [ ] App loads on mobile browser
- [ ] Home screen shows today's workout and streak
- [ ] Session starts with correct Week 1 Day 1 exercise
- [ ] Timer counts down squeeze and release phases correctly
- [ ] Sound plays on phase change (if enabled)
- [ ] Vibration fires on phase change (if enabled)
- [ ] Pause / Resume works correctly
- [ ] Stop returns to home without saving
- [ ] Session complete screen shows correct stats
- [ ] Session saved to localStorage on complete
- [ ] Settings screen — sound + vibration customization
- [ ] Test My Settings button works
- [ ] Looks correct at 390px width (iPhone 14)

---

## 🎨 Carbon SCSS Setup

### Install
```bash
npm install @carbon/styles
npm install -D sass
```

### `src/styles/index.scss` — selective imports only
```scss
// 1. Configure theme FIRST
@use '@carbon/styles/scss/themes' as themes;
@use '@carbon/styles/scss/theme' with (
  $theme: themes.$g100
);

// 2. Reset + base
@use '@carbon/styles/scss/reset';
@use '@carbon/styles/scss/type';
@use '@carbon/styles/scss/spacing';

// 3. Only components actually used in this app
@use '@carbon/styles/scss/components/button';
@use '@carbon/styles/scss/components/toggle';
@use '@carbon/styles/scss/components/slider';
@use '@carbon/styles/scss/components/progress-bar';

// 4. App overrides
@use './overrides';
```

### `src/styles/_overrides.scss` — custom rules
```scss
// Remove border radius from all Carbon components
.cds--btn,
.cds--toggle,
.cds--slider {
  border-radius: 0 !important;
}

// Timer number uses IBM Plex Mono
.timer-display {
  font-family: 'IBM Plex Mono', monospace;
}
```

### In `main.jsx`
```javascript
import './styles/index.scss'
```

### Final bundle size target
- Full Carbon CSS: ~500kb
- Our selective imports: ~30–40kb ✅

---

## 📋 Coding Standards

- Functional components + hooks only
- Each file max ~150 lines — split if longer
- SCSS in `src/styles/index.scss` — use Carbon tokens, never hardcode hex values
- Custom overrides in `src/styles/_overrides.scss`
- Comments on all hook logic
- No `console.log` left in production code
- Always handle the case where `Navigator.vibrate` is not supported (some browsers)
- Always wrap Web Audio API in try/catch (can be blocked by browser)

---

## 🚫 Things Claude Should NEVER Do In This Project

- Add border radius to cards or buttons
- Hardcode hex color values — always use Carbon SCSS tokens
- Import any other UI component library (no MUI, Ant Design)
- Use React Router (screen state is enough)
- Store data anywhere except localStorage with `kc_` prefix
- Import all of `@carbon/styles` — only import components actually used
- Use any font other than IBM Plex Sans / IBM Plex Mono
- Create files longer than 150 lines without splitting

---

## 💡 Helpful Context

- Timer ring is an SVG circle with animated `stroke-dashoffset`
- Sound is generated via `AudioContext.createOscillator()` — no audio files needed
- Vibration check: `if ('vibrate' in navigator)` before calling
- Voice mode uses `window.speechSynthesis.speak()` for "Squeeze" / "Release" cues
- Sessions per day target = 2 for all weeks
- The `program.js` data uses `Array(7).fill()` — be careful, all days share same reference. Use `Array(7).fill(null).map(() => ({...}))` to fix if needed.
