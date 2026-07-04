import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import CircularTimer from './CircularTimer'

describe('CircularTimer', () => {
  it('renders the time left as text', () => {
    render(<CircularTimer timeLeft={5} totalSeconds={10} phase="squeeze" />)
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('renders an SVG element', () => {
    const { container } = render(<CircularTimer timeLeft={3} totalSeconds={3} phase="squeeze" />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('renders two circles (background track + progress ring)', () => {
    const { container } = render(<CircularTimer timeLeft={3} totalSeconds={3} phase="squeeze" />)
    const circles = container.querySelectorAll('circle')
    expect(circles).toHaveLength(2)
  })

  it('uses blue stroke for squeeze phase', () => {
    const { container } = render(<CircularTimer timeLeft={3} totalSeconds={3} phase="squeeze" />)
    const progressCircle = container.querySelectorAll('circle')[1]
    expect(progressCircle.getAttribute('stroke')).toBe('#0f62fe')
  })

  it('uses green stroke for release phase', () => {
    const { container } = render(<CircularTimer timeLeft={2} totalSeconds={2} phase="release" />)
    const progressCircle = container.querySelectorAll('circle')[1]
    expect(progressCircle.getAttribute('stroke')).toBe('#42be65')
  })

  it('calculates stroke-dashoffset based on progress', () => {
    const { container } = render(<CircularTimer timeLeft={5} totalSeconds={10} phase="squeeze" />)
    const progressCircle = container.querySelectorAll('circle')[1]
    const circumference = 2 * Math.PI * 105 // (220 - 10) / 2 = 105
    const expectedOffset = circumference * (1 - 0.5)
    expect(Number(progressCircle.getAttribute('stroke-dashoffset'))).toBeCloseTo(expectedOffset, 1)
  })

  it('shows full ring when timeLeft equals totalSeconds', () => {
    const { container } = render(<CircularTimer timeLeft={10} totalSeconds={10} phase="squeeze" />)
    const progressCircle = container.querySelectorAll('circle')[1]
    expect(Number(progressCircle.getAttribute('stroke-dashoffset'))).toBeCloseTo(0, 1)
  })

  it('handles totalSeconds of 0 gracefully', () => {
    const { container } = render(<CircularTimer timeLeft={0} totalSeconds={0} phase="idle" />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })
})
