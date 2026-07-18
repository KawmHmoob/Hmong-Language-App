import { units } from '../data/lessons.js'
import { allPhrases } from '../data/speak.js'

// Guest access limits — the "try before you sign up" boundary.
//
// This is a SEPARATE axis from the Pro paywall (SubscriptionContext):
//
//   guest      → sample the app, no account            ← this file
//   account    → full free tier, progress syncs        ← AccountGate
//   pro        → paid content (lesson/phrase tier)     ← PaywallGate
//
// Both gates can apply to one page; account comes first, because you cannot
// subscribe without an account. See notes/36.
//
// Limits are POSITIONAL, not counted: the first N items in curriculum order
// are open, forever. Nothing is stored, nothing is spent, and a guest can
// always revisit what they've seen. A "2 remaining" credit model would need
// state, punish re-reading, and invite clock-watching — this doesn't.

// ⚠️ MASTER SWITCH — guest gating is OFF for testing.
// While false, every isXGuestAllowed() returns true, so guests reach
// everything and no "Free account" badges render. Flip to true to re-arm
// the wall (limits below take effect again). This is the ONE line to change.
export const GUEST_GATING_ENABLED = false

export const GUEST_LESSON_LIMIT = 2
export const GUEST_PHRASE_LIMIT = 3

// Curriculum order = the order lessons appear in units[] (data order is
// teaching order — the same assumption selectNewWords makes).
function lessonOrder() {
  return units.flatMap((u) => u.lessons.map((l) => l.id))
}

export function isLessonGuestAllowed(lessonId) {
  if (!GUEST_GATING_ENABLED) return true
  const i = lessonOrder().indexOf(lessonId)
  return i > -1 && i < GUEST_LESSON_LIMIT
}

export function isPhraseGuestAllowed(phraseId) {
  if (!GUEST_GATING_ENABLED) return true
  const i = allPhrases().findIndex((p) => p.id === phraseId)
  return i > -1 && i < GUEST_PHRASE_LIMIT
}

// For hub badges: how many of a section's items a guest can open.
export const guestLimits = {
  lessons: GUEST_LESSON_LIMIT,
  phrases: GUEST_PHRASE_LIMIT,
}
