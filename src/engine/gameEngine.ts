import { CHAPTERS, getChapter } from '../data/chapters'
import { createDefaultCultivationSystems } from '../data/cultivationSystems'
import { ACHIEVEMENTS } from '../data/achievements'
import { ENDINGS } from '../data/endings'
import { EVENTS } from '../data/events'
import { REALMS } from '../data/realms'
import { formatShopEffectNote, SHOP_ITEMS } from '../data/shop'
import { SPIRIT_ROOTS } from '../data/spiritRoots'
import { checkAchievements } from './achievements'
import { checkConditions } from './conditions'
import { applyEffects } from './effects'
import { pickNextEvent } from './eventPicker'
import { getEndingReason, type EndingTrigger } from './endingReason'
import { migrateSave, SAVE_VERSION } from './migrate'
import { detectEncounterMilestone, detectMilestone } from './milestone'
import {
  appendEffectSummary,
  augmentNarrativeWithBreakthrough,
  resolveChoiceNarrative,
} from './narrative'
import { loadMeta, recordEndingRun, unlockAchievements } from './metaProgress'
import * as rng from './rng'
import type {
  Choice,
  Ending,
  GameEvent,
  GameSession,
  NewGameOptions,
  Outcome,
  PlayerState,
  SpiritRoot,
} from '../types/game'

function randBetween([min, max]: [number, number]): number {
  return rng.randInt(min, max)
}

function applyAchievementRewards(player: PlayerState, meta: { unlockedAchievements: string[] }): void {
  for (const id of meta.unlockedAchievements) {
    const achievement = ACHIEVEMENTS.find((a) => a.id === id)
    if (!achievement?.reward) continue
    const { type, key, value } = achievement.reward
    switch (type) {
      case 'stat':
        if (key) player.stats[key] += value
        break
      case 'spiritStones':
        player.spiritStones = Math.max(0, player.spiritStones + value)
        break
      case 'lifespan':
        player.lifespan += value
        break
      case 'cultivation':
        player.cultivation = Math.max(0, Math.min(100, player.cultivation + value))
        break
    }
  }
}

export function rollSpiritRoot(origin?: NewGameOptions['origin']): SpiritRoot {
  const originMult: Record<string, number> = {
    demon_blood: 1.4,
    noble_exile: 1.35,
    hermit: 1.3,
    scholar: 1.15,
    sect_orphan: 1.1,
    healer: 1.1,
    merchant: 1.0,
    tomb_raider: 1.0,
    farmer: 1.0,
  }
  const mult = origin ? (originMult[origin] ?? 1) : 1

  const weights = SPIRIT_ROOTS.map((r, i) => {
    const base = r.weight
    if (mult === 1) return base
    const bonus = mult - 1
    const quality = 1 - i / (SPIRIT_ROOTS.length - 1)
    return base * (1 + bonus * quality)
  })
  const totalWeight = weights.reduce((sum, w) => sum + w, 0)
  let roll = rng.random() * totalWeight
  for (let i = 0; i < SPIRIT_ROOTS.length; i++) {
    roll -= weights[i]
    if (roll < 0) return SPIRIT_ROOTS[i]
  }
  return SPIRIT_ROOTS[0]
}

