import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthCard, Field, Notice } from '../components/site/AuthCard.jsx'
import { supabase } from '../lib/supabase.js'

// /admin — sign in, and (if you're an admin) open the archived original web app.
//
// WHERE THE SECURITY IS: not in this file. This page's code ships to every
// browser, so anything it "hides" is readable by anyone. The real gate is in
// Supabase (instructions/admin-setup.sql):
//   - `admins` — a user can read only their own row → "am I an admin?"
//   - `admin_settings` — readable only by admins (RLS) → holds the archive URL
// A non-admin who signs in gets zero rows back, so the archive URL never
// reaches them. It is never in the site's JavaScript at all.
//
// Unlisted: nothing links here, and vercel.json sends `X-Robots-Tag: noindex`
// so search engines skip it. Session is memory-only (lib/supabase.js): reload
// = signed out. See notes/74.

// Facts about the archive itself — fixed forever, because a git tag doesn't move.
const ARCHIVE = {
  tag: 'webapp-v1',
  branch: 'archive/webapp-v1',
  commit: '61e5e8b',
  contents: 'Lessons, words & flashcards, quizzes, Speak with the tone scorer, accounts & onboarding, leaderboard, season pass.',
}

export default function Admin() {
  // unavailable | signed-out | checking | admin | not-admin | setup-needed | error
  const [phase, setPhase] = useState(supabase ? 'checking' : 'unavailable')
  const [user, setUser] = useState(null)
  const [settings, setSettings] = useState({})
  const [error, setError] = useState(null)

  // Ask Supabase whether this user is an admin, then load admin-only settings.
  const verify = useCallback(async (u) => {
    setUser(u)
    setPhase('checking')

    const { data: row, error: e1 } = await supabase
      .from('admins')
      .select('user_id')
      .eq('user_id', u.id)
      .maybeSingle()

    if (e1) {
      // Table missing = the SQL hasn't been run yet. PostgREST reports that as
      // PGRST205 (newer) or Postgres 42P01 (older).
      if (e1.code === 'PGRST205' || e1.code === '42P01') return setPhase('setup-needed')
      setError(e1.message)
      return setPhase('error')
    }
    if (!row) return setPhase('not-admin')

    const { data: rows, error: e2 } = await supabase.from('admin_settings').select('key, value')
    if (e2) {
      if (e2.code === 'PGRST205' || e2.code === '42P01') return setPhase('setup-needed')
      setError(e2.message)
      return setPhase('error')
    }
    setSettings(Object.fromEntries((rows ?? []).map((r) => [r.key, r.value])))
    setPhase('admin')
  }, [])

  useEffect(() => {
    if (!supabase) return
    let alive = true

    // Already signed in during this tab's life (e.g. navigated away and back)?
    supabase.auth.getSession().then(({ data }) => {
      if (!alive) return
      if (data.session) verify(data.session.user)
      else setPhase('signed-out')
    })
    // A failed token refresh (or sign-out elsewhere) ends the session.
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (alive && event === 'SIGNED_OUT') {
        setUser(null)
        setSettings({})
        setPhase('signed-out')
      }
    })
    return () => {
      alive = false
      sub.subscription.unsubscribe()
    }
  }, [verify])

  async function signOut() {
    await supabase.auth.signOut({ scope: 'local' })
    // onAuthStateChange resets the state; set it here too in case it doesn't fire.
    setUser(null)
    setSettings({})
    setPhase('signed-out')
  }

  if (phase === 'unavailable') {
    return (
      <AuthCard title="Admin">
        <Notice>Supabase isn’t configured for this site (missing VITE_SUPABASE_* variables).</Notice>
      </AuthCard>
    )
  }
  if (phase === 'checking') {
    return (
      <AuthCard title="Admin">
        <p role="status" className="text-stone-700">Checking access…</p>
      </AuthCard>
    )
  }
  if (phase === 'signed-out') return <SignIn onSignedIn={verify} />

  if (phase === 'not-admin') {
    return (
      <AuthCard title="No admin access">
        <p className="text-stone-700 leading-relaxed mb-6">
          You’re signed in as <strong>{user?.email}</strong>, but this account isn’t an admin.
        </p>
        <button type="button" onClick={signOut} className="btn-ghost">Sign out</button>
      </AuthCard>
    )
  }
  if (phase === 'setup-needed' || phase === 'error') {
    return (
      <AuthCard title="Admin">
        <Notice>
          {phase === 'setup-needed'
            ? 'The admin tables don’t exist yet. Run instructions/admin-setup.sql in the Supabase SQL editor.'
            : `Couldn’t check admin access: ${error}`}
        </Notice>
        <button type="button" onClick={signOut} className="btn-ghost">Sign out</button>
      </AuthCard>
    )
  }

  // phase === 'admin'
  const archiveUrl = safeHttps(settings.archive_url)
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex flex-wrap items-end justify-between gap-3 mb-8">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] font-semibold text-clay-700">Admin</p>
          <h1 className="font-display text-4xl text-stone-900">Dashboard</h1>
        </div>
        <div className="flex items-center gap-3 text-sm text-stone-700">
          <span>{user?.email}</span>
          <button type="button" onClick={signOut} className="btn-ghost">Sign out</button>
        </div>
      </div>

      <section className="rounded-2xl bg-cream-50 border border-cream-200 p-6 sm:p-8">
        <h2 className="font-display text-2xl text-stone-900">Original web app (archive)</h2>
        <p className="mt-2 text-stone-700 leading-relaxed">
          The full learning web app as it was before kawmhmoob.com became the showcase. {ARCHIVE.contents}
        </p>

        <dl className="mt-5 grid sm:grid-cols-3 gap-3 text-sm">
          <Fact label="Git tag" value={ARCHIVE.tag} />
          <Fact label="Branch" value={ARCHIVE.branch} />
          <Fact label="Commit" value={ARCHIVE.commit} />
        </dl>

        {archiveUrl ? (
          <div className="mt-6">
            <a href={archiveUrl} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex py-3 px-5 text-base">
              Open the archive ↗
            </a>
            <p className="mt-3 text-sm text-stone-600">
              Opens the Vercel deployment of <code>{ARCHIVE.branch}</code>. If Vercel asks you to sign
              in, that’s its deployment protection doing its job.
            </p>
          </div>
        ) : (
          <div className="mt-6">
            <Notice>
              {settings.archive_url
                ? 'The archive_url setting isn’t a valid https:// address.'
                : 'No archive URL is set yet.'}{' '}
              Push the <code>{ARCHIVE.branch}</code> branch, copy its Vercel branch URL, and set
              it with step 4 of <code>instructions/admin-setup.sql</code>.
            </Notice>
          </div>
        )}

        <div className="mt-6 border-t border-cream-200 pt-5">
          <h3 className="font-semibold text-stone-900">Run it locally instead</h3>
          <pre className="mt-2 overflow-x-auto rounded-lg bg-cream-100 border border-cream-200 p-3 text-sm text-stone-800">
            <code>{`git switch ${ARCHIVE.branch}\nnpm install && npm run dev`}</code>
          </pre>
        </div>
      </section>
    </div>
  )
}

