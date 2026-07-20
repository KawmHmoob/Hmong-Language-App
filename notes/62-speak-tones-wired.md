# Wiring the Tones into Speak — First End-to-End Record → Score

## What
The **Eight Tones** are now a Speak group at `/speak`, and it's the **first
place record → score works end to end** — because every tone entry has a real
native recording behind it, unlike the older phrase groups (which are still
`audio: ''` and fall back to self-curve-only).

Open Speak → "The Eight Tones" → any tone → hear it, record yourself, and the
pitch overlay + score appear.

## Why tones first
Everything else in Speak (`speak-greetings`, `speak-politeness`, …) has no
recording yet, so it can't be scored — only the learner's own curve draws. The
tone recordings are the ONE set that already exists natively, so wiring them is
the shortest path to a working, scoreable Speak. It's also the most valuable
content: tone is the whole reason the scorer exists.

## How it's built — derived, not hand-typed
```js
import { tones } from './reference.js'

const toneSpeakGroup = {
  id: 'speak-tones',
  phrases: tones.map((t) => ({
    id: `speak-tone-${t.marker || 'mid'}`,
    hmong: t.example2,          // 'Cim Siab', 'Cim Ntuj', … (NOT 'po…')
    english: `${t.name} tone`,
    audio: t.audio,             // '/assets/audio/tones/hmong-tone-<marker>.mp3'
    tip: t.description,
  })),
}
```

Deriving from `reference.js` means the audio paths and tone names can't drift
from the tone table — the same single-source discipline as the vowel drills
(notes/60) and the quiz menu themes (notes/53). Change a tone's audio in
reference.js and Speak follows.

The empty-marker (mid) tone maps its id to `speak-tone-mid` and its file to
`hmong-tone-none.mp3`, matching how reference.js special-cases the unmarked tone.

## ⚠️ The one thing to verify: the `hmong` display text
`hmong` is set to `example2` — the tone's demonstration name (`Cim Siab`,
`Cim Ntuj`, …). This is a **best-effort guess from the data**, because the
build can't hear the recordings. Two things to check by ear and fix if wrong:

1. **Does the clip say "Cim Siab" or just "Siab"?** If the recording is only the
   demonstration word, trim the `Cim ` prefix — but do it in `reference.js`'s
   `example2` so both Reference and Speak stay consistent.
2. **Does the clip match the tone at all?** If `hmong-tone-b.mp3` doesn't sound
   high, the recording was mis-saved — the `/tone-eval` matrix will also catch
   this (a tone that doesn't peak on its own diagonal).

The `id`s are safe regardless — they key off the tone marker, not the display
text, so fixing the words never touches progress keys.

## The React bug this shipped alongside
`ToneCurve` took a prop named `ref`. **`ref` is reserved in React** — passing it
to a plain function component (not `forwardRef`) silently drops it, so
`result.ref` never arrived and the native line would never have drawn. Renamed
to `refCurve` everywhere. If you ever see a curve component draw only the
learner line, check for a reserved prop name first.

## The scoring path, end to end
```
Speak → SpeakPhrase (route /speak/:phraseId) → PronounceStep
  phrase.audio = '/assets/audio/tones/hmong-tone-b.mp3'
  → user records → clip.blob
  → scoreTake(blob, phrase.audio)
       ├ fetch + extract the REFERENCE contour (cached per session)
       └ extract the USER contour
  → toneScore → { score, ref, user }
  → <ToneCurve refCurve={ref} user={user}/> + <ScoreBadge/>
```

No new plumbing — this is the pipeline from notes/61, now fed by a phrase that
actually has a reference.

## What to expect on a real take
- Record the **same tone** the native says → curves roughly overlay, score high.
- Deliberately say it **flat** → your line stays level while the native moves →
  score drops. That divergence IS the feedback.
- The reference contour is extracted in-browser on first play of each tone and
  cached, so the first score on a given tone is a beat slower than the rest.

## Not a gate (still)
Same stance as notes/61: the score shows, colored by band, but never blocks
"Next". 80%-to-pass waits for calibration against real takes. Don't wire a
threshold here until the distribution exists.

## Files
- `src/data/speak.js` — `toneSpeakGroup`, derived from `reference.js`; first group
- `src/components/speak/ToneCurve.jsx` — `ref` → `refCurve` fix
- `src/components/speak/PronounceStep.jsx` — call site updated
- unchanged but load-bearing: `src/lib/{pronounceScore,yin,toneScore,audioSamples}.js`
