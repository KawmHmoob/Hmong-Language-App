import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { useAuth } from './AuthContext.jsx'

// Subscription tier for the current user.
//
// Today: stored in localStorage per user. mockUpgrade / mockDowngrade let you
// flip tiers in dev without payment plumbing.
//
// When Supabase + Stripe land: replace loadTier / saveTier with a query against
// a `subscriptions` table. Tier reads stay synchronous via local state, hydrated
// from the network on user change. See notes/14-paywall-and-supabase.md.

const SubscriptionContext = createContext(null)
const KEY_PREFIX = 'kawmhmoob.subscription.'

// ⚠️ MASTER SWITCH — the Pro paywall is OFF for testing.
// While false: canAccess() always passes and every user reads as Pro, so no
// content is gated and no "Pro" locks render. Flip to true to re-arm the
// paywall (tiers in the data take effect again). This is the ONE line.
//
// Sibling switch: GUEST_GATING_ENABLED in src/lib/access.js (also off).
// BOTH must be true before release. See notes/36.
export const PAYWALL_ENABLED = false

const FREE = { tier: 'free', expiresAt: null }

function loadTier(userId) {
  try {
    const raw = localStorage.getItem(KEY_PREFIX + userId)
    if (!raw) return { ...FREE }
    const parsed = JSON.parse(raw)
    if (parsed.expiresAt && new Date(parsed.expiresAt) < new Date()) return { ...FREE }
    return { tier: parsed.tier || 'free', expiresAt: parsed.expiresAt || null }
  } catch {
    return { ...FREE }
  }
}

function saveTier(userId, sub) {
  localStorage.setItem(KEY_PREFIX + userId, JSON.stringify(sub))
}

export function SubscriptionProvider({ children }) {
  const { user } = useAuth()
  const userId = user?.id || 'guest'
  const [sub, setSub] = useState(() => loadTier(userId))

  useEffect(() => {
    setSub(loadTier(userId))
  }, [userId])

  useEffect(() => {
    saveTier(userId, sub)
  }, [userId, sub])

  // Dev-only helpers. In prod these become unreachable — only the Stripe
  // webhook is allowed to mutate the real `subscriptions` row.
  const mockUpgrade = useCallback(() => {
    setSub({ tier: 'pro', expiresAt: null })
  }, [])

  const mockDowngrade = useCallback(() => {
    setSub({ ...FREE })
  }, [])

  const value = useMemo(
    () => ({
      // With the paywall off, everyone reads as Pro so lock badges disappear
      // too (Speak/LessonCard branch on isPro, not just canAccess).
      tier: PAYWALL_ENABLED ? sub.tier : 'pro',
      expiresAt: sub.expiresAt,
      isPro: PAYWALL_ENABLED ? sub.tier === 'pro' : true,
      mockUpgrade,
      mockDowngrade,
    }),
    [sub, mockUpgrade, mockDowngrade]
  )

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext)
  if (!ctx) throw new Error('useSubscription must be used inside SubscriptionProvider')
  return ctx
}

// Pure helper: returns true if the content's tier is accessible to the user's tier.
// Default tier is 'free' when omitted from data.
export function canAccess(contentTier, userTier) {
  if (!PAYWALL_ENABLED) return true // testing — nothing is gated
  const t = contentTier || 'free'
  if (t === 'free') return true
  return userTier === 'pro'
}
