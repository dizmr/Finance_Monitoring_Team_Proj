export type ThemePreference = 'system' | 'light' | 'dark'
export type ResolvedTheme = Exclude<ThemePreference, 'system'>

export const THEME_STORAGE_KEY = 'fintrack-theme'
export const DEFAULT_CURRENCY_STORAGE_KEY = 'fintrack-default-currency'

export const THEME_OPTIONS: readonly {
  value: ThemePreference
  label: string
}[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
]

