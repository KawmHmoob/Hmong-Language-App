# Paywall & Supabase scaffold — Code Walkthrough

Teaching companion to [14-paywall-and-supabase.md](14-paywall-and-supabase.md). That note explains *what* the scaffold is and how to migrate to real Supabase + Stripe. This note explains *why each piece is shaped the way it is* so you can read the code with intent.

Same format as [13-lesson-system-walkthrough.md](13-lesson-system-walkthrough.md). Read top-to-bottom.

---

## 1. The stub Supabase client — `src/lib/supabase.js`

### What it does

Exports an object called `supabase` that *looks* like the real `@supabase/supabase-js` client but does nothing. Every call resolves to `{ data: null, error: { message: '...' } }`.

### Why a stub instead of `null` or "wait until ready"

You could have skipped this file and added Supabase only when needed. The problem: every component that touches the backend would have to handle "what if Supabase isn't set up yet?" That branching multiplies as the app grows.

The stub solves this by **making the absence of Supabase look the same as a failed call**. Calling code is written once: it awaits the result, checks `error`, and acts. Whether the error came from "not configured" or "network down" or "user not allowed" is irrelevant to the call site.

```js
function stubResult(message) {
  return Promise.resolve({
    data: null,
    error: { message: `Supabase not configured: ${message}` },
  })
}
```

The error message includes which method was called (`auth.getSession`, `from(profiles).select`, etc.) so when something does try to use it in dev, you immediately see *where* the unmet dependency is.

### The chainable `.eq()` and `.single()` tricks

```js
from: (table) => ({
  select: () => stubResult(...),
  eq: function () { return this },
  single: function () { return this },
}),
```

The real Supabase client supports chains like `.from('x').select('y').eq('id', 1).single()`. To not break callers, our stub returns `this` from `.eq` and `.single` so the chain doesn't throw. The Promise comes from `.select`, which is where the chain "lands."

This is a **soft mock** — it matches the *shape* of the API without re-implementing the behavior. Just enough for code paths to compile and run without crashing.

### `isSupabaseConfigured()`

```js
export function isSupabaseConfigured() {
  return Boolean(url && anonKey)
}
```

A helper for code that needs to *decide* whether to call Supabase or fall back. The `AuthContext` migration in `instructions/supabase-integration.md` will use this to skip the real client entirely in dev when env vars are missing.

### Why the commented-out `createClient` line?

```js
// export const supabase = isSupabaseConfigured()
//   ? createClient(url, anonKey)
//   : stubClient
export const supabase = stubClient
```

Two reasons it's commented and not active:

1. **`@supabase/supabase-js` isn't installed yet.** Importing it would fail.
2. **Documents the swap.** The comment is a "delete me and uncomment" instruction baked into the file. When you install the package and add env vars, this is a 3-line change, not a "where do I start" puzzle.

---

## 2. The subscription context — `src/context/SubscriptionContext.jsx`

### Why a separate context instead of putting tier on `AuthContext`

You could have added `subscription: { tier, expiresAt }` to the user object. Two reasons we didn't:

1. **Different sources of truth.** Identity comes from Supabase Auth. Subscription comes from Stripe webhooks writing to a separate table. Coupling them means a network failure in one breaks the other.
2. **Different update frequencies.** Profile changes rarely (display name, dialect). Subscription changes mid-session (you just upgraded — the tier must refresh without re-logging-in). Mixing them forces all consumers to re-render when either changes.

The `useMemo` value separation makes "what depends on what" clear. Components that need tier import `useSubscription`. Components that need username import `useAuth`. No accidental coupling.

### The expiry guard

```js
if (parsed.expiresAt && new Date(parsed.expiresAt) < new Date()) return { ...FREE }
```

A subscription with a past `expiresAt` is treated as `'free'` *on load*. This means a user who cancels mid-week and closes the tab gets downgraded the next time they open the app — no server round-trip needed.

In production this guard is **defense in depth**. The real source of truth is the Stripe webhook updating the row. But if the user opens the app offline, this client-side check still does the right thing.

### Why store in localStorage at all if it's just a mock?

So that **the mock survives a refresh**. If `mockUpgrade()` reset every page load, you'd be unable to test "what does a Pro user see across navigation?" Persistence makes the dev experience realistic.

Also: the localStorage key shape (`kawmhmoob.subscription.<userId>`) is *exactly* the shape the real version will use after Supabase. When you migrate, the persistence layer changes from "write to localStorage" to "write to Supabase," but **the rest of the context — state shape, expiry logic, value memoization — stays identical**. You're effectively dev-testing the production code path today.

### `mockUpgrade` and `mockDowngrade`

```js
const mockUpgrade = useCallback(() => {
  setSub({ tier: 'pro', expiresAt: null })
}, [])
```

