import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import SiteLayout from './components/site/SiteLayout.jsx'
import Landing from './pages/Landing.jsx'
import Contact from './pages/Contact.jsx'
import PrivacyPolicy from './pages/PrivacyPolicy.jsx'
import Terms from './pages/Terms.jsx'
import NotFound from './pages/NotFound.jsx'

// Password reset pulls in supabase-js (~50 kB gzipped). Lazy-loading keeps it
// out of the landing page bundle: it downloads only when someone opens these
// routes. See notes/73.
const ResetPassword = lazy(() => import('./pages/ResetPassword.jsx'))
const UpdatePassword = lazy(() => import('./pages/UpdatePassword.jsx'))
// Unlisted admin page (notes/74). Lazy for the same reason.
const Admin = lazy(() => import('./pages/Admin.jsx'))

// The showcase site for the Kawm Hmoob mobile app.
//
// The full learning web app that used to live here is archived on the git tag
// `webapp-v1` (branch `archive/webapp-v1`). See notes/72.
//
// No providers: the showcase has no accounts, progress, or subscriptions. If
// the app itself comes back to the web, it mounts under /app (reserved below)
// and brings its own providers with it — the marketing pages stay
// dependency-free.

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<Landing />} />
          {/* Text pages share one padded column; the landing page is full-bleed. */}
          <Route element={<PageContainer />}>
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/reset-password/update" element={<UpdatePassword />} />
            <Route path="/admin" element={<Admin />} />
          </Route>

          {/* RESERVED for a future web version of the app. Until then, send
              /app (and anything under it) to the download section. */}
          <Route path="/app/*" element={<Navigate to="/#download" replace />} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

function PageContainer() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
      <Suspense fallback={<p role="status" className="text-center text-stone-700">Loading…</p>}>
        <Outlet />
      </Suspense>
    </div>
  )
}
