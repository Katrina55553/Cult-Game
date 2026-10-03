import { CHAPTERS, getChapter, getVisitedChapters } from '../data/chapters'
import { FILLER_EVENT_IDS } from '../data/eventCategories'
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

  if (getChapter(state.currentChapter)?.route === 'wander' && !state.flags.met_su_qing && event.id === 'beauty_rescue') {
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
}

export function isEventEligible(
  state: PlayerState,
  event: GameEvent,
  allEvents: GameEvent[],
  unlockedEvents: string[],
  options: PickOptions = {},
): boolean {
  if (options.excludeId && event.id === options.excludeId) return false
  if (isEventPermanentlyUnavailable(state, event, allEvents)) return false

  const times = countInHistory(state.history, event.id)
  if (event.cooldown !== undefined && times > 0) {
    const since = turnsSinceLast(state.history, event.id)
    if (since < event.cooldown) return false
  }

  if (event.minGap !== undefined && times > 0) {
    const since = turnsSinceLast(state.history, event.id)
    if (since < event.minGap) return false
  }

  const act = getPlayerAct(state)
  if (event.act && event.act !== 'any' && event.act !== act) return false
  if (event.requiresUnlock && !unlockedEvents.includes(event.requiresUnlock)) return false
  if (event.followUpOf && !event.followUpOf.some((id) => state.history.includes(id))) return false

  return checkConditions(state, event.conditions)
}

export function isEventPermanentlyUnavailable(
  state: PlayerState,
  event: GameEvent,
  allEvents: GameEvent[],
): boolean {
  const times = countInHistory(state.history, event.id)
  if (event.once && times > 0) return true
  if (event.maxTimes !== undefined && times >= event.maxTimes) return true
  return storyGroupSeen(state.history, event, allEvents)
}

function filterEligible(
  state: PlayerState,
  candidates: GameEvent[],
  allEvents: GameEvent[],
  unlockedEvents: string[],
  options: PickOptions = {},
): GameEvent[] {
  return candidates.filter((event) =>
    isEventEligible(state, event, allEvents, unlockedEvents, options),
  )
}

function isFillerEvent(event: GameEvent): boolean {
  return FILLER_EVENT_IDS.has(event.id)
}

function pickFillerEvent(
  state: PlayerState,
  events: GameEvent[],
  unlockedEvents: string[],
  excludeId?: string,
): GameEvent | null {
  const fillers = filterEligible(state, events, events, unlockedEvents, { excludeId }).filter(isFillerEvent)
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
// 主线与已开放章节的支线之外，
// 导致未被任何章节登记的事件永远不会出现。这里把它们收拢成「等待期」内容源。
const CHAPTER_REGISTERED_IDS = new Set<string>()
for (const chapter of Object.values(CHAPTERS)) {
  for (const id of chapter.events) CHAPTER_REGISTERED_IDS.add(id)
  for (const id of chapter.triggeredEvents ?? []) CHAPTER_REGISTERED_IDS.add(id)
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
  const eligible = filterEligible(state, events, events, unlockedEvents, { excludeId }).filter(
    (event) => !isFillerEvent(event) && !CHAPTER_REGISTERED_IDS.has(event.id),
  )
  return eligible.length > 0 ? weightedPick(eligible, state, metaRomanceBoost) : null
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
  const filler = pickFillerEvent(state, events, unlockedEvents, excludeId)
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
  const eligible = filterEligible(state, events, events, unlockedEvents, { excludeId }).filter(
    (event) => !isFillerEvent(event),
  )
  return eligible.length > 0 ? weightedPick(eligible, state, metaRomanceBoost) : null
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
  const consequences = filterEligible(state, events.filter((event) => event.priority === 'consequence'), events, unlockedEvents, { excludeId })
  if (consequences.length > 0) return consequences[0]

  // 章节制：优先从当前章节中选取事件
  const chapter = getChapter(state.currentChapter)
  if (chapter) {
    const eventMap = new Map(events.map((e) => [e.id, e]))

    // 1) 条件触发事件（优先响应早先选择造成的后果）
    for (const eventId of chapter.triggeredEvents ?? []) {
      const evt = eventMap.get(eventId)
      if (!evt) continue
      if (!isEventEligible(state, evt, events, unlockedEvents, { excludeId })) continue
      return evt
    }

    const sideIds = new Set(getVisitedChapters(state).flatMap((entry) => entry.sideEvents ?? []))
    const sideEvents = filterEligible(state, events.filter((event) =>
      sideIds.has(event.id) && !chapter.events.includes(event.id),
    ), events, unlockedEvents, { excludeId })
    const pickSide = () => {
      const followUps = sideEvents.filter((event) => event.followUpOf)
      return weightedPick(followUps.length > 0 ? followUps : sideEvents, state, metaRomanceBoost)
    }
    const lastEventId = state.history[state.history.length - 1]
    const afterMain = Object.values(CHAPTERS).some((entry) => entry.events.includes(lastEventId))
    if (afterMain && sideEvents.length > 0) return pickSide()

    // 2) 主线事件（必须完成才能推进章节）
    const pending = chapter.events.filter((id) => !state.chapterCompleted.includes(id))
    for (const eventId of pending) {
      const evt = eventMap.get(eventId)
      if (!evt) continue
      if (!isEventEligible(state, evt, events, unlockedEvents, { excludeId })) continue
      return evt
    }

    if (sideEvents.length > 0) return pickSide()

    // 4) 主线+支线暂时都抽不出时，用等待期事件（老全局池 + 日常）过渡
    return pickWaitingEvent(state, events, unlockedEvents, metaRomanceBoost, excludeId)
  }

  // 兜底：没有章节时使用原来的随机逻辑
  const mainEvent = pickMainEvent(state, events, unlockedEvents, metaRomanceBoost, excludeId)
  if (mainEvent) return mainEvent

  const filler = pickFillerEvent(state, events, unlockedEvents, excludeId)
  return filler
}
