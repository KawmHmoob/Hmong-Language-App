# Audio Placeholder

## What
Every Hmong term in the app gets an `<AudioButton />` next to it. If the term has an `audioFile`, the button is enabled and (currently) console-logs the filename on click. If not, the button is disabled with a "Audio coming soon" tooltip.

## Files
- `src/components/common/AudioButton.jsx` — speaker pill button
- `src/hooks/useAudio.js` — placeholder play function

## Why
- **Wire the UI before the assets** — putting the button everywhere now means when audio files arrive we only swap one function in `useAudio`, not 30 component sites.
- **Disabled-but-visible** — keeping the button rendered (just dimmed) for words without audio shows the user that audio is coming, instead of silently doing nothing.

## Code anatomy

### AudioButton API

```jsx
<AudioButton audioSrc={word.audioFile} wordId={word.id} size="sm" />
```

Props:
- `audioSrc` — filename (or full URL). Falsy → disabled state.
- `wordId` — used in console log; will be useful later for analytics or per-word state.
- `size` — `'sm'` (default, 7×7) or `'lg'` (10×10).

The button uses `e.stopPropagation()` in its handler so it works inside a parent `<button>` or `<Link>` without bubbling the click:

```jsx
onClick={(e) => {
  e.stopPropagation()
  if (enabled) play(audioSrc, wordId)
}}
```

### useAudio hook

```js
// src/hooks/useAudio.js
export function useAudio() {
  const [playing, setPlaying] = useState(null)

  const play = useCallback((src, wordId) => {
    if (!src) {
      console.warn('[audio] no source for', wordId)
      return
    }
    console.log(`Playing audio: ${src}`)
    setPlaying(src)
    setTimeout(() => setPlaying(null), 400)
  }, [])

  return { play, playing }
}
```

The `playing` state is exposed but not currently used — once you add real audio, you can read it from any component to show "now playing" UI.

## Wiring real audio

In `useAudio.js`, replace the body of `play`:

```js
const play = useCallback((src, wordId) => {
  if (!src) return
  const audio = new Audio(`/audio/${src}`)   // public/audio/<src>
  audio.play().catch((e) => console.warn('audio play failed', e))
  setPlaying(src)
  audio.onended = () => setPlaying(null)
}, [])
```

For tap-spam responsiveness, cache `Audio` instances in a ref/Map and reset `currentTime = 0` before replaying.

See [instructions/audio-files.md](../instructions/audio-files.md) for the file naming convention and where to put MP3s.

## Where AudioButton is mounted

- `Alphabet.jsx` — consonant grid, vowel grid, tone rows
- `vocabulary/VocabList.jsx` — list rows
- `vocabulary/Flashcard.jsx` — front of card
- `vocabulary/WordDetail.jsx` — header (uses `size="lg"`)
- `quiz/QuizEngine.jsx` — multiple-choice prompts

To add it to a new place: import, then drop `<AudioButton audioSrc={...} wordId={...} />` next to the Hmong text.
