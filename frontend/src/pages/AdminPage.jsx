import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'
import '../styles/adminPage.css'

const EMPTY = {
  name: '',
  slug: '',
  description: '',
  price: '',
  image_url: '',
  category: '',
}

export function AdminPage() {
  const { isAuthenticated, isStaff } = useAuth()
  const [stats, setStats] = useState(null)
  const [products, setProducts] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [editingSlug, setEditingSlug] = useState(null)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')

  async function load() {
    const [s, list] = await Promise.all([
      api('/admin/stats/'),
      api('/admin/products/'),
    ])
    setStats(s)
    setProducts(list.results ?? list)
  }

  useEffect(() => {
    if (!isAuthenticated || !isStaff) return
    load().catch((e) => setErr(e.data?.detail || e.message || 'Admin load failed'))
  }, [isAuthenticated, isStaff])

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />
  }

  if (!isStaff) {
    return (
      <div className="admin-page">
        <div className="admin-denied">
          <h1>Admin access required</h1>
          <p>Your account is not a staff user. Create a superuser in Django:</p>
          <code>python manage.py createsuperuser</code>
          <p>
            <Link to="/">← Back to store</Link>
          </p>
        </div>
      </div>
    )
  }

  function resetForm() {
    setForm(EMPTY)
    setEditingSlug(null)
  }

  async function onSubmit(e) {
    e.preventDefault()
    setErr('')
    setMsg('')
    const body = {
      ...form,
      price: String(form.price),
    }
    try {
      if (editingSlug) {
        await api(`/admin/products/${editingSlug}/`, {
          method: 'PATCH',
          body: JSON.stringify(body),
        })
        setMsg('Product updated.')
      } else {
        await api('/admin/products/', {
          method: 'POST',
          body: JSON.stringify(body),
        })
        setMsg('Product created.')
      }
      resetForm()
      await load()
    } catch (ex) {
      setErr(ex.data?.detail || JSON.stringify(ex.data) || ex.message)
    }
  }

  function startEdit(p) {
    setEditingSlug(p.slug)
    setForm({
      name: p.name,
      slug: p.slug,
      description: p.description || '',
      price: p.price,
      image_url: p.image_url,
      category: p.category || '',
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function removeProduct(slug) {
    if (!window.confirm('Delete this product?')) return
    setErr('')
    try {
      await api(`/admin/products/${slug}/`, { method: 'DELETE' })
      setMsg('Product deleted.')
      if (editingSlug === slug) resetForm()
      await load()
    } catch (ex) {
      setErr(ex.data?.detail || ex.message)
    }
  }

  return (
    <div className="admin-page">
      <header className="admin-header">
        <h1>Admin Panel</h1>
        <div className="admin-header-links">
          <a href="http://127.0.0.1:8000/admin/" target="_blank" rel="noreferrer">
            Django Admin ↗
          </a>
          <Link to="/">Storefront</Link>
        </div>
      </header>

      {stats && (
        <div className="admin-stats">
          <div className="admin-stat-card">
            <span>Products</span>
            <strong>{stats.products}</strong>
          </div>
          <div className="admin-stat-card">
            <span>Orders</span>
            <strong>{stats.orders}</strong>
          </div>
          <div className="admin-stat-card">
            <span>Users</span>
            <strong>{stats.users}</strong>
          </div>
        </div>
      )}

      {msg ? <p className="admin-msg-ok">{msg}</p> : null}
      {err ? <p className="admin-msg-err">{err}</p> : null}

      <section className="admin-form-section">
        <h2>{editingSlug ? `Edit: ${editingSlug}` : 'Add product'}</h2>
        <form className="admin-form" onSubmit={onSubmit}>
          <label>
            Name
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </label>
          <label>
            Slug (optional)
            <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto from name" />
          </label>
          <label>
            Price
            <input
              type="number"
              step="0.01"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />
          </label>
          <label>
            Category
            <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          </label>
          <label>
            Image URL
            <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} required />
          </label>
          <label className="admin-form-wide">
            Description
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </label>
          <div className="admin-form-actions">
            <button type="submit" className="admin-btn primary">
              {editingSlug ? 'Save changes' : 'Add product'}
            </button>
            {editingSlug ? (
              <button type="button" className="admin-btn" onClick={resetForm}>
                Cancel edit
              </button>
            ) : null}
          </div>
        </form>
      </section>

      <section className="admin-table-section">
        <h2>All products ({products.length})</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>
                    <Link to={`/product/${p.slug}`}>{p.name}</Link>
                  </td>
                  <td>{p.category}</td>
                  <td>₹{Number(p.price).toFixed(2)}</td>
                  <td className="admin-row-actions">
                    <button type="button" onClick={() => startEdit(p)}>
                      Edit
                    </button>
                    <button type="button" className="danger" onClick={() => removeProduct(p.slug)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
