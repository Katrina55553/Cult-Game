import { REALMS, getRealmOrder } from '../data/realms'
import type { GameEvent, Milestone, PlayerState } from '../types/game'

export function detectMilestone(
  prev: PlayerState,
  next: PlayerState,
  narrative: string,
): Milestone | null {
  if (getRealmOrder(prev.realm) < getRealmOrder(next.realm)) {
    return {
      type: 'breakthrough',
      message: `突破成功！晋升 ${REALMS[next.realm].name}`,
    }
  }

  if (narrative.includes('突破') || narrative.includes('晋升')) {
    return { type: 'breakthrough', message: narrative }
  }

  const remaining = next.lifespan - next.age
  const prevRemaining = prev.lifespan - prev.age
  if (remaining <= 10 && prevRemaining > 10) {
    return { type: 'lifespan_low', message: '寿元将尽，须寻续命之法' }
  }

  if (prev.cultivation < 90 && next.cultivation >= 90) {
    return { type: 'cultivation_full', message: '修为圆满，突破在即' }
  }

  return null
}

export function detectEncounterMilestone(event: GameEvent | null): Milestone | null {
  if (!event) return null
  if (event.rarity === 'legendary') {
    return { type: 'rare_event', message: `传说奇遇：「${event.title}」` }
  }
  if (event.rarity === 'rare') {
    return { type: 'rare_event', message: `稀有奇遇：「${event.title}」` }
  }
  return null
}
