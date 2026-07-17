# Dead Code & Bug Fixes — Slice B of the Cleanup Pass

## What
Slice B of [26-cleanup-prompt.md](26-cleanup-prompt.md): removed the dead Review
page, fixed the broken lesson audio button, and verified the codebase is clean of
hardcoded colors and dead links. Small slice — the earlier theming/nav passes had
already cleaned most of what this slice hunts.

## The changes, and the lesson in each

### 1. `src/pages/Review.jsx` — deleted
Unrouted since `/review` became a redirect to `/words/session`
([23-words-section.md](23-words-section.md)). **Process matters more than the
deletion:** before removing, grep for importers (`import Review`, `Review.jsx`) —
zero hits — and use `git rm` so the removal is a tracked change, recoverable from
history. Dead code is only safe to delete when you can prove nothing reaches it
AND version control can bring it back.

### 2. `Lesson.jsx` ExamplesStep audio button — the three-bugs-in-one-line fix
The old code:
```jsx
<button onClick={() => new Audio(it.audio).play}>🔊</button>
```
Three distinct bugs in one expression — worth understanding each:
1. **`.play` vs `.play()`** — without parens, the click handler *references* the
   play method and throws it away. The button did literally nothing. (A function
   value in expression position is not a call — classic JS trap.)
2. **`new Audio(...)` per click** — even with parens, constructing a fresh Audio
   each click re-downloads/decodes the file and can overlap sounds. The app
   already solved this: `useAudio`'s module-level cache
   ([05-audio-placeholder.md](05-audio-placeholder.md)).
3. **No empty-state handling** — every lesson item currently has `audio: ''`, so
   the button rendered as if it worked and silently didn't.

The fix is one line, because the right component already existed:
```jsx
<AudioButton audioSrc={it.audio} wordId={it.hmong} />
```
`AudioButton` routes through the cached `useAudio`, and with `audioSrc=''` renders
the disabled "Audio coming soon" state — honest UI until recordings land. **Rule:
before fixing an inline widget, check `components/common/` for the shared one.**

### 3. Hardcoded colors sweep — already clean
`grep` for `text-[#…]`, `bg-[#…]`, `stroke="#…"`, hex strings in JS: zero hits.
The note-21/24/25 passes (tokens, `currentColor`, computed-style canvas) had
eliminated them all. Kept here as the checklist step so future sweeps rerun it.

### 4. Dead-link sweep — all clean
Every static `to="/…"` target in the app was enumerated
(`grep -rhoE 'to="/[a-z/:-]*"' src | sort -u`) and checked against App.jsx routes.
All 17 resolve (bare `/notebook` lands on its redirect). The one dead link that
existed — TodayCard's `/review` — was already fixed in the note-25 pass.

## Found but NOT fixed (out of scope — behavior changes)
- **ExamplesStep ignores `hmongExample`:** ~~consonant lessons' items use
  `{ hmong, hmongExample }` but the renderer shows `it.english`~~ — **FIXED in a
  follow-up the same day** (owner approved it as a deliberate change outside
  Slice B). The renderer now falls through per field family:
  ```jsx
  <span>{it.english || it.hmongExample}</span>          // gloss OR example word
  {(it.note || it.englishSound) && <p>{it.note || it.englishSound}</p>}
  ```
  Why `||` fallbacks instead of normalizing the data: the two lesson families
  (vocab lessons carry `english`/`note`, consonant lessons carry
  `hmongExample`/`englishSound`) are both valid hand-edited shapes, and the
  house rule is that data files stay simple — so the RENDERER absorbs the
  variance, not the data. The Slice A example words (Nplooj, Ntshai, Hnyav…)
  now display in the lesson player.
- **dual-consonants "Chiaj"** example and empty `englishSound` fields — content
  work, tracked in [27-content-fill-slice-a.md](27-content-fill-slice-a.md).

## How to extend / rerun this slice
The whole slice is four greps and can be rerun any time the codebase feels dusty:
1. `grep -rn "PLACEHOLDER" src/` — content stubs (case-sensitive!)
2. `grep -rnE 'text-\[#|bg-\[#|stroke="#' src/` — theme-escaping colors
3. `grep -rhoE 'to="/[a-z/:-]*"' src | sort -u` — link targets vs App.jsx routes
4. For any suspected-dead file: grep its importers, then `git rm`, then build.

## Files
- `src/pages/Review.jsx` — **deleted** (git rm)
- `src/pages/Lesson.jsx` — AudioButton import + ExamplesStep fix
