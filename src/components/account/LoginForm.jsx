import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

export default function LoginForm() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (!username || !password) return
    login({ username })
    navigate('/account')
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="font-serif text-4xl text-stone-900 mb-6 text-center">Welcome back</h2>
      <form onSubmit={submit} className="surface p-8 space-y-4">
        <Input label="Username" value={username} onChange={setUsername} required />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          required
        />
        <button className="btn-primary w-full">Log In</button>
        <p className="text-sm text-stone-600 text-center">
          No account?{' '}
          <Link to="/register" className="text-clay-700 underline">
            Register
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
