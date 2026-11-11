import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthCard, Field, Notice } from '../components/site/AuthCard.jsx'
import { supabase, RESET_REDIRECT_PATH } from '../lib/supabase.js'

// STEP 1 of password reset: "email me a link".
//
// Supabase sends the email; its link opens STEP 2 (UpdatePassword.jsx) on this
// site, where the new password is set. The mobile app has no reset screen of
// its own, so this page is where app users reset. See notes/73.
//
// Privacy rule: the response is the SAME whether or not the email has an
// account ("If an account exists…"). Saying "no account found" would let anyone
// check which emails are signed up. Supabase itself also returns success for
// unknown emails, for the same reason.

const CONTACT = 'techkage@proton.me'
// Supabase allows one reset email per address per 60 seconds; mirror that so
// "Send again" doesn't just produce a rate-limit error.
const COOLDOWN_S = 60

export default function ResetPassword() {
  const [email, setEmail] = useState('')
  // Two flags, not one status: a resend happens while the "sent" view is up,
  // and a single status flipping to "sending" would bounce back to the form.
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState(null)
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    if (cooldown <= 0) return
    const t = setTimeout(() => setCooldown((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  async function send(e) {
    e?.preventDefault()
    setError(null)

    if (!supabase) {
      setError(`Password reset isn't available right now. Please email ${CONTACT} and we'll help.`)
      return
    }
    const address = email.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) {
      setError('Enter the email address you signed up with.')
      return
    }

    setSending(true)
    const { error: err } = await supabase.auth.resetPasswordForEmail(address, {
      redirectTo: `${window.location.origin}${RESET_REDIRECT_PATH}`,
    })

    setSending(false)
    if (err) {
      setError(describe(err))
      return
    }
    setSent(true)
    setCooldown(COOLDOWN_S)
  }

  if (sent) {
    return (
      <AuthCard title="Check your email">
        <Notice tone="success">
          If an account exists for <strong>{email.trim()}</strong>, we’ve sent it a link to
          reset your password.
        </Notice>
        {error && <Notice>{error}</Notice>}
        <ul className="list-disc pl-5 space-y-1.5 text-sm text-stone-700 mb-6">
          <li>The link works once and expires after a while — use it soon.</li>
          <li>You can open it on any device, not just this one.</li>
          <li>Nothing after a few minutes? Check your spam folder.</li>
        </ul>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => send()}
            disabled={cooldown > 0 || sending}
            className="btn-ghost disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {sending ? 'Sending…' : cooldown > 0 ? `Send again in ${cooldown}s` : 'Send again'}
          </button>
          <button
            type="button"
            onClick={() => { setSent(false); setError(null) }}
            className="btn-ghost"
          >
            Use a different email
          </button>
        </div>
      </AuthCard>
    )
  }

  return (
    <AuthCard
      title="Reset your password"
      intro="Enter the email you use for the Kawm Hmoob app. We’ll send you a link to choose a new password."
    >
      {error && <Notice>{error}</Notice>}
      <form onSubmit={send} noValidate>
        <Field
          id="reset-email"
          label="Email"
          type="email"
          autoComplete="email"
          inputMode="email"
          autoFocus
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
        <button type="submit" disabled={sending} className="btn-primary w-full py-3 text-base disabled:opacity-60">
          {sending ? 'Sending…' : 'Send reset link'}
        </button>
      </form>
      <p className="mt-6 text-sm text-stone-600">
        No longer have access to that email?{' '}
        <Link to="/contact" className="text-clay-700 underline">Contact us</Link>.
      </p>
    </AuthCard>
  )
}

// Supabase error → something a person can act on. Unknown errors fall through
// to Supabase's own message, which is usually readable.
function describe(err) {
  if (err.status === 429) return 'Too many requests. Please wait a minute, then try again.'
  if (err.status === 0 || err.name === 'AuthRetryableFetchError') {
    return 'Couldn’t reach the server. Check your connection and try again.'
  }
  if (err.status >= 500) {
    return `Something went wrong on our side. Try again in a few minutes, or email ${CONTACT}.`
  }
  return err.message || 'Something went wrong. Please try again.'
}
