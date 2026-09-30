import { useEffect, useState } from 'react'
import api from '../api/client'

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('💸')

  const load = async () => {
    const res = await api.get('/categories')
    setCategories(res.data)
  }

  useEffect(() => { load() }, [])

  const addCategory = async (e) => {
    e.preventDefault()
    if (!name) return
    await api.post('/categories', { name, icon })
    setName('')
    load()
  }

  const removeCategory = async (id) => {
    await api.delete(`/categories/${id}`)
    load()
  }

  return (
    <div>
      <h2>Категорії витрат</h2>
      <form onSubmit={addCategory} className="row">
        <input placeholder="Іконка" style={{ width: 60 }} value={icon} onChange={e => setIcon(e.target.value)} />
        <input placeholder="Назва категорії" value={name} onChange={e => setName(e.target.value)} />
        <button type="submit">Додати</button>
      </form>

      <ul className="list">
        {categories.map(c => (
          <li key={c.id}>
            <span>{c.icon} {c.name}</span>
            <button className="danger" onClick={() => removeCategory(c.id)}>Видалити</button>
          </li>
        ))}
        {categories.length === 0 && <li className="empty">Категорій ще немає</li>}
      </ul>
    </div>
  )
}
