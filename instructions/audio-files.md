# Audio Files

How to add pronunciation audio. **The plumbing is done** (notes/40) — every
surface that shows an audio button already reads an audio field and plays it via
the cached `useAudio` hook. So adding sound is now pure **content work**: drop a
correctly-named MP3 in the folder, point a data field at it, done. No code.

## Where files go — the folder tree
Under `public/assets/audio/`, organized by type (Vite serves `public/` from the
site root, so the folder path IS part of the URL):
```
public/assets/audio/
  consonants/
    single-consonants/   single-consonant-<letter>.mp3   (17, recorded)
    double-consonants/   double-consonant-<letter>.mp3   (22, recorded)
  vocabulary/            <wordId>.mp3                     (via AUDIO_BASE)
  (phrases/, vowels/, tones/ … as you add them)
```
**The folder is part of the path.** A file at
`consonants/single-consonants/single-consonant-c.mp3` is referenced as
`/assets/audio/consonants/single-consonants/single-consonant-c.mp3`. Move a file,
update its data path to match — or it 404s (see notes/44).

> **Not** `src/public/…` — that path does nothing (Vite's public dir is the
> top-level `public/`). An empty `src/public/audio/…` tree used to exist as a
> trap; it was deleted.

## How a field becomes a playing button
`AudioButton` takes an `audioSrc`. If it's set → an enabled ♪ button that plays.
If it's `null`/`''` → a disabled "Audio coming soon" button. So a data file with
empty audio fields already renders correctly; filling the field lights it up.

Path rules (`useAudio` `resolveSrc`):
- **Absolute** (`/assets/audio/consonants/…​.mp3`) → used as-is.  ← reference,
  lessons & speak use this. The FULL nested path goes in the data.
- **Bare filename** (`foo.mp3`) → `AUDIO_BASE` is prepended.  ← vocabulary only.
  `AUDIO_BASE` lives in `src/hooks/useAudio.js` — point it at the vocab subfolder
  (`/assets/audio/vocabulary/`) so bare vocab filenames resolve into it.
- Empty / `null` → no-op (disabled button).

## Where each data field lives

| Data file | Field | Form | Example |
| --- | --- | --- | --- |
| `src/data/vocabulary.js` | `audioFile` | bare filename | `audioFile: 'animals-dog.mp3'` |
| `src/data/reference.js` (consonants/vowels/tones) | `audio` | absolute path | `audio: '/assets/audio/consonants/single-consonants/single-consonant-c.mp3'` |
| `src/data/speak.js` (phrases) | `audio` | absolute path | `audio: '/assets/audio/phrases/speak-nyob-zoo.mp3'` |
| `src/data/lessons/*.js` (`examples` items, readings) | `audio` | absolute path | `audio: '/assets/audio/…​.mp3'` |

⚠️ **`audioFile` (vocabulary) vs `audio` (everywhere else)** — same idea, two key
names, for historical reasons. Watch it when filling data.

## Naming conventions (singular "consonant", lowercase letter)
- **Single consonants:** `single-consonant-<letter>.mp3` (`single-consonant-c.mp3`)
- **Double consonants:** `double-consonant-<letter>.mp3` (`double-consonant-ch.mp3`)
  — **singular** "consonant", **not** "consonant**s**". A stray plural on 21 files
  caused a silent-404 batch; normalized in notes/44.
- **Vocabulary:** `<wordId>.mp3` — e.g. `animals-dog.mp3` for `id: 'animals-dog'`
- **Speak (suggested):** `<phraseId>.mp3` — e.g. `speak-nyob-zoo.mp3`
- **Not yet recorded:** vowels, tones, triple/quad consonants. Suggest
  `vowel-<letter>.mp3`, `tone-<marker>.mp3`,
  `consonants/triple-consonants/triple-consonant-<letter>.mp3`.

## What's wired today vs. still silent
- **Wired & playing:** the 17 single + 22 double consonants — in Reference →
  Consonants and the Singular/Double Consonants lessons.
- **Still silent (no file yet):** triple/quad consonants; all vowels; all tones;
  every vocabulary word; every speak phrase; every non-consonant lesson example.
  They render disabled buttons until a file + field land.

## Always verify after a batch (catches every path typo)
```bash
for f in $(grep -rhoE "/assets/audio/[a-z/-]+\.mp3" src/data | sort -u); do
  [ -f "public${f}" ] && echo "OK  $f" || echo "404 $f"
done
```
All `OK` = data and disk agree. Any `404` = a path the data expects but no file
has. The `[a-z/-]` class includes `/` so it matches nested folder paths.

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
