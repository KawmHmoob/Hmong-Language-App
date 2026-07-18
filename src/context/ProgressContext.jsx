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




const GUEST_KEY = 'kawmhmoob.progress.guest'

function readGuestProgress() {
  try {
    const raw = localStorage.getItem(GUEST_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    // Ignore an untouched guest state — adopting `initialState` is a no-op
    // and would mask a genuinely empty new account.
    const touched =
      parsed &&
      (parsed.xp > 0 ||
        parsed.completedSteps?.length > 0 ||
        parsed.completedLessons?.length > 0 ||
        parsed.quizScores?.length > 0 ||
        Object.keys(parsed.vocabSchedule || {}).length > 0)
    return touched ? { ...initialState, ...parsed } : null
  } catch {
    return null
  }
}

async function loadProgress(userId) {
  if (userId === 'guest') {
    return readGuestProgress() || initialState
  }

  const { data } = await supabase.from('progress').select('data').eq('user_id', userId).single()
  if (data?.data) return data.data

  // GUEST → ACCOUNT ADOPTION.
  // No row means this account has never saved progress — i.e. someone just
  // signed up. Adopt whatever they did as a guest on this device so the
  // signup wall never costs them their work (notes/36).
  //
  // Only on an EMPTY account, deliberately: a returning user logging in on a
  // borrowed device must never have their real progress overwritten by
  // whatever a guest did here. Empty is the only safe merge.
  //
  // The guest key is NOT cleared: the save effect writes to Supabase ~500ms
  // later, and clearing first would lose the data if that write failed. The
  // cost of leaving it is that a second account on this device inherits the
  // same sample progress — harmless.
  const guest = readGuestProgress()
  if (guest) return guest

  return initialState
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

// ── Session selection ───────────────────────────────────────────────────────
// A word is in exactly one of three states, and conflating them is what made
// day-one show "391 words due":
//
//   NEW      no vocabSchedule entry — never studied. Not "due", just available.
//   DUE      has a schedule, dueDate <= today — the SRS wants it back NOW.
//   WAITING  has a schedule, dueDate in the future — leave it alone.
//
// Only DUE is time-sensitive. NEW is an unlimited backlog, so it MUST be
// capped or the queue is the whole dictionary. See notes/35.

// How many never-seen words a session will introduce. The one number that
// controls daily workload — raise for cramming, lower for a gentler pace.
export const DAILY_NEW_LIMIT = 10

// Words the SRS is actively asking for (studied before, dueDate reached).
export function selectReviewWords(words, schedule) {
  const today = todayISO()
  return words.filter((w) => {
    const sched = schedule[w.id]
    return sched && sched.dueDate <= today
  })
}

// Never-studied words, in data order (curriculum order beats random).
export function selectNewWords(words, schedule, limit = DAILY_NEW_LIMIT) {
  const fresh = words.filter((w) => !schedule[w.id])
  return limit == null ? fresh : fresh.slice(0, limit)
}

// The actual day's work: every review, plus a capped handful of new words.
// Reviews come first — they're the ones with a deadline.
export function selectSession(words, schedule, limit = DAILY_NEW_LIMIT) {
  const reviews = selectReviewWords(words, schedule)
  const fresh = selectNewWords(words, schedule, limit)
  return { reviews, fresh, queue: [...reviews, ...fresh] }
}

// NOTE: `selectDueWords` used to live here and treated never-seen words as
// "due" — that's what made day one a 391-card queue. It was removed once every
// caller moved to selectSession(). Don't reintroduce it: "never seen" and
// "due for review" are different states (notes/35).
