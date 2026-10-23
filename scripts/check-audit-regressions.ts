import assert from 'node:assert/strict'
import { CHAPTERS } from '../src/data/chapters.ts'
import { EVENTS } from '../src/data/events.ts'
import { applyEffects } from '../src/engine/effects.ts'
import { checkConditions } from '../src/engine/conditions.ts'
import { checkEnding, beginPlaying, createNewGame, leaveShop, loadGame, resolveChoice, saveGame } from '../src/engine/gameEngine.ts'
import { checkAchievements } from '../src/engine/achievements.ts'
import { isEventEligible } from '../src/engine/eventPicker.ts'
import { DEFAULT_META, loadMeta } from '../src/engine/metaProgress.ts'
import { getActiveStorylines } from '../src/engine/storylineTracker.ts'
import { migrateSave } from '../src/engine/migrate.ts'
import { loadPersistedRewindState } from '../src/hooks/useRewind.ts'
import * as rng from '../src/engine/rng.ts'
import type { GameSession } from '../src/types/game.ts'

const store = new Map<string, string>()
Object.defineProperty(globalThis, 'localStorage', { value: {
  getItem: (key: string) => store.get(key) ?? null,
  setItem: (key: string, value: string) => store.set(key, String(value)),
  removeItem: (key: string) => store.delete(key),
}, configurable: true })

let failures = 0
function check(label: string, run: () => void) {
  store.clear()
  try {
    run()
    console.log(`  ✓ ${label}`)
  } catch (error) {
    failures++
    console.error(`  ✖ ${label}: ${error instanceof Error ? error.message : String(error)}`)
  }
}

function event(id: string) {
  const found = EVENTS.find((entry) => entry.id === id)
  assert.ok(found, id)
  return found
}

function staged(id: string): GameSession {
  const session = beginPlaying(createNewGame({ name: '审计回归', origin: 'scholar', seed: 142 }))
  return {
    ...session,
    currentEvent: event(id),
    player: {
      ...session.player,
      currentChapter: 'sect_4',
      lifespan: 1000,
      cultivation: 30,
      stats: { ...session.player.stats, rootBone: 0, luck: 0, demonHeart: 30 },
    },
  }
}

console.log('=== 审计缺陷回归检查 ===')

check('低神识、低灵石仍能结束灵兽喂养事件', () => {
  const session = staged('spirit_beast_train')
  session.player.spiritStones = 5
  session.player.flags.has_spirit_beast = true
  session.player.cultivationSystems.spiritBeast = { name: '妖狼', tier: 1 }
  const viable = session.currentEvent!.choices.filter((choice) => checkConditions(session.player, choice.requirements))
  assert.ok(viable.length > 0)
  const next = resolveChoice(session, viable[0].id)
  assert.notEqual(next, session)
  assert.ok(next.player.history.includes('spirit_beast_train'))
})

check('旧版和封装格式的回溯快照均经过迁移', () => {
  const legacy = JSON.parse(JSON.stringify(staged('inner_demon')))
  delete legacy.player.cultivationSystems
  delete legacy.player.chapterCompleted
  for (const stored of [legacy, { version: 1, status: 'available', snapshot: legacy }]) {
    store.set('cultgame_rewind', JSON.stringify(stored))
    const snapshot = loadPersistedRewindState().snapshot
    assert.ok(snapshot)
    assert.ok(snapshot.player.cultivationSystems)
    assert.deepEqual(snapshot.player.chapterCompleted, [])
    assert.doesNotThrow(() => applyEffects(snapshot.player, [{ type: 'cultivation', value: 5 }]))
  }
})

check('散修盟主结局优先于普通散修结局', () => {
  const player = staged('final_choice').player
  player.currentChapter = 'wander_6'
  player.realm = 'golden_core'
  player.flags = { wander_leader: true }
  assert.equal(checkEnding(player, { includeMilestones: true })?.id, 'wander_leader')
  delete player.flags.wander_leader
  assert.equal(checkEnding(player, { includeMilestones: true })?.id, 'wandering_hermit')
})

