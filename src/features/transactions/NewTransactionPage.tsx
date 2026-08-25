import { useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../../components/PageHeader'
import { useDraftData } from '../drafts/useDraftData'
import type { TransactionType } from '../drafts/types'
import {
  validateTransaction,
  type TransactionErrors,
  type TransactionValues,
} from './validation'

const initialValues: TransactionValues = {
  type: 'expense',
  walletId: '',
  categoryId: '',
  amount: '',
  date: '',
}

export function NewTransactionPage() {
  const { wallets, categories } = useDraftData()
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState<TransactionErrors>({})
  const [formMessage, setFormMessage] = useState('')

  const selectedWallet = wallets.find(
    (wallet) => wallet.id === values.walletId,
  )
  const selectedCategory = categories.find(
    (category) => category.id === values.categoryId,
  )
  const relevantCategories = useMemo(
    () => categories.filter((category) => category.type === values.type),
    [categories, values.type],
  )
  const categoryLabel =
    values.type === 'expense' ? 'Expense category' : 'Income source'

  function updateValue<Key extends keyof TransactionValues>(
    key: Key,
    value: TransactionValues[Key],
  ) {
    setValues((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
    setFormMessage('')
  }

  function updateType(type: TransactionType) {
    setValues((current) => ({ ...current, type, categoryId: '' }))
    setErrors((current) => ({
      ...current,
      type: undefined,
      categoryId: undefined,
    }))
    setFormMessage('')
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validateTransaction(values)
    setErrors(nextErrors)

    if (Object.values(nextErrors).some(Boolean)) return

    setFormMessage(
      'Transaction details are valid, but no transaction was created because the Жени API contract is unavailable.',
    )
  }

  return (
    <>
      <PageHeader
        eyebrow="Data entry"
        title="New transaction"
        description="Record an income or expense in the selected wallet currency."
      />

      <section
        className="transaction-layout"
        aria-labelledby="transaction-form-title"
      >
        <form className="transaction-form" noValidate onSubmit={handleSubmit}>
          <h2 id="transaction-form-title" className="visually-hidden">
            Transaction details
          </h2>

          <fieldset className="segmented-fieldset transaction-type-fieldset">
            <legend>Transaction type</legend>
            <div className="segmented-control">
              <label>
                <input
                  type="radio"
                  name="transactionType"
                  value="expense"
                  checked={values.type === 'expense'}
                  onChange={() => updateType('expense')}
                />
                <span>Expense</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="transactionType"
                  value="income"
                  checked={values.type === 'income'}
                  onChange={() => updateType('income')}
                />
                <span>Income</span>
              </label>
            </div>
          </fieldset>

          <div className="form-field amount-field">
            <label htmlFor="transaction-amount">Amount</label>
            <div className="amount-control">
              <input
                id="transaction-amount"
                name="amount"
                type="text"
                inputMode="decimal"
                value={values.amount}
                placeholder="0.00"
                autoComplete="off"
                aria-invalid={Boolean(errors.amount)}
                aria-describedby={
                  errors.amount ? 'transaction-amount-error' : 'amount-help'
                }
                onChange={(event) => updateValue('amount', event.target.value)}
              />
              <span className="amount-currency" aria-live="polite">
                {selectedWallet?.currency ?? '—'}
              </span>
            </div>
            {errors.amount ? (
              <p
                className="field-error"
                id="transaction-amount-error"
                role="alert"
              >
                {errors.amount}
              </p>
            ) : (
              <p className="field-help" id="amount-help">
                Enter the amount in the selected wallet’s currency.
              </p>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="transaction-wallet">Wallet</label>
            <select
              id="transaction-wallet"
              name="walletId"
              value={values.walletId}
              disabled={!wallets.length}
              aria-invalid={Boolean(errors.walletId)}
              aria-describedby={
                errors.walletId ? 'transaction-wallet-error' : undefined
              }
              onChange={(event) => updateValue('walletId', event.target.value)}
            >
              <option value="">
                {wallets.length ? 'Select wallet' : 'No wallets available'}
              </option>
              {wallets.map((wallet) => (
                <option key={wallet.id} value={wallet.id}>
                  {wallet.name} — {wallet.currency}
                </option>
              ))}
            </select>
            {errors.walletId ? (
              <p
                className="field-error"
                id="transaction-wallet-error"
                role="alert"
              >
                {errors.walletId}
              </p>
            ) : !wallets.length ? (
              <p className="field-help">
                <Link to="/wallets">Add a wallet draft</Link> before entering a
                transaction.
              </p>
            ) : null}
          </div>

          <details className="transaction-context-mobile">
            <summary>
              <span>Entry context</span>
              <strong>
                {selectedWallet
                  ? `${selectedWallet.name} · ${selectedWallet.currency}`
                  : 'Select a wallet'}
              </strong>
            </summary>
            <dl>
              <div>
                <dt>Type</dt>
                <dd>{values.type === 'expense' ? 'Expense' : 'Income'}</dd>
              </div>
              <div>
                <dt>Amount</dt>
                <dd>
                  {values.amount
                    ? `${values.amount} ${selectedWallet?.currency ?? ''}`.trim()
                    : 'Not entered'}
                </dd>
              </div>
              <div>
                <dt>Category</dt>
                <dd>{selectedCategory?.name ?? 'Not selected'}</dd>
              </div>
            </dl>
          </details>

          <div className="form-field">
            <label htmlFor="transaction-category">{categoryLabel}</label>
            <select
              id="transaction-category"
              name="categoryId"
              value={values.categoryId}
              disabled={!relevantCategories.length}
              aria-invalid={Boolean(errors.categoryId)}
              aria-describedby={
                errors.categoryId ? 'transaction-category-error' : undefined
              }
              onChange={(event) =>
                updateValue('categoryId', event.target.value)
              }
            >
              <option value="">
                {relevantCategories.length
                  ? `Select ${categoryLabel.toLowerCase()}`
                  : `No ${categoryLabel.toLowerCase()}s available`}
              </option>
              {relevantCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId ? (
              <p
                className="field-error"
                id="transaction-category-error"
                role="alert"
              >
                {errors.categoryId}
              </p>
            ) : !relevantCategories.length ? (
              <p className="field-help">
                <Link to="/categories">Add {categoryLabel.toLowerCase()}</Link>{' '}
                to continue.
              </p>
            ) : null}
          </div>

          <div className="form-field date-field">
            <label htmlFor="transaction-date">Date</label>
            <input
              id="transaction-date"
              name="date"
              type="date"
              value={values.date}
              aria-invalid={Boolean(errors.date)}
              aria-describedby={
                errors.date ? 'transaction-date-error' : undefined
              }
              onChange={(event) => updateValue('date', event.target.value)}
            />
            {errors.date ? (
              <p className="field-error" id="transaction-date-error" role="alert">
                {errors.date}
              </p>
            ) : null}
          </div>

          {formMessage ? (
            <p className="workspace-notice" role="status">
              {formMessage}
            </p>
          ) : null}

          <div className="form-actions transaction-actions">
            <button className="primary-button" type="submit">
              Add transaction
            </button>
            <p>
              Saving is unavailable in draft mode. No data will be sent to the
              API.
            </p>
          </div>
        </form>

        <aside className="transaction-summary" aria-label="Transaction context">
          <p className="eyebrow">Transaction context</p>
          <h2>{selectedWallet?.name ?? 'No wallet selected'}</h2>
          <dl>
            <div>
              <dt>Wallet currency</dt>
              <dd>{selectedWallet?.currency ?? '—'}</dd>
            </div>
            <div>
              <dt>Entry type</dt>
              <dd>{values.type === 'expense' ? 'Expense' : 'Income'}</dd>
            </div>
            <div>
              <dt>Amount</dt>
              <dd>
                {values.amount
                  ? `${values.amount} ${selectedWallet?.currency ?? ''}`.trim()
                  : 'Not entered'}
              </dd>
            </div>
            <div>
              <dt>Category</dt>
              <dd>{selectedCategory?.name ?? 'Not selected'}</dd>
            </div>
            <div>
              <dt>Date</dt>
              <dd>{values.date || 'Not selected'}</dd>
            </div>
            <div>
              <dt>Conversion status</dt>
              <dd>Not applied</dd>
            </div>
          </dl>
        </aside>
      </section>
    </>
  )
}
