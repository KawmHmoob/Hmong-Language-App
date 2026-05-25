import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

export default function GuestBanner() {
  const { user } = useAuth()
  if (!user.isGuest) return null
  return (
    <div className="bg-cream-100/80 border-b border-cream-300/60 text-stone-700 text-sm">
      <div className="mx-auto max-w-5xl px-6 py-2 flex flex-wrap gap-3 justify-between items-center">
        <span>You're using a guest account — progress saves on this device only.</span>
        <span className="flex gap-3">
          <Link to="/login" className="text-clay-700 underline hover:text-clay-800">
            Log in
          </Link>
          <Link to="/register" className="text-clay-700 underline hover:text-clay-800">
            Create account
          </Link>
        </span>
      </div>
    </div>
  )
}
