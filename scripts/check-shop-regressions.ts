import { EVENTS } from '../src/data/events.ts'
import { SHOP_ITEMS } from '../src/data/shop.ts'
import { pickNextEvent, pickNextEventSelection } from '../src/engine/eventPicker.ts'
import { beginPlaying, createNewGame, leaveShop, loadGame, purchaseShopItem, resolveChoice, saveGame } from '../src/engine/gameEngine.ts'
import { setSeed } from '../src/engine/rng.ts'
import type { GameEvent, GameSession, PlayerState } from '../src/types/game.ts'

const store = new Map<string, string>()
;(globalThis as unknown as { localStorage: Storage }).localStorage = {
  getItem: (key: string) => store.get(key) ?? null,
  setItem: (key: string, value: string) => void store.set(key, String(value)),
  removeItem: (key: string) => void store.delete(key),
  clear: () => store.clear(),
  key: () => null,
  length: 0,
} as Storage

const failures: string[] = []

function check(label: string, condition: boolean, detail = ''): void {
  if (condition) {
    console.log(`  ✓ ${label}`)
  } else {
    console.error(`  ✖ ${label}${detail ? ` —— ${detail}` : ''}`)
    failures.push(label)
  }
}

function shopSession(occupiedSlots = 0): GameSession {
  const session = createNewGame({ name: '坊市回归', origin: 'merchant', seed: 20261023 })
  return {
    ...session,
    phase: 'shop',
    player: {
      ...session.player,
      spiritStones: 500,
      inventory: Array.from({ length: occupiedSlots }, (_, i) => ({
        name: `随身物品${i + 1}`,
        description: '占用一个乾坤袋格子。',
        usable: false,
      })),
    },
  }
}

function poolEvent(id: string, rarity: GameEvent['rarity'] = 'common'): GameEvent {
  return {
    id,
    title: '坊市机缘回归',
    description: '仅用于验证事件选择。',
    weight: 1,
    rarity,
    choices: [{ id: 'continue', text: '继续', narrative: '继续前行。', effects: [] }],
  }
}

function withEvents(events: GameEvent[], run: () => void): void {
  const original = [...EVENTS]
  EVENTS.splice(0, EVENTS.length, ...events)
  try {
    run()
  } finally {
    EVENTS.splice(0, EVENTS.length, ...original)
  }
}

function countSelections(player: PlayerState, events: GameEvent[], targetId: string): number {
  let count = 0
  for (let seed = 1; seed <= 4096; seed++) {
    setSeed(seed * 7919)
    if (pickNextEvent(player, events)?.id === targetId) count++
  }
  return count
}

console.log('=== 坊市交易回归检查 ===\n')

console.log('1. 满袋交易原子拒绝，不扣钱、不赠属性、不记录假成功')
for (const itemId of ['healing_pills', 'amulet', 'comprehension_scroll']) {
  const base = shopSession(5)
  const before = JSON.stringify(base)
  const purchased = purchaseShopItem(base, itemId)
  check(`${itemId} 满袋时完整保留交易前状态`, JSON.stringify(purchased) === before)
  check(`${itemId} 购买函数不会修改传入会话`, JSON.stringify(base) === before)
}

console.log('\n2. 道具所需格数整体校验')
{
  const bundleId = 'regression_two_item_bundle'
  SHOP_ITEMS.push({
    id: bundleId,
    name: '双丹包',
    description: '验证最后一格不能部分成交。',
    cost: 30,
    effect: [
      { type: 'stat', key: 'luck', value: 5 },
      { type: 'inventory', name: '测试丹一', description: '测试道具。' },
      { type: 'inventory', name: '测试丹二', description: '测试道具。' },
    ],
  })
  try {
    const base = shopSession(4)
    const before = JSON.stringify(base)
    check('双道具商品只剩一格时完整拒绝', JSON.stringify(purchaseShopItem(base, bundleId)) === before)
    check('拒绝双道具商品不会修改原会话', JSON.stringify(base) === before)
  } finally {
    SHOP_ITEMS.splice(SHOP_ITEMS.findIndex((item) => item.id === bundleId), 1)
  }
}

