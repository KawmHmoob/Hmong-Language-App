# Audio Plumbing — wiring playback before the recordings land

> **Counts below are historical.** Since this note, the double files were deleted
> and the singles renamed `singular-` → `single-`. Current audio state +
> convention live in [42-audio-naming-drift.md](42-audio-naming-drift.md). The
> *mechanism* here (components consume the field; wire only what exists) is
> unchanged and still correct.

## What
Made every audio surface actually *consume* an audio field, and activated the 39
recordings that were already on disk but orphaned. Adding pronunciation audio is
now content work (drop a file, set a field) with **no code changes** — the point
of doing the plumbing first.

## The problem
39 MP3s sat in `public/assets/audio/` (17 single + 22 double consonants), but:
- `Reference.jsx` hardcoded `audioSrc={null}` on the letter grids and tone list —
  so the alphabet could *never* play, no matter what data said.
- `consonants` in `reference.js` had no `audio` field at all.
- The files were effectively dead weight — recorded, shipped, unreachable.

Meanwhile vocabulary / speak / lesson-examples already read their audio fields
correctly. So the gap was specifically the Reference (ex-Alphabet) surface plus
missing data.

## The fix, two halves
**1. Components consume the field.** In `Reference.jsx`:
```jsx
<AudioButton audioSrc={it.audio} ... />   // was audioSrc={null}
<AudioButton audioSrc={t.audio}  ... />   // tones, was null
```
`AudioButton` already does the right thing with a missing field — renders a
disabled "coming soon" button — so this is safe even for letters with no file.

**2. Data points at the files, by convention.** A script added `audio` to each
`consonants` entry where a matching file exists:
```
single-char letter L  → /assets/audio/single-consonant-L.mp3   (if it exists)
multi-char  letter L  → /assets/audio/double-consonant-L.mp3     (if it exists)
otherwise             → no audio field (stays a disabled button)
```
Result: **36 of 40 consonants now play.** Left silent because no file exists:
`nts, ntx, tsh, txh` and all vowels. That "only wire what exists" rule matters —
pointing a field at a missing file would give an *enabled* button that 404s on
tap, which is worse than an honest disabled one.

## The pattern worth reusing (filename → data field)
The consonant wiring is the template for propagating any batch: read the audio
directory into a `Set`, then for each data entry compute its candidate filename
by convention and only set the field if the file is present.
```js
const files = new Set(readdirSync('public/assets/audio'))
const cand = files.has(`single-consonant-${L}.mp3`) ? … : null
if (cand) entry.audio = `/assets/audio/${cand}`
```
The same shape fills `vocabulary.js` `audioFile` from `<wordId>.mp3`, or
`speak.js` `audio` from `<phraseId>.mp3`, once those recordings exist.

## The two field names (the sharp edge)
- **`vocabulary.js` → `audioFile`**, a **bare filename** (`useAudio` prepends
  `/assets/audio/`).
- **Everywhere else (`reference`, `speak`, lesson `examples`) → `audio`**, an
  **absolute path** (`/assets/audio/…`).

Same concept, two conventions, historical. `resolveSrc` in `useAudio` handles
both (absolute used as-is; bare filename gets the base prepended). If you ever
unify the data model, unify these too.

## How playback resolves (already built — notes/05)
`useAudio` caches one `HTMLAudioElement` per src in a module-level Map, rewinds
with `currentTime = 0`, and stops any other playing clip first so taps can't
overlap. Nothing here changed — this note is about *feeding* it, not it.

## Gotchas
- **`public/assets/audio/`, never `src/public/…`.** Vite's public dir is the
  top-level one; the `src/public` tree was a no-op trap (deleted, note "organize").
- **`doubleConsonants` overlaps `consonants`.** It's a separate export (22 entries
  with audio) that feeds the `alphabet-double-consonants` quiz, but its letters
  duplicate entries already in `consonants`. Left as-is (the quiz depends on it);
  worth collapsing if the alphabet data ever gets unified.
- Build copies `public/` → `dist/` verbatim; confirmed 39 files land in
  `dist/assets/audio/`.

## Files
- `src/pages/Reference.jsx` — grids + tones read `it.audio` / `t.audio`
- `src/data/reference.js` — `audio` added to 36 consonant entries
- `instructions/audio-files.md` — rewritten accurate (was 3 renames + 2 paths stale)
