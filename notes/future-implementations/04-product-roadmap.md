# Product Roadmap — Phases 1→4 (VISION)

> **Status: the author's roadmap.** Phase 1 is partly built; everything below it
> is intent, not design. Where a phase touches something that already exists or
> already has a design doc, it's cross-referenced — the point is that these
> aren't greenfield, several have foundations already sitting in the repo.

---

## Phase 1 — Core Value (current & immediate)

**Real-Time Tone Graphing** — visual pitch mapping to master the 8 Hmong tones.

**Dialect Toggling** — seamless switching between White Hmong and Green/Blue Mong.

### Where this stands today
| Piece | State |
|---|---|
| Tone graphing | **Built** — `ToneCurve` overlays learner vs native F0 (notes/61, notes/62). "Real-time" (live-while-speaking) is NOT built; today it renders after the take. |
| Dialect toggling | **Half-built, and this is the gap.** `dialectPreference` (`'white' \| 'green'`) already exists on the user, persists to Supabase, and is settable in Register/Settings/Profile — but **nothing reads it.** Every prompt is White Hmong regardless. |

The dialect gap is the single most "already 80% there" item in the whole
roadmap: the field, the UI, and the persistence exist. What's missing is
content (Green Hmong forms + recordings) and the read-side branching.
`WordDetail` even renders `word.whiteHmong` / `word.greenHmong` fields that no
vocabulary entry populates yet — the schema hook is in place.

⚠️ Per notes/future-implementations/03 §6, dialect is also a **corpus
correctness** issue, not just a feature: a Green Hmong speaker recording against
White Hmong prompts produces audio labeled with the wrong dialect's target text.
Fixing the toggle and fixing the metadata are the same job.

---

## Phase 1b — Content depth (near-term, additive)

**More phrases, sentences, and common words with native audio** — broaden the
recorded set well past the current phrase list.

**Side-by-side slow vs normal-speed pronunciation** — each item gets two
recordings: a slowed, deliberate take and a natural-speed one, so a learner can
decode first and then match real speech.

### Why the two-speed idea earns its place
It's not just a nicety — it addresses a specific failure. A learner who only
ever hears careful speech can produce a word in isolation and still not
recognize it in conversation, where syllables compress and tones flatten toward
each other. Two takes let them practice both jobs: *decode* at slow speed,
*match* at natural speed.

### What it costs, and what already supports it
- **Recording doubles.** Every item needs two passes. Worth scoping deliberately
  — 2× on a large set is the biggest content cost in the roadmap.
- **The schema barely changes.** Items already carry a single `audio` /
  `audioFile` string. A second field (`audioSlow`) is additive, and everything
  that reads audio today keeps working with the normal-speed one.
- **The filename convention needs deciding FIRST.** Naming drift has cost this
  project four times already (notes/42, notes/54, notes/60) — `-slow` as a
  suffix, agreed before recording, avoids a fifth.
- **`AudioButton` would need a speed toggle**, and `PronounceStep` a choice of
  which take to compare against.

### One open question for the scorer
If a learner records at *slow* speed, should they be scored against the slow
reference or the normal one? DTW already absorbs tempo differences (notes/61),
so either technically works — but the two references may differ in *pitch
range*, not just duration, since deliberate speech tends to exaggerate contours.
Worth checking against real takes before assuming they're interchangeable.

## Phase 2 — Structural Mechanics (next)

**Drag-and-Drop Sentence Builder** — visual breakdown of classifiers, nouns, and
verbs.

**Pseudo content data annotation** — NLP: sentence-structure identification and
intent classification, to train models and annotate data — *disguised as* a
sentence-structure breakdown that genuinely helps people understand Hmong better.

**Better reading** — differentiate reading levels and introduce more advanced
material, potentially traditional stories.

**Downloadable Study Bundles** — printable worksheets and grammar PDFs for
offline practice.

### Notes on Phase 2
- The **sentence builder** has real scaffolding already: classifiers, tense
  markers, demonstratives, conjunctions, and the adjective word-order rules are
  all taught and structured in `src/data/lessons/`. The grammar the builder
  would validate against is largely written.
- **Drag-and-drop was deliberately removed once** — all non-multiple-choice quiz
  types are commented out in `QuizEngine` (notes/37-era). Reintroducing it means
  re-solving mobile touch drag, which is why it was dropped. Worth knowing
  before estimating.
- **Reading levels**: the `reading` step already carries a `level` field and the
  Readings unit is ordered by difficulty — the hook exists, the content tiering
  doesn't.
- **Traditional stories** carry a cultural-permission dimension that vocabulary
  doesn't. Folk narratives often have community/family ownership; sourcing them
  wants the same consent-forward posture as the voice corpus (notes/03 §6).

### ⚠️ On "disguised" annotation
This is the same dual-purpose model as the speech corpus, and it inherits the
same constraint: **the teaching has to be genuinely good on its own terms.** The
corpus strategy's whole ethical footing (notes/03) is that the learner gets real
value and knowingly consents to the data use. "Disguised" is fine as *product
framing* — nobody needs a lecture on NLP to parse a sentence — but the consent
and disclosure still have to be explicit somewhere the user can find them.

The distinction that keeps this clean:
- **Fine:** the UI doesn't advertise "you are labeling training data." It's a
  sentence-structure exercise, and it teaches.
- **Not fine:** the terms/consent never mention that submissions train models.

Same line already drawn for voice: incentivising contribution *raises* the
disclosure bar rather than lowering it.

---

## Phase 3 — Conversational & Media Immersion (future)

**Context-Aware AI Chatbot** — simulated cultural scenarios with real-time syntax
corrections.

**Immersive Media Integration** — clickable transcriptions for videos, stories,
and audio files.

### Notes on Phase 3
- A Hmong-generating chatbot is a **content-accuracy risk of a different kind**
  than everything before it. Every other surface in this app is hand-authored
  and TODO-VERIFY'd; a model generating Hmong will confidently produce wrong
  tones and invented words, and learners can't tell. If this ships, it likely
  needs constraining to reviewed phrase inventories rather than free generation.
- **Clickable transcriptions** are the natural payoff of the audio work already
  done — every recording is already mapped to its word/phrase, which is exactly
  the alignment data a transcript player needs.

---

## Phase 4 — Human Connection Marketplace (premium extension)

**Live Tutor Marketplace** — booking system connecting learners with native human
speakers.

### Notes on Phase 4
This is a **different business** (two-sided marketplace: payments, scheduling,
trust & safety, payouts) bolted onto a language app. Worth flagging only so
it's costed as such rather than as "one more feature."

It also has an interesting relationship with Phase 1: the same shortage that
makes the app valuable — few fluent Hmong speakers available to learners — is
exactly what makes tutor supply hard to source. The community relationships
built for the reference corpus (notes/03 §6) are plausibly the same relationships
that seed a tutor marketplace.

---

## How this sequences against the shipped roadmap
The author's near-term build order (stated separately) is:

```
Audio → Speak engine → Accounts/Supabase → Paywall  =  first shippable product
```

Phase 1 sits inside that. Phases 2–4 all assume accounts exist, so none of them
front-run the Supabase work.
