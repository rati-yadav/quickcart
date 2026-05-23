import { useNavigate } from 'react-router-dom'
import { useWishlist } from '../context/WishlistContext'
import { useAuth } from '../context/AuthContext'

export function WishlistButton({ product, className = '' }) {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { has, toggle } = useWishlist()
  const active = has(product.id)

  async function onClick(e) {
    e.preventDefault()
    e.stopPropagation()
    if (!isAuthenticated) {
      navigate('/signin')
      return
    }
    await toggle(product)
  }

  return (
    <button
      type="button"
      className={`wishlist-btn ${active ? 'active' : ''} ${className}`.trim()}
      onClick={onClick}
      aria-label={active ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <i className={active ? 'fa-solid fa-heart' : 'fa-regular fa-heart'} />
    </button>
  )
}
