import { useCallback, useRef } from 'react'

// Web Audio API sound engine — no external audio files needed
export function useSound(settings) {
  const ctxRef = useRef(null)

  // Lazily create AudioContext on first use (browsers require user gesture)
  function getCtx() {
    if (!ctxRef.current) {
      try {
        ctxRef.current = new (window.AudioContext || window.webkitAudioContext)()
      } catch {
        return null
      }
    }
    // Resume if suspended (autoplay policy)
    if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume()
    }
    return ctxRef.current
  }

  // Play a tone: frequency sweep from startHz to endHz over durationSec
  function playTone(startHz, endHz, durationSec, type = 'sine') {
    const ctx = getCtx()
    if (!ctx) return

    try {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.type = type
      osc.frequency.setValueAtTime(startHz, ctx.currentTime)
      osc.frequency.linearRampToValueAtTime(endHz, ctx.currentTime + durationSec)

      const vol = settings.volume ?? 0.7
      gain.gain.setValueAtTime(vol * 0.5, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationSec)

      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + durationSec)
    } catch {
      // silently fail if audio is blocked
    }
  }

  // Voice cues via SpeechSynthesis API
  function speak(text) {
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.volume = settings.volume ?? 0.7
    utterance.rate = 0.9
    window.speechSynthesis.speak(utterance)
  }

  const playSqueezeSound = useCallback(() => {
    if (!settings.soundEnabled) return
    if (settings.soundType === 'voice') {
      speak('Squeeze')
      return
    }
    // Rising tone: 220hz → 440hz over 0.15s
    playTone(220, 440, 0.15, 'sine')
  }, [settings])

  const playReleaseSound = useCallback(() => {
    if (!settings.soundEnabled) return
    if (settings.soundType === 'voice') {
      speak('Release')
      return
    }
    // Falling tone: 440hz → 220hz over 0.2s
    playTone(440, 220, 0.2, 'sine')
  }, [settings])

  const playCompleteSound = useCallback(() => {
    if (!settings.soundEnabled) return
    if (settings.soundType === 'voice') {
      speak('Session complete. Well done!')
      return
    }
    // 3-note ascending chime: C(261) E(330) G(392)
    const ctx = getCtx()
    if (!ctx) return
    const notes = [261.63, 329.63, 392.0]
    notes.forEach((freq, i) => {
      try {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.type = 'sine'
        osc.frequency.value = freq
        const vol = settings.volume ?? 0.7
        const t = ctx.currentTime + i * 0.18
        gain.gain.setValueAtTime(vol * 0.5, t)
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3)
        osc.start(t)
        osc.stop(t + 0.3)
      } catch {
        // silently fail
      }
    })
  }, [settings])

  const playTick = useCallback(() => {
    if (!settings.soundEnabled) return
    // Subtle tick: short high-pitched click
    playTone(880, 880, 0.05, 'square')
  }, [settings])

  return { playSqueezeSound, playReleaseSound, playCompleteSound, playTick }
}
