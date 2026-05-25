# Architecture Overview

Read this first. Everything else assumes you understand the layout and the data flow.

## Folder structure

```
src/
  main.jsx              ← React entry point. Renders <App /> into #root.
  App.jsx               ← All routes + provider wrappers. The "wiring diagram."
  index.css             ← Tailwind directives + custom @layer base / @layer components.

  data/                 ← Plain JS data files. Hand-editable, no build step.
    alphabet.js         ← consonants, vowels, tones (RPA reference data)
    course.js           ← grammar, everyday, readings
    quizzes.js          ← quiz configs + dataset adapters
    vocabulary.js       ← categories[] with words[]
    toneDrill.js        ← sample words for the tone-drill quiz

  context/              ← React Context providers. Three of them, kept narrow.
    AuthContext.jsx     ← user object + login/register/logout/updateProfile
    ProgressContext.jsx ← XP, streak, completedLessons, quizScores, vocabProgress, vocabSchedule
    NotebookContext.jsx ← saved words + free-form notes

  hooks/                ← Reusable hooks. One file per hook.
    useProgress.js      ← thin alias over useProgressContext
    useQuizState.js     ← quiz lifecycle (useReducer)
    useAudio.js         ← placeholder audio play function

  components/           ← Reusable UI. Grouped by feature folder.
    Layout.jsx          ← page chrome (background, navbar slot, footer, skeleton)
    Navbar.jsx          ← top nav with badges and search/settings/account icons
    Tabs.jsx            ← URL-driven tab strip used by Alphabet, Course, Notebook
    common/             ← cross-feature primitives
      AudioButton.jsx
      Breadcrumbs.jsx
      SkeletonCard.jsx
    home/               ← home-page widgets
      TodayCard.jsx
    progress/           ← XP / streak / progress bar UI
    quiz/               ← quiz UI
    vocabulary/         ← vocab UI
    account/            ← auth forms + profile

  pages/                ← Top-level route components. One per top-level route.
    Home.jsx
    Alphabet.jsx
    Course.jsx
    Notebook.jsx
    Review.jsx
    Search.jsx
    Settings.jsx
    NotFound.jsx
```

## File naming

- **`.jsx`** = file contains JSX (React components, providers).
- **`.js`** = pure JS (data files, hooks that don't return JSX).
- **PascalCase** for components and providers (`Navbar.jsx`, `AuthContext.jsx`).
- **camelCase** for hooks and data (`useProgress.js`, `vocabulary.js`).

## How the app boots

```
main.jsx
  └─ <App />
       └─ <BrowserRouter>
            └─ <AuthProvider>            ← user is now available via useAuth()
                 └─ <ProgressProvider>   ← progress is now available via useProgress()
                      └─ <NotebookProvider> ← notebook via useNotebook()
                           └─ <Routes>
                                └─ <Route element={<Layout />}>  ← page chrome
                                     └─ each <Route path=... element={<Page />}>
```

**Provider order matters.** `ProgressProvider` and `NotebookProvider` both call `useAuth()` to know whose data to load, so `AuthProvider` must wrap them. `NotebookProvider` does *not* depend on `ProgressProvider` — they're nested only for tidiness.

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
| A new top-level page | `src/pages/<Name>.jsx`, then add a `<Route>` in `App.jsx` and a link in `Navbar.jsx` |
| A new quiz | `src/data/quizzes.js` — see [01-quiz-engine.md](01-quiz-engine.md) |
| A new vocab category or word | `src/data/vocabulary.js` — see [instructions/adding-vocabulary.md](../instructions/adding-vocabulary.md) |
| A new piece of user *progress* state | `src/context/ProgressContext.jsx` — add to `initialState` and write a mutator |
| A new piece of user *content* (notes, custom lists) | `src/context/NotebookContext.jsx` — same pattern |
| A new field on a user | `src/context/AuthContext.jsx` — add to `guestUser` and the `login`/`register` body |
| A reusable component | `src/components/common/` if generic, or a feature folder if scoped |
| A custom hook | `src/hooks/use<Name>.js` |
| A new color or utility class | `tailwind.config.js` (token) and/or `src/index.css` (utility class) — see [07-styling-system.md](07-styling-system.md) |

## Conventions you'll see repeated

1. **Default export = the main thing in the file.** Helper components in the same file use `function` declarations, not exports.
2. **Hooks throw if used outside their provider.** This catches bugs early — if you see `Error: useAuth must be used inside AuthProvider`, your component is rendering outside the tree.
3. **All persistence is namespaced** under `kawmhmoob.*` localStorage keys.
4. **Tailwind-only styling.** No CSS modules, no styled-components. If you reach for inline `style={{...}}`, it should be for a value Tailwind can't express (e.g. dynamic widths, gradients with custom stops).
5. **Pure helpers exported from context modules** when they're tightly coupled to the state shape (e.g. `selectDueWords` lives in `ProgressContext.jsx`).
