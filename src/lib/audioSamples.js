// Blob → raw PCM samples for pitch analysis.
//
// The recorded take (clip.blob from usePronunciation) is compressed
// webm/mp4/ogg. decodeAudioData unzips it into a Float32Array of amplitudes;
// OfflineAudioContext resamples to 16 kHz in the same pass — F0 for speech
// tops out ~400 Hz, so 48 kHz is 3× the work for no gain. See
// instructions/f0-and-tone-scoring.md Part 1.
//
// AudioContext / OfflineAudioContext are browser GLOBALS — no import. The
// window.*|window.webkit* dance is for older Safari, same as useAudio.js.

const AudioCtx = window.AudioContext || window.webkitAudioContext
const OfflineCtx = window.OfflineAudioContext || window.webkitOfflineAudioContext

export const ANALYSIS_RATE = 16000

export async function blobToSamples(blob, targetRate = ANALYSIS_RATE) {
  const buf = await blob.arrayBuffer()

  // Decode at the file's native rate, in a throwaway context closed right
  // after — browsers cap how many contexts can be open (~6), so leaking one
  // per take would eventually throw.
  const tmp = new AudioCtx()
  let decoded
  try {
    decoded = await tmp.decodeAudioData(buf)
  } finally {
    tmp.close()
  }

  // Already at or below target — nothing to resample.
  if (decoded.sampleRate <= targetRate) {
    return { samples: decoded.getChannelData(0), rate: decoded.sampleRate }
  }

  // length is in FRAMES at the TARGET rate. Using decoded.length (source rate)
  // would over-allocate by the ratio and append silence.
  const frames = Math.ceil(decoded.duration * targetRate)
  const off = new OfflineCtx(1, frames, targetRate)
  const src = off.createBufferSource()
  src.buffer = decoded
  src.connect(off.destination)
  src.start()
  const rendered = await off.startRendering()

  return { samples: rendered.getChannelData(0), rate: targetRate }
}
