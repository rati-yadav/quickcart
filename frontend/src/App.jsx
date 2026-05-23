import { Route, Routes } from 'react-router-dom'
import { StorefrontLayout } from './layouts/StorefrontLayout'
import { CartPage } from './pages/CartPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { HomePage } from './pages/HomePage'
import { AdminPage } from './pages/AdminPage'
import { OrdersPage } from './pages/OrdersPage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { SearchPage } from './pages/SearchPage'
import { AccountPage } from './pages/AccountPage'
import { SignInPage } from './pages/SignInPage'
import { SignUpPage } from './pages/SignUpPage'
import { WishlistPage } from './pages/WishlistPage'

export default function App() {
  return (
    <Routes>
      <Route element={<StorefrontLayout />}>
        <Route index element={<HomePage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="product/:slug" element={<ProductDetailPage />} />
        <Route path="admin" element={<AdminPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="wishlist" element={<WishlistPage />} />
        <Route path="account" element={<AccountPage />} />
      </Route>
      <Route path="signin" element={<SignInPage />} />
      <Route path="signup" element={<SignUpPage />} />
    </Routes>
  )
}
