import { Link } from 'react-router-dom'
import { PageHeader } from '../../components/PageHeader'

export function TransactionsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Activity"
        title="Transactions"
        description="Review income and expenses when transaction history becomes available."
        action={
          <Link className="primary-button" to="/transactions/new">
            + Add transaction
          </Link>
        }
      />

      <section className="data-section" aria-labelledby="transaction-list-title">
        <div className="section-heading">
          <div>
            <h2 id="transaction-list-title">Transaction history</h2>
            <p>No connected records</p>
          </div>
        </div>
        <div className="empty-state transaction-history-empty">
          <h3>No transactions to display</h3>
          <p>
            The current frontend has no transaction history source. Entries are
            validated locally but are not created or presented as saved data.
          </p>
        </div>
      </section>
    </>
  )
}
