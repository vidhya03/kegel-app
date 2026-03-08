# /kegel-status

Show the current build status of the KegelCoach project.

Check the following and report back clearly:

1. Read `CLAUDE.md` for project context
2. List all files currently created under `src/`
3. Check Phase 1 checklist — which items are done vs pending
4. Identify any broken imports or missing files
5. Show which screen is currently being worked on

Report in this format:
```
## KegelCoach Status

Phase: 1 — Timer + Session + Settings
Progress: X / 13 checklist items done

Files created:
  ✅ src/App.jsx
  ✅ src/hooks/useTimer.js
  ❌ src/hooks/useSound.js (missing)
  ...

Currently working on: [screen or hook name]

Next step: [what to build next]
```

---

# /kegel-build-next

Look at `CLAUDE.md`, check what Phase 1 files are missing or incomplete,
then build the next logical piece.

Priority order:
1. `src/data/program.js`
2. `src/hooks/useProgress.js`
3. `src/hooks/useTimer.js`
4. `src/hooks/useSound.js`
5. `src/hooks/useVibration.js`
6. `src/App.jsx`
7. `src/screens/HomeScreen.jsx`
8. `src/screens/SessionScreen.jsx`
9. `src/screens/CompleteScreen.jsx`
10. `src/screens/SettingsScreen.jsx`
11. `src/components/CircularTimer.jsx`
12. `src/index.css`
13. `public/manifest.json`

Always follow IBM Carbon Dark design rules from `CLAUDE.md`.

---

# /kegel-check-design

Review all `.jsx` and `.css` files and check for design violations:

- Any border-radius values? → Remove them
- Any colors not in IBM Carbon Dark palette? → Fix them
- Any font other than IBM Plex Sans / Mono? → Fix it
- Any external UI library imports? → Remove them
- Any hardcoded colors (not using CSS variables)? → Refactor to variables

Report violations with file name and line number.

---

# /kegel-test-checklist

Go through the Phase 1 Definition of Done checklist from `CLAUDE.md`.

For each item:
- Read the relevant source file
- Reason about whether the implementation satisfies the requirement
- Mark as ✅ PASS or ❌ FAIL with a brief reason

At the end, show a summary score and list what needs fixing.

---

# /kegel-phase2

Begin Phase 2 — Progress Tracking.

Add these features on top of the existing Phase 1 code:

1. **ProgressScreen.jsx** — new screen with:
   - Weekly calendar grid (Mon–Sun, current week)
   - Each day shows: session count dot indicators
   - Stats cards: total sessions, total reps, total minutes
   - Simple bar chart using SVG (no chart library) showing sessions per day this week

2. **Update BottomNav.jsx** to include Progress tab (icon: chart bar)

3. **Update App.jsx** to include `progress` in screen state

4. **Update useProgress.js** to add:
   - `getWeekCalendar()` → returns array of 7 days with session counts
   - `getAllTimeStats()` → total sessions, total reps, total minutes

Design rules: same IBM Carbon Dark, no new libraries.
