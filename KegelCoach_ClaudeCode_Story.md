# KegelCoach — Claude Code Build Story
> Paste this entire document into Claude Code to build the app phase by phase.

---

## 🧠 Project Context

I am building a personal Kegel exercise trainer web app called **KegelCoach**.
It is a Progressive Web App (PWA) built with **React + Vite + @carbon/styles (selective SCSS imports)**.
The design system is **IBM Carbon Dark**.
The app helps men follow a structured 4-week Kegel exercise program with real-time timer guidance, sound cues, vibration feedback, and session progress tracking.

---

## 🎨 Design System — IBM Carbon Dark via `@carbon/styles`

### Install
```bash
npm install @carbon/styles
npm install -D sass
```

### Colors — use Carbon SCSS tokens, never hardcode hex
```scss
// These resolve automatically when using $g100 theme
$background:       #161616   // --cds-background
$layer-01:         #262626   // --cds-layer-01
$layer-02:         #393939   // --cds-layer-02
$border-subtle-01: #393939
$interactive:      #0f62fe   // IBM Blue — squeeze state
$support-success:  #42be65   // IBM Green — release state
$support-warning:  #f1c21b
$support-error:    #da1e28
$text-primary:     #f4f4f4
$text-secondary:   #c6c6c6
```

### `src/styles/index.scss` — selective imports only
```scss
// 1. Theme first
@use '@carbon/styles/scss/themes' as themes;
@use '@carbon/styles/scss/theme' with (
  $theme: themes.$g100
);

// 2. Base
@use '@carbon/styles/scss/reset';
@use '@carbon/styles/scss/type';
@use '@carbon/styles/scss/spacing';

// 3. Only components used in this app
@use '@carbon/styles/scss/components/button';
@use '@carbon/styles/scss/components/toggle';
@use '@carbon/styles/scss/components/slider';
@use '@carbon/styles/scss/components/progress-bar';

// 4. App overrides
@use './overrides';
```

### `src/styles/_overrides.scss`
```scss
// IBM Carbon sharp corners — remove all border radius
.cds--btn,
.cds--toggle,
.cds--slider {
  border-radius: 0 !important;
}

// Timer display font
.timer-display {
  font-family: 'IBM Plex Mono', monospace;
}
```

### Typography
- Body: IBM Plex Sans (loaded via `@carbon/styles/scss/type`)
- Timer: IBM Plex Mono (loaded via `@carbon/styles/scss/type`)
- No Google Fonts import needed — Carbon handles it

### Component Rules
- **No border radius** — sharp corners, overridden in `_overrides.scss`
- Use `cds--btn cds--btn--primary` classes for buttons
- Use `cds--toggle` for settings toggles
- Use `cds--slider` for volume control
- Custom components (CircularTimer, StatCard) use Carbon tokens via SCSS variables
- Squeeze state: `$interactive` token
- Release state: `$support-success` token

---

## 📁 Project Structure

