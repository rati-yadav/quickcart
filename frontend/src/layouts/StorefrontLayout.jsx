import { Outlet } from 'react-router-dom'
import { CartToast } from '../components/CartToast'
import { SiteFooter } from '../components/SiteFooter'
import { SiteHeader } from '../components/SiteHeader'
import '../styles/amazone.css'
import '../styles/features.css'

export function StorefrontLayout() {
  return (
    <>
      <SiteHeader />
      <CartToast />
      <Outlet />
      <SiteFooter />
    </>
  )
}
