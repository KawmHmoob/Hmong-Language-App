# Pronunciation Scoring + the Community Hmong Voice Dataset (DESIGN)

Status: **idea / not built.** Builds on [../18-pronunciation-practice.md](../18-pronunciation-practice.md)
(the Speak feature) and [../19-speech-testing.md](../19-speech-testing.md) (how to
validate a score). Read the ethics discussion that spawned this before building —
consent is load-bearing, not a footnote.

---

## ⭐ Recommended MVP — start here (curate + pitch-overlay first)
Skip the score, skip the data collection, skip the account gate. The best v1 is a
**tone-contour visualizer** built on a **small curated reference set** — the most
useful, most honest, cheapest thing, with zero ethical surface area.

**Build the reference base — curate, don't crowdsource.** The authentic set is
ground truth; it has to be deliberate, not user-submitted.
- Record **3–5 fluent speakers** (even 1 to start) reading the phrase list.
- Sourcing, cheapest → best: yourself/family/elders → a Hmong community org,
  church, or **university Hmong Studies program** (often eager to help preserve
  the language) → paying a few fluent speakers.
- **A quiet room + a phone is enough** — you're capturing *pitch*, not studio
  fidelity. Tone (F0) survives a phone mic. Don't let "I need a studio" block you.
- **Record for the tone contrasts:** prioritize *minimal pairs* — same syllable,
  different tone (pob / poj / pov / po / pos / pog / pom). That's the single
  highest-value content, because it captures the thing that's actually hard.

**Compare by showing the curve, not scoring it.**
- Extract F0 from the native reference (once, stored) and from the learner's take.
- **Overlay the two pitch lines** on one plot + play them back-to-back. The
  learner *sees* their tone rise where it should fall.
- Why this beats a number for v1: no scoring model needed (pure DSP); it's
  **honest** (a flaky "73%" erodes trust — two lines can't be "wrong," they just
  show what happened); and it's **uniquely right for Hmong** — nobody else does
  tone-contour visualization, and tone is the whole game.

**The MVP checklist:**
1. Curate ~50 reference phrases from a couple of fluent speakers (minimal-pairs first).
2. Pre-extract each reference's F0 contour; store the array.
3. Speak: record learner → extract their F0 → **overlay both curves** + A/B playback.
4. **No storage, no score, no account** for this phase.
5. *Then* layer on the DTW score → progress tracking → (much later, opt-in) donation.

**Do first, today, costs nothing:** start recording fluent speakers reading the
phrase list, minimal-pairs first. Audio is the bottleneck for *every* version of
this; the code can wait. The rest of this doc is the full system that grows out of
this MVP.

---

## The vision in one line
A learner records a Hmong phrase → we score it against **authentic native
recordings**, focusing on **tone** → they get useful feedback → and, *if they
choose to donate it*, their recording (across the quality range) becomes part of
an open Hmong speech dataset that's scarce and badly needed.

Two products from one feature: **a great tonal-pronunciation tutor** (the value to
the user) and **a Hmong speech corpus** (the value to the world). Keep them
cleanly separated — that separation is the whole ethical design.

---

## Architecture: three layers, kept independent

```
┌─ REFERENCE CORPUS ────────────┐   the "ground truth" — authentic Hmong
│  native recordings + F0        │   (your established high-quality base)
└───────────────┬───────────────┘
                │ compare against
┌───────────────▼───────────────┐
│  SCORING ENGINE                │   tone-first DSP: F0 contour + DTW
│  → tone / timing / clarity     │   (client-side, no ML to start)
└───────────────┬───────────────┘
                │ produces a result
┌───────────────▼───────────────┐
│  RESULT TRACKING               │   two tracks, never conflated:
│  (a) user progress (always)    │   • scores only, lightweight
│  (b) donated audio (opt-in)    │   • the corpus, quality-stratified
└───────────────────────────────┘
```

Why independent: you can improve scoring without touching consent, grow the corpus
without changing the tutor, and swap the DSP engine for an ML one later without
migrating anyone's progress.