export function createPlayer(
  name: string,
  root: SpiritRoot,
  options: { useInnateBody?: boolean; origin?: NewGameOptions['origin'] } = {},
  meta: { unlockedAchievements: string[] } = { unlockedAchievements: [] },
): PlayerState {
  const player: PlayerState = {
    name,
    spiritRoot: root.name,
    origin: options.origin ?? null,
    realm: 'mortal',
    age: 16,
    lifespan: randBetween(root.lifespan) + Math.floor(randBetween(root.stats.rootBone) * 0.2),
    cultivation: 0,
    stats: {
      rootBone: randBetween(root.stats.rootBone),
      comprehension: randBetween(root.stats.comprehension),
      luck: randBetween(root.stats.luck),
      karma: 0,
      demonHeart: 0,
    },
    spiritStones: 10,
    artifacts: [],
    inventory: [],
    bagCapacity: 5,
    bagTier: 0,
    cultivationSystems: createDefaultCultivationSystems(
      options.origin === 'demon_blood' ? '魔裔血脉' : null,
    ),
    flags: {},
    history: [],
    log: [`${16}岁：踏入修仙之路，测得${root.name}。`],
    shopBuffs: { purchases: 0 },
    spiritBeastsSeen: [],
    currentChapter: 'sect_1',
    chapterCompleted: [],
  }

  if (options.useInnateBody) {
    player.stats.rootBone += 5
    player.stats.comprehension += 5
    player.lifespan += 10
    player.log.push('16岁：先天道体觉醒，天资略增。')
  }

  switch (options.origin) {
    case 'farmer':
      player.stats.karma += 8
      player.log.push('16岁：田园牧歌出身，心性质朴，因果深厚。')
      break
    case 'noble_exile':
      player.stats.comprehension += 6
      player.spiritStones += 30
      player.log.push('16岁：世家遗孤，携先辈遗资踏入仙途。')
      break
    case 'demon_blood':
      player.stats.rootBone += 6
      player.stats.demonHeart += 12
      player.cultivationSystems.bloodline = '魔裔血脉'
      player.flags.has_mysterious_origin = true
      player.log.push('16岁：魔裔宿命觉醒，体内暗流涌动。')
      break
    case 'scholar':
      player.stats.comprehension += 10
      player.log.push('16岁：书香门第出身，自幼饱读经卷，悟性超群。')
      break
    case 'merchant':
      player.spiritStones += 50
      player.log.push('16岁：商贾世家，家资丰厚，携重金入道。')
      break
    case 'hermit':
      player.lifespan += 15
      player.stats.karma += 5
      player.flags.has_mysterious_origin = true
      player.log.push('16岁：隐世遗脉，先祖遗泽护体，寿元悠长。')
      break
    case 'sect_orphan':
      player.stats.rootBone += 3
      player.stats.comprehension += 3
      player.stats.luck += 3
      player.log.push('16岁：宗门弃婴长大，根基尚可，福缘不浅。')
      break
    case 'tomb_raider':
      player.stats.luck += 8
      player.spiritStones += 15
      player.stats.demonHeart += 5
      player.log.push('16岁：墓中求生，练就一身机敏，却也沾染几分戾气。')
      break
    case 'healer':
      player.stats.karma += 12
      player.stats.comprehension += 3
      player.log.push('16岁：悬壶济世，积善成德，因果深厚。')
      break
  }

  applyAchievementRewards(player, meta)
  return player
}

export function createNewGame(options: NewGameOptions): GameSession {
  const meta = loadMeta()
  if (options.dailyMode) {
    rng.setSeed(rng.getDailySeed())
  } else if (options.seed !== undefined) {
    // 自动化试玩/回归脚本需要可复现：不认这个种子的话，脚本自己 setSeed 也会被这里覆盖，
    // 每次跑出来的结局都不一样，对比就失去意义。
    rng.setSeed(options.seed)
  } else {
    rng.setSeed(Date.now())
  }

  const root = rollSpiritRoot(options.origin)
  const player = createPlayer(options.name.trim() || '无名修士', root, {
    useInnateBody: options.useInnateBody && meta.innateBodyUnlocked,
    origin: options.origin ?? null,
  }, meta)
  const startEvent = EVENTS.find((e) => e.id === 'enter_sect') ?? null

  return {
    phase: 'lore',
    player,
    currentEvent: startEvent,
    ending: null,
    turn: 0,
    revealedRoot: root,
    lastMilestone: null,
    dailySeed: options.dailyMode ? rng.getDailySeed() : null,
    useInnateBody: !!(options.useInnateBody && meta.innateBodyUnlocked),
    newEndingUnlock: false,
    newAchievements: [],
    version: SAVE_VERSION,
  }
}

export function beginPlaying(session: GameSession): GameSession {
  const meta = loadMeta()
  const event =
    session.currentEvent ??
    pickNextEvent(session.player, EVENTS, meta.unlockedEvents, meta.romanceBoost)

  // 第一章 intro
  let player = session.player
  const chapter = getChapter(player.currentChapter)
  if (chapter?.intro && !player.log.some((l) => l === chapter.intro)) {
    player = { ...player, log: [...player.log, `— ${chapter.name} —`, chapter.intro] }
  }

  return {
    ...session,
    player,
    phase: 'playing',
    currentEvent: event,
    turn: 1,
    lastMilestone: detectEncounterMilestone(event),
  }
}

