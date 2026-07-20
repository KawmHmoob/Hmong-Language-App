import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import GuestBanner from './account/GuestBanner.jsx'
import PrimaryNav from './PrimaryNav.jsx'
import SkeletonCard from './common/SkeletonCard.jsx'
import WarningRibbon from './common/WarningRibbon.jsx'

export default function Layout() {
  const location = useLocation()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => setLoading(false), 100)
    return () => clearTimeout(t)
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-seafoam-300">
      <Navbar />
      <GuestBanner />
      {/* Desktop: rail + content side by side. Mobile: the rail hides itself
          and PrimaryNav's fixed bottom tab bar takes over (hence pb-24). */}
      <WarningRibbon/>
      
      <div className="mx-auto max-w-6xl flex gap-6">
        <PrimaryNav />
        <main className="flex-1 min-w-0 px-5 sm:px-8 py-12 sm:py-16 pb-28 md:pb-16">
          {loading ? (
            <div className="space-y-3">
              <SkeletonCard className="h-24" />
              <SkeletonCard className="h-24" />
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
      <Footer />
    </div>
  )
}
