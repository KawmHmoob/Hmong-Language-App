# Paywall & Supabase scaffold

Placeholder layer for monetization. Nothing is *enforced* yet — this scaffold sets up the boundaries so wiring real billing later is a small, localized change.

Companion to [../instructions/supabase-integration.md](../instructions/supabase-integration.md) (auth + progress migration plan, written earlier).

## What's here today

| File | Role |
|---|---|
| [src/lib/supabase.js](../src/lib/supabase.js) | Stub Supabase client. Every call returns a `{ data: null, error }` shape so callers can be written today and Just Work when the real SDK is installed. |
| [src/context/SubscriptionContext.jsx](../src/context/SubscriptionContext.jsx) | `{ tier, isPro, mockUpgrade, mockDowngrade }`. Tier is persisted to localStorage per user. `mockUpgrade` flips you to `'pro'` for dev. |
| [src/components/common/PaywallGate.jsx](../src/components/common/PaywallGate.jsx) | Wrapper. If the content tier isn't accessible, renders an upgrade card instead of children. |
| [.env.example](../.env.example) | Template for `.env.local` (gitignored via `*.local`). |

Wiring already in place:

- `SubscriptionProvider` mounted in [src/App.jsx](../src/App.jsx) between `AuthProvider` and `ProgressProvider`.
- `<PaywallGate>` wraps the main render in [src/pages/Lesson.jsx](../src/pages/Lesson.jsx) and [src/components/quiz/QuizEngine.jsx](../src/components/quiz/QuizEngine.jsx).
- [src/pages/Learn.jsx](../src/pages/Learn.jsx) shows a "◆ Pro" badge on locked lessons in the grid.

## Data shape: the `tier` field

Optional `tier: 'free' | 'pro'` on a Unit, Lesson, or Quiz. Omit it and it's free.

- **Unit-level**: gates every lesson in the unit by default.
- **Lesson-level**: overrides the unit's tier for that one lesson. Useful for "first lesson of a Pro unit is a free teaser."
- **Quiz-level**: independent of lessons. A standalone quiz in `/quiz/:id` can be Pro even if it's not linked from a lesson.

Resolution logic (in `Lesson.jsx`):
```js
const requiredTier = lesson.tier || unit.tier || 'free'
```

## How a gate decides

```js
canAccess(contentTier, userTier)
  // 'free' content → always true
  // 'pro' content  → userTier === 'pro'
```

`PaywallGate` calls this. If access is denied, it renders `<UpgradeCard />`. If allowed, it renders `children`. That's it.

## Trust model — read this before shipping

**Client-side gates are UX, not security.** Right now all your lesson and quiz content is in static JS files compiled into the browser bundle. Anyone with devtools can read the entire content tree regardless of `tier` value. The gate just *hides* it from the casual user.

Real enforcement happens when locked content moves server-side:

1. Locked quiz/lesson data lives in Supabase tables, not in `src/data/`.
2. Row-level security (RLS) policies check the user's subscription tier *before* returning rows.
3. Stripe webhook (server-side, never client) is the only writer to the `subscriptions` table.

Until then, treat the paywall as "honor system + UX nudge." For an MVP launch with mostly free content, that's defensible. The moment you have meaningful Pro-only content, prioritize moving it server-side.

## Toggling tiers in dev

Open the browser console and run:
```js
// pretend you're a pro subscriber
JSON.parse(localStorage.getItem('kawmhmoob.subscription.guest') || '{}')
localStorage.setItem('kawmhmoob.subscription.guest', JSON.stringify({ tier: 'pro' }))
// then refresh
```

Or call `mockUpgrade()` / `mockDowngrade()` from any component that has `useSubscription()`. We haven't wired a UI toggle in Settings yet — add one when you start QA'ing paywall flows.

## Path to real Supabase + Stripe

When you're ready to enforce, work the list in this order. Each step is independently shippable.

### 1. Stand up Supabase
- `npm install @supabase/supabase-js`.
- Uncomment the `createClient` block in [src/lib/supabase.js](../src/lib/supabase.js) and delete the stub.
- Run the SQL from [../instructions/supabase-integration.md](../instructions/supabase-integration.md) (`profiles`, `progress` tables + RLS).

### 2. Add the `subscriptions` table

```sql
create table subscriptions (
  user_id uuid primary key references auth.users on delete cascade,
  tier text not null default 'free' check (tier in ('free','pro')),
  expires_at timestamptz,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  updated_at timestamptz default now()
);

alter table subscriptions enable row level security;

-- Users can read their own row. They CANNOT write — only the service role can,
-- and only the Stripe webhook handler uses the service role.
create policy "self read subscriptions"
  on subscriptions for select using (auth.uid() = user_id);
```

### 3. Rewrite `SubscriptionContext` to read from Supabase

Replace `loadTier` / `saveTier`:
```js
async function loadTier(userId) {
  if (userId === 'guest') return { ...FREE }
  const { data } = await supabase
    .from('subscriptions')
    .select('tier, expires_at')
    .eq('user_id', userId)
    .single()
  if (!data) return { ...FREE }
  if (data.expires_at && new Date(data.expires_at) < new Date()) return { ...FREE }
  return { tier: data.tier, expiresAt: data.expires_at }
}
```

Drop `saveTier` entirely — the client never writes. Drop `mockUpgrade`/`mockDowngrade` from the production build (keep them behind `import.meta.env.DEV` if useful).

### 4. Wire Stripe Checkout
- Add a `/api/checkout-session` serverless endpoint (Vercel function or Supabase Edge Function). It creates a Stripe Checkout Session and returns the URL.
- "See plans" button on `<UpgradeCard />` → posts to that endpoint → redirects to Stripe-hosted checkout.

### 5. Wire the Stripe webhook
- Endpoint receives `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`.
- Uses the service role key (server-only) to upsert into `subscriptions`.
- After this exists, `loadTier` returns truthful data and the gate is real.

### 6. Move locked content server-side
- The hardest step and the one that makes the paywall actually enforced.
- Migrate locked lessons/quizzes from `src/data/` into Supabase tables.
- RLS policy: free content readable by anyone authed; pro content readable only if a row in `subscriptions` shows `tier = 'pro'`.
- Client fetches via the supabase client. The lesson/quiz UI doesn't need to change much because the tier-gating layer is already in place.

## Open questions to decide before step 4

- **Pricing model.** One tier (Pro) or multiple? Annual vs monthly? Free trial?
- **Lifetime vs subscription.** Do you ever sell perpetual access? If so the schema needs a `lifetime` boolean.
- **Refunds / cancellations.** Stripe webhook handles the state change; just decide whether you grace-end at period boundary or revoke immediately.
- **Localization.** If you launch in Hmong diaspora regions, Stripe Tax / multi-currency matters.

These are billing-product decisions, not engineering ones. Don't let the scaffold drive them — decide pricing first, encode it second.

## What NOT to do

- **Don't put the Stripe secret key in `.env`.** Only the publishable key is client-safe. The secret key and webhook secret live on the server / serverless function only.
- **Don't grant Pro tier from the client.** `mockUpgrade` only exists for dev. The production `SubscriptionContext` should have no setter at all.
- **Don't check `isPro` in the same expression as a feature flag.** Gating logic should always go through `canAccess(contentTier, userTier)` so the rules are in one place.
