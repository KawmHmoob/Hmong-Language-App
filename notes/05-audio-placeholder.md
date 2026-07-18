# Audio playback — AudioButton + useAudio

> Was "Audio Placeholder" — the hook is fully implemented now (cached
> `HTMLAudioElement`s, real playback). See [40-audio-plumbing.md](40-audio-plumbing.md)
> for how data fields feed it and [instructions/audio-files.md](../instructions/audio-files.md)
> for adding files. This note explains **how the hook itself works**.

## What
Every Hmong term renders an `<AudioButton>`. With a source it's an enabled ♪ that
plays the clip; without one it's a disabled "Audio coming soon" button. All
playback goes through one hook, `useAudio`, which caches audio elements and
guarantees only one clip plays at a time.

## Files
- `src/hooks/useAudio.js` — the playback engine
- `src/components/common/AudioButton.jsx` — the button (calls `play`)

## The mental model: state that outlives React
The key idea is that **the audio machinery lives at module scope, not in React
state**:
```js
const cache = new Map()   // url → HTMLAudioElement, reused forever
let current = null        // the ONE element currently playing (or null)
```
Why outside React? Two reasons:
1. **The cache must survive remounts.** Components mount/unmount as you navigate;
   if the cache were `useState`/`useRef` it'd be rebuilt per component, re-fetching
   and re-decoding the same MP3 every time. Module scope = fetched once per URL for
   the life of the tab.
2. **"What's playing" is global, not per-component.** Ten `AudioButton`s each call
   `useAudio()` — that's ten hook instances. But there's only one speaker. A single
   module-level `current` lets any instance stop whatever another instance started.

React state (`playing`) is used only for *this button's own* "now playing" glow —
see the ownedSrc trick below.

## Walkthrough of `play(src, wordId)`

### 1. Resolve the source
```js
function resolveSrc(src) {
  if (!src || src === '/') return null          // nothing to play
  return src.startsWith('/') ? src : AUDIO_BASE + src
}
```
Absolute paths (`/assets/audio/x.mp3`, used by reference/speak/lessons) pass
through; bare filenames (`animals-dog.mp3`, used by vocabulary) get
`/assets/audio/` prepended. One function absorbs the two data conventions
(notes/40). `null` → the hook no-ops.

### 2. getOrCreate — the cache
```js
function getOrCreate(url) {
  let audio = cache.get(url)
  if (!audio) {
    audio = new Audio(url)
    audio.preload = 'auto'
    cache.set(url, audio)
  }
  return audio
}
```
First tap on a word builds an `Audio` and stores it; every later tap on the same
word reuses that element and just rewinds it (`currentTime = 0`). No repeat
network hit, no repeat decode — that's what makes tap-spam feel instant.

### 3. Stop whatever else is playing
```js
if (current && current !== getOrCreate(url)) {
  current.pause()
  current.currentTime = 0
}
```
`current` is the global "now playing" element. Before starting a new sound, pause
and rewind it, so two taps can't overlap into a chord. The `!== getOrCreate(url)`
guard means re-tapping the *same* word doesn't pause-then-replay awkwardly.

### 4. Start this clip and claim it
```js
const audio = getOrCreate(url)
audio.currentTime = 0
current = audio          // I am now the global current
ownedSrc.current = src   // ...and THIS hook instance owns it
setPlaying(src)          // light up THIS button's glow
```

### 5. The `ownedSrc` ref — the subtle bit you asked about
Every hook instance has `const ownedSrc = useRef(null)`. When a clip ends:
```js
const onEnded = () => {
  if (ownedSrc.current === src) setPlaying(null)  // only clear MY glow
  if (current === audio) current = null           // release the global slot
  audio.removeEventListener('ended', onEnded)      // one-shot listener
}
```
Without `ownedSrc`, here's the bug it prevents: button A starts a sound and sets
its `playing`. The sound ends and fires `onEnded`. Every mounted `useAudio`
instance would love to `setPlaying(null)` — but only **A** had its glow on. The
`ownedSrc.current === src` check ensures the *ended* event only clears the glow of
the instance that actually started *that* source. Other buttons' state is
untouched.

The listener is added per-play and removed in `onEnded` (and in the `.catch`), so
listeners don't pile up on the cached element across taps.

### 6. Play, and handle failure
```js
audio.play().catch((err) => { /* clear playing + current, remove listener */ })
```
`audio.play()` returns a promise that rejects if the browser blocks it (autoplay
policy, no user gesture, decode error). The `.catch` unwinds the same state
`onEnded` would — so a failed play doesn't leave a button stuck glowing.

### 7. Unmount cleanup
```js
useEffect(() => () => { ownedSrc.current = null }, [])
```
If the component unmounts mid-play, it drops its *claim* on the `playing` state but
**deliberately does not stop the audio** — navigating away while a word finishes
saying itself is usually what you want. The cached element and the global `current`
are untouched.

## AudioButton
Thin wrapper: `<AudioButton audioSrc={…} wordId={…} size="sm|lg" />`. Falsy
`audioSrc` → disabled state. Its handler calls `e.stopPropagation()` so tapping the
speaker inside a parent `<Link>`/`<button>` (flashcards, list rows) plays without
also triggering the row's navigation.

## Gotchas
- **`playing` reflects one button, not the app.** It's the local glow; global
  "what's playing" is the module `current`.
- **Cache is per-tab and unbounded.** Fine for a fixed word list; if the catalog
  ever gets huge, add an LRU cap to `cache`.
- **iOS autoplay:** the first `play()` must be inside a user gesture (a tap is —
  so buttons are fine; don't try to auto-play on mount).

## Where AudioButton is mounted
Reference (letter grids + tones), `VocabList` rows, `Flashcard` front,
`WordDetail` header (`size="lg"`), lesson `examples`, `PronounceStep` (Speak),
`QuizEngine` prompts.
