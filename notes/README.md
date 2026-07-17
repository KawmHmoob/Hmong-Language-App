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
   - ⚠️ Notes 01–17 predate the Speak/Words/Reference restructure. Where they conflict with notes 21–34, the later notes win.
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
18. [18-pronunciation-practice.md](18-pronunciation-practice.md) — **(Scope/planned)** Record-and-compare pronunciation ("Natulang for Hmong"), DSP tone scoring
19. [19-speech-testing.md](19-speech-testing.md) — **(Speech, not text)** Evaluating/calibrating the pronunciation scorer vs. human labels — distinct from the text quizzes in note 01
20. [20-modernization-prompt.md](20-modernization-prompt.md) — **(Prompt)** Paste-ready prompt to modernize the UI + split the app into two sections: **Speak** (natulang) and **Words** (Duolingo)
21. [21-two-section-nav.md](21-two-section-nav.md) — Two front doors (Speak/Words): PrimaryNav rail + bottom tab bar, slim header, seafoam/blush palette fix, focus rings
22. [22-speak-section.md](22-speak-section.md) — Speak section: record & compare loop, `usePronunciation` hook, level meter, `src/data/speak.js` (Phase 1 of note 18)
23. [23-words-section.md](23-words-section.md) — Words section: unified vocab hub, derived daily goal, SRS session flow (supersedes `/review`)
24. [24-theming-and-polish.md](24-theming-and-polish.md) — Dark/light theming via semantic CSS-variable tokens, glass chrome, radii/press polish, RN migration mapping
25. [25-neon-theme-and-bento-home.md](25-neon-theme-and-bento-home.md) — Third "Neon" theme (violet/coral/teal, glow shadows), 3-way theme cycle, bento Home dashboard with phrase of the day
26. [26-cleanup-prompt.md](26-cleanup-prompt.md) — **(Prompt)** Paste-ready cleanup pass: fill PLACEHOLDERs with real Hmong (TODO-VERIFY guardrails), dead-code/bug fixes, content unification, RN migration folder
27. [27-content-fill-slice-a.md](27-content-fill-slice-a.md) — Slice A executed: all lesson PLACEHOLDERs filled with real White Hmong, Nrhh corrected, TODO-VERIFY review list for a native speaker
28. [28-dead-code-and-bug-fixes.md](28-dead-code-and-bug-fixes.md) — Slice B executed: Review.jsx deleted, the three-bugs-in-one-line lesson audio fix, color/link sweeps clean
29. [29-navigation-and-visual-system-prompt.md](29-navigation-and-visual-system-prompt.md) — **(Prompt)** The "looks like 2011" fix: IA/nav rebuild, icon system replacing emoji, elevation ladder, language-forward type scale
30. [30-four-section-nav.md](30-four-section-nav.md) — Priority 1 executed: four-section IA (Home/Learn/Speak/Words), sliding tab indicator, section accents, "More" sheet deleted
31. [31-icon-system.md](31-icon-system.md) — Priority 2 executed: inline-SVG icon set replaces all chrome emoji, CategoryIcon fallback pattern, header professionalized
32. [32-alphabet-section-and-mojibake.md](32-alphabet-section-and-mojibake.md) — Alphabet promoted to a 5th nav section (amends note 30's four-tab rule) + the app-wide mojibake repair and what causes it
33. [33-unit-pages.md](33-unit-pages.md) — Learn split into a hub (2 previews per unit + See all) and per-unit pages at `/learn/:unitId`; shared LessonCard extracted
34. [34-reference-vs-learn.md](34-reference-vs-learn.md) — **Course dissolved.** Organizing surfaces by job (look up / learn / drill / say): `/alphabet`→`/reference` + Grammar tab, Readings unit + `reading` step kind, Tense Markers lesson, two-way cross-links

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
