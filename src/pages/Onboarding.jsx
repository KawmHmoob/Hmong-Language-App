import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { DIALECTS } from '../components/common/DialectSelect.jsx'
import { CheckIcon } from '../components/icons/index.jsx'

// New-user onboarding. Collects OPTIONAL speaker metadata that (a) personalizes
// the experience and (b) becomes labels for the voice corpus
// (future-implementations/03 §9). See notes/69.
//
// THREE non-negotiables, baked in rather than left to remember:
//   1. Everything is optional. Every field has "Prefer not to say", and the
//      whole page can be skipped. Ethnicity especially — it's a SPECIAL
//      CATEGORY under GDPR Art. 9 and must never be required.
//   2. The purpose is DISCLOSED up top (personalization + open dataset). That
//      sentence is what makes collecting this lawful, not a liability.
//   3. Completing OR skipping stamps `onboarded_at`, so no one is sent back.

const AGE_RANGES = [
  'Under 18', '18–20', '21–25', '26–30', '31–40', '41–55', '56+',
]

const GENDERS = ['Woman', 'Man', 'Non-binary', 'Prefer to self-describe']

// Relationship to Hmong — the single most valuable corpus label: it separates
// native/heritage speakers from L2 learners, which is exactly the axis a
// pronunciation model needs and native-only corpora lack (notes/03 §3).
const HMONG_RELATIONSHIP = [
  { value: 'native', label: 'Hmong is my first language' },
  { value: 'heritage', label: 'I grew up hearing it at home' },
  { value: 'some-family', label: 'Some family connection to Hmong' },
  { value: 'learner', label: 'Learning it from scratch' },
]

const ETHNICITIES = [
  'Hmong', 'Other Asian', 'White', 'Black or African American',
  'Hispanic or Latino', 'Middle Eastern or North African', 'Multiracial', 'Other',
]

const PREFER_NOT = '__prefer_not__'

export default function Onboarding() {
  const navigate = useNavigate()
  const { user, updateProfile } = useAuth()
  const [form, setForm] = useState({
    ageRange: '',
    gender: '',
    dialectPreference: user.dialectPreference || 'white',
    hmongRelationship: '',
    ethnicity: '',
    region: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  // Blank stays null (never answered); the sentinel becomes the explicit
  // "prefer not to say" string, so we can tell "skipped" from "declined".
  const clean = (v) => (v === '' ? null : v === PREFER_NOT ? 'prefer_not_to_say' : v)

  const finish = async (fields) => {
    setSaving(true)
    setError(null)
    try {
      await updateProfile({ ...fields, onboardedAt: new Date().toISOString() })
      navigate('/')
    } catch (err) {
      setError(err?.message || 'Could not save — you can update this later in Settings.')
      setSaving(false)
    }
  }

  const submit = (e) => {
    e.preventDefault()
    finish({
      ageRange: clean(form.ageRange),
      gender: clean(form.gender),
      dialectPreference: form.dialectPreference, // always has a value
      hmongRelationship: clean(form.hmongRelationship),
      ethnicity: clean(form.ethnicity),
      region: form.region.trim() || null,
    })
  }

  // Skip = stamp onboarded_at, write nothing else.
  const skip = () => finish({})

  return (
    <div className="max-w-xl mx-auto py-8">
      <p className="text-sm uppercase tracking-[0.25em] text-clay-600 mb-2">
        Welcome{user.displayName ? `, ${user.displayName}` : ''}
      </p>
      <h2 className="font-display text-4xl sm:text-5xl text-stone-900 mb-3">
        Tell us about you
      </h2>

      {/* THE DISCLOSURE — honest about both purposes. Do not soften this into
          "just for personalization"; the corpus use has to be stated. */}
      <p className="text-stone-700 leading-relaxed mb-2">
        A few optional questions. Honest answers tailor your lessons — and, because
        Hmong is under-recorded, they also help label an{' '}
        <strong>open Hmong voice dataset</strong> built to improve pronunciation
        tools for everyone.
      </p>
      <p className="text-sm text-stone-600 mb-8">
        Every question is optional. Skip any of them, or the whole thing — you can
        fill it in later from Settings.
      </p>

      <form onSubmit={submit} className="space-y-8">
        <Choice
          label="Age range"
          options={AGE_RANGES}
          value={form.ageRange}
          onChange={(v) => set('ageRange', v)}
        />

        <Choice
          label="Gender"
          options={GENDERS}
          value={form.gender}
          onChange={(v) => set('gender', v)}
        />

        <div>
          <Label>Dialect you’re learning</Label>
          <div className="grid gap-2 sm:grid-cols-3">
            {DIALECTS.map((d) => (
              <Pill
                key={d.value}
                active={form.dialectPreference === d.value}
                onClick={() => set('dialectPreference', d.value)}
              >
                {d.label.split(' (')[0]}
              </Pill>
            ))}
          </div>
          <p className="text-xs text-stone-600 mt-2">
            Only White Hmong content exists today — the rest saves for later.
          </p>
        </div>

        <Choice
          label="Your relationship to Hmong"
          options={HMONG_RELATIONSHIP}
          value={form.hmongRelationship}
          onChange={(v) => set('hmongRelationship', v)}
        />

        <Choice
          label="Ethnicity"
          hint="Optional and never shared publicly. Helps make the dataset representative."
          options={ETHNICITIES}
          value={form.ethnicity}
          onChange={(v) => set('ethnicity', v)}
        />

        <div>
          <Label hint="e.g. a state, country, or region your family is from">
            Where are you / your family from?
          </Label>
          <input
            type="text"
            value={form.region}
            onChange={(e) => set('region', e.target.value)}
            placeholder="Optional"
            className="w-full rounded-lg border border-cream-300 bg-cream-50 px-3.5 py-2.5 text-base focus:outline-none focus:border-clay-500"
          />
        </div>

        {error && (
          <p className="text-sm rounded-lg bg-danger-50 text-danger-900 px-3 py-2.5">
            {error}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button type="submit" disabled={saving} className="btn-primary gap-2">
            <CheckIcon size={16} />
            {saving ? 'Saving…' : 'Save & continue'}
          </button>
          <button
            type="button"
            onClick={skip}
            disabled={saving}
            className="text-sm text-stone-600 hover:text-clay-700 underline"
          >
            Skip for now
          </button>
        </div>
      </form>
    </div>
  )
}

function Label({ children, hint }) {
  return (
    <div className="mb-2">
      <span className="block text-sm font-semibold text-stone-800">{children}</span>
      {hint && <span className="block text-xs text-stone-600 mt-0.5">{hint}</span>}
    </div>
  )
}

// A set of selectable pills + an always-present "Prefer not to say". Options
// can be plain strings or { value, label } objects.
function Choice({ label, hint, options, value, onChange }) {
  const opts = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o))
  return (
    <div>
      <Label hint={hint}>{label}</Label>
      <div className="flex flex-wrap gap-2">
        {opts.map((o) => (
          <Pill key={o.value} active={value === o.value} onClick={() => onChange(o.value)}>
            {o.label}
          </Pill>
        ))}
        <Pill
          active={value === PREFER_NOT}
          onClick={() => onChange(value === PREFER_NOT ? '' : PREFER_NOT)}
          muted
        >
          Prefer not to say
        </Pill>
      </div>
    </div>
  )
}

function Pill({ active, onClick, children, muted }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
        active
          ? 'bg-clay-600 text-cream-50'
          : muted
          ? 'bg-cream-100 text-stone-600 hover:bg-cream-200'
          : 'bg-cream-200 text-stone-800 hover:bg-cream-300'
      }`}
    >
      {children}
    </button>
  )
}