---

## Layer 1 — The reference corpus (your "established base")
This is the part you flagged: *ideally we already have high-quality Hmong to
compare against.* This is that. Design it well and everything downstream is easier.

**What it is:** for each phrase in `speak.js`, one or more recordings by
**verified fluent/native speakers**, with the pitch curve pre-computed.

```
reference_recording
  id
  phrase_id            → speak.js phrase (e.g. 'speak-nyob-zoo')
  speaker_id           → so we can weight/diversify voices
  dialect              'white' | 'green'          (tones differ slightly!)
  audio_url            the MP3 (this is also the "Listen" reference)
  f0_contour           PRE-EXTRACTED pitch array — the actual comparison target
  duration_ms
  verified             a human confirmed it's correct + clean
```

Key decisions:
- **Store the F0 contour, not just the audio.** Extract pitch once, at upload
  time, and save the array. Then scoring never re-analyzes the reference — it just
  compares the learner's contour to a stored one. Fast, and the reference is the
  same every time.
- **Multiple speakers per phrase, eventually.** One reference = you're grading
  people against one person's voice. 3–5 native speakers → a *tolerance band* per
  tone, so a learner isn't marked wrong for not matching one specific timbre. Start
  with one, design the schema for many.
- **Dialect matters.** White vs. Green Hmong tones/vowels differ. Tag references
  by dialect; let the learner pick which they're learning; compare like to like.
- **Seed it from what you already have.** Your `single-consonant-*.mp3` recordings
  and any phrase recordings ARE the start of this corpus — they just need F0
  extracted and a `verified` flag.

**The best acquisition strategy:** don't rely on learner attempts for the
reference. Actively record fluent speakers — Hmong community orgs, churches,
elders, university Hmong programs — a curated set. Quality-in, quality-out. This
is also the most respectful path (invited contribution, not passive harvest).

---

## Layer 2 — Scoring (tone first, because Hmong)
Detailed in note 18; the short version of *why this design*:

- **Tone is the score.** In Hmong the pitch contour carries meaning — same
  syllable, different tone, different word. So the primary signal is **F0 (pitch)
  contour similarity**, computed with DTW (dynamic time warping) so timing
  differences don't tank it. This is also the most *feasible* signal — solvable
  with DSP, no ML, runs in the browser.
- **Normalize pitch to semitones relative to each speaker's own mean.** A child
  and an elder saying the same tone correctly should both score high — you're
  matching the *shape* of the contour, not absolute Hz.
- **Three sub-scores, not one number:**
  - **Tone** — F0 contour match (the star; weight it heaviest)
  - **Timing** — length/rhythm ratio vs. reference
  - **Clarity** — spectral/MFCC distance (are the consonants/vowels there)
- **Overall = weighted blend**, calibrated against a human-labeled eval set
  (note 19). Don't ship a number until it agrees with human ears ~85%+.
- **Later (Phase 3):** Meta MMS (`wav2vec2`, supports Hmong Daw) for
  per-phoneme scoring. Heavy, server-side, optional. The corpus you're building is
  what would let you *fine-tune* such a model — the long game.

---

## Layer 3 — Result tracking (the core of your question)

**The golden rule: separate the two things you're tracking.**

### Track A — User progress (always on, lightweight, low-stakes)
Numbers only. No audio leaves the device. This powers the tutor: "your best on
*Nyob zoo* is 82% — your tone dips where it should stay level."

