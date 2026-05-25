# Spaced Repetition + Review + Today Card

These three features form one system: SRS schedules words, the Review page surfaces what's due, and the Today card on the home page tells you to do it.

## What
- **Spaced repetition (SRS)** — every vocab word now has a `dueDate` that advances as the user marks it "known". Failed words reset.
- **Review page** (`/review`) — pulls words whose `dueDate <= today` and runs them through the existing Flashcard component.
- **Today card** — a panel at the top of the home page suggesting what to do today: review due words, take an unfinished quiz, write a note.

## Files
- `src/context/ProgressContext.jsx` — added `vocabSchedule` to state, modified `setVocabStatus` to advance the schedule, exported `selectDueWords` helper
- `src/pages/Review.jsx` — `/review` route
- `src/components/home/TodayCard.jsx` — the panel
- `src/pages/Home.jsx` — mounts `<TodayCard />`
- `src/components/vocabulary/Flashcard.jsx` — gained an optional `onAdvance` prop for auto-progression

## Why this SRS algorithm

Used a **Leitner-box-style fixed interval ladder** (`[1, 3, 7, 14, 30, 90]` days) instead of the full SM-2 algorithm.

- **SM-2 needs an "ease factor" per card.** That's another piece of state per word, more knobs for the user (or you) to think about, and the ease updates require a difficulty rating per review (Again/Hard/Good/Easy), which is more friction for a casual heritage learner than "Mark Known/Learning."
- **Leitner is good enough for retention** at this scale. The intervals are well-known and produce solid results — Anki's "Easy" press is essentially just advancing a Leitner box.
- **Easy to audit and explain.** "If you mark it known, it'll come back in N days." A user can predict the system, which builds trust.

If you ever need finer-grained scheduling (different per-word difficulty, overdue penalty), upgrade to SM-2 — the data shape (`vocabSchedule[id]`) has room for an `ease` field.

## Code anatomy

### Schedule shape

```js
vocabSchedule: {
  'animals-dog': {
    intervalIdx: 2,                    // index into SRS_INTERVALS
    dueDate: '2026-05-14',             // YYYY-MM-DD
    lastReviewedAt: '2026-05-07',
  },
}
```

### Interval ladder

```js
const SRS_INTERVALS = [1, 3, 7, 14, 30, 90]   // days

function nextSchedule(prev, success) {
  const idx = prev?.intervalIdx ?? -1
  const newIdx = success
    ? Math.min(idx + 1, SRS_INTERVALS.length - 1)
    : 0
  const days = SRS_INTERVALS[newIdx]
  const due = new Date(Date.now() + days * 86400000).toISOString().slice(0, 10)
  return { intervalIdx: newIdx, dueDate: due, lastReviewedAt: todayISO() }
}
```

`success === true` advances one rung; `success === false` (i.e. user marked "learning") resets to the first rung. New words (no prior schedule) start at rung 0 → due tomorrow.

### Hooked into the existing mutator

`setVocabStatus` now updates both `vocabProgress` and `vocabSchedule` in the same state transition:

```js
const setVocabStatus = useCallback((wordId, status) => {
  setState((s) => ({
    ...s,
    vocabProgress: { ...s.vocabProgress, [wordId]: status },
    vocabSchedule: {
      ...s.vocabSchedule,
      [wordId]: nextSchedule(s.vocabSchedule[wordId], status === 'known'),
    },
    xp: s.xp + xpDelta,
    streakData: nextStreak(s.streakData, todayISO()),
  }))
}, [])
```

This means *every* vocab interaction — flashcard mark, detail-page mark, review session mark — feeds the SRS, with no separate "review API" needed.

### Selecting due words

A pure helper exported from the same file:

```js
export function selectDueWords(words, schedule) {
  const today = todayISO()
  return words.filter((w) => {
    const sched = schedule[w.id]
    return !sched || sched.dueDate <= today
  })
}
```

Called from both `Review.jsx` (to build the queue) and `TodayCard.jsx` (to count). Pure function — easy to unit test later.

### The Review page guards against churn

```jsx
const dueWords = useMemo(() => {
  const allWords = categories.flatMap((c) => c.words)
  return selectDueWords(allWords, vocabSchedule)
}, [])  // intentionally empty — snapshot at mount
```

The empty deps array is deliberate. If `vocabSchedule` were a dep, marking a word "known" mid-session would reschedule it (to ~1 day out) and *remove it from the queue immediately* — the user's progress bar would jump and the next card would surface unpredictably. Snapshotting at mount means the queue stays stable for the session.

ESLint will complain about the empty deps; the `// eslint-disable-next-line` comment in the file documents the intent.

### Auto-advance after marking

The Flashcard component now accepts an optional callback:

```jsx
const mark = (next) => {
  setVocabStatus(word.id, next)
  if (onAdvance) setTimeout(onAdvance, 250)
}
```

The 250ms delay lets the user see the visual feedback (the button briefly highlights as "selected") before the card flips to the next word. In `VocabList`'s study mode, no `onAdvance` is passed → marking is a no-op for navigation. In `Review`, passing `onAdvance` makes the session flow.

### Today card logic

```jsx
const dueCount = selectDueWords(allWords, vocabSchedule).length

const today = new Date().toISOString().slice(0, 10)
const doneTodayQuizIds = new Set(
  quizScores.filter(s => s.date.slice(0, 10) === today).map(s => s.quizId)
)
const suggestedQuiz = quizzes.find(q => !doneTodayQuizIds.has(q.id))
```

Two derivations from existing context state — no extra storage needed. The card always shows the Notebook suggestion as a fallback so it's never empty.

## How to extend

### Add a different review mode (e.g. "Cram" — all words, ignore schedule)

In `Review.jsx`, add a `mode` URL param:

```jsx
// route: /review?mode=cram
const params = new URLSearchParams(useLocation().search)
const cramMode = params.get('mode') === 'cram'

const dueWords = useMemo(() => {
  const allWords = categories.flatMap(c => c.words)
  return cramMode ? allWords : selectDueWords(allWords, vocabSchedule)
}, [])
```

Then add a "Cram all words" link from the Vocabulary page.

### Change the interval ladder

Edit `SRS_INTERVALS` at the top of `ProgressContext.jsx`. Existing schedules continue to work — `intervalIdx` is just an index, so changing `[1, 3, 7]` to `[1, 4, 10]` reschedules everyone forward without data migration.

### Add a "due soon" count to the navbar

Read `vocabSchedule` from `useProgress()` in any component, run `selectDueWords`, render the count. The NotebookContext-style provider is already in place — just plug in.