The naming is deliberate: **`mock`** prefix flags them as dev-only. When you delete them before production, every call site will fail to compile loudly — you can't accidentally ship a "let users grant themselves Pro" button.

The expiresAt is `null` for the mock because we don't want dev sessions to randomly expire. In real billing, `expiresAt` will be set by Stripe.

### The `canAccess` helper

```js
export function canAccess(contentTier, userTier) {
  const t = contentTier || 'free'
  if (t === 'free') return true
  return userTier === 'pro'
}
```

This is the **single decision function** for the entire app. Every place that asks "can this user see this thing?" funnels through here.

Why is this important? Because the rules will evolve:
- Tomorrow: `'pro-annual'` might be a separate tier
- Next month: a `'student'` tier with 50% access
- Eventually: per-region pricing

If a hundred components each had their own `if (subscription.tier === 'pro')` check scattered through them, those changes would be a refactor. With one `canAccess`, the rule is one edit.

This is the **strategy pattern** — concentrate the policy decision in one function so the code that uses it doesn't need to know the rules.

---

## 3. The gating component — `src/components/common/PaywallGate.jsx`

### Why a render-prop / wrapper component, not a hook

You could have written:

```js
const { allowed } = usePaywall(lesson.tier)
if (!allowed) return <Upgrade />
return <Lesson />
```

That works but pushes the decision into every consumer. With a wrapper component:

```jsx
<PaywallGate tier={lesson.tier}>
  <Lesson />
</PaywallGate>
```

…the gate **encapsulates both the decision and the fallback UI**. Consumers don't import the upgrade card, don't know what locked content looks like, don't have to remember to render the right thing. Add a "show preview" mode tomorrow and every gate in the app gets it for free.

### Composition over conditional rendering

The component does:

```jsx
if (canAccess(tier, userTier)) return children
return fallback || <UpgradeCard />
```

Two-line render, zero state. No effects. No DOM tricks. It's the simplest possible piece of UI machinery — which is exactly what a cross-cutting concern *should* be. The moment a gate component has its own state, it's doing too much.

### The `fallback` prop

Lets the caller override the upgrade card with something custom:

```jsx
<PaywallGate tier="pro" fallback={<TeaserPreview />}>
  <FullArticle />
</PaywallGate>
```

This is the **null object pattern** applied to UI: the gate has a sensible default, but callers who need different behavior can plug it in without forking the component.

---

## 4. Wiring the providers in `App.jsx`

The provider order matters:

```jsx
<AuthProvider>
  <SubscriptionProvider>
    <ProgressProvider>
      <NotebookProvider>
```

Why this order? **Dependency direction is outside-in.**

- `SubscriptionProvider` calls `useAuth()` to know which user's tier to load.
- `ProgressProvider` calls `useAuth()` to partition progress by user.
- `NotebookProvider` is independent of the others.

If `SubscriptionProvider` wrapped `AuthProvider`, it would try to call `useAuth()` before the auth context existed and throw. The rule: **a provider that consumes another context must be a descendant of it**.

The hooks-throw-if-outside-provider pattern (used everywhere in this codebase) catches this immediately — you'd get a loud error in dev, not a silent bug. The architecture note formalizes this convention.

---

## 5. Wiring the gate into `Lesson.jsx`

### The effective-tier calculation

```js
const requiredTier = lesson.tier || unit.tier || 'free'
```

This is the **inheritance rule** for content tiers:

