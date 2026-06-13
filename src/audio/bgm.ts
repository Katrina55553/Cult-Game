let audioCtx: AudioContext | null = null
let masterGain: GainNode | null = null
let playing = false
let currentMood: 'calm' | 'tense' | 'mystical' = 'calm'
let intervalId: ReturnType<typeof setInterval> | null = null

const MOODS = {
  calm: {
    notes: [261, 293, 329, 349, 392, 440, 493],
    tempo: 2500,
    volume: 0.025,
    filterFreq: 800,
  },
  tense: {
    notes: [220, 233, 261, 277, 311, 329],
    tempo: 1800,
    volume: 0.03,
    filterFreq: 600,
  },
  mystical: {
    notes: [329, 369, 415, 440, 493, 523, 587],
    tempo: 3000,
    volume: 0.02,
    filterFreq: 1000,
  },
}

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!audioCtx) {
    audioCtx = new AudioContext()
    masterGain = audioCtx.createGain()
    masterGain.gain.value = 0
    masterGain.connect(audioCtx.destination)
  }
  return audioCtx
}

function playAmbientNote() {
  const ctx = getCtx()
  if (!ctx || !masterGain) return

  const mood = MOODS[currentMood]
  const note = mood.notes[Math.floor(Math.random() * mood.notes.length)]
  const duration = 1.5 + Math.random() * 2

  const osc = ctx.createOscillator()
  const osc2 = ctx.createOscillator()
  const gain = ctx.createGain()
  const filter = ctx.createBiquadFilter()

  osc.type = 'sine'
  osc.frequency.value = note

  osc2.type = 'sine'
  osc2.frequency.value = note * 1.002

  filter.type = 'lowpass'
  filter.frequency.value = mood.filterFreq
  filter.Q.value = 1

  gain.gain.setValueAtTime(0, ctx.currentTime)
  gain.gain.linearRampToValueAtTime(mood.volume, ctx.currentTime + 0.3)
  gain.gain.setValueAtTime(mood.volume, ctx.currentTime + duration * 0.6)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)

  osc.connect(filter)
  osc2.connect(filter)
  filter.connect(gain)
  gain.connect(masterGain)

  osc.start(ctx.currentTime)
  osc2.start(ctx.currentTime)
  osc.stop(ctx.currentTime + duration)
  osc2.stop(ctx.currentTime + duration)

  if (Math.random() > 0.6) {
    const fifth = mood.notes[Math.floor(Math.random() * mood.notes.length)]
    const osc3 = ctx.createOscillator()
    const gain3 = ctx.createGain()
    osc3.type = 'sine'
    osc3.frequency.value = fifth * 0.5
    gain3.gain.setValueAtTime(0, ctx.currentTime + 0.5)
    gain3.gain.linearRampToValueAtTime(mood.volume * 0.5, ctx.currentTime + 1)
    gain3.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
    osc3.connect(gain3)
    gain3.connect(masterGain)
    osc3.start(ctx.currentTime + 0.5)
    osc3.stop(ctx.currentTime + duration)
  }
}

export function startBgm(): void {
  const ctx = getCtx()
  if (!ctx || playing) return

  if (ctx.state === 'suspended') void ctx.resume()

  playing = true
  if (masterGain) {
    masterGain.gain.linearRampToValueAtTime(1, ctx.currentTime + 1)
  }

  playAmbientNote()
  intervalId = setInterval(() => {
    if (playing) playAmbientNote()
  }, MOODS[currentMood].tempo)
}

export function stopBgm(): void {
  const ctx = getCtx()
  if (!ctx || !playing) return

  playing = false
  if (masterGain) {
    masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1)
  }

  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

export function setBgmMood(mood: 'calm' | 'tense' | 'mystical'): void {
  if (currentMood === mood) return
  currentMood = mood

  if (playing && intervalId) {
    clearInterval(intervalId)
    intervalId = setInterval(() => {
      if (playing) playAmbientNote()
    }, MOODS[mood].tempo)
  }
}

export function isBgmPlaying(): boolean {
  return playing
}
