# Pronunciation Feature — APIs & Services How-To

A practical guide to the external pieces you need to build the record-your-voice /
compare-to-native feature ("Natulang for Hmong"). This is the **services/API** layer —
for the in-app code (hooks, components, wiring) see
[../notes/18-pronunciation-practice.md](../notes/18-pronunciation-practice.md).

**The headline:** for a working v1 you need **zero paid APIs**. Recording and analysis
are built into the browser. The only thing that costs money is *optional* Phase 3 ML,
and even that has free tiers. Read the "What you actually need" table, then skip to the
phase you're building.

---

## What you actually need (by phase)

| Phase | Capability | Service / API | Cost |
| --- | --- | --- | --- |
| 1 | Record the mic | `MediaRecorder` (browser) | **Free, built in** |
| 1 | Play reference | your existing `/assets/audio` MP3s + `useAudio` | **Free** |
| 2 | Decode + analyze audio | `AudioContext` / Web Audio (browser) | **Free, built in** |
| 2 | Pitch detection (tone) | `pitchfinder` (npm) or hand-rolled | **Free, offline** |
| 3 | Real speech scoring | self-hosted **Meta MMS** (`wav2vec2`) | Free model, **you pay compute** |

**Do not** go shopping for a "pronunciation API." The big ones
(**Azure Pronunciation Assessment**, **Speechace**, **ELSA**) are excellent — and
**none support Hmong.** They're language-locked to English/Spanish/etc. For Hmong you
build the scoring yourself (Phase 2 DSP) or self-host an open model (Phase 3).

---

## Phase 1 — Recording (free, no API)

There is **no service to connect to.** Recording is a browser API.

- **API:** `navigator.mediaDevices.getUserMedia({ audio: true })` → `MediaRecorder`.
- **Requirements:** must run over **HTTPS** (or `localhost`). Vite dev = localhost, so
  it works out of the box. Production must be HTTPS (Vercel/Netlify give you that free).
- **Permissions:** the browser shows the mic prompt automatically on first
  `getUserMedia`. You don't register anything.
- **Output:** a `Blob` (webm/opus on Chrome/Firefox, mp4/aac on Safari). Feature-detect
  the codec with `MediaRecorder.isTypeSupported(...)`.
- **Playback of the recording:** `URL.createObjectURL(blob)` → feed to `new Audio()`.

