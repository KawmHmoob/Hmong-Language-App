# Architecture Overview

Read this first. Everything else assumes you understand the layout and the data flow.

## The five sections (the mental model)

The app has **five destinations**, and each owns exactly one *job*. This is the
organizing idea — when something feels redundant, it's usually because it's
answering a different question about the same material (see
[34-reference-vs-learn.md](34-reference-vs-learn.md)).

| Job | Section | Route | Format |
| --- | --- | --- | --- |
| Orient | **Home** | `/` | bento dashboard |
| Learn it | **Learn** | `/learn` | prose lessons → units → steps, XP |
| Look it up | **Reference** | `/reference` | tables, no progress |
| Say it | **Speak** | `/speak` | record & compare |
| Drill it | **Words** | `/words` | flashcards, SRS, quizzes |

Everything else (Vocabulary, Quiz, Notebook, Search, Settings, Account) is a
sub-surface reached *through* a section — `PrimaryNav` maps every URL to its
section via `match()` functions ([30-four-section-nav.md](30-four-section-nav.md)).

## Folder structure

```
src/
  main.jsx              ← React entry point. Renders <App /> into #root.
  App.jsx               ← All routes + provider wrappers. The "wiring diagram."
  index.css             ← Tailwind + theme tokens (light/dark/neon) + @layer components.

  data/                 ← Plain JS data files. Hand-editable, no build step.
    reference.js        ← consonants, doubleConsonants, vowels, tones, grammar
    lessons.js          ← units[] + helpers; composes lessons/
    lessons/            ← ONE lesson per file (concept lessons + reading-*.js)
    speak.js            ← speakGroups[] → phrases for pronunciation practice
    vocabulary.js       ← categories[] with words[] (391 words / 28 categories)
    quizzes.js          ← quiz configs (auto-generates one per vocab category)
    toneDrill.js        ← sample words for the tone-drill quiz

  context/              ← React Context providers. FOUR of them, kept narrow.
    AuthContext.jsx         ← user object + login/register/logout/updateProfile
    SubscriptionContext.jsx ← tier (free/pro) + canAccess() — the paywall
    ProgressContext.jsx     ← XP, streak, completedLessons/Steps, quizScores,
                              vocabProgress, vocabSchedule + SRS selectors
    NotebookContext.jsx     ← saved words + free-form notes

  hooks/                ← Reusable hooks. One file per hook.
    useProgress.js      ← thin alias over useProgressContext
    useQuizState.js     ← quiz lifecycle (useReducer)
    useAudio.js         ← cached playback for reference audio
    usePronunciation.js ← mic recording for Speak (MediaRecorder)
    useTheme.js         ← light/dark/neon cycle (DOM is the source of truth)

  components/           ← Reusable UI ONLY. Never routed — see the rule below.
    Layout.jsx          ← chrome: header, rail/tab-bar slot, footer, skeleton
    Navbar.jsx          ← slim identity/status bar (logo, XP, streak, theme)
    PrimaryNav.jsx      ← THE nav: desktop rail + mobile tab bar, 5 sections
    Tabs.jsx            ← segmented control for sub-views (Reference, Notebook)
    Footer.jsx
    icons/              ← index.jsx — the whole inline-SVG icon set + CategoryIcon
    common/             ← AudioButton, Breadcrumbs, SkeletonCard, PaywallGate
    home/               ← TodayCard
    learn/              ← LessonCard (shared by Learn hub + Unit pages)
    speak/              ← PronounceStep, LevelMeter
    progress/           ← XPBadge, StreakBadge, ProgressBar
    quiz/               ← QuizResults (sub-component only)
    vocabulary/         ← Flashcard (sub-component only)

  pages/                ← EVERY routed component. One per route.
    Home.jsx            /                      Search.jsx      /search
    Learn.jsx           /learn                 Settings.jsx    /settings
    Unit.jsx            /learn/:unitId         NotFound.jsx    *
    Lesson.jsx          /learn/:unitId/:lessonId
    Reference.jsx       /reference/:tab        QuizMenu.jsx    /quiz
    Speak.jsx           /speak                 QuizEngine.jsx  /quiz/:topicId
    SpeakPhrase.jsx     /speak/:phraseId       LoginForm.jsx   /login
    Words.jsx           /words                 RegisterForm.jsx /register
    WordsSession.jsx    /words/session         ProfilePage.jsx /account
    Notebook.jsx        /notebook/:tab
    VocabCategoryGrid.jsx  /vocabulary
    VocabList.jsx          /vocabulary/:categoryId
    WordDetail.jsx         /vocabulary/:categoryId/:wordId

public/
  assets/audio/         ← real MP3s. Vite serves /public at the site ROOT.
                          (There is no src/public — that path does nothing.)
```

**The pages/ rule:** if it appears as `element={<X />}` in `App.jsx`, it lives in
`pages/`. If it's a piece used *by* a page, it lives in `components/`. `Layout` is
the one exception — it's a layout route (chrome), not a destination.

## File naming

