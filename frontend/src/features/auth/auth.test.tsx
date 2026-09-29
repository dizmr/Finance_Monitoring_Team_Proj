import { render, screen } from '@testing-library/react'
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

describe('authentication routes', () => {
  it('shows required validation on login', async () => {
    const user = userEvent.setup()
    renderRoute('/login')

    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    expect(screen.getByText('Enter your email address.')).toBeInTheDocument()
    expect(screen.getByText('Enter your password.')).toBeInTheDocument()
  })

  it('navigates from login to registration without a reload', async () => {
    const user = userEvent.setup()
    renderRoute('/login')

    await user.click(screen.getByRole('link', { name: 'Create account' }))

    expect(
      screen.getByRole('heading', { name: 'Create account' }),
    ).toBeInTheDocument()
  })

  it('submits a valid login with the Enter key', async () => {
    const user = userEvent.setup()
    renderRoute('/login')

    await user.type(screen.getByLabelText('Email'), 'person@example.com')
    await user.type(screen.getByLabelText('Password'), 'password{Enter}')

    expect(screen.getByRole('status')).toHaveTextContent(
      'Sign in is ready for connection',
    )
  })

  it('validates matching passwords during registration', async () => {
    const user = userEvent.setup()
    renderRoute('/register')

    await user.type(screen.getByLabelText('Email'), 'person@example.com')
    await user.type(screen.getByLabelText('Password'), 'first password')
    await user.type(screen.getByLabelText('Confirm password'), 'second password')
    await user.click(screen.getByRole('button', { name: 'Create account' }))

    expect(screen.getByText('Passwords do not match.')).toBeInTheDocument()
  })

  it('redirects unknown routes to login', () => {
    renderRoute('/does-not-exist')

    expect(screen.getByRole('heading', { name: 'Sign in' })).toBeInTheDocument()
  })
})
