import { createContext } from 'react'
import type { ResolvedTheme, ThemePreference } from './preferences'

export type PreferencesContextValue = {
  theme: ThemePreference
  resolvedTheme: ResolvedTheme
  defaultCurrency: string
  setTheme: (theme: ThemePreference) => void
  setDefaultCurrency: (currency: string) => void
}

export const PreferencesContext =
  createContext<PreferencesContextValue | null>(null)