- **`.jsx`** = file contains JSX (React components, providers).
- **`.js`** = pure JS (data files, hooks that don't return JSX).
- **PascalCase** for components and providers (`Navbar.jsx`, `AuthContext.jsx`).
- **camelCase** for hooks and data (`useProgress.js`, `vocabulary.js`).

## How the app boots

```
index.html                             ← inline script sets the theme class
  └─ main.jsx                             BEFORE paint (no flash) — notes/24
       └─ <App />
            └─ <BrowserRouter>
                 └─ <AuthProvider>              ← useAuth()
                      └─ <SubscriptionProvider> ← useSubscription() — the paywall
                           └─ <ProgressProvider>    ← useProgress()
                                └─ <NotebookProvider> ← useNotebook()
                                     └─ <Routes>
                                          └─ <Route element={<Layout />}>  ← chrome
                                               └─ each <Route path=… element={<Page />}>
```

**Provider order matters.** `SubscriptionProvider`, `ProgressProvider`, and
`NotebookProvider` all call `useAuth()` to know whose data to load, so
`AuthProvider` must wrap them. The other three don't depend on each other —
they're nested only for tidiness.

**Theming is NOT a provider.** Colors resolve through CSS variables keyed off a
class on `<html>`, so a theme switch restyles the app without re-rendering React.
`useTheme` only re-renders the toggle button itself. See
[24-theming-and-polish.md](24-theming-and-polish.md).

## Data flow

```
data/*.js  ─►  context/* (loads from localStorage or hardcoded data)  ─►  hooks/*  ─►  components
                                            ▲
                                            │  writes also go through hooks
                                            │
                                       components (calling mutators)
```

Components never read `localStorage` directly and never import from `data/` for *user* state — they go through hooks. They DO import from `data/` for *reference* data (alphabet, vocabulary entries, quiz configs) since that's static.

## Routing model

All routes live in [App.jsx](../src/App.jsx). Three patterns:

```jsx
// Static route
<Route path="/settings" element={<Settings />} />

// Dynamic segment — read with useParams()
<Route path="/quiz/:topicId" element={<QuizEngine />} />

// Auto-redirect (used for tabbed sections)
<Route path="/notebook" element={<Navigate to="/notebook/saved" replace />} />
```

In a component, read params:
```jsx
import { useParams, useNavigate } from 'react-router-dom'

function MyPage() {
  const { topicId } = useParams()
  const navigate = useNavigate()
}
```

## Where to add things

| You want to add… | File / folder |
|---|---|
| A new page | `src/pages/<Name>.jsx` + a `<Route>` in `App.jsx`. Then decide its **section** and add its path to that section's `match()` in `PrimaryNav.jsx` — otherwise no tab lights up. See [30-four-section-nav.md](30-four-section-nav.md) |
| A new lesson | `src/data/lessons/<slug>.js` (one lesson per file) → import + list it in `lessons.js`. See [12-lesson-system.md](12-lesson-system.md) |
| A new unit | declare it in `lessons.js` and add to `units[]` — hub, `/learn/:unitId` page, and progress all work with no code. See [33-unit-pages.md](33-unit-pages.md) |
| A reading | a lesson file with a `reading` step + a `practice` step, in the `readings` unit. See [34-reference-vs-learn.md](34-reference-vs-learn.md) |
| A cheat sheet / lookup table | `grammar` in `src/data/reference.js`, with a `lesson:` backlink + `reference:` on the lesson |
| A Speak phrase | `src/data/speak.js` (unique `speak-…` id) — hub/routing/progress follow. See [22-speak-section.md](22-speak-section.md) |
| A new quiz | `src/data/quizzes.js`. Vocab quizzes auto-generate per category — see [01-quiz-engine.md](01-quiz-engine.md) + [35-srs-session-and-quiz-menu.md](35-srs-session-and-quiz-menu.md) |
| A vocab category or word | `src/data/vocabulary.js` — see [instructions/adding-vocabulary.md](../instructions/adding-vocabulary.md) |
| An icon | `src/components/icons/index.jsx` (24×24, currentColor, 2px round) — see [31-icon-system.md](31-icon-system.md) |
| A new piece of user *progress* state | `src/context/ProgressContext.jsx` — add to `initialState` and write a mutator |
| A new piece of user *content* (notes, custom lists) | `src/context/NotebookContext.jsx` — same pattern |
| A new field on a user | `src/context/AuthContext.jsx` — add to `guestUser` and the `login`/`register` body |
| A reusable component | `src/components/common/` if generic, or a feature folder if scoped |
| A custom hook | `src/hooks/use<Name>.js` |
| A color / theme token | BOTH `:root` and `.dark` and `[data-theme='neon']` in `src/index.css`, then map it in `tailwind.config.js`. A token missing from a theme silently renders the light value — see [24-theming-and-polish.md](24-theming-and-polish.md) |

## Conventions you'll see repeated

1. **Default export = the main thing in the file.** Helper components in the same file use `function` declarations, not exports.
2. **Routed ⇒ `pages/`.** If it's `element={<X />}` in App.jsx it lives in `pages/`; if a page uses it, `components/`. (`Layout` is the exception — it's chrome.)
3. **Hooks throw if used outside their provider.** This catches bugs early — if you see `Error: useAuth must be used inside AuthProvider`, your component is rendering outside the tree.
4. **All persistence is namespaced** under `kawmhmoob.*` localStorage keys.
5. **Tailwind tokens only — never a hex, never a `dark:` variant.** Three themes ride on the tokens; a hardcoded color silently breaks two of them.
6. **Pure helpers exported from context modules** when they're tightly coupled to the state shape (e.g. `selectSession` lives in `ProgressContext.jsx`). Pure = testable *and* portable to React Native.
7. **Derive, don't store.** Daily goals, unit counts, phrase-of-the-day, best quiz scores — all computed from existing state. Add a context field only when it can't be derived.
8. **IDs are saved user data.** Lesson/step/quiz/word/phrase ids live in users' progress. Never rename or delete one; new content gets new ids.
9. **No new npm packages.** Everything is React + Router + Tailwind. Exceptions get documented in the note that introduces them.
10. **Every implementation ships with its teaching note** in `notes/` — what / why / how / how-to-extend. A feature without its note isn't done.
