# Speech Testing & Evaluation (pronunciation scoring)

**Scope boundary — read this first.** This note is about **speech testing**: how we
verify that the pronunciation feature *scores a spoken recording correctly*. It is
**not** about the app's regular (text) quizzes.

| | Regular testing | Speech testing (this note) |
| --- | --- | --- |
| What's tested | Does the learner *recognize/recall* the right answer? | Does our *scorer* judge a recording the way a human would? |
| Input | Taps / typed text | Microphone audio |
| Lives in | [01-quiz-engine.md](01-quiz-engine.md), `src/data/quizzes.js` | this note, `src/data/eval/` |
| Correct answer | Known string in the dataset | A human "good / off" label on a recording |
| Feature it supports | Quiz engine | Natulang feature — see [18-pronunciation-practice.md](18-pronunciation-practice.md) |

Keep these separate. A quiz has one correct answer; a pronunciation score is a
*judgment* that has to be **calibrated and validated** against human ears. Different
problem, different tooling.

---

## Why speech needs its own "test set"

For a text quiz, correctness is exact: the answer string matches or it doesn't. There's
nothing to calibrate.

For pronunciation, the scorer outputs a number (0–100). A number is only trustworthy if
it **agrees with a human**. So before you show a learner "Tone: 82," you must prove your
scorer gives high numbers to good recordings and low numbers to bad ones. That proof is
an **evaluation set** (a.k.a. eval set / test set): labeled audio you check the scorer
against. This is the gap that pure feature code can't fill — it's data work.

---

## The eval set

### What it is
A small, hand-labeled collection of recordings for a fixed list of Hmong phrases, each
tagged by a human as good or off, used to check and tune the scorer.

### How big
Start tiny; this is calibration, not training:
- **8–12 phrases** spanning the tone system (one per tone contour where possible).
- **2–3 native speakers** (the "reference" / ground-truth-good recordings).
- **2–3 learners** producing both good and deliberately-wrong takes.
- → ~100–150 clips total. Enough to trust a threshold; small enough to label by hand.

### Where it lives
Match the plain-JS-data convention (see [00-architecture.md](00-architecture.md)):
```
src/data/eval/
  pronunciation-eval.js     ← manifest (labels + metadata), hand-editable
  clips/                    ← the .webm/.mp3 recordings (or store in Supabase later)
```

### Manifest schema
```js
// src/data/eval/pronunciation-eval.js
export const evalClips = [
  {
    id: 'nyob-zoo-native-1',
    phrase: 'Nyob zoo',        // the target phrase
    tone: 'high-falling',       // optional tone tag for per-tone analysis
    clip: 'clips/nyob-zoo-native-1.webm',
    speaker: 'native',          // 'native' | 'learner'
    label: 'good',              // HUMAN judgment: 'good' | 'off'
    referenceFor: 'Nyob zoo',   // which reference MP3 this is scored against
    note: 'clean studio take',  // optional
  },
  // deliberately-wrong takes are the important negatives:
  {
    id: 'nyob-zoo-learner-flat',
    phrase: 'Nyob zoo', tone: 'high-falling',
    clip: 'clips/nyob-zoo-learner-flat.webm',
    speaker: 'learner', label: 'off',
    referenceFor: 'Nyob zoo',
    note: 'flat tone — should score LOW on Tone',
  },
]
```
The single most valuable field is `label` — a human's honest "good / off." Include plenty
of **deliberate negatives** (right word, wrong tone). If your scorer can't push those
down, it isn't measuring tone.

---

## Calibration workflow (Phase 2 DSP)

The scorer from [18-pronunciation-practice.md](18-pronunciation-practice.md#phase-2--scoring-math-pure-js-in-srclibdsp)
has a knob: `score = 100 * exp(-k * dtwDistance)`. Tune `k` here.

1. **Score every clip** against its `referenceFor` MP3 → get a raw number per clip.
2. **Plot / sort** scores split by `label`. You want two separated clusters: `good` high,
   `off` low.
3. **Pick the threshold** where they separate best; set `k` so that lands near a sensible
   pass mark (e.g. ~70).
4. **Read the failures.** Any `good` scoring low or `off` scoring high — listen to it.
   Usually it's the pitch tracker choking on silence/noise, not the phrase.
5. **Re-run** after tuning. Keep the manifest in git so results are reproducible.

Do this in a throwaway script or a hidden `/dev/eval` route — it's a dev tool, not a
user-facing screen.

## Metrics to report
- **Separation:** mean score of `good` vs `off` (bigger gap = better).
- **Agreement / accuracy:** at your chosen threshold, what % of clips does the scorer
  label the same as the human? Target ≥ ~85% before trusting the number in the UI.
- **False-good rate:** % of `off` clips scoring above threshold. This is the dangerous
  one — telling a learner a wrong tone is "correct." Keep it low even if it costs recall.
- **Per-tone breakdown:** group by the `tone` field to find tones the tracker handles
  badly (rising tones and creaky/breathy tones are common trouble spots).

## Manual QA (device matrix — separate from scoring accuracy)
Scoring can be perfect and the feature still broken if capture fails. Check by hand:
- [ ] Record + playback works on **desktop Chrome, Firefox, Safari**.
- [ ] Works on **iOS Safari** (the strict one — mic + `AudioContext` resume).
- [ ] Works on **Android Chrome**.
- [ ] Mic-permission **denied** path shows a helpful message, not a crash.
- [ ] Background noise / very short clips don't produce a garbage score (gate on RMS).

## Phase 3 (ML) note
If you add Meta MMS phoneme scoring (see
[../instructions/pronunciation-apis.md](../instructions/pronunciation-apis.md)), the
*same eval set* becomes your regression test: run it through the model on every change so
an "improvement" can't silently make Hmong scoring worse. The labels don't change — only
what's consuming them.
