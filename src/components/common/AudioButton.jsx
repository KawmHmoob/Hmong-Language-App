import { useAudio } from '../../hooks/useAudio.js'
import { VolumeIcon } from '../icons/index.jsx'

export default function AudioButton({ audioSrc, wordId, size = 'sm' }) {
  const { play } = useAudio()
  const enabled = Boolean(audioSrc)
  const dim = size === 'lg' ? 'h-10 w-10' : 'h-7 w-7'
  return (
    <button
      type="button"
      title={enabled ? 'Play audio' : 'Audio coming soon'}
      onClick={(e) => {
        e.stopPropagation()
        if (enabled) play(audioSrc, wordId)
      }}
      className={`inline-flex items-center justify-center rounded-full ${dim} transition shrink-0 ${
        enabled
          ? 'bg-clay-500 text-cream-50 hover:bg-clay-600 shadow-warm'
          : 'bg-cream-200 text-stone-400 cursor-not-allowed'
      }`}
      disabled={!enabled}
    >
      <VolumeIcon size={size === 'lg' ? 18 : 14} />
      <span className="sr-only">{enabled ? 'Play audio' : 'No audio'}</span>
    </button>
  )
}
