import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import DialectSelect from '../components/common/DialectSelect.jsx'
import { CheckIcon } from '../components/icons/index.jsx'

// Supabase's own default. Enforced here too so a too-short password fails
// instantly instead of after a round trip — and so the rule is VISIBLE before
// you type, not revealed as an error afterward.
const MIN_PASSWORD = 6

export default function RegisterForm() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [form, setForm] = useState({
    username: '',
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dialectPreference: 'white',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [pendingEmail, setPendingEmail] = useState(null)

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  // Live validation. Both only fire once the field has content, so the form
  // isn't scolding you about a password you haven't started typing.
  const tooShort = form.password.length > 0 && form.password.length < MIN_PASSWORD
  const mismatch =
    form.confirmPassword.length > 0 && form.password !== form.confirmPassword
  const passwordsOk =
    form.password.length >= MIN_PASSWORD && form.password === form.confirmPassword

  const submit = async (e) => {
    e.preventDefault()
    if (submitting) return

    // Guard BEFORE the network call. A mismatch that reaches Supabase creates a
    // real account with the wrong password — and since the email is then taken,
    // the user can't simply retry. Cheap check, expensive failure.
    if (form.password.length < MIN_PASSWORD) {
      setError(`Password must be at least ${MIN_PASSWORD} characters.`)
      return
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords don’t match.')
      return
    }

    setSubmitting(true)
    setError(null)
    try {
      // confirmPassword is UI-only — never send it.
      const { confirmPassword, ...payload } = form
      const result = await register(payload)
      if (result?.pendingConfirmation) setPendingEmail(result.email)
      else navigate('/account')
    } catch (err) {
      setError(err?.message || 'Registration failed.')
    } finally {
      setSubmitting(false)
    }
  }

  if (pendingEmail) {
    return (
      <div className="max-w-lg mx-auto surface p-8 sm:p-10 text-center">
        <h2 className="font-display text-3xl text-stone-900 mb-3">Check your email</h2>
        <p className="text-stone-700 leading-relaxed">
          We sent a confirmation link to <strong>{pendingEmail}</strong>. Click it,
          then come back and log in.
        </p>
        <Link to="/login" className="btn-primary mt-6 inline-block">
          Go to login
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-6">
        <h2 className="font-display text-4xl sm:text-5xl text-stone-900 mb-2">
          Create an account
        </h2>
        <p className="text-stone-700">
          Free — it saves your progress and unlocks the full course.
        </p>
      </div>

      <form onSubmit={submit} className="surface p-6 sm:p-8 space-y-5">
        <Input
          label="Username"
          value={form.username}
          onChange={(v) => update('username', v)}
          hint="Shown on the leaderboard. Must be unique."
          autoComplete="username"
          required
        />
        <Input
          label="Display Name"
          value={form.displayName}
          onChange={(v) => update('displayName', v)}
          autoComplete="name"
          required
        />
        <Input
          label="Email"
          type="email"
          value={form.email}
          onChange={(v) => update('email', v)}
          autoComplete="email"
          required
        />

        {/* One toggle drives BOTH password fields. Revealing only one would
            defeat the point — you check them against each other. */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-stone-800">Password</span>
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="text-xs font-medium text-clay-700 hover:text-clay-800 underline"
            aria-pressed={showPassword}
          >
            {showPassword ? 'Hide passwords' : 'Show passwords'}
          </button>
        </div>

        <Input
          label=""
          type={showPassword ? 'text' : 'password'}
          value={form.password}
          onChange={(v) => update('password', v)}
          hint={`At least ${MIN_PASSWORD} characters.`}
          invalid={tooShort}
          autoComplete="new-password"
          required
        />
        {tooShort && (
          <p className="text-sm text-danger-900">
            Too short — {MIN_PASSWORD - form.password.length} more character
            {MIN_PASSWORD - form.password.length === 1 ? '' : 's'} needed.
          </p>
        )}

        <Input
          label="Confirm password"
          type={showPassword ? 'text' : 'password'}
          value={form.confirmPassword}
          onChange={(v) => update('confirmPassword', v)}
          invalid={mismatch}
          autoComplete="new-password"
          required
        />
        {mismatch && <p className="text-sm text-danger-900">Passwords don’t match.</p>}
        {passwordsOk && (
          <p className="inline-flex items-center gap-1.5 text-sm text-success-900">
            <CheckIcon size={14} /> Passwords match.
          </p>
        )}

        <div>
          <label
            htmlFor="register-dialect"
            className="block text-sm font-semibold text-stone-800 mb-1.5"
          >
            Default Dialect
          </label>
          <DialectSelect
            id="register-dialect"
            value={form.dialectPreference}
            onChange={(v) => update('dialectPreference', v)}
          />
        </div>

        {error && (
          <p className="text-sm rounded-lg bg-danger-50 text-danger-900 px-3 py-2.5">
            {error}
          </p>
        )}

        <button
          className="btn-primary w-full text-base py-3"
          disabled={submitting || tooShort || mismatch}
        >
          {submitting ? 'Creating account…' : 'Create Account'}
        </button>

        <p className="text-sm text-stone-600 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-clay-700 underline hover:text-clay-800">
            Log in
          </Link>
        </p>
      </form>
    </div>
  )
}

function Input({
  label,
  value,
  onChange,
  type = 'text',
  required,
  hint,
  invalid,
  autoComplete,
}) {
  return (
    <label className="block">
      {label && (
        <span className="block text-sm font-semibold text-stone-800 mb-1.5">{label}</span>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={invalid || undefined}
        className={`w-full rounded-lg border bg-cream-50 px-3.5 py-2.5 text-base focus:outline-none transition ${
          invalid
            ? 'border-danger-500 focus:border-danger-500'
            : 'border-cream-300 focus:border-clay-500'
        }`}
      />
      {hint && <span className="block text-xs text-stone-600 mt-1">{hint}</span>}
    </label>
  )
}
