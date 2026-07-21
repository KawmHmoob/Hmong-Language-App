import { useEffect, useState } from 'react'
import { Outlet, useLocation, Navigate } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import GuestBanner from './account/GuestBanner.jsx'
import PrimaryNav from './PrimaryNav.jsx'
import SkeletonCard from './common/SkeletonCard.jsx'
import WarningRibbon from './common/WarningRibbon.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function Layout() {
  const location = useLocation()
  const { user, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => setLoading(false), 100)
    return () => clearTimeout(t)
  }, [location.pathname])

  // Onboarding gate: an authed user who has never completed (or skipped)
  // onboarding is routed there once. Covers the email-confirmation path, where
  // RegisterForm can't navigate directly because there's no session yet — the
  // user lands here only after confirming and logging in.
  //
  // Waits for auth to finish loading, or a signed-in user would flash as guest
  // and skip the gate. `/logout` isn't a route here, so no loop risk; the
  // Onboarding page itself is excluded.
  const needsOnboarding =
    !authLoading && !user.isGuest && !user.onboardedAt && location.pathname !== '/onboarding'
  if (needsOnboarding) {
    return <Navigate to="/onboarding" replace />
  }

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
