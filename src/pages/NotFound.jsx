import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="text-center py-20">
      <p className="text-sm uppercase tracking-[0.2em] text-clay-600 mb-3">Lost</p>
      <h2 className="font-serif text-7xl text-stone-900 mb-3">404</h2>
      <p className="text-stone-700 mb-8">That page does not exist.</p>
      <Link to="/" className="btn-primary">Go Home</Link>
    </div>
  )
}
