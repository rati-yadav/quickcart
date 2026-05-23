import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { OrderTracking } from '../components/OrderTracking'
import { useLanguage } from '../context/LanguageContext'
import '../styles/ordersPage.css'
import '../styles/features.css'

export function OrdersPage() {
  const { isAuthenticated } = useAuth()
  const { t } = useLanguage()
  const [orders, setOrders] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAuthenticated) return
    api('/orders/')
      .then(setOrders)
      .catch((e) => setError(e.data?.detail || e.message || 'Could not load orders'))
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return (
      <main className="returns-orders">
        <div className="container">
          <h2>{t('returnsOrders')}</h2>
          <p>{t('signInViewOrders')}</p>
          <Link to="/signin" className="btn-signin">
            {t('signIn')}
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="returns-orders orders-logged-in">
      <div className="container orders-list-wrap">
        <h2>{t('yourOrdersTitle')}</h2>
        {error ? <p className="orders-error">{error}</p> : null}
        {!orders.length && !error ? <p>{t('noOrders')}</p> : null}
        <ul className="orders-ul">
          {orders.map((o) => (
            <li key={o.id} className="order-card">
              <div className="order-meta">
                Order #{o.id} · {new Date(o.created_at).toLocaleString()} · {o.status}
                {o.payment_method ? (
                  <>
                    {' '}
                    · {t('paidVia')} <strong>{o.payment_method.toUpperCase()}</strong>
                  </>
                ) : null}
              </div>
              <OrderTracking order={o} />
              {o.shipping_address ? (
                <p className="order-shipping">{o.shipping_address}</p>
              ) : null}
              <ul>
                {o.items?.map((it, idx) => (
                  <li key={idx}>
                    {it.product_name} × {it.quantity} @ ₹{Number(it.unit_price).toFixed(2)}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <Link to="/">{t('continueShopping')}</Link>
      </div>
    </main>
  )
}
