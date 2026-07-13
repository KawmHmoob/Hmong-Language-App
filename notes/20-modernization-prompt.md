# Modernization Prompt (for a coding model — Fable 5 etc.)

A ready-to-paste prompt to hand a coding model to (a) modernize the UI and (b)
restructure the app around **two top-level sections**: **Speak** (natulang-style
pronunciation) and **Words** (Duolingo-style word learning).

**How to use:** paste everything in the fenced block below into the model, with this repo
open. The context section is filled in from the real codebase so the model doesn't guess.
Related scope: [18-pronunciation-practice.md](18-pronunciation-practice.md) (Speak),
[01-quiz-engine.md](01-quiz-engine.md) (Words testing),
[07-styling-system.md](07-styling-system.md) (palette).

---

````text
# ROLE
You are a senior React/UI engineer modernizing "Kawm Hmoob," a Hmong language-learning
web app. Ship production-quality, accessible, responsive UI. Do not break existing logic.

# STACK (do not change these choices)
- Vite + React 18, react-router-dom v7 (routes in src/App.jsx).
- Tailwind CSS only — no CSS modules, no styled-components, no new UI libraries.
- State via 4 contexts already in place: AuthProvider, SubscriptionProvider,
  ProgressProvider, NotebookProvider. Read/write user state ONLY through their hooks
  (useProgress, useAuth, etc.) — never touch localStorage directly.
- Content/reference data are plain JS in src/data/*.js — hand-editable, keep that shape.

# DESIGN SYSTEM (reuse these tokens; extend, don't replace)
- Fonts: headings = Fraunces (serif), body = Inter (sans). Already wired in index.css.
- Palette (tailwind.config.js): warm neutrals `cream-50..600`, terracotta accent
  `clay-500/600/700`, text `stone-*`. Keep this warm identity — it's the brand.
- Utility classes in index.css: `.surface`, `.surface-hover`, `.surface-elevated`,
  `.btn-primary`, `.btn-secondary`, `.btn-ghost`, shadows `shadow-warm`/`shadow-warm-lg`.
- NOTE: the `blush` color scale is inconsistent (a powder-blue hex sits under a "blush"
  name). Rationalize it: either make it a true dusty-rose or replace its uses with an
  intentional secondary. Document whatever you choose.

# GOAL
1. Modernize the look and feel (see DESIGN DIRECTION) without losing the warm, editorial,
   hand-made character. This is a boutique cultural app, NOT a generic SaaS dashboard.
2. Restructure navigation so the app has TWO clear primary sections a first-time user
   instantly understands: "Speak" and "Words" (see SECTIONS). Everything else (Alphabet,
   Review, Notebook, Search, Settings) becomes secondary.

# SECTIONS
## 1) Speak — pronunciation practice (natulang-style)
Purpose: hear a native recording, record your own voice, compare, get tone feedback.
- New top-level route `/speak` with its own hub screen listing pronounceable phrases,
  grouped, showing per-item progress.
- The core loop screen: Listen (play reference audio) → Record (mic) → Hear your take →
  A/B compare → (later) a tone score.
- Build the UI shell + interaction states now; wire the scoring later. Match the data
  model and hook names planned in notes/18-pronunciation-practice.md (`usePronunciation`,
  a `'pronounce'` lesson step, `PronounceStep`). Gate premium items behind the existing
  paywall (SubscriptionProvider / the lesson `tier: 'pro'` field).
- Make recording feel alive: mic-permission state, a live waveform/level meter while
  recording, clear record/stop affordance, replay controls.

## 2) Words — vocabulary learning (Duolingo-style)
Purpose: learn and drill individual words with fast, game-like reps.
- New top-level route `/words` that unifies today's scattered vocab + quiz experience
  (src/data/vocabulary.js, the quiz engine, SRS review) into ONE coherent flow.
- Duolingo-style bite-size exercises: flashcard flip, multiple-choice, match pairs,
  listening pick, typing. Reuse the existing quiz engine where possible; add exercise
  types per notes/11-future-implementations.md rather than reinventing scoring.
- Show streak, XP, and a daily goal (already in ProgressContext) prominently.
- Keep the spaced-repetition "due today" queue (ProgressContext) as the default session.

# DESIGN DIRECTION (modernize, keep the soul)
- Stronger visual hierarchy: generous whitespace, larger type scale, clear section heroes.
- A cohesive card system built on `.surface*` — consistent radius, one shadow language
  (`shadow-warm`), hover lift only where interactive.
- Motion with restraint: subtle transitions on hover/press, progress-bar fills, and
  section transitions. Prefer CSS transitions; if you need spring/gesture motion, say so
  and justify — otherwise no animation library.
- A bottom tab bar (mobile) / left rail (desktop) with exactly TWO primary tabs — Speak
  and Words — plus a compact "more" for secondary pages. Make the two sections feel like
  two front doors.
- Empty states, loading skeletons (a SkeletonCard exists), and celebratory success states
  (lesson complete, streak extended).
- Dark mode is out of scope unless trivial; do not half-build it.

# HARD CONSTRAINTS
- No new npm dependencies without explicitly listing them and why (the project's rule is
  "no new packages"; UI libraries are NOT allowed — build with Tailwind).
- Do not alter the data shapes in src/data/*, the context state shapes, or the paywall
  logic. UI-only refactors + additive routes/components.
- Every interactive element: keyboard-accessible, visible focus ring, aria labels,
  respects `prefers-reduced-motion`.
- Fully responsive (360px → desktop). No horizontal scroll on the page body.
- Keep the existing route paths working (add redirects if you move a page).

# DELIVERABLES
1. Updated navigation: a new nav component + the two section hubs (`/speak`, `/words`).
2. The Speak hub + one working record/compare screen (scoring stubbed).
3. The Words hub unifying vocab + quiz + review into one session flow.
4. Keep components small, default-export the main thing, helpers as local `function`
   declarations (match existing conventions in src/).
5. TEACHING NOTES ARE MANDATORY, NOT OPTIONAL. For EVERY feature/component/hook you add
   or meaningfully change, write a note in `notes/` explaining **what** it is, **why**
   it's built that way, and **how** the code works — with pasteable snippets and a
   "how to extend" section. Match the existing convention: numbered file
   (`notes/NN-<slug>.md`), add an index line to `notes/README.md`, cross-link related
   notes. The human will RELEARN and re-implement from these notes, so write them to
   teach, not to summarize. A feature without its note is INCOMPLETE — do not consider
   any deliverable done until its note exists.

# PROCESS
- First, restate your plan and the file list you'll add/change. Then implement.
- Work in vertical slices (one screen fully done) rather than half-touching everything.
- Call out every assumption and every place you deviated from these instructions.
````

---

## Notes for the human (you) before running this
- Point the model at **the web (Vite) repo** if you're prototyping UX fast; the DSP/audio
  is easiest there. If you've committed to the Expo/RN build for shipping, swap the STACK
  block (Expo Router, NativeWind, `expo-av` instead of Vite/react-router/MediaRecorder) —
  everything else in the prompt still holds. See the platform decision discussion.
- Run it in **vertical slices**: do Speak first (it's the differentiator and the paid
  hook), review, then Words. Don't let the model touch everything at once.
- After it lands, update the affected notes (README rules) — especially 07-styling if the
  `blush` palette gets rationalized, and 18 if the Speak UI shape changes.