```
pronunciation_attempt
  id
  user_id              (or anon session id for guests)
  phrase_id
  score_overall        0–100
  score_tone           0–100
  score_timing
  score_clarity
  created_at
  -- NO audio here. Just the result.
```
Cheap to store, no privacy weight (it's a score, not a voice), and it's what the
user actually cares about. Show trends: best per phrase, tone accuracy over time,
which tones they struggle with (rising tones? the -g breathy tone?).

### Track B — Donated audio (opt-in, the corpus)
Only exists when the user **explicitly donates a specific take**. This is where
the recording is stored — and it's a *separate row that references the attempt*,
so consent is auditable and revocable.

```
donated_recording
  id
  attempt_id           → links to the score, but user identity is DECOUPLED
  phrase_id
  audio_url            the actual voice — the sensitive part
  quality_bucket       'reference' | 'good' | 'passable' | 'developing'
  dialect
  consent_version      which consent text they agreed to
  donated_at
  -- deliberately NO direct user_id — anonymized at donation time
```

### The quality buckets — and the fix to your original idea
You wanted the 50–100% range including mediocre data (good for training a model to
tell good from bad — that instinct is **correct**, it's called *negative/hard
examples* and models need them). But **don't auto-save by score** — that saves
people's worst attempts without a clear yes. Instead:

- **The score gates SPAM, not consent.** Below ~40% or failing a
  voice-activity/RMS check = silence, noise, "test test" → never offered for
  donation. This is the ~50% floor you meant, repurposed correctly.
- **The USER chooses to donate a take they can hear.** After scoring: *"Nice —
  donate this recording to help build Hmong speech data?"* They listen, they
  decide. A 60% take is welcome in the corpus (great "passable" example) — but
  because they *offered* it, not because a threshold grabbed it.
- **Stratify what's donated into buckets** so the corpus is balanced:
  `reference` (≥90, near-native), `good` (75–90), `passable` (55–75),
  `developing` (40–55). A model learns the good/bad boundary from all four. Track
  bucket counts so you can see where the corpus is thin.

**Result:** you get exactly the quality spread you wanted (mediocre + good), the
score does the spam-filtering, and the *human* does the consenting.

---

## Consent model (non-negotiable, summarized from the ethics pass)
- **Two separate switches.** Feedback works with zero data collection. Donation is
  a distinct opt-in, **default OFF**, plain-language.
- **Per-take donation**, not a blanket "we keep everything." They hear it, they
  choose.
- **Anonymize at donation** — decouple from name/email/account.
- **Real delete** — a "my recordings" screen that actually removes them (and
  derived copies you can reach). Store `consent_version` so you know what each
  donor agreed to.
- **Voice = biometric.** GDPR special-category; Illinois BIPA (large Hmong
  population!) — get a lawyer before scale. No under-13 collection (COPPA).
- **Own it openly.** The dataset's value to the Hmong community depends on it not
  being a private extraction. Prefer open release / stewardship by a Hmong
  cultural or academic body. Credit or compensate contributors.

---

## Phased rollout (each phase shippable, each earns the next)
1. **Feedback-only.** Record → score (tone DSP) → compare → **discard**. No
   storage, no consent needed. Proves the tutor works. (This is Speak Phase 1–2.)
2. **Reference corpus.** Curate native recordings, extract F0, store. Improves
   scoring accuracy. No user data involved — it's *your* recordings.
3. **Progress tracking (Track A).** Store scores (not audio). Trends, weak-tone
   insights. Low privacy stakes.
4. **Donation (Track B).** The opt-in corpus flow, with full consent + delete +
   anonymization. Only after 1–3 have earned user trust.
5. **ML (optional, long game).** Fine-tune MMS on the corpus for phoneme-level
   feedback. This is why the corpus exists.

Do them in order. Retrofitting consent onto already-harvested audio is the classic
scandal; collecting only what people knowingly donate is the whole game.

---

## The best single idea, if you take one thing
> **Score tone (F0 contour vs. a curated native reference), store only the
> *number* by default, and let users *donate* individual takes — spam-gated by
> score, quality-bucketed for training, consented per recording.**

That gives a genuinely useful tonal tutor now, a valuable balanced Hmong corpus
over time, and keeps you on the ethical side of every line.

## Open questions to resolve before building Track B
- Who legally/stewardship-wise **owns** the corpus? (Decide before collecting.)
- Reference speakers: how many per phrase, sourced how, compensated how?
- Storage/retention limits + jurisdiction (where's the bucket, whose law applies)?
- Green vs. White Hmong: support both, or pick one for v1?
- Do you show donors their contribution / a "you helped" acknowledgment?
