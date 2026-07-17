import { Link } from 'react-router-dom'
import { ArrowRightIcon } from '../components/icons/index.jsx'
import LessonCard from '../components/learn/LessonCard.jsx'
import { units, lessonProgress } from '../data/lessons.js'
import { useProgress } from '../hooks/useProgress.js'

// Learn hub — a MAP of the course, not the whole course. Each unit shows its
// first two lessons plus a "See all" into the unit's own page (/learn/:unitId).
// Keeps the hub scannable as units grow; see notes/33.

const PREVIEW_COUNT = 2

export default function Learn() {
  const { completedSteps } = useProgress()

  return (
    <>
      <div className="mb-8">
        <p className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-stone-600 mb-2">
          <span className="h-2 w-2 rounded-full bg-seafoam-500" aria-hidden="true" />
          Learn
        </p>
        <h2 className="font-serif text-4xl text-stone-900 mb-2">Study, step by step.</h2>
        <p className="text-stone-700">
          Structured units. Each lesson walks you through an intro, examples, a quick check, and a mini-quiz.
        </p>
      </div>

      {/* The other half of the job split: Learn explains, Reference states. */}
      <Link
        to="/reference/grammar"
        className="surface surface-hover p-4 flex items-center justify-between gap-3 group mb-10"
      >
        <span>
          <span className="block font-serif text-lg text-stone-900 group-hover:text-clay-700 transition">
            Grammar cheat sheets
          </span>
          <span className="block text-sm text-stone-600">
            Already know the concept? Look up the words instead.
          </span>
        </span>
        <ArrowRightIcon size={18} className="text-stone-500 shrink-0" />
      </Link>

      <div className="space-y-10">
        {units.map((unit) => {
          const total = unit.lessons.length
          const done = unit.lessons.filter(
            (l) => lessonProgress(l, completedSteps).complete
          ).length
          const preview = unit.lessons.slice(0, PREVIEW_COUNT)
          const rest = total - preview.length

          return (
            <section key={unit.id} aria-labelledby={`unit-${unit.id}`}>
              <header className="mb-4 flex flex-wrap items-end justify-between gap-2">
                <div className="min-w-0">
                  <h3 id={`unit-${unit.id}`} className="font-serif text-2xl text-stone-900">
                    <Link to={`/learn/${unit.id}`} className="hover:text-clay-700 transition">
                      {unit.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-stone-600">{unit.description}</p>
                </div>
                <p className="text-xs text-stone-600 whitespace-nowrap">
                  {done} / {total} done
                </p>
              </header>

              <div className="grid gap-4 sm:grid-cols-2">
                {preview.map((lesson) => (
                  <LessonCard key={lesson.id} unit={unit} lesson={lesson} />
                ))}
              </div>

              {rest > 0 && (
                <div className="mt-4">
                  <Link
                    to={`/learn/${unit.id}`}
                    className="btn-ghost gap-2 w-full sm:w-auto"
                  >
                    See all {total} lessons
                    <ArrowRightIcon size={16} />
                  </Link>
                </div>
              )}
            </section>
          )
        })}
      </div>
    </>
  )
}
