import { getChapter } from '../data/chapters'
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

// ── 行为因子：根据玩家过往选择动态调整事件权重 ──

const GOOD_EVENT_IDS = new Set([
  'wander_refugee', 'wander_medical', 'mountain_spirit', 'demon_invasion',
  'mortal_plight', 'spirit_stone_origin', 'righteous_dark_side',
])

const DARK_EVENT_IDS = new Set([
  'demon_whisper', 'demon_temptation', 'blood_sacrifice', 'demon_lord_offer',
  'inner_demon', 'blood_moon', 'soul_possession', 'soul_demand',
  'demon_nest', 'explore_demon_mountain',
])

const COMBAT_EVENT_IDS = new Set([
  'beast_attack', 'boss_wolf_king', 'boss_shadow_assassin', 'boss_demon_general',
  'boss_ancient_golem', 'boss_thunder_beast', 'first_duel', 'sect_tournament',
  'rival_provocation', 'rival_ambush', 'ancient_battlefield',
])

const ALCHEMY_EVENT_IDS = new Set([
  'alchemy_workshop', 'alchemy_master', 'alchemy_competition', 'alchemy_mystery',
  'rare_ingredient', 'pill_recipe', 'find_healing_pill',
])

const FORMATION_EVENT_IDS = new Set([
  'formation_study', 'ancient_formation_battle', 'ancient_formation',
  'realm_formation', 'explore_ancient_tomb',
])

const SWORD_EVENT_IDS = new Set([
  'sword_enlightenment', 'sword_trial', 'sword_tomb',
])

const BEAST_EVENT_IDS = new Set([
  'spirit_beast_train', 'spirit_crane', 'spirit_turtle', 'fire_tiger',
  'thunder_falcon_nest', 'ice_phoenix',
])

function getBehaviorMultiplier(event: GameEvent, state: PlayerState): number {
  let mult = 1
  const { stats, cultivationSystems: sys } = state

  // 善行倾向 → 正义/救助事件权重提升
  if (stats.karma >= 15 && GOOD_EVENT_IDS.has(event.id)) mult *= 1.5
  if (stats.karma >= 30 && GOOD_EVENT_IDS.has(event.id)) mult *= 1.3

  // 心魔倾向 → 魔道/黑暗事件权重提升
  if (stats.demonHeart >= 40 && DARK_EVENT_IDS.has(event.id)) mult *= 1.6
  if (stats.demonHeart >= 60 && DARK_EVENT_IDS.has(event.id)) mult *= 1.4

  // 战斗倾向（根骨高）→ 战斗事件权重提升
  if (stats.rootBone >= 35 && COMBAT_EVENT_IDS.has(event.id)) mult *= 1.4

  // 丹道倾向 → 丹道事件权重提升
  if (sys.alchemyTier >= 1 && ALCHEMY_EVENT_IDS.has(event.id)) mult *= 1.5

  // 阵法倾向 → 阵法事件权重提升
  if (sys.formationTier >= 1 && FORMATION_EVENT_IDS.has(event.id)) mult *= 1.5

  // 剑道倾向 → 剑道事件权重提升
  if (sys.swordTier >= 1 && SWORD_EVENT_IDS.has(event.id)) mult *= 1.5

  // 灵兽倾向 → 灵兽事件权重提升
  if (sys.spiritBeast && BEAST_EVENT_IDS.has(event.id)) mult *= 1.4

  // 悟性高 → 稀有事件权重微增
  if (stats.comprehension >= 50 && (event.rarity === 'rare' || event.rarity === 'legendary')) {
    mult *= 1.2
  }

  // 气运高 → 所有事件权重微增
  if (stats.luck >= 40) mult *= 1.1

  return mult
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
    const divineSenseBonus = 1 + state.cultivationSystems.divineSense / 400
    weight *= divineSenseBonus
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

  // 行为因子：根据玩家属性/修炼方向动态调整
  weight *= getBehaviorMultiplier(event, state)

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
  'market_rest',
  'roadside_duel',
  'explore_spirit_mountain',
  'spirit_spring',
])

function isFillerEvent(event: GameEvent): boolean {
  return FILLER_EVENT_IDS.has(event.id)
}

function pickFillerEvent(state: PlayerState, events: GameEvent[]): GameEvent | null {
  const fillers = events.filter((e) => {
    if (!FILLER_EVENT_IDS.has(e.id)) return false
    // 尊重 maxTimes 限制
    const times = countInHistory(state.history, e.id)
    if (e.maxTimes !== undefined && times >= e.maxTimes) return false
    // 尊重 cooldown
    if (e.cooldown !== undefined && times > 0) {
      const since = turnsSinceLast(state.history, e.id)
      if (since < e.cooldown) return false
    }
    return true
  })
  if (fillers.length === 0) return null

  // 排除上一个事件，避免连续重复
  const lastEvent = state.history[state.history.length - 1]
  const notLast = fillers.filter((e) => e.id !== lastEvent)
  const pool1 = notLast.length > 0 ? notLast : fillers

  // 优先选最近 6 回合内没出现过的
  const recent = new Set(state.history.slice(-6))
  const fresh = pool1.filter((e) => !recent.has(e.id))
  const pool = fresh.length > 0 ? fresh : pool1
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
  // 章节制：优先从当前章节中选取事件
  const chapter = getChapter(state.currentChapter)
  if (chapter) {
    const eventMap = new Map(events.map((e) => [e.id, e]))

    // 1) 主线事件（必须完成才能推进章节）
    const pending = chapter.events.filter((id) => !state.chapterCompleted.includes(id))
    for (const eventId of pending) {
      if (eventId === excludeId) continue
      const evt = eventMap.get(eventId)
      if (!evt) continue
      if (evt.once && state.history.includes(eventId)) continue
      if (!checkConditions(state, evt.conditions)) continue
      return evt
    }

    // 2) 支线事件（可选，不影响章节推进）
    if (chapter.sideEvents) {
      for (const eventId of chapter.sideEvents) {
        if (eventId === excludeId) continue
        if (state.history.includes(eventId)) continue
        const evt = eventMap.get(eventId)
        if (!evt) continue
        if (!checkConditions(state, evt.conditions)) continue
        return evt
      }
    }

    // 3) 主线+支线都不满足时，插入 filler 等待
    const filler = pickFillerEvent(state, events)
    if (filler) return filler
    return null
  }

  // 兜底：没有章节时使用原来的随机逻辑
  const mainEvent = pickMainEvent(state, events, unlockedEvents, metaRomanceBoost, excludeId)
  if (mainEvent) return mainEvent

  const filler = pickFillerEvent(state, events)
  return filler
}
