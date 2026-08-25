import { fireEvent, render, screen, within } from '@testing-library/react'
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

async function addWalletDraft(
  user: ReturnType<typeof userEvent.setup>,
  name: string,
  currency: string,
) {
  await user.click(
    screen.getAllByRole('button', { name: /^Add wallet$/ })[0],
  )
  await user.type(screen.getByLabelText('Wallet name'), name)
  await user.selectOptions(screen.getByLabelText('Currency'), currency)
  await user.click(screen.getByRole('button', { name: 'Add wallet draft' }))
}

async function addCategoryDraft(
  user: ReturnType<typeof userEvent.setup>,
  name: string,
  type: 'expense' | 'income',
) {
  await user.click(screen.getByRole('button', { name: 'Add category' }))
  await user.type(screen.getByLabelText('Category name'), name)

  if (type === 'income') {
    await user.click(screen.getByRole('radio', { name: /Income source/ }))
  }

  await user.click(screen.getByRole('button', { name: 'Add category draft' }))
}

describe('Sprint 2 workspace', () => {
  it('validates, adds, and removes a wallet session draft', async () => {
    const user = userEvent.setup()
    renderRoute('/wallets')

    await user.click(
      screen.getAllByRole('button', { name: /^Add wallet$/ })[0],
    )
    await user.click(screen.getByRole('button', { name: 'Add wallet draft' }))

    expect(screen.getByText('Enter a wallet name.')).toBeInTheDocument()
    expect(screen.getByText('Select a wallet currency.')).toBeInTheDocument()

    await user.type(screen.getByLabelText('Wallet name'), 'Daily account')
    await user.selectOptions(screen.getByLabelText('Currency'), 'UAH')
    await user.click(screen.getByRole('button', { name: 'Add wallet draft' }))

    expect(screen.getByText('Daily account')).toBeInTheDocument()
    expect(screen.getByText('Ukrainian hryvnia')).toBeInTheDocument()

    await user.click(
      screen.getByRole('button', { name: 'Remove Daily account' }),
    )
    const dialog = screen.getByRole('alertdialog')
    expect(dialog).toHaveTextContent('No server data will be changed.')
    await user.click(within(dialog).getByRole('button', { name: 'Remove draft' }))

    expect(screen.getByText('No wallets yet')).toBeInTheDocument()
  })

  it('adds and removes expense and income classifications', async () => {
    const user = userEvent.setup()
    renderRoute('/categories')

    await addCategoryDraft(user, 'Groceries', 'expense')
    await addCategoryDraft(user, 'Salary', 'income')

    expect(screen.getByText('Groceries')).toBeInTheDocument()
    expect(screen.getByText('Salary')).toBeInTheDocument()

    const expenseGroup = screen.getByRole('region', {
      name: 'Expense categories',
    })
    await user.click(
      within(expenseGroup).getByRole('button', { name: 'Remove Groceries' }),
    )
    await user.click(
      within(screen.getByRole('alertdialog')).getByRole('button', {
        name: 'Remove draft',
      }),
    )

    expect(screen.queryByText('Groceries')).not.toBeInTheDocument()
    expect(screen.getByText('Salary')).toBeInTheDocument()
  })

  it('filters categories and validates a complete transaction draft', async () => {
    const user = userEvent.setup()
    renderRoute('/wallets')

    await addWalletDraft(user, 'Cash', 'EUR')
    await user.click(screen.getByRole('link', { name: 'Categories' }))
    await addCategoryDraft(user, 'Food', 'expense')
    await addCategoryDraft(user, 'Contract work', 'income')
    await user.click(screen.getByRole('link', { name: 'Add transaction' }))

    expect(screen.getByRole('option', { name: 'Food' })).toBeInTheDocument()
    expect(
      screen.queryByRole('option', { name: 'Contract work' }),
    ).not.toBeInTheDocument()

    await user.click(screen.getByRole('radio', { name: /Income/ }))
    expect(
      screen.getByRole('option', { name: 'Contract work' }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('option', { name: 'Food' })).not.toBeInTheDocument()

    await user.selectOptions(screen.getByLabelText('Wallet'), 'wallet-1')
    await user.type(screen.getByLabelText('Amount'), '1250.50')
    await user.selectOptions(
      screen.getByLabelText('Income source'),
      'category-3',
    )
    fireEvent.change(screen.getByLabelText('Date'), {
      target: { value: '2026-08-25' },
    })
    await user.click(
      screen.getByRole('button', { name: 'Add transaction' }),
    )

    expect(screen.getByRole('status')).toHaveTextContent(
      'no transaction was created',
    )
    expect(screen.getAllByText('EUR').length).toBeGreaterThan(0)
  })

  it('shows required transaction errors without available data', async () => {
    const user = userEvent.setup()
    renderRoute('/transactions/new')

    await user.click(
      screen.getByRole('button', { name: 'Add transaction' }),
    )

    expect(screen.getByText('Select a wallet.')).toBeInTheDocument()
    expect(screen.getByText('Select an expense category.')).toBeInTheDocument()
    expect(screen.getByText('Enter an amount.')).toBeInTheDocument()
    expect(screen.getByText('Select a valid transaction date.')).toBeInTheDocument()
  })
})
