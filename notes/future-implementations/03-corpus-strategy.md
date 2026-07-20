# Hmong Learner-Speech Corpus via a Pronunciation-Scoring App (SCOPE)

> **Status: strategy document, nothing built.** This is the commercial and
> data-science case for the corpus. The *system* design lives in
> [01-pronunciation-dataset.md](01-pronunciation-dataset.md); the *incentive*
> design in [02-gamification-and-incentives.md](02-gamification-and-incentives.md).
> This note is the layer above both: what the asset is, what makes it valuable,
> and what destroys its value.
>
> §0–§10 below are the source document, kept intact. The reconciliation section
> at the end is the part that touches this repo.

---

## 0. Premise

Build a language-learning app that teaches Hmong pronunciation (tone-focused).
As a byproduct of use, the app captures learner speech, scores it, and persists
every attempt with its quality label. The scored corpus — not the raw audio — is
the asset. This is the standard "data flywheel" pattern: usage generates labeled
data → labeled data trains a better scorer → better scorer improves the product
→ product attracts more users → more labeled data.

## 1. Core system components

- **ASR front end:** streams user audio to server; segments and aligns
  utterances against target text.
- **Pronunciation assessment:** computes a Goodness-of-Pronunciation (GOP) style
  score. Modern stacks favor end-to-end ASR posteriors (e.g. Whisper-derived)
  and/or prosody-aware models over classical GOP, which benchmarks as the
  weakest baseline. Score at phoneme/tone granularity, not just word level
  (cf. ELSA's per-phoneme Green/Yellow/Red).
- **Label store:** persist `{audio, target_text, speaker_id, per-phoneme scores,
  per-tone scores, overall band (good/mediocre/bad), model_version, timestamp,
  device/mic metadata}`.
- **Training loop:** periodic retrain on accumulated labeled data; version every
  model so labels are traceable to the scorer that produced them.

## 2. Data value model (what actually prices)

Value scales with, in order:

1. **Distinct speakers** (speaker diversity), not repetitions of one item.
2. **Content coverage** (phonetic/lexical/tonal spread), not volume of a single word.
3. **Total hours.**
4. **Documented consent per speaker** (gates legal usability — see §6).

Corollaries:

- 1,000× one word = calibration set or wake-word/keyword-spotting niche only;
  near-zero general-ASR value due to redundancy (acoustic variation of one word
  saturates within ~50–100 speakers).
- 10,000 speakers × one word = rich error distribution for that item; does not
  generalize to unseen words/tones. Keep the speaker diversity, spread the
  content across many words/sentences at equal collection cost.

## 3. The counterintuitive asset: learner-error data

- Near-native ("good") learner audio overlaps with abundant native-speaker data
  → least uniquely valuable.
- **Mislabeled/erroneous ("bad"/"mediocre") audio is scarce and high-value.**
  Almost all existing speech corpora are native speakers producing correct
  output. Error-detection and corrective-feedback models require large volumes
  of labeled wrong examples, which effectively do not exist for low-resource
  languages.
- For Hmong this is acute: White Hmong has 7 contrastive tones (orthographic
  finals: `-b` high, `-j` high-falling, `-v` mid-rising, `-s` low, `-g`
  mid-low/breathy, `-m` low-glottalized, and unmarked mid). Tone is the primary
  learner failure mode and the primary labeling target. A labeled corpus of
  learner tone errors is close to non-existent.

## 4. Label-integrity risks (the failure modes)

- **Circular/self-referential labeling:** training a new scorer on the previous
  scorer's auto-labels inherits and amplifies its errors. Anchor with a
  hand-labeled validation slice from native speakers / a linguist.
- **Silent error attrition:** automated ASR discards utterances it can't
  recognize — disproportionately the worst pronunciations (Duolingo
  pronunciation study: ~28% of a test cohort dropped for non-recognition,
  presumably the lowest-intelligibility speakers). This deletes the exact error
  data you want. **Log rejected/low-confidence utterances rather than
  discarding them.**
- **Label imbalance:** expect skew toward "good" bands as users improve;
  stratify sampling and retention to preserve minority error classes.

## 5. Recommended architecture: hybrid labeling

- **Bulk layer:** automated GOP/ASR labels on all traffic (scales like ELSA's
  server-side GOP).
- **Ground-truth layer:** expert human labels (certified coaches / linguist) on
  a sampled slice (the Speechling model — human feedback within ~24h; nonprofit,
  free tier + ~$20/mo unlimited). Provides validation set + correction signal.
- **Training regime:** semi-supervised + transfer learning combining the labeled
  slice and the large unlabeled/auto-labeled bulk. Transfer from a multilingual
  base model to compensate for the low-resource starting point.

## 6. Legal / ethical gating (blocking, not optional)

- **Biometric exposure:** voiceprints qualify as biometric data under statutes
  such as Illinois BIPA. Storing user voice + quality judgments requires
  explicit, documented, purpose-scoped consent covering model training and any
  resale/licensing.
- **Provenance:** consent documentation is increasingly a hard dealbreaker for
  data buyers; unconsented/scraped audio is a liability, not an asset.
- **Community:** Hmong is an under-served, historically under-documented
  community; consent-forward collection with benefit flowing back to the
  community is both correct and a reputational/differentiation requirement.
  Distinguish White vs Green Hmong (Moob Leeg) in metadata — do not mix dialects
  silently.

## 7. Monetization paths (they diverge)

- **Product monetization:** subscriptions (ELSA freemium ~$13/mo; Speechling
  nonprofit free + ~$20/mo; Duolingo freemium). Keeps data proprietary; builds a
  moat.
- **Dataset monetization:** license the labeled corpus to speech-AI/data vendors
  (Appen, Sama, Defined.ai, Pangeanic, etc.). Requires airtight consent (§6) and
  scale.
- These pull in different directions; **decide early.** The durable value is
  usually the flywheel/moat (proprietary compounding data — "competitors copy
  the UI, not the data insight"), not a one-time data sale.

## 8. Competitive landscape / positioning

- **ELSA:** proprietary non-native accented-speech dataset cited at 200M+ hours
  across 195 countries; explicitly states data uniqueness > model architecture
  as the moat.
- **Duolingo:** proprietary learner-behavior data as growth engine; each new
  vertical/course launches "smarter on day one" — flywheel defensibility.
- **Speechling:** human-coach feedback loop = expert-labeled data at the cost of
  scale.
- **Gap = opportunity:** none of these cover Hmong. The play is creating the
  dataset that doesn't exist in an empty field, not out-collecting a funded
  competitor in a crowded one. First-mover advantage is the empty field, not raw
  volume.

## 9. MVP data targets (rough, for a first tone-scoring model)

- Prioritize **breadth**: many speakers × many tone-bearing items over deep
  repetition of few items.
- Ensure every target tone (7) is represented across many speakers, ages,
  genders, devices, and noise conditions.
- Reserve a native-speaker + linguist hand-labeled validation slice from day one.
- Persist low-confidence/rejected utterances (do not auto-discard) to retain the
  error tail.
- Version the scorer; tie every label to `model_version` for auditability.

## 10. One-line summary

Labels convert cheap audio into training data; learner errors are the scarce,
high-value part; automated scoring scales but drifts without a human-labeled
anchor; the compounding proprietary corpus in an uncovered language is the moat
— contingent entirely on documented, consented collection.

---

# Reconciliation: how this lands on the code that exists today

Five places where the strategy above meets something already shipped. Four are
conflicts.

## ⚠️ 1. The points economy rewards the LEAST valuable axis
`speak-attempt` and `speak-contribution` are **uncapped per user** — deliberately,
so nobody is told to stop recording (notes/57):

```js
'speak-contribution': { points: 15, capped: false },
```

§2 says value is **distinct speakers first**, and that one item saturates within
~50–100 speakers. An uncapped per-user reward optimizes for the opposite: one
motivated user producing thousands of clips, which is the cheapest and least
valuable shape of the data.

The uncapped rule is still right *as product design* — capping contribution
would be a strange thing to tell a learner. But the **leaderboard should not
rank on clip volume**, and it currently displays exactly that (`clips` per row).
Ranking on **coverage** — distinct items attempted, distinct tones covered —
points the same competitive energy at breadth.

Concretely: `weekPoints` is fine; the `clips` column is an anti-incentive.

## ⚠️ 2. The gamification loop rewards good pronunciation; §3 wants bad
Already flagged in
[02-gamification-and-incentives.md](02-gamification-and-incentives.md), and this
document sharpens it: `PASS_SCORE = 80` in `wordFamilies.js` means a learner
advances on a *good* attempt and retries a *bad* one.

If retries are discarded, the app systematically throws away the scarce class
and keeps the abundant one. **The failed attempts are the corpus.** Whatever the
recorder does, "below PASS_SCORE" must mean *store and move on*, never *store
nothing*.

## ⚠️ 3. Guests can already reach Speak — consent has no hook
`GUEST_GATING_ENABLED = false` today, and even when true, `GUEST_PHRASE_LIMIT`
lets guests into Speak. Guests have no account, so there is **nowhere to attach
documented, purpose-scoped consent** (§6), and no stable `speaker_id`.

This is a **release blocker for recording**, not a polish item: a guest
recording is audio you cannot legally use and cannot attribute to a speaker.
Recording must require an account, independent of whether the rest of the guest
wall is on.

## ✅ 4. Dialect metadata already exists — but doesn't reach the content
Better than expected. `dialectPreference` (`'white' | 'green'`) is already on the
user, persisted as `dialect_preference`, and settable in Register, Settings, and
Profile. That is exactly the speaker-level field §6 asks for, and it exists
before any recording does.

The gap: **it is stored and never read.** Nothing branches on it, so every
prompt is White Hmong regardless. A Green Hmong speaker recording against White
Hmong targets produces audio labeled with the wrong dialect's target text —
"mixing dialects silently", the specific failure §6 names.

Minimum fix before recording: either filter prompts by dialect, or stamp the
utterance with the **target's** dialect as well as the speaker's, so the mismatch
is visible in the data rather than invisible.

`WordDetail` already renders `word.whiteHmong` / `word.greenHmong` fields that no
vocabulary entry populates — the schema hook is there too.

## 5. Schema requirements the current data model doesn't have
§1's label record and §9's auditability imply fields nothing in the app tracks:
`model_version`, per-tone scores, device/mic metadata, confidence, and a
rejected/low-confidence flag. `ProgressContext` stores one JSON blob per user —
fine for progress, wrong shape for a corpus. **The corpus needs its own table
from day one**, not a field bolted onto `progress`.

## What this changes about sequencing
The recorder is the next build (per the plan: finish recording → lessons → wire
→ then recording logic). Three things above have to be settled *before* the
first utterance is stored, because they cannot be retrofitted onto data already
collected:

1. **Consent + account requirement** (§6) — unconsented audio is unusable
   forever, not fixable later.
2. **Store failures, including rejected ones** (§4) — discarded attempts cannot
   be recovered.
3. **`model_version` + dialect on every record** (§1, §6) — labels without
   provenance can't be trusted retroactively.

Everything else — scorer quality, human-label slice, monetization path — can be
improved after collection starts. These three cannot.
