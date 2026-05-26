# Implementation Notes

This folder is the audit trail for everything in the app. Each note explains **what** a feature is, **why** it's built that way, **how** the code works (with snippets you can paste), and **how to extend it**. Read [00-architecture.md](00-architecture.md) first if you're new to the codebase.

## How to use these notes

- **Before making a change**, open the relevant note. The "Code anatomy" section shows the existing patterns; copy them.
- **After making a change**, update the note. If you add a new mutator to `ProgressContext`, add a snippet to [03-progress-tracking.md](03-progress-tracking.md). If you create a new utility class, add it to [07-styling-system.md](07-styling-system.md). The notes only stay useful if they stay current.
- **For one-off how-tos that aren't tied to a feature** (deployment, audio file naming, Supabase migration), look in [`../instructions/`](../instructions/) instead.

## Index

0. [00-architecture.md](00-architecture.md) — Folder layout, boot sequence, data flow, where to add things
1. [01-quiz-engine.md](01-quiz-engine.md) — Generic quiz runner with multiple-choice and matching
2. [02-vocabulary.md](02-vocabulary.md) — Categories, list, flashcards, word detail
3. [03-progress-tracking.md](03-progress-tracking.md) — XP, streaks, completed lessons, vocab status, **SRS schedule**
4. [04-account-system.md](04-account-system.md) — Guest / authed user, login, register, profile
5. [05-audio-placeholder.md](05-audio-placeholder.md) — AudioButton + useAudio hook (no real audio yet)
6. [06-ui-polish.md](06-ui-polish.md) — Skeleton loading, breadcrumbs, empty states, 404
7. [07-styling-system.md](07-styling-system.md) — Color tokens, fonts, surface + button utility classes
8. [08-notebook.md](08-notebook.md) — Saved words + free-form notes (NotebookContext)
9. [09-spaced-repetition.md](09-spaced-repetition.md) — Leitner-box SRS + `/review` page + Today card
10. [10-search-and-tone-drill.md](10-search-and-tone-drill.md) — `/search` page + tone-drill quiz
11. [11-future-implementations.md](11-future-implementations.md) — Backlog: extra quiz types, dialogues, cultural modules
12. [12-lesson-system.md](12-lesson-system.md) — Structured `/learn` units → lessons → steps
13. [13-lesson-system-walkthrough.md](13-lesson-system-walkthrough.md) — Line-by-line teaching walkthrough of the lesson system code
14. [14-paywall-and-supabase.md](14-paywall-and-supabase.md) — Paywall scaffold + path to real Supabase + Stripe
15. [15-paywall-walkthrough.md](15-paywall-walkthrough.md) — Line-by-line teaching walkthrough of the paywall code
16. [16-sync-to-async-migration.md](16-sync-to-async-migration.md) — The three bugs that show up every time you migrate state from localStorage to Supabase
17. [17-usestate-and-async.md](17-usestate-and-async.md) — Why `useState(() => loadProgress(...))` breaks the moment `loadProgress` becomes async

## Conventions used across features

- **No new npm packages** — everything is React + React Router + Tailwind. (See each note for the workarounds chosen.)
- **Plain JS data exports** — every dataset is a literal array/object so non-engineers can edit by hand.
- **Three contexts** — `AuthContext`, `ProgressContext`, `NotebookContext`. Anything else is local component state.
- **localStorage keys** are namespaced under `kawmhmoob.*` so we don't collide with other apps in the browser.
- **Tailwind palette** — `cream-*` for warm neutrals, `clay-*` for the terracotta accent, `stone-*` for text. Avoid the default `amber-*` and `gray-*` outside legacy code; they don't match the warm palette. See [07-styling-system.md](07-styling-system.md).
- **Default-export the main thing** in each file. Helper components live in the same file as plain `function` declarations.
- **Hooks throw if used outside their provider** — this is intentional and catches bugs early.
- **Pure helpers exported from context modules** when tightly coupled to state shape (e.g. `selectDueWords` from `ProgressContext.jsx`).

## When you make a manual change

A short checklist to keep the notes honest:

1. Did you add a new file? → mention it in the relevant note's "Files" list.
2. Did you change a code pattern? → update the snippet in "Code anatomy."
3. Did you add a new way to extend the system? → add a step-by-step under "Adding a new X."
4. Did you add a new package or external dependency? → that's an exception to the no-new-packages rule; document it in the note explaining why.
5. Did you change something cross-cutting (a context shape, a utility class, a route convention)? → also update [00-architecture.md](00-architecture.md) so the orientation stays accurate.
