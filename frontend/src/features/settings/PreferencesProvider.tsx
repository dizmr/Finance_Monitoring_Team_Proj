import { useEffect, useState, type ReactNode } from 'react'
import { CURRENCY_OPTIONS } from '../../config/currencies'
import { PreferencesContext } from './PreferencesContext'
import {
  DEFAULT_CURRENCY_STORAGE_KEY,
  THEME_STORAGE_KEY,
  type ResolvedTheme,
  type ThemePreference,
} from './preferences'

type PreferencesProviderProps = {
  children: ReactNode
}

function readThemePreference(): ThemePreference {
  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)

  return storedTheme === 'light' ||
    storedTheme === 'dark' ||
    storedTheme === 'system'
    ? storedTheme
    : 'system'
}

function readDefaultCurrency() {
  const storedCurrency = window.localStorage.getItem(
    DEFAULT_CURRENCY_STORAGE_KEY,
  )

  return CURRENCY_OPTIONS.some(
    (currency) => currency.code === storedCurrency,
  )
    ? (storedCurrency ?? '')
    : ''
}

function getSystemTheme(): ResolvedTheme {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function resolveTheme(theme: ThemePreference): ResolvedTheme {
  return theme === 'system' ? getSystemTheme() : theme
}

export function PreferencesProvider({ children }: PreferencesProviderProps) {
  const [theme, setTheme] = useState<ThemePreference>(readThemePreference)
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() =>
    resolveTheme(readThemePreference()),
  )
  const [defaultCurrency, setDefaultCurrency] =
    useState(readDefaultCurrency)

  useEffect(() => {
    const mediaQuery = window.matchMedia?.('(prefers-color-scheme: dark)')

    function applyTheme() {
      const nextTheme = resolveTheme(theme)
      setResolvedTheme(nextTheme)
      document.documentElement.dataset.theme = nextTheme
      document.documentElement.style.colorScheme = nextTheme
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute('content', nextTheme === 'dark' ? '#102a23' : '#173d32')
    }

    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
    applyTheme()

    if (theme !== 'system' || !mediaQuery) return

    mediaQuery.addEventListener('change', applyTheme)
    return () => mediaQuery.removeEventListener('change', applyTheme)
  }, [theme])

  useEffect(() => {
    if (defaultCurrency) {
      window.localStorage.setItem(
        DEFAULT_CURRENCY_STORAGE_KEY,
        defaultCurrency,
      )
    } else {
      window.localStorage.removeItem(DEFAULT_CURRENCY_STORAGE_KEY)
    }
  }, [defaultCurrency])

  return (
    <PreferencesContext.Provider
      value={{
        theme,
        resolvedTheme,
        defaultCurrency,
        setTheme,
        setDefaultCurrency,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  )
}

