import { Link } from 'react-router-dom'
import TodayCard from '../components/home/TodayCard.jsx'

const cards = [
  { to: '/learn', title: 'Learn', desc: 'Structured units with intro, examples, practice, and quiz.' },
  { to: '/alphabet', title: 'Alphabet', desc: 'Consonants, vowels, and tones.' },
  { to: '/course', title: 'Course', desc: 'Grammar, everyday phrases, and reading.' },
  { to: '/vocabulary', title: 'Vocabulary', desc: 'Build your word bank by category.' },
  { to: '/notebook', title: 'Notebook', desc: 'Save words and jot down notes.' },
  { to: '/quiz', title: 'Quizzes', desc: 'Practice and test what you learn.' },
  { to: '/account', title: 'Account', desc: 'Profile, stats, and progress.' },
]

export default function Home() {
  return (
    <>
      <section className="text-center mb-16 pt-2">
        <p className="text-sm uppercase tracking-[0.25em] text-clay-600 mb-4 text-[#fff] font-semibold">Welcome</p>
        <h2 className="font-serif text-5xl sm:text-6xl text-stone-900 mb-5 text-[#fff]">Nyob zoo.</h2>
        <p className="text-lg text-stone-700 max-w-xl mx-auto leading-relaxed">
          A quiet place to learn Hmong — one phrase, one word, one tone at a time.
        </p>
      </section>

      <TodayCard />

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-16">
        {cards.map((c) => (
          <Link
            key={c.to}
            to={c.to}
            className="surface surface-hover p-6 block group"
          >
            <h3 className="font-serif text-xl text-stone-900 mb-2 group-hover:text-clay-700 transition">
              {c.title}
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">{c.desc}</p>
          </Link>
        ))}
      </section>
    </>
  )
}
