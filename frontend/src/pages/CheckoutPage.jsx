import { useEffect, useState } from 'react'

import { Link, useNavigate } from 'react-router-dom'

import { api } from '../api/client'

import { PaymentMethodPicker } from '../components/PaymentMethods'

import { useAuth } from '../context/AuthContext'

import { useCart } from '../context/CartContext'

import { useLanguage } from '../context/LanguageContext'

import { demoPayment, openRazorpayCheckout } from '../utils/razorpay'

import '../styles/checkoutPage.css'

import '../styles/features.css'



export function CheckoutPage() {

  const navigate = useNavigate()

  const { items, subtotal, clear } = useCart()

  const { isAuthenticated, user } = useAuth()

  const { t } = useLanguage()

  const [paymentMethod, setPaymentMethod] = useState('cod')

  const [addresses, setAddresses] = useState([])

  const [addressId, setAddressId] = useState(null)

  const [msg, setMsg] = useState('')

  const [err, setErr] = useState('')

  const [placing, setPlacing] = useState(false)



  useEffect(() => {

    if (!isAuthenticated) return

    api('/addresses/')

      .then((data) => {

        const list = data.results ?? data

        setAddresses(list)

        const def = list.find((a) => a.is_default) || list[0]

        if (def) setAddressId(def.id)

      })

      .catch(() => setAddresses([]))

  }, [isAuthenticated])



  if (!isAuthenticated) {

    return (

      <div className="checkout-page">

        <div className="checkout-panel">

          <h1>{t('checkout')}</h1>

          <p>{t('signInPurchase')}</p>

          <Link to="/signin" className="checkout-primary-btn">

            {t('signIn')}

          </Link>

          <p className="checkout-muted">

            {t('newCustomer')} <Link to="/signup">{t('createAccount')}</Link>

          </p>

        </div>

      </div>

    )

  }



  if (!items.length) {

    return (

      <div className="checkout-page">

        <div className="checkout-panel">

          <h1>{t('checkout')}</h1>

          <p>{t('cartEmptyCheckout')}</p>

          <Link to="/" className="checkout-primary-btn">

            {t('continueShopping')}

          </Link>

        </div>

      </div>

    )

  }



  const orderPayload = (extra = {}) => ({

    payment_method: paymentMethod,

    address_id: addressId,

    items: items.map((row) => ({

      product_id: row.productId,

      quantity: row.quantity,

    })),

    ...extra,

  })



  async function submitOrder(extra = {}) {

    setErr('')

    setMsg('')

    setPlacing(true)

    try {

      await api('/orders/', {

        method: 'POST',

        body: JSON.stringify(orderPayload(extra)),

      })

      clear()

      setMsg(t('orderSuccess'))

      setTimeout(() => navigate('/orders'), 1200)

    } catch (e) {

      setErr(e.data?.detail || e.message || 'Checkout failed')

    } finally {

      setPlacing(false)

    }

  }



  async function placeCodOrder() {

    await submitOrder()

  }



  async function payWithRazorpay(useDemo = false) {

    setErr('')

    setMsg('')

    setPlacing(true)

    try {

      if (useDemo) {

        const demo = await demoPayment()

        await submitOrder({

          payment_method: 'razorpay',

          razorpay_order_id: demo.razorpay_order_id,

          razorpay_payment_id: demo.razorpay_payment_id,

          razorpay_signature: demo.razorpay_signature,

        })

        return

      }



      const rp = await api('/payments/razorpay/create/', {

        method: 'POST',

        body: JSON.stringify({ amount: subtotal }),

      })



      if (rp.demo) {

        const demo = await demoPayment()

        await submitOrder({

          payment_method: 'razorpay',

          razorpay_order_id: demo.razorpay_order_id,

          razorpay_payment_id: demo.razorpay_payment_id,

          razorpay_signature: demo.razorpay_signature,

        })

        return

      }



      setPlacing(false)

      await openRazorpayCheckout({

        keyId: rp.key_id,

        orderId: rp.razorpay_order_id,

        amount: rp.amount,

        currency: rp.currency,

        name: user?.username || '',

        email: user?.email || '',

        onSuccess: async (response) => {

          setPlacing(true)

          try {

            await submitOrder({

              payment_method: 'razorpay',

              razorpay_order_id: response.razorpay_order_id,

              razorpay_payment_id: response.razorpay_payment_id,

              razorpay_signature: response.razorpay_signature,

            })

          } catch (e) {

            setErr(e.message)

            setPlacing(false)

          }

        },

      })

    } catch (e) {

      setErr(e.message || 'Payment failed')

      setPlacing(false)

    }

  }



  const itemCount = items.reduce((s, r) => s + r.quantity, 0)



  return (

    <div className="checkout-page">

      <div className="checkout-grid">

        <section className="checkout-panel checkout-panel-main">

          <h1>{t('checkout')}</h1>



          <div className="checkout-address-block">

            <h2>{t('shippingAddress')}</h2>

            {!addresses.length ? (

              <p>

                {t('noAddresses')}{' '}

                <Link to="/account">{t('addAddress')}</Link>

              </p>

            ) : (

              addresses.map((a) => (

                <label key={a.id} className="checkout-address-option">

                  <input

                    type="radio"

                    name="address"

                    checked={addressId === a.id}

                    onChange={() => setAddressId(a.id)}

                  />{' '}

                  <strong>{a.full_name}</strong> — {a.line1}, {a.city} {a.pincode}

                </label>

              ))

            )}

            <Link to="/account" className="checkout-link">

              {t('addAddress')}

            </Link>

          </div>



          <PaymentMethodPicker value={paymentMethod} onChange={setPaymentMethod} />



          {err ? <p className="checkout-error">{err}</p> : null}

          {msg ? <p className="checkout-success">{msg}</p> : null}



          {paymentMethod === 'cod' ? (

            <button

              type="button"

              className="checkout-primary-btn"

              onClick={placeCodOrder}

              disabled={placing || Boolean(msg)}

            >

              {placing ? t('processing') : t('placeOrderCod')}

            </button>

          ) : (

            <div className="checkout-razorpay-actions">

              <button

                type="button"

                className="checkout-primary-btn"

                onClick={() => payWithRazorpay(false)}

                disabled={placing || Boolean(msg)}

              >

                {placing ? t('processing') : t('payRazorpay')}

              </button>

              <button

                type="button"

                className="checkout-link-btn"

                onClick={() => payWithRazorpay(true)}

                disabled={placing || Boolean(msg)}

              >

                {t('payDemo')}

              </button>

              <p className="checkout-razorpay-note">{t('razorpayNote')}</p>

            </div>

          )}

        </section>



        <aside className="checkout-panel checkout-summary">

          <h2>{t('orderSummary')}</h2>

          <ul className="checkout-summary-list">

            {items.map((row) => (

              <li key={row.productId}>

                <img src={row.product?.image_url} alt="" />

                <div>

                  <span>{row.product?.name}</span>

                  <small>

                    {t('qty')} {row.quantity} · ₹{Number(row.product?.price).toFixed(2)}

                  </small>

                </div>

              </li>

            ))}

          </ul>

          <p className="checkout-total">

            {t('subtotal', { count: itemCount })}: <strong>₹{subtotal.toFixed(2)}</strong>

          </p>

          <Link to="/cart" className="checkout-link">

            {t('editCart')}

          </Link>

        </aside>

      </div>

    </div>

  )

}

