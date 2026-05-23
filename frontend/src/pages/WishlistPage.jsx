import { Link } from 'react-router-dom'
import { ProductCard } from '../components/ProductCard'
import { useAuth } from '../context/AuthContext'
import { useWishlist } from '../context/WishlistContext'
import { useLanguage } from '../context/LanguageContext'
import '../styles/features.css'

export function WishlistPage() {
  const { isAuthenticated } = useAuth()
  const { items } = useWishlist()
  const { t } = useLanguage()

  if (!isAuthenticated) {
    return (
      <div className="wishlist-page">
        <h1>{t('myWishlist')}</h1>
        <p>{t('signInPurchase')}</p>
        <Link to="/signin" className="hero-cta">
          {t('signIn')}
        </Link>
      </div>
    )
  }

  return (
    <div className="wishlist-page">
      <h1>{t('myWishlist')}</h1>
      {!items.length ? (
        <div className="wishlist-empty">
          <p>{t('wishlistEmpty')}</p>
          <Link to="/">{t('continueShopping')}</Link>
        </div>
      ) : (
        <div className="products products-deals">
          {items.map((row) => (
            <ProductCard key={row.id} product={row.product} />
          ))}
        </div>
      )}
    </div>
  )
}
