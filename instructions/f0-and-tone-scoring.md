# Building the Tone Scorer — F0 Extraction, Normalization, DTW

A build guide, written to be typed in by hand. Every section explains **why**
before **how**, because the traps here are conceptual, not syntactic.

Prerequisite reading: `notes/future-implementations/01-pronunciation-dataset.md`
(the design), `notes/19-speech-testing.md` (why calibration matters).

---

# Part 0 — Where the audio already is

Nothing is saved anywhere today. `usePronunciation` keeps the take in memory
and drops it on refresh:

```js
rec.onstop = () => {
  const blob = new Blob(chunksRef.current, { type: rec.mimeType })
  setClip({ url: URL.createObjectURL(blob), blob })
}
```

| what | it is | use it for |
|---|---|---|
| `clip.blob` | the real audio bytes | **F0 analysis, upload** |
| `clip.url` | `blob:` pointer into memory | `new Audio()` playback only |

`clip.url` is revoked on the next take. Don't store it, don't send it anywhere —
it means nothing outside this tab.

---

# Part 1 — Blob → numbers

`decodeAudioData` handles webm/opus, mp4/aac, ogg — whatever the browser
recorded. You get back raw PCM.

```js
// src/lib/audioSamples.js
export async function blobToSamples(blob, targetRate = 16000) {
  const buf = await blob.arrayBuffer()

  // OfflineAudioContext resamples for free during decode. F0 for speech never
  // needs 48 kHz — 16 kHz is plenty (see Part 2), and it makes every later
  // loop 3× cheaper.
  const tmp = new AudioContext()
  const decoded = await tmp.decodeAudioData(buf)
  tmp.close()

  const off = new OfflineAudioContext(
    1,
    Math.ceil(decoded.duration * targetRate),
    targetRate
  )
  const src = off.createBufferSource()
  src.buffer = decoded
  src.connect(off.destination)
  src.start()
  const rendered = await off.startRendering()

  return { samples: rendered.getChannelData(0), rate: targetRate }
}
```

`samples` is a `Float32Array`, values roughly −1…1. That's your input.

> **Trap:** `decodeAudioData` is one-shot — it *detaches* the ArrayBuffer. If you
> need the bytes again (e.g. to upload), call `blob.arrayBuffer()` a second time
> rather than reusing the variable.

---

# Part 2 — Framing

Pitch isn't a property of a recording, it's a property of a *moment*. So you
chop the signal into overlapping frames and get one F0 per frame.

```
window  ~45 ms   long enough to contain 2+ cycles of the lowest pitch you care about
hop     ~10 ms   how far you slide — gives 100 F0 values per second
```

Why those numbers, concretely:

- Lowest F0 you'll see in Hmong speech ≈ **75 Hz** → one cycle = 13.3 ms. YIN
  needs at least two full cycles in the window to lock on, so ≥ 27 ms. 45 ms is a
  safe margin.
- Highest ≈ **350 Hz** → one cycle = 2.9 ms = 46 samples at 16 kHz. Plenty of
  resolution. This is why 16 kHz is enough — you're never measuring anything
  above ~400 Hz.
- 10 ms hop is the speech-analysis convention. A Hmong syllable runs ~150–400 ms,
  so you get 15–40 points per syllable — enough to see a contour shape.

```js
const WINDOW = Math.round(0.045 * rate)   // 720 samples @ 16 kHz
const HOP    = Math.round(0.010 * rate)   // 160 samples

for (let i = 0; i + WINDOW <= samples.length; i += HOP) {
  const frame = samples.subarray(i, i + WINDOW)
  const f0 = yin(frame, rate)   // Part 3
}
```

`subarray` is a **view**, not a copy — no allocation per frame. Use it, not
`slice`.

---

# Part 3 — YIN

## The idea

A periodic signal looks like itself one period later. So: for each candidate lag
τ, measure how *different* the signal is from itself shifted by τ. The lag with
the smallest difference is the period; F0 = rate / τ.

That's plain autocorrelation. YIN is autocorrelation plus three fixes that
between them eliminate most octave errors. Each fix matters — skip one and you'll
be debugging weird results.

## Step 1 — Difference function

```js
function differenceFunction(frame, maxLag) {
  const d = new Float32Array(maxLag)
  for (let tau = 1; tau < maxLag; tau++) {
    let sum = 0
    for (let i = 0; i + tau < frame.length; i++) {
      const delta = frame[i] - frame[i + tau]
      sum += delta * delta
    }
    d[tau] = sum
  }
  return d
}
```

