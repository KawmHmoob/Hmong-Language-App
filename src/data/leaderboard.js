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
  { id: 'r1', name: 'Devv', seasonPoints: 14780, weekPoints: 1240, clips: 238, level: 50 },
  { id: 'r2', name: 'Mai Vang', seasonPoints: 13950, weekPoints: 1580, clips: 221, level: 49 },
  { id: 'r3', name: 'Cassie Lee', seasonPoints: 12840, weekPoints: 980, clips: 204, level: 48 },
  { id: 'r4', name: 'Kou Xiong', seasonPoints: 11920, weekPoints: 1370, clips: 189, level: 47 },
  { id: 'r5', name: 'Pao Khang', seasonPoints: 10750, weekPoints: 760, clips: 231, level: 46 },
  { id: 'r6', name: 'HmoobPride', seasonPoints: 9840, weekPoints: 1150, clips: 176, level: 45 },
  { id: 'r7', name: 'Kevin M', seasonPoints: 8730, weekPoints: 640, clips: 198, level: 44 },
  { id: 'r8', name: 'Chong Moua', seasonPoints: 7920, weekPoints: 890, clips: 134, level: 43 },
  { id: 'r9', name: 'Nou Vang', seasonPoints: 7310, weekPoints: 520, clips: 167, level: 42 },
  { id: 'r10', name: 'Seng Vang', seasonPoints: 6850, weekPoints: 1240, clips: 112, level: 41 },
  { id: 'r11', name: 'Kallie Vue', seasonPoints: 6420, weekPoints: 430, clips: 145, level: 40 },
  { id: 'r12', name: 'Marcus T', seasonPoints: 5980, weekPoints: 815, clips: 98, level: 39 },
  { id: 'r13', name: 'Jaysen Xiong', seasonPoints: 5640, weekPoints: 670, clips: 132, level: 38 },
  { id: 'r14', name: 'Spencer B', seasonPoints: 5390, weekPoints: 950, clips: 167, level: 37 },
  { id: 'r15', name: 'StudyStreak', seasonPoints: 5120, weekPoints: 580, clips: 89, level: 36 },
  { id: 'r16', name: 'Evan Lor', seasonPoints: 4870, weekPoints: 1080, clips: 124, level: 35 },
  { id: 'r17', name: 'Pa Houa Xiong', seasonPoints: 4650, weekPoints: 490, clips: 156, level: 34 },
  { id: 'r18', name: 'Taylor C', seasonPoints: 4410, weekPoints: 830, clips: 98, level: 33 },
  { id: 'r19', name: 'KuvHlubKoj', seasonPoints: 4180, weekPoints: 720, clips: 141, level: 32 },
  { id: 'r20', name: 'MightyMai', seasonPoints: 3940, weekPoints: 650, clips: 76, level: 31 },
  { id: 'r21', name: 'Fong Vang', seasonPoints: 3710, weekPoints: 960, clips: 108, level: 30 },
  { id: 'r22', name: 'Bao Yang', seasonPoints: 3490, weekPoints: 410, clips: 183, level: 29 },
  { id: 'r23', name: 'Sophia R', seasonPoints: 3280, weekPoints: 775, clips: 68, level: 28 },
  { id: 'r24', name: 'Parker Jensen', seasonPoints: 3070, weekPoints: 540, clips: 91, level: 27 },
  { id: 'r25', name: 'Nhia Vue', seasonPoints: 2890, weekPoints: 890, clips: 124, level: 26 },
  { id: 'r26', name: 'Leo 2025', seasonPoints: 2740, weekPoints: 620, clips: 82, level: 25 },
  { id: 'r27', name: 'Yia Her', seasonPoints: 2610, weekPoints: 710, clips: 138, level: 24 },
  { id: 'r28', name: 'hmoob', seasonPoints: 2490, weekPoints: 480, clips: 95, level: 23 },
  { id: 'r29', name: 'BaoBaoVang', seasonPoints: 2370, weekPoints: 850, clips: 73, level: 22 },
  { id: 'r30', name: 'Olivia N', seasonPoints: 2260, weekPoints: 590, clips: 149, level: 21 },
  { id: 'r31', name: 'Ge Yang', seasonPoints: 2150, weekPoints: 930, clips: 109, level: 20 },
  { id: 'r32', name: 'Hunter W', seasonPoints: 2040, weekPoints: 440, clips: 67, level: 19 },
  { id: 'r33', name: 'Ntxawg Moua', seasonPoints: 1930, weekPoints: 680, clips: 121, level: 18 },
  { id: 'r34', name: 'Rachel T', seasonPoints: 1830, weekPoints: 510, clips: 84, level: 17 },
  { id: 'r35', name: 'Kue Lee', seasonPoints: 1740, weekPoints: 760, clips: 102, level: 16 },
  { id: 'r36', name: 'Mason A', seasonPoints: 1650, weekPoints: 390, clips: 77, level: 15 },
  { id: 'r37', name: 'Pha Xyooj', seasonPoints: 1570, weekPoints: 820, clips: 115, level: 14 },
  { id: 'r38', name: 'Brooke L', seasonPoints: 1490, weekPoints: 470, clips: 63, level: 13 },
  { id: 'r39', name: 'Thao Vang', seasonPoints: 1420, weekPoints: 650, clips: 98, level: 12 },
  { id: 'r40', name: 'Ib Siab', seasonPoints: 1350, weekPoints: 720, clips: 81, level: 11 },
  { id: 'r41', name: 'Maysee Her', seasonPoints: 1290, weekPoints: 530, clips: 107, level: 10 },
  { id: 'r42', name: 'Connor McKay', seasonPoints: 1230, weekPoints: 880, clips: 74, level: 9 },
  { id: 'r43', name: 'Nou', seasonPoints: 1170, weekPoints: 410, clips: 89, level: 8 },
  { id: 'r44', name: 'Avery Johnson', seasonPoints: 1120, weekPoints: 590, clips: 66, level: 7 },
  { id: 'r45', name: 'Kajsiab Y', seasonPoints: 1070, weekPoints: 740, clips: 93, level: 6 },
  { id: 'r46', name: 'Tou B', seasonPoints: 1020, weekPoints: 380, clips: 58, level: 5 },
  { id: 'r47', name: 'PajNtaubMoua', seasonPoints: 980, weekPoints: 670, clips: 102, level: 5 },
  { id: 'r48', name: 'Sydney P', seasonPoints: 940, weekPoints: 460, clips: 71, level: 4 },
  { id: 'r49', name: 'Chue Lee', seasonPoints: 890, weekPoints: 810, clips: 85, level: 4 },
  { id: 'r50', name: 'Dylan Jensen', seasonPoints: 850, weekPoints: 550, clips: 64, level: 4 },
  { id: 'r51', name: 'XiongLearns', seasonPoints: 810, weekPoints: 630, clips: 79, level: 3 },
  { id: 'r52', name: 'Mckenna H', seasonPoints: 780, weekPoints: 490, clips: 52, level: 3 },
  { id: 'r53', name: 'VangLegend', seasonPoints: 750, weekPoints: 720, clips: 88, level: 3 },
  { id: 'r54', name: 'Kenna R', seasonPoints: 720, weekPoints: 410, clips: 61, level: 3 },
  { id: 'r55', name: 'KubKub', seasonPoints: 690, weekPoints: 680, clips: 94, level: 2 },
  { id: 'r56', name: 'Emma L', seasonPoints: 660, weekPoints: 370, clips: 48, level: 2 },
  { id: 'r57', name: 'HmoobKing', seasonPoints: 630, weekPoints: 590, clips: 77, level: 2 },
  { id: 'r58', name: 'David S', seasonPoints: 600, weekPoints: 450, clips: 55, level: 2 },
  { id: 'r59', name: 'MouaLegacy', seasonPoints: 570, weekPoints: 810, clips: 82, level: 2 },
  { id: 'r60', name: 'Sophie & Michael', seasonPoints: 540, weekPoints: 520, clips: 69, level: 2 },
  { id: 'r61', name: 'YeejYeej', seasonPoints: 510, weekPoints: 430, clips: 73, level: 1 },
  { id: 'r62', name: 'Ryan D', seasonPoints: 490, weekPoints: 390, clips: 44, level: 1 },
  { id: 'r63', name: 'LeeClanHM', seasonPoints: 470, weekPoints: 670, clips: 81, level: 1 },
  { id: 'r64', name: 'Hailee T', seasonPoints: 450, weekPoints: 480, clips: 52, level: 1 },
  { id: 'r65', name: 'VueMaster', seasonPoints: 430, weekPoints: 550, clips: 67, level: 1 },
  { id: 'r66', name: 'Jack Khang', seasonPoints: 410, weekPoints: 360, clips: 39, level: 1 },
  { id: 'r67', name: 'Pao Vang', seasonPoints: 390, weekPoints: 620, clips: 71, level: 1 },
  { id: 'r68', name: 'Olivia C', seasonPoints: 370, weekPoints: 410, clips: 48, level: 1 },
  { id: 'r69', name: 'TryHard', seasonPoints: 350, weekPoints: 580, clips: 64, level: 1 },
  { id: 'r70', name: 'Grace N', seasonPoints: 330, weekPoints: 330, clips: 42, level: 1 },
  { id: 'r71', name: 'YangStudy', seasonPoints: 310, weekPoints: 490, clips: 59, level: 1 },
  { id: 'r72', name: 'Mia T', seasonPoints: 290, weekPoints: 280, clips: 37, level: 1 },
  { id: 'r73', name: 'MeeMeeXiong', seasonPoints: 270, weekPoints: 650, clips: 68, level: 1 },
  { id: 'r74', name: 'Noj Mov', seasonPoints: 250, weekPoints: 310, clips: 41, level: 1 },
  { id: 'r75', name: 'Ntxhoo', seasonPoints: 230, weekPoints: 540, clips: 52, level: 1 },
  { id: 'r76', name: 'Brooklyn K', seasonPoints: 210, weekPoints: 250, clips: 33, level: 1 },
  { id: 'r77', name: 'KaoKaoHM', seasonPoints: 190, weekPoints: 470, clips: 46, level: 1 },
  { id: 'r78', name: 'Dan J', seasonPoints: 170, weekPoints: 220, clips: 29, level: 1 },
  { id: 'r79', name: 'SengS', seasonPoints: 150, weekPoints: 390, clips: 38, level: 1 },
  { id: 'r80', name: 'Ava C', seasonPoints: 130, weekPoints: 180, clips: 24, level: 1 },
  { id: 'r81', name: 'Tou Vang', seasonPoints: 110, weekPoints: 310, clips: 31, level: 1 },
  { id: 'r82', name: 'Zach H', seasonPoints: 95, weekPoints: 140, clips: 19, level: 1 },
  { id: 'r83', name: 'Fongster', seasonPoints: 80, weekPoints: 260, clips: 27, level: 1 },
  { id: 'r84', name: 'Lilly V 💕', seasonPoints: 65, weekPoints: 95, clips: 12, level: 1 },
  { id: 'r85', name: 'Paj Zoo Nkauj', seasonPoints: 50, weekPoints: 180, clips: 22, level: 1 },
  { id: 'r86', name: 'Hailey P', seasonPoints: 40, weekPoints: 75, clips: 8, level: 1 },
  { id: 'r87', name: 'Nyiaj', seasonPoints: 30, weekPoints: 140, clips: 15, level: 1 },
  { id: 'r88', name: 'Brock A', seasonPoints: 25, weekPoints: 60, clips: 7, level: 1 },
  { id: 'r89', name: 'KubKub2', seasonPoints: 20, weekPoints: 110, clips: 11, level: 1 },
  { id: 'r90', name: 'Emily R', seasonPoints: 15, weekPoints: 45, clips: 5, level: 1 },
  { id: 'r91', name: 'GucciPo', seasonPoints: 12, weekPoints: 95, clips: 9, level: 1 },
  { id: 'r92', name: 'Muaj Xyooj', seasonPoints: 10, weekPoints: 30, clips: 3, level: 1 },
  { id: 'r93', name: 'Avery Thao', seasonPoints: 8, weekPoints: 70, clips: 6, level: 1 },
  { id: 'r94', name: 'Trevon D', seasonPoints: 6, weekPoints: 25, clips: 2, level: 1 },
  { id: 'r95', name: 'HerHero', seasonPoints: 5, weekPoints: 55, clips: 4, level: 1 },
  { id: 'r96', name: 'Juan Garcia', seasonPoints: 4, weekPoints: 20, clips: 1, level: 1 },
  { id: 'r97', name: 'XiongX', seasonPoints: 3, weekPoints: 40, clips: 3, level: 1 },
  { id: 'r98', name: 'Joshua Vang', seasonPoints: 2, weekPoints: 15, clips: 1, level: 1 },
  { id: 'r99', name: 'MouaQueen', seasonPoints: 1, weekPoints: 10, clips: 1, level: 1 },
  { id: 'r100', name: 'NewbieHM', seasonPoints: 1, weekPoints: 5, clips: 1, level: 1 },
];


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
