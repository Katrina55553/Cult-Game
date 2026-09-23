import { CHAPTERS, getChapter } from '../data/chapters'
import { getEventTags } from '../data/eventTags'
import { getRealmOrder } from '../data/realms'
import {
  computeAffinity,
  globalAffinity,
  TAG_BIAS,
  type AffinityVector,
} from './affinity'
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

// ── 行为因子：根据玩家倾向连续调整事件权重 ──
// 分类信息来自事件自身（`event.tags` 或 data/eventTags.ts 的历史表），
// 这里不再出现任何具体事件 id。

function affinityMultiplier(
  event: GameEvent,
  affinity: AffinityVector,
  global: { insight: number; fortune: number },
): number {
  let mult = 1

  for (const tag of getEventTags(event)) {
    const bias = event.bias?.[tag] ?? TAG_BIAS[tag]
    mult *= 1 + (bias - 1) * affinity[tag]
  }

  // 悟性只在稀有事件上生效（保留旧语义），气运对所有事件生效
  if (event.rarity === 'rare' || event.rarity === 'legendary') {
    mult *= 1 + 0.2 * global.insight
  }
  mult *= 1 + 0.1 * global.fortune

  return mult
}

function effectiveWeight(
  event: GameEvent,
  history: string[],
  state: PlayerState,
  affinity: AffinityVector,
  global: { insight: number; fortune: number },
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

  // 行为因子：根据玩家倾向连续调整
  weight *= affinityMultiplier(event, affinity, global)

  // 仅作数值保护，不再用 0.3 这类「地板」——
  // 旧地板会把冷却衰减一并吃掉（基础权重 3 的事件设计上要衰减 20 倍，
  // 压到 0.15 后又被抬回 0.3，实际只衰减 10 倍）。
  return Math.max(weight, 1e-4)
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
    // 检查事件条件
    if (!checkConditions(state, e.conditions)) return false
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

// ── 全局池：章节制之前的老事件池 ──
// 章节制上线后，pickNextEvent 只从当前章节的 events/sideEvents 里取，
// 导致未被任何章节登记的事件永远不会出现。这里把它们收拢成「等待期」内容源。
const CHAPTER_REGISTERED_IDS = new Set<string>()
for (const chapter of Object.values(CHAPTERS)) {
  for (const id of chapter.events) CHAPTER_REGISTERED_IDS.add(id)
  for (const id of chapter.sideEvents ?? []) CHAPTER_REGISTERED_IDS.add(id)
}

/** 从「未被任何章节登记」的事件中按权重抽取，条件/冷却/互斥规则与主线一致 */
function pickGlobalPoolEvent(
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
      (e) => !isFillerEvent(e) && !CHAPTER_REGISTERED_IDS.has(e.id),
    )
    if (eligible.length > 0) return weightedPick(eligible, state, metaRomanceBoost)
  }

  return null
}

/**
 * 等待期事件：章节主线与支线都暂时抽不出来时，在「全局池」与「日常事件」之间二选一。
 * 五五开是刻意的——全给全局池会让 market_rest（唯一进入坊市的入口）和日常修炼
 * 事件几乎消失，全给日常则那批老事件继续永久失效。
 */
function pickWaitingEvent(
  state: PlayerState,
  events: GameEvent[],
  unlockedEvents: string[],
  metaRomanceBoost: boolean,
  excludeId?: string,
): GameEvent | null {
  const globalEvent = pickGlobalPoolEvent(state, events, unlockedEvents, metaRomanceBoost, excludeId)
  const filler = pickFillerEvent(state, events)
  if (!globalEvent) return filler
  if (!filler) return globalEvent
  return rng.random() < 0.5 ? filler : globalEvent
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
  // 整批共用一份倾向向量，避免每个事件重算一遍
  const affinity = computeAffinity(state)
  const global = globalAffinity(state)
  const weights = eligible.map((e) =>
    effectiveWeight(e, state.history, state, affinity, global, metaRomanceBoost),
  )
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
    //    这里是**加权抽取**而不是按书写顺序取第一个：支线本来就不承担推进职责，
    //    顺序无所谓，但用权重抽才能让倾向标签真正影响玩家体验到什么。
    //    （主线仍是队列——那条线的先后顺序是作者编排的，不能打乱。）
    const sideIds = chapter.sideEvents
    if (sideIds) {
      const sideEvents: GameEvent[] = []
      for (const eventId of sideIds) {
        if (eventId === excludeId) continue
        if (state.history.includes(eventId)) continue
        const evt = eventMap.get(eventId)
        if (!evt) continue
        if (!checkConditions(state, evt.conditions)) continue
        sideEvents.push(evt)
      }
      if (sideEvents.length > 0) return weightedPick(sideEvents, state, metaRomanceBoost)
    }

    // 3) 主线+支线暂时都抽不出时，用等待期事件（老全局池 + 日常）过渡
    return pickWaitingEvent(state, events, unlockedEvents, metaRomanceBoost, excludeId)
  }

  // 兜底：没有章节时使用原来的随机逻辑
  const mainEvent = pickMainEvent(state, events, unlockedEvents, metaRomanceBoost, excludeId)
  if (mainEvent) return mainEvent

  const filler = pickFillerEvent(state, events)
  return filler
}
