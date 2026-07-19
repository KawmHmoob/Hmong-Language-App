# Study-Before-Quiz Gate (standalone quizzes)

## What
A category quiz (`vocab-<categoryId>`) is now **locked until half that
category has been studied**. The Quiz menu shows a *"Study first"* card with the
exact number of words remaining, and the quiz page itself enforces it.

Alphabet, tone, and grammar quizzes are **not** gated — they have no word set to
study.

## Why
The in-lesson quiz already gated on the Study handoff (notes/37), but the
**standalone** quizzes in the Quiz menu didn't. A learner could open
`vocab-relatives` having never seen a single relative term.

> Testing words you've never seen isn't assessment — it's guessing, and the
> score it produces is noise in your own progress data.

## "Studied" is derived, not stored
No new state. A word has a `vocabProgress` entry the moment it's marked
Learning/Known on a flashcard, so the gate reads what already exists:

```js
export const QUIZ_UNLOCK_RATIO = 0.5

export function quizUnlock(quizId, vocabProgress = {}) {
  const open = { gated: false, unlocked: true }
  if (!quizId?.startsWith('vocab-')) return open          // not a word quiz

  const category = getCategory(quizId.slice('vocab-'.length))
  if (!category || category.words.length === 0) return open  // nothing to study

  const studied = category.words.filter((w) => vocabProgress[w.id]).length
  const needed = Math.ceil(category.words.length * QUIZ_UNLOCK_RATIO)
  return { gated: true, unlocked: studied >= needed, studied, needed,
           remaining: Math.max(0, needed - studied), category }
}
```

Two deliberate escape hatches so the gate can't strand anyone:
- **Non-`vocab-` quizzes return open** — the gate only applies where "study the
  words" is a coherent instruction.
- **Empty categories return open** — a 0-word category could never reach its
  threshold, so gating it would lock the quiz permanently.

`QUIZ_UNLOCK_RATIO` is one constant. 50% of 18 animals = study 9. Raise it for a
stricter course, lower it if it feels like a grind.

## Both layers, because the menu isn't security
- **Quiz menu** — locked card, dimmed, badged *"Study first"*, footer reads
  *"Study N more words to unlock →"*.
- **QuizEngine** — a guard that renders the same message with a study link.

The menu card is the *signpost*; the engine guard is the *gate*. Without the
guard, a bookmark or typed URL walks straight past the menu. **Anywhere a UI
hides an action, the destination still has to enforce it** — same reason
`AccountGate` wraps the page and not just the link (notes/36).

## The lock still points forward
A locked card **is still a link — to the word bank**, not a dead end, and it
names the exact number of words left. The engine guard does the same. A lock
that only says "no" makes the app feel broken; a lock that says "here's the way
through, 9 words left" reads as structure.

## How to extend
- **Change strictness:** `QUIZ_UNLOCK_RATIO` in `src/lib/access.js`.
- **Gate a non-vocab quiz:** it needs its own notion of "studied" — add a branch
  to `quizUnlock` rather than forcing it into the category shape.
- **Turn it off for testing:** there's no switch for this one (unlike
  `PAYWALL_ENABLED` / `GUEST_GATING_ENABLED`) — it's pedagogy, not monetization.
  Set the ratio to `0` if it's in the way.

## Files
- `src/lib/access.js` — `QUIZ_UNLOCK_RATIO`, `quizUnlock()`
- `src/pages/QuizMenu.jsx` — locked card state + remaining count
- `src/pages/QuizEngine.jsx` — the enforcing guard
