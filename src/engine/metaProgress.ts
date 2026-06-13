import { ENDINGS } from '../data/endings'
import { getRealmOrder } from '../data/realms'
import type { Ending, MetaProgress, PlayerState } from '../types/game'

const META_KEY = 'cultgame_meta'

export const DEFAULT_META: MetaProgress = {
  unlockedEndings: [],
  unlockedAchievements: [],
  unlockedEvents: [],
  totalRuns: 0,
  bestRealm: 'mortal',
  bestTurn: 0,
  flagsEverTriggered: [],
  romanceBoost: false,
  innateBodyUnlocked: false,
  unlockedOrigins: [],
}

export function loadMeta(): MetaProgress {
  try {
    const raw = localStorage.getItem(META_KEY)
    if (!raw) return { ...DEFAULT_META }
    return { ...DEFAULT_META, ...JSON.parse(raw) }
  } catch {
    return { ...DEFAULT_META }
  }
}

export function saveMeta(meta: MetaProgress): void {
  try {
    localStorage.setItem(META_KEY, JSON.stringify(meta))
  } catch {
    // ignore
  }
}

export function recordEndingRun(
  meta: MetaProgress,
  ending: Ending,
  player: PlayerState,
  turn: number,
): { meta: MetaProgress; isFirstEnding: boolean } {
  const isFirstEnding = !meta.unlockedEndings.includes(ending.id)
  const origin = player.origin ?? 'random'
  const next: MetaProgress = {
    ...meta,
    totalRuns: meta.totalRuns + 1,
    unlockedEndings: isFirstEnding
      ? [...meta.unlockedEndings, ending.id]
      : meta.unlockedEndings,
    bestRealm:
      getRealmOrder(player.realm) > getRealmOrder(meta.bestRealm)
        ? player.realm
        : meta.bestRealm,
    bestTurn: Math.max(meta.bestTurn, turn),
    flagsEverTriggered: [
      ...new Set([
        ...meta.flagsEverTriggered,
        ...Object.entries(player.flags)
          .filter(([, v]) => v)
          .map(([k]) => k),
      ]),
    ],
    innateBodyUnlocked: meta.innateBodyUnlocked || meta.totalRuns + 1 >= 3,
    romanceBoost: meta.romanceBoost || ending.id === 'immortal_lovers',
    unlockedEvents:
      meta.unlockedEndings.length + (isFirstEnding ? 1 : 0) >= 5
        ? [...new Set([...meta.unlockedEvents, 'upper_realm_rumor'])]
        : meta.unlockedEvents,
    unlockedOrigins: meta.unlockedOrigins.includes(origin)
      ? meta.unlockedOrigins
      : [...meta.unlockedOrigins, origin],
  }
  saveMeta(next)
  return { meta: next, isFirstEnding }
}

export function unlockAchievements(meta: MetaProgress, ids: string[]): MetaProgress {
  const newOnes = ids.filter((id) => !meta.unlockedAchievements.includes(id))
  if (newOnes.length === 0) return meta
  const next = {
    ...meta,
    unlockedAchievements: [...meta.unlockedAchievements, ...newOnes],
  }
  saveMeta(next)
  return next
}

export function getEndingCodexProgress(meta: MetaProgress): { unlocked: number; total: number } {
  return { unlocked: meta.unlockedEndings.length, total: ENDINGS.length }
}
