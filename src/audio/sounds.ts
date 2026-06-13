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

const SOUNDS: Record<SoundId, () => void> = {
  click: () => playTone(800, 0.08, 'triangle', 0.1),
  choice: () => {
    playTone(523, 0.15, 'sine', 0.12)
    playTone(659, 0.2, 'sine', 0.1, 0.08)
  },
  success: () => {
    playTone(523, 0.2, 'sine', 0.12)
    playTone(659, 0.2, 'sine', 0.1, 0.1)
    playTone(784, 0.3, 'sine', 0.08, 0.2)
  },
  fail: () => {
    playTone(300, 0.3, 'sawtooth', 0.08)
    playTone(200, 0.4, 'sawtooth', 0.06, 0.15)
  },
  event: () => {
    playTone(440, 0.25, 'sine', 0.1)
    playTone(330, 0.35, 'sine', 0.08, 0.12)
  },
  ending: () => {
    playChord([261, 329, 392], 1.2, 0.1)
    playTone(523, 0.8, 'sine', 0.06, 0.5)
  },
  start: () => {
    playTone(392, 0.3, 'sine', 0.1)
    playTone(523, 0.4, 'sine', 0.1, 0.2)
    playTone(659, 0.5, 'sine', 0.08, 0.4)
  },
  breakthrough: () => {
    playTone(220, 0.2, 'sine', 0.1)
    playTone(330, 0.3, 'sine', 0.12, 0.15)
    playTone(440, 0.4, 'sine', 0.1, 0.3)
    playTone(660, 0.6, 'sine', 0.08, 0.45)
    playChord([523, 659, 784], 0.8, 0.06)
  },
  rootReveal: () => {
    playTone(174, 0.5, 'sine', 0.12)
    playTone(261, 0.6, 'sine', 0.1, 0.3)
    playTone(392, 0.8, 'sine', 0.08, 0.6)
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
