export type TransactionType = 'expense' | 'income'

export type WalletDraft = {
  id: string
  name: string
  currency: string
}

export type CategoryDraft = {
  id: string
  name: string
  type: TransactionType
}

