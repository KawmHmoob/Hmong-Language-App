# Pronunciation Practice — "Natulang for Hmong" (SCOPE / NOT BUILT YET)

Status: **Phase 1 SHIPPED** as the Speak section — see
[22-speak-section.md](22-speak-section.md) for what was actually built (standalone
`/speak` routes + `src/data/speak.js`, rather than a `'pronounce'` lesson step; the
hook is `usePronunciation` as planned). Phases 2–3 below remain the plan. This note
stays as the scope + scoring roadmap; update it as later phases land (per the rules
in [README.md](README.md)).

**What:** the learner hears a native recording, records themselves saying the same
Hmong word/phrase, hears the two back-to-back, and gets feedback on how close they
were — with a special focus on **tone**, since tone *is* meaning in Hmong.

**Why a dedicated feature:** production (saying it right) is the gap our current
exercises don't close. See the "typing/listening" backlog in
[11-future-implementations.md](11-future-implementations.md) — this is the spoken
counterpart. It's also a strong **Pro-tier** anchor (gating via the `tier` field, see
[14-paywall-and-supabase.md](14-paywall-and-supabase.md)).

---

## The one constraint that shapes everything

**There is no commercial speech API for Hmong.** Google / Azure / AWS speech-to-text
and text-to-speech do **not** support Hmong. Whisper handles it poorly. So the naive
"upload audio → get a transcript/score" approach is off the table. Two facts make the
feature viable anyway:

1. **We already have native-recorded MP3s** (`/assets/audio/`, see
   [05-audio-placeholder.md](05-audio-placeholder.md) and `useAudio.js`). The
   "automated speaker" is our existing audio asset — we do **not** need TTS.
2. **Hmong is tonal** (7–8 tones marked by final letters `-b -j -v -s -g -m -d` +
   bare/mid). Tone is the whole game, and **pitch-contour comparison is solvable with
   plain DSP** — no ML, no model training, runs in the browser. This is the unfair
   advantage: tone scoring is the highest-value signal *and* the most achievable.
   Generic apps can't do it; we can.

**Decision: v1 is DSP acoustic similarity (pitch + rhythm + spectral), NOT speech
recognition.** Do not scope phoneme-level ASR for the first release.

> **Verifying the scorer is a separate topic.** How we prove the pronunciation score
> agrees with a human (eval sets, calibration, metrics) lives in its own note:
> [19-speech-testing.md](19-speech-testing.md). That is *speech testing* — distinct from
> the app's regular text quizzes in [01-quiz-engine.md](01-quiz-engine.md).

---

## Phasing

### Phase 1 — Record & Compare (no scoring) · ~1–2 weeks
The full Natulang loop, minus the algorithm. Ships value immediately, zero ML risk.
- New step kind `'pronounce'` in the lesson model (sits beside `intro` / `examples` /
  `practice` / `mini-quiz`; see [12-lesson-system.md](12-lesson-system.md)).
- Loop: **Listen** (play reference MP3 via `useAudio`) → **Record**
  (`MediaRecorder` + `getUserMedia`) → **Hear yourself** (playback) → **A/B compare**
  (toggle reference vs. your take) → self-rate (👍 / 🔁 again).
- Waveform visual for both clips (Web Audio `AnalyserNode`).
- Persist attempts (local first, then Supabase — mirror the sync→async pattern in
  [16-sync-to-async-migration.md](16-sync-to-async-migration.md)).
- Gate the lesson behind `tier: 'pro'`.

### Phase 2 — Automatic Tone & Rhythm Score · ~2–4 weeks
The differentiator. All client-side DSP, **no backend inference.**
- Extract **pitch contour (F0)** from both clips (autocorrelation / YIN).
- Align with **DTW** (dynamic time warping) → similarity score 0–100.
- Three sub-scores: **Tone** (F0 shape match — the star), **Timing** (rhythm/length),
  **Clarity** (MFCC / spectral distance).
- UI: overlay the two pitch curves so the learner *sees* their tone drift up where it
  should fall. This visual is the "wow."

### Phase 3 — Phoneme-level feedback (optional, research spike first)
Only if Phase 2 demand justifies it. Needs **self-hosted Meta MMS** (`wav2vec2`, one
of the few models that actually supports Hmong Daw `mww`) on a GPU backend for forced
alignment / goodness-of-pronunciation per syllable. Real infra + cost — treat as a
separate project, not part of this scope.

