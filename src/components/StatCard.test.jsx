import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import StatCard from './StatCard'

describe('StatCard', () => {
  it('renders value and label', () => {
    render(<StatCard value="42" label="Total Sessions" />)
    expect(screen.getByText('42')).toBeInTheDocument()
    expect(screen.getByText('Total Sessions')).toBeInTheDocument()
  })

  it('renders numeric values', () => {
    render(<StatCard value={100} label="Reps" />)
    expect(screen.getByText('100')).toBeInTheDocument()
  })

  it('has correct CSS structure', () => {
    const { container } = render(<StatCard value="5" label="Streak" />)
    expect(container.querySelector('.stat-card')).toBeInTheDocument()
    expect(container.querySelector('.stat-card__value')).toBeInTheDocument()
    expect(container.querySelector('.stat-card__label')).toBeInTheDocument()
  })

  it('renders zero value', () => {
    render(<StatCard value={0} label="Days" />)
    expect(screen.getByText('0')).toBeInTheDocument()
  })
})
