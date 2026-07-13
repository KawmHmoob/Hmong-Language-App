# Words Section — Unified Vocabulary Hub

## What
The **Words** front door (`/words`): one screen that gathers everything
vocabulary — streak, XP, the SRS "due today" queue, a derived daily goal, quick
links to every drill style (tone drill, quizzes, category browsing, notebook) —
plus `/words/session`, the flashcard run over today's due words. The old `/review`
route redirects there; `src/pages/Review.jsx` is superseded (unrouted, safe to
delete).

## Why
- Vocab learning was scattered across four top-level pages (Vocabulary, Quiz,
  Review, Notebook) with no "what should I do right now?" answer. The hub gives one:
  **start today's session.**
- Duolingo's daily-loop psychology (streak + goal + celebratory finish) works — and
  every ingredient already existed in `ProgressContext`. This is a *presentation*
  unification: **zero context/data changes.**

## Files
- `src/pages/Words.jsx` — **new** hub (stats, goal bar, session CTA, drill tiles,
  category strip)
- `src/pages/WordsSession.jsx` — **new** session flow (reuses `Flashcard`)
- `src/App.jsx` — `/words`, `/words/session`; `/review` → redirect
- `src/pages/Review.jsx` — no longer routed (kept on disk for reference)

## Code anatomy

**The daily goal is derived, not stored.** The prompt was "show a daily goal," but
adding state to `ProgressContext` was off-limits. Both numbers fall out of
`vocabSchedule`, which SRS already maintains:

```js
// Words.jsx
const dueNow = selectDueWords(allWords, vocabSchedule).length            // due ≤ today
const reviewedToday = Object.values(vocabSchedule)
  .filter((s) => s.lastReviewedAt === todayISO()).length                 // done today

const goal = reviewedToday + dueNow            // today's total workload
const goalPct = goal === 0 ? 100 : Math.round((reviewedToday / goal) * 100)
```
Reviewing a word moves it from one bucket to the other, so the bar fills as you work
with **no new writes anywhere**. (Subtlety: a failed review re-dues a word tomorrow,
so `goal` can shift slightly mid-day — acceptable for a motivator.)

**The session reuses everything.** `WordsSession` is the old Review page's engine —
`selectDueWords` + `<Flashcard>` (which already writes `setVocabStatus` and
auto-advances) — with the queue **snapshotted at mount** (`useMemo` with `[]` deps)
so cards don't vanish mid-session as their schedules update. New: breadcrumbs into
the Words section and a celebratory `SessionEnd` card that shows the streak and
offers the tone drill as a bonus rep.

**Hub layout pattern** (reusable for future sections): eyebrow + serif hero →
`StatTile` row (`grid-cols-2 sm:grid-cols-4`) → one `surface-elevated` focal card
holding the primary CTA → `DrillTile` grid → category chips. `StatTile`/`DrillTile`
are local `function` declarations per house convention.

## How to extend
- **New drill type:** build the quiz/exercise where it belongs (quiz engine — see
  [01-quiz-engine.md](01-quiz-engine.md) and the backlog in
  [11-future-implementations.md](11-future-implementations.md)), then add a
  `DrillTile` pointing at it. The hub is a router, not an engine.
- **New exercise types inside the session** (typing, match pairs): extend the quiz
  engine's dataset adapters rather than growing `WordsSession` — keep the session a
  thin runner.
- **Real daily-goal setting** (user picks 10/20/50 XP): that DOES need a
  `ProgressContext` field; wire it there (see
  [03-progress-tracking.md](03-progress-tracking.md)) and swap the derived `goal`.

## Gotchas
- `todayISO()` is duplicated from `ProgressContext` (it's not exported). If a third
  copy ever appears, export it from the context instead.
- The stats row reads live context, but the session queue is a mount-time snapshot —
  finish a session and the hub's numbers update the moment you navigate back.
- Don't link `/review` in new code; it survives only as a redirect for old bookmarks.
