import { useCallback, useEffect, useRef, useState } from 'react'

// Mic recording for the Speak section. Mirrors useAudio.js's philosophy:
// module-level caches so expensive things happen once per session, and a
// small hook surface for components.
//
// State machine (the `status` value):
//   'idle'        → nothing happening; may or may not have permission yet
//   'recording'   → MediaRecorder is running
//   'denied'      → user refused the mic (or browser blocked it)
//   'unsupported' → no MediaRecorder in this browser
//
// The hook also exposes `analyser` (a Web Audio AnalyserNode) while
// recording, so a component can draw a live level meter. `clip` is
// { url, blob } for the most recent take — url is ready for `new Audio()`.

let sharedStream = null // mic stream — cached so we prompt once, not per step
let sharedCtx = null    // one AudioContext per session (browsers cap them)

async function getStream() {
  if (sharedStream && sharedStream.active) return sharedStream
  sharedStream = await navigator.mediaDevices.getUserMedia({ audio: true })
  return sharedStream
}

function getCtx() {
  if (!sharedCtx) sharedCtx = new (window.AudioContext || window.webkitAudioContext)()
  return sharedCtx
}

// Safari records mp4/aac; Chrome/Firefox prefer webm/opus. Ask, don't assume.
function pickMimeType() {
  const candidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg']
  for (const t of candidates) {
    if (MediaRecorder.isTypeSupported(t)) return t
  }
  return '' // let the browser pick its default
}

export function usePronunciation() {
  const supported =
    typeof window !== 'undefined' &&
    typeof MediaRecorder !== 'undefined' &&
    Boolean(navigator.mediaDevices?.getUserMedia)

  const [status, setStatus] = useState(supported ? 'idle' : 'unsupported')
  const [clip, setClip] = useState(null) // { url, blob } | null
  const [analyser, setAnalyser] = useState(null)
  const recorderRef = useRef(null)
  const chunksRef = useRef([])
  const sourceRef = useRef(null)

  const start = useCallback(async () => {
    if (!supported) return
    let stream
    try {
      stream = await getStream()
    } catch {
      setStatus('denied')
      return
    }

    // Wire the live meter. AudioContexts start suspended on iOS until a
    // user gesture — start() IS a gesture, so resume here.
    const ctx = getCtx()
    if (ctx.state === 'suspended') await ctx.resume().catch(() => {})
    const node = ctx.createAnalyser()
    node.fftSize = 512
    sourceRef.current = ctx.createMediaStreamSource(stream)
    sourceRef.current.connect(node)
    setAnalyser(node)

    const mimeType = pickMimeType()
    const rec = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)
    chunksRef.current = []
    rec.ondataavailable = (e) => {
      if (e.data.size) chunksRef.current.push(e.data)
    }
    rec.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: rec.mimeType })
      setClip((prev) => {
        if (prev?.url) URL.revokeObjectURL(prev.url) // don't leak the old take
        return { url: URL.createObjectURL(blob), blob }
      })
    }
    recorderRef.current = rec
    rec.start()
    setStatus('recording')
  }, [supported])

  const stop = useCallback(() => {
    const rec = recorderRef.current
    if (rec && rec.state !== 'inactive') rec.stop()
    sourceRef.current?.disconnect()
    sourceRef.current = null
    setAnalyser(null)
    setStatus('idle')
  }, [])

  // Leaving the screen mid-recording: stop cleanly and free the object URL.
  useEffect(
    () => () => {
      const rec = recorderRef.current
      if (rec && rec.state !== 'inactive') rec.stop()
      sourceRef.current?.disconnect()
    },
    []
  )
  useEffect(
    () => () => {
      if (clip?.url) URL.revokeObjectURL(clip.url)
    },
    [clip]
  )

  return { status, clip, analyser, start, stop, supported }
}
