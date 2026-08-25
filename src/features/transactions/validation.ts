import type { TransactionType } from '../drafts/types'

export type TransactionValues = {
  type: TransactionType
  walletId: string
  categoryId: string
  amount: string
  date: string
}

export type TransactionErrors = Partial<
  Record<keyof TransactionValues, string>
>

function parseAmount(value: string) {
  const normalized = value.trim().replace(',', '.')

  if (!/^(?:\d+|\d*\.\d+)$/.test(normalized)) return Number.NaN
  return Number(normalized)
}

export function validateTransaction(
  values: TransactionValues,
): TransactionErrors {
  const amount = parseAmount(values.amount)
  const hasValidType = values.type === 'expense' || values.type === 'income'
  const dateValue = values.date ? new Date(`${values.date}T00:00:00`) : null

  return {
    type: hasValidType ? undefined : 'Select a transaction type.',
    walletId: values.walletId ? undefined : 'Select a wallet.',
    categoryId: values.categoryId
      ? undefined
      : values.type === 'expense'
        ? 'Select an expense category.'
        : 'Select an income source.',
    amount: !values.amount.trim()
      ? 'Enter an amount.'
      : Number.isNaN(amount)
        ? 'Enter a valid amount using numbers and a decimal separator.'
        : amount <= 0
          ? 'Amount must be greater than zero.'
          : undefined,
    date:
      !dateValue || Number.isNaN(dateValue.getTime())
        ? 'Select a valid transaction date.'
        : undefined,
  }
}

