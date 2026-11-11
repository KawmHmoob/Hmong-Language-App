import * as Icons from '../components/icons/index.jsx'
import PlayButton from '../components/site/PlayButton.jsx'
import PhoneFrame from '../components/site/PhoneFrame.jsx'
import ToneDemo from '../components/site/ToneDemo.jsx'
import { stats, tones, units, features, screens, heroScreen, faq } from '../data/showcase.js'
import { MOBILE_APP } from '../data/mobileApp.js'

// The showcase: one long page that sells the mobile app. Section order is the
// pitch, top to bottom —
//   hero (what + download) → stats (how much) → tones (why Hmong is hard, and
//   proof the audio is real) → features → course outline → screenshots →
//   who made it → FAQ → download again.
// All copy is in data/showcase.js; all numbers come from the mobile app via
// appContent.json. See notes/72.

export default function Landing() {
  return (
    <>
      <Hero />
      <Stats />
      <Section
        id="tones"
        eyebrow="Hmong is tonal"
        title="Eight tones. Hear every one."
        intro="In Hmong, the same syllable means different things depending on its pitch. The last letter of a written word tells you which tone to use. Tap a tone to hear a native speaker."
      >
        <ToneDemo tones={tones} />
      </Section>
      <Features />
      <Course />
      <Screens />
      <Story />
      <Faq />
      <Download />
    </>
  )
}

function Section({ id, eyebrow, title, intro, children, className = '' }) {
  return (
    <section id={id} className={`scroll-mt-20 py-16 sm:py-20 ${className}`}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl mb-8 sm:mb-10">
          {eyebrow && (
            <p className="text-xs uppercase tracking-[0.22em] font-semibold text-clay-700 mb-2">{eyebrow}</p>
          )}
          <h2 className="font-display text-3xl sm:text-4xl text-stone-900">{title}</h2>
          {intro && <p className="mt-3 text-lg text-stone-700 leading-relaxed">{intro}</p>}
        </div>
        {children}
      </div>
    </section>
  )
}

function Hero() {
  return (
    <section className="pt-12 pb-16 sm:pt-20 sm:pb-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 grid gap-12 md:grid-cols-[1.2fr_1fr] items-center">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-cream-50 border border-cream-200 px-3 py-1 text-sm font-semibold text-stone-800 mb-5">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-clay-600" />
            Now on Google Play
          </p>
          <h1 className="font-display text-5xl sm:text-6xl text-stone-900 leading-[1.05]">
            Learn Hmong, one tone at a time.
          </h1>
          <p className="mt-5 text-lg sm:text-xl text-stone-700 leading-relaxed max-w-xl">
            Kawm Hmoob means “learn Hmong.” Lessons, flashcards, and quizzes built
            around real native-speaker recordings, for anyone who grew up hearing
            Hmong and wants to finally speak it.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <PlayButton className="px-5 py-3 text-base" />
            <a href="#tones" className="btn-secondary inline-flex items-center gap-2 px-5 py-3 text-base">
              <Icons.VolumeIcon size={18} />
              Hear the tones
            </a>
          </div>
          <p className="mt-4 text-sm text-stone-600">Free on Android. iPhone version planned.</p>
        </div>
        <PhoneFrame screen={heroScreen} priority className="w-56 sm:w-64 mx-auto md:mr-0" />
      </div>
    </section>
  )
}

