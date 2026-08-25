import { useState, type FormEvent } from 'react'
import { ConfirmDialog } from '../../components/ConfirmDialog'
import { PageHeader } from '../../components/PageHeader'
import { RemoveButton } from '../../components/RemoveButton'
import { CURRENCY_OPTIONS, getCurrencyName } from '../../config/currencies'
import { useDraftData } from '../drafts/useDraftData'
import type { WalletDraft } from '../drafts/types'
import { usePreferences } from '../settings/usePreferences'

type WalletValues = {
  name: string
  currency: string
}

type WalletErrors = Partial<Record<keyof WalletValues, string>>

export function WalletsPage() {
  const { wallets, addWallet, removeWallet } = useDraftData()
  const { defaultCurrency } = usePreferences()
  const [isAdding, setIsAdding] = useState(false)
  const [values, setValues] = useState<WalletValues>(() => ({
    name: '',
    currency: defaultCurrency,
  }))
  const [errors, setErrors] = useState<WalletErrors>({})
  const [walletToDelete, setWalletToDelete] = useState<WalletDraft | null>(null)
  const [feedback, setFeedback] = useState('')

  function closeForm() {
    setIsAdding(false)
    setValues({ name: '', currency: defaultCurrency })
    setErrors({})
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors: WalletErrors = {
      name: values.name.trim() ? undefined : 'Enter a wallet name.',
      currency: values.currency ? undefined : 'Select a wallet currency.',
    }
    setErrors(nextErrors)

    if (Object.values(nextErrors).some(Boolean)) return

    addWallet(values.name.trim(), values.currency)
    closeForm()
    setFeedback(
      'Wallet draft added for this session. It has not been saved to Жени API.',
    )
  }

  function confirmDelete() {
    if (!walletToDelete) return

    removeWallet(walletToDelete.id)
    setWalletToDelete(null)
    setFeedback('Local wallet draft removed. No server data was changed.')
  }

  return (
    <>
      <PageHeader
        eyebrow="Money structure"
        title="Wallets"
        description="Organize the accounts used to record income and expenses."
        action={
          <button
            className="primary-button"
            type="button"
            onClick={() => {
              setIsAdding(true)
              setFeedback('')
            }}
          >
            Add wallet
          </button>
        }
      />

      {isAdding ? (
        <section className="form-panel" aria-labelledby="add-wallet-title">
          <div className="section-heading">
            <div>
              <h2 id="add-wallet-title">Add wallet</h2>
              <p>Wallet currency will be used for transaction amounts.</p>
            </div>
          </div>

          <form className="management-form" noValidate onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="wallet-name">Wallet name</label>
              <input
                id="wallet-name"
                name="walletName"
                value={values.name}
                maxLength={80}
                autoComplete="off"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'wallet-name-error' : undefined}
                onChange={(event) => {
                  setValues((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                  setErrors((current) => ({ ...current, name: undefined }))
                }}
              />
              {errors.name ? (
                <p className="field-error" id="wallet-name-error" role="alert">
                  {errors.name}
                </p>
              ) : null}
            </div>

            <div className="form-field">
              <label htmlFor="wallet-currency">Currency</label>
              <select
                id="wallet-currency"
                name="walletCurrency"
                value={values.currency}
                aria-invalid={Boolean(errors.currency)}
                aria-describedby={
                  errors.currency ? 'wallet-currency-error' : undefined
                }
                onChange={(event) => {
                  setValues((current) => ({
                    ...current,
                    currency: event.target.value,
                  }))
                  setErrors((current) => ({ ...current, currency: undefined }))
                }}
              >
                <option value="">Select currency</option>
                {CURRENCY_OPTIONS.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code} — {currency.name}
                  </option>
                ))}
              </select>
              {errors.currency ? (
                <p
                  className="field-error"
                  id="wallet-currency-error"
                  role="alert"
                >
                  {errors.currency}
                </p>
              ) : (
                <p className="field-help">
                  Available codes come from frontend configuration until the API
                  supplies them.
                </p>
              )}
            </div>

            <div className="form-actions">
              <button className="primary-button" type="submit">
                Add wallet draft
              </button>
              <button className="secondary-button" type="button" onClick={closeForm}>
                Cancel
              </button>
            </div>
          </form>
        </section>
      ) : null}

      {feedback ? (
        <p className="workspace-notice" role="status">
          {feedback}
        </p>
      ) : null}

      <section className="data-section" aria-labelledby="wallet-list-title">
        <div className="section-heading">
          <div>
            <h2 id="wallet-list-title">Wallet list</h2>
            <p>{wallets.length} session {wallets.length === 1 ? 'draft' : 'drafts'}</p>
          </div>
        </div>

        {wallets.length ? (
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">Wallet</th>
                  <th scope="col">Currency</th>
                  <th scope="col">State</th>
                  <th className="actions-column" scope="col">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {wallets.map((wallet) => (
                  <tr key={wallet.id}>
                    <td data-label="Wallet">
                      <strong>{wallet.name}</strong>
                    </td>
                    <td data-label="Currency">
                      <span className="currency-code">{wallet.currency}</span>
                      <span className="cell-secondary">
                        {getCurrencyName(wallet.currency)}
                      </span>
                    </td>
                    <td data-label="State">Session draft</td>
                    <td className="actions-column" data-label="Actions">
                      <RemoveButton
                        label={wallet.name}
                        onClick={() => setWalletToDelete(wallet)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <h3>No wallets yet</h3>
            <p>Use Add wallet above to prepare transaction entry.</p>
          </div>
        )}
      </section>

      <ConfirmDialog
        open={Boolean(walletToDelete)}
        title="Remove wallet draft?"
        description={`This removes “${walletToDelete?.name ?? ''}” from this browser session. No server data will be changed.`}
        confirmLabel="Remove draft"
        onCancel={() => setWalletToDelete(null)}
        onConfirm={confirmDelete}
      />
    </>
  )
}