---

## Data model change (matches the existing lesson pattern)

New step kind in `src/data/lessons.js` (document it in
[12-lesson-system.md](12-lesson-system.md) when added):

```js
//   - 'pronounce' {
//       id, title, prompt,
//       items: [{ hmong, english, audio, tone? }]   // audio = reference MP3
//     }
//   Put `tier: 'pro'` on the lesson to gate it behind the paywall.
```

Renderer: add a `'pronounce'` case in `src/pages/Lesson.jsx` (the step switch).

## Proposed new files
- `src/hooks/usePronunciation.js` — mirror of `useAudio.js`: wraps `getUserMedia` +
  `MediaRecorder`, exposes `{ start, stop, recording, lastClip }`. Module-level
  stream cache so we don't re-prompt for the mic on every step.
- `src/components/pronounce/PronounceStep.jsx` — the Listen→Record→Compare UI.
- `src/components/pronounce/PitchPlot.jsx` — (Phase 2) the two-curve overlay.
- `src/lib/dsp/` — (Phase 2) `pitch.js` (F0), `dtw.js`, `score.js`. Keep pure +
  framework-free so they're unit-testable.

## In scope vs. out

| In scope (v1–2)                    | Out of scope                       |
| ---------------------------------- | ---------------------------------- |
| Record, playback, A/B compare      | Speech-to-text / transcription     |
| Pitch-contour tone scoring (DSP)   | Word-by-word ASR correctness       |
| Rhythm + spectral similarity       | Hmong TTS generation               |
| Pro-tier gating, attempt history   | Conversation / free-speech grading |

---

## Risks & open decisions
- **`MediaRecorder` on iOS Safari** is quirky (mimeType support, autoplay rules).
  Prototype on a real iPhone in Phase 1, not at the end.
- **No-new-packages convention** (see [README.md](README.md)): Phase 2 DSP likely
  needs a pitch lib (e.g. `pitchfinder`) or a hand-rolled YIN. This is a deliberate
  **exception** — document the chosen dep and why when it lands.
- **Reference audio coverage** — every `pronounce` item needs a clean native MP3.
  Today most audio is still placeholder ([05-audio-placeholder.md](05-audio-placeholder.md)).
  This is content work that gates how much of Phase 1 is shippable. **Open question:
  how many items have real audio?**
- **Scoring honesty** — a flaky number is worse than none. Ship Phase 1 self-rating
  first; only turn on the score in Phase 2 once DTW feels right on real recordings.
- **Web vs. React Native** — there's a parallel RN build (`notes/react-native/`). The
  DSP math ports, but `MediaRecorder` does not (RN needs `expo-av`). **Open question:
  web first, or web + RN together?**

## First task when picking this up
Build the Phase 1 happy path on web: `usePronunciation` hook → `PronounceStep`
component → one real `'pronounce'` step wired into `Lesson.jsx`, using an existing
real MP3. No scoring, no Supabase yet — just prove the record/compare loop on desktop
and iPhone.

---

# Tech stack & build guide (so you can implement this by hand)

This section is the "how," with copy-pasteable code that matches our existing patterns
(`useAudio.js`, `Lesson.jsx`). Nothing here needs a new npm package for **Phase 1**.

## The browser APIs you'll use (all built in, no libraries)

| API | What it does | Phase | MDN/notes |
| --- | --- | --- | --- |
| `navigator.mediaDevices.getUserMedia({audio:true})` | Prompts for the mic, returns a `MediaStream`. | 1 | Requires **HTTPS** (or `localhost`). Vite dev is `localhost`, so fine. Prod must be HTTPS. |
| `MediaRecorder` | Records the `MediaStream` into a `Blob` (webm/opus or mp4/aac). | 1 | Codec support differs per browser — feature-detect with `isTypeSupported`. |
| `URL.createObjectURL(blob)` | Turns the recorded `Blob` into a `src` you can drop into `<audio>` / `new Audio()`. | 1 | **Must** `URL.revokeObjectURL` the old one or you leak memory. |
| `AudioContext` | The Web Audio graph. Needed to decode/analyze samples. | 1–2 | Create **one** per session; browsers cap how many exist. Resume it on a user gesture (iOS). |
| `AnalyserNode` | Real-time FFT/time-domain data → draw a live waveform/meter while recording. | 1 | `getByteTimeDomainData()` for the wiggle, `getByteFrequencyData()` for bars. |
| `audioCtx.decodeAudioData(arrayBuffer)` | Decodes an MP3 **or** a recorded Blob into a `Float32Array` of raw samples. | 2 | This is how you get PCM for both the reference and the learner clip to compare. |

