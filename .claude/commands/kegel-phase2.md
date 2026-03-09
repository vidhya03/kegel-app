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