function Stats() {
  return (
    <section aria-label="What's in the app" className="bg-cream-50 border-y border-cream-200">
      <dl className="mx-auto max-w-6xl px-4 sm:px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <dt className="sr-only">{s.label}</dt>
            <dd className="font-display text-4xl sm:text-5xl text-clay-700">{s.value}</dd>
            <dd className="mt-1 text-sm text-stone-700">{s.label}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function Features() {
  return (
    <Section
      id="features"
      eyebrow="What's inside"
      title="Everything you need to start speaking"
      className="bg-seafoam-200"
    >
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => {
          const Icon = Icons[f.icon] ?? Icons.StarIcon
          return (
            <li key={f.title} className="rounded-xl bg-cream-50 border border-cream-200 p-6">
              <span className="inline-grid place-items-center h-11 w-11 rounded-lg bg-clay-600/10 text-clay-700 mb-4">
                <Icon size={22} />
              </span>
              <h3 className="font-display text-xl text-stone-900">{f.title}</h3>
              <p className="mt-2 text-stone-700 leading-relaxed">{f.body}</p>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}

function Course() {
  return (
    <Section
      id="course"
      eyebrow="The course"
      title="A path from the alphabet to real sentences"
      intro="Lessons are grouped into units, so you always know what comes next."
    >
      <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {units.map((u, i) => (
          <li key={u.title} className="rounded-xl bg-cream-50 border border-cream-200 p-5">
            <p className="text-xs uppercase tracking-[0.18em] font-semibold text-stone-600">Unit {i + 1}</p>
            <p className="mt-1 font-display text-lg text-stone-900">{u.title}</p>
            <p className="mt-1 text-sm text-stone-700">
              {u.lessons} {u.lessons === 1 ? 'lesson' : 'lessons'}
            </p>
          </li>
        ))}
      </ol>
    </Section>
  )
}

function Screens() {
  return (
    <Section id="screens" eyebrow="A look inside" title="Made for your phone" className="bg-seafoam-200">
      {/* Horizontal scroll on small screens (inside the section, never the
          page); a single row on wide ones. */}
      <ul className="-mx-4 px-4 flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 lg:grid lg:grid-cols-5 lg:overflow-visible lg:mx-0 lg:px-0">
        {screens.map((s) => (
          <li key={s.id} className="w-48 shrink-0 snap-center lg:w-auto">
            <PhoneFrame screen={s} />
          </li>
        ))}
      </ul>
    </Section>
  )
}

function Story() {
  return (
    <Section id="story" eyebrow="Who's behind it" title="Built by one person, for the next generation">
      <div className="max-w-2xl space-y-4 text-lg text-stone-700 leading-relaxed">
        <p>
          Kawm Hmoob is made by a single Hmong-American developer: the code, the
          lessons, and the audio. A lot of us grew up hearing Hmong at home but
          never had a real way to learn it. This is an attempt to build that way.
        </p>
        <p>
          It's early, and the content is still being reviewed with native
          speakers. If you spot a mistake, you'll make the app better by
          reporting it.
        </p>
      </div>
    </Section>
  )
}

function Faq() {
  return (
    <Section id="faq" eyebrow="Questions" title="Frequently asked" className="bg-seafoam-200">
      <div className="max-w-3xl space-y-3">
        {faq.map((item) => (
          <details key={item.q} className="group rounded-xl bg-cream-50 border border-cream-200 px-5 py-4">
            <summary className="cursor-pointer list-none flex items-center justify-between gap-4 font-semibold text-stone-900">
              {item.q}
              <Icons.ArrowRightIcon size={18} className="shrink-0 text-stone-600 transition-transform group-open:rotate-90" />
            </summary>
            <p className="mt-3 text-stone-700 leading-relaxed">{item.a}</p>
          </details>
        ))}
      </div>
    </Section>
  )
}

function Download() {
  const notify = `mailto:${MOBILE_APP.notifyEmail}?subject=${encodeURIComponent('Tell me when Kawm Hmoob is on iPhone')}`
  return (
    <section id="download" className="scroll-mt-20 py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="rounded-2xl bg-cream-50 border border-cream-200 px-6 py-12 sm:px-12 text-center">
          <h2 className="font-display text-3xl sm:text-4xl text-stone-900">Start learning today</h2>
          <p className="mt-3 text-lg text-stone-700">Free on Android, with new lessons added as they're recorded.</p>
          <div className="mt-8 flex justify-center">
            <PlayButton className="px-6 py-3 text-base" />
          </div>
          <p className="mt-6 text-sm text-stone-700">
            On iPhone?{' '}
            <a href={notify} className="text-clay-700 underline underline-offset-2">
              Email us to hear when it's ready
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  )
}
