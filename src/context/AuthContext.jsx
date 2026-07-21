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
    // Onboarding / speaker metadata (all optional).
    ageRange: row.age_range,
    gender: row.gender,
    ethnicity: row.ethnicity,
    hmongRelationship: row.hmong_relationship,
    region: row.region,
    onboardedAt: row.onboarded_at,
    isGuest: false,
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(guestUser)
  const [loading, setLoading] = useState(true)
  // Set when a valid SESSION exists but the profile row can't be read. That is
  // NOT the same as being a guest, and conflating them is a data-integrity bug
  // (see below). Surfaced so the UI can tell the user their account is in a
  // broken state instead of silently demoting them.
  const [profileError, setProfileError] = useState(null)

  // Pull the profile row for a given auth user id and normalize into our shape.
  //
  // ⚠️ A failure here does NOT fall back to guest. It used to, and that was
  // dangerous: ProgressContext keys storage off `user.id || 'guest'`, so an
  // authenticated user whose profile read failed (RLS misconfig, missing row,
  // transient network) would start writing their progress to the GUEST key —
  // shared with every other person on that device, and eligible to be adopted
  // into the next account created there. Losing the profile is a recoverable
  // error; silently becoming a different identity is not. See notes/67.
  const hydrateProfile = useCallback(async (uid) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', uid)
      .single()

    if (error || !data) {
      setProfileError(error?.message || 'Profile not found')
      // Keep a minimal authed identity: the auth id is real and unique, so
      // progress still keys correctly even though the profile is unreadable.
      setUser({
        ...guestUser,
        id: uid,
        isGuest: false,
        displayName: 'Account',
        username: 'account',
      })
      return null
    }

    setProfileError(null)
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
      else {
        setUser(guestUser)
        setProfileError(null)
      }
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
    // Pass the profile fields as user METADATA so the `on_auth_user_created`
    // trigger (instructions/supabase-schema.sql) can create the profile row in
    // the same transaction as the signup. Without metadata the trigger still
    // fires but has to invent a username from the email.
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          display_name: displayName,
          dialect_preference: dialectPreference || 'white',
        },
      },
    })
    if (error) {
      // A duplicate username makes the TRIGGER fail, which fails signUp itself
      // — so the friendly message has to be handled here too, not just on the
      // upsert below.
      if (/duplicate key|unique/i.test(error.message || '')) {
        throw new Error('That username is already taken — pick another and try again.')
      }
      throw error
    }

    const uid = data.user?.id
    if (!uid) throw new Error('Sign-up succeeded but no user id was returned')

    // EMAIL CONFIRMATION ON → no session yet. Return here, BEFORE touching
    // `profiles`.
    //
    // Without a session `auth.uid()` is null, so the RLS insert policy
    // (`auth.uid() = id`) rejects the write — registration would throw even
    // though it succeeded. The trigger has already created the row server-side,
    // which is exactly why it must be the primary mechanism and this a fallback.
    if (!data.session) return { pendingConfirmation: true, email }

    // BELT AND BRACES (only reachable WITH a session). With the trigger
    // installed this is a no-op re-write of the row it just created. It stays
    // so the app still works against a database where the trigger hasn't been
    // run — e.g. a contributor's fresh project.
    //
    // If the trigger is missing and this also fails, the account is orphaned:
    // email taken, no profile, unrecoverable from the UI (deleting an auth user
    // needs the service-role key, which a browser must never hold). That's the
    // scenario the trigger exists to eliminate. See notes/68.
    const { error: profileError } = await supabase.from('profiles').upsert(
      {
        id: uid,
        username,
        display_name: displayName,
        email,
        dialect_preference: dialectPreference || 'white',
      },
      { onConflict: 'id' }
    )
    if (profileError) {
      // Surface something a human can act on, not a raw Postgres string.
      const msg = /duplicate key|unique/i.test(profileError.message || '')
        ? 'That username is already taken — pick another and try again.'
        : `Account created, but the profile could not be saved: ${profileError.message}`
      throw new Error(msg)
    }

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
    if (patch.ageRange !== undefined) dbPatch.age_range = patch.ageRange
    if (patch.gender !== undefined) dbPatch.gender = patch.gender
    if (patch.ethnicity !== undefined) dbPatch.ethnicity = patch.ethnicity
    if (patch.hmongRelationship !== undefined) dbPatch.hmong_relationship = patch.hmongRelationship
    if (patch.region !== undefined) dbPatch.region = patch.region
    if (patch.onboardedAt !== undefined) dbPatch.onboarded_at = patch.onboardedAt

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
    <AuthContext.Provider
      value={{ user, loading, profileError, login, register, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
