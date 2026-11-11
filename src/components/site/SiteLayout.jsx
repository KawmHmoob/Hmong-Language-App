import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import SiteHeader from './SiteHeader.jsx'
import SiteFooter from './SiteFooter.jsx'

// Shell for every showcase page: sticky header, page, footer.
//
// Also handles in-page links ("/#tones"). React Router changes the URL but does
// NOT scroll to a hash on its own, so this does: scroll to the element if the
// URL has a hash, otherwise to the top (a new page should start at the top).
// Sections carry `scroll-mt-24` so the sticky header doesn't cover their title.
export default function SiteLayout() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])

  return (
    <div className="min-h-screen flex flex-col bg-seafoam-300 text-stone-900">
      <SiteHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}