```
kegel-coach/
├── public/
│   ├── manifest.json          # PWA manifest
│   └── favicon.svg
├── src/
│   ├── main.jsx
│   ├── App.jsx                # Root with router + global state
│   ├── styles/
│   │   ├── index.scss         # Selective Carbon imports
│   │   └── _overrides.scss    # App-specific overrides
│   ├── data/
│   │   └── program.js         # 4-week exercise program data
│   ├── hooks/
│   │   ├── useTimer.js        # Countdown timer logic
│   │   ├── useSound.js        # Web Audio API sound engine
│   │   ├── useVibration.js    # Navigator.vibrate wrapper
│   │   └── useProgress.js     # localStorage progress manager
│   ├── screens/
│   │   ├── HomeScreen.jsx
│   │   ├── SessionScreen.jsx
│   │   ├── CompleteScreen.jsx
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

## 📊 Exercise Program Data — `src/data/program.js`

The full 4-week program. Each day maps to one workout object.

```javascript
export const PROGRAM = {
  week1: {
    label: "Week 1 — Foundation",
    goal: "Learn the movement, build awareness",
    days: Array(7).fill({
      exercises: [
        {
          id: "basic_squeeze",
          name: "Basic Squeeze",
          holdSeconds: 3,
          restSeconds: 3,
          reps: 10,
          sets: 2,
          description: "Squeeze and hold, then fully release."
        }
      ],
      sessionsPerDay: 2
    })
  },
  week2: {
    label: "Week 2 — Building Endurance",
    goal: "Increase hold time",
    days: Array(7).fill({
      exercises: [
        {
          id: "sustained_squeeze",
          name: "Sustained Squeeze",
          holdSeconds: 5,
          restSeconds: 4,
          reps: 10,
          sets: 3,
          description: "Longer hold with full release between reps."
        },
        {
          id: "quick_flicks",
          name: "Quick Flicks",
          holdSeconds: 1,
          restSeconds: 1,
          reps: 15,
          sets: 2,
          description: "Rapid contract-release pulses."
        }
      ],
      sessionsPerDay: 2
    })
  },
  week3: {
    label: "Week 3 — Strength & Control",
    goal: "Build real muscular strength",
    days: Array(7).fill({
      exercises: [
        {
          id: "long_hold",
          name: "Long Hold",
          holdSeconds: 8,
          restSeconds: 5,
          reps: 10,
          sets: 3,
          description: "Extended hold building endurance."
        },
        {
          id: "quick_flicks",
          name: "Quick Flicks",
          holdSeconds: 1,
          restSeconds: 1,
          reps: 20,
          sets: 2,
          description: "Rapid contract-release pulses."
        },
        {
          id: "staircase",
          name: "Staircase Squeeze",
          holdSeconds: 10,
          restSeconds: 6,
          reps: 8,
          sets: 2,
          description: "Squeeze in 3 gradual levels (25% → 50% → 100%) then release in steps."
        }
      ],
      sessionsPerDay: 2
    })
  },
  week4: {
    label: "Week 4 — Power & Endurance",
    goal: "Full control during arousal",
    days: Array(7).fill({
      exercises: [
        {
          id: "power_hold",
          name: "Power Hold",
          holdSeconds: 10,
          restSeconds: 5,
          reps: 12,
          sets: 3,
          description: "Maximum hold with full release."
        },
        {
          id: "quick_flicks",
          name: "Quick Flicks",
          holdSeconds: 1,
          restSeconds: 1,
          reps: 25,
          sets: 3,
          description: "Rapid contract-release pulses."
        },
        {
          id: "staircase",
          name: "Staircase Squeeze",
          holdSeconds: 12,
          restSeconds: 6,
          reps: 8,
          sets: 2,
          description: "Squeeze in 3 gradual levels then release in steps."
        }
      ],
      sessionsPerDay: 2
    })
  }
}
```

---

## 🪝 Hooks Specification

### `useTimer.js`
```
State:
  - timeLeft (seconds)
  - isRunning (bool)
  - phase ("squeeze" | "release" | "idle")
  - currentRep (number)
  - currentSet (number)
  - currentExerciseIndex (number)
  - sessionComplete (bool)

Functions:
  - start(exercise)     → begins timer sequence
  - pause()             → pauses without resetting
  - resume()            → continues from pause
  - stop()              → resets everything
  - skipRep()           → jump to next rep

Logic:
  - Counts down holdSeconds for squeeze phase
  - Then counts down restSeconds for release phase
  - Increments rep counter
  - When reps done → increments set counter
  - When all sets done → moves to next exercise
  - When all exercises done → sets sessionComplete = true
  - On each phase change → fires onPhaseChange(phase) callback
```

### `useSound.js`
```
Uses Web Audio API (no external library).

