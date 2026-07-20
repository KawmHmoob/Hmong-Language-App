# Season Points, Levels, Leaderboard & Battle Pass

## What
The gamification layer, in four pieces:

| Piece | Where | Real or placeholder |
|---|---|---|
| Leveling + season points | `src/lib/leveling.js` | **real** — points accrue and levels compute |
| Earning + daily cap | `ProgressContext` | **real** |
| Leaderboard `/leaderboard` | `src/pages/Leaderboard.jsx` | your row real, rivals placeholder |
| Battle pass `/pass` | `src/pages/BattlePass.jsx` | levels real, **all 50 rewards placeholder** |

## Two currencies, on purpose
```js
xp            // lifetime, never resets  — "how far have I come"
seasonPoints  // resets each season      — the pass + leaderboard number
```

Collapsing them into one would force a bad choice: either your lifetime total
resets every season (demoralizing, and destroys the only long-term record of
someone's work), or the pass runs on a number that only ever grows and every
new season starts everybody at level 50. They measure different things, so they
are different fields.

## Points are awarded by NAME, never by number
```js
awardPoints('speak-contribution')   // ✅
xp: s.xp + 15                        // ❌ what is 15? who else grants 15?
```

Every value lives in one table:

```js
export const POINT_SOURCES = {
  'quiz-complete':       { points: 5,  capped: true },
  'speak-contribution':  { points: 15, capped: false },
  // …
}
```

Rebalancing is then a one-file edit, and **"what can a user actually farm?"** is
a question with a readable answer. Magic numbers scattered across pages make an
economy that nobody can audit — including for abuse.

## The cap, and what deliberately has none
`DAILY_CAP = 250` applies to **study actions** — lessons, quizzes, words. Those
are finite, repeatable, and trivially farmable, and grinding them past a point
isn't learning.

**Voice contributions are uncapped.** Every clip has real marginal value to the
corpus, so there is no honest reason to tell someone to stop. It's also the
behavior most worth incentivising:

```js
if (!src.capped) return { points: src.points, capped: false, clamped: false }
const room = Math.max(0, DAILY_CAP - cappedEarnedToday)
return { points: Math.min(src.points, room), capped: true, clamped: ... }
```

Tuning check (`scripts/content/levels.mjs`): **77 days** to hit level 50 on
capped points alone, against an **84-day season**. So a committed learner just
makes it, and recording is what buys slack. That ratio is the whole balance
lever — if the season gets shorter, the cap or the curve has to move with it.

### Anti-farm guards
- `word-known` pays **only on the first** transition to known — the same
  condition that guards the xp delta. Otherwise toggling a flashcard
  known→learning→known is an infinite point tap.
- Chained awards pass the **updated** state, not the original:
  ```js
  if (entry?.accuracy === 100) Object.assign(next, earn(next, 'quiz-perfect'))
  ```
  Passing `s` would let a perfect quiz spend the cap twice.
- `speak-attempt` is deliberately **not** guarded by `done` — re-recording a
  phrase is a genuinely new clip.

## Rollovers are lazy, not scheduled
Season / day / week rollovers are checked **on the next earn**, never on a timer:

```js
const freshSeason = state.seasonId !== SEASON.id
const daily = state.dailyEarned?.date === today ? state.dailyEarned : { date: today, capped: 0 }
```

There's no server, so nothing *can* run at midnight — and a client-side timer
would be wrong the moment the tab is closed (which is most of the time). Lazy
also means someone returning after a month gets a correct allowance instantly,
with no catch-up loop.

`dailyEarned` stores `{date, capped}` rather than a history, because the cap only
ever asks about today. An append-only ledger would grow forever inside a single
JSON blob that gets rewritten on every save.

## Why there is no `/leaderboard/:userId`
The user asked for no profile routes, and it's worth writing down *why* that's
right rather than just "not built yet": **a leaderboard that opens into profiles
turns a study app into a place strangers can be followed around.** Nobody on
that list agreed to be browsable. Names and totals is the whole surface, and
adding drill-through later should be a consent decision, not a routing one.

Rows are ranked with a **stable tiebreak**:
```js
rows.sort((a, b) => (b[key] || 0) - (a[key] || 0) || a.name.localeCompare(b.name))
```
Without the name fallback, equal scores can swap between renders and the board
looks broken.

The rivals are **fixed data, not random**. A randomized roster re-rolls on every
render, which makes layout bugs unreproducible and makes the ranking look like
it's lying every time you refresh.

## The rewards are fake, and say so
Every tier is `placeholder: true`, and **every business named is invented**
(Toj Siab Noodle Bar, Paj Ntaub Threads, …). This was a deliberate choice over
using recognizable brands: a mockup offering "20% off at <real chain>" becomes a
screenshot that reads as a genuine promotion from a company that never agreed to
anything. Invented names show the same layout and carry none of that.

The page states it in plain language at the bottom rather than burying it in a
comment. When real partners sign, swap `brand` and set `placeholder: false`.

## Header placement
The season layer is reachable from the header: a **`LevelBadge`** ("Lv 4",
links to `/pass`) plus two `IconLink`s — `TiersIcon` → `/pass`,
`TrophyIcon` → `/leaderboard`. Both icons were added to the shared set in
`components/icons/` following the rules in notes/31; no emoji as chrome.

`LevelBadge` is a **link** while `XPBadge`/`StreakBadge` stay inert text. A
level implies a track to look at — showing "Lv 4" with no way to ask "of what?"
is the dead-end number that makes gamification feel bolted on.

### The one subtle bit: `hidden sm:inline-flex`
The header is width-critical on phones, so `XPBadge` hides below `sm`. It takes
a `className` prop to do it, which puts `hidden` and the component's own
`inline-flex` on the same element — **a conflict CSS resolves by stylesheet
order, not by the order they appear in the class string.** Verified against the
built CSS rather than assumed:

```
.inline-flex      @ 17546
.hidden           @ 17619   → wins below sm  ✅
.sm\:inline-flex  @ 37035   → wins at ≥640px ✅
```

Tailwind emits `hidden` after the other display utilities, and all `sm:` rules
after the base layer, so it lands correctly — but that's a property of Tailwind's
output order. **If you ever write `hidden` alongside a base display utility,
check the compiled CSS**; class-string order tells you nothing.

Nothing was removed to make room — xp and streak both still show on Home.

## The horizontal track
The 50 tiers render as a **horizontally scrolling row of cards**, not a vertical
list. A battle pass is a *road* — the point is seeing how far the track runs and
where you are on it. Fifty stacked rows communicate "spreadsheet."

```jsx
<ol className="flex gap-4 overflow-x-auto px-5 py-4 snap-x snap-mandatory">
```

Three details that matter:
- **`snap-x snap-mandatory`** + `snap-center` on each card — dragging settles on
  a tier instead of stopping mid-card.
- **Full-bleed** via `-mx-5 sm:-mx-8 lg:mx-0`. A track that stops at the content
  gutter reads as truncated; it should run off the edge.
- **Auto-scroll to your tier** uses `{ inline: 'center', block: 'nearest' }`.
  Without `block: 'nearest'`, `scrollIntoView` also yanks the *page* vertically
  to the track — landing you past the header you just rendered.

`TierCard` takes the ref as a plain `cardRef` prop rather than `forwardRef`.
It's an internal component with one caller, so the indirection buys nothing.

## Guests keep their points
Registering adopts guest progress onto the new account — that already existed
(notes/36), but its "did this guest do anything?" check predated season points:

```js
const touched = parsed && (parsed.xp > 0 ||
  parsed.seasonPoints > 0 ||            // ← added
  parsed.completedSteps?.length > 0 || …)
```

Season points normally arrive alongside xp, so this rarely fires — but the
uncapped speak sources can award them on paths that don't, and **a guest must
not lose points because this list forgot a field.** Any new earnable field needs
a line here; that's the cost of a whitelist.

### The copy has to match the code
The notice says *create* an account, never "sign in." Adoption only happens onto
an **empty** account — logging into an existing one keeps that account's history
and leaves guest points behind, deliberately, so a borrowed device can't
overwrite someone's real progress. The banner offers a Log in link too, so it
spells the difference out rather than letting "sign up or log in" imply both
carry your points. **Don't write UI copy that promises something the code
doesn't do**, even when the happy path makes it look true.

## Going live (what's still fake)
1. **Leaderboard backend** — a `season_points` table, ranked server-side. Never
   trust a client-reported total; points must be awarded by a server that sees
   the underlying event, or the board is a self-reported honor system.
2. **Reward granting** — nothing is actually granted. Themes/streak-freezes need
   an inventory model.
3. **Season rollover** — `SEASON` is a hardcoded constant; real seasons need a
   table and an archive of final standings.
4. **Consent for voice data** — the uncapped source exists to encourage
   recording, and the corpus plan in
   `notes/future-implementations/01-pronunciation-dataset.md` carries the
   consent requirement. Incentivising contribution raises the bar on disclosure,
   it doesn't lower it: people should know what their clips are for *before* the
   points make them want to record more.

## How to extend
- **New earning action:** add to `POINT_SOURCES`, then call
  `awardPoints('<id>')`. Don't add a number anywhere else.
- **Rebalance:** `BASE` / `GROWTH` / `DAILY_CAP`, then re-run
  `node scripts/content/levels.mjs` — it asserts level boundaries, clamping,
  progress bounds, and cap behavior.
- **More tiers:** `MAX_LEVEL` and the `tiers` array must stay in sync; a tier
  above `MAX_LEVEL` is unreachable and renders as permanently locked.

## Files
- `src/lib/leveling.js` — curve, sources, cap, season helpers
- `src/data/battlepass.js` — 50 tiers
- `src/data/leaderboard.js` — placeholder roster + `buildBoard`
- `src/pages/{Leaderboard,BattlePass}.jsx`
- `src/context/ProgressContext.jsx` — `earn()`, `awardPoints`, season state
- `src/pages/Home.jsx` — `SeasonStrip`
- `src/pages/SpeakPhrase.jsx` — the uncapped award
- `scripts/content/levels.mjs` — the math checks
