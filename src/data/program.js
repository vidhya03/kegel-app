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
          description: 'Tighten (like stopping pee), hold for the count, then fully let go. That\'s one rep.'
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
          description: 'Tighten and hold for 5 full seconds, then completely relax. Don\'t rush the rest.'
        },
        {
          id: 'quick_flicks',
          name: 'Quick Flicks',
          holdSeconds: 1,
          restSeconds: 1,
          reps: 15,
          sets: 2,
          description: 'Fast tight-and-let-go pulses — like quick blinks of the muscle.'
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
          description: 'Squeeze and hold tight for 8 seconds — keep breathing. Then let go fully for 5 seconds.'
        },
        {
          id: 'quick_flicks',
          name: 'Quick Flicks',
          holdSeconds: 1,
          restSeconds: 1,
          reps: 20,
          sets: 2,
          description: 'Fast tight-and-let-go pulses — like quick blinks of the muscle.'
        },
        {
          id: 'staircase',
          name: 'Staircase Squeeze',
          holdSeconds: 10,
          restSeconds: 6,
          reps: 8,
          sets: 2,
          description: 'Tighten in 3 rising levels: gentle → medium → full. Then release in the same steps going down.'
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
          description: 'Full max squeeze held for 10 seconds — stay relaxed everywhere else. Release completely.'
        },
        {
          id: 'quick_flicks',
          name: 'Quick Flicks',
          holdSeconds: 1,
          restSeconds: 1,
          reps: 25,
          sets: 3,
          description: 'Fast tight-and-let-go pulses — like quick blinks of the muscle.'
        },
        {
          id: 'staircase',
          name: 'Staircase Squeeze',
          holdSeconds: 12,
          restSeconds: 6,
          reps: 8,
          sets: 2,
          description: 'Tighten in 3 rising levels: gentle → medium → full. Then release in the same steps going down.'
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
