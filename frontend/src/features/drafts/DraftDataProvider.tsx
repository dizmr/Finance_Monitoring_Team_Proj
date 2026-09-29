import { useRef, useState, type ReactNode } from 'react'
import { DraftDataContext } from './DraftDataContext'
import type { CategoryDraft, TransactionType, WalletDraft } from './types'

type DraftDataProviderProps = {
  children: ReactNode
}

export function DraftDataProvider({ children }: DraftDataProviderProps) {
  const [wallets, setWallets] = useState<WalletDraft[]>([])
  const [categories, setCategories] = useState<CategoryDraft[]>([])
  const nextId = useRef(1)

  function createId(prefix: string) {
    const id = `${prefix}-${nextId.current}`
    nextId.current += 1
    return id
  }

  function addWallet(name: string, currency: string) {
    setWallets((current) => [
      ...current,
      { id: createId('wallet'), name, currency },
    ])
  }

  function removeWallet(id: string) {
    setWallets((current) => current.filter((wallet) => wallet.id !== id))
  }

  function addCategory(name: string, type: TransactionType) {
    setCategories((current) => [
      ...current,
      { id: createId('category'), name, type },
    ])
  }

  function removeCategory(id: string) {
    setCategories((current) =>
      current.filter((category) => category.id !== id),
    )
  }

  return (
    <DraftDataContext.Provider
      value={{
        wallets,
        categories,
        addWallet,
        removeWallet,
        addCategory,
        removeCategory,
      }}
    >
      {children}
    </DraftDataContext.Provider>
  )
}

