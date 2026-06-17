/**
 * Automated playtest — simulates multiple runs with different strategies.
 * Run: npx tsx scripts/playtest.ts
 */
import { EVENTS } from '../src/data/events.ts'
import { FILLER_IDS } from './playtest-helpers.ts'
import {
  beginPlaying,
  createNewGame,
  leaveShop,
  purchaseShopItem,
  resolveChoice,
} from '../src/engine/gameEngine.ts'
import { checkConditions } from '../src/engine/conditions.ts'
import * as rng from '../src/engine/rng.ts'
import type { Choice, GameSession } from '../src/types/game.ts'

type Strategy = 'cultivate' | 'romance' | 'sect' | 'greedy' | 'random' | 'wander'

interface RunReport {
  strategy: Strategy
  seed: number
  ending: string | null
  turns: number
  age: number
  realm: string
  fillerRatio: number
  uniqueEvents: number
  systems: string
  issues: string[]
}

function pickChoice(
  session: GameSession,
  strategy: Strategy,
): string | null {
  const event = session.currentEvent
  if (!event) return null

  const viable = event.choices.filter((c) => checkConditions(session.player, c.requirements))
  if (viable.length === 0) return event.choices[0]?.id ?? null

  const score = (c: Choice): number => {
    let s = 0
    const text = c.text + (c.hint ?? '')
    // 路线选择：各策略必须选对路线
    if (event.id === 'enter_sect') {
      if (strategy === 'wander') { if (c.id === 'refuse') return 100; return -10 }
      if (c.id === 'refuse') return -10  // 非 wander 策略不选散修
      if (c.id === 'honest') return 100  // 默认走宗门
    }
    // 魔道选择
    if (c.id === 'accept' && (text.includes('魔') || text.includes('堕'))) {
      if (strategy === 'demon') s += 50
      else s -= 10
    }

    // 基础分：有修为收益的选择优先，避免随机选择卡死
    if (c.effects?.some((e) => e.type === 'cultivation')) s += 3
    if (c.effects?.some((e) => e.type === 'breakthrough')) s += 5
    if (c.outcomes) s += 1

    if (strategy === 'sect') {
      if (text.includes('宗门') || c.id === 'honest') s += 10
      if (c.id === 'refuse') s -= 8
    }
    if (strategy === 'romance') {
      // 浪漫选项高优先
      if (text.includes('道侣') || text.includes('苏') || text.includes('守护') || c.id === 'rescue') s += 10
      if (text.includes('双修') || text.includes('情缘') || text.includes('眷侣')) s += 8
      if (c.id === 'steal' || c.id === 'cold') s -= 5
      // 非浪漫事件：选择有修为收益的选项，避免随机卡死
      if (s === 0) {
        if (c.effects?.some((e) => e.type === 'cultivation')) s += 5
        if (c.effects?.some((e) => e.type === 'stat' && e.key === 'karma')) s += 3
        if (c.effects?.some((e) => e.type === 'stat' && e.key === 'demonHeart')) s -= 3
      }
    }
    if (strategy === 'cultivate' || strategy === 'greedy') {
      if (text.includes('打坐') || c.id === 'meditate' || c.id === 'contemplate') s += 8
      if (text.includes('炼丹') || c.id.includes('refine') || c.id === 'first_brew') s += 6
      if (c.id === 'body' || c.id === 'law') s += 5
    }
    if (strategy === 'greedy') {
      if (text.includes('灵石') || c.id === 'dig' || c.id === 'join' || c.id === 'buy') s += 5
      if (c.id === 'deep' || c.id === 'explore') s += 4
    }
    return s
  }

  if (strategy === 'random') {
    return viable[rng.randInt(0, viable.length - 1)].id
  }

  viable.sort((a, b) => score(b) - score(a))
  return viable[0].id
}

