import { useState } from 'react'
import LessonCard from './components/LessonCard.jsx'
import { lessons } from './data/lessons.js'

export default function App() {
  const [activeLesson, setActiveLesson] = useState(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-rose-50">
      <header className="border-b border-slate-200 bg-white/70 backdrop-blur">
        <div className="mx-auto max-w-5xl px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Kawm Hmoob</h1>
            <p className="text-sm text-slate-500">Learn the Hmong language</p>
          </div>
          <nav className="flex gap-4 text-sm font-medium text-slate-600">
            <a href="#lessons" className="hover:text-indigo-600">Lessons</a>
            <a href="#about" className="hover:text-indigo-600">About</a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        <section className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-3">
            Nyob zoo! 👋
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Start learning Hmong one phrase at a time. Pick a lesson below to begin.
          </p>
        </section>

        <section id="lessons">
          <h3 className="text-xl font-semibold text-slate-800 mb-4">Lessons</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                isActive={activeLesson === lesson.id}
                onClick={() =>
                  setActiveLesson(activeLesson === lesson.id ? null : lesson.id)
                }
              />
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 mt-16">
        <div className="mx-auto max-w-5xl px-6 py-6 text-sm text-slate-500 text-center">
          Built with React + Tailwind
        </div>
      </footer>
    </div>
  )
}
