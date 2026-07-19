# Vowel & Tone Lessons — scaffolds that derive from Reference

## What
Three lessons added to **Foundations**, slotted in alphabet order
(consonants → vowels → tones, then grammar):

| Lesson | id | Content |
| --- | --- | --- |
| Vowels \| Cov Tab | `foundations-single-vowels` | 6 single vowels |
| Double Vowels \| Cov Txooj | `foundations-double-vowels` | 8 double vowels |
| Tones \| Cov Cim | `foundations-tones` | all 8 tones |

All three play audio (vowel + tone recordings are on disk and wired). They're
**scaffolds**: structure and data are real; some intro prose still wants a
native-speaker pass (marked `TODO-VERIFY`).

## The pattern worth copying: derive examples, don't copy them
The `examples` items are **computed from `src/data/reference.js`** instead of
being hand-listed in the lesson:

```js
// lessons/tones.js
import { tones } from '../reference.js'

items: tones.map((t) => ({
  hmong: t.marker || '(no marker)',
  english: `${t.name} — ${t.example2}`,      // "High — Cim Siab"
  note: `${t.description}. Example: ${t.example}`,
  audio: t.audio,
}))
```

**Why this matters:** the recurring bug in this codebase has been *the same
content living in two places and drifting* (notes/34, /40, /42, /44). A vowel
edited in `reference.js` now updates the lesson automatically — there is no
second copy to forget. It also honors the job split from notes/34: Reference
**states** the fact, the lesson **explains** it, but they read from one source.

The tone mapping is the nice case — one `reference.js` entry supplies the
marker, the English name, the Hmong name (`example2` → *Cim Siab*), the pitch
description, the example word, **and** the audio path in a single object.

### Gotcha this creates
A lesson now **imports from `reference.js`**, so a broken export there breaks the
lesson (see the bug below). That's the trade for not duplicating: one source of
truth, one source of failure. Worth it, but verify Reference before trusting a
derived lesson.

## 🐛 Bug caught while wiring: the `doubleVowels` export
`reference.js` exports vowels three ways — `vowels` (all 14), `singleVowels`,
`doubleVowels`. The `doubleVowels` export had been copy-pasted from
`singleVowels` and still pointed at the **single-vowels folder**:
```js
// wrong — file lives in double-vowels/, path said single-vowels/
{ letter: 'aa', audio: '/assets/audio/vowels/single-vowels/hmong-single-vowels-aa.mp3' }
```
All 8 would have 404'd silently. The main `vowels` array had them correct, so
nothing visible was broken — until the new Double Vowels lesson derived from the
*wrong* export. Fixed to `double-vowels/hmong-double-vowels-<letter>.mp3`.

**Lesson: multiple exports of the same content are the duplication problem in
miniature.** `singleVowels`/`doubleVowels` could be derived from `vowels` by
length (exactly like `consonantGroups` does — notes/43) instead of hand-listed.
Worth collapsing next time this area is touched.

## Tone audio is templated, not literal
Tone paths are generated, not written out:
```js
audio: t.marker ? `/assets/audio/tones/hmong-tone-${t.marker}.mp3`
                : '/assets/audio/tones/hmong-tone-none.mp3'
```
So the usual `grep` for literal `/assets/audio/....mp3` **misses them** — it only
finds the `none` fallback. When verifying tone audio, expand the markers
explicitly:
```bash
for m in b j v s g m d; do
  f="/assets/audio/tones/hmong-tone-$m.mp3"
  [ -f "public$f" ] && echo "OK  $f" || echo "404 $f"
done
```
All 8 confirmed present. **Generated paths need generated checks.**

## Open content items (owner's call, not invented)
- The single-vowels intro says **"5 main singular vowels"** while the data has
  **6** (a, e, i, o, u, w). Left as written — adjust if `w` was meant to be
  counted separately.
- `TODO-VERIFY` on: the nasal quality of `aa`/`ee`/`oo`, and the plain-English
  description of RPA `w`.
- A `hmong-double-vowels-**oi**.mp3` file exists on disk with **no data entry** —
  add `{ letter: 'oi', … }` to the vowels data if it should appear.

## Quizzes (interim)
Each lesson ends on a `mini-quiz` pointing at the existing alphabet quizzes
(`alphabet-vowels`, `alphabet-tones`). These are placeholders — a dedicated
lesson/quiz plan to replace the consonant/vowel/tone quizzes is the next
conversation.

## How to extend
- **Add a vowel/tone:** edit `src/data/reference.js` only. The Reference table
  AND the lesson both update.
- **New alphabet lesson:** one file per lesson (house convention), import its
  data from `reference.js`, register in `lessons.js`, place in alphabet order.
- **Don't** hand-list letters inside a lesson — derive them.

## Files
- `src/data/lessons/vowels.js` — `SingleVowels` (owner's intro kept, examples + quiz added)
- `src/data/lessons/double-vowels.js` — **new** `DoubleVowels`
- `src/data/lessons/tones.js` — **new** `Tones`, fully populated from `tones` data
- `src/data/lessons.js` — imports + Foundations order
- `src/data/reference.js` — `doubleVowels` audio paths fixed
