import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import GuestBanner from './account/GuestBanner.jsx'
import SkeletonCard from './common/SkeletonCard.jsx'

export default function Layout() {
  const location = useLocation()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => setLoading(false), 100)
    return () => clearTimeout(t)
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-blush-200">
      <Navbar />
      <GuestBanner />
      <main className="mx-auto max-w-5xl px-6 sm:px-8 py-16">
        {loading ? (
          <div className="space-y-3">
            <SkeletonCard className="h-24" />
            <SkeletonCard className="h-24" />
          </div>
        ) : (
          <Outlet />
        )}
      </main>
      <Footer />
    </div>
  )
}
