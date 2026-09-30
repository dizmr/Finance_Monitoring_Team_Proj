import { useEffect, useState } from 'react'
import api from '../api/client'

export default function Wallets() {
  const [wallets, setWallets] = useState([])
  const [currencies, setCurrencies] = useState([])
  const [name, setName] = useState('')
  const [currencyId, setCurrencyId] = useState('')
  const [error, setError] = useState('')

  const load = async () => {
    const [w, c] = await Promise.all([api.get('/wallets'), api.get('/currencies')])
    setWallets(w.data)
    setCurrencies(c.data)
    if (!currencyId && c.data[0]) setCurrencyId(c.data[0].id)
  }

  useEffect(() => { load() }, [])

  const addWallet = async (e) => {
    e.preventDefault()
    setError('')
    if (!name || !currencyId) return
    try {
      await api.post('/wallets', { name, currencyId: Number(currencyId), balance: 0 })
      setName('')
      load()
    } catch {
      setError('Не вдалося створити гаманець')
    }
  }

  const removeWallet = async (id) => {
    if (!confirm('Видалити гаманець разом з усіма його транзакціями?')) return
    await api.delete(`/wallets/${id}`)
    load()
  }

  return (
    <div>
      <h2>Гаманці</h2>
      <form onSubmit={addWallet} className="row">
        <input placeholder="Назва гаманця" value={name} onChange={e => setName(e.target.value)} />
        <select value={currencyId} onChange={e => setCurrencyId(e.target.value)}>
          {currencies.map(c => <option key={c.id} value={c.id}>{c.code}</option>)}
        </select>
        <button type="submit">Додати</button>
      </form>
      {error && <p className="error">{error}</p>}

      <ul className="list">
        {wallets.map(w => (
          <li key={w.id}>
            <span>{w.name} — <strong>{w.balance} {w.currency?.symbol}</strong></span>
            <button className="danger" onClick={() => removeWallet(w.id)}>Видалити</button>
          </li>
        ))}
        {wallets.length === 0 && <li className="empty">Гаманців ще немає</li>}
      </ul>
    </div>
  )
}
