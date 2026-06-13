import { getRealmOrder } from '../data/realms'
import { checkConditions } from './conditions'
import * as rng from './rng'
import type { EventAct, GameEvent, PlayerState } from '../types/game'

function countInHistory(history: string[], eventId: string): number {
  return history.filter((id) => id === eventId).length
}

function turnsSinceLast(history: string[], eventId: string): number {
  const idx = history.lastIndexOf(eventId)
  if (idx === -1) return Infinity
  return history.length - 1 - idx
}

function storyGroupSeen(
  history: string[],
  event: GameEvent,
  events: GameEvent[],
): boolean {
  if (!event.storyGroup) return false
  const groupIds = events
    .filter((e) => e.storyGroup === event.storyGroup)
    .map((e) => e.id)
  return groupIds.some((id) => history.includes(id))
}

function getPlayerAct(state: PlayerState): EventAct {
  const order = getRealmOrder(state.realm)
  if (order >= getRealmOrder('golden_core')) return 'golden'
  if (order >= getRealmOrder('foundation')) return 'foundation'
  return 'qi'
}

const RARITY_MULT: Record<string, number> = {
  common: 1,
  rare: 0.6,
  legendary: 0.28,
}

function isRomanceEvent(event: GameEvent): boolean {
  const id = event.id
  return (
    id.includes('beauty') ||
    id.includes('dual') ||
    id.includes('companion') ||
    id.includes('lover') ||
    id.includes('jade_pool')
  )
}

function effectiveWeight(
  event: GameEvent,
  history: string[],
  state: PlayerState,
  metaRomanceBoost: boolean,
): number {
  let weight = event.weight

  const since = turnsSinceLast(history, event.id)
  if (since < 3) weight *= 0.15
  else if (since < 5) weight *= 0.4

  if (event.rarity) {
    weight *= RARITY_MULT[event.rarity] ?? 1
  }

  const romanceChain = !!(state.flags.met_su_qing || state.flags.has_companion)
  const romanceBoost = metaRomanceBoost || romanceChain
  if (romanceBoost && isRomanceEvent(event)) {
    weight *= metaRomanceBoost ? 2.2 : 2
  }

  if (state.flags.refused_all_sects && !state.flags.met_su_qing && event.id === 'beauty_rescue') {
    weight *= 3
  }
  if (state.flags.met_su_qing && !state.flags.has_companion && event.id === 'beauty_gratitude') {
    weight *= 2.5
  }
  if (state.flags.has_companion && !state.flags.dual_cultivation_mastered && event.id === 'dual_cultivation') {
    weight *= 2
  }
  if (
    state.flags.has_companion &&
    state.flags.dual_cultivation_mastered &&
    !state.flags.survived_together &&
    event.id === 'companion_tribulation'
  ) {
    weight *= 2
  }

  if (FILLER_EVENT_IDS.has(event.id)) {
    if (since < 6) weight *= 0.05
    else if (since < 10) weight *= 0.2
  } else if (event.rarity === 'rare' || event.rarity === 'legendary') {
    weight *= 1.25
  }

  return Math.max(weight, 0.3)
}

interface PickOptions {
  excludeId?: string
  skipCooldown?: boolean
  skipAct?: boolean
}

function filterEligible(
  state: PlayerState,
  events: GameEvent[],
  unlockedEvents: string[],
  options: PickOptions = {},
): GameEvent[] {
  const act = getPlayerAct(state)

  return events.filter((event) => {
    if (options.excludeId && event.id === options.excludeId) return false
    if (event.once && state.history.includes(event.id)) return false
    if (storyGroupSeen(state.history, event, events)) return false

    const times = countInHistory(state.history, event.id)
    if (event.maxTimes !== undefined && times >= event.maxTimes) return false

    if (!options.skipCooldown && event.cooldown !== undefined && times > 0) {
      const since = turnsSinceLast(state.history, event.id)
      if (since < event.cooldown) return false
    }

    if (event.minGap !== undefined && times > 0) {
      const since = turnsSinceLast(state.history, event.id)
      if (since < event.minGap) return false
    }

    if (!options.skipAct && event.act && event.act !== 'any' && event.act !== act) return false
    if (event.requiresUnlock && !unlockedEvents.includes(event.requiresUnlock)) return false

    return checkConditions(state, event.conditions)
  })
}

const FILLER_EVENT_IDS = new Set([
  'daily_cultivation',
  'daily_insight',
  'daily_sparring',
  'daily_scripture',
])

function isFillerEvent(event: GameEvent): boolean {
  return FILLER_EVENT_IDS.has(event.id)
}

function consecutiveFillers(history: string[]): number {
  let count = 0
  for (let i = history.length - 1; i >= 0; i--) {
    if (FILLER_EVENT_IDS.has(history[i])) count++
    else break
  }
  return count
}

function pickFillerEvent(state: PlayerState, events: GameEvent[]): GameEvent | null {
  const fillers = events.filter((e) => FILLER_EVENT_IDS.has(e.id))
  if (fillers.length === 0) return null

  const recent = new Set(state.history.slice(-6))
  const fresh = fillers.filter((e) => !recent.has(e.id))
  const pool = fresh.length > 0 ? fresh : fillers
  return weightedPick(pool, state, false)
}

function pickMainEvent(
  state: PlayerState,
  events: GameEvent[],
  unlockedEvents: string[],
  metaRomanceBoost: boolean,
  excludeId?: string,
): GameEvent | null {
  const tiers: PickOptions[] = [
    { excludeId },
    { excludeId, skipCooldown: true },
    { excludeId, skipCooldown: true, skipAct: true },
  ]

  for (const options of tiers) {
    const eligible = filterEligible(state, events, unlockedEvents, options).filter(
      (e) => !isFillerEvent(e),
    )
    if (eligible.length > 0) {
      return weightedPick(eligible, state, metaRomanceBoost)
    }
  }

  return null
}

function weightedPick(
  eligible: GameEvent[],
  state: PlayerState,
  metaRomanceBoost: boolean,
): GameEvent {
  const weights = eligible.map((e) => effectiveWeight(e, state.history, state, metaRomanceBoost))
  const totalWeight = weights.reduce((sum, w) => sum + w, 0)
  let roll = rng.random() * totalWeight

  for (let i = 0; i < eligible.length; i++) {
    roll -= weights[i]
    if (roll < 0) return eligible[i]
  }

  return eligible[eligible.length - 1]
}

export function pickNextEvent(
  state: PlayerState,
  events: GameEvent[],
  unlockedEvents: string[] = [],
  metaRomanceBoost = false,
  excludeId?: string,
): GameEvent | null {
  const mainEvent = pickMainEvent(state, events, unlockedEvents, metaRomanceBoost, excludeId)
  if (mainEvent) return mainEvent

  if (consecutiveFillers(state.history) >= 2) {
    const relaxed = filterEligible(state, events, unlockedEvents, {
      excludeId,
      skipCooldown: true,
      skipAct: true,
    }).filter((e) => !isFillerEvent(e))
    if (relaxed.length > 0) {
      return weightedPick(relaxed, state, metaRomanceBoost)
    }
  }

  const fillerEligible = filterEligible(state, events, unlockedEvents, { excludeId }).filter((e) =>
    isFillerEvent(e),
  )
  if (fillerEligible.length > 0) {
    return pickFillerEvent(state, fillerEligible) ?? weightedPick(fillerEligible, state, metaRomanceBoost)
  }

  return pickFillerEvent(
    state,
    filterEligible(state, events, unlockedEvents, {
      excludeId,
      skipCooldown: true,
      skipAct: true,
    }),
  )
}
