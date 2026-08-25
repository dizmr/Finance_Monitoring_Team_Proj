import '@testing-library/jest-dom/vitest'

beforeEach(() => {
  window.localStorage.clear()
  document.documentElement.dataset.theme = 'light'
  document.documentElement.style.colorScheme = ''
})

afterEach(() => {
  vi.unstubAllGlobals()
})
