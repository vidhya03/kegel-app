import { describe, it, expect } from 'vitest'
import { PROGRAM, estimateDuration, getProgramPhase, getTotalWeeks } from './program'

describe('PROGRAM data', () => {
  const weekKeys = Object.keys(PROGRAM)

  it('contains 12 numbered weeks plus maintenance', () => {
    expect(weekKeys).toHaveLength(13)
    for (let i = 1; i <= 12; i++) {
      expect(PROGRAM[`week${i}`]).toBeDefined()
    }
    expect(PROGRAM.maintenance).toBeDefined()
  })

  it('each week has label, goal, and 7 days', () => {
    for (const key of weekKeys) {
      const week = PROGRAM[key]
      expect(week.label).toBeTruthy()
      expect(week.goal).toBeTruthy()
      expect(week.days).toHaveLength(7)
    }
  })

  it('each day has exercises array and sessionsPerDay', () => {
    for (const key of weekKeys) {
      for (const day of PROGRAM[key].days) {
        expect(Array.isArray(day.exercises)).toBe(true)
        expect(day.exercises.length).toBeGreaterThan(0)
        expect(day.sessionsPerDay).toBeGreaterThan(0)
      }
    }
  })

  it('each exercise has required fields with valid values', () => {
    for (const key of weekKeys) {
      for (const day of PROGRAM[key].days) {
        for (const ex of day.exercises) {
          expect(ex.id).toBeTruthy()
          expect(ex.name).toBeTruthy()
          expect(ex.holdSeconds).toBeGreaterThan(0)
          expect(ex.restSeconds).toBeGreaterThan(0)
          expect(ex.reps).toBeGreaterThan(0)
          expect(ex.sets).toBeGreaterThan(0)
          expect(ex.description).toBeTruthy()
        }
      }
    }
  })

  it('days are independent objects (no shared references from Array.fill)', () => {
    const week1Days = PROGRAM.week1.days
    week1Days[0].exercises[0]._marker = true
    expect(week1Days[1].exercises[0]._marker).toBeUndefined()
    delete week1Days[0].exercises[0]._marker
  })

  it('week1 starts with basic_squeeze exercise', () => {
    const ex = PROGRAM.week1.days[0].exercises[0]
    expect(ex.id).toBe('basic_squeeze')
    expect(ex.holdSeconds).toBe(3)
    expect(ex.restSeconds).toBe(3)
    expect(ex.reps).toBe(10)
    expect(ex.sets).toBe(2)
  })

  it('later weeks have higher hold times than earlier weeks', () => {
    const w1Hold = PROGRAM.week1.days[0].exercises[0].holdSeconds
    const w4Hold = PROGRAM.week4.days[0].exercises[0].holdSeconds
    expect(w4Hold).toBeGreaterThan(w1Hold)
  })

  it('weeks 9-12 and maintenance have sessionsPerDay = 1', () => {
    for (let i = 9; i <= 12; i++) {
      expect(PROGRAM[`week${i}`].days[0].sessionsPerDay).toBe(1)
    }
    expect(PROGRAM.maintenance.days[0].sessionsPerDay).toBe(1)
  })

  it('weeks 1-8 have sessionsPerDay = 2', () => {
    for (let i = 1; i <= 8; i++) {
      expect(PROGRAM[`week${i}`].days[0].sessionsPerDay).toBe(2)
    }
  })
})

describe('estimateDuration', () => {
  it('calculates duration for a single exercise', () => {
    const exercises = [{ holdSeconds: 3, restSeconds: 3, reps: 10, sets: 2 }]
    // 2 sets * 10 reps * (3+3) = 120s = 2 min
    expect(estimateDuration(exercises)).toBe(2)
  })

  it('calculates duration for multiple exercises', () => {
    const exercises = [
      { holdSeconds: 5, restSeconds: 4, reps: 10, sets: 3 },
      { holdSeconds: 1, restSeconds: 1, reps: 15, sets: 2 }
    ]
    // ex1: 3*10*9 = 270s, ex2: 2*15*2 = 60s => 330s => ceil(5.5) = 6 min
    expect(estimateDuration(exercises)).toBe(6)
  })

  it('rounds up partial minutes', () => {
    const exercises = [{ holdSeconds: 1, restSeconds: 1, reps: 1, sets: 1 }]
    // 1*1*2 = 2s => ceil(2/60) = 1 min
    expect(estimateDuration(exercises)).toBe(1)
  })

  it('returns 0 for empty exercises', () => {
    expect(estimateDuration([])).toBe(0)
  })
})

describe('getProgramPhase', () => {
  it('returns foundation for weeks 1-4', () => {
    expect(getProgramPhase('week1')).toBe('foundation')
    expect(getProgramPhase('week2')).toBe('foundation')
    expect(getProgramPhase('week3')).toBe('foundation')
    expect(getProgramPhase('week4')).toBe('foundation')
  })

  it('returns strengthening for weeks 5-8', () => {
    expect(getProgramPhase('week5')).toBe('strengthening')
    expect(getProgramPhase('week6')).toBe('strengthening')
    expect(getProgramPhase('week7')).toBe('strengthening')
    expect(getProgramPhase('week8')).toBe('strengthening')
  })

  it('returns consolidation for weeks 9-12', () => {
    expect(getProgramPhase('week9')).toBe('consolidation')
    expect(getProgramPhase('week10')).toBe('consolidation')
    expect(getProgramPhase('week11')).toBe('consolidation')
    expect(getProgramPhase('week12')).toBe('consolidation')
  })

  it('returns maintenance for maintenance key', () => {
    expect(getProgramPhase('maintenance')).toBe('maintenance')
  })

  it('returns maintenance for unknown keys', () => {
    expect(getProgramPhase('week99')).toBe('maintenance')
    expect(getProgramPhase('invalid')).toBe('maintenance')
  })
})

describe('getTotalWeeks', () => {
  it('returns 12', () => {
    expect(getTotalWeeks()).toBe(12)
  })
})
