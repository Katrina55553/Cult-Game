import { strict as assert } from 'node:assert'
import { CHAPTERS } from '../src/data/chapters.ts'
import { EVENTS } from '../src/data/events.ts'
import { checkConditions } from '../src/engine/conditions.ts'
import { applyEffects } from '../src/engine/effects.ts'
import { pickNextEvent } from '../src/engine/eventPicker.ts'
import { beginPlaying, createNewGame, leaveShop, resolveChoice } from '../src/engine/gameEngine.ts'
import { migrateSave } from '../src/engine/migrate.ts'
import { advanceStory } from '../src/engine/storyProgression.ts'
import { getActiveStorylines } from '../src/engine/storylineTracker.ts'
import type { GameSession, PlayerState } from '../src/types/game.ts'

const base = beginPlaying(createNewGame({ name: '剧情回归', seed: 20261004 }))
const event = (id: string) => {
  const found = EVENTS.find((entry) => entry.id === id)
  assert.ok(found, `事件存在：${id}`)
  return found
}
const stage = (id: string, player: PlayerState): GameSession => ({
  ...base, phase: 'playing', currentEvent: event(id), player,
})

const rescued: PlayerState = {
  ...base.player, currentChapter: 'sect_6', realm: 'golden_core',
  visitedChapters: ['sect_5', 'sect_6'],
  history: ['beauty_rescue', 'sect_politics'], chapterCompleted: ['sect_politics'],
  flags: { met_su_qing: true, rescued_beauty: true },
}
assert.equal(pickNextEvent(rescued, EVENTS)?.id, 'beauty_gratitude', '连续主线之间响应答谢支线')
const thanked = resolveChoice(stage('beauty_gratitude', rescued), 'companion')
assert.equal(thanked.currentEvent?.id, 'elder_confession', '支线后恢复原有主线顺序')

const carried = {
  ...rescued, currentChapter: 'sect_7', chapterCompleted: [],
  history: [...rescued.history, 'elder_confession', 'ancient_prophesy'],
}
assert.equal(pickNextEvent(carried, EVENTS)?.id, 'beauty_gratitude', '未完成的情缘支线跨章保留')

for (const [chapter, last, stats] of [
  ['sect_4', 'boss_wolf_king', { karma: 0, demonHeart: 40 }],
  ['sect_6', 'ancient_prophesy', { karma: 0, demonHeart: 40 }],
  ['wander_3', 'spirit_flood', { karma: 45, demonHeart: 0 }],
  ['demon_2', 'demon_invasion', { karma: 30, demonHeart: 10 }],
] as const) {
  const player = advanceStory({
    ...base.player, currentChapter: chapter,
    stats: { ...base.player.stats, ...stats }, flags: { zhao_enemy: true },
    history: [last], chapterCompleted: CHAPTERS[chapter].events.filter((id) => id !== last),
  }, last)
  assert.equal(CHAPTERS[player.currentChapter].route, CHAPTERS[chapter].route, '属性不会强迫切换路线')
}

const companion = {
  ...base.player, realm: 'foundation' as const,
  flags: { has_companion: true, su_qing_companion: true, dual_cultivation_mastered: true, survived_together: true },
}
const broken = applyEffects(companion, event('lover_jealousy').choices.find((choice) => choice.id === 'break')!.effects!)
assert.equal(checkConditions(broken, event('spy_companion').conditions), false, '分手后不能触发道侣真相')
assert.equal(broken.flags.su_qing_companion, false, '分手清除伴侣身份')
assert.equal(broken.flags.dual_cultivation_mastered, false, '分手清除当前关系修炼进度')
assert.equal(checkConditions({ ...companion, flags: { has_companion: true, su_qing_companion: true } }, event('spy_companion').conditions), false, '道侣真相需要真实共同历险的前置')
const switchedCompanion = applyEffects(companion, [
  { type: 'flag', key: 'has_companion', value: false },
  { type: 'flag', key: 'ye_qingmei_companion', value: true },
])
assert.equal(switchedCompanion.flags.su_qing_companion, false, '新道侣不会继承旧道侣身份')
assert.equal(switchedCompanion.flags.survived_together, false, '新道侣不会继承共渡天劫经历')
const betrayedMoli = applyEffects({ ...base.player, flags: { moli_ally: true, moli_friend: true } }, [{ type: 'flag', key: 'moli_enemy', value: true }])
assert.equal(betrayedMoli.flags.met_moli, true, '初遇偷袭后墨离能认出玩家并追索')
assert.equal(betrayedMoli.flags.moli_friend, false, '背叛墨离后不再算挚友')

const migrated = migrateSave({ ...base, player: { ...broken, visitedChapters: undefined, currentChapter: 'sect_7', flags: { su_qing_companion: true } } })!
assert.equal(migrated.player.flags.su_qing_companion, false, '旧存档修复残留道侣标记')
assert.ok(migrated.player.visitedChapters?.includes('sect_6'), '旧存档恢复此前开放的支线章节')

