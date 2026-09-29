import { Link, NavLink, Outlet } from 'react-router-dom'

const navigation = [
  { label: 'Dashboard', to: '/', end: true },
  { label: 'Transactions', to: '/transactions', end: true },
  { label: 'Wallets', to: '/wallets' },
  { label: 'Categories', to: '/categories' },
]

export function AppLayout() {
  return (
    <div className="workspace-page">
      <header className="workspace-header">
        <div className="workspace-header-inner">
          <Link
            className="workspace-brand"
            to="/"
            aria-label="FinTrack dashboard"
          >
            <span className="brand-mark" aria-hidden="true">
              F
            </span>
            <span className="brand-name">FinTrack</span>
          </Link>

          <nav className="workspace-nav" aria-label="Primary navigation">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => (isActive ? 'active' : undefined)}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="workspace-actions">
            <Link className="header-transaction-action" to="/transactions/new">
              <span aria-hidden="true">+</span>
              Add transaction
            </Link>
            <NavLink
              className={({ isActive }) =>
                isActive ? 'account-link active' : 'account-link'
              }
              to="/settings"
            >
              Settings
            </NavLink>
          </div>
        </div>
      </header>

      <main className="workspace-main">
        <Outlet />
      </main>
    </div>
  )
}
