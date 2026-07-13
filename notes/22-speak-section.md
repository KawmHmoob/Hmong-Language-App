# Speak Section — Record & Compare (Phase 1)

## What
The **Speak** front door (`/speak`): a hub of Hmong phrases grouped by topic, each
opening a practice screen (`/speak/:phraseId`) with the natulang-style loop —
**Listen** (native MP3, when one exists) → **Record** your voice → **hear your take**
→ **A/B compare** → self-rate. Recording shows a live mic level meter. Pro phrases sit
behind the existing paywall. Practicing a phrase awards XP/streak through the existing
progress system.

This is **Phase 1 of [18-pronunciation-practice.md](18-pronunciation-practice.md)**:
the loop without automatic scoring. The DSP tone score (Phase 2) plugs into
`PronounceStep` later; how we'll *validate* that score is
[19-speech-testing.md](19-speech-testing.md).

## Why
- Production (saying it aloud) is the gap none of the text exercises close, and it's
  the app's paid differentiator.
- Self-rating ships **now** with zero ML risk; a flaky automatic score would be worse
  than none (see note 19's "scoring honesty").
- No context changes needed: a practiced phrase is just a `completedSteps` entry, so
  progress/XP/streak came for free.

## Files
- `src/data/speak.js` — **new** phrase groups + helpers (`allPhrases`, `getPhrase`,
  `adjacentPhrases`, `speakStepId`); schema documented in the file header
- `src/hooks/usePronunciation.js` — **new** mic recording hook
- `src/components/speak/LevelMeter.jsx` — **new** canvas level meter
- `src/components/speak/PronounceStep.jsx` — **new** the practice loop UI
- `src/pages/Speak.jsx` — **new** hub
- `src/pages/SpeakPhrase.jsx` — **new** practice screen (routing/paywall/progress)

## Code anatomy

**The hook is a 4-state machine** — components render off `status`:

```
'idle' ──start()──▶ 'recording' ──stop()──▶ 'idle' (+ clip)
   │ getUserMedia rejected
   ▼
'denied'          'unsupported' (no MediaRecorder at all — old browsers)
```

```js
// usePronunciation.js — the shape
const { status, clip, analyser, start, stop, supported } = usePronunciation()
// clip     = { url, blob } — url goes straight into new Audio(url)
// analyser = Web Audio AnalyserNode, non-null only while recording
```

Three deliberate choices inside:
1. **Module-level `sharedStream` / `sharedCtx`** (same pattern as `useAudio`'s cache):
   the mic permission prompt happens once per session, and there's one AudioContext
   ever (browsers cap them). `ctx.resume()` is called inside `start()` because iOS
   suspends AudioContexts until a user gesture — and `start()` *is* one.
2. **Codec feature-detection** — `MediaRecorder.isTypeSupported()` walks
   webm/opus → webm → mp4 → ogg, because Chrome/Firefox and Safari disagree.
3. **Object-URL hygiene** — every new take revokes the previous take's URL
   (`URL.revokeObjectURL`), or long practice sessions leak memory.

**The level meter reads the analyser, not React state.** 60fps through `setState`
would re-render the world; instead `LevelMeter` gets the `AnalyserNode` and draws to a
`<canvas>` in a `requestAnimationFrame` loop — RMS of the time-domain data → one
loudness value → rolling bar history. Under `prefers-reduced-motion` it drops to a
5 fps `setInterval` (same info, less flicker).

**A/B compare is just chained `ended` events:**

```js
const ref = new Audio(phrase.audio)
const take = new Audio(clip.url)
ref.onended = () => take.play()
ref.play()
```
`PronounceStep` keeps every Audio it spawns in `playersRef` and pauses them on
re-record/unmount so takes can't overlap into a chord.

**Progress = existing machinery.** Phrase ids are namespaced (`speak-nyob-zoo`), and
"👍 Sounds close" calls `markStepComplete(speakStepId(id))` — the same
`completedSteps` array lessons use, so XP (+2) and streak updates were free.
`speakStepId()` currently returns the id unchanged; it exists so every consumer
derives the key one way (and so the scheme can change in one place).

**Missing reference audio is a first-class state.** Most items have `audio: ''`
today. The UI shows "Native recording coming soon", hides Listen/AB, and the
record-and-self-review loop still works. Fill in `audio` in `speak.js` when a real
MP3 lands and the buttons appear — no code change.

## How to extend
- **Add a phrase:** append to a group in `src/data/speak.js` (unique `speak-…` id).
  Done — hub, routing, prev/next, and progress all key off the data.
- **Add a group:** new object in `speakGroups`. Order in the file = display order.
- **Make a phrase Pro:** `tier: 'pro'` on the phrase. `SpeakPhrase` already wraps
  everything in `PaywallGate`.
- **Phase 2 (tone score):** inside `PronounceStep` you have both sides —
  `phrase.audio` (reference) and `clip.blob` (learner). Decode both with
  `AudioContext.decodeAudioData`, pitch-track, DTW, and render the score where the
  "trust your ear" line sits. Algorithms + calibration workflow: notes 18 and 19.

## Gotchas
- **HTTPS required** for `getUserMedia` in production (localhost is exempt).
- Test on a real iPhone: Safari's MediaRecorder produces mp4/aac and its AudioContext
  rules are the strictest (see the device QA checklist in
  [19-speech-testing.md](19-speech-testing.md)).
- The recorded `clip.url` is a blob URL — valid for the session only; persisting
  attempts to Supabase means uploading `clip.blob`, not the URL.
