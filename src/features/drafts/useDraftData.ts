import { useContext } from 'react'
import { DraftDataContext } from './DraftDataContext'

export function useDraftData() {
  const context = useContext(DraftDataContext)

  if (!context) {
    throw new Error('useDraftData must be used inside DraftDataProvider')
  }

  return context
}

