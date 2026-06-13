import type { CultivationPath, PlayerState } from '../types/game'

export function getCultivationMultiplier(state: PlayerState): number {
  const { path, divineSense } = state.cultivationSystems
  let mult = 1
  if (path === 'body') mult *= 1.2
  if (path === 'law') mult *= 1 + divineSense / 200
  if (state.cultivationSystems.techniques.length > 0) mult *= 1.05
  if (state.flags.has_companion) mult *= 1.12
  if (state.flags.talent_spirit_affinity) mult *= 1.15
  return mult
}

export function getBodyDamageReduction(state: PlayerState): number {
  if (state.cultivationSystems.path !== 'body') return 0
  return Math.min(0.25, state.stats.rootBone / 400)
}

export function pathLabel(path: CultivationPath): string {
  return path === 'body' ? '炼体' : path === 'law' ? '法修' : '兼修'
}
