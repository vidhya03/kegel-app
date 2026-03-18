import { useCallback, useRef, useEffect } from 'react'

// Convert AudioBuffer → WAV Blob URL (used for HTMLAudioElement iOS keep-alive)
function audioBufferToWavUrl(buffer) {
  const numSamples = buffer.length
  const sampleRate = buffer.sampleRate
  const dataLength = numSamples * 2
  const ab = new ArrayBuffer(44 + dataLength)
  const view = new DataView(ab)
  const write = (offset, str) => { for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i)) }
  write(0, 'RIFF'); view.setUint32(4, 36 + dataLength, true)
  write(8, 'WAVE'); write(12, 'fmt ')
  view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true)
  view.setUint32(24, sampleRate, true); view.setUint32(28, sampleRate * 2, true)
  view.setUint16(32, 2, true); view.setUint16(34, 16, true)
  write(36, 'data'); view.setUint32(40, dataLength, true)
  const samples = buffer.getChannelData(0)
  for (let i = 0; i < numSamples; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]))
    view.setInt16(44 + i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true)
  }
  return URL.createObjectURL(new Blob([ab], { type: 'audio/wav' }))
}

// Generate a completely silent looping WAV to keep iOS audio session alive through lock screen
// iOS only needs audio playback to be active — audible content is not required
function createKeepAliveWavUrl() {
  try {
    const sampleRate = 22050
    const numSamples = sampleRate * 3 // 3s loop of silence
    const dataLength = numSamples * 2
    const ab = new ArrayBuffer(44 + dataLength)
    const view = new DataView(ab)
    const write = (offset, str) => { for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i)) }
    write(0, 'RIFF'); view.setUint32(4, 36 + dataLength, true)
    write(8, 'WAVE'); write(12, 'fmt ')
    view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true)
    view.setUint32(24, sampleRate, true); view.setUint32(28, sampleRate * 2, true)
    view.setUint16(32, 2, true); view.setUint16(34, 16, true)
    write(36, 'data'); view.setUint32(40, dataLength, true)
    // Leave PCM samples as zero — perfectly silent
    return URL.createObjectURL(new Blob([ab], { type: 'audio/wav' }))
  } catch { return null }
}