Sounds generated programmatically:
  - squeezeSound()  → short rising tone (~220hz to 440hz, 0.15s)
  - releaseSound()  → soft falling tone (~440hz to 220hz, 0.2s)
  - completeSound() → success chime (3-note ascending: C-E-G)
  - tickSound()     → subtle tick for last 3 seconds of hold

Settings applied from userSettings:
  - soundEnabled (bool)
  - soundType: "tones" | "voice"   (voice uses SpeechSynthesis API)
  - volume (0.0 to 1.0)

Export:
  - playSqueezeSound()
  - playReleaseSound()
  - playCompleteSound()
  - playTick()
```

### `useVibration.js`
```
Uses Navigator.vibrate API.

Patterns:
  - squeezeVibration:
      "short-short": [80, 50, 80]
      "long":        [200]
      "pulse":       [50, 30, 50, 30, 50]

  - releaseVibration:
      "soft": [40]
      "none": null (no vibration)

Settings applied from userSettings:
  - vibrationEnabled (bool)
  - squeezePattern: "short-short" | "long" | "pulse"
  - releasePattern: "soft" | "none"

Export:
  - vibrateOnSqueeze()
  - vibrateOnRelease()
  - testVibration()
```

### `useProgress.js`
```
Manages localStorage.

Keys:
  - kc_current_week    → 1-4
  - kc_current_day     → 1-7
  - kc_sessions        → JSON array of session objects
  - kc_streak          → number
  - kc_last_session    → ISO date string
  - kc_settings        → JSON settings object

Session object shape:
  {
    id: uuid,
    date: ISO string,
    week: number,
    day: number,
    exercisesCompleted: number,
    totalReps: number,
    durationSeconds: number
  }

Functions:
  - getProgress()         → returns all progress data
  - saveSession(session)  → saves to array, updates streak
  - getSettings()         → returns settings object
  - saveSettings(obj)     → saves settings
  - resetProgress()       → clears all kc_ keys
  - getTodaySessions()    → sessions from today only
  - getWeekSessions()     → sessions from current week
```

---

## 📱 Screen Specifications

### HomeScreen.jsx
```
Layout (mobile, full height):
  - Header: App name "KegelCoach" + settings icon (top right)
  - Week badge: "Week 1 · Day 3" pill
  - Today's workout card:
      Exercise list with hold/rest/reps info
      Estimated duration
  - Stats row (3 cards side by side):
      🔥 Streak (days)
      ✅ This week (sessions done / target)
      ⏱ Total time (all time minutes)
  - Big START SESSION button (full width, IBM Blue)
  - If already done today: "Well done! Session complete today ✓"
    with option to "Do another session"
```

### SessionScreen.jsx
```
Layout:
  - Top bar: Exercise name + "Set X of Y"
  - Large circular SVG timer (center screen):
      - Outer ring animates countdown (stroke-dashoffset)
      - Color: Blue during squeeze, Green during release
      - Center: large countdown number (IBM Plex Mono)
  - Phase label below timer:
      Big text "SQUEEZE" (blue) or "RELEASE" (green)
  - Rep counter: "Rep 3 / 10"
  - Overall progress bar (thin, full width, bottom of timer area)
  - Controls:
      [PAUSE] [STOP] buttons
      Skip rep button (small, secondary)
  - When paused: overlay with RESUME and STOP options
```

### CompleteScreen.jsx
```
Layout:
  - Large checkmark animation (SVG draw-on animation)
  - "Session Complete!" heading
  - Stats summary:
      Total reps completed
      Total time taken
      Sets completed
  - Motivational message based on week:
      Week 1: "Great start! Consistency is everything."
      Week 2: "Building strong foundations!"
      Week 3: "You're getting stronger every day."
      Week 4: "Elite level control incoming!"
  - Two buttons:
      [DO ANOTHER SESSION] (secondary)
      [GO HOME] (primary)
