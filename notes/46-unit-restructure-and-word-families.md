# Unit Restructure + Speak Word Families (placeholder)

Two changes that go together: Learn was reorganized so each unit owns one job,
and Speak got the **word family** scaffold that will eventually replace the
generic mini-quiz at the end of alphabet lessons.

---

## 1. Foundations = the alphabet; everything else moved out

**Before:** Foundations held all 14 lessons — the alphabet *and* the grammar.
It was the only "start here" unit, so everything landed there.

**After:**
```
Foundations   → the alphabet, in formula order (8 lessons)
                  how a Hmong word is built     ← new anchor lesson
                  consonants: single/dual/triple/quadruple
                  vowels: single/double
                  tones  (room to grow — see below)
Grammar       → pronouns, verbs, tense markers, classifiers, demonstratives… (7)
Conversational / Numbers & Time / Readings  (unchanged)
```

**Why this split.** A Hmong word is *consonant + vowel + tone*. Those three
pieces plus the formula that binds them are **one job** — "learn to read and
pronounce Hmong" — so they belong together in Foundations, in that order.
Splitting them into separate Consonants/Vowels/Tones units was tried and
reverted: it fragmented a single, sequential idea into three shallow units and
made the curriculum harder to read, not easier.

What genuinely *didn't* belong was **grammar** — pronouns, verbs, classifiers.
That's how words *combine*, not how they're *built*. Different job → its own
unit (the same surfaces-by-job reasoning as notes/34).

### Sub-grouping: `groups` inside a unit
Eight lessons in one flat grid still reads as a wall. So a unit can now declare
**headed sections** instead of a flat list:

```js
const foundations = {
  id: 'foundations', title: 'Foundations', description: '…',
  groups: [
    { id: 'word-structure', title: 'How Hmong Words Work', blurb: '…', lessons: [hmongWordStructure] },
    { id: 'consonants',     title: 'Consonants', blurb: '…', lessons: [singular, dual, triple, quad] },
    { id: 'vowels',         title: 'Vowels',     blurb: '…', lessons: [SingleVowels, DoubleVowels] },
    { id: 'tones',          title: 'Tones',      blurb: '…', lessons: [Tones] },
  ],
}
```

**Groups are display-only, and the compatibility seam is one function:**
```js
function withLessons(unit) {
  if (!unit.groups) return unit
  return { ...unit, lessons: unit.groups.flatMap((g) => g.lessons) }
}
export const units = [ … ].map(withLessons)
```
Every unit still exposes a flat `unit.lessons`, so **nothing else had to change** —
progress counting, `getLesson()`, `allStepIds()`, the Learn hub's previews, and
the `/learn/:unitId/:lessonId` routes all keep reading the same field and never
learn that groups exist. `Unit.jsx` is the only consumer that checks for
`unit.groups`, rendering headed sections when present and the old flat grid when
not. Adding structure without a migration is the point.

**Tones grows inside its section.** The eight tones need contrast drills (high
vs high-falling, the breathy `-g`, the creaky `-m`, minimal pairs) — those get
appended to the `tones` group, one idea per lesson, without disturbing the
formula's flow or spawning a shallow new unit.

**Cost of this change: nothing broke.** Units are just groupings; lesson ids
never changed, so all saved progress and `/learn/:unitId/:lessonId` links still
resolve. Only the grammar lessons' `unitId` changed (`foundations` → `grammar`),
and those URLs are generated from the data, not bookmarked.

### The new anchor lesson
`lessons/hmong-word-structure.js` (`foundations-word-structure`) teaches the
formula and nothing else:
- **intro** — consonant + vowel + tone; the tone letter is *never pronounced*;
  the mid tone has no letter at all.
- **examples** — the same word broken apart six ways
  (`Nplooj` = `Npl` + `oo` + `j`, `Pob` = `P` + `o` + `b`, …).
- **a closing "where to go next"** pointing at the three units.

## 2. Word families (Speak) — barebones placeholder

### The idea
A **family** is a set of words sharing the same ending sound (rime), so the
learner drills **one contrast at a time** instead of random vocabulary. Because
every word is consonant + vowel + tone, you hold two pieces steady and vary the
third:

| `kind` | Hold steady | Vary | Example |
| --- | --- | --- | --- |
| `vowel` | vowel + tone | the consonant | **da, ma, pa** |
| `tone` | consonant + vowel | the tone | pob, poj, pov, po… |
| `consonant` | the consonant | vowel/tone | — |

First family shipped: **`family-vowel-a`** — consonant + `a`, no tone letter.

### Why this replaces the lesson mini-quiz
The alphabet lessons currently end in a multiple-choice quiz, which tests
*recognition* of a sound you just read. For pronunciation that's the wrong
instrument — **you can't prove you can say a tone by clicking a button.** A
speaking drill is the honest assessment, and it gives a reason to use Speak.

### The eventual flow (NOT built)
```
hear reference → record → compare → score
  ≥ PASS_SCORE (80) → next word
  below             → try again
```
Scoring is the tone-contour work in
[future-implementations/01-pronunciation-dataset.md](future-implementations/01-pronunciation-dataset.md);
validating that score is notes/19.

### What actually exists right now
- `src/data/wordFamilies.js` — the shape, `PASS_SCORE`, one family, helpers.
  Each word carries its own `consonant / vowel / tone` split so the screen can
  show the Foundations formula per word.
- `src/pages/SpeakFamily.jsx` at `/speak/family/:familyId` — lists the words
  with their breakdown, a reference-audio button, and a **disabled** mic.
- A "Word families" section on the Speak hub, badged **Preview**.

**The record button is deliberately disabled, not faked.** A button that looks
functional and does nothing is how you end up debugging a feature that was never
built. Disabled + a "coming soon" banner keeps the placeholder honest — same
principle as `AudioButton`'s disabled state for missing audio.

### Route ordering gotcha
`/speak/family/:familyId` is registered **before** `/speak/:phraseId`, so
"family" isn't swallowed as a phrase id. React Router v6 ranks static segments
above dynamic ones so it would resolve correctly anyway — but the order is
explicit and commented, because relying on invisible ranking is how the next
person gets confused (same note as notes/33).

## Open / next
- **Meanings unverified:** `da`, `ma`, `pa` carry `TODO-VERIFY` — they may be
  drill syllables rather than words. Confirm before showing English glosses.
- **No reference audio yet** for family words (`audio: ''` → disabled button).
  Recording these is the unblock, same as everywhere else.
- **More families:** one per vowel, then the tone families (the highest-value
  ones — that's where Hmong actually gets hard), then consonant families.
- **Tone contrast lessons** — the Tones unit is intentionally roomy; add them
  one idea per lesson.
- Swapping the alphabet lessons' `mini-quiz` step for a family drill is the
  change this was built toward — not done yet.

## Files
- `src/data/lessons/hmong-word-structure.js` — **new** anchor lesson
- `src/data/lessons.js` — Foundations = alphabet in 4 `groups` (8 lessons);
  new Grammar unit (7); `withLessons()` derives flat `lessons` from groups
- `src/pages/Unit.jsx` — renders headed sections when a unit has `groups`
- `src/data/wordFamilies.js` — **new** family data + `PASS_SCORE` + helpers
- `src/pages/SpeakFamily.jsx` — **new** barebones drill screen
- `src/pages/Speak.jsx` — Word families section
- `src/App.jsx` — `/speak/family/:familyId` route
