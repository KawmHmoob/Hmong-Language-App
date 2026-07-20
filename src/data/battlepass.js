// Battle pass — 50 tiers for the current season.
//
// ⚠️ EVERY REWARD HERE IS A PLACEHOLDER. No partnership exists, and every
// business named below is INVENTED. That's deliberate: mocking this up with
// real business names would produce screenshots that read as genuine offers
// from companies who never agreed to anything. When real partners sign, swap
// the `brand` strings and set `placeholder: false` on that tier.
//
// Reward types:
//   streak-freeze  consumable — skips a day without breaking the streak
//   theme          cosmetic — unlocks an app theme
//   badge          cosmetic — profile flair
//   content        unlocks real app content (lesson packs, voice packs)
//   coupon         partner discount (the monetization hook)
//   boost          temporary points multiplier
//
// `premium: true` sits on the paid track. With PAYWALL_ENABLED off (testing),
// the page shows them unlocked-but-marked so the layout can be judged.
// See notes/57.

export const PASS = {
  seasonId: 'season-1',
  title: 'Season 1 Pass',
  freeTrackLabel: 'Free',
  premiumTrackLabel: 'Pro Pass',
  premiumPrice: '$9.99 / season',
}

// Invented storefronts. Hmong-American small-business flavored, none real.
export const PLACEHOLDER_BRANDS = [
  'Toj Siab Noodle Bar',
  'Paj Ntaub Threads',
  'Nkauj Hmoob Boba',
  'Zaub Ntsuab Grocery',
  'Sib Hlub Bakery',
  'Hmoob Village Market',
  'Txiv Neeb Coffee House',
]

const t = (level, type, name, detail, extra = {}) => ({
  level,
  type,
  name,
  detail,
  placeholder: true,
  premium: false,
  ...extra,
})

