import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook } from '@testing-library/react'

// navigator.vibrate must exist before the module is imported,
// because isVibrationSupported is evaluated at module scope.
const vibrateMock = vi.fn()
Object.defineProperty(navigator, 'vibrate', { value: vibrateMock, writable: true, configurable: true })

const { useVibration, isVibrationSupported } = await import('./useVibration')

describe('useVibration', () => {
  beforeEach(() => {
    vibrateMock.mockClear()
  })

  it('detects vibration as supported', () => {
    expect(isVibrationSupported).toBe(true)
  })

  it('vibrateOnSqueeze calls navigator.vibrate with the selected pattern', () => {
    const settings = { vibrationEnabled: true, squeezePattern: 'short-short', releasePattern: 'soft' }
    const { result } = renderHook(() => useVibration(settings))

    result.current.vibrateOnSqueeze()
    expect(vibrateMock).toHaveBeenCalledWith([80, 50, 80])
  })

  it('vibrateOnSqueeze uses long pattern', () => {
    const settings = { vibrationEnabled: true, squeezePattern: 'long', releasePattern: 'soft' }
    const { result } = renderHook(() => useVibration(settings))

    result.current.vibrateOnSqueeze()
    expect(vibrateMock).toHaveBeenCalledWith([200])
  })

  it('vibrateOnSqueeze uses pulse pattern', () => {
    const settings = { vibrationEnabled: true, squeezePattern: 'pulse', releasePattern: 'soft' }
    const { result } = renderHook(() => useVibration(settings))

    result.current.vibrateOnSqueeze()
    expect(vibrateMock).toHaveBeenCalledWith([50, 30, 50, 30, 50])
  })

  it('vibrateOnSqueeze falls back to short-short for unknown pattern', () => {
    const settings = { vibrationEnabled: true, squeezePattern: 'unknown', releasePattern: 'soft' }
    const { result } = renderHook(() => useVibration(settings))

    result.current.vibrateOnSqueeze()
    expect(vibrateMock).toHaveBeenCalledWith([80, 50, 80])
  })

  it('vibrateOnRelease calls navigator.vibrate with soft pattern', () => {
    const settings = { vibrationEnabled: true, squeezePattern: 'short-short', releasePattern: 'soft' }
    const { result } = renderHook(() => useVibration(settings))

    result.current.vibrateOnRelease()
    expect(vibrateMock).toHaveBeenCalledWith([40])
  })

  it('vibrateOnRelease does not vibrate with none pattern', () => {
    const settings = { vibrationEnabled: true, squeezePattern: 'short-short', releasePattern: 'none' }
    const { result } = renderHook(() => useVibration(settings))

    result.current.vibrateOnRelease()
    expect(vibrateMock).not.toHaveBeenCalled()
  })

  it('does not vibrate when vibrationEnabled is false', () => {
    const settings = { vibrationEnabled: false, squeezePattern: 'short-short', releasePattern: 'soft' }
    const { result } = renderHook(() => useVibration(settings))

    result.current.vibrateOnSqueeze()
    result.current.vibrateOnRelease()
    expect(vibrateMock).not.toHaveBeenCalled()
  })

  it('testVibration calls navigator.vibrate with demo pattern', () => {
    const settings = { vibrationEnabled: true, squeezePattern: 'short-short', releasePattern: 'soft' }
    const { result } = renderHook(() => useVibration(settings))

    const didVibrate = result.current.testVibration()
    expect(didVibrate).toBe(true)
    expect(vibrateMock).toHaveBeenCalledWith([80, 50, 80, 100, 200, 100, 50, 30, 50, 30, 50])
  })

  it('reports isSupported correctly', () => {
    const settings = { vibrationEnabled: true, squeezePattern: 'short-short', releasePattern: 'soft' }
    const { result } = renderHook(() => useVibration(settings))
    expect(result.current.isSupported).toBe(true)
  })
})
