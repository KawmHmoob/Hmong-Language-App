import { useCallback, useReducer } from 'react'

// Quiz lifecycle: idle -> active -> finished -> (reviewing)
const initial = {
  status: 'idle',
  questions: [],
  currentIndex: 0,
  answers: [],
  score: 0,
  streak: 0,
  bestStreak: 0,
  startedAt: null,
  finishedAt: null,
}

function reducer(state, action) {
  switch (action.type) {
    case 'start':
      return {
        ...initial,
        status: 'active',
        questions: action.questions,
        startedAt: Date.now(),
      }
    case 'answer': {
      const { isCorrect, selected } = action
      const newStreak = isCorrect ? state.streak + 1 : 0
      return {
        ...state,
        answers: [
          ...state.answers,
          {
            questionIndex: state.currentIndex,
            selected,
            correct: state.questions[state.currentIndex].answer,
            isCorrect,
          },
        ],
        score: state.score + (isCorrect ? 1 : 0),
        streak: newStreak,
        bestStreak: Math.max(state.bestStreak, newStreak),
      }
    }
    case 'next':
      if (state.currentIndex + 1 >= state.questions.length) {
        return { ...state, status: 'finished', finishedAt: Date.now() }
      }
      return { ...state, currentIndex: state.currentIndex + 1 }
    case 'review':
      return { ...state, status: 'reviewing' }
    case 'reset':
      return initial
    default:
      return state
  }
}

export function useQuizState() {
  const [state, dispatch] = useReducer(reducer, initial)

  const start = useCallback((questions) => dispatch({ type: 'start', questions }), [])
  const answer = useCallback((selected, isCorrect) => dispatch({ type: 'answer', selected, isCorrect }), [])
  const next = useCallback(() => dispatch({ type: 'next' }), [])
  const review = useCallback(() => dispatch({ type: 'review' }), [])
  const reset = useCallback(() => dispatch({ type: 'reset' }), [])

  return { state, start, answer, next, review, reset }
}
