// Deterministic "of the day" picker.
//
// Same item all day, a new one tomorrow, and NOTHING is stored — the date is
// the seed. That's the whole trick: no state, no cron, refresh-proof, and
// identical for every user (so "today's word" means the same thing to
// everyone, which matters once leaderboards exist).
//
// `salt` shifts the sequence so two surfaces don't land on the same item on
// the same day — Home's phrase and Speak's word should differ.

export function dayKey(date = new Date()) {
  return date.toISOString().slice(0, 10) // YYYY-MM-DD, UTC
}

// Sum of char codes — a weak hash, deliberately. We only need a stable spread
// over a small list, not cryptographic quality.
function seedFrom(str) {
  let n = 0
  for (const ch of str) n += ch.charCodeAt(0)
  return n
}

// Pick one item for today. Returns null for an empty list.
export function pickOfTheDay(list, salt = '') {
  if (!list || list.length === 0) return null
  return list[seedFrom(dayKey() + salt) % list.length]
}
