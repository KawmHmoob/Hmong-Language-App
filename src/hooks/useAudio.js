import { useCallback, useState } from 'react'

// Placeholder — wire HTMLAudioElement once audio files exist.
// See instructions/audio-files.md
export function useAudio() {
  const [playing, setPlaying] = useState(null)

  const play = useCallback((src, wordId) => {
    if (!src) {
      console.warn('[audio] no source for', wordId)
      return
    }
    console.log(`Playing audio: ${src}`)
    setPlaying(src)
    setTimeout(() => setPlaying(null), 400)
  }, [])

  return { play, playing }
}
