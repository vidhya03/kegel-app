// Shared WAV file builder — used by useSound for AudioBuffer→WAV conversion
// and silent keep-alive audio generation

function writeWavHeader(view, sampleRate, numSamples) {
  const dataLength = numSamples * 2
  const write = (offset, str) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i))
  }
  write(0, 'RIFF')
  view.setUint32(4, 36 + dataLength, true)
  write(8, 'WAVE')
  write(12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, 1, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * 2, true)
  view.setUint16(32, 2, true)
  view.setUint16(34, 16, true)
  write(36, 'data')
  view.setUint32(40, dataLength, true)
}

// Create a WAV Blob URL from raw parameters
// fillSamples(view, numSamples) is called to write PCM data at offset 44;
// if omitted, samples are left as zero (silence)
export function createWavBlobUrl(sampleRate, numSamples, fillSamples) {
  const dataLength = numSamples * 2
  const ab = new ArrayBuffer(44 + dataLength)
  const view = new DataView(ab)
  writeWavHeader(view, sampleRate, numSamples)
  if (fillSamples) fillSamples(view, numSamples)
  return URL.createObjectURL(new Blob([ab], { type: 'audio/wav' }))
}
