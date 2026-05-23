import { Link } from 'react-router-dom'
import { PaymentMethodsBanner } from '../components/PaymentMethods'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useLanguage } from '../context/LanguageContext'
import '../styles/cartPage.css'

export function CartPage() {
  const { items, setQuantity, removeItem, subtotal } = useCart()
  const { isAuthenticated } = useAuth()
  const { t } = useLanguage()
  const itemCount = items.reduce((s, r) => s + r.quantity, 0)

  return (
    <div className="cart-page">
      <div className="cart-layout">
        <section className="cart-panel">
          <h1>{t('shoppingCart')}</h1>
          {items.length ? (
            <p className="cart-count-label">
              {isAuthenticated ? t('cartHello') : t('cartSignInHint')}
            </p>
          ) : null}

          {!items.length ? (
            <p>
              {t('cartEmpty')}{' '}
              <Link to="/">{t('shopTodayDeals')}</Link>
            </p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {items.map((row) => (
                <li key={row.productId} className="cart-row">
                  <img src={row.product?.image_url} alt="" />
                  <div>
                    <div className="cart-row-title">{row.product?.name}</div>
                    <div className="cart-row-price">₹{Number(row.product?.price).toFixed(2)}</div>
                    <div className="cart-qty" style={{ marginTop: 8 }}>
                      <label>
                        {t('qty')}{' '}
                        <input
                          type="number"
                          min={1}
                          value={row.quantity}
                          onChange={(e) => setQuantity(row.productId, Number(e.target.value))}
                        />
                      </label>
                    </div>
                  </div>
                  <div />
                  <button
                    type="button"
                    className="cart-delete-btn"
                    onClick={() => removeItem(row.productId)}
                  >
                    {t('delete')}
                  </button>
                </li>
              ))}
            </ul>
          )}

          <PaymentMethodsBanner />
        </section>

        {items.length > 0 && (
          <aside className="cart-subtotal-box">
            <p>
              {t('subtotal', { count: itemCount })}: <strong>₹{subtotal.toFixed(2)}</strong>
            </p>
            {isAuthenticated ? (
              <Link to="/checkout" className="cart-checkout-btn">
                {t('proceedCheckout')}
              </Link>
            ) : (
              <>
                <Link to="/signin" className="cart-checkout-btn">
                  {t('signInCheckout')}
                </Link>
                <p className="cart-signin-hint">
                  {t('newCustomer')} <Link to="/signup">{t('startHere')}</Link>
                </p>
              </>
            )}
          </aside>
        )}
      </div>
    </div>
  )
}
