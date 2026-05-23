import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api/client'
import { ProductCard } from '../components/ProductCard'
import { ProductReviews } from '../components/ProductReviews'
import { StarRating } from '../components/StarRating'
import { WishlistButton } from '../components/WishlistButton'
import { useCart } from '../context/CartContext'
import { useLanguage } from '../context/LanguageContext'
import '../styles/productDetail.css'
import '../styles/features.css'

export function ProductDetailPage() {
  const { slug } = useParams()
  const { addItem } = useCart()
  const { t, tCategory } = useLanguage()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [qty, setQty] = useState(1)
  const [error, setError] = useState('')

  useEffect(() => {
    setError('')
    setProduct(null)
    api(`/products/${slug}/`)
      .then((p) => {
        setProduct(p)
        return api(`/products/?category=${encodeURIComponent(p.category)}`)
      })
      .then((list) => {
        setRelated((list.results ?? list).filter((x) => x.slug !== slug).slice(0, 6))
      })
      .catch(() => setError(t('productNotFound')))
  }, [slug])

  if (error) {
    return (
      <div className="product-detail-page">
        <p className="product-detail-error">{error}</p>
        <Link to="/">{t('backHome')}</Link>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="product-detail-page">
        <p className="product-detail-loading">{t('loading')}</p>
      </div>
    )
  }

  return (
    <div className="product-detail-page">
      <div className="product-detail-grid">
        <div className="product-detail-image">
          <WishlistButton product={product} />
          <img src={product.image_url} alt={product.name} />
        </div>
        <div className="product-detail-info">
          <p className="product-detail-category">{tCategory(product.category)}</p>
          <h1>{product.name}</h1>
          {Number(product.review_count) > 0 ? (
            <p className="product-detail-rating">
              <StarRating value={product.average_rating} /> ({product.review_count})
            </p>
          ) : null}
          {product.stock != null ? (
            <p className={`product-detail-stock ${product.stock <= 5 ? 'low' : ''}`}>
              {product.stock > 0
                ? product.stock <= 5
                  ? t('onlyLeft', { n: product.stock })
                  : t('inStock')
                : 'Out of stock'}
            </p>
          ) : null}
          <p className="product-detail-price">
            ₹{Number(product.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
          <p className="product-detail-desc">{product.description || t('noDescription')}</p>

          <div className="product-detail-qty">
            <label htmlFor="qty">{t('quantity')}</label>
            <select id="qty" value={qty} onChange={(e) => setQty(Number(e.target.value))}>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div className="product-detail-actions">
            <button
              type="button"
              className="product-detail-btn primary"
              onClick={() => addItem(product, qty)}
              disabled={product.stock === 0}
            >
              {t('addToCart')}
            </button>
            <Link to="/cart" className="product-detail-btn secondary">
              {t('goToCart')}
            </Link>
          </div>

          <p className="product-detail-delivery">
            <i className="fa-solid fa-truck" aria-hidden /> {t('freeDelivery')}
          </p>
        </div>
      </div>

      <ProductReviews slug={slug} />

      {related.length > 0 && (
        <section className="product-detail-related">
          <h2>{t('relatedProducts')}</h2>
          <div className="products products-deals">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
