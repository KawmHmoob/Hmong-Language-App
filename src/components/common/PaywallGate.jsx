import { Link } from 'react-router-dom'
import { canAccess, useSubscription } from '../../context/SubscriptionContext.jsx'

// Wrap a route or any node with this. If the user's tier doesn't cover
// `tier`, the fallback (default: UpgradeCard) renders instead.
//
// Usage:
//   <PaywallGate tier={lesson.tier}><Lesson /></PaywallGate>
//
// Note: this is UX gating only. Real enforcement happens server-side once
// locked content moves to Supabase. See notes/14-paywall-and-supabase.md.

export default function PaywallGate({ tier, fallback, contentLabel, children }) {
  const { tier: userTier } = useSubscription()
  if (canAccess(tier, userTier)) return children
  return fallback || <UpgradeCard contentLabel={contentLabel} />
}

function UpgradeCard({ contentLabel }) {
  return (
    <div className="surface p-8 text-center max-w-xl mx-auto">
      <p className="text-xs uppercase tracking-[0.25em] text-clay-600 mb-3">Pro content</p>
      <h2 className="font-serif text-3xl text-stone-900 mb-3">
        {contentLabel || 'This is part of Kawm Hmoob Pro'}
      </h2>
      <p className="text-stone-700 mb-6 leading-relaxed">
        Upgrade to unlock extended quizzes, full reading library, dialogues, and
        advanced units. Your free progress stays exactly where it is.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link to="/account" className="btn-primary">See plans</Link>
        <Link to="/learn" className="btn-secondary">Back to free lessons</Link>
      </div>
    </div>
  )
}
