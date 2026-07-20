import {
  levelFromPoints, totalForLevel, MAX_LEVEL, POINTS_TO_MAX, pointsFor, DAILY_CAP,
} from '../../src/lib/leveling.js'

let bad = 0
const check = (cond, msg) => { if (!cond) { console.log('  FAIL ' + msg); bad++ } }

// Boundaries: exactly the threshold must BE the level, one below must not.
for (let L = 1; L <= MAX_LEVEL; L++) {
  const at = totalForLevel(L)
  check(levelFromPoints(at).level === L, `points ${at} should be level ${L}, got ${levelFromPoints(at).level}`)
  if (L > 1) check(levelFromPoints(at - 1).level === L - 1, `points ${at - 1} should be level ${L - 1}`)
}
check(levelFromPoints(0).level === 1, 'zero points = level 1')
check(levelFromPoints(-50).level === 1, 'negative clamps to level 1')
check(levelFromPoints(POINTS_TO_MAX).maxed, 'max points = maxed')
check(levelFromPoints(POINTS_TO_MAX * 10).level === MAX_LEVEL, 'overflow clamps to MAX_LEVEL')
check(levelFromPoints(POINTS_TO_MAX).progress === 1, 'maxed progress = 1')

// progress must stay in [0,1) below max and never NaN
for (let p = 0; p < POINTS_TO_MAX; p += 137) {
  const l = levelFromPoints(p)
  check(l.progress >= 0 && l.progress < 1 && !Number.isNaN(l.progress), `progress out of range at ${p}`)
  check(l.into + l.remaining === l.needed, `into+remaining != needed at ${p}`)
}

// Daily cap: capped sources clamp, uncapped never do.
check(pointsFor('quiz-complete', 0).points === 5, 'quiz pays 5 fresh')
check(pointsFor('quiz-complete', DAILY_CAP).points === 0, 'quiz pays 0 at cap')
check(pointsFor('quiz-complete', DAILY_CAP - 2).points === 2, 'partial award at cap edge')
check(pointsFor('quiz-complete', DAILY_CAP - 2).clamped === true, 'partial award flagged clamped')
check(pointsFor('speak-contribution', DAILY_CAP * 99).points === 15, 'uncapped ignores cap')
check(pointsFor('nope', 0).points === 0, 'unknown source pays 0')

console.log(`level 10 at ${totalForLevel(10)} pts | level 25 at ${totalForLevel(25)} | level 50 at ${POINTS_TO_MAX}`)
const perDay = DAILY_CAP
console.log(`capped-only pace: ${Math.ceil(POINTS_TO_MAX / perDay)} days to max at ${perDay}/day`)
console.log(bad ? `\n${bad} FAILURES` : '\nall leveling checks pass')
process.exit(bad ? 1 : 0)

