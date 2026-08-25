import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { App } from '../../App'

function renderRoute(route: string) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>,
  )
}

describe('FinTrack product structure and preferences', () => {
  it('uses the dashboard as the primary financial overview', () => {
    renderRoute('/')

    expect(
      screen.getByRole('heading', { name: 'Overview' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Financial summary' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Income vs expenses' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Spending by category' }),
    ).toBeInTheDocument()
    expect(screen.getByText('No conversion rate is applied.')).toBeInTheDocument()
  })

  it('persists theme and applies the default currency to new wallets', async () => {
    const user = userEvent.setup()
    renderRoute('/settings')

    await user.click(screen.getByRole('radio', { name: 'Dark' }))
    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute('data-theme', 'dark')
    })
    expect(window.localStorage.getItem('fintrack-theme')).toBe('dark')

    await user.selectOptions(
      screen.getByLabelText('Default wallet currency'),
      'EUR',
    )
    await user.click(screen.getByRole('link', { name: 'Wallets' }))
    await user.click(screen.getByRole('button', { name: 'Add wallet' }))

    expect(screen.getByLabelText('Currency')).toHaveValue('EUR')
    expect(window.localStorage.getItem('fintrack-default-currency')).toBe('EUR')
  })

  it('follows light and dark operating-system changes in System mode', async () => {
    const listeners = new Set<() => void>()
    const mediaQuery = {
      matches: false,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: (_event: string, listener: () => void) => {
        listeners.add(listener)
      },
      removeEventListener: (_event: string, listener: () => void) => {
        listeners.delete(listener)
      },
      dispatchEvent: vi.fn(),
    }
    vi.stubGlobal('matchMedia', vi.fn(() => mediaQuery))

    renderRoute('/settings')

    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute('data-theme', 'light')
    })

    mediaQuery.matches = true
    act(() => listeners.forEach((listener) => listener()))

    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute('data-theme', 'dark')
    })
  })

  it('provides a dedicated transaction history route', () => {
    renderRoute('/transactions')

    expect(
      screen.getByRole('heading', { name: 'Transactions' }),
    ).toBeInTheDocument()
    expect(screen.getByText('No transactions to display')).toBeInTheDocument()
  })
})