export const tiers = [
  t(1, 'badge', 'Seedling Badge', 'Profile flair — you started.'),
  t(2, 'streak-freeze', 'Streak Freeze ×1', 'Miss a day without losing your streak.'),
  t(3, 'boost', '2× Points — 1 hour', 'Double season points for one hour.'),
  t(4, 'badge', 'Tone Marker Badge', 'For clearing the tones lesson.'),
  t(5, 'coupon', '10% off drinks', 'At Toj Siab Noodle Bar.', { brand: 'Toj Siab Noodle Bar' }),
  t(6, 'streak-freeze', 'Streak Freeze ×1', 'Bank another rest day.'),
  t(7, 'content', 'Voice Pack: Elders', 'Alternate speaker recordings for the alphabet.'),
  t(8, 'badge', 'Consonant Cluster Badge', 'All four consonant lessons cleared.'),
  t(9, 'boost', '2× Points — 1 hour', 'Stack it with a study session.'),
  t(10, 'theme', 'Neon Theme', 'Unlocks the cyber-mystic skin.', { milestone: true }),
  t(11, 'streak-freeze', 'Streak Freeze ×2', 'Two banked rest days.'),
  t(12, 'coupon', 'Free boba topping', 'At Nkauj Hmoob Boba.', { brand: 'Nkauj Hmoob Boba' }),
  t(13, 'badge', 'Word Bank Badge', '100 words marked known.'),
  t(14, 'content', 'Reading: Market Day', 'A bonus intermediate passage.'),
  t(15, 'coupon', '15% off one item', 'At Paj Ntaub Threads.', { brand: 'Paj Ntaub Threads', milestone: true }),
  t(16, 'boost', '2× Points — 3 hours', 'A longer multiplier window.'),
  t(17, 'badge', 'Recordist Badge', 'For contributing 25 voice clips.'),
  t(18, 'streak-freeze', 'Streak Freeze ×2', 'Keep the chain alive.'),
  t(19, 'content', 'Voice Pack: Green Hmong', 'Hear the dialect contrast.', { premium: true }),
  t(20, 'theme', 'Paj Ntaub Theme', 'Textile-pattern accent skin.', { milestone: true }),
  t(21, 'coupon', 'Free pastry with coffee', 'At Sib Hlub Bakery.', { brand: 'Sib Hlub Bakery' }),
  t(22, 'boost', '2× Points — 3 hours', 'Bank it for the weekend.'),
  t(23, 'badge', 'Classifier Badge', 'All 20 classifiers known.'),
  t(24, 'streak-freeze', 'Streak Freeze ×3', 'A generous cushion.'),
  t(25, 'content', 'Lesson Pack: Kitchen Hmong', 'Six cooking-and-food lessons.', { premium: true, milestone: true }),
  t(26, 'coupon', '$5 off $25', 'At Zaub Ntsuab Grocery.', { brand: 'Zaub Ntsuab Grocery' }),
  t(27, 'badge', 'Tone Master Badge', 'Perfect score on every tone drill.'),
  t(28, 'boost', '3× Points — 1 hour', 'The big multiplier.'),
  t(29, 'content', 'Reading: New Year', 'Noj Peb Caug, annotated.'),
  t(30, 'theme', 'Midnight Indigo Theme', 'Deep indigo, batik-inspired.', { milestone: true }),
  t(31, 'streak-freeze', 'Streak Freeze ×3', 'Travel-proof your streak.'),
  t(32, 'coupon', 'Free size upgrade', 'At Txiv Neeb Coffee House.', { brand: 'Txiv Neeb Coffee House' }),
  t(33, 'badge', 'Storyteller Badge', 'Every reading completed.'),
  t(34, 'boost', '3× Points — 3 hours', 'Serious grind fuel.'),
  t(35, 'content', 'Voice Pack: Storytellers', 'Narrated long-form passages.', { premium: true, milestone: true }),
  t(36, 'coupon', '20% off one order', 'At Hmoob Village Market.', { brand: 'Hmoob Village Market' }),
  t(37, 'badge', 'Centurion Badge', '100-day streak.'),
  t(38, 'streak-freeze', 'Streak Freeze ×5', 'Basically a vacation.'),
  t(39, 'content', 'Lesson Pack: Ceremony', 'Ritual and kinship vocabulary.', { premium: true }),
  t(40, 'theme', 'Gold Leaf Theme', 'The prestige skin.', { premium: true, milestone: true }),
  t(41, 'boost', '3× Points — 6 hours', 'A full study day, doubled and then some.'),
  t(42, 'badge', 'Archivist Badge', '250 voice clips contributed.'),
  t(43, 'coupon', 'Free entrée with two', 'At Toj Siab Noodle Bar.', { brand: 'Toj Siab Noodle Bar' }),
  t(44, 'content', 'Reading: Letters Home', 'Advanced correspondence passage.', { premium: true }),
  t(45, 'badge', 'Season 1 Veteran', 'Level 45 in the first season.', { milestone: true }),
  t(46, 'boost', '3× Points — 12 hours', 'Nearly a whole day.'),
  t(47, 'coupon', '25% off one item', 'At Paj Ntaub Threads.', { brand: 'Paj Ntaub Threads', premium: true }),
  t(48, 'content', 'Voice Pack: Your Region', 'Community-recorded regional set.', { premium: true }),
  t(49, 'streak-freeze', 'Streak Freeze ×10', 'The safety net.'),
  t(50, 'badge', 'Founding Voice', 'Permanent profile crown + name in the corpus credits.', {
    premium: true,
    milestone: true,
  }),
]

export function tierAt(level) {
  return tiers.find((x) => x.level === level) || null
}

// The next reward worth walking toward — drives the "up next" card.
export function nextMilestone(level) {
  return tiers.find((x) => x.level > level && x.milestone) || null
}

export const TYPE_META = {
  'streak-freeze': { label: 'Streak Freeze', icon: '❄️' },
  theme: { label: 'Theme', icon: '🎨' },
  badge: { label: 'Badge', icon: '🏅' },
  content: { label: 'Content', icon: '📖' },
  coupon: { label: 'Coupon', icon: '🎟️' },
  boost: { label: 'Boost', icon: '⚡' },
}