// Web Audio API sound engine — no external audio files needed
export function useSound(settings) {
  const ctxRef = useRef(null)
  const keepAliveNodeRef = useRef(null)
  const keepAliveAudioRef = useRef(null)
  const keepAliveUrlRef = useRef(null)
  const scheduledNodesRef = useRef([]) // pre-scheduled tones for locked-screen playback
  const staircaseTimersRef = useRef([]) // setTimeout IDs for staircase level cues

  function getCtx() {
    if (!ctxRef.current) {
      try { ctxRef.current = new (window.AudioContext || window.webkitAudioContext)() } catch { return null }
    }
    return ctxRef.current
  }

  async function resumeCtx(ctx) {
    if (ctx.state === 'suspended') { try { await ctx.resume() } catch {} }
  }

  // Schedule a single oscillator at an absolute AudioContext time
  // Returns the node so it can be cancelled later
  function scheduleOsc(ctx, startHz, endHz, durationSec, type, atTime, vol) {
    try {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain); gain.connect(ctx.destination)
      osc.type = type
      osc.frequency.setValueAtTime(startHz, atTime)
      osc.frequency.linearRampToValueAtTime(endHz, atTime + durationSec)
      gain.gain.setValueAtTime(vol * 0.5, atTime)
      gain.gain.exponentialRampToValueAtTime(0.001, atTime + durationSec)
      osc.start(atTime)
      osc.stop(atTime + durationSec)
      return osc
    } catch { return null }
  }

  // PRE-SCHEDULE all session sounds using AudioContext's native clock.
  // The AudioContext scheduler runs in native code — it fires even when the
  // screen is locked and JavaScript is throttled by iOS.
  const scheduleAllSounds = useCallback(async (exercises) => {
    if (!settings.soundEnabled || settings.soundType === 'voice') return
    const ctx = getCtx()
    if (!ctx) return
    await resumeCtx(ctx)

    // Cancel any previously scheduled sounds
    scheduledNodesRef.current.forEach(n => { try { n.stop() } catch {} })
    scheduledNodesRef.current = []

    const vol = settings.volume ?? 0.7
    let t = ctx.currentTime + 0.3 // small startup buffer
    const nodes = []

    for (const ex of exercises) {
      for (let s = 0; s < ex.sets; s++) {
        for (let r = 0; r < ex.reps; r++) {
          if (ex.id === 'staircase') {
            // 3 ascending stepped tones across the hold (E4, A4, C#5)
            const hStep = ex.holdSeconds / 3
            ;[330, 440, 554].forEach((hz, i) => {
              const n = scheduleOsc(ctx, hz, hz, 0.25, 'triangle', t + i * hStep, vol)
              if (n) nodes.push(n)
            })
            t += ex.holdSeconds
            // 3 descending stepped tones across the rest
            const rStep = ex.restSeconds / 3
            ;[554, 440, 330].forEach((hz, i) => {
              const n = scheduleOsc(ctx, hz, hz, 0.25, 'triangle', t + i * rStep, vol)
              if (n) nodes.push(n)
            })
            t += ex.restSeconds
          } else {
            // Squeeze cue — rising sweep
            const n1 = scheduleOsc(ctx, 220, 440, 0.15, 'sine', t, vol)
            if (n1) nodes.push(n1)
            t += ex.holdSeconds
            // Release cue — falling sweep
            const n2 = scheduleOsc(ctx, 440, 220, 0.2, 'sine', t, vol)
            if (n2) nodes.push(n2)
            t += ex.restSeconds
          }
        }
      }
    }

    // Complete chime — C E G
    ;[261.63, 329.63, 392.0].forEach((freq, i) => {
      const n = scheduleOsc(ctx, freq, freq, 0.3, 'sine', t + i * 0.18, vol)
      if (n) nodes.push(n)
    })

    scheduledNodesRef.current = nodes
  }, [settings])

  // Cancel staircase level cue timeouts
  const cancelStaircaseCues = useCallback(() => {
    staircaseTimersRef.current.forEach(id => clearTimeout(id))
    staircaseTimersRef.current = []
    if (window.speechSynthesis) window.speechSynthesis.cancel()
  }, [])

  // Cancel all pre-scheduled sounds (call on stop/pause)
  const cancelScheduledSounds = useCallback(() => {
    scheduledNodesRef.current.forEach(n => { try { n.stop() } catch {} })
    scheduledNodesRef.current = []
    cancelStaircaseCues()
  }, [cancelStaircaseCues])

  // Keep-alive: dual strategy
  // 1. Web Audio silent node — keeps AudioContext alive on Android/Chrome
  // 2. HTMLAudioElement with real audio — keeps iOS audio session alive through lock screen
  const startKeepAlive = useCallback(async () => {
    const ctx = getCtx()
    if (ctx && !keepAliveNodeRef.current) {
      try {
        await resumeCtx(ctx)
        const buffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate)
        const source = ctx.createBufferSource()
        source.buffer = buffer; source.loop = true
        const gain = ctx.createGain(); gain.gain.value = 0.001
        source.connect(gain); gain.connect(ctx.destination)
        source.start()
        keepAliveNodeRef.current = source
      } catch {}
    }

    if (!keepAliveAudioRef.current) {
      const url = createKeepAliveWavUrl()
      if (url) {
        keepAliveUrlRef.current = url
        const audio = new Audio(url)
        audio.loop = true
        audio.volume = 1.0 // volume is irrelevant — WAV is silent PCM zeros
        try { await audio.play() } catch {}
        keepAliveAudioRef.current = audio
      }
    }
  }, [])

  const stopKeepAlive = useCallback(() => {
    if (keepAliveNodeRef.current) { try { keepAliveNodeRef.current.stop() } catch {}; keepAliveNodeRef.current = null }
    if (keepAliveAudioRef.current) { keepAliveAudioRef.current.pause(); keepAliveAudioRef.current = null }
    if (keepAliveUrlRef.current) { URL.revokeObjectURL(keepAliveUrlRef.current); keepAliveUrlRef.current = null }
    cancelScheduledSounds()
  }, [cancelScheduledSounds])

  // Resume AudioContext when returning from background
  useEffect(() => {
    const handleVisibility = async () => {
      if (!document.hidden && ctxRef.current?.state === 'suspended') {
        await ctxRef.current.resume()
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [])

  function speak(text) {
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.volume = settings.volume ?? 0.7; u.rate = 0.9
    window.speechSynthesis.speak(u)
  }

  async function playTone(startHz, endHz, durationSec, type = 'sine') {
    const ctx = getCtx(); if (!ctx) return
    await resumeCtx(ctx)
    scheduleOsc(ctx, startHz, endHz, durationSec, type, ctx.currentTime, settings.volume ?? 0.7)
  }

  // These are used only in voice mode and for immediate feedback (foreground only)
  const playSqueezeSound = useCallback(() => {
    if (!settings.soundEnabled) return
    if (settings.soundType === 'voice') { speak('Squeeze'); return }
    playTone(220, 440, 0.15, 'sine')
  }, [settings])

  const playReleaseSound = useCallback(() => {
    if (!settings.soundEnabled) return
    if (settings.soundType === 'voice') { speak('Release'); return }
    playTone(440, 220, 0.2, 'sine')
  }, [settings])

  const playCompleteSound = useCallback(async () => {
    if (!settings.soundEnabled) return
    if (settings.soundType === 'voice') { speak('Session complete. Well done!'); return }
    const ctx = getCtx(); if (!ctx) return
    await resumeCtx(ctx)
    ;[261.63, 329.63, 392.0].forEach((freq, i) => {
      scheduleOsc(ctx, freq, freq, 0.3, 'sine', ctx.currentTime + i * 0.18, settings.volume ?? 0.7)
    })
  }, [settings])

  const playTick = useCallback(() => {
    if (!settings.soundEnabled) return
    playTone(880, 880, 0.05, 'square')
  }, [settings])

  // Staircase squeeze: announce Level 1 → 2 → 3 spread across holdSeconds
  const playStaircaseSqueeze = useCallback((holdSeconds) => {
    if (!settings.soundEnabled) return
    cancelStaircaseCues()
    const interval = (holdSeconds / 3) * 1000
    if (settings.soundType === 'voice') {
      speak('Gentle squeeze')
      const t2 = setTimeout(() => speak('Medium squeeze'), interval)
      const t3 = setTimeout(() => speak('Full squeeze'), interval * 2)
      staircaseTimersRef.current = [t2, t3]
    } else {
      // 3 ascending triangle tones: E4, A4, C#5
      playTone(330, 330, 0.25, 'triangle')
      const t2 = setTimeout(() => playTone(440, 440, 0.25, 'triangle'), interval)
      const t3 = setTimeout(() => playTone(554, 554, 0.25, 'triangle'), interval * 2)
      staircaseTimersRef.current = [t2, t3]
    }
  }, [settings, cancelStaircaseCues])

  // Staircase release: announce Level 3 → 2 → 1 spread across restSeconds
  const playStaircaseRelease = useCallback((restSeconds) => {
    if (!settings.soundEnabled) return
    cancelStaircaseCues()
    const interval = (restSeconds / 3) * 1000
    if (settings.soundType === 'voice') {
      speak('Gentle release')
      const t2 = setTimeout(() => speak('Medium release'), interval)
      const t3 = setTimeout(() => speak('Full release'), interval * 2)
      staircaseTimersRef.current = [t2, t3]
    } else {
      // 3 descending triangle tones: C#5, A4, E4
      playTone(554, 554, 0.25, 'triangle')
      const t2 = setTimeout(() => playTone(440, 440, 0.25, 'triangle'), interval)
      const t3 = setTimeout(() => playTone(330, 330, 0.25, 'triangle'), interval * 2)
      staircaseTimersRef.current = [t2, t3]
    }
  }, [settings, cancelStaircaseCues])

  return {
    playSqueezeSound, playReleaseSound, playCompleteSound, playTick,
    playStaircaseSqueeze, playStaircaseRelease,
    startKeepAlive, stopKeepAlive,
    scheduleAllSounds, cancelScheduledSounds
  }
}