check('每日天命刷新前后保留随机状态、选择结果和后续事件', () => {
  const initial = staged('inner_demon')
  initial.dailySeed = rng.getDailySeed()
  const checkpoint = resolveChoice(initial, 'suppress_demon')
  checkpoint.currentEvent = event('inner_demon')
  checkpoint.player.history = []
  checkpoint.player.stats.demonHeart = 30
  const expectedSeed = rng.getSeed()
  saveGame(checkpoint)
  const beforeMeta = store.get('cultgame_meta')
  const uninterrupted = resolveChoice(checkpoint, 'face_demon')
  if (beforeMeta) store.set('cultgame_meta', beforeMeta)
  else store.delete('cultgame_meta')
  rng.setSeed(1000)
  const loaded = loadGame()
  assert.ok(loaded)
  assert.equal(rng.getSeed(), expectedSeed)
  const resumed = resolveChoice(loaded, 'face_demon')
  assert.deepEqual(migrateSave(resumed)?.player, migrateSave(uninterrupted)?.player)
  assert.equal(resumed.currentEvent?.id, uninterrupted.currentEvent?.id)
})

check('境界不足不能选择飞升，元婴满足条件可立即飞升', () => {
  const session = staged('final_choice')
  session.player.currentChapter = 'wander_6'
  session.player.chapterCompleted = CHAPTERS.wander_6.events.filter((id) => id !== 'final_choice')
  session.player.flags.got_inheritance = true
  const ascend = event('final_choice').choices.find((choice) => choice.id === 'ascend')!
  session.player.realm = 'qi_refining_3'
  assert.equal(checkConditions(session.player, ascend.requirements), false)
  assert.equal(resolveChoice(session, 'ascend'), session)
  session.player.realm = 'nascent_soul'
  assert.equal(checkConditions(session.player, ascend.requirements), true)
  assert.equal(resolveChoice(session, 'ascend').ending?.id, 'ascension')
})

check('秘境法宝百分比加成生效且不增加扣款或损失', () => {
  const player = staged('inner_demon').player
  player.artifacts = ['dungeon_relic', '秘境遗宝', 'realm_treasure']
  player.cultivation = 0
  player.spiritStones = 0
  assert.equal(applyEffects(player, [{ type: 'cultivation', value: 20 }]).cultivation, 22)
  assert.equal(applyEffects(player, [{ type: 'spiritStones', value: 100 }]).spiritStones, 120)
  player.spiritStones = 200
  assert.equal(applyEffects(player, [{ type: 'spiritStones', value: -100 }]).spiritStones, 100)
  assert.equal(applyEffects(player, [{ type: 'spiritStones', value: 100, set: true }]).spiritStones, 100)
  player.cultivation = 50
  assert.equal(applyEffects(player, [{ type: 'cultivation', value: -10 }]).cultivation, 40)
})

check('傀儡军团只提高战斗事件成功率', () => {
  const session = staged('inner_demon')
  session.currentEvent = {
    id: 'audit_combat', title: '战斗', description: '回归', weight: 1, tags: ['combat'],
    choices: [{ id: 'fight', text: '战斗', outcomes: [{ chance: 0.4,
      successEffects: [{ type: 'flag', key: 'audit_won', value: true }],
      failEffects: [], narrative: { success: '胜利', fail: '失利' },
    }] }],
  }
  session.player.cultivationSystems.divineSense = 0
  rng.setSeed(600)
  assert.equal(resolveChoice(session, 'fight').player.flags.audit_won, undefined)
  session.player.artifacts = ['puppet_army']
  rng.setSeed(600)
  assert.equal(resolveChoice(session, 'fight').player.flags.audit_won, true)
  session.currentEvent = { ...session.currentEvent, tags: [] }
  rng.setSeed(600)
  assert.equal(resolveChoice(session, 'fight').player.flags.audit_won, undefined)
  session.currentEvent = { ...session.currentEvent, id: 'demon_lord_offer' }
  rng.setSeed(600)
  assert.equal(resolveChoice(session, 'fight').player.flags.audit_won, undefined)
  session.currentEvent = { ...session.currentEvent, id: 'dual_cultivation' }
  session.player.artifacts = ['combo_scroll']
  rng.setSeed(600)
  assert.equal(resolveChoice(session, 'fight').player.flags.audit_won, true)
})

