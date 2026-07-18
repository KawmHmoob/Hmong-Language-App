# Audio Folder Structure — nesting by type, and the rewire that took

## What
The flat `public/assets/audio/` was reorganized into typed subfolders, and every
data path was rewired to match. Consonants now live at:
```
public/assets/audio/consonants/single-consonants/single-consonant-<letter>.mp3
public/assets/audio/consonants/double-consonants/double-consonant-<letter>.mp3
public/assets/audio/vocabulary/…
```
17 single + 22 double consonants are wired and playing (Reference → Consonants,
and the Singular/Double Consonants lessons).

## Two rules this reorg makes concrete
1. **The folder path IS the URL.** A file under `consonants/single-consonants/`
   is referenced as `/assets/audio/consonants/single-consonants/…`. Nesting a file
   without updating its data path = silent 404. There is no magic resolution —
   `useAudio` uses absolute paths verbatim.
2. **Vocabulary is the exception** (bare filenames). It resolves through
   `AUDIO_BASE` in `useAudio.js`; point that at the vocab subfolder
   (`/assets/audio/vocabulary/`) and bare `audioFile` values land there. Every
   other surface carries the full nested path in the data string.

## Two bugs the rewire surfaced (both worth remembering)

### Bug 1 — the plural-`s` filename drift
21 of 22 double files were exported as `double-consonant**s**-<letter>.mp3`
(plural), while the convention + the 22nd file (`ch`) use singular
`double-consonant-`. All 21 would have 404'd. **Fix:** renamed the files to the
singular form rather than bending the data to a typo — `single-consonant-` /
`double-consonant-` is the consistent pair. (If WAV masters were named plural too,
rename those to match.) This is the same class as the `single`/`singular` drift in
notes/42: **a naming convention is only useful if every file obeys it exactly.**

### Bug 2 — the same file, two data shapes
A regex rewrote consonant `audio` fields by matching
`{ letter, sound, audio }` entries — and **silently missed** the `doubleConsonants`
export in the *same file*, because those entries are a different shape
(`{ letter, audio, exampleWord }` — no `sound`). Result: the grid + lessons wired
correctly, but 22 quiz-export paths still pointed at the old flat location.

> **Lesson: when you bulk-edit paths, one file can hold more than one data shape.
> The verify script — not the edit — is what catches the shape you forgot.** A
> second one-liner `sed` fixed the export.

## The rewire loop (the reusable procedure)
```
1. mkdir the subfolders; mv files in.
2. Rewire data paths to match:
   - full-path fields (reference/lessons/speak): sed the prefix, OR a script that
     derives each path from the letter/id and sets it only if the file exists.
   - vocabulary: change AUDIO_BASE (one line), not the data.
3. VERIFY — the loop below. Fix every 404. Watch for multiple data shapes per file.
4. npm run build (confirms no syntax slip from the edits).
```
```bash
for f in $(grep -rhoE "/assets/audio/[a-z/-]+\.mp3" src/data | sort -u); do
  [ -f "public${f}" ] && echo "OK  $f" || echo "404 $f"
done
```
`[a-z/-]` includes `/` so it matches nested paths. All `OK` = disk and data agree.

## The "only wire what exists" rule (still holds)
The wiring script sets `audio` **only when the file is on disk**; otherwise it
leaves the field empty (disabled button). Pointing a field at a missing file gives
an *enabled* button that 404s on tap — worse than an honest disabled one. This is
what keeps triples/quads/vowels correctly silent until recorded.

## Current state
- **Wired:** 17 single + 22 double consonants (grid, both lessons, and the
  `doubleConsonants` quiz export).
- **Silent (no files yet):** triple/quad consonants, vowels, tones, all
  vocabulary, all speak phrases, all non-consonant lesson examples.
- **`AUDIO_BASE`:** repointed to the vocabulary subfolder (owner did this).

## Files
- `public/assets/audio/…` — nested `consonants/{single,double}-consonants/`, `vocabulary/`
- `src/data/reference.js` — consonant + `doubleConsonants` paths → nested
- `src/data/lessons/singular-consonants.js`, `dual-consonants.js` — `audio` → nested
- `src/hooks/useAudio.js` — `AUDIO_BASE` → vocab subfolder
- `instructions/audio-files.md` — updated for the tree + nested paths
