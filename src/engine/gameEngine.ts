import { createDefaultCultivationSystems, migrateCultivationSystems } from '../data/cultivationSystems'
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

export function rollSpiritRoot(): SpiritRoot {
  const totalWeight = SPIRIT_ROOTS.reduce((sum, r) => sum + r.weight, 0)
  let roll = rng.random() * totalWeight
  for (const root of SPIRIT_ROOTS) {
    roll -= root.weight
    if (roll < 0) return root
  }
  return SPIRIT_ROOTS[SPIRIT_ROOTS.length - 1]
}

export function createPlayer(
  name: string,
  root: SpiritRoot,
  options: { useInnateBody?: boolean; origin?: NewGameOptions['origin'] } = {},
): PlayerState {
  const player: PlayerState = {
    name,
    spiritRoot: root.name,
    origin: options.origin ?? null,
    realm: 'mortal',
    age: 16,
    lifespan: randBetween(root.lifespan),
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
    cultivationSystems: createDefaultCultivationSystems(
      options.origin === 'demon_blood' ? '魔裔血脉' : null,
    ),
    flags: {},
    history: [],
    log: [`${16}岁：踏入修仙之路，测得${root.name}。`],
    shopBuffs: { purchases: 0 },
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
      player.log.push('16岁：农家子弟出身，心性质朴。')
      break
    case 'noble_exile':
      player.stats.comprehension += 6
      player.spiritStones += 30
      player.log.push('16岁：世家弃子，携资入道。')
      break
    case 'demon_blood':
      player.stats.rootBone += 6
      player.stats.demonHeart += 12
      player.cultivationSystems.bloodline = '魔裔血脉'
      player.log.push('16岁：魔裔血脉，性情桀骜。')
      break
  }

  return player
}

export function createNewGame(options: NewGameOptions): GameSession {
  const meta = loadMeta()
  if (options.dailyMode) {
    rng.setSeed(rng.getDailySeed())
  } else {
    rng.setSeed(Date.now())
  }

  const root = rollSpiritRoot()
  const player = createPlayer(options.name.trim() || '无名修士', root, {
    useInnateBody: options.useInnateBody && meta.innateBodyUnlocked,
    origin: options.origin ?? null,
  })
  const startEvent = EVENTS.find((e) => e.id === 'enter_sect') ?? null

  return {
    phase: 'root_reveal',
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
  }
}

export function beginPlaying(session: GameSession): GameSession {
  const meta = loadMeta()
  const event =
    session.currentEvent ??
    pickNextEvent(session.player, EVENTS, meta.unlockedEvents, meta.romanceBoost)
  return {
    ...session,
    phase: 'playing',
    currentEvent: event,
    turn: 1,
    lastMilestone: detectEncounterMilestone(event),
  }
}

const SORTED_ENDINGS = [...ENDINGS].sort((a, b) => b.priority - a.priority)

export function checkEnding(state: PlayerState): Ending | null {
  for (const ending of SORTED_ENDINGS) {
    if (checkConditions(state, ending.conditions)) return ending
  }
  return null
}

function resolveOutcome(
  state: PlayerState,
  outcome: Outcome,
): { state: PlayerState; narrative: string; success: boolean } {
  let chance = outcome.chance
  if (outcome.luckBonus) {
    chance += state.stats.luck * outcome.luckBonus
  }
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

function finalizeAfterChoice(
  session: GameSession,
  player: PlayerState,
  narrative: string,
  openShop: boolean,
): GameSession {
  const prevPlayer = session.player
  const event = session.currentEvent!

  const years = event.years ?? 1
  player = { ...player, age: player.age + years }

  const logNarrative = augmentNarrativeWithBreakthrough(narrative, prevPlayer, player)
  const ageLog = `${player.age}岁：${logNarrative}`
  player = { ...player, log: [...player.log, ageLog] }

  player = { ...player, history: [...player.history, event.id] }

  const ending = checkEnding(player)
  if (ending) {
    return buildEndingSession(session, player, ending, 'condition')
  }

  if (player.age >= player.lifespan) {
    const naturalEnding = ENDINGS.find((e) => e.id === 'natural_death')!
    return buildEndingSession(
      session,
      { ...player, log: [...player.log, `${player.age}岁：寿元耗尽，魂归天地。`] },
      naturalEnding,
      'lifespan',
    )
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
  const matched = checkEnding(player)
  if (matched) {
    return { ending: matched, trigger: 'condition' }
  }
  return {
    ending: ENDINGS.find((e) => e.id === 'path_exhausted')!,
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
    const result = resolveOutcome(player, choice.outcomes[0])
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
    const session = JSON.parse(raw) as GameSession
    if (!session.player || !session.phase) return null
    if (!session.player.shopBuffs) {
      session.player.shopBuffs = { purchases: 0 }
    }
    if (session.player.origin === undefined) {
      session.player.origin = null
    }
    if (!Array.isArray(session.player.artifacts)) {
      session.player.artifacts = []
    }
    if (!session.player.cultivationSystems) {
      session.player.cultivationSystems = createDefaultCultivationSystems(null)
    } else {
      session.player.cultivationSystems = migrateCultivationSystems(session.player)
    }
    if (!Array.isArray(session.player.history)) {
      session.player.history = []
    }
    if (!Array.isArray(session.player.log)) {
      session.player.log = []
    }
    return session
  } catch {
    return null
  }
}

export function clearSave(): void {
  localStorage.removeItem(SAVE_KEY)
}
