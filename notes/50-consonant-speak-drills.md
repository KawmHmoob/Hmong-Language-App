# Consonant Speak Drills — replacing the alphabet mini-quiz

## What
Four new Speak drills — one per consonant type — and the consonant lessons now
**end on a speaking drill instead of a multiple-choice mini-quiz**.

| Drill | Letters | Reference audio |
| --- | --- | --- |
| `family-consonant-single` | 17 | ✅ all present |
| `family-consonant-double` | 19 | ✅ all present |
| `family-consonant-triple` | 14 | ✅ all present |
| `family-consonant-quadruple` | 3 | ✅ all present |

## Why the mini-quiz had to go
Every consonant lesson ended on `alphabet-consonants` — a multiple-choice
question. For an alphabet lesson that's the wrong instrument:

> **You cannot prove you can pronounce a consonant by clicking a button.**

Recognition ≠ production. The lesson teaches a *sound*; the honest assessment is
saying it. Same reasoning that replaced the vocab lessons' quick-check with the
study→quiz handoff (notes/37) — match the assessment to the skill.

## Derived, not hand-listed
The four families are **computed from `consonantGroups`** in `reference.js`:

```js
const consonantFamilies = consonantGroups.map((g) => ({
  id: `family-consonant-${g.id}`,
  kind: 'consonant',
  title: `${g.title.split('|')[0].trim()} consonants`,   // strip the Hmong half
  words: g.items.map((c) => ({
    id: `family-consonant-${c.letter}`,
    hmong: c.letter,
    english: c.sound || '',
    audio: c.audio || '',
  })),
}))
```

Which means the chain is: **`consonants` → `consonantGroups` (by letter length,
notes/43) → the drills.** Add a consonant to `reference.js` and it appears in the
Reference grid, its lesson, *and* its speak drill — no edits. Record its audio
and all three light up. That's three surfaces off one source.

## The `speak-drill` step kind
```js
{ id, kind: 'speak-drill', title, familyId, blurb? }
```
`Lesson.jsx` renders a mic icon, a line about what's ahead, and a
**"Practice speaking →"** link to `/speak/family/:familyId`. It looks up the
family so it can name the count, and degrades gracefully if the `familyId` is
wrong (a message, not a crash).

Note it's a **handoff**, not an embedded recorder — same pattern as the vocab
lessons handing off to the word bank. The lesson explains; Speak drills.

## One shape fix this forced
`SpeakFamily` printed every word's `consonant + vowel + tone` breakdown. A bare
consonant has no vowel or tone, so that line is now conditional on `w.vowel`.
Syllable families (`da`, `ma`, `pa`) still show the formula; consonant families
just show the letter.

**Generalizable point:** when a screen built for one data shape gains a second,
make the shape-specific parts conditional rather than stuffing empty values in.
`{w.vowel && …}` beats `tone: ''` placeholders everywhere.

## Still a placeholder
Recording/comparison/scoring are **not built** — the mic button on the drill
screen is deliberately disabled (notes/46). What works today: the drill lists
the right letters and plays the native reference for each. When scoring lands,
these four families are already wired and populated.

## How to extend
- **Vowel/tone drills:** same move — derive from `vowelGroups` / `tones` and push
  onto `wordFamilies`. The tone drill is the highest-value one to build next;
  tone is what learners actually get wrong.
- **Point a lesson at a drill:** add a `speak-drill` step with the `familyId`.
- **Removing a lesson's mini-quiz:** check the quiz still exists elsewhere (the
  `alphabet-consonants` quiz is still reachable from the Quiz menu — it was
  removed from the *lesson flow*, not deleted).

## Files
- `src/data/wordFamilies.js` — `consonantFamilies` derived from `consonantGroups`
- `src/pages/Lesson.jsx` — `SpeakDrillStep` + render case
- `src/pages/SpeakFamily.jsx` — breakdown line conditional on `w.vowel`
- `src/data/lessons/{singular,dual,triple,quadruple}-consonants.js` — mini-quiz → speak-drill
