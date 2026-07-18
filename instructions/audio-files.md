# Audio Files

How to add pronunciation audio. **The plumbing is done** (notes/40) — every
surface that shows an audio button already reads an audio field and plays it via
the cached `useAudio` hook. So adding sound is now pure **content work**: drop a
correctly-named MP3 in the folder, point a data field at it, done. No code.

## Where files go
`public/assets/audio/`. Vite serves `public/` from the site root, so
`public/assets/audio/foo.mp3` is fetchable at `/assets/audio/foo.mp3`.

> **Not** `src/public/…` — that path does nothing (Vite's public dir is the
> top-level `public/`). An empty `src/public/audio/…` tree used to exist as a
> trap; it was deleted.

## How a field becomes a playing button
`AudioButton` takes an `audioSrc`. If it's set → an enabled ♪ button that plays.
If it's `null`/`''` → a disabled "Audio coming soon" button. So a data file with
empty audio fields already renders correctly; filling the field lights it up.

Path rules (`useAudio` `resolveSrc`):
- **Absolute** (`/assets/audio/foo.mp3`) → used as-is.  ← reference & speak use this
- **Bare filename** (`foo.mp3`) → `/assets/audio/` is prepended.  ← vocabulary uses this
- Empty / `null` → no-op (disabled button).

## Where each data field lives

| Data file | Field | Form | Example |
| --- | --- | --- | --- |
| `src/data/vocabulary.js` | `audioFile` | bare filename | `audioFile: 'animals-dog.mp3'` |
| `src/data/reference.js` (consonants/vowels/tones) | `audio` | absolute path | `audio: '/assets/audio/single-consonant-c.mp3'` |
| `src/data/speak.js` (phrases) | `audio` | absolute path | `audio: '/assets/audio/speak-nyob-zoo.mp3'` |
| `src/data/lessons/*.js` (`examples` items, readings) | `audio` | absolute path | `audio: '/assets/audio/…​.mp3'` |

⚠️ **`audioFile` (vocabulary) vs `audio` (everywhere else)** — same idea, two key
names, for historical reasons. Watch it when filling data.

## Naming conventions (what's already on disk)
The 39 existing recordings follow these — keep them consistent as you add:
- **Single consonants:** `single-consonant-<letter>.mp3` (e.g. `single-consonant-c.mp3`)
- **Double consonants:** `double-consonant-<letter>.mp3` (letter lowercased, e.g. `double-consonant-ch.mp3`)
- **Vocabulary (suggested):** `<wordId>.mp3` — e.g. `animals-dog.mp3` for `id: 'animals-dog'`
- **Speak (suggested):** `<phraseId>.mp3` — e.g. `speak-nyob-zoo.mp3`
- **Vowels / tones / triples / quads:** not yet recorded — suggest
  `vowel-<letter>.mp3`, `tone-<marker>.mp3`, `triple-consonant-<letter>.mp3`.

## What's wired today vs. still silent
- **Wired & playing:** 36 of 40 `consonants` (the 17 singles + 19 doubles that
  have files). Set in `reference.js`.
- **Still silent (no file yet):** consonants `nts, ntx, tsh, txh`; all 14 vowels;
  all tones; every vocabulary word (`audioFile: null`); every speak phrase
  (`audio: ''`); every lesson example. These render disabled buttons until a file
  + field land.
- **`doubleConsonants` export** already has all 22 paths and feeds the
  `alphabet-double-consonants` quiz — but note it overlaps the `consonants` list.

## Propagation workflow (per batch)
1. Record → export MP3, name it per the convention above.
2. Drop it in `public/assets/audio/`.
3. Set the field (`audio` or `audioFile`) on the matching data entry.
4. Save — the button lights up on reload. No build step, no code.

For a big batch, a script can fill fields by matching filenames to ids the same
way the consonant wiring did (see notes/40 for that pattern).

## License note
If audio comes from a third party (a textbook, etc.), confirm you have
redistribution rights before committing files. For non-redistributable assets,
host them in a private bucket and load via signed URLs instead.
