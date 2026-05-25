# Audio Files

## File location
Put MP3 (or OGG) files in `public/audio/`. Vite serves `public/` from the root, so `public/audio/dev.mp3` is fetchable at `/audio/dev.mp3`.

## Naming convention
`{category}-{english-slug}.mp3` — matches the `id` field of words. So `animals-dog.mp3` for `{ id: 'animals-dog', hmongRPA: 'dev' }`.

For alphabet: `consonant-{letter}.mp3`, `vowel-{letter}.mp3`, `tone-{markerOrName}.mp3`.

## Wiring

### Vocabulary
In `src/data/vocabulary.js`, set `audioFile: 'animals-dog.mp3'` on the relevant word object. The path `/audio/` is prepended in `useAudio`, so just the filename here.

### Alphabet / Quizzes
Currently `<AudioButton audioSrc={null} ... />` is hardcoded in those components. To enable:

1. Extend `consonants`, `vowels`, `tones` items in `src/data/alphabet.js` with an `audio` field.
2. In `src/pages/Alphabet.jsx`, change `audioSrc={null}` to `audioSrc={it.audio}`.
3. Same for tones (`audioSrc={t.audio}`).

For quiz prompts: `src/components/quiz/QuizEngine.jsx` `<MultipleChoice>` — the dataset adapter in `getQuizDataset` would need to thread the audio URL through (e.g. `{ prompt, answer, audio }`).

## Make `useAudio` actually play

Replace the body of `play` in `src/hooks/useAudio.js`:

```js
const play = useCallback((src, wordId) => {
  if (!src) return
  const audio = new Audio(`/audio/${src}`)
  audio.play().catch((e) => console.warn('audio play failed', e))
  setPlaying(src)
  audio.onended = () => setPlaying(null)
}, [])
```

If you want playback to feel responsive on repeated taps, cache the `Audio` instance per src in a ref/Map and call `.currentTime = 0; .play()` on subsequent taps.

## License note
If audio comes from a third party (a textbook publisher, etc.), confirm you have rights to redistribute before checking files into the repo. For non-redistributable assets, host them in a private bucket and load via signed URLs.
