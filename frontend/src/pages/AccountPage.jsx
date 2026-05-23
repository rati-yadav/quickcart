import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import '../styles/features.css'

const EMPTY = {
  full_name: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  pincode: '',
}

export function AccountPage() {
  const { isAuthenticated, user } = useAuth()
  const { t } = useLanguage()
  const [addresses, setAddresses] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [err, setErr] = useState('')
  const [saving, setSaving] = useState(false)

  function load() {
    api('/addresses/')
      .then((data) => setAddresses(data.results ?? data))
      .catch(() => setAddresses([]))
  }

  useEffect(() => {
    if (isAuthenticated) load()
  }, [isAuthenticated])

  async function saveAddress(e) {
    e.preventDefault()
    setErr('')
    setSaving(true)
    try {
      await api('/addresses/', { method: 'POST', body: JSON.stringify(form) })
      setForm(EMPTY)
      load()
    } catch (ex) {
      setErr(ex.data?.detail || ex.message || 'Failed')
    } finally {
      setSaving(false)
    }
  }

  async function setDefault(id) {
    await api(`/addresses/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify({ is_default: true }),
    })
    load()
  }

  async function removeAddress(id) {
    if (!window.confirm('Delete this address?')) return
    await api(`/addresses/${id}/`, { method: 'DELETE' })
    load()
  }

  if (!isAuthenticated) {
    return (
      <div className="account-page">
        <h1>{t('account')}</h1>
        <p>{t('signInPurchase')}</p>
        <Link to="/signin" className="hero-cta">
          {t('signIn')}
        </Link>
      </div>
    )
  }

  return (
    <div className="account-page">
      <h1>
        {t('account')} — {user?.username}
      </h1>
      <h2>{t('myAddresses')}</h2>
      {!addresses.length ? <p>{t('noAddresses')}</p> : null}
      <ul className="address-list">
        {addresses.map((a) => (
          <li key={a.id} className={`address-card ${a.is_default ? 'default' : ''}`}>
            <p>
              <strong>{a.full_name}</strong> · {a.phone}
              {a.is_default ? (
                <>
                  {' '}
                  · <em>{t('defaultAddress')}</em>
                </>
              ) : null}
            </p>
            <p>
              {a.line1}
              {a.line2 ? `, ${a.line2}` : ''}
              <br />
              {a.city}, {a.state} — {a.pincode}
            </p>
            <p>
              {!a.is_default ? (
                <button type="button" className="search-filter-apply" onClick={() => setDefault(a.id)}>
                  {t('defaultAddress')}
                </button>
              ) : null}{' '}
              <button type="button" onClick={() => removeAddress(a.id)}>
                ×
              </button>
            </p>
          </li>
        ))}
      </ul>

      <h3>{t('addAddress')}</h3>
      <form className="address-form" onSubmit={saveAddress}>
        <input
          placeholder={t('yourName')}
          value={form.full_name}
          onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          required
        />
        <input
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          required
        />
        <input
          placeholder="Address line 1"
          value={form.line1}
          onChange={(e) => setForm({ ...form, line1: e.target.value })}
          required
        />
        <input
          placeholder="Address line 2"
          value={form.line2}
          onChange={(e) => setForm({ ...form, line2: e.target.value })}
        />
        <input
          placeholder="City"
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
          required
        />
        <input
          placeholder="State"
          value={form.state}
          onChange={(e) => setForm({ ...form, state: e.target.value })}
          required
        />
        <input
          placeholder="PIN"
          value={form.pincode}
          onChange={(e) => setForm({ ...form, pincode: e.target.value })}
          required
        />
        {err ? <p className="review-error">{err}</p> : null}
        <button type="submit" className="hero-cta" disabled={saving}>
          {saving ? t('submitting') : t('saveAddress')}
        </button>
      </form>
      <p style={{ marginTop: '1.5rem' }}>
        <Link to="/orders">{t('yourOrdersTitle')}</Link> · <Link to="/wishlist">{t('myWishlist')}</Link>
      </p>
    </div>
  )
}
