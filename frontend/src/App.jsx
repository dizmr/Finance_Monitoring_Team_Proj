import { Routes, Route, NavLink } from 'react-router-dom'
import Dashboard from './pages/Dashboard.jsx'
import Wallets from './pages/Wallets.jsx'
import Categories from './pages/Categories.jsx'
import IncomeSources from './pages/IncomeSources.jsx'
import Transactions from './pages/Transactions.jsx'

export default function App() {
  return (
    <div className="app">
      <nav className="nav">
        <h1>💰 Finance Monitoring</h1>
        <div className="nav-links">
          <NavLink to="/" end>Дашборд</NavLink>
          <NavLink to="/wallets">Гаманці</NavLink>
          <NavLink to="/categories">Категорії витрат</NavLink>
          <NavLink to="/income-sources">Джерела доходу</NavLink>
          <NavLink to="/transactions">Транзакції</NavLink>
        </div>
      </nav>
      <main className="content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/wallets" element={<Wallets />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/income-sources" element={<IncomeSources />} />
          <Route path="/transactions" element={<Transactions />} />
        </Routes>
      </main>
    </div>
  )
}