for (const [id, chapter, stats, decline, accept, destination] of [
  ['sect_departure_choice', 'sect_4', { karma: 0, demonHeart: 40 }, 'stay', 'leave', 'wander_1'],
  ['demon_path_choice', 'sect_6', { karma: 0, demonHeart: 40 }, 'resist', 'accept', 'demon_1'],
  ['wander_sect_invitation', 'wander_3', { karma: 45, demonHeart: 0 }, 'decline', 'join', 'sect_5'],
  ['demon_redemption_choice', 'demon_2', { karma: 30, demonHeart: 10 }, 'stay', 'redeem', 'sect_7'],
] as const) {
  const player: PlayerState = { ...base.player, currentChapter: chapter, flags: { zhao_enemy: true }, stats: { ...base.player.stats, ...stats } }
  assert.equal(pickNextEvent(player, EVENTS)?.id, id, '达到门槛时出现路线抉择')
  const declined = resolveChoice(stage(id, player), decline)
  assert.equal(CHAPTERS[declined.player.currentChapter].route, CHAPTERS[chapter].route, '拒绝邀请保留当前路线')
  const accepted = resolveChoice(stage(id, player), accept)
  assert.equal(accepted.player.currentChapter, destination, '接受邀请才进入指定章节')
  assert.equal(accepted.player.routeChapterIntent, undefined, '目标章节意图消费后清除')
}

const abandoned = resolveChoice(stage('time_window', { ...companion, currentChapter: 'sect_8' }), 'go_realm')
assert.equal(abandoned.currentEvent?.id, 'companion_abandonment', '弃侣立即产生后续')
const parted = resolveChoice(abandoned, 'part')
assert.equal(parted.player.flags.has_companion, false, '弃侣后选择离去会结束关系')
assert.notEqual(parted.currentEvent?.id, 'companion_abandonment', '后果不会重复触发')
const spy = resolveChoice(stage('spy_companion', {
  ...companion, currentChapter: 'sect_7', stats: { ...companion.stats, comprehension: 70 },
}), 'use_spy')
assert.equal(spy.currentEvent?.id, 'spy_counterplot', '反间选择立即产生后续')
const counterplot = resolveChoice(spy, 'expose')
assert.equal(counterplot.player.flags.counterplot_succeeded, true, '反间兑现为暗线瓦解')
assert.equal(getActiveStorylines(counterplot.player).find((storyline) => storyline.storyline.id === 'spy')?.percent, 100, '反间分支可独立完成剧情线')
for (const [choice, expected] of [['support_sacrifice', 'sect_sacrifice_aftermath'], ['oppose_sacrifice', 'sect_alternative_plan']] as const) {
  const result = resolveChoice(stage('sect_choice', { ...base.player, currentChapter: 'sect_6', flags: { sect_conflict: true, sect_truth: true } }), choice)
  assert.equal(result.currentEvent?.id, expected, '宗门抉择得到不同后续')
  const resolved = resolveChoice(result, choice === 'support_sacrifice' ? 'confess' : 'guard')
  assert.equal(getActiveStorylines(resolved.player).find((storyline) => storyline.storyline.id === 'sect_chain')?.percent, 100, '互斥的宗门分支各自完成剧情线')
}

const preferences: Record<string, string[]> = {
  enter_sect: ['honest'], elder_lecture: ['ask'], beast_attack: ['tame', 'fight'],
  beauty_rescue: ['rescue'], beauty_gratitude: ['companion'], dual_cultivation: ['deep', 'harmony'],
  companion_tribulation: ['together'], lover_jealousy: ['apologize'], lovers_ascension: ['ascend_together'],
  companion_eternity: ['ascend_together'], spy_companion: ['forgive_spy'], demon_path_choice: ['resist'],
  demon_temptation: ['reject'], final_choice: ['ascend', 'stay'], golden_tribulation: ['array'], time_window: ['stay_companion'],
}
let romance = beginPlaying(createNewGame({ name: '完整情缘链', origin: 'noble_exile', seed: 1 }))
for (let turn = 0; turn < 180 && romance.phase !== 'ending'; turn++) {
  if (romance.phase === 'shop') {
    romance = leaveShop(romance)
    continue
  }
  const current = romance.currentEvent!
  const viable = current.choices.filter((choice) => checkConditions(romance.player, choice.requirements))
  const preferred = preferences[current.id]?.map((id) => viable.find((choice) => choice.id === id)).find((choice) => !!choice)
  const score = (choice: typeof viable[number]) => (choice.effects ?? []).reduce((total, effect) =>
    total + (effect.type === 'cultivation' ? effect.value : effect.type === 'stat' && effect.key === 'demonHeart' ? -effect.value : effect.type === 'breakthrough' ? 30 : 0),
  0) + (choice.outcomes ? 5 : 0)
  const chosen = preferred ?? viable.sort((a, b) => score(b) - score(a))[0]
  assert.ok(chosen, '完整试玩始终有可选选项')
  romance = resolveChoice(romance, chosen.id)
}
assert.equal(romance.ending?.id, 'immortal_lovers', '固定种子真实试玩走完神仙眷侣结局')
assert.ok(['beauty_rescue', 'beauty_gratitude', 'dual_cultivation', 'companion_tribulation', 'lovers_ascension'].every((id) => romance.player.history.includes(id)), '完整情缘链未跳过关键节拍')

console.log('✓ 支线出场、路线自主、人物关系和重大选择后果回归通过')