console.log('\n3. 有空间时正常成交，纯即时商品不受满袋影响')
{
  const base = shopSession(4)
  const before = JSON.stringify(base)
  const purchased = purchaseShopItem(base, 'healing_pills')
  check('最后一格可以购买疗伤丹', purchased.player.inventory.length === 5 && purchased.player.inventory[4].name === '疗伤丹')
  check('成功交易只扣除一次正确金额', purchased.player.spiritStones === 470)
  check('成功交易记录购买次数及日志', purchased.player.shopBuffs.purchases === 1 && purchased.player.log.length > base.player.log.length)
  check('成功交易不会修改原会话', JSON.stringify(base) === before)

  const full = shopSession(5)
  const instant = purchaseShopItem(full, 'lucky_charm')
  check('满袋仍可购买即时属性商品', instant.player.spiritStones === 475 && instant.player.stats.luck === full.player.stats.luck + 5)
  check('即时商品不会改变背包内容', JSON.stringify(instant.player.inventory) === JSON.stringify(full.player.inventory))

  const poor = { ...base, player: { ...base.player, spiritStones: 0 } }
  check('灵石不足时保持会话不变', purchaseShopItem(poor, 'healing_pills') === poor)
  const playing = { ...base, phase: 'playing' as const }
  check('离开坊市后不能继续购买', purchaseShopItem(playing, 'healing_pills') === playing)
}

console.log('\n4. 天机情报提供真实、一次性的事件权重加成')
{
  const base = shopSession()
  const purchased = purchaseShopItem(base, 'intel')
  check('购买情报扣除35灵石并保存结构化偏置', purchased.player.spiritStones === 465 && purchased.player.nextEventBias === 'rare_or_romance')
  check('购买情报展示下一次随机机缘提示', !!purchased.player.nextEventHint)
  check('待生效情报不会被重复扣款', JSON.stringify(purchaseShopItem(purchased, 'intel')) === JSON.stringify(purchased))

  const common = poolEvent('regression_common')
  const cases = [
    poolEvent('regression_rare', 'rare'),
    poolEvent('regression_legendary', 'legendary'),
    poolEvent('regression_companion'),
  ]
  for (const target of cases) {
    const pool = [common, target]
    const ordinaryCount = countSelections(base.player, pool, target.id)
    const biasedCount = countSelections(purchased.player, pool, target.id)
    check(`${target.id} 的确定性种子抽样命中率确实上升`, biasedCount > ordinaryCount + 400, `${ordinaryCount}/4096 → ${biasedCount}/4096`)
    const selection = pickNextEventSelection(purchased.player, pool)
    check(`${target.id} 所在随机池标记偏置已使用`, selection.event !== null && selection.consumedBias)
  }

  const commonOnly = pickNextEventSelection(purchased.player, [common])
  check('纯普通事件池不会浪费情报', commonOnly.event?.id === common.id && !commonOnly.consumedBias)
  const empty = pickNextEventSelection(purchased.player, [])
  check('没有事件时不会浪费情报', empty.event === null && !empty.consumedBias)
  const blockedRare: GameEvent = {
    ...poolEvent('regression_blocked_rare', 'rare'),
    conditions: [{ type: 'flag', key: 'regression_unavailable', value: true }],
  }
  const ineligible = pickNextEventSelection(purchased.player, [common, blockedRare])
  check('不可触发的稀有事件不会导致情报被消费', ineligible.event?.id === common.id && !ineligible.consumedBias)
  check('纯事件选择不会修改玩家偏置', purchased.player.nextEventBias === 'rare_or_romance')
}

console.log('\n5. 情报不会越过主线、路线决定和选择后果')
{
  const purchased = purchaseShopItem(shopSession(), 'intel')
  const main = pickNextEventSelection(purchased.player, EVENTS)
  check('必然主线照常最先出现且保留偏置', main.event?.id === 'enter_sect' && !main.consumedBias)
  const left = leaveShop(purchased)
  check('离店遇到必然主线时情报仍待生效', left.currentEvent?.id === 'enter_sect' && left.player.nextEventBias === 'rare_or_romance' && !!left.player.nextEventHint)
  const joined = resolveChoice({ ...left, currentEvent: main.event }, 'honest')
  check('经过必然主线后情报偏置及提示仍待生效', joined.currentEvent?.id === 'mentor_assign' && joined.player.nextEventBias === 'rare_or_romance' && joined.player.nextEventHint === purchased.player.nextEventHint)

  const routeDecision: PlayerState = {
    ...purchased.player,
    currentChapter: 'sect_4',
    stats: { ...purchased.player.stats, demonHeart: 40 },
    flags: { zhao_enemy: true },
  }
  const triggered = pickNextEventSelection(routeDecision, EVENTS)
  check('章节触发的去留选择优先且不消耗情报', triggered.event?.id === 'sect_departure_choice' && !triggered.consumedBias)

  const aftermath: PlayerState = {
    ...purchased.player,
    history: ['time_window'],
    flags: { has_companion: true, abandoned_companion: true },
  }
  const consequence = pickNextEventSelection(aftermath, EVENTS)
  check('选择后果优先且不消耗情报', consequence.event?.id === 'companion_abandonment' && !consequence.consumedBias)
}

