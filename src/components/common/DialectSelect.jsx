// The dialect picker — one component for all three places it appears
// (Register, Settings, Profile), so the availability warning can't drift out of
// sync between them.
//
// ⚠️ WHY THE WARNING: `dialectPreference` is stored and persisted, but nothing
// READS it yet — every lesson, recording, and prompt in the app is White Hmong
// (Hmoob Dawb). Offering a Green Hmong option with no Green Hmong content would
// silently give that learner the wrong dialect, so the picker says so plainly.
//
// Remove the warning when Green content actually exists; keep the field, since
// it's also corpus metadata (future-implementations/03 §6 — recordings must be
// labeled with the speaker's dialect, and mixing them silently is the specific
// failure mode called out there).

// ⚠️ These values MUST match the CHECK constraint on profiles.dialect_preference
// in instructions/supabase-schema.sql. Offering a value the database rejects
// makes the signup trigger's insert fail, which Supabase reports only as the
// generic "Database error saving new user" — the real cause hidden in the
// Postgres logs. Add a dialect in BOTH places, always.
export const DIALECTS = [
  { value: 'white', label: 'White Hmong (Hmoob Dawb)' },
  { value: 'green', label: 'Green Hmong (Moob Leeg)' },
  { value: 'dananshan', label: 'Dananshan Hmong (Chinese Hmong)' },
]

export default function DialectSelect({ value, onChange, id = 'dialect' }) {
  return (
    <div>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-describedby={`${id}-availability`}
        className="w-full rounded border border-cream-300 bg-cream-50 px-3 py-2 text-sm focus:outline-none focus:border-clay-500"
      >
        {DIALECTS.map((d) => (
          <option key={d.value} value={d.value}>
            {d.label}
            {d.value === 'white' ? '' : ' — not yet available'}
          </option>
        ))}
      </select>

      <p
        id={`${id}-availability`}
        className="mt-2 text-xs text-stone-700 bg-cream-100 border border-cream-300 rounded-md px-3 py-2 leading-relaxed"
      >
        <span className="font-semibold text-clay-700">Heads up:</span> only{' '}
        <strong>White Hmong (Hmoob Dawb)</strong> content exists right now — all
        lessons, audio, and vocabulary use it. Picking another dialect saves your
        preference for later but won’t change what you see yet.
      </p>
    </div>
  )
}
