// Real Supabase client when env vars are present; stub otherwise.
//
// The stub returns the same { data, error } shape so calling code is written
// once and works in either mode. This lets contributors who haven't filled in
// .env.local still run the app — every Supabase call just errors gracefully.
//
// See:
//   - instructions/supabase-first-time-setup.md (account + project + RLS)
//   - instructions/supabase-integration.md (code migration)
//   - notes/14-paywall-and-supabase.md (subscription layer)

import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export function isSupabaseConfigured() {
  return Boolean(url && anonKey)
}

function stubResult(message) {
  return Promise.resolve({
    data: null,
    error: { message: `Supabase not configured: ${message}` },
  })
}

const stubClient = {
  auth: {
    getSession: () => stubResult('auth.getSession'),
    signInWithPassword: () => stubResult('auth.signInWithPassword'),
    signUp: () => stubResult('auth.signUp'),
    signOut: () => stubResult('auth.signOut'),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  },
  from: (table) => ({
    select: () => stubResult(`from(${table}).select`),
    insert: () => stubResult(`from(${table}).insert`),
    update: () => stubResult(`from(${table}).update`),
    upsert: () => stubResult(`from(${table}).upsert`),
    delete: () => stubResult(`from(${table}).delete`),
    eq: function () { return this },
    single: function () { return this },
  }),
}

export const supabase = isSupabaseConfigured()
  ? createClient(url, anonKey)
  : stubClient
