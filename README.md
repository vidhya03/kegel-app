# KegelCoach

A personal pelvic floor trainer PWA for men. Guides users through a structured 4-week Kegel exercise program with real-time timer guidance, sound cues, and vibration feedback.

**Live:** [kegel.labkit.in](https://kegel.labkit.in)

---

## Features

- **4-week structured program** — progressive hold/rest/rep sequences
- **Real-time session timer** — circular SVG countdown, squeeze & release phases
- **Sound cues** — Web Audio API tones or voice (SpeechSynthesis)
- **Vibration feedback** — configurable patterns via Navigator.vibrate
- **Progress tracking** — session history, streak counter, monthly calendar
- **Daily reminders** — Web Notifications at a user-set time
- **PWA** — installable on mobile, works offline after first load
- **IBM Carbon Dark** design system throughout

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
| Hosting | Netlify |

---

## Project Structure

```
src/
├── data/program.js          # 4-week exercise program
├── hooks/
│   ├── useTimer.js          # Countdown + phase logic
│   ├── useSound.js          # Web Audio API engine
│   ├── useVibration.js      # Vibration patterns
│   ├── useProgress.js       # localStorage manager + auto week progression
│   └── useReminders.js      # Daily notification scheduler
├── screens/
│   ├── HomeScreen.jsx       # Today's workout + stats
│   ├── SessionScreen.jsx    # Live timer session
│   ├── CompleteScreen.jsx   # Post-session summary
│   ├── ProgressScreen.jsx   # Monthly calendar + all-time stats
│   └── SettingsScreen.jsx   # Sound, vibration, reminder settings
└── components/
    ├── CircularTimer.jsx    # SVG ring timer
    ├── PhaseLabel.jsx       # SQUEEZE / RELEASE label
    ├── StatCard.jsx         # Stat display card
    └── BottomNav.jsx        # Home / Progress / Settings nav
```

---

## Development

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build → dist/
```

---

## Build Phases

| Phase | Status | Features |
|-------|--------|---------|
| Phase 1 | ✅ Done | Timer, sound, vibration, settings, session save |
| Phase 2 | ✅ Done | Monthly calendar, all-time stats, progress screen |
| Phase 3 | ✅ Done | Auto week/day progression, daily reminders |

---

## Design Rules

- IBM Carbon Dark (`g100` theme) — no other UI libraries
- Zero border radius — sharp corners everywhere
- Carbon SCSS tokens only — no hardcoded hex values
- IBM Plex Sans (body) + IBM Plex Mono (timer)
