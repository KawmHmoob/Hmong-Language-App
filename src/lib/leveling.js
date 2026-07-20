// Season points, levels, and the earning rules.
//
// THE ONE IDEA: points are awarded by NAMED SOURCE, never by a bare number.
// Every call site says what the learner did — `award('quiz-complete')` — and
// this file alone decides what that's worth and whether it's capped. Scattering
// magic numbers through the pages is how an economy becomes impossible to
// rebalance (and impossible to audit for abuse).
//
// Two currencies, deliberately:
//   xp            lifetime, never resets — the "how far have I come" number
//   seasonPoints  resets each season — the battle pass / leaderboard number
//
// See notes/57.

export const MAX_LEVEL = 50

// Level N→N+1 costs BASE + (N-1)*GROWTH. Linear growth (not exponential) so
// level 50 stays reachable in a season without turning the late game into a
// grind wall — the goal is steady teaching, not retention-by-attrition.
const BASE = 100
const GROWTH = 12

// Total points needed to REACH a level (level 1 = 0).
export function totalForLevel(level) {
  const L = Math.max(1, Math.min(level, MAX_LEVEL))
  let sum = 0
  for (let i = 1; i < L; i++) sum += BASE + (i - 1) * GROWTH
  return sum
}

// The headline number for the whole season.
export const POINTS_TO_MAX = totalForLevel(MAX_LEVEL)

// Points -> level, plus the progress INTO the current level. Returning the
// whole shape means no page has to re-derive the bar width and get it subtly
// different from the next page's.
export function levelFromPoints(points = 0) {
  const p = Math.max(0, points)
  let level = 1
  while (level < MAX_LEVEL && p >= totalForLevel(level + 1)) level++

  const floor = totalForLevel(level)
  const ceiling = level >= MAX_LEVEL ? floor : totalForLevel(level + 1)
  const span = ceiling - floor
  const into = p - floor

  return {
    level,
    into,
    needed: span,
    remaining: Math.max(0, span - into),
    // 1 at max level so the bar reads "done" rather than dividing by zero.
    progress: level >= MAX_LEVEL ? 1 : span > 0 ? into / span : 0,
    maxed: level >= MAX_LEVEL,
    points: p,
  }
}

// ── Earning ─────────────────────────────────────────────────────────────────
// `capped: true`  counts against DAILY_CAP — the study actions, which are a
//                 finite, repeatable, easily-farmed set.
// `capped: false` is UNLIMITED — voice contributions. Recording real speech has
//                 genuine marginal value to the corpus every single time, so
//                 there's no reason to tell someone to stop. It's also the
//                 behavior worth incentivising most.
export const POINT_SOURCES = {
  'lesson-step': { points: 2, capped: true, label: 'Lesson step' },
  'lesson-complete': { points: 10, capped: true, label: 'Lesson finished' },
  'quiz-complete': { points: 5, capped: true, label: 'Quiz finished' },
  'quiz-perfect': { points: 10, capped: true, label: 'Perfect quiz' },
  'word-known': { points: 1, capped: true, label: 'Word marked known' },
  'review-session': { points: 5, capped: true, label: 'Review session' },
  'speak-attempt': { points: 4, capped: false, label: 'Pronunciation attempt' },
  'speak-contribution': { points: 15, capped: false, label: 'Voice clip contributed' },
}

// How many CAPPED points one day can yield. Uncapped sources ignore this.
export const DAILY_CAP = 250

// Pure: how many points this award is actually worth, given what's already
// been earned from capped sources today. Pure so it's testable and so the UI
// can PREVIEW the cap ("you've hit today's study cap") without awarding.
export function pointsFor(sourceId, cappedEarnedToday = 0) {
  const src = POINT_SOURCES[sourceId]
  if (!src) return { points: 0, capped: false, clamped: false, unknown: true }

  if (!src.capped) return { points: src.points, capped: false, clamped: false }

  const room = Math.max(0, DAILY_CAP - cappedEarnedToday)
  const granted = Math.min(src.points, room)
  return {
    points: granted,
    capped: true,
    clamped: granted < src.points,
    room,
  }
}

// ── Seasons ─────────────────────────────────────────────────────────────────
// A season is a fixed window; season points reset when it rolls. Dates are
// plain ISO strings so this file stays data, not logic.
export const SEASON = {
  id: 'season-1',
  title: 'Season 1 — Lub Caij Ntuj Sawv',
  subtitle: 'The rising season',
  startsOn: '2026-07-06',
  endsOn: '2026-09-28',
}

export function seasonDaysLeft(today = new Date()) {
  const end = new Date(SEASON.endsOn + 'T23:59:59')
  return Math.max(0, Math.ceil((end - today) / 86400000))
}

// ISO week key, e.g. '2026-W29'. The leaderboard resets weekly on top of the
// season, so there's always a race close enough to matter to a new player.
export function weekKey(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  // ISO weeks run Mon–Sun and belong to the year containing their Thursday.
  const day = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - day)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const week = Math.ceil(((d - yearStart) / 86400000 + 1) / 7)
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, '0')}`
}