Squared difference, not product. `d[tau]` dips toward zero at the true period.

## Step 2 — Cumulative mean normalization ← *the important one*

Raw `d[tau]` is always ~0 at τ=0 and tends to grow, so a naive minimum picks
tiny lags — you'd report pitch an octave (or three) too high. YIN divides each
value by the running mean of everything before it:

```js
function cumulativeMeanNormalized(d) {
  const cmnd = new Float32Array(d.length)
  cmnd[0] = 1
  let runningSum = 0
  for (let tau = 1; tau < d.length; tau++) {
    runningSum += d[tau]
    cmnd[tau] = d[tau] * tau / runningSum
  }
  return cmnd
}
```

Now a value near 0 means "much better than average", which is scale-free and
comparable across lags. **This single step is the difference between YIN and
plain autocorrelation.**

## Step 3 — Absolute threshold

Don't take the global minimum. Take the **first** lag that drops below a
threshold — that's the fundamental. Later dips are its harmonics, and a global
minimum will sometimes prefer one, giving you half the true pitch.

```js
const THRESHOLD = 0.15   // 0.10 strict … 0.20 permissive

for (let tau = minLag; tau < maxLag; tau++) {
  if (cmnd[tau] < THRESHOLD) {
    while (tau + 1 < maxLag && cmnd[tau + 1] < cmnd[tau]) tau++  // walk to local min
    return { f0: rate / parabolic(cmnd, tau), confidence: 1 - cmnd[tau] }
  }
}
return { f0: 0, confidence: 0 }   // unvoiced — see Part 4
```

## Step 4 — Parabolic interpolation

τ is an integer, so F0 is quantized. At 16 kHz, τ=80 → 200.0 Hz and τ=81 →
197.5 Hz — a 2.5 Hz step you'd see as a staircase in the contour. Fit a parabola
through the three points around the minimum for a sub-sample estimate:

```js
function parabolic(c, tau) {
  if (tau <= 0 || tau >= c.length - 1) return tau
  const a = c[tau - 1], b = c[tau], g = c[tau + 1]
  const denom = 2 * (2 * b - g - a)
  return denom === 0 ? tau : tau + (g - a) / denom
}
```

Cheap, and it visibly smooths the curve.

## Putting it together

```js
// src/lib/yin.js
const F0_MIN = 75
const F0_MAX = 350

export function yin(frame, rate, threshold = 0.15) {
  const minLag = Math.floor(rate / F0_MAX)   // 45 @ 16 kHz
  const maxLag = Math.floor(rate / F0_MIN)   // 213 @ 16 kHz

  const d = differenceFunction(frame, maxLag)
  const cmnd = cumulativeMeanNormalized(d)

  for (let tau = minLag; tau < maxLag; tau++) {
    if (cmnd[tau] < threshold) {
      let t = tau
      while (t + 1 < maxLag && cmnd[t + 1] < cmnd[t]) t++
      return { f0: rate / parabolic(cmnd, t), confidence: 1 - cmnd[t] }
    }
  }
  return { f0: 0, confidence: 0 }
}
```

Bounding the search to `minLag…maxLag` is not just speed — it's a correctness
guard. It makes octave errors outside the human range structurally impossible.

---

# Part 4 — Voiced / unvoiced

Roughly half your frames have no pitch at all: silence, and unvoiced consonants
(`s`, `x`, `f`, `h`, the aspiration in `ph`/`th`). These return `f0: 0`.

**Never let them into the contour.** A zero between two 200 Hz frames looks like a
catastrophic pitch drop and will wreck both the plot and the score.

```js
export function extractContour(samples, rate) {
  const WINDOW = Math.round(0.045 * rate)
  const HOP = Math.round(0.010 * rate)
  const points = []

  for (let i = 0; i + WINDOW <= samples.length; i += HOP) {
    const frame = samples.subarray(i, i + WINDOW)

    // Energy gate first — YIN on silence is wasted work and occasionally
    // returns a confident answer for room noise.
    let energy = 0
    for (let j = 0; j < frame.length; j++) energy += frame[j] * frame[j]
    if (Math.sqrt(energy / frame.length) < 0.01) continue

    const { f0, confidence } = yin(frame, rate)
    if (f0 > 0 && confidence > 0.5) {
      points.push({ t: i / rate, f0 })
    }
  }
  return points
}
```

You now have `[{t, f0}, …]` — gaps where the voice wasn't. Gaps are *information*;
don't interpolate them away.

### Median smoothing

Even good YIN throws the occasional single-frame octave jump. A 3-point median
filter kills isolated spikes while preserving real contour movement (a mean
filter would smear the real movement too):

