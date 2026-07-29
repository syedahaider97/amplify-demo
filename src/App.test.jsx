import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App, { formatCount } from './App.jsx'

describe('formatCount', () => {
  it('uses singular for one', () => {
    expect(formatCount(1)).toBe('1 deploy')
  })

  it('uses plural otherwise', () => {
    expect(formatCount(0)).toBe('0 deploys')
    expect(formatCount(3)).toBe('3 deploys')
  })
})

describe('App', () => {
  it('renders the headline', () => {
    render(<App />)
    expect(screen.getByText(/GitHub → AWS Amplify/i)).toBeInTheDocument()
  })

  it('increments the counter on click', () => {
    render(<App />)
    const button = screen.getByRole('button', { name: /Ship it/i })
    expect(button).toHaveTextContent('0 deploys')
    fireEvent.click(button)
    expect(button).toHaveTextContent('1 deploy')
  })
})