check('自救和斩心魔成就只奖励对应的成功，血月成就要求实际修炼', () => {
  for (const [id, choice, achievement] of [
    ['qi_deviation', 'self_rescue', 'survived_qi_deviation'],
    ['inner_demon', 'face_demon', 'defeated_demon_heart'],
  ]) {
    const session = staged(id)
    session.player.cultivationSystems.divineSense = 0
    rng.setSeed(1000)
    assert.equal(resolveChoice(session, choice).newAchievements.includes(achievement), false)
    rng.setSeed(1)
    assert.equal(resolveChoice(session, choice).newAchievements.includes(achievement), true)
    store.clear()
  }
  assert.equal(resolveChoice(staged('inner_demon'), 'embrace_demon').newAchievements.includes('defeated_demon_heart'), false)
  assert.equal(resolveChoice(staged('blood_moon'), 'purify').newAchievements.includes('blood_moon_cultivate'), false)
  const bloodMoon = staged('blood_moon')
  rng.setSeed(1000)
  const failedCultivation = resolveChoice(bloodMoon, 'cultivate_blood')
  assert.ok(failedCultivation.player.log.some((line) => line.includes('血月之力过于狂暴')))
  assert.equal(failedCultivation.newAchievements.includes('blood_moon_cultivate'), true)
})

check('结局保留本局已经获得的成就', () => {
  const session = staged('final_choice')
  session.newAchievements = ['met_moli']
  assert.ok(resolveChoice(session, 'retire').newAchievements.includes('met_moli'))
})

check('跳步和分支剧情仅标记实际完成步骤，不回退下一步', () => {
  const player = staged('inner_demon').player
  player.flags = { met_moli: true, moli_ally: true, moli_friend: true }
  const moli = getActiveStorylines(player).find((entry) => entry.storyline.id === 'moli')!
  assert.equal(moli.completedSteps, 3)
  assert.equal(moli.currentLabel, '并肩探秘')
  assert.equal(moli.nextLabel, '以命相护')
  assert.deepEqual(moli.completedFlags, ['met_moli', 'moli_ally', 'moli_friend'])
  assert.equal(moli.nextFlag, 'moli_brother')
  player.flags = { met_lin_wanyue: true, ye_qingmei_companion: true }
  const ye = getActiveStorylines(player).find((entry) => entry.storyline.id === 'romance_ye')!
  assert.equal(ye.currentLabel, '结为道侣')
  assert.equal(ye.nextLabel, null)
  assert.deepEqual(ye.completedFlags, ['met_lin_wanyue', 'ye_qingmei_companion'])
})

check('修炼增益仅提高正收益，不会放大修为损失', () => {
  for (const path of ['balanced', 'body', 'law'] as const) {
    const player = staged('qi_deviation').player
    player.cultivation = 50
    player.cultivationSystems.path = path
    player.cultivationSystems.divineSense = 100
    player.cultivationSystems.techniques = ['家传心法']
    player.flags = { has_companion: true, talent_spirit_affinity: true }
    player.artifacts = ['dungeon_relic']
    assert.equal(applyEffects(player, [{ type: 'cultivation', value: -20 }]).cultivation, 30, path)
    assert.ok(applyEffects(player, [{ type: 'cultivation', value: 10 }]).cultivation > 60, path)
    assert.equal(applyEffects(player, [{ type: 'cultivation', value: 0 }]).cultivation, 50)
  }
})

check('叶轻眉朋友和直接结侣分支均能求助，告别分支不能', () => {
  for (const [choice, expected] of [['tea', true], ['ask_companion', true], ['farewell', false]] as const) {
    let session = staged('jade_pool_encounter')
    session.player.age = 20
    session.player.stats.luck = 50
    session = resolveChoice(session, 'guard')
    session = resolveChoice({ ...session, currentEvent: event('ye_qingmei_reunion') }, choice)
    assert.equal(isEventEligible(session.player, event('ye_qingmei_help'), EVENTS, []), expected, choice)
    assert.equal(isEventEligible(session.player, event('ye_qingmei_reunion'), EVENTS, []), false)
    const migrated = migrateSave(session)!
    assert.equal(isEventEligible(migrated.player, event('ye_qingmei_help'), EVENTS, []), expected)
  }
})

