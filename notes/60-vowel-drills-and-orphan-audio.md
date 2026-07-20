# Vowel Speak Drills & Finding Orphaned Recordings

## What
The two vowel lessons now end the same way the consonant lessons do — on a
**speak drill**, not a mini-quiz:

| Lesson | Was | Now |
|---|---|---|
| Single Vowels | `mini-quiz` → `alphabet-vowels` | `speak-drill` → `family-vowel-single` (6) |
| Double Vowels | `mini-quiz` → `alphabet-vowels` | `speak-drill` → `family-vowel-double` (9) |

## Why they were inconsistent
The consonant lessons moved to speak drills in notes/50 — *"a multiple-choice
question can't show you can say a consonant."* The vowel lessons were left on
the old `mini-quiz` step, so the two halves of Foundations taught the same kind
of thing and then tested it two different ways.

Worse, both vowel lessons pointed at the **same** quiz, `alphabet-vowels`, which
covers single *and* double vowels. Finishing the single-vowels lesson tested you
on double vowels it hadn't taught yet.

## Derived, like the consonant families
```js
const vowelFamilies = vowelGroups.map((g) => ({
  id: `family-vowel-${g.id}`,
  kind: 'vowel',
  words: g.items.map((v) => ({ id: `family-vowel-${g.id}-${v.letter}`, hmong: v.letter, … })),
}))
```

Same shape as `consonantFamilies`, from `vowelGroups` — so a newly recorded
vowel appears in the drill with no edit, and the drill can never disagree with
the Reference page.

Word ids are `family-vowel-<group>-<letter>`, **not** `family-vowel-<letter>` —
the latter produces `family-vowel-a`, which is already a *family* id.

`SpeakFamily` needed no change: its breakdown is guarded by `{w.vowel && …}`,
and a bare vowel has no consonant/tone, so it skips just like bare consonants.

## The bigger find: `oi` didn't exist
Building the drill surfaced a mismatch — the double-vowels lesson grid showed 9
letters, the drill had 8. Cause: **`oi` was missing from the `vowels` list
entirely**, while `hmong-double-vowels-oi.mp3` sat on disk, recorded.

So `oi` was invisible in **Reference, Search, the vowels quiz, the lesson grid,
and the drill** — five surfaces, one missing line of data. Added to both
`vowels` and `doubleVowels` with a `TODO-VERIFY` on the "oy" gloss.

> Data pointing at a missing file is a 404 you hear the first time you tap it.
> A file nothing points at is silent forever.

## The orphan checker
`scripts/audio/orphans.mjs` walks every mp3 on disk and reports the ones no data
references. First run found **51** — of which 7 were phantom.

The phantoms were the tones: their paths are built with a template
(`hmong-tone-${marker}.mp3`), so the literal filename appears nowhere in source
and a text grep called every one an orphan. Fixed by **importing the data
modules and deep-walking the exported values** instead of grepping:

```js
function collect(value, out = new Set(), seen = new Set()) {
  if (typeof value === 'string') { if (value.includes('.mp3')) out.add(value.split('/').pop()) ; return out }
  …
}
```

Templates get evaluated at import, so the resolved path is what's checked. Same
lesson as the ids guard (notes/58): **a checker that reports phantom problems
gets ignored, which is worse than no checker.**

Output is grouped by folder, because orphans cluster — "this whole folder is
unwired" is a far more actionable message than 40 separate lines.

### It immediately paid for itself
`grammar/action-verbs/` held four files named `hmong-action-verb-*.mp3` —
**singular**, where the other 20 in the same folder are `hmong-action-verbs-*`.
Those four are noj, haus, los, and ua: the exact words listed as "still silent"
in notes/54. They had been recorded the whole time and were one letter away from
working. Renamed → wired automatically. Audio went 125 → **133 verified**.

This is the `single`/`singular` drift from notes/42, third occurrence.

## Still orphaned (40 files, all recorded, none wired)
| Folder | Files |
|---|---|
| `vocabulary/numbers/` | 22 |
| `vocabulary/money/hmong-money/` | 12 |
| `vocabulary/money/hmong-how-much/` | 6 |

These need more than a rename, for two reasons:

1. **The numbers folder has more recordings than the category has words.** 22
   files vs 10 words — it includes 20/30/…/90, 100, 1000, vam, plhom. The
   vocabulary category stops at ten, so the higher numbers have nowhere to
   attach yet.
2. **The money filenames don't follow one convention.** `hmong-money-tus-nqi`
   matches the word *id* (`money-tus-nqi`) while its `hmongRPA` is just "nqi";
   `how-much-kim-npaum-licas` matches neither slug the matcher generates
   (`kim-npaum-li-cas` / `kimnpaumlicas`).

Wiring these by guessing a mapping is how the wrong-audio bug in notes/54
happened. They need either a filename pass or an explicit map.

## How to extend
- Run `node scripts/audio/orphans.mjs` after every recording batch — it's the
  only check that catches "recorded but never used."
- A whole folder showing as orphaned usually means a missing `FOLDERS` entry in
  `match.mjs`, not 20 individually broken files.

## Files
- `src/data/wordFamilies.js` — `vowelFamilies`
- `src/data/lessons/{vowels,double-vowels}.js` — `speak-drill` replaces `mini-quiz`
- `src/data/reference.js` — `oi` added to `vowels` and `doubleVowels`
- `scripts/audio/orphans.mjs` — the checker
