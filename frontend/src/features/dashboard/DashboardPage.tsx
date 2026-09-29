import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../../components/PageHeader'
import { useDraftData } from '../drafts/useDraftData'
import { CategorySpendingChart } from './CategorySpendingChart'
import { IncomeExpenseChart } from './IncomeExpenseChart'

type DashboardPeriod = 'month' | 'all'

const emptyFinancialMetrics = [
  {
    label: 'Total balance',
    detail: 'Wallet balances unavailable',
  },
  { label: 'Income', detail: 'Transaction history unavailable' },
  { label: 'Expenses', detail: 'Transaction history unavailable' },
  { label: 'Net', detail: 'Not calculated without transactions' },
]

export function DashboardPage() {
  const { wallets, categories } = useDraftData()
  const [period, setPeriod] = useState<DashboardPeriod>('month')
  const monthLabel = new Intl.DateTimeFormat('en', {
    month: 'long',
    year: 'numeric',
  }).format(new Date())
  const expenseCategoryCount = categories.filter(
    (category) => category.type === 'expense',
  ).length
  const walletsByCurrency = useMemo(() => {
    const counts = new Map<string, number>()
    wallets.forEach((wallet) => {
      counts.set(wallet.currency, (counts.get(wallet.currency) ?? 0) + 1)
    })
    return [...counts.entries()].sort(([first], [second]) =>
      first.localeCompare(second),
    )
  }, [wallets])

  return (
    <>
      <PageHeader
        eyebrow="Financial overview"
        title="Overview"
        description={`Your available finance data for ${period === 'month' ? monthLabel : 'all time'}.`}
        action={
          <label className="dashboard-period">
            <span>Period</span>
            <select
              aria-label="Dashboard period"
              value={period}
              onChange={(event) =>
                setPeriod(event.target.value as DashboardPeriod)
              }
            >
              <option value="month">This month</option>
              <option value="all">All available</option>
            </select>
          </label>
        }
      />

      <section className="financial-summary" aria-labelledby="summary-title">
        <div className="dashboard-section-heading summary-heading">
          <div>
            <p className="eyebrow">Current position</p>
            <h2 id="summary-title">Financial summary</h2>
          </div>
          <span>Values stay separate by currency</span>
        </div>
        <div className="metric-grid">
          {emptyFinancialMetrics.map((metric) => (
            <article className="metric-item" key={metric.label}>
              <h3>{metric.label}</h3>
              <strong>Unavailable</strong>
              <p>{metric.detail}</p>
            </article>
          ))}
        </div>
        <div className="currency-summary">
          <div>
            <strong>Wallet currencies</strong>
            <span>No conversion rate is applied.</span>
          </div>
          {walletsByCurrency.length ? (
            <ul>
              {walletsByCurrency.map(([currency, count]) => (
                <li key={currency}>
                  <strong>{currency}</strong>
                  <span>{count} {count === 1 ? 'wallet' : 'wallets'}</span>
                  <small>Balance unavailable</small>
                </li>
              ))}
            </ul>
          ) : (
            <p>No wallet currencies available.</p>
          )}
        </div>
      </section>

      <div className="dashboard-analytics-grid">
        <section className="dashboard-panel" aria-labelledby="cash-flow-title">
          <div className="dashboard-section-heading">
            <div>
              <p className="eyebrow">Cash flow</p>
              <h2 id="cash-flow-title">Income vs expenses</h2>
            </div>
          </div>
          <IncomeExpenseChart data={[]} />
        </section>

        <section className="dashboard-panel" aria-labelledby="spending-title">
          <div className="dashboard-section-heading">
            <div>
              <p className="eyebrow">Outflow</p>
              <h2 id="spending-title">Spending by category</h2>
            </div>
          </div>
          <CategorySpendingChart
            data={[]}
            configuredCategoryCount={expenseCategoryCount}
          />
        </section>
      </div>

      <div className="dashboard-activity-grid">
        <section className="dashboard-panel" aria-labelledby="wallet-overview-title">
          <div className="dashboard-section-heading">
            <div>
              <p className="eyebrow">Accounts</p>
              <h2 id="wallet-overview-title">Wallets</h2>
            </div>
            <Link className="panel-link" to="/wallets">View all</Link>
          </div>
          {wallets.length ? (
            <ul className="dashboard-wallet-list">
              {wallets.slice(0, 5).map((wallet) => (
                <li key={wallet.id}>
                  <div>
                    <strong>{wallet.name}</strong>
                    <span>Balance unavailable</span>
                  </div>
                  <b>{wallet.currency}</b>
                </li>
              ))}
            </ul>
          ) : (
            <div className="panel-empty">
              <strong>No wallets yet</strong>
              <span>Add a wallet to prepare transaction entry.</span>
              <Link to="/wallets">Manage wallets</Link>
            </div>
          )}
        </section>

        <section className="dashboard-panel" aria-labelledby="recent-title">
          <div className="dashboard-section-heading">
            <div>
              <p className="eyebrow">Activity</p>
              <h2 id="recent-title">Recent transactions</h2>
            </div>
            <Link className="panel-link" to="/transactions">View all</Link>
          </div>
          <div className="panel-empty">
            <strong>No transaction history available</strong>
            <span>
              Recent activity will appear when a transaction data source is
              connected.
            </span>
            <Link to="/transactions/new">Open transaction entry</Link>
          </div>
        </section>
      </div>
    </>
  )
}

