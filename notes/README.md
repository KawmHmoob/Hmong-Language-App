# Implementation Notes

This folder is the audit trail for everything in the app. Each note explains **what** a feature is, **why** it's built that way, **how** the code works (with snippets you can paste), and **how to extend it**. Read [00-architecture.md](00-architecture.md) first if you're new to the codebase.

## How to use these notes

- **Before making a change**, open the relevant note. The "Code anatomy" section shows the existing patterns; copy them.
- **After making a change**, update the note (or write a new one). The notes only stay useful if they stay current.
- **For one-off how-tos that aren't tied to a feature** (deployment, audio file naming, Supabase setup), look in [`../instructions/`](../instructions/) instead.

> ### ⚠️ Read this before trusting an old note
> The app was restructured in notes **21–35** (two front doors → five sections;
> Course dissolved; Reference created). **Notes 01–17 predate that** and describe
> pages that no longer exist (`/course`, `/alphabet`, `/review`) — their
> *mechanics* (quiz engine, SRS, paywall, contexts) are still accurate, their
> *maps* are not. **Where an early note conflicts with a later one, the later one
> wins.** Each stale note is marked 🕰 below.

---

## Start here

| Note | What it gives you |
|---|---|
| [00-architecture.md](00-architecture.md) | The map: five sections, folder layout, boot sequence, where to add things, the 10 conventions |
| [34-reference-vs-learn.md](34-reference-vs-learn.md) | The organizing idea: surfaces are split by **job** (look up / learn / drill / say), not content type |
| [30-four-section-nav.md](30-four-section-nav.md) | How navigation maps every URL to a section |

## The sections

| Note | Section |
|---|---|
| [22-speak-section.md](22-speak-section.md) | **Speak** — record & compare, `usePronunciation`, level meter, `data/speak.js` |
| [23-words-section.md](23-words-section.md) | **Words** — vocab hub, derived daily goal, SRS session (supersedes `/review`) |
| [35-srs-session-and-quiz-menu.md](35-srs-session-and-quiz-menu.md) | **Words** — the 391-card bug: "never seen" ≠ "due"; `DAILY_NEW_LIMIT`; grouped quiz menu |
| [33-unit-pages.md](33-unit-pages.md) | **Learn** — hub + per-unit pages, shared `LessonCard` |
| [37-lesson-study-handoff-and-fonts.md](37-lesson-study-handoff-and-fonts.md) | **Learn** — study→gated-quiz flow (`vocab` + `quiz` step), the flashcard 3D flip, and the Nunito font swap (`serif`→`display`) |
| [38-confetti-and-words-polish.md](38-confetti-and-words-polish.md) | **Words** — perfect-score confetti (reusable primitive), flashcard restart/quiz footer, Words-section breadcrumbs |
| [39-confirm-modal.md](39-confirm-modal.md) | **Reusable** — `ConfirmModal` (replaces `window.confirm`, accessible) + `.btn-danger`; first used for quit-quiz |
| [12-lesson-system.md](12-lesson-system.md) | **Learn** — the units → lessons → steps *shape* 🕰 *(step model + step kinds now in 37)* |
| [13-lesson-system-walkthrough.md](13-lesson-system-walkthrough.md) | **Learn** — line-by-line walkthrough 🕰 *(original Lesson.jsx; current flow in 37)* |
| [32-alphabet-section-and-mojibake.md](32-alphabet-section-and-mojibake.md) | **Reference** — why it's its own section; plus the app-wide mojibake repair |
| [43-consonant-groups.md](43-consonant-groups.md) | **Reference** — consonants split Single/Double/Triple/Quadruple, derived by `letter.length` from one flat list |
| [25-neon-theme-and-bento-home.md](25-neon-theme-and-bento-home.md) | **Home** — bento dashboard, phrase of the day |

## Design system

| Note | What |
|---|---|
| [24-theming-and-polish.md](24-theming-and-polish.md) | **The token engine** — light/dark/neon via CSS variables. Read before touching any color |
| [31-icon-system.md](31-icon-system.md) | The inline-SVG icon set + `CategoryIcon` fallback |
| [21-two-section-nav.md](21-two-section-nav.md) | Palette fix (seafoam/blush), focus rings, reduced-motion 🕰 *(nav superseded by 30/32)* |
| [07-styling-system.md](07-styling-system.md) | 🕰 Original palette/utility classes — superseded by 24 for anything color |
| [06-ui-polish.md](06-ui-polish.md) | Skeletons, breadcrumbs, empty states, 404 |
| [41-back-button.md](41-back-button.md) | The "← Back" button built into Breadcrumbs — targets the parent crumb, on every tree/child page |

## Core systems