function startRun(strategy: Strategy, seed: number): RunReport {
  rng.setSeed(seed)
  let session = createNewGame({ name: '试玩', origin: strategy === 'wander' ? 'hermit' : 'noble_exile' })
  session = beginPlaying(session)

  const issues: string[] = []
  const eventCounts: Record<string, number> = {}
  let fillerCount = 0
  let stagnant = 0
  let lastSig = ''

  for (let guard = 0; guard < 120; guard++) {
    if (session.phase === 'ending') break

    if (session.phase === 'shop') {
      const affordable = ['spirit_gather', 'wash_marrow', 'lifespan_pill'].find(
        () => session.player.spiritStones >= 45,
      )
      if (affordable) session = purchaseShopItem(session, affordable)
      session = leaveShop(session)
      continue
    }

    const choiceId = pickChoice(session, strategy)
    if (!choiceId) {
      issues.push(`回合${session.turn}: 无可选选项`)
      break
    }

    const before = session.player
    const eventId = session.currentEvent?.id ?? '?'
    eventCounts[eventId] = (eventCounts[eventId] ?? 0) + 1
    if (FILLER_IDS.has(eventId)) fillerCount++

    session = resolveChoice(session, choiceId)

    const sig = `${session.player.realm}-${session.player.cultivation}-${session.player.age}`
    if (sig === lastSig && session.phase === 'playing') stagnant++
    lastSig = sig

    if (session.player.age >= session.player.lifespan && session.phase !== 'ending') {
      issues.push(`回合${session.turn}: 寿元耗尽未触发结局`)
    }
    if (session === before && session.phase === 'playing') {
      issues.push(`回合${session.turn}: 选择无效(${eventId}/${choiceId})`)
      break
    }
  }

  if (session.phase !== 'ending') {
    issues.push(`120回合内未结束(phase=${session.phase})`)
  }
  if (stagnant >= 8) issues.push(`修为长期停滞(${stagnant}次)`)

  const repeated = Object.entries(eventCounts).filter(
    ([id, n]) => n >= 4 && !FILLER_IDS.has(id),
  )
  for (const [id, n] of repeated) {
    if ((id as string) !== 'market_rest') issues.push(`事件重复过多: ${id} x${n}`)
  }

  const sys = session.player.cultivationSystems
  const systems = [
    sys.path !== 'balanced' ? sys.path : '',
    sys.alchemyTier ? `丹${sys.alchemyTier}` : '',
    sys.formationTier ? `阵${sys.formationTier}` : '',
    sys.divineSense > 15 ? `识${sys.divineSense}` : '',
    sys.spiritBeast ? `兽${sys.spiritBeast.tier}` : '',
    sys.techniques.length ? `功${sys.techniques.length}` : '',
    sys.divineWeapons.length ? `兵${sys.divineWeapons.length}` : '',
  ]
    .filter(Boolean)
    .join(',')

  const totalEvents = Object.values(eventCounts).reduce((a, b) => a + b, 0)

  return {
    strategy,
    seed,
    ending: session.ending?.title ?? null,
    turns: session.turn,
    age: session.player.age,
    realm: session.player.realm,
    fillerRatio: totalEvents ? fillerCount / totalEvents : 0,
    uniqueEvents: Object.keys(eventCounts).length,
    systems,
    issues,
  }
}

function auditEvents(): string[] {
  const issues: string[] = []
  for (const e of EVENTS) {
    if (e.choices.length === 0) issues.push(`事件无选项: ${e.id}`)
    for (const c of e.choices) {
      if (c.outcomes && !c.outcomes[0]?.narrative?.success) {
        issues.push(`${e.id}/${c.id}: 缺 success narrative`)
      }
    }
    if (e.rarity && !e.once && !e.maxTimes) {
      // rare repeating ok for some
    }
  }
  const onceRare = EVENTS.filter((e) => e.rarity === 'rare' && !e.once)
  if (onceRare.length) {
    issues.push(`稀有事件未设once: ${onceRare.map((e) => e.id).join(', ')}`)
  }
  return issues
}

console.log('=== CultGame 自动试玩 ===\n')

const strategies: Strategy[] = ['sect', 'wander', 'romance', 'cultivate', 'greedy', 'random']
const reports: RunReport[] = []

for (const strategy of strategies) {
  for (let i = 0; i < 4; i++) {
    reports.push(startRun(strategy, 1000 + i * 137 + strategies.indexOf(strategy) * 999))
  }
}

const audit = auditEvents()
if (audit.length) {
  console.log('【数据审计】')
  audit.forEach((a) => console.log(' -', a))
  console.log()
}

console.log('【各策略摘要】')
for (const strategy of strategies) {
  const runs = reports.filter((r) => r.strategy === strategy)
  const endings = [...new Set(runs.map((r) => r.ending))]
  const avgTurns = Math.round(runs.reduce((s, r) => s + r.turns, 0) / runs.length)
  const avgFiller = Math.round((runs.reduce((s, r) => s + r.fillerRatio, 0) / runs.length) * 100)
  const allIssues = runs.flatMap((r) => r.issues)
  console.log(`\n${strategy}:`)
  console.log(`  结局: ${endings.join(' / ')}`)
  console.log(`  均回合: ${avgTurns}  日常占比: ${avgFiller}%  养成: ${runs.map((r) => r.systems || '无').join(' | ')}`)
  if (allIssues.length) console.log(`  问题: ${[...new Set(allIssues)].join('; ')}`)
}

const pathExhausted = reports.filter((r) => r.ending === '道途搁浅').length
const noSystems = reports.filter((r) => !r.systems).length
console.log('\n【全局统计】')
console.log(`  道途搁浅: ${pathExhausted}/${reports.length}`)
console.log(`  未触发新养成: ${noSystems}/${reports.length}`)
console.log(`  总事件数: ${EVENTS.length}`)
