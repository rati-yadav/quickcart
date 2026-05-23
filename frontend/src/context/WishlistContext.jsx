import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { api } from '../api/client'
import { useAuth } from './AuthContext'

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const { isAuthenticated, token } = useAuth()
  const [ids, setIds] = useState(new Set())
  const [items, setItems] = useState([])

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setIds(new Set())
      setItems([])
      return
    }
    try {
      const list = await api('/wishlist/')
      const data = list.results ?? list
      setItems(data)
      setIds(new Set(data.map((row) => row.product.id)))
    } catch {
      setIds(new Set())
      setItems([])
    }
  }, [isAuthenticated])

  useEffect(() => {
    refresh()
  }, [refresh, token])

  const toggle = useCallback(
    async (product) => {
      if (!isAuthenticated) return { needAuth: true }
      const id = product.id
      if (ids.has(id)) {
        await api(`/wishlist/${id}/`, { method: 'DELETE' })
        setIds((prev) => {
          const next = new Set(prev)
          next.delete(id)
          return next
        })
        setItems((prev) => prev.filter((row) => row.product.id !== id))
        return { added: false }
      }
      await api('/wishlist/', {
        method: 'POST',
        body: JSON.stringify({ product_id: id }),
      })
      setIds((prev) => new Set(prev).add(id))
      await refresh()
      return { added: true }
    },
    [ids, isAuthenticated, refresh],
  )

  const value = {
    ids,
    items,
    count: ids.size,
    toggle,
    refresh,
    has: (id) => ids.has(id),
  }

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}
