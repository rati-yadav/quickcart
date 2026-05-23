import { useCart } from '../context/CartContext'

export function CartToast() {
  const { toast } = useCart()
  if (!toast) return null

  return (
    <div className="cart-toast" role="status">
      <i className="fa-solid fa-circle-check" aria-hidden />
      {toast}
    </div>
  )
}
