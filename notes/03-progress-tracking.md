# Progress Tracking

## What
A single context that owns: completed lesson IDs, quiz score history, vocab status per word, **vocab review schedule (SRS)**, current streak, and total XP. All persisted to `localStorage` per-user (guest progress is separate from logged-in progress).

## Files
- `src/context/ProgressContext.jsx` — provider, state, mutators, and a pure `selectDueWords` helper
- `src/hooks/useProgress.js` — thin alias over `useProgressContext`
- `src/components/progress/ProgressBar.jsx` — generic value/max bar
- `src/components/progress/XPBadge.jsx` — pill in navbar
- `src/components/progress/StreakBadge.jsx` — pill in navbar

## Why
- **Per-user partitioning** — the localStorage key is `kawmhmoob.progress.<userId>` (or `…guest`). When the user logs in, the provider re-loads from the new key, so guest progress is preserved on the device but doesn't leak into the account view.
- **One context, not five** — XP/streak/lessons/quizzes/vocab/schedule are tightly coupled (every action touches at least streak + xp), so splitting would mean cross-context coordination. A single state object is simpler.
- **Plain mutators, not events** — `markLessonComplete`, `recordQuizScore`, `setVocabStatus` are explicit functions instead of a generic `dispatch`. Easier to grep, easier to mock for a future backend.
- **Mark Complete button (not IntersectionObserver)** — chose the explicit button per spec because scroll-based completion can fire spuriously (auto-scroll restoration, anchor jumps) and is hard to undo.
- **SRS folded into `setVocabStatus`** — see [09-spaced-repetition.md](09-spaced-repetition.md). One mutator, both flows benefit.

## Code anatomy

### State shape

```js
const initialState = {
  completedLessons: [],            // ['alphabet-consonants', 'course-grammar', ...]
  completedSteps: [],              // step ids from src/data/lessons.js (see 12-lesson-system.md)
  quizScores: [],                  // [{ quizId, score, maxScore, accuracy, date }, ...]
  vocabProgress: {},               // { 'animals-dog': 'known' | 'learning' | 'new' }
  vocabSchedule: {},               // { 'animals-dog': { intervalIdx, dueDate, lastReviewedAt } }
  streakData: { currentStreak: 0, lastActiveDate: null },
  xp: 0,
}
```

### Persistence pattern

Two effects in `ProgressProvider`:

```jsx
// Load when user changes
useEffect(() => {
  setState(loadProgress(userId))
}, [userId])

// Save whenever state or user changes
useEffect(() => {
  saveProgress(userId, state)
}, [userId, state])
```

`loadProgress(userId)` reads from `localStorage.getItem('kawmhmoob.progress.' + userId)` and falls back to `initialState`. `saveProgress` is the inverse.

### Forward-compatible loading

```js
return { ...initialState, ...parsed }
```

This spread order means existing localStorage records that predate `vocabSchedule` automatically get an empty `{}` for it. Same trick for any new field — add it to `initialState` and existing users won't crash.

### Streak logic

```js
function nextStreak(prev, today) {
  const last = prev.lastActiveDate
  if (last === today) return prev          // already active today — no change
  if (!last) return { currentStreak: 1, lastActiveDate: today }
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
  if (last === yesterday) return { currentStreak: prev.currentStreak + 1, lastActiveDate: today }
  return { currentStreak: 1, lastActiveDate: today }   // gap → reset
}
```

Every mutator calls this:

```js
streakData: nextStreak(s.streakData, todayISO())
```

### SRS in setVocabStatus

```js
const setVocabStatus = useCallback((wordId, status) => {
  setState((s) => {
    const prev = s.vocabProgress[wordId]
    const xpDelta = status === 'known' && prev !== 'known' ? 1 : 0
    const success = status === 'known'
    return {
      ...s,
      vocabProgress: { ...s.vocabProgress, [wordId]: status },
      vocabSchedule: {
        ...s.vocabSchedule,
        [wordId]: nextSchedule(s.vocabSchedule[wordId], success),
      },
      xp: s.xp + xpDelta,
      streakData: nextStreak(s.streakData, todayISO()),
    }
  })
}, [])
```

`nextSchedule` (defined in the same file) advances or resets the interval index. See [09-spaced-repetition.md](09-spaced-repetition.md) for the algorithm.

### selectDueWords helper

Pure function exported alongside the provider:

```js
export function selectDueWords(words, schedule) {
  const today = todayISO()
  return words.filter((w) => {
    const sched = schedule[w.id]
    return !sched || sched.dueDate <= today
  })
}
```

Used by `Review.jsx` and `TodayCard.jsx`. Exported from the context module rather than a separate utils file because it's intimately coupled to the schedule shape.

### Re-completion guard

```js
const markLessonComplete = useCallback((lessonId) => {
  setState((s) => {
    if (s.completedLessons.includes(lessonId)) return s   // no-op if already done
    return {
      ...s,
      completedLessons: [...s.completedLessons, lessonId],
      xp: s.xp + 10,
      streakData: nextStreak(s.streakData, todayISO()),
    }
  })
}, [])
```

Same idea for `setVocabStatus` — the +1 XP only fires the first time a word transitions to `known`.

## Reading progress in any component

```jsx
import { useProgress } from '../hooks/useProgress.js'

function MyComponent() {
  const {
    xp, streakData, vocabProgress, vocabSchedule, completedLessons, quizScores,
    markLessonComplete, recordQuizScore, setVocabStatus, exportData,
  } = useProgress()
}
```

Everything is spread together — no `state.xp` versus `actions.markLessonComplete` split.

## Adding a new XP source

Say you add a "complete a reading" action that should award +3 XP.

1. Add a mutator in `ProgressContext.jsx`:
   ```js
   const completeReading = useCallback((readingId) => {
     setState((s) => {
       if (s.completedReadings?.includes(readingId)) return s
       return {
         ...s,
         completedReadings: [...(s.completedReadings || []), readingId],
         xp: s.xp + 3,
         streakData: nextStreak(s.streakData, todayISO()),
       }
     })
   }, [])
   ```
2. Add `completeReading` to the `value` memo at the bottom of the provider.
3. Add `completedReadings: []` to `initialState` so the field exists for new users.
4. Use it: `const { completeReading } = useProgress()`.

## Migrating to a backend

The `loadProgress` / `saveProgress` functions are the only side-effect surface. Swap them for `await api.fetchProgress(userId)` / `await api.saveProgress(userId, state)` and add a debounce on the save side. See [instructions/supabase-integration.md](../instructions/supabase-integration.md) for the full walkthrough.
