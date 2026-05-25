import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useProgress } from '../../hooks/useProgress.js'
import { categories } from '../../data/vocabulary.js'
import ProgressBar from '../progress/ProgressBar.jsx'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user, logout, updateProfile } = useAuth()
  const { xp, streakData, quizScores, vocabProgress, completedLessons, exportData } = useProgress()

  const wordsKnown = Object.values(vocabProgress).filter((s) => s === 'known').length

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(exportData(), null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `kawmhmoob-progress-${user.id}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (user.isGuest) {
    return (
      <div className="surface p-8 max-w-xl">
        <h2 className="font-serif text-3xl text-stone-900 mb-2">Guest Account</h2>
        <p className="text-stone-700 mb-6 leading-relaxed">
          You're learning as a guest. Progress is saved on this device only â€” clearing browser
          data will erase it. Create an account to save your work.
        </p>
        <div className="flex gap-2">
          <Link to="/login" className="btn-ghost">Log In</Link>
          <Link to="/register" className="btn-primary">Create Account</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="surface p-8">
        <h2 className="font-serif text-4xl text-stone-900">{user.displayName}</h2>
        <p className="text-stone-600 mt-1">
          @{user.username} Â· joined {user.joinedAt?.slice(0, 10)}
        </p>
      </div>

      <div className="grid sm:grid-cols-4 gap-3">
        <Stat label="XP" value={xp} />
        <Stat label="Streak" value={`${streakData.currentStreak}d`} />
        <Stat label="Quizzes" value={quizScores.length} />
        <Stat label="Words Known" value={wordsKnown} />
      </div>

      <div className="surface p-6">
        <h3 className="font-serif text-xl text-stone-900 mb-3">Dialect Preference</h3>
        <select
          value={user.dialectPreference}
          onChange={(e) => updateProfile({ dialectPreference: e.target.value })}
          className="rounded border border-cream-300 bg-cream-50 px-3 py-2 text-sm focus:outline-none focus:border-clay-500"
        >
          <option value="white">White Hmong (Hmoob Dawb)</option>
          <option value="green">Green Hmong (Moob Leeg)</option>
        </select>
      </div>

      <div className="surface p-6">
        <h3 className="font-serif text-xl text-stone-900 mb-4">My Progress</h3>
        <div className="space-y-3">
          {categories.map((c) => {
            const total = c.words.length
            const known = c.words.filter((w) => vocabProgress[w.id] === 'known').length
            return (
              <ProgressBar
                key={c.id}
                label={c.title}
                value={known}
                max={Math.max(total, 1)}
              />
            )
          })}
        </div>
        <p className="text-xs text-stone-500 mt-4">
          Completed lessons: {completedLessons.length}
        </p>
      </div>

      <div className="flex gap-2">
        <button onClick={handleExport} className="btn-secondary">
          Export My Data
        </button>
        <button
          onClick={() => {
            logout()
            navigate('/')
          }}
          className="btn-ghost"
        >
          Log Out
        </button>
      </div>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="surface p-5 text-center">
      <div className="font-serif text-3xl text-stone-900">{value}</div>
      <div className="text-xs uppercase tracking-wider text-clay-600 mt-1">{label}</div>
    </div>
  )
}
