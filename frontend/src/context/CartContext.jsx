import { createContext, useContext, useEffect, useState } from 'react'
import { interpolate, translations, LANG_STORAGE_KEY } from '../i18n/translations'

const STORAGE_KEY = 'amazone_cart'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [toast, setToast] = useState(null)
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const showToast = (productName) => {
    const lang = localStorage.getItem(LANG_STORAGE_KEY) === 'hi' ? 'hi' : 'en'
    const message = interpolate(translations[lang].addedToCart, { name: productName })
    setToast(message)
    window.clearTimeout(showToast._t)
    showToast._t = window.setTimeout(() => setToast(null), 2800)
  }

  const addItem = (product, quantity = 1) => {
    showToast(product.name)
    setItems((prev) => {
      const i = prev.findIndex((x) => x.productId === product.id)
      if (i >= 0) {
        const next = [...prev]
        next[i] = {
          ...next[i],
          quantity: next[i].quantity + quantity,
          product: { ...next[i].product, ...product },
        }
        return next
      }
      return [...prev, { productId: product.id, quantity, product }]
    })
  }

  const setQuantity = (productId, quantity) => {
    if (quantity < 1) {
      setItems((prev) => prev.filter((row) => row.productId !== productId))
      return
    }
    setItems((prev) =>
      prev.map((row) => (row.productId === productId ? { ...row, quantity } : row)),
    )
  }

  const removeItem = (productId) => {
    setItems((prev) => prev.filter((row) => row.productId !== productId))
  }

  const clear = () => setItems([])

  const totalCount = items.reduce((s, row) => s + row.quantity, 0)

  const subtotal = items.reduce((s, row) => {
    const price = Number(row.product?.price ?? 0)
    return s + price * row.quantity
  }, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        setQuantity,
        removeItem,
        clear,
        totalCount,
        subtotal,
        toast,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
