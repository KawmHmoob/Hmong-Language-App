# The Time Lesson, Phrase Families & the ID Guard

## What
`time-explained` (Numbers & Time) is registered and ends on a **speaking**
check rather than a multiple-choice one:

```
intro → examples (the clock words) → speak-drill → quiz (word bank)
```

The drill is a new **phrase family**, `family-time-clock`, and it shows up on
the Speak page automatically — that page renders every entry in `wordFamilies`.

## Two bugs the new lesson shipped with
Neither is a build error. Both would have silently corrupted progress.

### 1. Colliding export name
`time-explained.js` exported `const time` — exactly what `time.js` already
exports. The moment `lessons.js` imports both, one shadows the other. Renamed to
`timeExplained`.

### 2. Copied step ids
Its steps were `numbers-time-examples` and `numbers-time-quiz` — **copied from
`time.js`**. Step ids are progress keys:

> Finishing "examples" in one lesson would have marked "examples" complete in
> the other, and the study→quiz gate would unlock the wrong quiz.

Renamed to `time-explained-*`. This is the same class as the duplicate
`timeframes` category (notes/56): an id collision that no tool was watching for.

Also fixed a **stray comma** in the intro `body` array — `['a', , 'b']` is a
sparse array with a hole, which renders as a blank paragraph.

## The ID guard
`scripts/content/ids.mjs` now checks what the app assumes but nothing enforced:

- duplicate `export const` names across lesson files
- duplicate lesson ids, **step ids**, category ids, word ids, family ids
- every `familyId:` in a `speak-drill` resolves to a real family

It caught a false positive on its first run — `pronouns.js` appeared to have two
`foundations-pronouns-quiz` steps, but one is inside a `/* … */` block from the
retired quick-checks (notes/37). Fixed by stripping block comments first:

```js
const strip = (src) => src.replace(/\/\*[\s\S]*?\*\//g, '')
```

**A checker that cries wolf gets ignored**, which makes it worse than no checker.
Comments are text; a scanner that reads source has to know the difference.

## Why a speaking drill, not a vocab quiz
Reading a clock is *recognition*. Saying one is *production*.

A learner can pick "6:30" off a list of four without being able to assemble
**"rau teev pebcaug sawv ntxov"** — number, then `teev`, then minutes, then the
a.m./p.m. tag, in that order, out loud. Multiple choice cannot test the thing
the lesson teaches. Same reasoning that replaced the alphabet mini-quizzes with
consonant drills (notes/50).

So the lesson keeps **both**: `speak-drill` for production, `quiz` for the word
meanings.

### `kind: 'phrase'`
A fourth family kind. The first three (`vowel`, `tone`, `consonant`) hold two
parts of the syllable steady and vary the third. A phrase family instead holds
a **sentence frame** steady and varies the slots:

```
pattern: '[number] teev [minutes] [sawv ntxov / tsaus ntuj]'
```

Phrase words carry no `consonant`/`vowel`/`tone` fields, and `SpeakFamily`
already guards its breakdown with `{w.vowel && …}` — so they render correctly
with no change to the page. That guard existed for bare consonants; it paid off
again here.

Ordered easiest → hardest: bare hour → hour+minutes → the `mus` variant → the
`thiab` construction → +a.m./p.m. → full sentence.

**Every phrase is lifted from the lesson's own body text.** No Hmong was
authored for the drill.

## Examples step: narrowed, not expanded
The step was carrying `Tag kis` (tomorrow) and `Nag hmo` (last night) — relative
*days*, which the `time` lesson already teaches. Replaced with the six words this
lesson actually builds a clock time from: **teev, feeb, lub teevsij, sawv ntxov,
tsaus ntuj, tav su**.

> A lesson's examples should be the pieces of the thing it explains, not
> everything adjacent to the topic.

## Lesson order: `timeExplained` before `time`
Numbers & Time now reads:

```
numbers → howMuch → timeExplained → time
```

`timeExplained` teaches the **pattern** — how to build a clock time out of
numbers you already have. `time` is the wider vocabulary set: relative days,
parts of the day, `nag hmo` / `tag kis`. That's reference-shaped material, and
it lands better once you know what you'd use it for.

The general rule this follows: **teach the thing you can do something with
first, then broaden.** A vocabulary list is easier to absorb when it's filling
in around a pattern you already understand than when it's the first thing you
meet.

### Order is not just presentation
`units[].lessons` order is read by more than the Learn page:

- **Guest gating** is positional — `lessonOrder()` in `lib/access.js` flattens
  every unit's lessons and opens the first `GUEST_LESSON_LIMIT`. Reordering
  changes *which* lessons a guest can open. (Harmless today,
  `GUEST_GATING_ENABLED` is `false`, but it will matter at release.)
- **`selectNewWords`** assumes data order is teaching order.

Reordering is safe here because nothing keys off position *within* the unit —
but "just moving a card" isn't automatically true in this codebase. Lesson
**ids** are the progress keys, and those didn't change, so no progress was lost.

## Open: time-word orthography (needs a native speaker)
Three lesson↔word-bank disagreements, all the same question — how these are
spelled and segmented. `gap.mjs` reports them; none is safe to resolve by
pattern-matching:

| Lesson | Word bank | |
|---|---|---|
| `Lub teevsij` | `teev sij` | one word or two; with or without the classifier |
| `Tav su tag` | `tav su dua` | which form means "afternoon" |
| `Yav tsaus ntuj` | `tsaus ntuj` | whether `yav` is part of the term |

Picking one silently would either invent a distinction or erase a real one.
Belongs with the TODO-VERIFY list in notes/27.

## Files
- `src/data/lessons/time-explained.js` — export rename, step ids, examples, speak step
- `src/data/lessons.js` — registered **before** `time`
- `src/data/wordFamilies.js` — `kind: 'phrase'`, `family-time-clock`
- `scripts/content/ids.mjs` — the guard
