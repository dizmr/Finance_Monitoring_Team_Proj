import { Link } from 'react-router-dom'
import { PageHeader } from '../../components/PageHeader'
import { CURRENCY_OPTIONS } from '../../config/currencies'
import { THEME_OPTIONS } from './preferences'
import { usePreferences } from './usePreferences'

export function SettingsPage() {
  const {
    theme,
    resolvedTheme,
    defaultCurrency,
    setTheme,
    setDefaultCurrency,
  } = usePreferences()

  return (
    <>
      <PageHeader
        eyebrow="Application"
        title="Settings"
        description="Manage appearance and supported local preferences."
        showDraftStatus={false}
      />

      <div className="settings-sections">
        <section className="settings-section" aria-labelledby="appearance-title">
          <div className="settings-section-heading">
            <h2 id="appearance-title">Appearance</h2>
            <p>Theme changes apply across FinTrack.</p>
          </div>
          <div className="setting-row setting-row-controls">
            <div>
              <h3>Theme</h3>
              <p>
                Current appearance: {resolvedTheme === 'dark' ? 'Dark' : 'Light'}
              </p>
            </div>
            <fieldset className="theme-selector">
              <legend className="visually-hidden">Theme preference</legend>
              {THEME_OPTIONS.map((option) => (
                <label key={option.value}>
                  <input
                    type="radio"
                    name="theme"
                    value={option.value}
                    checked={theme === option.value}
                    onChange={() => setTheme(option.value)}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </fieldset>
          </div>
        </section>

        <section className="settings-section" aria-labelledby="preferences-title">
          <div className="settings-section-heading">
            <h2 id="preferences-title">Preferences</h2>
            <p>Frontend-only defaults for supported entry flows.</p>
          </div>
          <div className="setting-row">
            <div>
              <h3>Default wallet currency</h3>
              <p>Preselects a currency when you add a new wallet.</p>
            </div>
            <select
              aria-label="Default wallet currency"
              value={defaultCurrency}
              onChange={(event) => setDefaultCurrency(event.target.value)}
            >
              <option value="">No default</option>
              {CURRENCY_OPTIONS.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} — {currency.name}
                </option>
              ))}
            </select>
          </div>
          <p className="settings-note">
            This preference does not convert balances or transaction amounts.
          </p>
        </section>

        <section className="settings-section" aria-labelledby="account-title">
          <div className="settings-section-heading">
            <h2 id="account-title">Account</h2>
            <p>Authentication details will appear when the API is connected.</p>
          </div>
          <div className="setting-row">
            <div>
              <h3>Session</h3>
              <p>No authenticated profile data is available.</p>
            </div>
            <Link className="secondary-button settings-signout" to="/login">
              Sign out
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}

