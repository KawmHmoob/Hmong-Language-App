import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

export default function RegisterForm() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [form, setForm] = useState({
    username: '',
    displayName: '',
    email: '',
    password: '',
    dialectPreference: 'white',
  })

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const submit = (e) => {
    e.preventDefault()
    register(form)
    navigate('/account')
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="font-serif text-4xl text-stone-900 mb-6 text-center">Create an account</h2>
      <form onSubmit={submit} className="surface p-8 space-y-4">
        <Input label="Username" value={form.username} onChange={(v) => update('username', v)} required />
        <Input
          label="Display Name"
          value={form.displayName}
          onChange={(v) => update('displayName', v)}
          required
        />
        <Input
          label="Email"
          type="email"
          value={form.email}
          onChange={(v) => update('email', v)}
          required
        />
        <Input
          label="Password"
          type="password"
          value={form.password}
          onChange={(v) => update('password', v)}
          required
        />
        <label className="block">
          <span className="block text-sm font-semibold text-stone-800 mb-1.5">Default Dialect</span>
          <select
            value={form.dialectPreference}
            onChange={(e) => update('dialectPreference', e.target.value)}
            className="w-full rounded border border-cream-300 bg-cream-50 px-3 py-2 text-sm focus:outline-none focus:border-clay-500"
          >
            <option value="white">White Hmong (Hmoob Dawb)</option>
            <option value="green">Green Hmong (Moob Leeg)</option>
          </select>
        </label>
        <button className="btn-primary w-full">Create Account</button>
        <p className="text-sm text-stone-600 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-clay-700 underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  )
}

function Input({ label, value, onChange, type = 'text', required }) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-stone-800 mb-1.5">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full rounded border border-cream-300 bg-cream-50 px-3 py-2 text-sm focus:outline-none focus:border-clay-500"
      />
    </label>
  )
}
