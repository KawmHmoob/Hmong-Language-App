# The Tone Scorer — Shipped

## What
The Speak loop now scores pronunciation by **tone contour** and shows the
learner's pitch overlaid on the native speaker's. Record a phrase → see two
curves + a 0–100 score → try again. Built from the guide in
`instructions/f0-and-tone-scoring.md`.

Pure DSP, no ML, no new packages, client-side.

## The pipeline
```
clip.blob
  → blobToSamples()      decode + resample to 16 kHz     src/lib/audioSamples.js
  → extractContour()     YIN pitch per 45ms frame        src/lib/yin.js
  → normalizeContour()   Hz → semitones, own-median      src/lib/yin.js
  → dtw()                align, get residual distance     src/lib/toneScore.js
  → exp(-d/3) → 0–100    the score                        src/lib/toneScore.js
```

`scoreTake(blob, audioPath)` in `pronounceScore.js` is the single UI entry
point; `ToneCurve.jsx` draws the overlay.

## The two decisions that matter most

**Score pitch, not audio.** Comparing the two recordings directly would measure
"does the learner sound like this specific native speaker" — dominated by voice
identity, mic, and gender. Extracting F0 and throwing away everything else means
we compare the one thing that carries Hmong tone.

**Normalize to each speaker's own median (semitones).** This is what makes a
male learner and a female reference comparable at all. Proven in the self-test:
the same tone an octave apart scores **100**. Without this step it would score
near zero. Median-centring only — NOT z-scoring, because dividing by range would
normalize away excursion size, which is meaningful in a tone language.

## Reference contours: lazy, in-browser
The guide recommends pre-extracting reference F0 offline. That needs ffmpeg (to
decode mp3 in Node) or an mp3-decoder package — neither available, and packages
are banned. So `resolveReference()` computes the reference contour **in the
browser** from the same mp3 the Listen button fetches, and caches it per
session. F0 on a ~1s clip is a few ms; it runs at most once per phrase.

`src/data/contours.json` + `contours.js` exist as the fast path: if the offline
script ever runs, stored contours win over lazy extraction. Empty for now.

## The score is NOT a gate
There is no 80% wall enforced anywhere. The score is shown as feedback, colored
by band, and the button says "Next" regardless. This is deliberate and it's the
one thing to hold the line on:

> A score means nothing until it's calibrated, and there's no calibration data
> yet. Gate at 80% now and you can't tell if that's trivially easy or
> impossible — both fail silently, and a score people stop trusting is
> expensive to win back (notes/19).

Calibration is a phase-3 job: collect ~200 real takes, plot the distribution,
put the line where your ear agrees. Then `SCORE_K` and the threshold become
measurements instead of guesses.

## Self-test — trust the DSP before recording
`scripts/audio/tone-selftest.mjs` runs the scorer on **synthetic** sine tones
with known contours — no recordings needed. It asserts:

```
identical contour             ≈ 100   ✓ 100
same tone, octave apart       ≈ 100   ✓ 100   (normalization works)
rise vs fall, clear margin    ≥ 20    ✓ 29    (discriminates tone)
same shape spoken slowly      high    ✓ 99    (DTW absorbs tempo)
```

The margin, not the absolute, is the real assertion for rise-vs-fall: gentle
synthetic sweeps let unconstrained DTW warp opposite ramps ~29 points apart
(100 vs 71); real Hmong tones separate wider. **If real-world separation is ever
too soft, the lever is a Sakoe-Chiba band in `dtw()`** (cap how far it can warp)
— not a formula change.

Run it after any edit to yin.js or toneScore.js.

## What's left (yours)
1. **Record the eval set** — guide Part 10. 16 clips (one syllable × 8 tones ×
   2 speakers) validates the whole thing on real audio. Your male/female gap is
   the *ideal* test, not a problem.
2. **Watch the curves on real takes.** A `-b` word should sit high and flat, a
   `-j` should fall. If the curve disagrees with your ear, the bug is in
   extraction — fix before trusting scores.
3. **Then** accounts → consent → corpus storage (guide Part 9, notes/03). Three
   things there can't be retrofitted: consent, storing failures, scorer_version.

## The eval set + confusion-matrix harness
`src/data/speechEval.js` is the labeled set the scorer is checked against, and
`/tone-eval` is a **dev-only** page that runs it (renders a notice in prod, not
in nav). Node can't decode mp3 without ffmpeg, so unlike the synthetic
self-test, this harness has to run in the browser — which is why it's a route,
not a script.

### What's auto-filled vs what needs your ear
The `tones/` recordings are the `po` minimal-pair family — pob/poj/pov/po/pos/
pog/pom/pod, all 8 tones on one syllable, which is exactly the eval the guide
asks for (Part 10). Everything derivable was auto-filled: file, syllable,
marker, tone name, gloss, `speaker: 'native-f'`, and `label: 'correct'` —
correct because **the native reference is ground truth by definition**.

**Nothing about audio quality was auto-filled.** A tool that can't hear can't
label a take `flat` or `mediocre` — so every learner row is `'PLACEHOLDER'`
until recorded and listened to. Inventing those labels would be fabricating the
exact ground truth the scorer is meant to be measured against.

### Scope + why it's grouped by source
The native rows are **derived** from `reference.js` + `vocabulary.js`, not
hand-listed — so paths and words can't drift. Current scope: single tones (8),
single vowels (6), greetings (6), adjectives (25) = 45 native clips.

The matrix is scored **within each source group, never across**. Scoring "loj"
against "nyob zoo" is meaningless, and the full cross-product would be a
40-wide grid. Only the **tone** group is a true minimal-pair test (same
syllable, different tone). Vowels/greetings/adjectives are smoke tests: they
confirm self ≈ 100 and that different words score lower — useful for catching a
broken pipeline, not for judging tone discrimination.

### Reading the matrix
Each clip is scored against every native reference in its group. Two properties,
both loud on failure:
- **Diagonal high** — a take scores near 100 against the native of its own tone.
- **Off-diagonal lower** — clearly less against other tones.

Two failure signatures worth naming:
- A **whole speaker row uniformly high or low regardless of tone** → normalization
  is leaking voice identity (the male/female gap isn't being cancelled).
- A **native clip that doesn't peak on its own diagonal** → that recording was
  likely mis-saved under the wrong tone's filename. The harness doubles as a
  check on the recordings themselves.

### Why it's runnable before recording anything
The 8 native clips alone give a full 8×8 matrix — that validates the scorer on
real Hmong audio today, no learner takes needed. The `me-m` rows slot in later
and answer the different question: does a *deliberate error* score low.

## Files
- `src/data/speechEval.js` — the labeled eval set (native auto-filled, learner rows placeholder)
- `src/pages/ToneEval.jsx` — dev-only `/tone-eval` confusion-matrix harness
- `src/lib/audioSamples.js` — blob → 16 kHz samples
- `src/lib/yin.js` — YIN, contour, smoothing, semitone normalization
- `src/lib/toneScore.js` — DTW + score
- `src/lib/pronounceScore.js` — UI entry point, reference resolution + cache
- `src/components/speak/ToneCurve.jsx` — the overlay chart
- `src/components/speak/PronounceStep.jsx` — wired to score on each take
- `src/data/contours.{js,json}` — pre-extracted contour store (empty)
- `scripts/audio/tone-selftest.mjs` — synthetic self-test
