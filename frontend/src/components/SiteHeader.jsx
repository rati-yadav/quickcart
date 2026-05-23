import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AmazonLogo } from './AmazonLogo'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useLanguage } from '../context/LanguageContext'

const SEARCH_CATEGORIES = {
  All: '',
  Books: 'Books',
  Clothes: 'Fashion',
  Toys: 'Toys',
  'Electronic Gadgets': 'Electronics',
  Furniture: 'Home',
  Alexa: 'Electronics',
  Kitchen: 'Kitchen',
  stationary: 'Stationery',
}

const SEARCH_CAT_KEYS = {
  All: 'all',
  Books: 'Books',
  Clothes: 'Fashion',
  Toys: 'Toys',
  'Electronic Gadgets': 'Electronics',
  Furniture: 'Home',
  Alexa: 'Electronics',
  Kitchen: 'Kitchen',
  stationary: 'Stationery',
}

export function SiteHeader() {
  const navigate = useNavigate()
  const { user, isAuthenticated, isStaff, logout } = useAuth()
  const { totalCount } = useCart()
  const { count: wishlistCount } = useWishlist()
  const { lang, setLang, t, tCategory } = useLanguage()
  const [panelOpen, setPanelOpen] = useState(false)
  const [searchQ, setSearchQ] = useState('')
  const [searchCat, setSearchCat] = useState('All')

  function onSearch(e) {
    e.preventDefault()
    const params = new URLSearchParams()
    const q = searchQ.trim()
    if (q) params.set('q', q)
    const cat = SEARCH_CATEGORIES[searchCat]
    if (cat) params.set('category', cat)
    navigate(`/search?${params.toString()}`)
  }

  const signInTo = isAuthenticated ? (isStaff ? '/admin' : '/account') : '/signin'
  const signInLine2 = isAuthenticated
    ? isStaff
      ? t('adminPanel')
      : t('accountLists')
    : t('accountLists')

  return (
    <div className="amazon-header-wrap">
      <div className="navbar">
        <Link to="/" className="nav-logo nav-hover" aria-label="Amazone home">
          <AmazonLogo />
        </Link>

        <div className="nav-address nav-hover">
          <p className="add-first">{t('deliverTo')}</p>
          <div className="add-icon">
            <i className="fa-solid fa-location-dot" />
            <p className="add-second">{t('india')}</p>
          </div>
        </div>

        <form className="nav-search" onSubmit={onSearch} role="search">
          <select
            className="Search-select"
            aria-label="Search category"
            value={searchCat}
            onChange={(e) => setSearchCat(e.target.value)}
          >
            {Object.keys(SEARCH_CATEGORIES).map((label) => (
              <option key={label} value={label}>
                {SEARCH_CAT_KEYS[label] === 'all' ? t('all') : tCategory(SEARCH_CAT_KEYS[label])}
              </option>
            ))}
          </select>
          <input
            placeholder={t('searchPlaceholder')}
            className="Search-input"
            type="search"
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)}
          />
          <button type="submit" className="search-icon search-submit-btn" aria-label="Search">
            <i className="fa-solid fa-magnifying-glass" />
          </button>
        </form>

        <div className="nav-lang nav-hover">
          <img
            className="nav-flag-img"
            src="https://flagcdn.com/w40/in.png"
            width={24}
            height={16}
            alt={t('india')}
          />
          <select
            className="nav-lang-select"
            aria-label="Language"
            value={lang}
            onChange={(e) => setLang(e.target.value)}
          >
            <option value="hi">HI</option>
            <option value="en">EN</option>
          </select>
        </div>

        <Link to={signInTo} className="nav-signin nav-hover nav-click-block">
          <p>
            <span>
              {isAuthenticated ? t('helloUser', { name: user?.username }) : t('helloSignIn')}
            </span>
          </p>
          <p className="nav-second">{signInLine2}</p>
        </Link>

        {isAuthenticated ? (
          <Link to="/wishlist" className="nav-wishlist nav-hover" title={t('wishlist')}>
            <i className="fa-regular fa-heart" aria-hidden /> {t('wishlist')}
            {wishlistCount > 0 ? ` (${wishlistCount})` : ''}
          </Link>
        ) : null}

        <Link to="/orders" className="nav-return nav-hover nav-click-block">
          <p>
            <span>{t('returns')}</span>
          </p>
          <p className="nav-second">{t('ordersAmp')}</p>
        </Link>

        <Link to="/cart" className="nav-cart nav-hover nav-click-block">
          <i className="fa-solid fa-cart-shopping" aria-hidden />
          {t('cart')}
          {totalCount > 0 ? ` (${totalCount})` : ''}
        </Link>

        {isAuthenticated && (
          <button type="button" className="nav-signout-btn" onClick={logout} title={t('signOut')}>
            <i className="fa-solid fa-right-from-bracket" aria-hidden />
          </button>
        )}
      </div>

      <div className="panel">
        <button
          type="button"
          className="panel-all border"
          onClick={() => setPanelOpen((o) => !o)}
          aria-expanded={panelOpen}
        >
          <i className="fa-solid fa-bars" /> {t('all')}
        </button>
        <div className={`panel-ops ${panelOpen ? 'active' : ''}`}>
          <Link className="border" to="/search?category=Electronics">
            {t('todaysDeals')}
          </Link>
          <Link className="border" to="/search?category=Fashion">
            {t('bestSeller')}
          </Link>
          <Link className="border" to="/cart">
            {t('yourCart')}
          </Link>
          <Link className="border" to="/wishlist">
            {t('wishlist')}
          </Link>
          <Link className="border" to="/account">
            {t('account')}
          </Link>
          <Link className="border" to="/orders">
            {t('yourOrders')}
          </Link>
          <Link className="border" to="/signin">
            {t('signIn')}
          </Link>
          {isStaff ? (
            <Link className="border" to="/admin">
              {t('adminPanel')}
            </Link>
          ) : null}
          <Link className="border" to="/search?category=Gifts">
            {t('giftCards')}
          </Link>
          <Link className="border" to="/search?category=Home">
            {t('homeKitchen')}
          </Link>
        </div>
        <Link className="panel-deals" to="/search?category=Electronics">
          {t('shopDealsElectronic')}
        </Link>
      </div>
    </div>
  )
}
