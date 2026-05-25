export default function ProgressBar({ value, max = 100, label, className = '' }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0
  return (
    <div className={className}>
      {label && (
        <div className="flex justify-between text-xs text-stone-700 mb-1">
          <span className="font-medium">{label}</span>
          <span className="text-stone-500">
            {value} / {max}
          </span>
        </div>
      )}
      <div className="h-2 w-full bg-cream-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-clay-600 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
