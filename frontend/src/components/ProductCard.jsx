import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useLanguage } from '../context/LanguageContext'
import { StarRating } from './StarRating'
import { WishlistButton } from './WishlistButton'

export function ProductCard({ product }) {
  const { addItem } = useCart()
  const { t, tCategory } = useLanguage()

  return (
    <article className="product-card">
      <Link to={`/product/${product.slug}`} className="product-card-link">
        <div className="product-card-image-wrap">
          <WishlistButton product={product} className="on-card" />
          <img src={product.image_url} alt={product.name} loading="lazy" />
          <div className="product-card-overlay">
            <button
              type="button"
              className="product-card-btn"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                addItem(product, 1)
              }}
            >
              <i className="fa-solid fa-cart-plus" aria-hidden /> {t('addToCart')}
            </button>
          </div>
        </div>
        <div className="product-card-body">
          <h3 className="product-card-title">{product.name}</h3>
          {Number(product.review_count) > 0 ? (
            <StarRating value={product.average_rating} size="sm" />
          ) : null}
          <p className="product-card-price">
            ₹{Number(product.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
          {product.category ? (
            <span className="product-card-tag">{tCategory(product.category)}</span>
          ) : null}
        </div>
      </Link>
    </article>
  )
}
