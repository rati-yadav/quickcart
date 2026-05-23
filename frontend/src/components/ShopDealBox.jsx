import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { CategoryShopModal } from './CategoryShopModal'

export function ShopDealBox({ box }) {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)

  return (
    <>
      <button type="button" className="box box-clickable" onClick={() => setOpen(true)}>
        <div className="box-content">
          {box.badge ? <span className="box-badge">{box.badge}</span> : null}
          <h2>{box.title}</h2>
          <p className="box-desc">{box.description}</p>
          <div className="box-image" style={{ backgroundImage: `url('${box.image}')` }} />
          <ul className="box-preview-options">
            {box.options.slice(0, 3).map((opt) => (
              <li key={opt.label}>{opt.label}</li>
            ))}
          </ul>
          <p className="box-see-more">
            {t('seeMore')} <i className="fa-solid fa-chevron-right" aria-hidden />
          </p>
        </div>
      </button>
      <CategoryShopModal box={open ? box : null} onClose={() => setOpen(false)} />
    </>
  )
}
