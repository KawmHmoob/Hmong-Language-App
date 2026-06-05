import { useCallback, useEffect, useRef, useState } from 'react'

// Audio playback for vocabulary, alphabet, and lesson examples.
//
// Source resolution:
//   - Absolute path (starts with '/'):  used as-is, e.g. '/assets/audio/foo.mp3'
//   - Bare filename:                    prepended with AUDIO_BASE
//   - Falsy or '/':                     ignored (no-op)
//
// Performance: Audio instances are cached per-src in a module-level Map, so
// repeated taps on the same word reuse the same HTMLAudioElement and don't
// pay the network/decode cost again. We rewind via `.currentTime = 0` rather
// than constructing a new Audio.
//
// Concurrency: starting a new sound pauses whatever was playing, so taps
// can't overlap into a chord.

const AUDIO_BASE = '/assets/audio/'

// Module-level cache survives component remounts.
const cache = new Map()
let current = null // the Audio instance currently playing, if any

function resolveSrc(src) {
  if (!src || src === '/') return null
  return src.startsWith('/') ? src : AUDIO_BASE + src
}

function getOrCreate(url) {
  let audio = cache.get(url)
  if (!audio) {
    audio = new Audio(url)
    audio.preload = 'auto'
    cache.set(url, audio)
  }
  return audio
}

export function useAudio() {
  const [playing, setPlaying] = useState(null)
  // Track which src this hook instance kicked off, so we don't clear the
  // `playing` state when *another* component's audio finishes.
  const ownedSrc = useRef(null)

  const play = useCallback((src, wordId) => {
    const url = resolveSrc(src)
    if (!url) {
      if (src) console.warn('[audio] invalid src', { src, wordId })
      return
    }

    // Stop whatever else is playing.
    if (current && current !== getOrCreate(url)) {
      current.pause()
      current.currentTime = 0
    }

    const audio = getOrCreate(url)
    audio.currentTime = 0
    current = audio
    ownedSrc.current = src
    setPlaying(src)

    const onEnded = () => {
      if (ownedSrc.current === src) setPlaying(null)
      if (current === audio) current = null
      audio.removeEventListener('ended', onEnded)
    }
    audio.addEventListener('ended', onEnded)

    audio.play().catch((err) => {
      console.warn('[audio] play failed', { url, err })
      if (ownedSrc.current === src) setPlaying(null)
      if (current === audio) current = null
      audio.removeEventListener('ended', onEnded)
    })
  }, [])

  // If the component unmounts mid-play, drop our claim on `playing` state
  // (the audio itself keeps playing — that's usually what the user wants).
  useEffect(() => () => { ownedSrc.current = null }, [])

  return { play, playing }
}
