// Sample words for the tone drill quiz. Each entry: a White Hmong word + its tone name.
// The tone is encoded by the final consonant: b j v (none) s g m d.
// NOTE: These are starter examples. Verify with a native speaker and expand
// for better variety — the engine just reads from this list.

export const toneDrillWords = [
  // High (b)
  { word: 'pob', tone: 'High' },
  { word: 'kab', tone: 'High' },
  { word: 'lub', tone: 'High' },
  { word: 'tub', tone: 'High' },
  { word: 'ntab', tone: 'High' },

  // High-falling (j)
  { word: 'poj', tone: 'High-falling' },
  { word: 'koj', tone: 'High-falling' },
  { word: 'niaj', tone: 'High-falling' },
  { word: 'txuj', tone: 'High-falling' },

  // Mid-rising (v)
  { word: 'pov', tone: 'Mid-rising' },
  { word: 'kuv', tone: 'Mid-rising' },
  { word: 'txiv', tone: 'Mid-rising' },
  { word: 'nrov', tone: 'Mid-rising' },

  // Mid (no marker)
  { word: 'po', tone: 'Mid' },
  { word: 'hu', tone: 'Mid' },
  { word: 'li', tone: 'Mid' },
  { word: 'ua', tone: 'Mid' },

  // Low (s)
  { word: 'pos', tone: 'Low' },
  { word: 'mos', tone: 'Low' },
  { word: 'tsis', tone: 'Low' },
  { word: 'nias', tone: 'Low' },

  // Mid-low breathy (g)
  { word: 'pog', tone: 'Mid-low breathy' },
  { word: 'mog', tone: 'Mid-low breathy' },
  { word: 'leeg', tone: 'Mid-low breathy' },
  { word: 'sawg', tone: 'Mid-low breathy' },

  // Low-falling glottalized (m)
  { word: 'pom', tone: 'Low-falling glottalized' },
  { word: 'mam', tone: 'Low-falling glottalized' },
  { word: 'twm', tone: 'Low-falling glottalized' },
  { word: 'hom', tone: 'Low-falling glottalized' },

  // Low-rising (d) — rare in modern Hmong
  { word: 'pod', tone: 'Low-rising' },
]