```js
export function medianSmooth(points, k = 3) {
  const half = Math.floor(k / 2)
  return points.map((p, i) => {
    const win = points.slice(Math.max(0, i - half), i + half + 1).map((x) => x.f0)
    win.sort((a, b) => a - b)
    return { ...p, f0: win[Math.floor(win.length / 2)] }
  })
}
```

---

# Part 5 — Normalization ← *the step that makes scoring possible at all*

**This is the most important section in the guide.**

Raw Hz cannot be compared across speakers. Your reference might sit at 120 Hz,
a learner at 210 Hz. Same tone, totally different numbers. Compare raw Hz and
you are scoring *voice similarity*, not pronunciation — which is exactly the
trap that makes naive pronunciation scorers useless.

Two conversions fix it:

**1. Hz → semitones.** Pitch perception is logarithmic. A 20 Hz move at 100 Hz is
huge; at 300 Hz it's nothing. Semitones make the axis perceptual, so the same
*musical* interval is the same *number* everywhere.

**2. Center on the speaker's own median.** Subtracting each speaker's median puts
both voices on a shared axis where 0 = "this person's neutral pitch". A high
voice and a low voice producing the same tone shape now produce the *same curve*.

```js
export function normalizeContour(points) {
  if (points.length === 0) return []

  const sorted = [...points].map((p) => p.f0).sort((a, b) => a - b)
  const median = sorted[Math.floor(sorted.length / 2)]

  return points.map((p) => ({
    t: p.t,
    // 12 * log2(f/median) — semitones relative to this speaker's own centre
    st: 12 * Math.log2(p.f0 / median),
  }))
}
```

Median, not mean — one octave-error outlier would drag a mean and shift the
entire curve.

After this, the y-axis is **semitones from the speaker's own neutral**, and the
two curves are genuinely comparable. Plot this, not Hz.

---

# Part 6 — DTW alignment

People speak at different speeds. The learner's "nyob zoo" might run 900 ms
against your 600 ms. Compare index-to-index and you'd penalize *timing* as if it
were *tone*.

Dynamic Time Warping finds the cheapest monotonic alignment between two
sequences — stretching and compressing time as needed — and returns the residual
distance.

```js
// src/lib/dtw.js
export function dtw(a, b) {
  const n = a.length, m = b.length
  if (!n || !m) return Infinity

  // cost[i][j] = cheapest alignment of a[0..i] with b[0..j]
  let prev = new Float64Array(m + 1).fill(Infinity)
  let curr = new Float64Array(m + 1)
  prev[0] = 0

  for (let i = 1; i <= n; i++) {
    curr[0] = Infinity
    for (let j = 1; j <= m; j++) {
      const cost = Math.abs(a[i - 1] - b[j - 1])
      curr[j] = cost + Math.min(
        prev[j],      // insertion  — learner held a pitch longer
        curr[j - 1],  // deletion   — learner moved faster
        prev[j - 1]   // match      — steps together
      )
    }
    ;[prev, curr] = [curr, prev]
  }

  // Normalize by path length so long phrases aren't penalized for being long.
  return prev[m] / (n + m)
}
```

Two rolling rows instead of a full matrix — O(n·m) time, O(m) space. For 1-second
clips that's ~100×100, instant.

> **Constrain it if you see weirdness.** Unconstrained DTW can align one frame to
> fifty (a "singularity"). A Sakoe-Chiba band — refuse alignments more than ~30
> frames apart — prevents it. Add it only if you actually observe the problem.

---

# Part 7 — Score

```js
export function toneScore(refContour, userContour) {
  const ref = normalizeContour(medianSmooth(refContour)).map((p) => p.st)
  const usr = normalizeContour(medianSmooth(userContour)).map((p) => p.st)
  if (ref.length < 5 || usr.length < 5) return null   // too short to judge

  const distance = dtw(ref, usr)          // mean semitone error, roughly
  const score = 100 * Math.exp(-distance / 3)
  return Math.round(Math.max(0, Math.min(100, score)))
}
```

Why `exp(-d/3)`: it maps 0 semitones → 100, ~2 st → 51, ~4 st → 26, and never
goes negative. The `3` is a **feel** constant — the single knob you'll tune once
you have real takes to look at.

## Do not gate on this yet

