export type CurrencyOption = {
  code: string
  name: string
}

// Frontend-only configuration until Жени API provides a supported-currency endpoint.
export const CURRENCY_OPTIONS: readonly CurrencyOption[] = [
  { code: 'UAH', name: 'Ukrainian hryvnia' },
  { code: 'EUR', name: 'Euro' },
  { code: 'USD', name: 'US dollar' },
]

export function getCurrencyName(code: string) {
  return CURRENCY_OPTIONS.find((currency) => currency.code === code)?.name
}

