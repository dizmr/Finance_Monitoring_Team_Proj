import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/AppLayout'
import { LoginPage } from './features/auth/LoginPage'
import { RegisterPage } from './features/auth/RegisterPage'
import { CategoriesPage } from './features/categories/CategoriesPage'
import { DashboardPage } from './features/dashboard/DashboardPage'
import { DraftDataProvider } from './features/drafts/DraftDataProvider'
import { PreferencesProvider } from './features/settings/PreferencesProvider'
import { SettingsPage } from './features/settings/SettingsPage'
import { NewTransactionPage } from './features/transactions/NewTransactionPage'
import { TransactionsPage } from './features/transactions/TransactionsPage'
import { WalletsPage } from './features/wallets/WalletsPage'

export function App() {
  return (
    <PreferencesProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          element={
            <DraftDataProvider>
              <AppLayout />
            </DraftDataProvider>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="/dashboard" element={<Navigate to="/" replace />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/transactions/new" element={<NewTransactionPage />} />
          <Route path="/wallets" element={<WalletsPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </PreferencesProvider>
  )
}
