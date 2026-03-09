// 4-week Kegel exercise program
// Note: use .map(() => ({...})) to avoid shared object references from Array.fill()

export const PROGRAM = {
  week1: {
    label: 'Week 1 — Foundation',
    goal: 'Learn the movement, build awareness',
    days: Array(7).fill(null).map(() => ({
      exercises: [
        {
          id: 'basic_squeeze',
          name: 'Basic Squeeze',
          holdSeconds: 3,
          restSeconds: 3,
          reps: 10,
          sets: 2,
          description: 'Squeeze and hold, then fully release.'
        }
      ],
      sessionsPerDay: 2
    }))
  },
  week2: {
    label: 'Week 2 — Building Endurance',
    goal: 'Increase hold time',
    days: Array(7).fill(null).map(() => ({
      exercises: [
        {
          id: 'sustained_squeeze',
          name: 'Sustained Squeeze',
          holdSeconds: 5,
          restSeconds: 4,
          reps: 10,
          sets: 3,
          description: 'Longer hold with full release between reps.'
        },
        {
          id: 'quick_flicks',
          name: 'Quick Flicks',
          holdSeconds: 1,
          restSeconds: 1,
          reps: 15,
          sets: 2,
          description: 'Rapid contract-release pulses.'
        }
      ],
      sessionsPerDay: 2
    }))
  },
  week3: {
    label: 'Week 3 — Strength & Control',
    goal: 'Build real muscular strength',
    days: Array(7).fill(null).map(() => ({
      exercises: [
        {
          id: 'long_hold',
          name: 'Long Hold',
          holdSeconds: 8,
          restSeconds: 5,
          reps: 10,
          sets: 3,
          description: 'Extended hold building endurance.'
        },
        {
          id: 'quick_flicks',
          name: 'Quick Flicks',
          holdSeconds: 1,
          restSeconds: 1,
          reps: 20,
          sets: 2,
          description: 'Rapid contract-release pulses.'
        },
        {
          id: 'staircase',
          name: 'Staircase Squeeze',
          holdSeconds: 10,
          restSeconds: 6,
          reps: 8,
          sets: 2,
          description: 'Squeeze in 3 gradual levels (25% → 50% → 100%) then release in steps.'
        }
      ],
      sessionsPerDay: 2
    }))
  },
  week4: {
    label: 'Week 4 — Power & Endurance',
    goal: 'Full control during arousal',
    days: Array(7).fill(null).map(() => ({
      exercises: [
        {
          id: 'power_hold',
          name: 'Power Hold',
          holdSeconds: 10,
          restSeconds: 5,
          reps: 12,
          sets: 3,
          description: 'Maximum hold with full release.'
        },
        {
          id: 'quick_flicks',
          name: 'Quick Flicks',
          holdSeconds: 1,
          restSeconds: 1,
          reps: 25,
          sets: 3,
          description: 'Rapid contract-release pulses.'
        },
        {
          id: 'staircase',
          name: 'Staircase Squeeze',
          holdSeconds: 12,
          restSeconds: 6,
          reps: 8,
          sets: 2,
          description: 'Squeeze in 3 gradual levels then release in steps.'
        }
      ],
      sessionsPerDay: 2
    }))
  }
}

// Calculate estimated session duration in minutes
export function estimateDuration(exercises) {
  let total = 0
  for (const ex of exercises) {
    total += ex.sets * ex.reps * (ex.holdSeconds + ex.restSeconds)
  }
  return Math.ceil(total / 60)
}