- `lesson.tier` wins if set
- otherwise `unit.tier` (the lesson inherits its unit's tier)
- otherwise `'free'`

Why give lessons the right to override units? Because the natural pricing model is "Pro unit with a free teaser lesson." If the unit said "Pro" and lessons couldn't override, you couldn't market a sample.

Why not the inverse — free unit with one Pro lesson? Also supported: leave the unit unmarked, mark one lesson `tier: 'pro'`. The rule reads cleanly in both directions.

### Why the gate wraps the whole render, not just the body

```jsx
return (
  <PaywallGate tier={requiredTier}>
    <div>... whole lesson UI ...</div>
  </PaywallGate>
)
```

Two alternatives we rejected:

1. **Gate just the content, keep breadcrumbs/header visible.** Tempting because it "feels nicer" to keep navigation chrome. But: breadcrumbs reveal the lesson title, which can be marketing-sensitive ("oh, *that's* what Pro has"). Hiding the whole route is the safer default. The upgrade card has its own back link.

2. **Redirect to a separate `/upgrade` page.** Tempting because it's a "real" route. But: redirecting destroys back-button behavior and loses the context of *what* the user was trying to access. The in-place card preserves intent.

### Why the gate wraps two different return paths in `QuizEngine`

`QuizEngine` returns one JSX for the "finished/reviewing" state and another for "active question." Both must be gated, because the user could be a Pro who took the quiz and then cancelled their sub — visiting the results page should also gate.

The duplication is small (two `<PaywallGate>` wrappers) and the alternative (an inner `_QuizEngineImpl` component with a single gate) was more refactor than it was worth for two return paths. Tolerate small duplication when the abstraction would cost more than the duplication does.

---

## 6. The lock badge in `Learn.jsx`

```jsx
{locked ? (
  <span className="rounded-full bg-clay-600 text-cream-50 px-2 py-0.5">◆ Pro</span>
) : p.complete ? (
  <span className="rounded-full bg-emerald-700 text-cream-50 px-2 py-0.5">✓ Done</span>
) : null}
```

Lock takes precedence over completion. A locked lesson is rendered as locked even if the user somehow completed it before downgrading. The user-facing logic: "what can I do *right now*" beats "what have I done before."

The link is **not disabled** — clicking still routes to `/learn/.../...`, where the gate handles the upgrade card. Why not just `disabled`? Two reasons:

1. **Discoverability of pricing.** A click leading to "here's what you'd unlock" is your best conversion moment. A grayed-out card with no affordance teaches the user nothing.
2. **No special handling on Learn.jsx.** The page renders the list; the gate enforces access. Each layer does one thing.

---

## 7. The `tier` field on data — minimal disruption

We added `tier?: 'free' | 'pro'` to the Unit/Lesson/Quiz schemas as a **purely optional** field. Existing data has zero `tier` properties, and that's intentional:

- The default-to-free behavior in `canAccess` means **no existing item changes status**.
- You opt in to gating by adding the field — no global migration, no "now I have to mark everything `free`."

This is **additive schema evolution**. The opposite (e.g. making the field required) would force a churn pass and a coordination point with everyone editing data files. Avoid it whenever possible.

The data files document the field in a comment block at the top so anyone editing knows it exists.

---

## 8. Things to remember about the architecture

### The dependency graph

```
PaywallGate ─→ SubscriptionContext ─→ AuthContext
     ↓
canAccess(contentTier, userTier)
```

`PaywallGate` doesn't know about lessons or quizzes. It takes a string (`tier`). `SubscriptionContext` doesn't know about content. It exposes a tier. `canAccess` doesn't know about either. It's a pure function.

**Every layer can be unit-tested in isolation.** That's the payoff of keeping each layer narrow.

### The trust boundary

In production, the trust boundary will be the **Supabase RLS policy** that decides which subscription row a user can see, and the **Stripe webhook handler** that decides who's actually Pro. The client never makes that decision — it just *renders* it.

Today: there is no real trust boundary because all content is in the bundle. The scaffold pretends, so you can build UI flows. **The thing that converts a "pretend" paywall into a real one is not more client code — it's the server-side enforcement points.** Keep that mental model when you're tempted to add more client-side checks. Don't. Add server-side ones.

### Why `mockUpgrade` must die

Right now, calling `mockUpgrade()` writes `tier: 'pro'` to localStorage. The gate then unlocks. **This is a feature of the dev tooling, not the product.**

When you delete it before production:
- Every test in dev that called `mockUpgrade()` breaks loudly.
- You'll be forced to wire each one through Stripe Checkout (sandbox mode) instead.
- That's a feature: it ensures your tests exercise the *real* unlock path, not a backdoor.

You could keep it behind `if (import.meta.env.DEV)` to be safe, but I'd rather delete it entirely. A dev-only setter that grants paid access is the kind of thing that gets accidentally exposed in a feature flag, an admin panel, a "secret URL parameter." Better to make it impossible.

---

## 9. The mental model in three sentences

1. **`tier` is a string on data and on users; `canAccess` is the only place that compares them.**
2. **`PaywallGate` is dumb plumbing — it asks `canAccess` and renders one of two things.**
3. **Everything you see today is UX rehearsal; the moment Pro content exists, the security story moves to Supabase RLS, not more React.**

---

## 10. What you can change without breaking anything

- Add `tier: 'pro'` to any unit/lesson/quiz. Refresh — it locks. Run `mockUpgrade()` in console — it unlocks.
- Restyle `UpgradeCard` freely. It's pure presentation.
- Add new tiers (e.g. `'pro-annual'`) by extending `canAccess`. Every gate inherits the new logic.

## What you should think twice about

- **Removing `tier` from a piece of content that users have already paid to access.** Their progress survives, but the gate disappears — which is fine for them but means *new* free users now have access too. Decide whether that's intentional.
- **Changing the localStorage key shape.** Any user with a saved tier loses it on the next load. If you must change it, write a one-time migration in `loadTier`.
- **Adding side effects inside `PaywallGate`.** It must remain pure rendering. Side effects in a gating layer lead to "why did this render fire an analytics event when the user is locked out" mysteries. Put analytics in the upgrade card, not the gate.