Everything else (pitch detection, DTW, scoring) is plain math you write in
`src/lib/dsp/` — see Phase 2 below.

## Phase 1 — the recorder hook

`src/hooks/usePronunciation.js` — deliberately mirrors `useAudio.js` (module-level
cache so we ask for the mic **once**, not on every step):

```js
import { useCallback, useRef, useState } from 'react'

// Records the learner's mic and hands back a playable clip { url, blob }.
// Mirrors useAudio.js: a module-level stream cache so the permission prompt
// happens once per session, not once per pronounce step.

let sharedStream = null

async function getStream() {
  if (sharedStream) return sharedStream
  sharedStream = await navigator.mediaDevices.getUserMedia({ audio: true })
  return sharedStream
}

// Safari historically only supported mp4/aac; Chrome/Firefox prefer webm/opus.
// Feature-detect rather than hard-coding, then fall back to browser default.
function pickMimeType() {
  const candidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg']
  for (const t of candidates) {
    if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(t)) return t
  }
  return ''
}

export function usePronunciation() {
  const [recording, setRecording] = useState(false)
  const [clip, setClip] = useState(null) // { url, blob } | null
  const recorderRef = useRef(null)
  const chunksRef = useRef([])

  const start = useCallback(async () => {
    const stream = await getStream()
    const mimeType = pickMimeType()
    const rec = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)
    chunksRef.current = []
    rec.ondataavailable = (e) => { if (e.data.size) chunksRef.current.push(e.data) }
    rec.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: rec.mimeType })
      setClip((prev) => {
        if (prev?.url) URL.revokeObjectURL(prev.url) // don't leak the old URL
        return { url: URL.createObjectURL(blob), blob }
      })
    }
    recorderRef.current = rec
    rec.start()
    setRecording(true)
  }, [])

  const stop = useCallback(() => {
    const rec = recorderRef.current
    if (rec && rec.state !== 'inactive') rec.stop()
    setRecording(false)
  }, [])

  return { start, stop, recording, clip }
}
```

## Phase 1 — the step component

`src/components/pronounce/PronounceStep.jsx`. Plays the reference with our existing
`useAudio`, records with the new hook, plays the recording back via a plain `<audio>`:

```jsx
import { useAudio } from '../../hooks/useAudio.js'
import { usePronunciation } from '../../hooks/usePronunciation.js'

export default function PronounceStep({ step, onAdvance }) {
  const { play } = useAudio()
  const { start, stop, recording, clip } = usePronunciation()
  const item = step.items[0] // v1: one phrase per step; loop later

  return (
    <>
      <h3 className="font-serif text-2xl text-stone-900 mb-2">{step.title}</h3>
      {step.prompt && <p className="text-sm text-stone-600 mb-4 italic">{step.prompt}</p>}

      <div className="text-center my-6">
        <p className="font-medium text-clay-700 text-2xl">{item.hmong}</p>
        <p className="text-stone-600 text-sm">{item.english}</p>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {/* 1. Listen to the native reference (existing useAudio + /assets/audio MP3) */}
        <button onClick={() => play(item.audio)} className="btn-secondary">🔊 Listen</button>

        {/* 2. Record yourself */}
        {!recording ? (
          <button onClick={start} className="btn-primary">● Record</button>
        ) : (
          <button onClick={stop} className="btn-primary">■ Stop</button>
        )}

        {/* 3. Play your take back / A-B compare */}
        {clip && (
          <button onClick={() => new Audio(clip.url).play()} className="btn-secondary">
            ▶ Your take
          </button>
        )}
      </div>

      {clip && (
        <div className="mt-6 flex justify-center">
          <button onClick={onAdvance} className="btn-primary">Continue</button>
        </div>
      )}
    </>
  )
}
```

## Phase 1 — wiring into `Lesson.jsx`

Two edits in [src/pages/Lesson.jsx](../src/pages/Lesson.jsx):

