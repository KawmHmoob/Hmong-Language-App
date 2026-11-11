import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthCard, Field, Notice } from '../components/site/AuthCard.jsx'
import { MOBILE_APP } from '../data/mobileApp.js'
import { supabase, initialUrlHash } from '../lib/supabase.js'

// STEP 2 of password reset: the page the email link opens.
//
// How the link becomes permission to change the password:
//   1. Supabase verifies the token in the email link, then redirects here with
//      a short-lived session in the URL fragment (#access_token=…&type=recovery).
//   2. supabase-js (detectSessionInUrl) reads the fragment, holds that session
//      in memory, and wipes the fragment from the address bar.
//   3. updateUser({ password }) changes the password FOR THAT SESSION'S USER.
//      Nothing else identifies the user — no email field on this page.
//   4. We sign the recovery session out. The site has no accounts; the person
//      signs in to the app with the new password.
//
// A dead link (expired, already used) arrives as #error_code=otp_expired&…
// instead. initialUrlHash is a snapshot taken before supabase-js cleared the
// fragment, so we can still say WHY. See notes/73.

const MIN_LENGTH = 8

// Phase: checking → ready → saving → done, or → invalid / unavailable.
export default function UpdatePassword() {
  const [phase, setPhase] = useState(() => {
    if (!supabase) return 'unavailable'
    return linkError() ? 'invalid' : 'checking'
  })
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [fieldError, setFieldError] = useState(null)
  const [error, setError] = useState(null)
  // Which account this link resets — read from the recovery session, shown so
  // the person can confirm it, and fed to password managers.
  const [email, setEmail] = useState('')

  useEffect(() => {
    if (phase !== 'checking') return
    let alive = true

    // getSession() waits for supabase-js to finish reading the URL fragment,
    // so by the time it resolves we know whether the link carried a session.
    supabase.auth.getSession().then(({ data }) => {
      if (!alive) return
      setEmail(data.session?.user?.email ?? '')
      setPhase(data.session ? 'ready' : 'invalid')
    })
    // Belt and braces: the recovery event can also announce the session.
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (alive && event === 'PASSWORD_RECOVERY' && session) {
        setEmail(session.user?.email ?? '')
        setPhase('ready')
      }
    })

    return () => {
      alive = false
      sub.subscription.unsubscribe()
    }
  }, [phase])

  async function save(e) {
    e.preventDefault()
    setError(null)
    setFieldError(null)

    if (password.length < MIN_LENGTH) {
      setFieldError(`Use at least ${MIN_LENGTH} characters.`)
      return
    }
    if (password !== confirm) {
      setFieldError('The two passwords don’t match.')
      return
    }

    setPhase('saving')
    const { error: err } = await supabase.auth.updateUser({ password })
    if (err) {
      // An expired recovery session can't be saved again — send them back to
      // step 1. Anything else (too weak, same as old…) is fixable right here.
      if (err.status === 401 || err.code === 'session_not_found' || err.code === 'session_expired') {
        setPhase('invalid')
        return
      }
      setPhase('ready')
      setError(err.message || 'Couldn’t update your password. Please try again.')
      return
    }

    await supabase.auth.signOut({ scope: 'local' })
    setPassword('')
    setConfirm('')
    setPhase('done')
  }

  if (phase === 'unavailable') {
    return (
      <AuthCard title="Reset unavailable">
        <Notice>
          Password reset isn’t available right now. Please email{' '}
          <a href="mailto:techkage@proton.me" className="underline">techkage@proton.me</a> and we’ll help.
        </Notice>
      </AuthCard>
    )
  }

  if (phase === 'checking') {
    return (
      <AuthCard title="Checking your link…">
        <p role="status" className="text-stone-700">One moment.</p>
      </AuthCard>
    )
  }

  if (phase === 'invalid') {
    const expired = linkError()?.code === 'otp_expired'
    return (
      <AuthCard title={expired ? 'This link has expired' : 'This link doesn’t work'}>
        <p className="text-stone-700 leading-relaxed mb-6">
          Reset links work once and only for a limited time
          {expired ? '.' : ', and this one is invalid or has already been used.'} Request a
          new one and use the newest email.
        </p>
        <Link to="/reset-password" className="btn-primary inline-flex py-3 px-5 text-base">
          Send a new link
        </Link>
      </AuthCard>
    )
  }

  if (phase === 'done') {
    return (
      <AuthCard title="Password changed">
        <Notice tone="success">Your new password is saved.</Notice>
        <p className="text-stone-700 leading-relaxed mb-6">
          Open the Kawm Hmoob app and sign in with your email and new password.
        </p>
        <div className="flex flex-wrap gap-3">
          {/* Deep link via the app's URL scheme (app.json "scheme": "kawmhmoob").
              Only does something on a phone with the app installed. */}
          <a href="kawmhmoob://login" className="btn-primary inline-flex py-3 px-5 text-base">
            Open the app
          </a>
        </div>
        {MOBILE_APP.android && (
          <p className="mt-4 text-sm text-stone-600">
            Don’t have the app on this phone?{' '}
            <a href={MOBILE_APP.android} target="_blank" rel="noreferrer" className="text-clay-700 underline">
              Get it on Google Play
            </a>
            .
          </p>
        )}
      </AuthCard>
    )
  }

  // ready | saving
  const saving = phase === 'saving'
  return (
    <AuthCard
      title="Choose a new password"
      intro={email ? `For ${email}. Pick something you haven’t used before.` : 'Pick something you haven’t used before.'}
    >
      {error && <Notice>{error}</Notice>}
      <form onSubmit={save} noValidate>
        {/* Hidden username field helps password managers file the new password
            under the right account. */}
        <input type="email" name="username" autoComplete="username" value={email} hidden readOnly />
        <Field
          id="new-password"
          label="New password"
          type="password"
          autoComplete="new-password"
          autoFocus
          required
          minLength={MIN_LENGTH}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          hint={fieldError ? undefined : `At least ${MIN_LENGTH} characters.`}
          error={fieldError && password.length < MIN_LENGTH ? fieldError : undefined}
        />
        <Field
          id="confirm-password"
          label="Confirm new password"
          type="password"
          autoComplete="new-password"
          required
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          error={fieldError && password.length >= MIN_LENGTH ? fieldError : undefined}
        />
        <button type="submit" disabled={saving} className="btn-primary w-full py-3 text-base disabled:opacity-60">
          {saving ? 'Saving…' : 'Save new password'}
        </button>
      </form>
    </AuthCard>
  )
}

// Reads the error Supabase put in the fragment of a dead link, if any.
function linkError() {
  const params = new URLSearchParams(initialUrlHash.replace(/^#/, ''))
  const code = params.get('error_code') || params.get('error')
  return code ? { code, description: params.get('error_description') } : null
}
