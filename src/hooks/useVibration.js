import { useCallback } from 'react'

// Vibration patterns in milliseconds [vibrate, pause, vibrate, ...]
const SQUEEZE_PATTERNS = {
  'short-short': [80, 50, 80],
  'long': [200],
  'pulse': [50, 30, 50, 30, 50]
}

const RELEASE_PATTERNS = {
  'soft': [40],
  'none': null
}

// Safe vibrate wrapper — Navigator.vibrate not supported on all browsers (e.g. iOS)
function vibrate(pattern) {
  if (!('vibrate' in navigator)) return
  if (!pattern) return
  try {
    navigator.vibrate(pattern)
  } catch {
    // silently fail
  }
}

export function useVibration(settings) {
  const vibrateOnSqueeze = useCallback(() => {
    if (!settings.vibrationEnabled) return
    const pattern = SQUEEZE_PATTERNS[settings.squeezePattern] || SQUEEZE_PATTERNS['short-short']
    vibrate(pattern)
  }, [settings])

  const vibrateOnRelease = useCallback(() => {
    if (!settings.vibrationEnabled) return
    const pattern = RELEASE_PATTERNS[settings.releasePattern]
    if (pattern) vibrate(pattern)
  }, [settings])

  const testVibration = useCallback(() => {
    // Play all patterns in sequence with gaps
    const supported = 'vibrate' in navigator
    if (!supported) return false
    vibrate([80, 50, 80, 100, 200, 100, 50, 30, 50, 30, 50])
    return true
  }, [])

  return { vibrateOnSqueeze, vibrateOnRelease, testVibration }
}