| Note | What |
|---|---|
| [03-progress-tracking.md](03-progress-tracking.md) | XP, streaks, completed lessons/steps, vocab status, SRS schedule |
| [09-spaced-repetition.md](09-spaced-repetition.md) | Leitner-box SRS 🕰 *(the `/review` page is now `/words/session`; selection rules changed in 35)* |
| [01-quiz-engine.md](01-quiz-engine.md) | The quiz runner (**text** testing — speech testing is note 19) |
| [02-vocabulary.md](02-vocabulary.md) | Categories, list, flashcards, word detail 🕰 *(pages moved to `pages/`)* |
| [08-notebook.md](08-notebook.md) | Saved words + free-form notes |
| [04-account-system.md](04-account-system.md) | Guest / authed user, login, register, profile |
| [36-account-gating.md](36-account-gating.md) | **The guest → account wall** — positional limits, and the adopt-on-empty migration that keeps signup from eating your progress |
| [14-paywall-and-supabase.md](14-paywall-and-supabase.md) | Paywall scaffold + path to real Supabase + Stripe |
| [15-paywall-walkthrough.md](15-paywall-walkthrough.md) | Line-by-line walkthrough of the paywall code |
| [10-search-and-tone-drill.md](10-search-and-tone-drill.md) | `/search` + tone drill 🕰 *(search reindexed in 34)* |
| [05-audio-placeholder.md](05-audio-placeholder.md) | `AudioButton` + `useAudio` — the cache, single-`current` concurrency, and the `ownedSrc` glow trick |
| [40-audio-plumbing.md](40-audio-plumbing.md) | Wiring audio consumption + the filename→field propagation pattern (counts historical — see 42) |
| [42-audio-naming-drift.md](42-audio-naming-drift.md) | Why audio can fail *silently* (`single` vs `singular`), the disk-vs-data diagnostic, and re-syncing to repair drift |
| [44-audio-folder-structure.md](44-audio-folder-structure.md) | Audio nested by type (`consonants/…`, `vocabulary/`); the rewire loop; two shapes in one file; the plural-`s` rename |

## Pronunciation (the Speak roadmap)

| Note | What |
|---|---|
| [18-pronunciation-practice.md](18-pronunciation-practice.md) | The full scope. **Phase 1 shipped** (note 22); Phases 2–3 (DSP tone scoring, ML) are the plan |
| [19-speech-testing.md](19-speech-testing.md) | How to *verify* a pronunciation score — eval sets, calibration. Distinct from note 01's text quizzes |
| [../instructions/pronunciation-apis.md](../instructions/pronunciation-apis.md) | The API/service landscape: what's free, what to self-host |
| [future-implementations/01-pronunciation-dataset.md](future-implementations/01-pronunciation-dataset.md) | **(Design/not built)** Tone scoring + the community Hmong voice dataset — reference corpus, result-tracking model, consent |

## Lessons learned (debugging patterns worth re-reading)

| Note | The lesson |
|---|---|
| [16-sync-to-async-migration.md](16-sync-to-async-migration.md) | The three bugs that appear every time state moves localStorage → Supabase |
| [17-usestate-and-async.md](17-usestate-and-async.md) | Why `useState(() => load(...))` breaks when `load` becomes async |
| [28-dead-code-and-bug-fixes.md](28-dead-code-and-bug-fixes.md) | Three bugs in one line; the rerunnable four-grep dust sweep |
| [32-alphabet-section-and-mojibake.md](32-alphabet-section-and-mojibake.md) | What mojibake is, and why replacement order is load-bearing |
| [35-srs-session-and-quiz-menu.md](35-srs-session-and-quiz-menu.md) | Reviews are self-limiting; new material is infinite. Cap it |

## Content

| Note | What |
|---|---|
| [27-content-fill-slice-a.md](27-content-fill-slice-a.md) | All lesson PLACEHOLDERs → real White Hmong + the **TODO-VERIFY list for a native speaker** |
| [11-future-implementations.md](11-future-implementations.md) | Backlog: extra quiz types, dialogues, cultural modules |

## Prompts (paste-ready, for handing work to a coding model)

| Note | For |
|---|---|
| [20-modernization-prompt.md](20-modernization-prompt.md) | The Speak/Words split + UI modernization |
| [26-cleanup-prompt.md](26-cleanup-prompt.md) | Content fill + dead code + data unification + RN folder |
| [29-navigation-and-visual-system-prompt.md](29-navigation-and-visual-system-prompt.md) | The "looks like 2011" fix: IA, icons, elevation, type scale |

## React Native

[`react-native/`](react-native/) — the Expo port's notes. 🕰 **Badly stale**: the RN
build predates Speak, Words, Reference, the theme engine, and the icon system. See
the migration discussion in [24-theming-and-polish.md](24-theming-and-polish.md#react-native-consciousness-for-the-expo-migration).

---

## Conventions

The full list lives in [00-architecture.md](00-architecture.md#conventions-youll-see-repeated). The short version:

- **No new npm packages.** React + Router + Tailwind. Exceptions get documented.
- **Plain JS data exports** — every dataset is hand-editable by a non-engineer.
- **Four contexts** — `Auth`, `Subscription`, `Progress`, `Notebook`. Anything else is local state.
- **Routed ⇒ `pages/`.** Used-by-a-page ⇒ `components/`.
- **Tokens only — never a hex, never `dark:`.** Three themes ride on them.
- **Derive, don't store.** Add context state only when it can't be computed.
- **IDs are saved user data.** Never rename or delete one.
- **localStorage keys** namespaced `kawmhmoob.*`.

## When you make a change

1. New file? → add it to the relevant note's "Files" list.
2. Changed a pattern? → update the snippet in "Code anatomy."
3. New way to extend? → add a step-by-step under "How to extend."
4. New dependency? → that's an exception to the no-packages rule; justify it in the note.
5. Cross-cutting change (context shape, utility class, route convention, a new section)? → **also update [00-architecture.md](00-architecture.md)**, or the map starts lying.
6. New feature? → **a new numbered note is part of the work**, not a follow-up.
