# Audio playback

The old `useAudio` was a stub — it just `console.log`'d and set a flag because no audio files existed yet.

The new `useAudio` is wired up to `expo-av` so when you DO add audio files (recordings of each word), it just works.

## Usage

```jsx
const { play, playing } = useAudio()

// Local asset bundled with the app
play(require('../../assets/audio/aub.mp3'), 'animals-dog')

// Remote URL (e.g. served from a Supabase storage bucket)
play('https://your-bucket.supabase.co/.../aub.mp3', 'animals-dog')
```

`AudioButton` is the consumer-facing component — it receives `audioSrc` as a prop and disables itself when `audioSrc` is falsy. So adding audio to a word is just:

```js
// in src/data/vocabulary.js
{ id: 'animals-dog', hmongRPA: 'aub', english: 'dog', audioFile: require('../../assets/audio/aub.mp3') }
```

## Why expo-av (not the browser Audio element)?

- Works on iOS, Android, and web from one API.
- Handles audio session config (ringer mode, mixing with background music, etc.) for free.
- The web build still uses an `Audio` element under the hood, so the bundle size on web isn't bloated by native-only code.

## Permissions

Playback alone doesn't need permission. **Recording** would (`expo-av`'s `Audio.requestPermissionsAsync`). Not relevant unless you add a record-yourself feature.
