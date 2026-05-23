import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { HeroCarousel } from '../components/HeroCarousel'
import { ShopDealBox } from '../components/ShopDealBox'
import { ProductCard } from '../components/ProductCard'
import { useLanguage } from '../context/LanguageContext'
import {
  CATEGORY_STRIP,
  DISCOUNT_BANNERS,
  SHOP2_BOXES,
  SHOP_BOXES,
} from '../data/homeContent'
import '../styles/homeShop.css'

export function HomePage() {
  const { t, tCategory } = useLanguage()
  const [products, setProducts] = useState([])
  const [loadError, setLoadError] = useState(null)

  useEffect(() => {
    api('/products/')
      .then(setProducts)
      .catch(() => setLoadError('Could not load products from API.'))
  }, [])

  return (
    <>
      <HeroCarousel />

      <div className="shop-section">
        {SHOP_BOXES.map((box) => (
          <ShopDealBox key={box.title} box={box} />
        ))}

        <div className="scroll-prod">
          <div className="scroll-prod-header">
            <div>
              <h2>{t('blockbusterDeals')}</h2>
              <p className="scroll-prod-sub">{t('blockbusterSub')}</p>
              {loadError && <small style={{ color: '#c00' }}>{loadError}</small>}
            </div>
            <Link to="/search?q=deal" className="scroll-prod-link">
              {t('seeAllDeals')}
            </Link>
          </div>
          <div className="products products-deals">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>

        <div className="scroll-prod2">
          <div className="scroll-prod-header">
            <div>
              <h2>{t('shopTopCategories')}</h2>
              <p className="scroll-prod-sub">{t('shopTopSub')}</p>
            </div>
            <Link to="/search" className="scroll-prod-link">
              {t('exploreAllCategories')}
            </Link>
          </div>
          <div className="products">
            {CATEGORY_STRIP.map((cat) => {
              const params = new URLSearchParams()
              if (cat.category) params.set('category', cat.category)
              if (cat.query) params.set('q', cat.query)
              return (
                <Link key={cat.label} to={`/search?${params.toString()}`} className="category-strip-item">
                  <img src={cat.image} alt={cat.label} />
                  <span>{tCategory(cat.label)}</span>
                </Link>
              )
            })}
          </div>
        </div>

        {DISCOUNT_BANNERS.map((banner) => (
          <Link
            key={banner.title}
            to={`/search?category=${encodeURIComponent(banner.category)}`}
            className="discount-section discount-section-link"
          >
            <img src={banner.image} alt={banner.title} />
          </Link>
        ))}

        <div className="shop2-section">
          {SHOP2_BOXES.map((box) => (
            <ShopDealBox key={box.title} box={box} />
          ))}
        </div>

        <div className="signin-section">
          <div className="contect">
            <p>{t('seePersonalized')}</p>
            <Link to="/signin" className="signin-cta-link">
              {t('signIn')}
            </Link>
            <p>
              {t('newCustomer')}{' '}
              <Link to="/signup">{t('startHere')}</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
