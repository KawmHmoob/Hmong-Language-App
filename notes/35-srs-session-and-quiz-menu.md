# The 391-Card Bug — fixing SRS session selection + the quiz menu

## What
Two fixes that finish the Words section:
1. **Session selection was broken.** A brand-new user saw *"391 words due today"*
   and "Start session" launched a 391-card marathon. Sessions are now **every due
   review + at most 10 new words**.
2. **The quiz menu was a wall.** 35+ quizzes (28 auto-generated vocab ones alone)
   in one flat grid. Now grouped by category, collapsed to 6 with "Show all", and
   each card shows your best score.

## Why — the bug, and the idea behind it
The old helper:
```js
export function selectDueWords(words, schedule) {
  return words.filter((w) => {
    const sched = schedule[w.id]
    return !sched || sched.dueDate <= today   // ← no schedule counts as "due"
  })
}
```
`!sched` means *"this word has never been studied."* Treating that as **due**
conflates two completely different states:

> **NEW** — never studied. Not due; just *available*. An unlimited backlog
> (391 words today, more as the dictionary grows).
> **DUE** — studied before, `dueDate` reached. The SRS actively wants it back.
> This is the only time-sensitive set, and it's naturally small.
> **WAITING** — studied, due in the future. Leave it alone.

Because NEW was counted as DUE:
- the hub advertised 391 due,
- the "daily goal" bar was `reviewed / (reviewed + 391)` — permanently ~0%,
- the session was the entire dictionary in one sitting.

**The principle:** in any spaced-repetition system, *reviews are demand-driven and
self-limiting; new material is supply-driven and infinite.* You must cap the
infinite one or the queue eats the user. Every SRS (Anki, Duolingo, SuperMemo)
has a "new cards/day" limit for exactly this reason. Ours is one constant:

```js
export const DAILY_NEW_LIMIT = 10
```

## How it works now
Three pure helpers in `ProgressContext.jsx` (pure = trivially testable, and they
port to RN untouched):
```js
selectReviewWords(words, schedule)          // studied && dueDate <= today
selectNewWords(words, schedule, limit = 10) // !schedule[id], capped, data order
selectSession(words, schedule, limit)       // { reviews, fresh, queue }
```
`selectSession` returns `queue = [...reviews, ...fresh]` — **reviews first,
deliberately**: they're the ones with a deadline, and a user who quits halfway
should have done the time-sensitive work. New words are the bonus at the end.

That ordering also gives the session UI a free trick — no per-card flag needed:
```js
const isNew = idx >= reviews.length   // reviews occupy the front of the queue
```
…which drives the **New / Review** badge on each card.

New words are taken in **data order, not shuffled** — `vocabulary.js` order is
curriculum order (animals before abstract nouns), so slicing gives a sensible
progression for free.

### Callers updated
`Words.jsx` (hub stats + goal), `WordsSession.jsx` (the queue), `Home.jsx`,
`TodayCard.jsx`. The hub now reports **"Reviews due"** and **"Words started
(12/391)"** rather than a fake due count, and the session line reads
*"3 reviews due · 10 new words"*.

`selectDueWords` was **deleted** once the last caller moved — a deprecated
helper that silently returns the whole dictionary is a trap, not a kindness. A
comment marks the grave so it doesn't get reinvented.

## The quiz menu
`vocabQuizzes` auto-generates one quiz per vocab category (28 of them), so the
flat grid was 35+ cards — the same clog that Learn had before
[33-unit-pages.md](33-unit-pages.md). Now:
- **Grouped by `category`** (Vocabulary / Alphabet / Grammar / Tones / Speak),
  built with a `Map` over `quizzes` — no new data, no config to maintain.
- **Collapsed to 6 per group** with "Show all N" / "Show fewer".
- **Best score per quiz** derived from `quizScores` (which already stores every
  attempt): reduce to max accuracy per `quizId`, render as a badge — green at
  ≥80%. The menu becomes a scoreboard, which is what makes a quiz list *pull*.
- Pro badges via `quiz.tier`, matching Learn/Speak.

Nothing was added to the progress model — `quizScores` had this data all along,
nothing was reading it.

## How to extend
- **Change daily workload:** `DAILY_NEW_LIMIT` in `ProgressContext.jsx`. This is
  the one dial. A user-facing setting would go in `Settings` and need a real
  ProgressContext field — the constant is deliberately the cheap version.
- **New vocab category:** `vocabulary.js` → a quiz auto-appears in the menu's
  Vocabulary group, and its words enter the new-word pool. Zero code.
- **Preview size:** `PREVIEW_COUNT` in `QuizMenu.jsx` (6).

## Gotchas
- The session queue is a **mount-time snapshot** (`useMemo` with `[]`), so
  finishing a card doesn't reshuffle mid-session. The hub's numbers update when
  you navigate back — that's intended, not a stale read.
- `DAILY_NEW_LIMIT` caps **per session**, not per day: finish a session and start
  another and you'll get 10 more new words. A true per-day cap needs a
  `newIntroducedOn` field in the schedule. Fine for now — enthusiasm isn't a bug.
- With 391 words and 10/day, the course is ~40 days of new material. That's a
  *content* pacing question worth revisiting once audio lands.

## Files
- `src/context/ProgressContext.jsx` — `DAILY_NEW_LIMIT`, `selectReviewWords`,
  `selectNewWords`, `selectSession`; `selectDueWords` removed
- `src/pages/Words.jsx` — reviews/new split, honest stats, real goal
- `src/pages/WordsSession.jsx` — capped queue, New/Review badge
- `src/pages/Home.jsx`, `src/components/home/TodayCard.jsx` — same helper
- `src/components/quiz/QuizMenu.jsx` — grouped, collapsible, best scores
