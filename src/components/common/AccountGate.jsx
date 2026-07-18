import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { LockIcon } from '../icons/index.jsx'

// Gates content behind having an ACCOUNT (not behind paying — that's
// PaywallGate). Signed-in users always pass; guests pass only when the
// caller says this item is inside the free sample.
//
// Usage:
//   <AccountGate allowed={isLessonGuestAllowed(lesson.id)} contentLabel="…">
//     <Lesson />
//   </AccountGate>
//
// Nest INSIDE nothing and OUTSIDE PaywallGate — you can't subscribe without
// an account, so the account ask always comes first. See notes/36.

export default function AccountGate({ allowed, contentLabel, blurb, children }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user.isGuest || allowed) return children
  return <RegisterCard contentLabel={contentLabel} blurb={blurb} from={location.pathname} />
}

function RegisterCard({ contentLabel, blurb, from }) {
  return (
    <div className="surface-elevated p-8 sm:p-10 text-center max-w-xl mx-auto">
      <span className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-cream-100 text-clay-600 mb-4">
        <LockIcon size={22} />
      </span>
      <p className="text-xs uppercase tracking-[0.25em] text-clay-600 mb-3">
        Free account
      </p>
      <h2 className="font-display text-3xl text-stone-900 mb-3">
        {contentLabel || 'Create a free account to keep going'}
      </h2>
      <p className="text-stone-700 mb-6 leading-relaxed">
        {blurb ||
          'You’ve reached the end of the guest preview. Creating an account is free — it unlocks the rest of the course and saves your progress across devices.'}
      </p>

      {/* Reassurance beats persuasion here: the #1 reason people bounce off a
          signup wall is fear of losing what they just did. */}
      <p className="text-sm text-stone-600 mb-6">
        Your progress so far comes with you.
      </p>

      <div className="flex flex-wrap gap-3 justify-center">
        {/* `from` lets the form send them back where they were blocked. */}
        <Link to="/register" state={{ from }} className="btn-primary">
          Create free account
        </Link>
        <Link to="/login" state={{ from }} className="btn-ghost">
          I already have one
        </Link>
      </div>

      <p className="text-xs text-stone-600 mt-6">
        The alphabet and tones stay free, always —{' '}
        <Link to="/reference" className="text-clay-700 underline">
          keep exploring
        </Link>
        .
      </p>
    </div>
  )
}
