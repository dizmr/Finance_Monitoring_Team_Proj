import { createContext } from 'react'
import type { CategoryDraft, TransactionType, WalletDraft } from './types'

export type DraftDataContextValue = {
  wallets: WalletDraft[]
  categories: CategoryDraft[]
  addWallet: (name: string, currency: string) => void
  removeWallet: (id: string) => void
  addCategory: (name: string, type: TransactionType) => void
  removeCategory: (id: string) => void
}

export const DraftDataContext = createContext<DraftDataContextValue | null>(
  null,
)

