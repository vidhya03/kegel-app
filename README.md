# KegelCoach

[![Netlify Status](https://api.netlify.com/api/v1/badges/1cef99a7-6793-4205-bc39-f686e7f90b03/deploy-status)](https://app.netlify.com/projects/astonishing-melba-bb57b7/deploys)

A free, structured pelvic floor trainer PWA. Guides you through a 4-week Kegel exercise program with real-time timer guidance, sound cues, and vibration feedback.

**Live:** [kegel.labkit.in](https://kegel.labkit.in)

---

## Features

- **4-week structured program** — progressive hold/rest/rep sequences
- **Per-exercise play buttons** — start a full session or any individual exercise
- **Real-time session timer** — circular SVG countdown, squeeze & release phases
- **Sound cues** — Web Audio API tones or voice (SpeechSynthesis)
- **Vibration feedback** — configurable patterns via Navigator.vibrate
- **Progress tracking** — session history, streak counter, monthly calendar
- **Daily reminders** — Web Notifications at a user-set time
- **Dark / light theme** — toggle with moon/sun icon, defaults to dark
- **Background timer** — Page Visibility API keeps timer accurate when app is minimized
- **Screen Wake Lock** — prevents screen sleeping during a session
- **Feedback form** — Netlify Forms contact form + social links
- **PWA** — installable on mobile, works offline after first load

---

## Test Locally

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm (comes with Node)

### Run on desktop

```bash
# 1. Clone
git clone git@github.com:vidhya03/kegel-app.git
cd kegel-app

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev
```

Open **http://localhost:5173** in your browser.

---

### Test on your phone (same Wi-Fi)

The Vite config has `host: true`, so the dev server is accessible from other devices on the same network.

**Step 1 — find your machine's local IP:**

```bash
# Windows (run in Command Prompt or PowerShell)
ipconfig
# Look for "IPv4 Address" under your Wi-Fi adapter, e.g. 192.168.1.10

# Mac / Linux
ifconfig | grep "inet "
```

**Step 2 — open on phone:**

In your phone browser, go to:
```
http://<your-ip>:5173
# e.g. http://192.168.1.10:5173
```

> Both your PC and phone must be on the same Wi-Fi network.

---

### Build & preview production bundle

```bash
npm run build      # compiles to dist/
npm run preview    # serves dist/ at http://localhost:4173
```

---

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + Vite 6 |
| Design | IBM Carbon Dark (`@carbon/styles` selective SCSS imports) |
| Storage | localStorage (`kc_` prefix) |
| Audio | Web Audio API (no external files) |
| Haptics | Navigator.vibrate |
| Notifications | Web Notifications API |
| Forms | Netlify Forms |
| Hosting | Netlify |

---

## Project Structure

```
kegel-coach/
├── public/
│   ├── manifest.json            # PWA manifest
│   └── favicon.svg
├── src/
│   ├── main.jsx                 # Entry point
│   ├── App.jsx                  # Global state + screen routing + theme toggle
│   ├── styles/
│   │   ├── index.scss           # Selective Carbon SCSS imports
│   │   └── _overrides.scss      # Dark + light theme, layout overrides
│   ├── data/
│   │   └── program.js           # 4-week exercise program data
│   ├── hooks/
│   │   ├── useTimer.js          # Countdown + phase logic + Wake Lock + Visibility API
│   │   ├── useSound.js          # Web Audio API tones / voice
│   │   ├── useVibration.js      # Navigator.vibrate patterns
│   │   ├── useProgress.js       # localStorage manager + auto week progression
│   │   └── useReminders.js      # Daily notification scheduler
│   ├── screens/
│   │   ├── HomeScreen.jsx       # Week selector + exercise rows + stats
│   │   ├── SessionScreen.jsx    # Live timer session
│   │   ├── CompleteScreen.jsx   # Post-session summary
│   │   ├── ProgressScreen.jsx   # Monthly calendar + all-time stats
│   │   ├── SettingsScreen.jsx   # Sound, vibration, reminder settings
│   │   └── FeedbackScreen.jsx   # Contact form + social links
│   └── components/
│       ├── CircularTimer.jsx    # SVG ring timer
│       ├── PhaseLabel.jsx       # SQUEEZE / RELEASE label
│       ├── StatCard.jsx         # Stat display card
│       └── BottomNav.jsx        # Home / Progress / Feedback / Settings nav
├── index.html                   # PWA root + hidden Netlify form
├── netlify.toml                 # Build config + SPA redirect
├── vite.config.js
└── package.json
```

---

## localStorage Keys

All keys prefixed with `kc_` to avoid conflicts.

| Key | Description |
|-----|-------------|
| `kc_current_week` | Active week (1–4) |
| `kc_current_day` | Active day (1–7) |
| `kc_sessions` | All completed sessions (JSON array) |
| `kc_streak` | Consecutive day streak |
| `kc_last_session` | ISO date of last session |
| `kc_settings` | Sound + vibration + reminder preferences |

---

## Build Phases

| Phase | Status | Features |
|-------|--------|---------|
| Phase 1 | ✅ Done | Timer, sound, vibration, settings, session save |
| Phase 2 | ✅ Done | Monthly calendar, all-time stats, progress screen |
| Phase 3 | ✅ Done | Auto week/day progression, daily reminders |

---

## Notes

- **Feedback form** only works on the deployed Netlify URL — not on `localhost`
- **Screen Wake Lock** requires HTTPS — works on live URL, not localhost
- **Vibration** is not supported on iOS Safari — Settings screen shows a message instead
- **Voice mode** uses `window.speechSynthesis` — available in most modern browsers

To receive feedback emails after deploy:
1. Netlify dashboard → your site → **Forms** → `feedback`
2. **Form notifications** → add email `it.vidhyadharan@gmail.com`

---

## Design Rules

- IBM Carbon Dark (`g100` theme) — no other UI libraries
- Zero border radius — sharp corners everywhere
- Carbon SCSS tokens only — no hardcoded hex values in components
- IBM Plex Sans (body) + IBM Plex Mono (timer)

---

## Author

**Vidhyadharan**
- Instagram: [@03vidhya](https://instagram.com/03vidhya)
- LinkedIn: [vidhyadharan](https://www.linkedin.com/in/vidhyadharan/)
