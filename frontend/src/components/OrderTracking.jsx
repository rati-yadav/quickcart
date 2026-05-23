import { useLanguage } from '../context/LanguageContext'

const STEPS = [
  { key: 'Placed', labelKey: 'trackPlaced' },
  { key: 'Confirmed', labelKey: 'trackConfirmed' },
  { key: 'Packed', labelKey: 'trackPacked' },
  { key: 'Shipped', labelKey: 'trackShipped' },
  { key: 'OutForDelivery', labelKey: 'trackOut' },
  { key: 'Delivered', labelKey: 'trackDelivered' },
]

export function OrderTracking({ order }) {
  const { t } = useLanguage()
  const currentIndex = STEPS.findIndex((s) => s.key === order.status)
  const activeIndex = currentIndex >= 0 ? currentIndex : 0

  return (
    <div className="order-tracking">
      <p className="order-tracking-id">
        {t('trackingId')}: <strong>{order.tracking_id || '—'}</strong>
      </p>
      <ol className="order-tracking-steps">
        {STEPS.map((step, i) => {
          const done = i <= activeIndex
          const current = i === activeIndex
          return (
            <li key={step.key} className={`${done ? 'done' : ''} ${current ? 'current' : ''}`}>
              <span className="order-tracking-dot" />
              <span>{t(step.labelKey)}</span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
