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

// iOS Safari has never supported navigator.vibrate — it is blocked at OS level.
// This flag is the single source of truth used by the hook and the UI.
export const isVibrationSupported = 'vibrate' in navigator

// Safe vibrate wrapper
function vibrate(pattern) {
  if (!isVibrationSupported) return
  if (!pattern) return
  try {
    navigator.vibrate(pattern)
  } catch {
    // silently fail
  }
}

export function useVibration(settings) {
  const vibrateOnSqueeze = useCallback(() => {
    if (!isVibrationSupported || !settings.vibrationEnabled) return
    const pattern = SQUEEZE_PATTERNS[settings.squeezePattern] || SQUEEZE_PATTERNS['short-short']
    vibrate(pattern)
  }, [settings])

  const vibrateOnRelease = useCallback(() => {
    if (!isVibrationSupported || !settings.vibrationEnabled) return
    const pattern = RELEASE_PATTERNS[settings.releasePattern]
    if (pattern) vibrate(pattern)
  }, [settings])

  const testVibration = useCallback(() => {
    if (!isVibrationSupported) return false
    vibrate([80, 50, 80, 100, 200, 100, 50, 30, 50, 30, 50])
    return true
  }, [])

  return { vibrateOnSqueeze, vibrateOnRelease, testVibration, isSupported: isVibrationSupported }
}