console.log('\n6. 离店、开始、回合推进和读档重抽均正确消费情报')
{
  const rare = poolEvent('regression_rare_followup', 'rare')
  const current = poolEvent('regression_current')
  const purchased = purchaseShopItem(shopSession(), 'intel')
  withEvents([current], () => {
    const left = leaveShop(purchased)
    check('离店只遇到普通随机事件时保留情报及提示', left.currentEvent?.id === current.id && left.player.nextEventBias === 'rare_or_romance' && left.player.nextEventHint === purchased.player.nextEventHint)
  })
  withEvents([rare], () => {
    const left = leaveShop(purchased)
    check('离店随机机缘使用情报后清除偏置及提示', left.currentEvent?.id === rare.id && left.player.nextEventBias === undefined && left.player.nextEventHint === undefined)
    check('离店抽取不会修改原会话中的情报', purchased.player.nextEventBias === 'rare_or_romance' && !!purchased.player.nextEventHint)

    const started = beginPlaying({ ...purchased, phase: 'root_reveal', currentEvent: null })
    check('开始时重抽随机机缘正确消费情报', started.currentEvent?.id === rare.id && started.player.nextEventBias === undefined && started.player.nextEventHint === undefined)

    const continued = resolveChoice({ ...purchased, phase: 'playing', currentEvent: current }, 'continue')
    check('回合推进抽取随机机缘正确消费情报', continued.currentEvent?.id === rare.id && continued.player.nextEventBias === undefined && continued.player.nextEventHint === undefined)

    saveGame({ ...purchased, phase: 'playing', currentEvent: current })
    const repaired = loadGame()
    check('失效事件读档重抽时正确消费情报', repaired?.currentEvent?.id === rare.id && repaired.player.nextEventBias === undefined && repaired.player.nextEventHint === undefined)

    const boughtAgain = purchaseShopItem({ ...left, phase: 'shop' }, 'intel')
    check('情报消费后可再次购买下一次加成', boughtAgain.player.nextEventBias === 'rare_or_romance' && boughtAgain.player.spiritStones === 430)
  })

  const common = poolEvent('regression_common_result')
  withEvents([common, rare], () => {
    let commonResultSeed = 0
    for (let seed = 1; seed <= 100; seed++) {
      setSeed(seed)
      if (pickNextEventSelection(purchased.player, EVENTS).event?.id === common.id) {
        commonResultSeed = seed
        break
      }
    }
    setSeed(commonResultSeed)
    const left = leaveShop(purchased)
    check('加成参与抽取但抽到普通事件时仍只消费一次', commonResultSeed > 0 && left.currentEvent?.id === common.id && left.player.nextEventBias === undefined && left.player.nextEventHint === undefined)
  })
}

console.log('\n7. 刷新保留待生效情报，普通读档不会重新消费')
{
  const purchased = purchaseShopItem(shopSession(), 'intel')
  saveGame(purchased)
  const restored = loadGame()
  check('坊市刷新不丢失偏置及提示', restored?.player.nextEventBias === 'rare_or_romance' && restored.player.nextEventHint === purchased.player.nextEventHint)

  const rare = poolEvent('regression_saved_rare', 'rare')
  withEvents([rare], () => {
    saveGame({ ...purchased, phase: 'playing', currentEvent: rare })
    const resumed = loadGame()
    check('有效当前事件读档不会重抽或消费待生效情报', resumed?.currentEvent?.id === rare.id && resumed.player.nextEventBias === 'rare_or_romance' && resumed.player.nextEventHint === purchased.player.nextEventHint)

    const consumed = leaveShop(purchased)
    saveGame(consumed)
    const afterRefresh = loadGame()
    check('已消费的情报刷新后不会复活', afterRefresh?.currentEvent?.id === rare.id && afterRefresh.player.nextEventBias === undefined && afterRefresh.player.nextEventHint === undefined)
  })
}

console.log('')
if (failures.length > 0) {
  console.error(`发现 ${failures.length} 项失败：`)
  for (const failure of failures) console.error(`  ✖ ${failure}`)
  process.exit(1)
}

console.log('✓ 坊市交易回归检查全部通过')
