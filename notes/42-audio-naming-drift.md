# Audio Naming Drift — "single" vs "singular", and re-syncing to disk

## What happened
Recorded 17 single-consonant MP3s named `single-consonant-<letter>.mp3`, dropped
them in `public/assets/audio/` — and heard nothing. Cause: the data
(`reference.js`) pointed at `sing**ul**ar-consonant-<letter>.mp3`. Off by two
letters → every fetch 404'd → silence.

Separately, the old 22 `double-consonant-*.mp3` files had been deleted, so those
paths 404'd too. Net: **every audio path in the data was dead**, but the app
showed no error.

## Why it failed *silently* (the important lesson)
Two layers of "fail quiet" stacked up:
1. A **missing** audio field → `AudioButton` renders disabled ("coming soon").
2. A **present but wrong** path → an *enabled* button whose `audio.play()` hits a
   404. `useAudio` catches that in `.catch` and just `console.warn`s. No crash,
   no visible error — the button looks clickable and does nothing.

So a naming typo produces the most confusing possible symptom: a normal-looking
button that's silent. **When audio "does nothing," suspect the path before the
code** — the playback engine (notes/05) was fine the whole time.

## The diagnostic that found it in one shot
Compare what the data references against what's on disk:
```bash
for f in $(grep -oE "/assets/audio/[a-z-]+\.mp3" src/data/reference.js | sort -u); do
  [ -f "public${f}" ] && echo "OK  $f" || echo "404 $f"
done
```
Every line said `404` → not a code bug, a filename mismatch. Keep this snippet;
it's the fastest audio triage.

## The fix: re-sync data to disk (don't rename 17 files)
`single`/`double` is the more natural pair than `singular`/`double`, so the data
bent to the files, not the other way. A script rebuilt every consonant entry —
stripping any stale `audio`, re-adding it **only when a matching file exists**:
```js
const files = new Set(readdirSync('public/assets/audio'))
// per entry:
const cand = files.has(`single-consonant-${L}.mp3`) ? `single-consonant-${L}.mp3`
  : files.has(`double-consonant-${L}.mp3`) ? `double-consonant-${L}.mp3`
  : null                       // no file → no audio field → honest disabled button
```
This is the same "wire only what exists" rule from notes/40, run in reverse to
*repair* drift. Result: 17 singles play; the (deleted) doubles are silent, not
broken.

## Current audio state (supersedes note 40's counts)
- **Naming convention is now `single-consonant-<L>.mp3` / `double-consonant-<L>.mp3`**
  (docs updated: `instructions/audio-files.md`, `notes/40`).
- **On disk:** 17 single-consonant files. That's it.
- **Playing:** the 17 single consonants in Reference → Consonants.
- **Silent (no file):** the multi-letter consonants, all vowels, all tones, all
  vocab/speak/lesson audio. `doubleConsonants` export still lists 22 dead
  `double-consonant-*` paths but nothing plays them (unused) — they'll light up
  again if those files are re-recorded under the same names.

## How to avoid the drift next time
- **Match the documented convention** in `instructions/audio-files.md` exactly, or
  change the convention there in the same commit (like this one did).
- After a batch, run the diagnostic above. Green = wired; any `404` = a typo
  between file and field.
- Remember Vite serves `public/` live — a new file is fetchable without a restart,
  so if it's still silent after adding the file, it's the *name*, not the server.

## Files
- `src/data/reference.js` — consonant `audio` re-synced to `single-consonant-*`
- `instructions/audio-files.md`, `notes/40-audio-plumbing.md` — `singular` → `single`