const SORTED_ENDINGS = [...ENDINGS].sort((a, b) => b.priority - a.priority)

/**
 * 结局判定：按 priority 取首个命中的结局。
 *
 * 只有 `kind: 'terminal'`（玩家显式终局：飞升 / 双修飞升 / 放弃修行 / 轮回 / 称霸，
 * 以及死亡：天劫身死 / 堕魔 / 寿尽）随时参与判定；其余成就、关系、传承、专精类结局
 * 只在 `includeMilestones` 为真时参与，即**路线走完**（`isRouteExhausted`）或**再无事件可抽**。
 *
 * 这样「结束」是被动结算的结果，而不是主动打断的动作。旧实现是所有结局每回合都参与，
 * 于是「阵法 ≥2 阶 + 筑基」这类浅条件会在约第五章掐断整局，元婴/化神与全部飞升线都看不到。
 * 哪些结局属于终局类由数据声明（`endings.ts` 的 `kind`），引擎不维护 id 白名单。
 */
export function checkEnding(
  state: PlayerState,
  options: { includeMilestones?: boolean } = {},
): Ending | null {
  for (const ending of SORTED_ENDINGS) {
    if (!options.includeMilestones && ending.kind !== 'terminal') continue
    if (checkConditions(state, ending.conditions)) return ending
  }
  return null
}

/** 当前路线是否已走到尽头（本章主线全清，且没有下一章） */
function isRouteExhausted(player: PlayerState): boolean {
  const chapter = getChapter(player.currentChapter)
  if (!chapter) return true
  if (!chapter.events.every((id) => player.chapterCompleted.includes(id))) return false
  return !chapter.nextChapter && !chapter.branchNext
}

function getTalentBonus(state: PlayerState, eventId: string): number {
  let bonus = 0
  if (state.flags.talent_sword_heart && eventId.includes('sword')) bonus += 0.15
  if (state.flags.talent_alchemy_nose && (eventId.includes('alchemy') || eventId.includes('pill'))) bonus += 0.15
  if (state.flags.talent_formation_eye && eventId.includes('formation')) bonus += 0.15
  if (state.flags.talent_beast_whisper && eventId.includes('beast')) bonus += 0.15
  if (state.flags.talent_quick_reflexes && eventId.includes('duel')) bonus += 0.10
  if (state.flags.talent_treasure_sense && eventId.includes('dungeon')) bonus += 0.10
  if (state.flags.talent_fate_weaver) bonus += 0.05
  return bonus
}

function getRootBoneBonus(state: PlayerState, eventId: string): number {
  const isCombat = eventId.includes('boss') || eventId.includes('duel') || eventId.includes('fight')
    || eventId.includes('battle') || eventId.includes('wolf') || eventId.includes('assassin')
    || eventId.includes('golem') || eventId.includes('thunder') || eventId.includes('lord')
  if (!isCombat) return 0
  return Math.min(0.15, state.stats.rootBone / 500)
}

function getDivineSenseBonus(state: PlayerState): number {
  return Math.min(0.10, state.cultivationSystems.divineSense / 500)
}

function resolveOutcome(
  state: PlayerState,
  outcome: Outcome,
  eventId: string,
): { state: PlayerState; narrative: string; success: boolean } {
  let chance = outcome.chance
  if (outcome.luckBonus) {
    chance += state.stats.luck * outcome.luckBonus
  }
  chance += getTalentBonus(state, eventId)
  chance += getRootBoneBonus(state, eventId)
  chance += getDivineSenseBonus(state)
  chance = Math.max(0.05, Math.min(0.95, chance))

  const success = rng.random() < chance
  const effects = success ? outcome.successEffects : outcome.failEffects
  const baseNarrative = success ? outcome.narrative.success : outcome.narrative.fail
  const narrative = appendEffectSummary(baseNarrative, effects)
  const newState = applyEffects(state, effects)

  return { state: newState, narrative, success }
}

function findChoice(event: GameEvent, choiceId: string): Choice | undefined {
  return event.choices.find((c) => c.id === choiceId)
}

function shouldOpenShop(_session: GameSession, eventId: string, choiceId: string): boolean {
  return eventId === 'market_rest' && choiceId === 'browse'
}

