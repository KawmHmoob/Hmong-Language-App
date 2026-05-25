import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { useAuth } from './AuthContext.jsx'

// User-generated content only — not progress, not user profile.
// Two stores in one shape: savedWords (refs to vocab) and notes (free-form).
const NotebookContext = createContext(null)
const KEY_PREFIX = 'kawmhmoob.notebook.'

const initialState = {
  savedWords: {},   // { [wordId]: { note: string, savedAt: ISO } }
  notes: [],        // [{ id, title, body, tags: [], createdAt, updatedAt }]
}

function load(userId) {
  try {
    const raw = localStorage.getItem(KEY_PREFIX + userId)
    if (!raw) return { ...initialState }
    return { ...initialState, ...JSON.parse(raw) }
  } catch {
    return { ...initialState }
  }
}

function save(userId, state) {
  localStorage.setItem(KEY_PREFIX + userId, JSON.stringify(state))
}

function newId(prefix = 'note') {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
}

export function NotebookProvider({ children }) {
  const { user } = useAuth()
  const userId = user?.id || 'guest'
  const [state, setState] = useState(() => load(userId))

  useEffect(() => { setState(load(userId)) }, [userId])
  useEffect(() => { save(userId, state) }, [userId, state])

  const saveWord = useCallback((wordId, note = '') => {
    setState((s) => ({
      ...s,
      savedWords: {
        ...s.savedWords,
        [wordId]: { note, savedAt: new Date().toISOString() },
      },
    }))
  }, [])

  const unsaveWord = useCallback((wordId) => {
    setState((s) => {
      const next = { ...s.savedWords }
      delete next[wordId]
      return { ...s, savedWords: next }
    })
  }, [])

  const updateWordNote = useCallback((wordId, note) => {
    setState((s) => {
      if (!s.savedWords[wordId]) return s
      return {
        ...s,
        savedWords: {
          ...s.savedWords,
          [wordId]: { ...s.savedWords[wordId], note },
        },
      }
    })
  }, [])

  const createNote = useCallback((data = {}) => {
    const note = {
      id: newId(),
      title: data.title || '',
      body: data.body || '',
      tags: data.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setState((s) => ({ ...s, notes: [note, ...s.notes] }))
    return note.id
  }, [])

  const updateNote = useCallback((id, patch) => {
    setState((s) => ({
      ...s,
      notes: s.notes.map((n) =>
        n.id === id ? { ...n, ...patch, updatedAt: new Date().toISOString() } : n
      ),
    }))
  }, [])

  const deleteNote = useCallback((id) => {
    setState((s) => ({ ...s, notes: s.notes.filter((n) => n.id !== id) }))
  }, [])

  const value = useMemo(
    () => ({
      ...state,
      saveWord, unsaveWord, updateWordNote,
      createNote, updateNote, deleteNote,
    }),
    [state, saveWord, unsaveWord, updateWordNote, createNote, updateNote, deleteNote]
  )

  return <NotebookContext.Provider value={value}>{children}</NotebookContext.Provider>
}

export function useNotebook() {
  const ctx = useContext(NotebookContext)
  if (!ctx) throw new Error('useNotebook must be used inside NotebookProvider')
  return ctx
}
