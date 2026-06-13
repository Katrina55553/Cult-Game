let seed = Date.now()

export function setSeed(value: number): void {
  seed = value >>> 0
}

export function getDailySeed(): number {
  const now = new Date()
  const key = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`
  let hash = 0
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0
  }
  return hash || 1
}

function next(): number {
  seed = (seed * 1664525 + 1013904223) >>> 0
  return seed / 0x100000000
}

export function getSeed(): number {
  return seed
}

export function random(): number {
  return next()
}

export function randInt(min: number, max: number): number {
  return Math.floor(random() * (max - min + 1)) + min
}
