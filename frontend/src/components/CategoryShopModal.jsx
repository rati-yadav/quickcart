import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { useCart } from '../context/CartContext'
import { useLanguage } from '../context/LanguageContext'

export function CategoryShopModal({ box, onClose }) {
  const { addItem } = useCart()
  const { t, tCategory } = useLanguage()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!box) return
    setLoading(true)
    const qs = box.category ? `?category=${encodeURIComponent(box.category)}` : ''
    api(`/products/${qs}`)
      .then((data) => setProducts((data.results ?? data).slice(0, 6)))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [box])

  useEffect(() => {
    if (!box) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [box, onClose])

  if (!box) return null

  return (
    <div className="shop-modal-backdrop" onClick={onClose} role="presentation">
      <div className="shop-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <button type="button" className="shop-modal-close" onClick={onClose} aria-label="Close">
          <i className="fa-solid fa-xmark" />
        </button>

        <div className="shop-modal-header">
          <img src={box.image} alt="" />
          <div>
            {box.badge ? <span className="shop-modal-badge">{box.badge}</span> : null}
            <h2>{box.title}</h2>
            <p>{box.description}</p>
          </div>
        </div>

        <div className="shop-modal-options">
          <h3>{t('shopByCategory')}</h3>
          <div className="shop-modal-option-grid">
            {box.options.map((opt) => {
              const params = new URLSearchParams()
              if (opt.category) params.set('category', opt.category)
              if (opt.query) params.set('q', opt.query)
              return (
                <Link
                  key={opt.label}
                  to={`/search?${params.toString()}`}
                  className="shop-modal-option"
                  onClick={onClose}
                >
                  <i className={`fa-solid ${opt.icon || 'fa-tag'}`} aria-hidden />
                  <span>{opt.label}</span>
                  {opt.hint ? <small>{opt.hint}</small> : null}
                </Link>
              )
            })}
          </div>
        </div>

        <div className="shop-modal-products">
          <h3>{t('topPicks')}</h3>
          {loading ? <p className="shop-modal-loading">{t('loadingProducts')}</p> : null}
          {!loading && !products.length ? (
            <p className="shop-modal-loading">{t('browseSearch')}</p>
          ) : null}
          <div className="shop-modal-product-grid">
            {products.map((p) => (
              <article key={p.id} className="shop-modal-product">
                <Link to={`/product/${p.slug}`} onClick={onClose}>
                  <img src={p.image_url} alt="" />
                  <span className="shop-modal-product-name">{p.name}</span>
                </Link>
                <p className="shop-modal-product-price">₹{Number(p.price).toFixed(2)}</p>
                <button type="button" className="shop-modal-add-btn" onClick={() => addItem(p, 1)}>
                  {t('addToCart')}
                </button>
              </article>
            ))}
          </div>
        </div>

        <Link
          to={`/search?category=${encodeURIComponent(box.category || '')}`}
          className="shop-modal-see-all"
          onClick={onClose}
        >
          {t('seeAllIn', { category: tCategory(box.category) || 'store' })} →
        </Link>
      </div>
    </div>
  )
}
