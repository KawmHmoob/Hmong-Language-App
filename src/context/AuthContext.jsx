import { createContext, useContext, useEffect, useState, useCallback } from 'react'

// Supabase migration: see instructions/supabase-integration.md
// All side effects are localized to loadFromStorage / saveToStorage and
// the login / register / logout / updateProfile callbacks below.

const AuthContext = createContext(null)
const STORAGE_KEY = 'kawmhmoob.auth'

const guestUser = {
  id: 'guest',
  username: 'guest',
  displayName: 'Guest',
  email: '',
  dialectPreference: 'white',
  joinedAt: null,
  isGuest: true,
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function saveToStorage(user) {
  if (user && !user.isGuest) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(STORAGE_KEY)
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => loadFromStorage() || guestUser)

  useEffect(() => {
    saveToStorage(user)
  }, [user])

  const login = useCallback((credentials) => {
    const next = {
      id: credentials.username,
      username: credentials.username,
      displayName: credentials.displayName || credentials.username,
      email: credentials.email || '',
      dialectPreference: credentials.dialectPreference || 'white',
      joinedAt: credentials.joinedAt || new Date().toISOString(),
      isGuest: false,
    }
    setUser(next)
    return next
  }, [])

  const register = useCallback((data) => {
    const next = {
      id: data.username,
      username: data.username,
      displayName: data.displayName || data.username,
      email: data.email || '',
      dialectPreference: data.dialectPreference || 'white',
      joinedAt: new Date().toISOString(),
      isGuest: false,
    }
    setUser(next)
    return next
  }, [])

  const logout = useCallback(() => {
    setUser(guestUser)
  }, [])

  const updateProfile = useCallback((patch) => {
    setUser((prev) => ({ ...prev, ...patch }))
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