```

### SettingsScreen.jsx
```
Layout:
  - Section: Sound
      Toggle: Sound ON / OFF
      If ON:
        Sound type selector: Tones | Voice
        Volume slider (0–100)
        Squeeze sound preview button
        Release sound preview button

  - Section: Vibration
      Toggle: Vibration ON / OFF
      If ON:
        Squeeze pattern: Short-Short | Long Buzz | Pulse
        Release pattern: Soft | None
        Test vibration button

  - Section: TEST MY SETTINGS button
      Triggers a mini 3-rep demo sequence
      Uses actual sound + vibration settings

  - Section: Progress
      "Reset all progress" (destructive, red, confirm dialog)

  - Section: About
      Version number
      "Built with KegelCoach v1.0"
```

---

## 🔄 App State Flow

```
App.jsx holds global state:
  - currentScreen: "home" | "session" | "complete" | "settings"
  - settings: { soundEnabled, soundType, volume, vibrationEnabled, squeezePattern, releasePattern }
  - completedSession: session object (passed from session → complete screen)

Navigation:
  - Home → Session (on START SESSION)
  - Session → Complete (on session finish)
  - Session → Home (on STOP)
  - Complete → Home (on GO HOME)
  - Any screen → Settings (via icon or nav)

No React Router needed — simple screen state switch.
```

---

## ⚙️ PWA Setup

### `public/manifest.json`
```json
{
  "name": "KegelCoach",
  "short_name": "KegelCoach",
  "description": "Personal pelvic floor trainer",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#161616",
  "theme_color": "#0f62fe",
  "orientation": "portrait",
  "icons": [
    { "src": "/favicon.svg", "sizes": "any", "type": "image/svg+xml" }
  ]
}
```

### `vite.config.js`
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173
  }
})
```

---

## 🚀 Claude Code Instructions

When I give you this document, please:

1. **Scaffold the project** using `npm create vite@latest kegel-coach -- --template react`
2. **Install dependencies**:
   ```bash
   npm install @carbon/styles
   npm install -D sass
   ```
3. **Create `src/styles/index.scss`** with selective Carbon imports as specified above
4. **Create `src/styles/_overrides.scss`** with border-radius resets
5. **Import styles in `main.jsx`**: `import './styles/index.scss'`
6. **Create all files** exactly as specified in the project structure above
7. **Implement each hook** with the exact logic described
8. **Build each screen** using Carbon component classes (`cds--btn`, `cds--toggle`, etc.)
9. **Wire up App.jsx** with screen state switching as described
10. **Set up PWA manifest**
11. **Run `npm run dev`** and confirm it starts without errors

### Coding Standards
- Functional components only, hooks-based
- No class components
- No other UI libraries (no MUI, no Ant Design, no Carbon React components)
- SCSS in `src/styles/` — use Carbon tokens, never hardcode hex values
- Only import Carbon SCSS modules actually used — keep bundle under 40kb
- Inline styles only where dynamic (e.g. timer animation progress via `stroke-dashoffset`)
- Each file max ~150 lines — split if longer
- Comments on all hook logic

---

## ✅ Definition of Done — Phase 1

- [ ] App loads on mobile browser
- [ ] Home screen shows today's workout and streak
- [ ] Session starts with correct exercise for Week 1 Day 1
- [ ] Timer counts down squeeze and release phases correctly
- [ ] Sound plays on squeeze and release (if enabled)
- [ ] Vibration fires on squeeze and release (if enabled)
- [ ] Pause/Resume works correctly
- [ ] Stop returns to home
- [ ] Session complete screen shows correct stats
- [ ] Session is saved to localStorage
- [ ] Settings screen allows sound + vibration customization
- [ ] Test My Settings button works
- [ ] App looks correct on 390px wide mobile screen (iPhone 14 size)

---

*Phase 2 (Progress tracking + weekly calendar) and Phase 3 (Reminders + auto week progression) will be added in subsequent prompts.*