function applyEventTimeAndLog(
  session: GameSession,
  player: PlayerState,
  narrative: string,
): PlayerState {
  const prevPlayer = session.player
  const event = session.currentEvent!

  const years = event.years ?? 1
  let next = { ...player, age: player.age + years }

  const logNarrative = augmentNarrativeWithBreakthrough(narrative, prevPlayer, next)
  const ageLog = `${next.age}岁：${logNarrative}`
  next = { ...next, log: [...next.log, ageLog] }
  next = { ...next, history: [...next.history, event.id], nextEventHint: undefined }

  return next
}

const EVENT_BY_ID = new Map(EVENTS.map((event) => [event.id, event]))

function isOnceEvent(eventId: string): boolean {
  return EVENT_BY_ID.get(eventId)?.once === true
}

/**
 * 把本章主线里「只出现一次、且早已在 history 中」的事件补记为已完成。
 *
 * 为什么必须补：跨路线切换会清空 `chapterCompleted`，而 `pickNextEvent` 对 `once`
 * 事件一旦出现在 history 中就直接跳过。于是「同一事件既是 A 章主线、又被 B 章当主线
 * 或支线登记」时，B 章既抽不到它、也不会把它计为完成 —— 该章永久无法完成，
 * 整局再也推不到下一章，只能等寿尽收尾。
 * 已确认的死锁路径：宗门第四章叛逃 → 散修第一章（beast_attack）；
 * 魔道第一章 → 宗门第八章（demon_temptation）；散修第三章 → 宗门第五章
 * （ancient_legacy / secret_realm 若已作支线消耗）。详见 scripts/validate-game-data.ts。
 */
function reconcileChapterProgress(player: PlayerState): PlayerState {
  const chapter = getChapter(player.currentChapter)
  if (!chapter) return player

  const completed = [...player.chapterCompleted]
  for (const eventId of chapter.events) {
    if (completed.includes(eventId)) continue
    if (isOnceEvent(eventId) && player.history.includes(eventId)) completed.push(eventId)
  }

  if (completed.length === player.chapterCompleted.length) return player
  return { ...player, chapterCompleted: completed }
}

/**
 * 进入指定章节：重置本章进度、写入章节过渡文字、同步路线立场 flag，
 * 并补记「早已消耗过的一次性主线」（见 reconcileChapterProgress）。
 */
function enterChapter(player: PlayerState, nextChapterId: string): PlayerState {
  const nextChapter = CHAPTERS[nextChapterId]
  if (!nextChapter) return player

  let next: PlayerState = { ...player, currentChapter: nextChapterId, chapterCompleted: [] }
  next = { ...next, log: [...next.log, `— ${nextChapter.name} —`] }
  if (nextChapter.intro) {
    next = { ...next, log: [...next.log, nextChapter.intro] }
  }

  if (nextChapter.route === 'sect' && !next.flags.loyal_to_sect) {
    next = { ...next, flags: { ...next.flags, loyal_to_sect: true, refused_all_sects: false, route_switched: true } }
    next.log.push('你决定加入宗门，踏上新的道路。')
  }
  if (nextChapter.route === 'wander' && !next.flags.refused_all_sects) {
    next = { ...next, flags: { ...next.flags, refused_all_sects: true, loyal_to_sect: false } }
    next.log.push('你离开宗门，独行于天地之间。')
  }
  if (nextChapter.route === 'demon' && !next.flags.accepted_demon_path) {
    next = { ...next, flags: { ...next.flags, accepted_demon_path: true } }
    next.log.push('你踏入魔道，再无回头之路。')
  }

  return reconcileChapterProgress(next)
}

/**
 * 本章主线全部完成时推进到下一章。
 * 新章若因为「一次性主线早已消耗」而立刻满足推进条件，就继续级联推进；
 * depth 只是防御性上限，正常数据下不会触到。
 */
function tryAdvanceChapter(player: PlayerState, depth = 0): PlayerState {
  const chapter = getChapter(player.currentChapter)
  if (!chapter) return player
  if (!chapter.events.every((eventId) => player.chapterCompleted.includes(eventId))) return player

  const nextChapterId = chapter.branchNext ? chapter.branchNext(player) : chapter.nextChapter
  if (!nextChapterId || !CHAPTERS[nextChapterId]) return player

  const entered = enterChapter(player, nextChapterId)
  if (depth >= 16) return entered
  return tryAdvanceChapter(entered, depth + 1)
}

