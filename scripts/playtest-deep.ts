import { EVENTS } from '../src/data/events.ts'
import { beginPlaying, createNewGame, leaveShop, resolveChoice } from '../src/engine/gameEngine.ts'
import { checkConditions } from '../src/engine/conditions.ts'
import * as rng from '../src/engine/rng.ts'
import type { GameSession } from '../src/types/game.ts'

const PRIORITY: Record<string, string[]> = {
  enter_sect: ['refuse'],
  beast_attack: ['tame', 'fight'],
  market_rest: ['browse', 'skip'],
  cultivation_path: ['law'],
  jade_pool_encounter: ['guard'],
  dual_cultivation: ['deep'],
  lovers_ascension: ['ascend_together'],
  alchemy_master: ['refine'],
}

function pick(session: GameSession): string | null {
  const e = session.currentEvent
  if (!e) return null
  const prefs = PRIORITY[e.id]
  if (prefs) {
    for (const id of prefs) {
      const c = e.choices.find((x) => x.id === id)
      if (c && checkConditions(session.player, c.requirements)) return id
    }
  }
  const viable = e.choices.filter((c) => checkConditions(session.player, c.requirements))
  return viable[0]?.id ?? e.choices[0]?.id ?? null
}

rng.setSeed(42)
let s = beginPlaying(createNewGame({ name: '情缘', origin: 'noble_exile' }))
const seen: string[] = []
const ending = { title: '' }

for (let i = 0; i < 100; i++) {
  if (s.phase === 'ending') {
    ending.title = s.ending?.title ?? ''
    break
  }
  if (s.phase === 'shop') {
    s = leaveShop(s)
    continue
  }
  const id = s.currentEvent?.id
  if (id) seen.push(id)
  const choice = pick(s)
  if (!choice) break
  s = resolveChoice(s, choice)
}

console.log('情缘优先局:', ending.title, '回合', s.turn, '岁', s.player.age, s.player.realm)
console.log('养成:', JSON.stringify(s.player.cultivationSystems))
console.log('flags:', Object.entries(s.player.flags).filter(([, v]) => v).map(([k]) => k).join(', '))

const eligible = (player: typeof s.player) =>
  EVENTS.filter((e) => {
    if (e.once && player.history.includes(e.id)) return false
    return checkConditions(player, e.conditions)
  }).length

console.log('终局时可触发事件数:', eligible(s.player))
console.log('历史事件种类:', new Set(seen).size, '/', seen.length, '总触发')
