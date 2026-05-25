import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Settings() {
  const { user, updateProfile } = useAuth()
  const [showTones, setShowTones] = useState(true)
  const [audioOn, setAudioOn] = useState(false)

  return (
    <>
      <h2 className="font-serif text-4xl text-stone-900 mb-8">Settings</h2>

      <div className="space-y-4 max-w-xl">
        <Field label="Dialect" hint="Choose which Hmong dialect to study.">
          <select
            value={user.dialectPreference}
            onChange={(e) => updateProfile({ dialectPreference: e.target.value })}
            className="w-full rounded border border-cream-300 bg-cream-50 px-3 py-2 text-sm focus:outline-none focus:border-clay-500"
          >
            <option value="white">White Hmong (Hmoob Dawb)</option>
            <option value="green">Green Hmong (Moob Leeg)</option>
          </select>
        </Field>

        <Toggle
          label="Show tone markers"
          hint="Display tone consonants in lessons."
          checked={showTones}
          onChange={setShowTones}
        />
        <Toggle
          label="Audio playback"
          hint="Play pronunciation audio when available."
          checked={audioOn}
          onChange={setAudioOn}
        />

        <div className="surface p-5">
          <div className="text-sm font-semibold text-stone-800 mb-3">Account</div>
          {user.isGuest ? (
            <div className="flex gap-2">
              <Link to="/login" className="btn-ghost">Log In</Link>
              <Link to="/register" className="btn-primary">Register</Link>
            </div>
          ) : (
            <Link to="/account" className="btn-secondary">
              Manage Account
            </Link>
          )}
        </div>
      </div>
    </>
  )
}

function Field({ label, hint, children }) {
  return (
    <div className="surface p-5">
      <label className="block text-sm font-semibold text-stone-800">{label}</label>
      {hint && <p className="text-xs text-stone-600 mb-2">{hint}</p>}
      {children}
    </div>
  )
}

function Toggle({ label, hint, checked, onChange }) {
  return (
    <div className="surface flex items-start justify-between p-5">
      <div>
        <div className="text-sm font-semibold text-stone-800">{label}</div>
        {hint && <div className="text-xs text-stone-600">{hint}</div>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition shrink-0 ${
          checked ? 'bg-clay-600' : 'bg-cream-300'
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-cream-50 shadow transition ${
            checked ? 'left-5' : 'left-0.5'
          }`}
        />
      </button>
    </div>
  )
}
