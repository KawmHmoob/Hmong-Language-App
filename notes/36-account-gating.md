# Account Gating — the guest → account wall (and the migration that makes it honest)

## What
Guests now get a **free sample**, then a signup wall:

| Section | Guest access |
| --- | --- |
| **Reference** (alphabet, tones, grammar) | **Unlimited, forever.** No account, ever. |
| **Learn** | First **2 lessons** (Pronouns, Singular Consonants) |
| **Speak** | First **3 phrases** (*Nyob zoo* → *Koj puas nyob zoo?* → *Kuv nyob zoo*) |
| Everything else | Free account required |

Signed-in users pass everything (the **Pro** paywall is a separate, later gate).
And crucially: **guest progress survives signup** — the thing that would have
made this feature actively harmful.

## Why — three gates, not one
The app now has three access tiers on **two independent axes**:

```
guest    →  sample the app, nothing stored server-side   ← lib/access.js + AccountGate
account  →  full free tier, progress syncs across devices
pro      →  paid content (lesson/phrase `tier: 'pro'`)   ← SubscriptionContext + PaywallGate
```
`AccountGate` wraps **outside** `PaywallGate` everywhere, because **you cannot
subscribe without an account.** Asking a guest to pay before they've registered
is a dead end; asking them to register first is the natural funnel.

**Reference stays free on purpose.** The alphabet and tones are the app's
"try me" surface — a heritage learner who wants to hear what `-j` sounds like
should never hit a wall. It also costs us nothing: it's static reference with
no progress to sync. Give away the thing that proves the app is good.

## The design decision: positional limits, not credits
```js
export const GUEST_LESSON_LIMIT = 2
export const GUEST_PHRASE_LIMIT = 3

export function isLessonGuestAllowed(lessonId) {
  const i = units.flatMap((u) => u.lessons.map((l) => l.id)).indexOf(lessonId)
  return i > -1 && i < GUEST_LESSON_LIMIT
}
```
The first N items **in curriculum order** are open — forever. The alternative
(a "2 lessons remaining" credit balance) was rejected:

| Positional (chosen) | Credits (rejected) |
| --- | --- |
| Zero state — pure function of the data | Needs a counter in ProgressContext |
| Re-reading lesson 1 is free | Re-reading *spends* a credit, punishing review |
| Guest sees exactly which lessons are open | "Which 2 did I use?" |
| Can't be gamed by clearing storage… because there's nothing to clear | Clearing localStorage resets the counter anyway |

The credit model's only advantage is letting a guest choose *which* lessons —
worth nothing when the course is sequential.

## The trap this feature nearly walked into
Progress is keyed by user id:
```js
if (userId === 'guest') return localStorage['kawmhmoob.progress.guest']
const { data } = await supabase.from('progress').select('data').eq('user_id', userId)
```
So the moment a guest registers, `userId` flips `'guest'` → a real uuid, the load
effect refires, Supabase returns nothing, and **their 2 lessons of XP and streak
evaporate.** We'd have built a wall that says *"sign up to continue"* and then
punished the people who did. Worse than no gate.

### The fix: adopt-on-empty
```js
const { data } = await supabase.from('progress')…
if (data?.data) return data.data          // existing account — use its own data

const guest = readGuestProgress()          // no row = someone JUST signed up
if (guest) return guest                    // adopt their sample progress
return initialState
```
Three details that matter:
1. **Only on an EMPTY account.** A returning user logging in on a borrowed
   laptop must never have their real progress overwritten by whatever a guest
   did on that device. "No row exists" is the *only* safe merge condition.
2. **`readGuestProgress()` ignores untouched state.** If the guest never did
   anything, adopting `initialState` is a no-op that would mask a genuinely
   empty new account. It checks for real activity (xp, steps, scores, schedule)
   before returning anything.
3. **The guest key is NOT cleared.** The save effect writes to Supabase ~500ms
   later; clearing first means a failed write loses the data permanently. Cost
   of leaving it: a second account on the same device inherits the same sample
   progress. Harmless — and strictly better than the alternative failure.

The `RegisterCard` says **"Your progress so far comes with you"** — that line is
only honest because of the above. The #1 reason people bounce off a signup wall
is fear of losing what they just did.

## Show the wall before the click
A gate you discover *after* investing attention feels like a bait-and-switch.
So both hubs badge gated items up front:
- `LessonCard` → grey **"Free account"** pill (Pro wins if both apply — bigger ask)
- Speak hub → grey **"Account"** pill
- `GuestBanner` now states the actual offer ("2 lessons and 3 phrases free, the
  alphabet is always free") with the numbers **imported from `lib/access.js`**,
  so the banner can never drift from the real gate.

`AccountGate` also passes `state={{ from }}` to `/register`, so the auth forms
can send people back where they were blocked (wiring that up in the forms is
the obvious next step).

## How to extend
- **Change the limits:** `GUEST_LESSON_LIMIT` / `GUEST_PHRASE_LIMIT` in
  `src/lib/access.js`. Gates, hub badges, and the banner all read from there.
- **Gate a new section:** write an `isXGuestAllowed(id)` in `lib/access.js`,
  wrap the page in `<AccountGate allowed={…}>`, badge the hub. Same three steps.
- **Which lessons are free** = whichever come first in `units[]`. Reordering the
  curriculum silently changes the free sample — that's intended, but worth
  remembering.

## Known gap (deliberate)
**Words / Vocabulary / Quiz are ungated.** A guest can still drill all 391 words
and take all 35 quizzes, which leaks around the Learn wall. Not gated because it
wasn't asked for — but if the goal is conversion, this is the hole. The fix is
mechanical: an `isQuizGuestAllowed` / `isCategoryGuestAllowed` in the same file.

## Files
- `src/lib/access.js` — **new**: limits + `isLessonGuestAllowed` / `isPhraseGuestAllowed`
- `src/components/common/AccountGate.jsx` — **new**: the wall
- `src/context/ProgressContext.jsx` — `readGuestProgress()` + adopt-on-empty
- `src/pages/Lesson.jsx`, `src/pages/SpeakPhrase.jsx` — gates (outside PaywallGate)
- `src/components/learn/LessonCard.jsx`, `src/pages/Speak.jsx` — pre-click badges
- `src/components/account/GuestBanner.jsx` — states the real offer
