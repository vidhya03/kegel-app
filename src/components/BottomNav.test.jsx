import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import BottomNav from './BottomNav'

describe('BottomNav', () => {
  const defaultProps = {
    currentScreen: 'home',
    onNavigate: vi.fn(),
    theme: 'dark',
    onToggleTheme: vi.fn()
  }

  it('renders all navigation buttons', () => {
    render(<BottomNav {...defaultProps} />)
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Progress')).toBeInTheDocument()
    expect(screen.getByText('Feedback')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
  })

  it('highlights the active screen', () => {
    const { container } = render(<BottomNav {...defaultProps} currentScreen="settings" />)
    const settingsBtn = container.querySelector('.bottom-nav__item--active')
    expect(settingsBtn).toBeInTheDocument()
    expect(settingsBtn.textContent).toContain('Settings')
  })

  it('calls onNavigate when Home is clicked', () => {
    const onNavigate = vi.fn()
    render(<BottomNav {...defaultProps} onNavigate={onNavigate} />)

    fireEvent.click(screen.getByText('Home'))
    expect(onNavigate).toHaveBeenCalledWith('home')
  })

  it('calls onNavigate when Progress is clicked', () => {
    const onNavigate = vi.fn()
    render(<BottomNav {...defaultProps} onNavigate={onNavigate} />)

    fireEvent.click(screen.getByText('Progress'))
    expect(onNavigate).toHaveBeenCalledWith('progress')
  })

  it('calls onNavigate when Feedback is clicked', () => {
    const onNavigate = vi.fn()
    render(<BottomNav {...defaultProps} onNavigate={onNavigate} />)

    fireEvent.click(screen.getByText('Feedback'))
    expect(onNavigate).toHaveBeenCalledWith('feedback')
  })

  it('calls onNavigate when Settings is clicked', () => {
    const onNavigate = vi.fn()
    render(<BottomNav {...defaultProps} onNavigate={onNavigate} />)

    fireEvent.click(screen.getByText('Settings'))
    expect(onNavigate).toHaveBeenCalledWith('settings')
  })

  it('shows Light label in dark theme', () => {
    render(<BottomNav {...defaultProps} theme="dark" />)
    expect(screen.getByText('Light')).toBeInTheDocument()
  })

  it('shows Dark label in light theme', () => {
    render(<BottomNav {...defaultProps} theme="light" />)
    expect(screen.getByText('Dark')).toBeInTheDocument()
  })

  it('calls onToggleTheme when theme button is clicked', () => {
    const onToggleTheme = vi.fn()
    render(<BottomNav {...defaultProps} onToggleTheme={onToggleTheme} />)

    fireEvent.click(screen.getByText('Light'))
    expect(onToggleTheme).toHaveBeenCalledOnce()
  })

  it('has correct aria-labels on buttons', () => {
    render(<BottomNav {...defaultProps} />)
    expect(screen.getByLabelText('Home')).toBeInTheDocument()
    expect(screen.getByLabelText('Progress')).toBeInTheDocument()
    expect(screen.getByLabelText('Feedback')).toBeInTheDocument()
    expect(screen.getByLabelText('Settings')).toBeInTheDocument()
    expect(screen.getByLabelText('Switch to light theme')).toBeInTheDocument()
  })

  it('shows correct theme toggle aria-label in light mode', () => {
    render(<BottomNav {...defaultProps} theme="light" />)
    expect(screen.getByLabelText('Switch to dark theme')).toBeInTheDocument()
  })
})
