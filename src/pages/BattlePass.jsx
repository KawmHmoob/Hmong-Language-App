import { useMemo, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useProgress } from '../hooks/useProgress.js'
import { useAuth } from '../context/AuthContext.jsx'
import Breadcrumbs from '../components/common/Breadcrumbs.jsx'
import { PASS, tiers, nextMilestone, TYPE_META } from '../data/battlepass.js'
import {
  levelFromPoints,
  MAX_LEVEL,
  POINTS_TO_MAX,
  POINT_SOURCES,
  DAILY_CAP,
  SEASON,
  seasonDaysLeft,
} from '../lib/leveling.js'

// Season pass — 50 tiers on a HORIZONTAL track, the way a battle pass reads:
// a road you move along, with the far end visible. A vertical list of 50 rows
// makes the same data feel like a spreadsheet.
//
// Everything in it is a PLACEHOLDER reward; nothing grants anything yet.
// See notes/57.

export default function BattlePass() {
  const { seasonPoints } = useProgress()
  const { user } = useAuth()
  const lv = useMemo(() => levelFromPoints(seasonPoints || 0), [seasonPoints])
  const upNext = nextMilestone(lv.level)
  const daysLeft = seasonDaysLeft()

  const trackRef = useRef(null)
  const currentRef = useRef(null)

  // Land on the learner's own tier. `inline: 'center'` scrolls the TRACK
  // horizontally; `block: 'nearest'` stops it from also yanking the page
  // vertically, which is what a naive scrollIntoView does here.
  useEffect(() => {
    currentRef.current?.scrollIntoView({ inline: 'center', block: 'nearest' })
  }, [])

  return (
    <>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Season Pass' }]} />

      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.2em] font-semibold text-clay-700 mb-2">
          {SEASON.title}
        </p>
        <h2 className="font-display text-5xl sm:text-6xl text-stone-900 mb-3">{PASS.title}</h2>
        <p className="text-lg text-stone-700">
          {daysLeft} days left · {MAX_LEVEL} tiers ·{' '}
          {POINTS_TO_MAX.toLocaleString()} points to max
        </p>
      </div>

      {user.isGuest && <GuestNotice seasonPoints={seasonPoints || 0} />}

      {/* Current standing */}
      <div className="surface p-6 sm:p-8 mb-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
          <div>
            <p className="text-sm uppercase tracking-wider font-semibold text-stone-600 mb-1">
              Your level
            </p>
            <p className="font-display text-6xl sm:text-7xl text-stone-900 leading-none">
              {lv.level}
            </p>
          </div>
          <div className="text-right">
            <p className="font-display text-3xl text-stone-900">
              {(seasonPoints || 0).toLocaleString()}
              <span className="text-lg text-stone-600 font-sans font-normal"> pts</span>
            </p>
            <p className="text-sm text-stone-600 mt-1">
              {lv.maxed
                ? 'Max level reached'
                : `${lv.remaining.toLocaleString()} to level ${lv.level + 1}`}
            </p>
          </div>
        </div>
        <div
          className="h-3.5 rounded-full bg-cream-200 overflow-hidden"
          role="progressbar"
          aria-valuenow={Math.round(lv.progress * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Level ${lv.level} progress`}
        >
          <div
            className="h-full rounded-full bg-clay-600 transition-[width] duration-500"
            style={{ width: `${Math.round(lv.progress * 100)}%` }}
          />
        </div>
        {upNext && (
          <p className="text-base text-stone-700 mt-4">
            Up next: <span className="font-semibold">{upNext.name}</span> at level{' '}
            {upNext.level}
          </p>
        )}
      </div>

      {/* ── The track ─────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-end justify-between gap-2 mb-4">
        <h3 className="font-display text-3xl text-stone-900">Rewards</h3>
        <p className="text-sm text-stone-600">
          {PASS.premiumTrackLabel} · {PASS.premiumPrice}
        </p>
      </div>

      {/* Full-bleed on small screens so the track can run edge to edge — a
          battle pass that stops at the content gutter looks truncated. */}
      <div className="-mx-5 sm:-mx-8 lg:mx-0">
        <ol
          ref={trackRef}
          className="flex gap-4 overflow-x-auto px-5 sm:px-8 lg:px-1 py-4 snap-x snap-mandatory"
          aria-label={`${MAX_LEVEL} reward tiers`}
        >
          {tiers.map((tier) => (
            <TierCard
              key={tier.level}
              tier={tier}
              unlocked={lv.level >= tier.level}
              isCurrent={lv.level === tier.level}
              cardRef={lv.level === tier.level ? currentRef : null}
            />
          ))}
        </ol>
      </div>
      <p className="text-sm text-stone-600 mt-1 mb-10">
        Scroll sideways to see all {MAX_LEVEL} tiers
      </p>

      {/* How points are earned */}
      <div className="surface p-6 sm:p-8 mb-8">
        <h3 className="font-display text-2xl text-stone-900 mb-2">How you earn</h3>
        <p className="text-base text-stone-700 mb-5">
          Study actions share a <strong>{DAILY_CAP}-point daily cap</strong>. Voice
          recordings have <strong>no cap</strong> — every clip helps build the Hmong
          speech corpus, so there’s no point telling you to stop.
        </p>
        <ul className="grid gap-3 sm:grid-cols-2">
          {Object.entries(POINT_SOURCES).map(([id, s]) => (
            <li
              key={id}
              className="flex items-center justify-between gap-3 rounded-xl bg-cream-100 px-4 py-3"
            >
              <span className="text-base text-stone-800">{s.label}</span>
              <span className="shrink-0 flex items-center gap-2">
                {!s.capped && (
                  <span className="text-[11px] uppercase tracking-wider font-semibold rounded-full bg-success-50 text-success-900 px-2.5 py-1">
                    No cap
                  </span>
                )}
                <span className="text-base font-semibold text-stone-900">+{s.points}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="surface p-6 sm:p-8">
        <p className="text-base text-stone-700">
          <strong>Everything above is a placeholder.</strong> No partnership exists and
          every business named is invented — they’re here to show what the reward track
          could hold, not to advertise anything. Nothing is granted yet either; levels
          are real, rewards are mockups.
        </p>
        <Link to="/leaderboard" className="btn-secondary mt-5 inline-flex">
          See the leaderboard
        </Link>
      </div>
    </>
  )
}

// One tier on the track. Takes the ref as a plain `cardRef` prop rather than
// forwardRef — it's an internal component with one caller, so the indirection
// would buy nothing.
function TierCard({ tier, unlocked, isCurrent, cardRef }) {
  const meta = TYPE_META[tier.type] || { label: tier.type, icon: '•' }
  return (
    <li
      ref={cardRef}
      className={`snap-center shrink-0 w-44 sm:w-52 rounded-2xl border p-5 flex flex-col ${
        unlocked
          ? 'border-success-500 bg-success-50'
          : 'border-cream-300 bg-cream-50 opacity-90'
      } ${isCurrent ? 'ring-2 ring-clay-600 ring-offset-2 ring-offset-seafoam-100' : ''}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span
          className={`w-12 h-12 rounded-full flex items-center justify-center font-display text-xl ${
            unlocked ? 'bg-success-500 text-cream-50' : 'bg-cream-200 text-stone-700'
          }`}
        >
          {tier.level}
        </span>
        {tier.premium && (
          <span className="text-[10px] uppercase tracking-wider font-bold rounded-full bg-clay-600 text-cream-50 px-2 py-1">
            Pro
          </span>
        )}
      </div>

      <span className="text-3xl mb-2" aria-hidden="true">
        {meta.icon}
      </span>

      <p
        className={`font-semibold leading-snug mb-1 ${
          unlocked ? 'text-success-900' : 'text-stone-900'
        }`}
      >
        {tier.name}
      </p>
      <p
        className={`text-sm leading-snug flex-1 ${
          unlocked ? 'text-success-900/80' : 'text-stone-700'
        }`}
      >
        {tier.detail}
      </p>

      {tier.brand && (
        <p className="text-xs text-stone-600 mt-2 leading-snug">{tier.brand}</p>
      )}

      <p
        className={`text-xs font-semibold mt-3 pt-3 border-t ${
          unlocked
            ? 'border-success-500/30 text-success-900'
            : 'border-cream-300 text-stone-600'
        }`}
      >
        {unlocked ? '✓ Unlocked' : `Level ${tier.level}`}
        {tier.milestone && !unlocked && ' · Milestone'}
      </p>
    </li>
  )
}

// Guests keep their points — registering adopts guest progress onto the new
// account (notes/36). So this is an invitation, not a warning: the honest
// message is "your points follow you", not "you'll lose everything".
//
// The copy says CREATE an account, never "sign in", because adoption only
// happens onto an EMPTY account. Logging into an existing one keeps that
// account's progress and leaves the guest points behind — by design, so a
// borrowed device can't overwrite someone's real history. Promising transfer
// on login would be a lie the code doesn't tell.
function GuestNotice({ seasonPoints }) {
  const earned = seasonPoints > 0
  return (
    <div className="surface p-6 sm:p-8 mb-8 border-l-4 border-clay-600">
      <h3 className="font-display text-2xl text-stone-900 mb-2">
        {earned ? 'Keep your progress' : 'Create an account to compete'}
      </h3>
      <p className="text-base text-stone-700 mb-1">
        {earned ? (
          <>
            You’ve earned{' '}
            <strong>{seasonPoints.toLocaleString()} season points</strong> as a guest.
            They’re saved on this device only — create a free account and they’ll come
            with you.
          </>
        ) : (
          <>
            You’re browsing as a guest. Season points and levels still work, but they
            live on this device only and you won’t appear on the leaderboard.
          </>
        )}
      </p>
      <p className="text-sm text-stone-600">
        Points you earn now move to a <strong>new</strong> account when you create one.
        Logging into an account you already have keeps that account’s progress instead.
      </p>
      <div className="flex flex-wrap gap-3 mt-5">
        <Link to="/register" className="btn-primary">
          Create free account
        </Link>
        <Link to="/login" className="btn-secondary">
          Log in
        </Link>
      </div>
    </div>
  )
}
