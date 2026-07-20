// Leaderboard roster.
//
// ⚠️ PLACEHOLDER DATA. These are invented display names with hand-set point
// totals — there is no leaderboard backend yet. The real version reads a
// `season_points` table from Supabase (see "Going live" in notes/57).
//
// Kept as data (not generated randomly) so the page renders IDENTICALLY on
// every load. A random roster makes layout bugs impossible to reproduce and
// makes the ranking look like it's lying every time you refresh.

export const rivals = [
  { id: 'r1', name: 'Maiv Lis', seasonPoints: 14820, weekPoints: 1240, clips: 412 },
  { id: 'r2', name: 'Txooj Vaj', seasonPoints: 13195, weekPoints: 1610, clips: 288 },
  { id: 'r3', name: 'Paj Yeeb', seasonPoints: 12440, weekPoints: 980, clips: 355 },
  { id: 'r4', name: 'Nkaj Xyooj', seasonPoints: 11870, weekPoints: 1425, clips: 190 },
  { id: 'r5', name: 'Zoua Her', seasonPoints: 10510, weekPoints: 760, clips: 244 },
  { id: 'r6', name: 'Kub Thoj', seasonPoints: 9265, weekPoints: 1180, clips: 133 },
  { id: 'r7', name: 'Mim Hawj', seasonPoints: 8430, weekPoints: 640, clips: 301 },
  { id: 'r8', name: 'Ntxhi Lauj', seasonPoints: 7615, weekPoints: 905, clips: 88 },
  { id: 'r9', name: 'Choua Yang', seasonPoints: 6980, weekPoints: 520, clips: 176 },
  { id: 'r10', name: 'Seng Moua', seasonPoints: 6120, weekPoints: 1310, clips: 97 },
  { id: 'r11', name: 'Kalia Vue', seasonPoints: 5480, weekPoints: 430, clips: 205 },
  { id: 'r12', name: 'Tou Lee', seasonPoints: 4735, weekPoints: 815, clips: 61 },
]

// Last week's champion — a settled result, so it's a fixed record rather than
// something derived from the live board.
export const lastWeekWinner = {
  name: 'Txooj Vaj',
  weekPoints: 2145,
  clips: 96,
  week: 'Jul 6 – Jul 12',
}

export const YOU_ID = 'you'

// Merge the real learner into the placeholder roster and rank. `key` picks the
// board: 'seasonPoints' for the season race, 'weekPoints' for this week's.
//
// Ties are broken by name so the order is STABLE — otherwise two equal scores
// can swap places between renders and the list looks broken.
export function buildBoard(you, key = 'seasonPoints') {
  const rows = [...rivals, { ...you, id: YOU_ID }]
  rows.sort((a, b) => (b[key] || 0) - (a[key] || 0) || a.name.localeCompare(b.name))
  return rows.map((r, i) => ({ ...r, rank: i + 1, isYou: r.id === YOU_ID }))
}
