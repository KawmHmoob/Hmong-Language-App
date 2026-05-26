import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase.js'

// Auth + profile via Supabase.
//   - auth.users  — managed by Supabase, keyed by email
//   - profiles    — our table, 1:1 with auth.users, holds app-specific fields
//
// The exported API (user, login, register, logout, updateProfile) matches the
// previous localStorage-only version so consuming components didn't have to change.
//
// See instructions/supabase-first-time-setup.md and instructions/supabase-integration.md.

const AuthContext = createContext(null)

const guestUser = {
  id: 'guest',
  username: 'guest',
  displayName: 'Guest',
  email: '',
  dialectPreference: 'white',
  joinedAt: null,
  isGuest: true,
}

function rowToUser(row) {
  return {
    id: row.id,
    username: row.username,
    displayName: row.display_name,
    email: row.email,
    dialectPreference: row.dialect_preference,
    joinedAt: row.joined_at,
    isGuest: false,
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(guestUser)
  const [loading, setLoading] = useState(true)

  // Pull the profile row for a given auth user id and normalize into our shape.
  // If no row exists yet (e.g. profile insert is pending after signup), fall
  // back to guest so the app doesn't render in a half-broken state.
  const hydrateProfile = useCallback(async (uid) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', uid)
      .single()
    if (error || !data) {
      setUser(guestUser)
      return null
    }
    const next = rowToUser(data)
    setUser(next)
    return next
  }, [])

  // Boot: read existing session (browser remembered a login), then subscribe
  // to future auth changes (login/logout in another tab, token refresh, etc.).
  useEffect(() => {
    let active = true

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return
      const session = data?.session
      if (session) hydrateProfile(session.user.id).finally(() => setLoading(false))
      else { setUser(guestUser); setLoading(false) }
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return
      if (session) hydrateProfile(session.user.id)
      else setUser(guestUser)
    })

    return () => {
      active = false
      sub?.subscription?.unsubscribe?.()
    }
  }, [hydrateProfile])

  const login = useCallback(async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return hydrateProfile(data.user.id)
  }, [hydrateProfile])

  const register = useCallback(async ({ email, password, username, displayName, dialectPreference }) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error

    // If email confirmation is OFF, signUp returns a session and we proceed.
    // If confirmation is ON, data.user exists but data.session is null — the
    // profile insert below still works because the row only references
    // auth.users.id, which Supabase has already written.
    const uid = data.user?.id
    if (!uid) throw new Error('Sign-up succeeded but no user id was returned')

    const { error: profileError } = await supabase.from('profiles').insert({
      id: uid,
      username,
      display_name: displayName,
      email,
      dialect_preference: dialectPreference || 'white',
    })
    if (profileError) throw profileError

    // No session yet means "check your email." Caller should show that UI.
    if (!data.session) return { pendingConfirmation: true, email }
    return hydrateProfile(uid)
  }, [hydrateProfile])

  const logout = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(guestUser)
  }, [])

  // Reads the current session to avoid a stale `user` closure dependency.
  const updateProfile = useCallback(async (patch) => {
    const { data: sessData } = await supabase.auth.getSession()
    const uid = sessData?.session?.user?.id
    if (!uid) throw new Error('Not authenticated')

    const dbPatch = {}
    if (patch.username !== undefined) dbPatch.username = patch.username
    if (patch.displayName !== undefined) dbPatch.display_name = patch.displayName
    if (patch.email !== undefined) dbPatch.email = patch.email
    if (patch.dialectPreference !== undefined) dbPatch.dialect_preference = patch.dialectPreference

    const { data, error } = await supabase
      .from('profiles')
      .update(dbPatch)
      .eq('id', uid)
      .select()
      .single()
    if (error) throw error

    const next = rowToUser(data)
    setUser(next)
    return next
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