function switchRouteIfNeeded(player: PlayerState): PlayerState {
  const chapter = getChapter(player.currentChapter)

  // 「拒绝所有宗门」与「接受魔道」可以同时为真（散修途中接下魔道邀约）。
  // 两条分支若各自只看自己的 flag，就会互相把对方拉回去：
  //   wander → demon → wander → …
  // 而且每次跳转都会清空 `chapterCompleted`，于是章节**永远无法完成**，
  // 同一批事件被反复抽出（实测表现为单个事件在一局里出现 21 次）。
  // 因此切换时必须**清掉竞争路线的 flag**，让状态收敛。
  // 魔道优先：接下魔道邀约是更晚、更强的承诺，应覆盖此前的散修立场。
  if (player.flags.accepted_demon_path && chapter?.route !== 'demon') {
    return enterChapter(
      { ...player, flags: { ...player.flags, refused_all_sects: false, loyal_to_sect: false } },
      'demon_1',
    )
  }
  if (player.flags.refused_all_sects && chapter?.route !== 'wander') {
    return enterChapter(
      { ...player, flags: { ...player.flags, accepted_demon_path: false, loyal_to_sect: false } },
      'wander_1',
    )
  }
  return player
}

function advanceChapter(player: PlayerState, eventId: string): PlayerState {
  const chapter = getChapter(player.currentChapter)
  if (!chapter || !chapter.events.includes(eventId)) return player

  const completed = player.chapterCompleted.includes(eventId)
    ? player.chapterCompleted
    : [...player.chapterCompleted, eventId]
  return tryAdvanceChapter({ ...player, chapterCompleted: completed })
}

function buildLifespanEnding(session: GameSession, player: PlayerState): GameSession {
  const naturalEnding = ENDINGS.find((e) => e.id === 'natural_death')
    ?? { id: 'natural_death', title: '寿终正寝', description: '寿元耗尽，魂归天地。', priority: 0, conditions: [] }
  return buildEndingSession(
    session,
    { ...player, log: [...player.log, `${player.age}岁：寿元耗尽，魂归天地。`] },
    naturalEnding,
    'lifespan',
  )
}

function finalizeAfterChoice(
  session: GameSession,
  player: PlayerState,
  narrative: string,
  openShop: boolean,
): GameSession {
  const prevPlayer = session.player
  const event = session.currentEvent!

  player = applyEventTimeAndLog(session, player, narrative)
  player = switchRouteIfNeeded(player)
  player = advanceChapter(player, event.id)

  const ending = checkEnding(player, { includeMilestones: isRouteExhausted(player) })
  if (ending) {
    return buildEndingSession(session, player, ending, 'condition')
  }

  if (player.age >= player.lifespan) {
    return buildLifespanEnding(session, player)
  }

  const actionMilestone = detectMilestone(prevPlayer, player, narrative)

  if (openShop) {
    return applyMidRunAchievements({
      ...session,
      player,
      phase: 'shop',
      currentEvent: null,
      turn: session.turn + 1,
      lastMilestone: actionMilestone,
    })
  }

  const meta = loadMeta()
  const nextEvent = pickNextEvent(
    player,
    EVENTS,
    meta.unlockedEvents,
    meta.romanceBoost,
    event.id,
  )
  if (!nextEvent) {
    const { ending, trigger } = resolveNoEventEnding(player)
    return buildEndingSession(session, player, ending, trigger)
  }

  const milestone = actionMilestone ?? detectEncounterMilestone(nextEvent)

  return applyMidRunAchievements({
    ...session,
    player,
    currentEvent: nextEvent,
    turn: session.turn + 1,
    lastMilestone: milestone,
    phase: 'playing',
  })
}

function resolveNoEventEnding(player: PlayerState): {
  ending: Ending
  trigger: EndingTrigger
} {
  const matched = checkEnding(player, { includeMilestones: true })
  if (matched) {
    return { ending: matched, trigger: 'condition' }
  }
  return {
    ending: ENDINGS.find((e) => e.id === 'path_exhausted')
      ?? { id: 'path_exhausted', title: '仙途终焉', description: '所有机缘已尽，修仙之路到此为止。', priority: 0, conditions: [] },
    trigger: 'no_events',
  }
}

