// Placeholder Supabase client.
//
// Today: no real client. Every call goes through this module so when we wire
// the real SDK later, only this file changes.
//
// To activate:
//   1. npm install @supabase/supabase-js
//   2. fill in .env.local from .env.example
//   3. uncomment the real client below and delete the stub
//
// See instructions/supabase-integration.md for the full migration plan and
// notes/14-paywall-and-supabase.md for how the subscription layer plugs in.

// import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export function isSupabaseConfigured() {
  return Boolean(url && anonKey)
}

// Stub client. Real client returns Promises of { data, error }; this one
// returns the same shape so callers can be written today and Just Work later.
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

// export const supabase = isSupabaseConfigured()
//   ? createClient(url, anonKey)
//   : stubClient
export const supabase = stubClient