1. Add the render case in the step switch (around line 81–88):
   ```jsx
   {step.kind === 'pronounce' && (
     <PronounceStep step={step} onAdvance={handleAdvance} />
   )}
   ```
2. `pronounce` provides its **own** Continue button, so suppress the default footer
   nav by adding it to the exclusion at line 91:
   ```jsx
   {step.kind !== 'practice' && step.kind !== 'mini-quiz' && step.kind !== 'pronounce' && (
   ```
   (`handleAdvance` already does step-complete + lesson-complete bookkeeping — reuse it
   as-is; no progress-tracking changes needed. See
   [03-progress-tracking.md](03-progress-tracking.md).)

Add a `'pronounce'` step to one real lesson and point `audio` at an existing MP3 in
`/assets/audio/`. That's the whole Phase 1 loop.

## Phase 2 — scoring math (pure JS in `src/lib/dsp/`)

No backend, no ML. The pipeline:

1. **Decode both clips to samples** — reference MP3 and the recorded Blob:
   ```js
   async function toSamples(audioCtx, urlOrBlob) {
     const buf = urlOrBlob instanceof Blob
       ? await urlOrBlob.arrayBuffer()
       : await (await fetch(urlOrBlob)).arrayBuffer()
     const audio = await audioCtx.decodeAudioData(buf)
     return { data: audio.getChannelData(0), sampleRate: audio.sampleRate } // Float32Array, mono
   }
   ```
2. **Pitch contour (F0)** per ~25 ms frame. Autocorrelation is the simplest workable
   estimator; upgrade to YIN later if it's noisy:
   ```js
   // returns Hz for one frame, or 0 if unvoiced/too quiet
   function detectPitch(frame, sampleRate) {
     // RMS gate — skip silence
     let rms = 0
     for (let i = 0; i < frame.length; i++) rms += frame[i] * frame[i]
     if (Math.sqrt(rms / frame.length) < 0.01) return 0
     let bestLag = -1, bestCorr = 0
     const minLag = Math.floor(sampleRate / 400) // ~400 Hz ceiling
     const maxLag = Math.floor(sampleRate / 75)  // ~75 Hz floor
     for (let lag = minLag; lag <= maxLag; lag++) {
       let corr = 0
       for (let i = 0; i < frame.length - lag; i++) corr += frame[i] * frame[i + lag]
       if (corr > bestCorr) { bestCorr = corr; bestLag = lag }
     }
     return bestLag > 0 ? sampleRate / bestLag : 0
   }
   ```
   Slide that over the signal to get an F0 array. **Normalize** each contour (subtract
   its mean in semitones) so you compare tone *shape*, not the speaker's absolute
   voice pitch — a kid and an elder saying the same tone should match.
3. **Align with DTW** so timing differences don't tank the score:
   ```js
   function dtwDistance(a, b) {
     const n = a.length, m = b.length
     const d = Array.from({ length: n + 1 }, () => new Float64Array(m + 1).fill(Infinity))
     d[0][0] = 0
     for (let i = 1; i <= n; i++)
       for (let j = 1; j <= m; j++) {
         const cost = Math.abs(a[i - 1] - b[j - 1])
         d[i][j] = cost + Math.min(d[i - 1][j], d[i][j - 1], d[i - 1][j - 1])
       }
     return d[n][m] / (n + m) // length-normalized
   }
   ```
4. **Map distance → 0–100** with a tuned curve, e.g. `score = 100 * Math.exp(-k * dist)`.
   Calibrate `k` on real recordings. Compute three: **Tone** (DTW on normalized F0),
   **Timing** (voiced-length ratio), **Clarity** (DTW on MFCC — add later).
5. **Visualize** in `PitchPlot.jsx`: draw both F0 arrays on a `<canvas>`, learner's in
   `clay-600`, reference in `stone-400`. The overlay is the selling point.

> When Phase 2 lands you'll likely want a vetted pitch lib (`pitchfinder`) instead of
> the toy autocorrelation above — that's the documented **exception** to the
> no-new-packages rule (see Risks).

## Mobile / React Native note
On web, recording is `MediaRecorder`. In the RN build (`notes/react-native/`) it is
**`expo-av`** (`Audio.Recording`) — different API, same idea: record → file URI →
playback. The DSP in `src/lib/dsp/` is pure JS and ports unchanged; only the hook
(`usePronunciation`) is platform-specific.
