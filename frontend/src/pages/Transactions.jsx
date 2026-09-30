import { useEffect, useState } from 'react'
import api from '../api/client'

export default function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [wallets, setWallets] = useState([])
  const [categories, setCategories] = useState([])
  const [sources, setSources] = useState([])

  const [type, setType] = useState('Expense')
  const [walletId, setWalletId] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [incomeSourceId, setIncomeSourceId] = useState('')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))

  const [filterWallet, setFilterWallet] = useState('')

  const load = async () => {
    const [t, w, c, s] = await Promise.all([
      api.get('/transactions', { params: { walletId: filterWallet || undefined } }),
      api.get('/wallets'),
      api.get('/categories'),
      api.get('/income-sources'),
    ])
    setTransactions(t.data)
    setWallets(w.data)
    setCategories(c.data)
    setSources(s.data)
    if (!walletId && w.data[0]) setWalletId(w.data[0].id)
    if (!categoryId && c.data[0]) setCategoryId(c.data[0].id)
    if (!incomeSourceId && s.data[0]) setIncomeSourceId(s.data[0].id)
  }

  useEffect(() => { load() }, [filterWallet])

  const addTransaction = async (e) => {
    e.preventDefault()
    if (!walletId || !amount) return

    const payload = {
      type,
      amount: Number(amount),
      date: new Date(date).toISOString(),
      description,
      walletId: Number(walletId),
      categoryId: type === 'Expense' ? Number(categoryId) : null,
      incomeSourceId: type === 'Income' ? Number(incomeSourceId) : null,
    }

    await api.post('/transactions', payload)
    setAmount('')
    setDescription('')
    load()
  }

  const removeTransaction = async (id) => {
    await api.delete(`/transactions/${id}`)
    load()
  }

  return (
    <div>
      <h2>Транзакції</h2>

      <form onSubmit={addTransaction} className="card">
        <div className="row">
          <select value={type} onChange={e => setType(e.target.value)}>
            <option value="Expense">Витрата</option>
            <option value="Income">Дохід</option>
          </select>
          <select value={walletId} onChange={e => setWalletId(e.target.value)}>
            {wallets.map(w => <option key={w.id} value={w.id}>{w.name} ({w.currency?.code})</option>)}
          </select>
          {type === 'Expense' ? (
            <select value={categoryId} onChange={e => setCategoryId(e.target.value)}>
              {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
            </select>
          ) : (
            <select value={incomeSourceId} onChange={e => setIncomeSourceId(e.target.value)}>
              {sources.map(s => <option key={s.id} value={s.id}>{s.icon} {s.name}</option>)}
            </select>
          )}
        </div>
        <div className="row">
          <input type="number" step="0.01" placeholder="Сума" value={amount} onChange={e => setAmount(e.target.value)} />
          <input type="date" value={date} onChange={e => setDate(e.target.value)} />
          <input placeholder="Опис (необов'язково)" value={description} onChange={e => setDescription(e.target.value)} />
          <button type="submit">Додати</button>
        </div>
      </form>

      <div className="row" style={{ marginTop: 24 }}>
        <label>Фільтр за гаманцем:</label>
        <select value={filterWallet} onChange={e => setFilterWallet(e.target.value)}>
          <option value="">Усі гаманці</option>
          {wallets.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
        </select>
      </div>

      <ul className="list">
        {transactions.map(t => (
          <li key={t.id}>
            <span>
              <strong className={t.type === 'Income' ? 'income' : 'expense'}>
                {t.type === 'Income' ? '+' : '-'}{t.amount} {t.wallet?.currency?.symbol}
              </strong>
              {' '}— {t.type === 'Income' ? t.incomeSource?.name : t.category?.name}
              {' '}({t.wallet?.name}, {new Date(t.date).toLocaleDateString('uk-UA')})
              {t.description && <em> — {t.description}</em>}
            </span>
            <button className="danger" onClick={() => removeTransaction(t.id)}>Видалити</button>
          </li>
        ))}
        {transactions.length === 0 && <li className="empty">Транзакцій ще немає</li>}
      </ul>
    </div>
  )
}
