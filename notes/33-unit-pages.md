# Unit Pages — Learn split into a hub + per-unit pages

## What
`/learn` was one long scroll of every unit with every lesson (15 cards and
growing). Now it's a **hub**: each unit shows its **first two lessons** plus a
"See all N lessons" button into that unit's **own page** at `/learn/:unitId`
(e.g. `/learn/foundations`), which lists the unit in full with its own progress
bar and a Start/Continue button.

## Why
- **The hub's job is orientation, not delivery.** Fifteen equal cards answered
  "what exists?" but not "where am I / what's next?" — and it got worse with every
  lesson added. Two previews + a count is a constant-size answer.
- **A unit is the natural unit of work.** You don't do one lesson from Foundations
  and one from Numbers — you work through a unit. It deserves an address you can
  bookmark and return to.
- URLs now mirror the data model exactly: `units → lessons → steps` becomes
  `/learn → /learn/:unitId → /learn/:unitId/:lessonId`.

## How it works

### The card was extracted first (do this before splitting a page)
Both surfaces render lesson tiles, so `LessonCard` moved to
`src/components/learn/LessonCard.jsx` **before** the split — otherwise the tile
would exist twice and drift. It reads its own progress/tier state from hooks, so
callers pass only `{ unit, lesson }`:

```jsx
<LessonCard unit={unit} lesson={lesson} />   // hub AND unit page
```
That's the general move: *when a page splits in two, extract the shared piece
first, then split.* Reverse that order and you copy-paste.

### The route (and why order doesn't actually matter)
```jsx
<Route path="/learn"                   element={<Learn />} />
<Route path="/learn/:unitId"           element={<Unit />} />
<Route path="/learn/:unitId/:lessonId" element={<Lesson />} />
```
React Router v6+ **ranks by specificity, not file order** — `/learn/foundations/
foundations-pronouns` matches the two-param route regardless of which is listed
first. (In v5 order mattered and you'd need `exact`.) They're kept adjacent and
ordered anyway, because relying on invisible ranking rules is how the next person
gets confused.

### Derived state, again
Nothing new is stored. The hub's "3 / 10 done" and the unit page's bar both come
from counting `lessonProgress(l, completedSteps).complete` over the unit's
lessons — same derive-don't-store rule as the Words daily goal
([23-words-section.md](23-words-section.md)).

The unit page's **Start/Continue** button is the first lesson where
`.complete === false`:
```js
const next = unit.lessons.find((l) => !lessonProgress(l, completedSteps).complete)
```
Order in the data file = teaching order, so "first incomplete" is the right
target. Label flips to "Start unit" when nothing's done, and the button hides
entirely when the unit is finished (no `next`).

### Navigation follow-through
Two things had to change or the new page would be a dead end:
- Lesson breadcrumb: `unit.title` linked to `/learn` → now `/learn/:unitId`.
- Finishing a lesson used to dump you at the hub → now returns to the **unit**,
  where the next lesson is one tap away.

That's the real lesson here: **adding a page is never just adding a page.** Every
route that pointed "up" has a better target now.

## How to extend
- **Preview count:** `PREVIEW_COUNT` at the top of `Learn.jsx` (2). Raise it only
  if units get short; the point is a constant-size hub.
- **New unit:** add it to `units` in `src/data/lessons.js` — hub section, page,
  route, and progress all work with zero code changes.
- **Restyle a lesson tile:** `LessonCard.jsx`, one place, both surfaces.
- **Per-unit metadata** (an icon, a cover, an estimated time): add the field to
  the unit object in `lessons.js` and render it in `Unit.jsx`'s header.

## Gotchas
- `/learn/:unitId` with a bad id renders "Unit not found" rather than a crash —
  `getUnit()` returns null and the page guards it, same pattern as `Lesson.jsx`.
- The hub's "See all" only appears when `rest > 0` — a unit with ≤2 lessons shows
  everything already and doesn't need it.

## Files
- `src/components/learn/LessonCard.jsx` — **new**, extracted shared tile
- `src/pages/Unit.jsx` — **new**, `/learn/:unitId`
- `src/pages/Learn.jsx` — hub: previews + See all + per-unit counts
- `src/App.jsx` — `/learn/:unitId` route
- `src/pages/Lesson.jsx` — breadcrumb + finish target now the unit
