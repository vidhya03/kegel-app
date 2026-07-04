import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import PhaseLabel from './PhaseLabel'

describe('PhaseLabel', () => {
  it('renders SQUEEZE for squeeze phase', () => {
    render(<PhaseLabel phase="squeeze" />)
    expect(screen.getByText('SQUEEZE')).toBeInTheDocument()
  })

  it('renders RELEASE for release phase', () => {
    render(<PhaseLabel phase="release" />)
    expect(screen.getByText('RELEASE')).toBeInTheDocument()
  })

  it('renders READY for idle phase', () => {
    render(<PhaseLabel phase="idle" />)
    expect(screen.getByText('READY')).toBeInTheDocument()
  })

  it('renders READY when phase is undefined', () => {
    render(<PhaseLabel />)
    expect(screen.getByText('READY')).toBeInTheDocument()
  })

  it('applies the correct CSS class for squeeze', () => {
    const { container } = render(<PhaseLabel phase="squeeze" />)
    expect(container.querySelector('.phase-label--squeeze')).toBeInTheDocument()
  })

  it('applies the correct CSS class for release', () => {
    const { container } = render(<PhaseLabel phase="release" />)
    expect(container.querySelector('.phase-label--release')).toBeInTheDocument()
  })

  it('applies idle CSS class when phase is undefined', () => {
    const { container } = render(<PhaseLabel />)
    expect(container.querySelector('.phase-label--idle')).toBeInTheDocument()
  })
})
