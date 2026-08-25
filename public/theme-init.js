(() => {
  const storageKey = 'fintrack-theme'
  let preference = 'system'

  try {
    const storedPreference = window.localStorage.getItem(storageKey)
    if (
      storedPreference === 'light' ||
      storedPreference === 'dark' ||
      storedPreference === 'system'
    ) {
      preference = storedPreference
    }
  } catch {
    preference = 'system'
  }

  const resolvedTheme =
    preference === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : preference

  document.documentElement.dataset.theme = resolvedTheme
  document.documentElement.style.colorScheme = resolvedTheme
})()
