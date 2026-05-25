export default function SkeletonCard({ className = '' }) {
  return (
    <div className={`animate-pulse rounded-md bg-cream-200/60 border border-cream-200 ${className}`}>
      <div className="h-5 w-1/3 bg-cream-300/70 rounded m-4" />
      <div className="h-3 w-2/3 bg-cream-300/50 rounded mx-4 mb-4" />
    </div>
  )
}