You said 80% to pass. The problem isn't the number, it's the ordering: **a score
means nothing until it's calibrated**, and today you have no data to calibrate
against. Set the gate now and you can't tell whether 80% is trivially easy
(everyone passes, the feature is decoration) or near-impossible (nobody passes,
it's infuriating). Both fail silently, and a score people stop trusting is very
expensive to win back.

Sequence that avoids it:

| Phase | Ship | Gate? |
|---|---|---|
| 1 | Overlay chart, no number | no |
| 2 | Score shown as a hint next to the curves | no |
| 3 | Collect ~200 takes, plot the distribution, set the threshold where *your ear* says pass/fail | **yes** |

Phase 3 is a 20-minute job once you have the takes — and it turns 80% from a
guess into a measurement.

---

# Part 8 — Reference contours (pre-extract, don't recompute)

Never run F0 on the reference in the browser. Compute once, store the array.

```js
// scripts/audio/contours.mjs — run with node, writes src/data/contours.json
// Node has no AudioContext, so decode with ffmpeg to raw f32 first:
//   ffmpeg -i in.mp3 -ac 1 -ar 16000 -f f32le out.raw
//
// Reuse the SAME yin.js / extractContour the app uses. If the reference is
// analysed by different code than the learner, you are comparing two
// measurement systems, not two performances.
```

Output shape:

```json
{
  "vocabulary/timeframes/hmong-time-teev.mp3": {
    "rate": 16000,
    "points": [[0.12, 143.2], [0.13, 145.9], ...]
  }
}
```

Store **raw Hz**, not normalized semitones — normalization is cheap and belongs
at compare time, so you can change the formula later without re-extracting
everything.

---

# Part 9 — Saving clips for training

You want the corpus. Three decisions are **irreversible once collection
starts** — they cannot be retrofitted onto data you already have.

### 1. Consent, and therefore an account

Voiceprints are biometric data (Illinois BIPA and similar). Storing voice +
quality labels needs explicit, documented, purpose-scoped consent covering model
training and any future licensing.

Guests can currently reach Speak. A guest recording is audio you **cannot legally
use and cannot attribute to a speaker** — so recording must require an account,
independent of whether the rest of the guest wall is on. This is why Accounts is
correctly sequenced before the corpus in your roadmap.

### 2. Store the failures

Your instinct will be to keep the good takes. **Invert it.** Near-native audio
overlaps with abundant native data and is the *least* valuable thing you can
collect. Labeled *learner errors* are scarce, and for Hmong tone they effectively
don't exist anywhere.

So: below `PASS_SCORE` means **store and move on**, never *store nothing*. Log
low-confidence and rejected takes too — automated pipelines discard exactly the
worst pronunciations, which deletes the data you most want.

### 3. Provenance on every row

```sql
create table utterances (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users,
  consent_version text not null,        -- WHICH consent they agreed to
  storage_path   text not null,         -- supabase storage object
  target_text    text not null,         -- what they were asked to say
  target_audio   text not null,         -- which reference they heard
  dialect        text not null,         -- 'white' | 'green' — you already collect this
  score          int,                   -- null = rejected/low-confidence, KEEP IT
  f0_points      jsonb,                 -- their contour, so you can re-score offline
  scorer_version text not null,         -- 'yin-dtw-v1' — labels are only as good as this
  device         jsonb,                 -- ua, sample rate, mime
  created_at     timestamptz default now()
);
```

`scorer_version` is the one people skip and regret. When you improve the scorer,
every old label was produced by a *different* system. Without that column you
can't tell which labels to trust, and you can't retrain without inheriting the
old scorer's mistakes.

Storing `f0_points` means you can re-score the whole corpus offline after a
scorer change without touching the audio.

### Dialect is already half-wired

`dialectPreference` (`'white' | 'green'`) already exists on the user and
persists to Supabase — but nothing reads it, so every prompt is White Hmong
regardless. Before recording starts, either filter prompts by dialect or stamp
the **target's** dialect alongside the speaker's, so a mismatch is visible in the
data instead of silently mixing dialects.

### Upload

```js
const path = `utterances/${userId}/${crypto.randomUUID()}.webm`
await supabase.storage.from('speech').upload(path, clip.blob, {
  contentType: clip.blob.type,
})
```

Upload the **original blob**, not the 16 kHz analysis version. Downsampling is
lossy and irreversible; keep the best copy you captured and derive from it.

---

# Part 10 — How many clips, and which ones

Two different jobs people conflate. They need different data and happen at
different times:

| | **Eval set** | **Calibration set** |
|---|---|---|
| Question | Does the scorer measure tone at all? | Where does the pass line go? |
| Built by | You, deliberately | Real users, passively |
| Size | ~16 to start, ~50 good | ~200 takes |
| When | **Now**, before any UI | After phase 1 ships |

Only the eval set blocks you. Build it first.

## The minimum viable eval set: 16 clips

One syllable, all eight tones, from each speaker:

```
po  pob  poj  pov  pos  pog  pom      ← 7 marked + 1 unmarked = 8
    × native speaker                  = 8 clips
    × you                             = 8 clips
                                      = 16 total, ~15 minutes
```

That's enough to validate the whole pipeline, because minimal pairs give you
enormous leverage: **8 recordings yield 64 pairwise comparisons.** Score every
tone against every other tone and you get a confusion matrix.

What the matrix must show:

```
              ref pob   ref poj   ref pov
user pob        ~100      LOW       LOW      ← diagonal high
user poj        LOW      ~100       LOW
user pov        LOW       LOW      ~100
```

- **Diagonal ~100** — same tone, different speakers, different genders. This is
  the normalization working. If the diagonal is low, Part 5 is broken.
- **Off-diagonal clearly lower** — different tones. If off-diagonal is also high,
  you aren't measuring tone, you're measuring "is this speech."

Those two properties are the entire test. Neither needs a large dataset, and
both fail loudly.

## Scaling up: ~48 clips

Three base syllables instead of one — pick ones with different vowels and
different initial consonants, e.g. `po`, `ka`, `tsi`. That catches bugs where
the scorer works on an open vowel but falls apart after an aspirated consonant.

```
3 syllables × 8 tones × 2 speakers = 48 clips
```

Diminishing returns past that for *validation*. More clips help training later,
not the "does it work" question.

## Deliberate errors beat "me saying it badly"

You said you'd record yourself as the "off" example. Sharpen that — instead of
vaguely bad, record **named** error types, so the label is objective rather than
a feeling:

| Label | What you do | Why it matters |
|---|---|---|
| `correct` | your best attempt | should score high |
| `flat` | say it with no pitch movement | **the classic English-speaker error** |
| `wrong-tone` | say `pob` when target is `poj` | should score low, and you know exactly why |
| `right-tone-slow` | correct contour, 2× duration | should stay **high** — tests DTW |

That last row is the sneaky one. If `right-tone-slow` scores badly, your DTW
isn't doing its job and you're penalizing tempo as if it were tone.

24 error clips (3 syllables × 4 error types × 2 takes) is plenty.

## Annotating

Keep it boring — a JSON file next to the audio:

```json
[
  { "file": "eval/native-pob.mp3",  "speaker": "native-f-50s", "target": "pob", "label": "correct" },
  { "file": "eval/me-pob-flat.mp3", "speaker": "me-m-20s",     "target": "pob", "label": "flat" }
]
```

`speaker` matters more than it looks — it's what lets you check that scores
aren't drifting by voice. If every `native-f-50s` clip scores higher than every
`me-m-20s` clip regardless of label, normalization is leaking voice identity.

## On the male/female gap specifically

Semitones already handle it, and it's worth seeing why. Say the native speaker
sits at 220 Hz and you sit at 110 Hz — exactly one octave apart:

```
12 * log2(220/220) = 0      ← her median → 0
12 * log2(110/110) = 0      ← your median → 0
```

Both centre on zero. And because semitones are logarithmic, a rise of *the same
musical interval* is the same number for both of you — her 220→277 Hz and your
110→139 Hz are both **+4 semitones**, despite differing by 63 Hz vs 29 Hz in raw
terms. That is precisely why the unit conversion in Part 5 is not optional.

**One thing to resist:** if the curves still don't line up, the tempting next
move is full z-scoring — divide by the standard deviation as well as centring.
Don't, at least not first. Dividing by range normalizes away *how far* the pitch
moved, and in a tone language the size of the excursion is meaningful — it's
part of what separates a high tone from a mid one. Median-centring alone
preserves interval sizes. Only reach for range normalization if you have
evidence you need it.

---

# Build order

1. `src/lib/yin.js` — `yin()`, `extractContour()`, `medianSmooth()`
2. Test on your **own reference mp3s** first. You know what they should look
   like: a `-b` word should sit high and flat, a `-j` word should fall. If the
   curves don't match your ear, the bug is here — fix it before going further.
3. `src/lib/dtw.js` + `normalizeContour()`
4. Sanity check: score a reference **against itself** → must be ~100. Then score
   `pob` against `poj` → must be clearly lower. If those two don't hold, nothing
   downstream will work.
5. Wire into `PronounceStep`, render the overlay
6. *Then* accounts → consent → storage

Step 4 is the one to insist on. Two assertions, and they catch almost every
scoring bug before it reaches a user.
