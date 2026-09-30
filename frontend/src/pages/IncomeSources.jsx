import { useEffect, useState } from 'react'
import api from '../api/client'

export default function IncomeSources() {
  const [sources, setSources] = useState([])
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('💰')

  const load = async () => {
    const res = await api.get('/income-sources')
    setSources(res.data)
  }

  useEffect(() => { load() }, [])

  const addSource = async (e) => {
    e.preventDefault()
    if (!name) return
    await api.post('/income-sources', { name, icon })
    setName('')
    load()
  }

  const removeSource = async (id) => {
    await api.delete(`/income-sources/${id}`)
    load()
  }

  return (
    <div>
      <h2>Джерела доходу</h2>
      <form onSubmit={addSource} className="row">
        <input placeholder="Іконка" style={{ width: 60 }} value={icon} onChange={e => setIcon(e.target.value)} />
        <input placeholder="Назва джерела" value={name} onChange={e => setName(e.target.value)} />
        <button type="submit">Додати</button>
      </form>

      <ul className="list">
        {sources.map(s => (
          <li key={s.id}>
            <span>{s.icon} {s.name}</span>
            <button className="danger" onClick={() => removeSource(s.id)}>Видалити</button>
          </li>
        ))}
        {sources.length === 0 && <li className="empty">Джерел ще немає</li>}
      </ul>
    </div>
  )
}