function applyMidRunAchievements(session: GameSession): GameSession {
  const meta = loadMeta()
  const ach = checkAchievements(session, meta)
  if (ach.length === 0) return session
  unlockAchievements(meta, ach)
  const merged = [...new Set([...session.newAchievements, ...ach])]
  return { ...session, newAchievements: merged }
}

function buildEndingSession(
  session: GameSession,
  player: PlayerState,
  ending: Ending,
  trigger: EndingTrigger,
): GameSession {
  let meta = loadMeta()
  const { meta: updatedMeta, isFirstEnding } = recordEndingRun(meta, ending, player, session.turn)
  meta = updatedMeta

  const ach = checkAchievements(
    { ...session, player, ending, phase: 'ending' },
    meta,
    ending,
  )
  unlockAchievements(meta, ach)

  return {
    ...session,
    player,
    currentEvent: null,
    ending,
    endingReason: getEndingReason(ending, trigger),
    phase: 'ending',
    turn: session.turn + 1,
    lastMilestone: null,
    newEndingUnlock: isFirstEnding,
    newAchievements: ach,
  }
}

export function resolveChoice(session: GameSession, choiceId: string): GameSession {
  if (!session.currentEvent || session.phase !== 'playing') return session

  const choice = findChoice(session.currentEvent, choiceId)
  if (!choice) return session
  if (!checkConditions(session.player, choice.requirements)) return session

  let player = { ...session.player }
  let narrative = ''

  if (choice.outcomes && choice.outcomes.length > 0) {
    const result = resolveOutcome(player, choice.outcomes[0], session.currentEvent.id)
    player = result.state
    narrative = result.narrative
  } else if (choice.effects) {
    player = applyEffects(player, choice.effects)
    narrative = resolveChoiceNarrative(choice)
  }

  const openShop = shouldOpenShop(session, session.currentEvent.id, choiceId)
  return finalizeAfterChoice(session, player, narrative, openShop)
}

export function purchaseShopItem(session: GameSession, itemId: string): GameSession {
  if (session.phase !== 'shop') return session

  const item = SHOP_ITEMS.find((i) => i.id === itemId)
  if (!item || session.player.spiritStones < item.cost) return session

  let player = applyEffects(session.player, item.effect)
  player = {
    ...player,
    spiritStones: player.spiritStones - item.cost,
    shopBuffs: {
      ...player.shopBuffs,
      purchases: (player.shopBuffs.purchases ?? 0) + 1,
    },
    log: [
      ...player.log,
      `${player.age}岁：于坊市购得${item.name}，即刻生效：${formatShopEffectNote(item.effect)}。`,
    ],
  }

  const meta = loadMeta()
  const ach = checkAchievements({ ...session, player }, meta)
  unlockAchievements(meta, ach)

  return { ...session, player, newAchievements: [...session.newAchievements, ...ach] }
}

export function leaveShop(session: GameSession): GameSession {
  if (session.phase !== 'shop') return session

  const meta = loadMeta()
  const lastEventId = session.player.history[session.player.history.length - 1]
  const nextEvent = pickNextEvent(
    session.player,
    EVENTS,
    meta.unlockedEvents,
    meta.romanceBoost,
    lastEventId,
  )
  if (!nextEvent) {
    const { ending, trigger } = resolveNoEventEnding(session.player)
    return buildEndingSession(session, session.player, ending, trigger)
  }

  return {
    ...session,
    phase: 'playing',
    currentEvent: nextEvent,
    lastMilestone: detectEncounterMilestone(nextEvent),
  }
}

export function getRealmName(realm: PlayerState['realm']): string {
  return REALMS[realm].name
}

const SAVE_KEY = 'cultgame_save'

export function saveGame(session: GameSession): void {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(session))
  } catch {
    // ignore
  }
}

export function loadGame(): GameSession | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return null
    const session = migrateSave(JSON.parse(raw))
    if (!session) return null

    // 修复历史存档：旧版本跨路线切换后可能卡在「主线事件早已消耗」的章节里，
    // 补记一次性主线让这些存档能继续推进（详见 reconcileChapterProgress）。
    const repaired = reconcileChapterProgress(session.player)
    if (repaired === session.player) return session
    return { ...session, player: repaired }
  } catch {
    return null
  }
}

export function clearSave(): void {
  localStorage.removeItem(SAVE_KEY)
}