check('不入樊笼要求从未入宗，初始界面刷新不会伪造入宗历史', () => {
  for (const phase of ['lore', 'root_reveal', 'playing'] as const) {
    const initial = createNewGame({ name: '未入宗', origin: 'farmer', seed: 142 })
    saveGame({ ...initial, phase })
    const restored = loadGame()!
    assert.equal(!!restored.player.flags.ever_joined_sect, false, phase)
    const refused = resolveChoice(beginPlaying(restored), 'refuse')
    const retired = resolveChoice({ ...refused, currentEvent: event('final_choice') }, 'retire')
    assert.ok(retired.newAchievements.includes('no_sect'))
    store.clear()
  }
  let joined = resolveChoice(beginPlaying(createNewGame({ name: '曾入宗', seed: 142 })), 'honest')
  joined = resolveChoice({ ...joined, currentEvent: event('sect_departure_choice') }, 'leave')
  const retired = resolveChoice({ ...joined, currentEvent: event('final_choice') }, 'retire')
  assert.equal(joined.player.flags.ever_joined_sect, true)
  assert.equal(retired.newAchievements.includes('no_sect'), false)
})

check('三人同行与出身成就要求实际经历对应事件', () => {
  const session = staged('three_friends')
  session.player.flags = { lin_yuan_ally: true, su_muyan_ally: true }
  assert.equal(checkAchievements(session, DEFAULT_META).includes('three_friends'), false)
  assert.ok(resolveChoice(session, 'enjoy').newAchievements.includes('three_friends'))
  store.clear()
  const scholar = resolveChoice(staged('origin_scholar_text'), 'share_text')
  assert.ok(scholar.newAchievements.includes('origin_event'))
  store.clear()
  const hermit = resolveChoice(beginPlaying(createNewGame({ name: '隐世遗脉', origin: 'hermit', seed: 142 })), 'honest')
  assert.equal(hermit.newAchievements.includes('origin_event'), false)
  const discovered = resolveChoice({ ...hermit, currentEvent: event('origin_clue') }, 'refuse_pendant')
  assert.ok(discovered.newAchievements.includes('origin_event'))
})

check('通关回合数、事件数、历史记录与速通边界保持一致', () => {
  for (const turn of [10, 11]) {
    store.clear()
    const session = staged('final_choice')
    session.turn = turn
    session.player.history = Array.from({ length: turn - 1 }, (_, index) => `past_${index}`)
    const ended = resolveChoice(session, 'retire')
    assert.equal(ended.turn, turn)
    assert.equal(ended.turn, ended.player.history.length)
    assert.equal(loadMeta().bestTurn, ended.turn)
    assert.equal(ended.newAchievements.includes('speed_run'), turn <= 10)
  }
})

check('离开坊市无事件时结局不会额外计入回合', () => {
  const session = staged('market_rest')
  const shop = resolveChoice(session, 'browse')
  const originalEvents = [...EVENTS]
  try {
    EVENTS.splice(0, EVENTS.length)
    const ended = leaveShop(shop)
    assert.equal(ended.phase, 'ending')
    assert.equal(ended.turn, 1)
    assert.equal(loadMeta().bestTurn, 1)
  } finally {
    EVENTS.splice(0, EVENTS.length, ...originalEvents)
  }
})

check('旧结局存档迁移修正回合数，重复读档不会再次扣减', () => {
  const session = staged('final_choice')
  const legacy = {
    ...session, version: 3, phase: 'ending', turn: 11,
    player: { ...session.player, history: Array.from({ length: 10 }, (_, index) => `past_${index}`) },
  }
  const repaired = migrateSave(legacy)!
  assert.equal(repaired.turn, 10)
  assert.equal(migrateSave(repaired)?.turn, 10)
})

if (failures > 0) process.exitCode = 1
else console.log('✓ 审计缺陷回归检查全部通过')
