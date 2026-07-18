import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { GUEST_LESSON_LIMIT, GUEST_PHRASE_LIMIT, GUEST_GATING_ENABLED } from '../../lib/access.js'

// Tells guests what they get and what signing up buys, rather than only
// apologizing about localStorage. Numbers come from lib/access.js so the
// banner can never contradict the actual gate (notes/36).

export default function GuestBanner() {
  const { user } = useAuth()
  if (!user.isGuest) return null
  return (
    <div className="bg-cream-100/80 border-b border-cream-300/60 text-stone-700 text-sm">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-2 flex flex-wrap gap-x-3 gap-y-1 justify-between items-center">
        <span>
          {GUEST_GATING_ENABLED ? (
            <>
              Browsing as a guest — {GUEST_LESSON_LIMIT} lessons and{' '}
              {GUEST_PHRASE_LIMIT} phrases free. The{' '}
              <Link to="/reference" className="text-clay-700 underline hover:text-clay-800">
                alphabet
              </Link>{' '}
              is always free.
            </>
          ) : (
            <>You’re browsing as a guest — progress saves on this device only.</>
          )}
        </span>
        <span className="flex gap-3 shrink-0">
          <Link to="/register" className="text-clay-700 font-medium underline hover:text-clay-800">
            Create free account
          </Link>
          <Link to="/login" className="text-clay-700 underline hover:text-clay-800">
            Log in
          </Link>
        </span>
      </div>
    </div>
  )
}
