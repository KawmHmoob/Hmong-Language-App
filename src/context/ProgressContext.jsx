import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { useAuth } from './AuthContext.jsx'
import { supabase } from '../lib/supabase.js'

const ProgressContext = createContext(null)
const KEY_PREFIX = 'kawmhmoob.progress.'

// Spaced-repetition intervals in days. Index advances on success, resets on failure.
// Mirrors the "Leitner box" model — simpler than full SM-2 but enough for an MVP.
const SRS_INTERVALS = [1, 3, 7, 14, 30, 90]

const initialState = {
  completedLessons: [],
  completedSteps: [],                                    // step ids from src/data/lessons.js
  quizScores: [],
  vocabProgress: {},                                     // { [wordId]: 'new' | 'learning' | 'known' }
  vocabSchedule: {},                                     // { [wordId]: { intervalIdx, dueDate, lastReviewedAt } }
  streakData: { currentStreak: 0, lastActiveDate: null },
  xp: 0,
}




// function loadProgress(userId) {
//   try {
//     const raw = localStorage.getItem(KEY_PREFIX + userId)
//     if (!raw) return { ...initialState }
//     const parsed = JSON.parse(raw)
//     return { ...initialState, ...parsed }
//   } catch {
//     return { ...initialState }
//   }
// }

// function saveProgress(userId, state) {
//   localStorage.setItem(KEY_PREFIX + userId, JSON.stringify(state))
// }




async function loadProgress(userId) {
  if (userId === 'guest') return JSON.parse(localStorage.getItem('kawmhmoob.progress.guest') || 'null') || initialState
  const { data } = await supabase.from('progress').select('data').eq('user_id', userId).single()
  return data?.data || initialState
}

async function saveProgress(userId, state) {
  if (userId === 'guest') {
    localStorage.setItem('kawmhmoob.progress.guest', JSON.stringify(state))
    return
  }
  await supabase.from('progress').upsert({ user_id: userId, data: state, updated_at: new Date().toISOString() })
}


function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

function nextStreak(prev, today) {
  const last = prev.lastActiveDate
  if (last === today) return prev
  if (!last) return { currentStreak: 1, lastActiveDate: today }
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
  if (last === yesterday) return { currentStreak: prev.currentStreak + 1, lastActiveDate: today }
  return { currentStreak: 1, lastActiveDate: today }
}

function nextSchedule(prev, success) {
  const idx = prev?.intervalIdx ?? -1
  const newIdx = success ? Math.min(idx + 1, SRS_INTERVALS.length - 1) : 0
  const days = SRS_INTERVALS[newIdx]
  const due = new Date(Date.now() + days * 86400000).toISOString().slice(0, 10)
  return { intervalIdx: newIdx, dueDate: due, lastReviewedAt: todayISO() }
}

export function ProgressProvider({ children }) {
  const { user } = useAuth()
  const userId = user?.id || 'guest'
  // Start with empty state; replaced by the load effect below.
  // `hydrated` gates the save effect so we don't overwrite real saved state
  // with the empty default before load completes.
  const [state, setState] = useState(initialState)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    let active = true
    setHydrated(false)
    loadProgress(userId).then((next) => {
      if (!active) return
      setState(next)
      setHydrated(true)
    })
    return () => { active = false }
  }, [userId])

  useEffect(() => {
    if (!hydrated) return
    const t = setTimeout(() => saveProgress(userId, state), 500)
    return () => clearTimeout(t)
  }, [userId, state, hydrated])

  const markLessonComplete = useCallback((lessonId) => {
    setState((s) => {
      if (s.completedLessons.includes(lessonId)) return s
      return {
        ...s,
        completedLessons: [...s.completedLessons, lessonId],
        xp: s.xp + 10,
        streakData: nextStreak(s.streakData, todayISO()),
      }
    })
  }, [])

  const markStepComplete = useCallback((stepId, opts = {}) => {
    const { lessonId } = opts
    setState((s) => {
      if (s.completedSteps.includes(stepId)) return s
      const completedSteps = [...s.completedSteps, stepId]
      const next = {
        ...s,
        completedSteps,
        xp: s.xp + 2,
        streakData: nextStreak(s.streakData, todayISO()),
      }
      // If caller passed lessonId, auto-complete the lesson once all its steps are done.
      // Caller is responsible for checking step coverage; we just append the lesson id once.
      if (lessonId && opts.lessonComplete && !s.completedLessons.includes(lessonId)) {
        next.completedLessons = [...s.completedLessons, lessonId]
        next.xp += 10
      }
      return next
    })
  }, [])

  const recordQuizScore = useCallback((entry) => {
    setState((s) => ({
      ...s,
      quizScores: [...s.quizScores, { ...entry, date: new Date().toISOString() }],
      xp: s.xp + 5,
      streakData: nextStreak(s.streakData, todayISO()),
    }))
  }, [])

  const setVocabStatus = useCallback((wordId, status) => {
    setState((s) => {
      const prev = s.vocabProgress[wordId]
      const xpDelta = status === 'known' && prev !== 'known' ? 1 : 0
      const success = status === 'known'
      return {
        ...s,
        vocabProgress: { ...s.vocabProgress, [wordId]: status },
        vocabSchedule: {
          ...s.vocabSchedule,
          [wordId]: nextSchedule(s.vocabSchedule[wordId], success),
        },
        xp: s.xp + xpDelta,
        streakData: nextStreak(s.streakData, todayISO()),
      }
    })
  }, [])

  const exportData = useCallback(() => state, [state])

  const value = useMemo(
    () => ({
      ...state,
      markLessonComplete,
      markStepComplete,
      recordQuizScore,
      setVocabStatus,
      exportData,
    }),
    [state, markLessonComplete, markStepComplete, recordQuizScore, setVocabStatus, exportData]
  )

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

export function useProgressContext() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgressContext must be used inside ProgressProvider')
  return ctx
}

// Pure helper: pass any list of word objects (with .id) and the schedule from context.
// Returns the words whose dueDate <= today, plus any never-reviewed words.
export function selectDueWords(words, schedule) {
  const today = todayISO()
  return words.filter((w) => {
    const sched = schedule[w.id]
    return !sched || sched.dueDate <= today
  })
}
