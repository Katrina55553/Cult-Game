type SoundId =
  | 'click'
  | 'choice'
  | 'success'
  | 'fail'
  | 'event'
  | 'ending'
  | 'start'
  | 'breakthrough'
  | 'rootReveal'
  | 'gain'
  | 'loss'
  | 'danger'
  | 'mysterious'
  | 'demon'
  | 'sword'
  | 'alchemy'
  | 'levelUp'
  | 'coin'
  | 'heal'

let audioCtx: AudioContext | null = null
let muted = false

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!audioCtx) {
    audioCtx = new AudioContext()
  }
  return audioCtx
}

function playTone(
  freq: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume = 0.15,
  delay = 0,
) {
  if (muted) return
  const ctx = getContext()
  if (!ctx) return

  if (ctx.state === 'suspended') {
    void ctx.resume()
  }

  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.type = type
  osc.frequency.value = freq
  gain.gain.setValueAtTime(0, ctx.currentTime + delay)
  gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + delay + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration)

  osc.connect(gain)
  gain.connect(ctx.destination)

  osc.start(ctx.currentTime + delay)
  osc.stop(ctx.currentTime + delay + duration)
}

function playChord(freqs: number[], duration: number, volume = 0.08) {
  freqs.forEach((f, i) => playTone(f, duration, 'sine', volume, i * 0.05))
}

function playArpeggio(freqs: number[], noteLen: number, volume = 0.1) {
  freqs.forEach((f, i) => playTone(f, noteLen, 'sine', volume * (1 - i * 0.15), i * noteLen * 0.7))
}

function playNoise(duration: number, volume = 0.03, delay = 0) {
  if (muted) return
  const ctx = getContext()
  if (!ctx) return
  if (ctx.state === 'suspended') void ctx.resume()

  const bufferSize = ctx.sampleRate * duration
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1
  }
  const source = ctx.createBufferSource()
  source.buffer = buffer
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0, ctx.currentTime + delay)
  gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + delay + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration)
  source.connect(gain)
  gain.connect(ctx.destination)
  source.start(ctx.currentTime + delay)
  source.stop(ctx.currentTime + delay + duration)
}

const SOUNDS: Record<SoundId, () => void> = {
  click: () => {
    playTone(800, 0.06, 'triangle', 0.08)
    playTone(1200, 0.04, 'sine', 0.04, 0.02)
  },

  choice: () => {
    playTone(523, 0.12, 'sine', 0.1)
    playTone(659, 0.15, 'sine', 0.08, 0.06)
    playTone(784, 0.18, 'sine', 0.06, 0.12)
  },

  success: () => {
    playArpeggio([523, 659, 784, 1047], 0.15, 0.1)
  },

  fail: () => {
    playTone(400, 0.25, 'sawtooth', 0.06)
    playTone(300, 0.3, 'sawtooth', 0.05, 0.1)
    playTone(200, 0.4, 'sawtooth', 0.04, 0.2)
    playNoise(0.3, 0.02, 0.05)
  },

  event: () => {
    playTone(440, 0.2, 'sine', 0.08)
    playTone(554, 0.25, 'sine', 0.06, 0.1)
    playTone(659, 0.3, 'sine', 0.05, 0.2)
  },

  ending: () => {
    playChord([261, 329, 392], 1.0, 0.08)
    playTone(523, 0.6, 'sine', 0.06, 0.4)
    playTone(659, 0.8, 'sine', 0.05, 0.7)
    playTone(784, 1.0, 'sine', 0.04, 1.0)
    playChord([523, 659, 784, 1047], 1.2, 0.04)
  },

  start: () => {
    playArpeggio([392, 523, 659, 784], 0.18, 0.09)
    playTone(1047, 0.6, 'sine', 0.05, 0.7)
  },

  breakthrough: () => {
    playTone(220, 0.15, 'sine', 0.08)
    playTone(330, 0.2, 'sine', 0.1, 0.1)
    playTone(440, 0.25, 'sine', 0.1, 0.2)
    playTone(660, 0.4, 'sine', 0.08, 0.3)
    playTone(880, 0.6, 'sine', 0.06, 0.5)
    playChord([523, 659, 784], 0.8, 0.05)
    playNoise(0.2, 0.015, 0.3)
  },

  rootReveal: () => {
    playTone(174, 0.4, 'sine', 0.1)
    playTone(261, 0.5, 'sine', 0.08, 0.25)
    playTone(392, 0.6, 'sine', 0.07, 0.5)
    playTone(523, 0.8, 'triangle', 0.05, 0.8)
  },

  gain: () => {
    playTone(660, 0.12, 'sine', 0.08)
    playTone(880, 0.18, 'sine', 0.06, 0.06)
  },

  loss: () => {
    playTone(440, 0.15, 'triangle', 0.07)
    playTone(330, 0.2, 'triangle', 0.05, 0.08)
  },

  danger: () => {
    playTone(200, 0.3, 'sawtooth', 0.06)
    playTone(250, 0.3, 'sawtooth', 0.06, 0.15)
    playTone(200, 0.3, 'sawtooth', 0.06, 0.3)
    playNoise(0.4, 0.02)
  },

  mysterious: () => {
    playTone(330, 0.4, 'sine', 0.06)
    playTone(415, 0.5, 'sine', 0.05, 0.2)
    playTone(523, 0.6, 'sine', 0.04, 0.45)
    playTone(622, 0.8, 'sine', 0.03, 0.7)
  },

  demon: () => {
    playTone(110, 0.4, 'sawtooth', 0.07)
    playTone(130, 0.5, 'sawtooth', 0.06, 0.15)
    playTone(165, 0.3, 'sawtooth', 0.05, 0.35)
    playNoise(0.5, 0.025, 0.1)
  },

  sword: () => {
    playNoise(0.08, 0.04)
    playTone(2000, 0.1, 'sine', 0.06, 0.02)
    playTone(3000, 0.08, 'sine', 0.04, 0.05)
  },

  alchemy: () => {
    playTone(523, 0.15, 'sine', 0.06)
    playTone(622, 0.12, 'sine', 0.05, 0.08)
    playTone(784, 0.2, 'sine', 0.04, 0.15)
    playNoise(0.15, 0.01, 0.1)
  },

  levelUp: () => {
    playArpeggio([523, 659, 784, 1047, 1319], 0.12, 0.08)
    playChord([1047, 1319, 1568], 0.6, 0.04)
  },

  coin: () => {
    playTone(1800, 0.06, 'triangle', 0.06)
    playTone(2400, 0.08, 'triangle', 0.04, 0.04)
  },

  heal: () => {
    playTone(440, 0.2, 'sine', 0.07)
    playTone(554, 0.25, 'sine', 0.06, 0.1)
    playTone(659, 0.3, 'sine', 0.05, 0.2)
    playTone(880, 0.4, 'sine', 0.04, 0.35)
  },
}

export function playSound(id: SoundId): void {
  try {
    SOUNDS[id]()
  } catch {
    // audio not available
  }
}

export function setMuted(value: boolean): void {
  muted = value
}

export function isMuted(): boolean {
  return muted
}

export function resumeAudio(): void {
  const ctx = getContext()
  if (ctx?.state === 'suspended') {
    void ctx.resume()
  }
}