Full working hook code is in
[../notes/18-pronunciation-practice.md](../notes/18-pronunciation-practice.md#phase-1--the-recorder-hook).
Nothing else is required for Phase 1.

## Phase 2 — Scoring (free, offline, no API)

Also **no external service.** You analyze the two clips in the browser with math.

- **Decode to samples:** `audioCtx.decodeAudioData(arrayBuffer)` turns both the
  reference MP3 and the recorded Blob into a `Float32Array` of PCM.
- **Pitch / tone (the important one for Hmong):**
  - Library: [`pitchfinder`](https://www.npmjs.com/package/pitchfinder) — MIT, pure JS,
    offline. Provides YIN, AMDF, autocorrelation. `npm i pitchfinder`.
  - Or CREPE (ML pitch model) via TensorFlow.js if you want higher accuracy — heavier,
    still free and client-side.
  - This is the **documented exception** to the no-new-packages rule (see the note).
- **Alignment:** Dynamic Time Warping (DTW) — ~30 lines of JS, no library needed.
- **Score:** map DTW distance → 0–100. Output three sub-scores: Tone (F0 shape),
  Timing (length ratio), Clarity (MFCC distance, optional).

Reference algorithms (pitch, DTW, scoring) are in the note's
[scoring-math section](../notes/18-pronunciation-practice.md#phase-2--scoring-math-pure-js-in-srclibdsp).
No account, no key, no network call — it all runs on the user's device, which also means
**no per-request cost and no privacy concerns** (audio never leaves the phone).

## Phase 3 — ML speech recognition (optional, this is where money appears)

Only needed if you want per-syllable/phoneme feedback ("your `-b` tone was flat"),
beyond pitch-contour similarity. Hmong is the hard part — most models don't cover it.

### The one model that supports Hmong: Meta MMS
- **What:** [Meta MMS](https://huggingface.co/facebook/mms-1b-all) (Massively
  Multilingual Speech), a `wav2vec2` model covering 1000+ languages **including Hmong
  Daw (`mww`)**. Also has a TTS variant. **License: CC-BY-NC** — non-commercial. Check
  licensing before shipping in a paid app; may need the commercial-friendly variant or
  a different model.
- **Why not Whisper:** OpenAI Whisper's Hmong is weak/unreliable. MMS is purpose-built
  for low-resource languages.
- **What it gives you:** transcription + forced alignment → "Goodness of Pronunciation"
  (GOP) scoring per phoneme. This is real pronunciation assessment.

### How to run it (cheapest → most control)

| Option | What | Free tier | Notes |
| --- | --- | --- | --- |
| **Hugging Face Inference API** | Call MMS over HTTP | Free tier, then usage-based | Fastest to prototype. `POST` audio, get transcript. Rate-limited on free. |
| **HF Spaces (Gradio)** | Host MMS in a free Space | Free CPU (slow); ~$0.60/hr GPU | Good for a demo/pilot; CPU is too slow for real-time. |
| **Replicate** | Run MMS via API, pay per second | Pay-as-you-go | ~pennies/call; no server to manage. |
| **Modal / RunPod / Banana** | Serverless GPU you deploy to | Small free credits | Best cost/control at scale; more setup. |
| **Self-host** | Your own GPU box (`transformers` + `torchaudio`) | — | Cheapest at high volume, most ops burden. |

**Recommended path:** prototype on **HF Inference API** (free), and if it proves out,
move to **Replicate** or **Modal** so you only pay per recording scored. Gate this
behind the **Pro tier** so the compute cost maps to paying users.

### Minimal call shape (HF Inference API)
```js
// server-side (keep the token secret — never ship it in the client bundle)
const res = await fetch(
  'https://api-inference.huggingface.co/models/facebook/mms-1b-all',
  { method: 'POST',
    headers: { Authorization: `Bearer ${process.env.HF_TOKEN}` },
    body: audioBlob }
)
const { text } = await res.json()
```
Put this behind a Supabase Edge Function or serverless route so the token stays server-
side. See [supabase-integration.md](supabase-integration.md) for where backend calls live.

---

## Text-to-speech (you probably don't need it)

Your "automated speaker" is your **pre-recorded native MP3s**, which is *better* than
TTS for a tonal language. But if you ever want synthesized Hmong (e.g. for words with no
recording):
- **Google / Azure / Amazon TTS: no Hmong.** Don't bother checking — it's not there.
- **Meta MMS-TTS** (`facebook/mms-tts-mww`) — free, open, supports Hmong Daw. Quality is
  robotic vs. a native recording. Use only as a gap-filler.
- **Best practice:** keep recording real native speakers (see
  [audio-files.md](audio-files.md)). Authentic audio is your moat.

---

## Cost summary

- **Phase 1 + 2 (record + tone scoring):** $0 in API costs, forever. All browser-native
  + one MIT npm package. This is a fully shippable, differentiated product.
- **Phase 3 (ML phoneme scoring):** free to prototype (HF), then per-recording pennies
  once hosted. Gate behind Pro so revenue covers it.
- **Hosting the app:** Vercel/Netlify free tier covers a static Vite SPA + HTTPS.

**Build order:** ship Phase 1, add Phase 2 tone scoring (this alone beats every generic
app for Hmong), and only investigate Phase 3 if users ask for finer feedback.

## Gotchas checklist
- [ ] Serve over **HTTPS** in prod (mic won't work otherwise).
- [ ] **Feature-detect** `MediaRecorder` mimeType — Safari differs from Chrome.
- [ ] Resume the `AudioContext` on a **user gesture** (iOS suspends it otherwise).
- [ ] **Revoke object URLs** after use to avoid memory leaks.
- [ ] Keep any HF/Replicate **token server-side** (Edge Function), never in the client.
- [ ] Verify **MMS license** (CC-BY-NC) before using it in the paid tier.
- [ ] Normalize pitch to **semitones relative to each speaker's mean** so a child and an
      elder saying the same tone both score well.
