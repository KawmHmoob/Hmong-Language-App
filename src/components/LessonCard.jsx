export default function LessonCard({ lesson, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`text-left rounded-xl border p-5 transition shadow-sm hover:shadow-md ${
        isActive
          ? 'border-indigo-400 bg-indigo-50'
          : 'border-slate-200 bg-white hover:border-indigo-300'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-slate-900">{lesson.title}</h4>
        <span className="text-xs uppercase tracking-wide text-slate-400">
          {lesson.level}
        </span>
      </div>
      <p className="text-sm text-slate-500 mb-3">{lesson.description}</p>

      {isActive && (
        <ul className="mt-4 space-y-2 border-t border-slate-200 pt-3">
          {lesson.phrases.map((p) => (
            <li key={p.hmong} className="flex justify-between text-sm">
              <span className="font-medium text-indigo-700">{p.hmong}</span>
              <span className="text-slate-600">{p.english}</span>
            </li>
          ))}
        </ul>
      )}
    </button>
  )
}
