// 12-week + maintenance Kegel exercise program
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
  },
  week5: {
    label: 'Week 5 — Strengthening',
    goal: 'Increase endurance and session volume',
    days: Array(7).fill(null).map(() => ({
      exercises: [
        {
          id: 'power_hold',
          name: 'Power Hold',
          holdSeconds: 12,
          restSeconds: 5,
          reps: 12,
          sets: 3,
          description: 'Push to your max and hold it for 12 seconds. You\'ve built the base — now add time. Release fully each rep.'
        },
        {
          id: 'quick_flicks',
          name: 'Quick Flicks',
          holdSeconds: 1,
          restSeconds: 1,
          reps: 25,
          sets: 3,
          description: 'Rapid fire contractions — squeeze hard and let go immediately. Keep the rhythm snappy.'
        },
        {
          id: 'staircase',
          name: 'Staircase Squeeze',
          holdSeconds: 12,
          restSeconds: 6,
          reps: 8,
          sets: 2,
          description: 'Three deliberate levels up, three levels down. You\'re training fine motor control, not just raw strength.'
        }
      ],
      sessionsPerDay: 2
    }))
  },
  week6: {
    label: 'Week 6 — Elevator Control',
    goal: 'Build fine motor control through staircase holds',
    days: Array(7).fill(null).map(() => ({
      exercises: [
        {
          id: 'staircase',
          name: 'Staircase Squeeze',
          holdSeconds: 14,
          restSeconds: 6,
          reps: 10,
          sets: 3,
          description: 'Slow and deliberate — 3 levels up, pause at the top, then 3 levels down. Precision is the goal this week.'
        },
        {
          id: 'power_hold',
          name: 'Power Hold',
          holdSeconds: 12,
          restSeconds: 5,
          reps: 12,
          sets: 3,
          description: 'Max effort hold for 12 seconds. Breathe normally — tension only in the pelvic floor, nowhere else.'
        },
        {
          id: 'quick_flicks',
          name: 'Quick Flicks',
          holdSeconds: 1,
          restSeconds: 1,
          reps: 25,
          sets: 3,
          description: 'Fast pulses to finish the session. Keep them clean — fully on, fully off, every rep.'
        }
      ],
      sessionsPerDay: 2
    }))
  },
  week7: {
    label: 'Week 7 — Rep Density',
    goal: 'More reps, shorter rest — build stamina',
    days: Array(7).fill(null).map(() => ({
      exercises: [
        {
          id: 'power_hold',
          name: 'Power Hold',
          holdSeconds: 12,
          restSeconds: 4,
          reps: 15,
          sets: 3,
          description: 'More reps, less rest — your muscle is ready for this. Stay focused and don\'t let form slip.'
        },
        {
          id: 'quick_flicks',
          name: 'Quick Flicks',
          holdSeconds: 1,
          restSeconds: 1,
          reps: 30,
          sets: 3,
          description: '30 clean pulses. This is where stamina is built — push through the burn at the end of each set.'
        },
        {
          id: 'staircase',
          name: 'Staircase Squeeze',
          holdSeconds: 14,
          restSeconds: 5,
          reps: 10,
          sets: 3,
          description: 'The elevator goes higher this week. Hit each level clearly before moving up or down.'
        }
      ],
      sessionsPerDay: 2
    }))
  },
  week8: {
    label: 'Week 8 — Peak Strength',
    goal: 'Maximum strength before consolidation phase',
    days: Array(7).fill(null).map(() => ({
      exercises: [
        {
          id: 'power_hold',
          name: 'Power Hold',
          holdSeconds: 15,
          restSeconds: 5,
          reps: 12,
          sets: 3,
          description: '15 solid seconds at full effort. This is your peak strength week — give it everything you have.'
        },
        {
          id: 'staircase',
          name: 'Staircase Squeeze',
          holdSeconds: 15,
          restSeconds: 5,
          reps: 12,
          sets: 3,
          description: 'Climb all the way to the top and hold it for 15 seconds before stepping back down. You\'ve earned this level.'
        },
        {
          id: 'quick_flicks',
          name: 'Quick Flicks',
          holdSeconds: 1,
          restSeconds: 1,
          reps: 30,
          sets: 3,
          description: 'High-speed finisher. Squeeze hard and release completely — no half reps.'
        }
      ],
      sessionsPerDay: 2
    }))
  },
  week9: {
    label: 'Week 9 — Consolidation',
    goal: 'Maintain peak strength, reduce frequency',
    days: Array(7).fill(null).map(() => ({
      exercises: [
        {
          id: 'combo',
          name: 'Combo Hold + Flicks',
          holdSeconds: 15,
          restSeconds: 5,
          reps: 12,
          sets: 3,
          description: 'Hold max squeeze for 15 seconds, then fire off 5 quick flicks before you release. One fluid movement — hold, pulse, let go.'
        },
        {
          id: 'staircase',
          name: 'Staircase Squeeze',
          holdSeconds: 15,
          restSeconds: 5,
          reps: 12,
          sets: 3,
          description: 'Step up, hold the top, step back down. Controlled precision — your body knows the movement by now.'
        },
        {
          id: 'quick_flicks',
          name: 'Quick Flicks',
          holdSeconds: 1,
          restSeconds: 1,
          reps: 30,
          sets: 2,
          description: 'Finish strong with rapid fire pulses. One daily session from here — make it count.'
        }
      ],
      sessionsPerDay: 1
    }))
  },
  week10: {
    label: 'Week 10 — Endurance Push',
    goal: 'Longer sessions, peak rep count',
    days: Array(7).fill(null).map(() => ({
      exercises: [
        {
          id: 'combo',
          name: 'Combo Hold + Flicks',
          holdSeconds: 15,
          restSeconds: 4,
          reps: 15,
          sets: 4,
          description: 'Hold hard for 15 seconds, immediately hit 5 sharp flicks, then release fully. Four sets today — your endurance will carry you.'
        },
        {
          id: 'staircase',
          name: 'Staircase Squeeze',
          holdSeconds: 15,
          restSeconds: 4,
          reps: 15,
          sets: 3,
          description: 'More reps, tighter rest. Each climb should feel controlled — this is endurance training, not a sprint.'
        },
        {
          id: 'quick_flicks',
          name: 'Quick Flicks',
          holdSeconds: 1,
          restSeconds: 1,
          reps: 30,
          sets: 2,
          description: 'Clean, sharp, full-effort pulses to close the session. You\'re in the home stretch now.'
        }
      ],
      sessionsPerDay: 1
    }))
  },
  week11: {
    label: 'Week 11 — Elite Control',
    goal: 'Full coordination across all exercise types',
    days: Array(7).fill(null).map(() => ({
      exercises: [
        {
          id: 'power_hold',
          name: 'Power Hold',
          holdSeconds: 20,
          restSeconds: 4,
          reps: 15,
          sets: 4,
          description: '20 full seconds of max effort. Four sets. This is elite territory — stay composed and breathe through it.'
        },
        {
          id: 'combo',
          name: 'Combo Hold + Flicks',
          holdSeconds: 15,
          restSeconds: 4,
          reps: 15,
          sets: 3,
          description: 'Hold 15 seconds, burst into 5 flicks, then full release. Smooth coordination between strength and speed.'
        },
        {
          id: 'staircase',
          name: 'Staircase Squeeze',
          holdSeconds: 20,
          restSeconds: 5,
          reps: 12,
          sets: 3,
          description: 'A slow, deliberate 20-second climb and descent. Every level should feel intentional — you have full control now.'
        }
      ],
      sessionsPerDay: 1
    }))
  },
  week12: {
    label: 'Week 12 — Graduation',
    goal: 'Celebrate full strength. Set the maintenance habit.',
    days: Array(7).fill(null).map(() => ({
      exercises: [
        {
          id: 'power_hold',
          name: 'Power Hold',
          holdSeconds: 20,
          restSeconds: 4,
          reps: 15,
          sets: 4,
          description: 'You started with 3 seconds. Now you\'re holding 20. Max effort, four sets — this is your graduation test.'
        },
        {
          id: 'staircase',
          name: 'Staircase Squeeze',
          holdSeconds: 20,
          restSeconds: 4,
          reps: 15,
          sets: 4,
          description: 'The full elevator — all the way up, all the way down, 15 times. You have complete control of this muscle.'
        },
        {
          id: 'combo',
          name: 'Combo Hold + Flicks',
          holdSeconds: 20,
          restSeconds: 4,
          reps: 15,
          sets: 3,
          description: 'Hold 20 seconds at full strength, then burst into 5 quick flicks before releasing. Your strongest combo yet.'
        },
        {
          id: 'quick_flicks',
          name: 'Quick Flicks',
          holdSeconds: 1,
          restSeconds: 1,
          reps: 30,
          sets: 3,
          description: 'Finish the program the way it started — with intention. Thirty sharp, full-effort pulses. You made it.'
        }
      ],
      sessionsPerDay: 1
    }))
  },
  maintenance: {
    label: 'Maintenance — For Life',
    goal: 'Keep your gains. Just 5–7 minutes a day, every day.',
    days: Array(7).fill(null).map(() => ({
      exercises: [
        {
          id: 'power_hold',
          name: 'Power Hold',
          holdSeconds: 15,
          restSeconds: 5,
          reps: 10,
          sets: 3,
          description: 'Keep the strength you built. 15 seconds, full effort — this is your daily investment in long-term control.'
        },
        {
          id: 'staircase',
          name: 'Staircase Squeeze',
          holdSeconds: 15,
          restSeconds: 5,
          reps: 10,
          sets: 2,
          description: 'A quick elevator run to maintain fine motor control. Two sets is all it takes to stay sharp.'
        },
        {
          id: 'quick_flicks',
          name: 'Quick Flicks',
          holdSeconds: 1,
          restSeconds: 1,
          reps: 20,
          sets: 2,
          description: 'Fast finish. 20 clean pulses to keep the fast-twitch fibres firing. Short, consistent, effective.'
        }
      ],
      sessionsPerDay: 1
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

// Returns the training phase for a given week key
export function getProgramPhase(weekKey) {
  if (weekKey === 'maintenance') return 'maintenance'
  const num = parseInt(weekKey.replace('week', ''), 10)
  if (num >= 1 && num <= 4) return 'foundation'
  if (num >= 5 && num <= 8) return 'strengthening'
  if (num >= 9 && num <= 12) return 'consolidation'
  return 'maintenance'
}

// Returns total number of structured weeks (excludes maintenance)
export function getTotalWeeks() {
  return 12
}
