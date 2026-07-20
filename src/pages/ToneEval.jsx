import { useState } from 'react'
import { evalSet, scorableEval, SPEAKERS, LABELS } from '../data/speechEval.js'
import { blobToSamples } from '../lib/audioSamples.js'
import { extractContour } from '../lib/yin.js'
import { toneScore } from '../lib/toneScore.js'

// Dev-only harness for the tone scorer. Runs the eval set (speechEval.js)
// through the real pipeline in the browser — Node can't decode mp3 without
// ffmpeg, so this is where the confusion matrix lives. See notes/61.
//
// Not linked in nav; reach it at /tone-eval. Renders a "dev only" notice in
// production rather than the tool.

async function contourFor(file) {
  const blob = await fetch(file).then((r) => r.blob())
  const { samples, rate } = await blobToSamples(blob)
  return extractContour(samples, rate)
}

const cellColor = (s) =>
  s == null
    ? 'bg-cream-100 text-stone-400'
    : s >= 80
    ? 'bg-success-50 text-success-900'
    : s >= 55
    ? 'bg-cream-200 text-stone-800'
    : 'bg-danger-50 text-danger-900'

export default function ToneEval() {
  const [rows, setRows] = useState(null)
  const [matrix, setMatrix] = useState(null)
  const [running, setRunning] = useState(false)
  const [error, setError] = useState('')

  if (!import.meta.env.DEV) {
    return (
      <div className="py-16 text-center text-stone-700">
        <p>The tone-eval harness only runs in development.</p>
      </div>
    )
  }

  const run = async () => {
    setRunning(true)
    setError('')
    try {
      const usable = scorableEval
      // Cache each file's contour once.
      const contours = new Map()
      for (const r of usable) {
        if (!contours.has(r.file)) contours.set(r.file, await contourFor(r.file))
      }

      // Score WITHIN each source group, not across. A full cross-product would
      // compare "loj" against "nyob zoo" — meaningless, and a 40-wide grid.
      // The tone group is the real minimal-pair test; the others are smoke
      // tests that self ≈ 100 and different words score lower.
      const groups = {}
      for (const src of [...new Set(usable.map((r) => r.source))]) {
        const inGroup = usable.filter((r) => r.source === src)
        const natives = inGroup.filter((r) => r.speaker === 'native-f')
        groups[src] = {
          natives,
          cells: inGroup.map((row) => ({
            row,
            scores: natives.map((ref) => ({
              ref,
              score: toneScore(contours.get(ref.file), contours.get(row.file)).score,
            })),
          })),
        }
      }
      setMatrix(groups)
      setRows(usable)
    } catch (e) {
      setError(e.message || String(e))
    } finally {
      setRunning(false)
    }
  }

  const placeholders = evalSet.filter((r) => !r.file || r.label === 'PLACEHOLDER')

  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-3xl text-stone-900 mb-2">Tone-scorer eval</h1>
      <p className="text-stone-700 mb-6">
        Scores every labeled clip against the native reference clips. The
        diagonal (same tone) should be high; off-diagonal (different tone)
        lower. If a whole speaker’s row is uniformly high or low regardless of
        tone, normalization is leaking voice identity.
      </p>

      <button onClick={run} disabled={running} className="btn-primary mb-6">
        {running ? 'Scoring…' : `Run eval (${scorableEval.length} clips)`}
      </button>

      {error && (
        <p className="text-danger-900 bg-danger-50 rounded-md px-4 py-3 mb-6">{error}</p>
      )}

      {matrix &&
        Object.entries(matrix).map(([src, { natives, cells }]) => (
          <div key={src} className="mb-8">
            <h2 className="font-display text-lg text-stone-900 mb-2 capitalize">
              {src} — {natives.length} references
            </h2>
            <div className="overflow-x-auto">
              <table className="text-sm border-collapse">
                <thead>
                  <tr>
                    <th className="text-left p-2 text-stone-600 font-medium">take ↓ / ref →</th>
                    {natives.map((n) => (
                      <th key={n.id} className="p-2 text-stone-600 font-medium">
                        {n.hmong}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cells.map(({ row, scores }) => (
                    <tr key={row.id}>
                      <td className="p-2 whitespace-nowrap">
                        <span className="font-medium text-stone-900">{row.hmong}</span>
                        <span className="text-stone-500"> · {row.label}</span>
                        <span className="text-stone-400"> · {row.speaker}</span>
                      </td>
                      {scores.map(({ ref, score }) => (
                        <td
                          key={ref.id}
                          className={`p-2 text-center font-medium rounded ${cellColor(score)}`}
                        >
                          {score ?? '—'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

      {placeholders.length > 0 && (
        <div className="surface p-5">
          <h2 className="font-display text-lg text-stone-900 mb-2">
            Waiting on you — {placeholders.length} clips to record
          </h2>
          <p className="text-sm text-stone-700 mb-3">
            Record each, drop the file in <code>public/assets/audio/eval/</code>,
            set its <code>file</code> and <code>label</code> in{' '}
            <code>src/data/speechEval.js</code>.
          </p>
          <ul className="text-sm text-stone-700 space-y-1">
            {placeholders.map((r) => (
              <li key={r.id}>
                <span className="font-medium">{r.hmong}</span> ({r.english}) —{' '}
                <span className="text-clay-700">{r.id}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 text-xs text-stone-600">
            Labels: {Object.keys(LABELS).join(' · ')}
            <br />
            Speakers: {Object.entries(SPEAKERS).map(([k, v]) => `${k} (${v.voice})`).join(' · ')}
          </div>
        </div>
      )}
    </div>
  )
}
