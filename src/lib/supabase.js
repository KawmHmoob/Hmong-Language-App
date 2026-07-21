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

// A THENABLE query builder: every method returns `this`, so any chain length
// works, and `await` resolves via `then`.
//
// The previous stub returned a Promise from select()/insert()/etc. and put
// eq()/single() on the object returned by from(). That broke the moment anyone
// chained — `from('profiles').select('*').eq('id', uid)` called `.eq` on a
// Promise and threw "eq is not a function". So the "runs without Supabase
// configured" promise in this file's header didn't actually hold. See notes/67.
function stubQuery(label) {
  const q = {
    then: (resolve, reject) => stubResult(label).then(resolve, reject),
    catch: (fn) => stubResult(label).catch(fn),
    finally: (fn) => stubResult(label).finally(fn),
  }
  for (const m of [
    'select', 'insert', 'update', 'upsert', 'delete',
    'eq', 'neq', 'in', 'order', 'limit', 'single', 'maybeSingle', 'match',
  ]) {
    q[m] = () => q
  }
  return q
}

const stubClient = {
  auth: {
    getSession: () => stubResult('auth.getSession'),
    signInWithPassword: () => stubResult('auth.signInWithPassword'),
    signUp: () => stubResult('auth.signUp'),
    signOut: () => stubResult('auth.signOut'),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  },
  from: (table) => stubQuery(`from(${table})`),
}

export const supabase = isSupabaseConfigured()
  ? createClient(url, anonKey)
  : stubClient
