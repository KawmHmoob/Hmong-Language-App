# Quiz Engine

## What
A generic quiz runner that accepts a quiz config + a normalized dataset and produces a multi-question session with scoring, streaks, a timer, immediate feedback, and a results screen with mistake review.

Now hosts six quizzes including a **Tone Drill** that asks the user to identify the tone of real Hmong words.

## Files
- `src/data/quizzes.js` — quiz configs + `getQuizConfig(id)` + `getQuizDataset(id)`
- `src/data/toneDrill.js` — sample words for the tone drill (see [10-search-and-tone-drill.md](10-search-and-tone-drill.md))
- `src/components/quiz/QuizMenu.jsx` — grid of available quizzes at `/quiz`
- `src/components/quiz/QuizEngine.jsx` — runner, mounted at `/quiz/:topicId`
- `src/components/quiz/QuizResults.jsx` — end screen with circular progress + mistakes list
- `src/hooks/useQuizState.js` — `useReducer`-based lifecycle: `idle | active | finished | reviewing`

## Why
- **Reducer for lifecycle** — quiz state has many transitions (start, answer, next, finish, review, reset). A `useReducer` keeps them in one place and makes the state machine explicit.
- **Separated config + dataset** — configs (in `quizzes.js`) live alongside a dataset adapter so each underlying source (alphabet, course, vocab) keeps its native shape and is normalized only when the quiz needs it. Adding a new quiz = add one entry to `quizzes` and one `case` to `getQuizDataset`.
- **`{ prompt, answer }` normalization** — the engine never sees `letter`/`sound`/`hmong`/`english`/`word`/`tone`. It only sees `prompt` and `answer`, so question generation logic is dataset-agnostic.

## Code anatomy

### Quiz config shape

```js
{
  id: 'alphabet-consonants',          // URL slug + dataset lookup key
  title: 'Consonants',
  description: 'Match Hmong consonants to their sounds.',
  questionCount: 10,                  // capped at dataset.length
  questionTypes: ['multiple-choice'], // rotated through if multiple
  category: 'Alphabet',               // for the menu grouping
}
```

### Dataset adapter pattern

The same source data feeds the lessons UI and the quiz. `getQuizDataset` normalizes whatever shape the source uses into `{ prompt, answer }`:

```js
case 'alphabet-consonants':
  return consonants.map((c) => ({ prompt: c.letter, answer: c.sound }))
case 'tone-drill':
  return toneDrillWords.map((w) => ({ prompt: w.word, answer: w.tone }))
case 'grammar-pronouns': {
  const group = grammar.find((g) => g.title === 'Pronouns')
  return group ? group.items.map((i) => ({ prompt: i.hmong, answer: i.english })) : []
}
```

### Question generation

```js
function buildQuestions(config, dataset) {
  const types = config.questionTypes || ['multiple-choice']
  const count = Math.min(config.questionCount, dataset.length)
  const pool = shuffle(dataset).slice(0, count)
  return pool.map((item, i) => {
    const type = types[i % types.length]   // rotate types
    if (type === 'matching') { /* build pairs */ }
    // multiple-choice: 1 correct + 3 distractors, shuffled
    const distractors = shuffle(dataset.filter(d => d.answer !== item.answer)).slice(0, 3)
    return { type, prompt: item.prompt, answer: item.answer,
             options: shuffle([item, ...distractors]).map(d => d.answer) }
  })
}
```

### Lifecycle reducer

```js
// src/hooks/useQuizState.js
function reducer(state, action) {
  switch (action.type) {
    case 'start':  return { ...initial, status: 'active', questions: action.questions, startedAt: Date.now() }
    case 'answer': /* push to answers[], update score and streak */
    case 'next':   /* advance currentIndex, or transition to 'finished' */
    case 'review': return { ...state, status: 'reviewing' }
    case 'reset':  return initial
  }
}
```

The engine never sets state directly — it dispatches actions through `start`, `answer`, `next`, `review`, `reset` callbacks returned by `useQuizState()`.

### Persistence on finish

`QuizEngine.jsx` saves the score exactly once per run:

```js
const [savedThisRun, setSavedThisRun] = useState(false)

useEffect(() => {
  if (state.status === 'finished' && !savedThisRun) {
    recordQuizScore({
      quizId: topicId,
      score: state.score,
      maxScore: state.questions.length,
      accuracy: Math.round((state.score / state.questions.length) * 100),
    })
    setSavedThisRun(true)
  }
}, [state.status, ...])
```

The `savedThisRun` guard is important — without it, React Strict Mode (or any extra render) would record the same score twice.

## Adding a new quiz

1. Open `src/data/quizzes.js`.
2. Add a config:
   ```js
   {
     id: 'food-basics',
     title: 'Food Basics',
     description: 'Common food words.',
     questionCount: 8,
     questionTypes: ['multiple-choice'],
     category: 'Vocabulary',
   }
   ```
3. Add a `case` in `getQuizDataset`:
   ```js
   case 'food-basics': {
     const cat = getCategory('food')   // import from vocabulary.js
     return cat.words.map(w => ({ prompt: w.hmongRPA, answer: w.english }))
   }
   ```
4. Save. The new quiz now appears at `/quiz` and runs at `/quiz/food-basics`.

## Adding a new question type

1. In `buildQuestions` (in `QuizEngine.jsx`), add a branch for your type that returns an object with `type: 'your-type'`, `prompt`, `answer`, and any extra fields the renderer needs.
2. Add a renderer component below `MultipleChoice` and `Matching`.
3. In the engine's main JSX, add another conditional render:
   ```jsx
   {q.type === 'your-type' && (
     <YourType question={q} feedback={feedback} onAnswer={(isCorrect) => {
       if (feedback) return
       answer('your-answer-payload', isCorrect)
       setFeedback(isCorrect ? 'correct' : 'incorrect')
     }} />
   )}
   ```
4. Add `'your-type'` to the `questionTypes` array of any quiz config that should use it.
