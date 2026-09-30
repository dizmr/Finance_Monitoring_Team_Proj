import { useEffect, useState } from 'react'
import api from '../api/client'
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell
} from 'recharts'

const COLORS = ['#4f46e5', '#06b6d4', '#f59e0b', '#ef4444', '#10b981', '#8b5cf6', '#ec4899']

function firstDayOfMonth() {
  const d = new Date()
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10)
}

export default function Dashboard() {
  const [wallets, setWallets] = useState([])
  const [walletId, setWalletId] = useState('')
  const [from, setFrom] = useState(firstDayOfMonth())
  const [to, setTo] = useState(new Date().toISOString().slice(0, 10))
  const [summary, setSummary] = useState(null)

  useEffect(() => {
    api.get('/wallets').then(res => setWallets(res.data))
  }, [])

  const load = async () => {
    const res = await api.get('/reports/summary', {
      params: {
        from: from ? new Date(from).toISOString() : undefined,
        to: to ? new Date(to + 'T23:59:59').toISOString() : undefined,
        walletId: walletId || undefined,
      }
    })
    setSummary(res.data)
  }

  useEffect(() => { load() }, [from, to, walletId])

  return (
    <div>
      <h2>Дашборд</h2>

      <div className="row">
        <label>Період:</label>
        <input type="date" value={from} onChange={e => setFrom(e.target.value)} />
        <span>—</span>
        <input type="date" value={to} onChange={e => setTo(e.target.value)} />
        <select value={walletId} onChange={e => setWalletId(e.target.value)}>
          <option value="">Усі гаманці</option>
          {wallets.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
        </select>
      </div>

      {summary && (
        <>
          <div className="stats">
            <div className="stat-card income">
              <span>Дохід за період</span>
              <strong>{summary.totalIncome.toFixed(2)}</strong>
            </div>
            <div className="stat-card expense">
              <span>Витрати за період</span>
              <strong>{summary.totalExpense.toFixed(2)}</strong>
            </div>
            <div className="stat-card balance">
              <span>Різниця</span>
              <strong>{(summary.totalIncome - summary.totalExpense).toFixed(2)}</strong>
            </div>
          </div>

          <h3>Динаміка доходів і витрат</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={summary.byDay}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="income" name="Дохід" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="expense" name="Витрати" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>

          <div className="charts-row">
            <div>
              <h3>Витрати за категоріями</h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={summary.byCategory} dataKey="total" nameKey="category" outerRadius={100} label>
                    {summary.byCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div>
              <h3>Дохід за джерелами</h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={summary.bySource} dataKey="total" nameKey="source" outerRadius={100} label>
                    {summary.bySource.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
