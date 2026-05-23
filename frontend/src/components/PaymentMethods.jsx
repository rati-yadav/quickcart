import { useLanguage } from '../context/LanguageContext'

const METHOD_IDS = ['upi', 'card', 'netbanking', 'wallet', 'cod']
const METHOD_ICONS = {
  upi: 'fa-mobile-screen-button',
  card: 'fa-credit-card',
  netbanking: 'fa-building-columns',
  wallet: 'fa-wallet',
  cod: 'fa-money-bill-wave',
}

const CARD_BRANDS = [
  { name: 'Visa', className: 'pay-brand visa' },
  { name: 'Mastercard', className: 'pay-brand mastercard' },
  { name: 'RuPay', className: 'pay-brand rupay' },
  { name: 'UPI', className: 'pay-brand upi' },
  { name: 'Paytm', className: 'pay-brand paytm' },
]

export function PaymentMethodPicker({ value, onChange, name = 'payment_method' }) {
  const { t } = useLanguage()

  return (
    <div className="payment-block">
      <p className="payment-block-title">{t('selectPayment')}</p>
      <ul className="payment-methods-list">
        {METHOD_IDS.map((id) => (
          <li key={id}>
            <label className={`payment-method-option ${value === id ? 'selected' : ''}`}>
              <input
                type="radio"
                name={name}
                value={id}
                checked={value === id}
                onChange={() => onChange(id)}
              />
              <span className="payment-method-icon">
                <i className={`fa-solid ${METHOD_ICONS[id]}`} aria-hidden />
              </span>
              <span className="payment-method-text">
                <strong>{t(`payment.${id}`)}</strong>
                <small>{t(`payment.${id}Hint`)}</small>
              </span>
            </label>
          </li>
        ))}
      </ul>
      <div className="payment-brands-strip" aria-label={t('weAccept')}>
        {CARD_BRANDS.map((b) => (
          <span key={b.name} className={b.className}>
            {b.name}
          </span>
        ))}
      </div>
    </div>
  )
}

export function PaymentMethodsBanner() {
  const { t } = useLanguage()
  return (
    <div className="payment-banner" aria-label={t('weAccept')}>
      <span className="payment-banner-label">{t('weAccept')}</span>
      {CARD_BRANDS.map((b) => (
        <span key={b.name} className={b.className}>
          {b.name}
        </span>
      ))}
    </div>
  )
}