function SignIn({ onSignedIn }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  async function submit(e) {
    e.preventDefault()
    setError(null)
    setBusy(true)
    const { data, error: err } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })
    setBusy(false)
    if (err) {
      setError(
        err.status === 429
          ? 'Too many attempts. Wait a minute and try again.'
          : err.message === 'Invalid login credentials'
            ? 'Email or password is incorrect.'
            : err.message,
      )
      return
    }
    setPassword('')
    onSignedIn(data.user)
  }

  return (
    <AuthCard title="Admin sign in" intro="Sign in with your Kawm Hmoob account.">
      {error && <Notice>{error}</Notice>}
      <form onSubmit={submit} noValidate>
        <Field
          id="admin-email"
          label="Email"
          type="email"
          autoComplete="email"
          autoFocus
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Field
          id="admin-password"
          label="Password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" disabled={busy} className="btn-primary w-full py-3 text-base disabled:opacity-60">
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <p className="mt-6 text-sm text-stone-600">
        <Link to="/reset-password" className="text-clay-700 underline">Forgot your password?</Link>
      </p>
    </AuthCard>
  )
}

function Fact({ label, value }) {
  return (
    <div className="rounded-lg bg-cream-100 border border-cream-200 px-3 py-2">
      <dt className="text-xs uppercase tracking-wider text-stone-600">{label}</dt>
      <dd className="font-mono text-stone-900">{value}</dd>
    </div>
  )
}

// Only ever link to an https:// URL. The value comes from the database, and an
// href like "javascript:…" would run code on click — so validate, don't trust.
function safeHttps(value) {
  try {
    const u = new URL(value)
    return u.protocol === 'https:' ? u.href : null
  } catch {
    return null
  }
}
