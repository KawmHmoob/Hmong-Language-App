# Consonants Categorized — Single / Double / Triple / Quadruple

## What
The Reference → Consonants tab was one flat grid of ~40. It's now four labeled
sections by **cluster length**: Single (17), Double (19), Triple (14),
Quadruple (3). Each is the same grid under a subheading with a count and a
one-line blurb ("Three letters, one sound.").

## Why length is the right axis
In Hmong RPA a "consonant" is a *cluster* that spells one sound — `c` (1),
`ch` (2), `nkh`/`npl` (3), `nplh` (4). The number of letters **is** the
category. So the grouping needs no hand-maintained `group` field: it's derived
from `letter.length`.

## How it's built — one source, derived groups
`consonants` stays the flat list (still what search and the quiz consume).
`consonantGroups` is **derived from it**, so the two can't drift:
```js
export const consonantGroups = [
  { id: 'single', title: 'Single', blurb: 'One letter, one sound.' },
  { id: 'double', title: 'Double', blurb: 'Two letters, one sound.' },
  { id: 'triple', title: 'Triple', blurb: 'Three letters, one sound.' },
  { id: 'quadruple', title: 'Quadruple', blurb: 'Four letters, one sound.' },
]
  .map((g, i) => ({ ...g, items: consonants.filter((c) => c.letter.length === i + 1) }))
  .filter((g) => g.items.length > 0)   // empty categories drop out
```
Index `i+1` = cluster length, so group N holds the N-letter clusters. Add a
consonant to the flat list and it files itself into the right section — no
second place to update.

## Completing the inventory (where the new letters came from)
The flat list only had 4 triples and **zero** quads. The fuller sets already
existed as the app's own content — the **Triple/Quadruple Consonants lessons**
(`src/data/lessons/*-consonants.js`). I consolidated those canonical letters
into `reference.js` (10 more triples + 3 quads), lowercased to match reference
style. So this is consolidation of existing app data, **not invented linguistics**.

The new triples/quads carry `sound: ''` — a written English-ish approximation
for a 4-letter cluster is more misleading than helpful, and they're meant to be
learned by ear. The grid hides an empty sound line (`{it.sound && …}`), so those
tiles show just the letter (and a disabled audio button until recorded).

## The two consumers this touched
- **Quiz** (`alphabet-consonants`): maps `consonants` → `{prompt: letter,
  answer: sound}`. Blank-sound entries would make questions with **empty
  answers**, so the dataset now filters `consonants.filter((c) => c.sound)`.
  Real fix at the source: don't quiz on what has no written answer.
- **Search**: indexes `consonants`; blank-sound entries just index by letter
  (empty hint). Harmless, left as-is.

## How to extend
- **A recording for a triple/quad:** drop
  `triple-consonant-<letter>.mp3` (or your chosen name) in
  `public/assets/audio/`, add `audio: '/assets/audio/…'` to that entry. The
  disabled button lights up. (Naming lesson: notes/42.)
- **A sound description:** fill the `sound: ''` — it appears in the grid and the
  entry starts showing up in the consonant quiz automatically.
- **A new cluster:** add `{ letter, sound }` to `consonants`; it auto-files into
  the section matching its length.

## Gotchas
- `consonantGroups` is derived — never hand-maintain a parallel grouped list.
- The `doubleConsonants` export still exists separately (feeds the
  `alphabet-double-consonants` quiz) and now overlaps the Double section. Latent
  duplication; collapse if the alphabet data ever gets unified (also noted in 40).
- Vowels/tones tabs are unchanged (single flat grids — they have no length tiers).

## Files
- `src/data/reference.js` — 13 triple/quad entries added; `consonantGroups` derived export
- `src/pages/Reference.jsx` — `GroupedConsonants` renderer; grid hides empty `sound`
- `src/data/quizzes.js` — `alphabet-consonants` filters to sound-bearing entries
