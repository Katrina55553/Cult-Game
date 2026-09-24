/**
 * 章节推进回归检查 —— 覆盖「跨路线切换后主线事件早已被消耗」的卡死场景。
 *
 * 背景：`pickNextEvent` 对 `once` 事件一旦出现在 history 中就直接跳过，而每次章节跳转
 * 都会清空 `chapterCompleted`。于是同一事件若横跨两条路线（如 beast_attack 既是宗门第三章
 * 主线、又是散修第一章主线），后到的章节会永久无法完成，整局再也推不到下一章。
 * 引擎侧由 `reconcileChapterProgress` 补记兜底，本脚本锁定该行为不再回退。
 *
 * Run: npx tsx scripts/check-chapter-progress.ts
 */
import { CHAPTERS } from '../src/data/chapters.ts'
import { EVENTS } from '../src/data/events.ts'
import {
  beginPlaying,
  createNewGame,
  loadGame,
  resolveChoice,
  saveGame,
} from '../src/engine/gameEngine.ts'
import { pickNextEvent } from '../src/engine/eventPicker.ts'
import { checkConditions } from '../src/engine/conditions.ts'
import type { GameSession, PlayerState } from '../src/types/game.ts'

const store = new Map<string, string>()
;(globalThis as unknown as { localStorage: Storage }).localStorage = {
  getItem: (key: string) => store.get(key) ?? null,
  setItem: (key: string, value: string) => void store.set(key, String(value)),
  removeItem: (key: string) => void store.delete(key),
  clear: () => store.clear(),
  key: () => null,
  length: 0,
} as Storage

const EVENT_BY_ID = new Map(EVENTS.map((event) => [event.id, event]))
const failures: string[] = []

function check(label: string, condition: boolean, detail = ''): void {
  if (condition) {
    console.log(`  ✓ ${label}`)
  } else {
    console.log(`  ✖ ${label}${detail ? ` —— ${detail}` : ''}`)
    failures.push(label)
  }
}

/** 把局面直接摆到「本章只剩最后一个主线事件」的状态 */
function stage(
  session: GameSession,
  chapterId: string,
  options: {
    history: string[]
    flags: Record<string, boolean>
    lastMainId: string
    stats?: Partial<PlayerState['stats']>
  },
): GameSession {
  const chapter = CHAPTERS[chapterId]
  const lastMainId = options.lastMainId
  const player: PlayerState = {
    ...session.player,
    currentChapter: chapterId,
    chapterCompleted: chapter.events.filter((id) => id !== lastMainId),
    history: [...options.history],
    flags: { ...session.player.flags, ...options.flags },
    stats: { ...session.player.stats, ...options.stats },
  }
  return {
    ...session,
    phase: 'playing',
    player,
    currentEvent: EVENT_BY_ID.get(lastMainId) ?? null,
    turn: 0,
  }
}

function firstViableChoiceId(session: GameSession): string | null {
  const event = session.currentEvent
  if (!event) return null
  const viable = event.choices.find((c) => checkConditions(session.player, c.requirements))
  return viable?.id ?? null
}

function play(session: GameSession): GameSession {
  const choiceId = firstViableChoiceId(session)
  if (!choiceId) throw new Error(`事件 ${session.currentEvent?.id} 没有可选选项`)
  return resolveChoice(session, choiceId)
}

console.log('=== 章节推进回归检查 ===\n')

// ── 1. 宗门第四章叛逃 → 散修第一章（beast_attack 已在宗门第三章消耗）──
console.log('1. 宗门第四章叛逃 → 散修第一章')
{
  const session = stage(beginPlaying(createNewGame({ name: '测试', origin: 'noble_exile', seed: 20260924 })), 'sect_4', {
    history: ['enter_sect', 'beast_attack'],
    flags: { loyal_to_sect: true, zhao_enemy: true },
    lastMainId: 'boss_wolf_king',
    stats: { demonHeart: 40 },
  })
  const next = play(session)
  check('切换到了散修第一章', next.player.currentChapter === 'wander_1', next.player.currentChapter)
  check(
    'beast_attack 被补记为已完成',
    next.player.chapterCompleted.includes('beast_attack'),
    `chapterCompleted=[${next.player.chapterCompleted.join(', ')}]`,
  )
  const picked = pickNextEvent(next.player, EVENTS, [], false)
  check('本章仍能继续抽出事件', picked !== null, String(picked?.id))
}

// ── 2. 魔道第一章 → 宗门第八章（demon_temptation 已在魔道第一章消耗）──
console.log('\n2. 魔道转正道 → 宗门第八章')
{
  const session = stage(beginPlaying(createNewGame({ name: '测试', origin: 'demon_blood', seed: 20260924 })), 'sect_7', {
    history: ['enter_sect', 'demon_temptation'],
    flags: { loyal_to_sect: true },
    lastMainId: 'boss_demon_general',
    stats: { demonHeart: 45 },
  })
  const next = play(session)
  check('推进到了宗门第八章', next.player.currentChapter === 'sect_8', next.player.currentChapter)
  check(
    'demon_temptation 被补记为已完成',
    next.player.chapterCompleted.includes('demon_temptation'),
    `chapterCompleted=[${next.player.chapterCompleted.join(', ')}]`,
  )
}

// ── 3. 散修第三章 → 宗门第五章（ancient_legacy / secret_realm 已作支线消耗）──
console.log('\n3. 散修转正道 → 宗门第五章')
{
  const session = stage(beginPlaying(createNewGame({ name: '测试', origin: 'noble_exile', seed: 20260924 })), 'wander_3', {
    history: ['enter_sect', 'wander_market', 'ancient_legacy', 'secret_realm'],
    flags: { refused_all_sects: true },
    lastMainId: 'spirit_flood',
    stats: { karma: 40, demonHeart: 0 },
  })
  const next = play(session)
  check('切换到了宗门第五章', next.player.currentChapter === 'sect_5', next.player.currentChapter)
  check(
    'ancient_legacy 被补记为已完成',
    next.player.chapterCompleted.includes('ancient_legacy'),
    `chapterCompleted=[${next.player.chapterCompleted.join(', ')}]`,
  )
  check(
    'secret_realm 被补记为已完成',
    next.player.chapterCompleted.includes('secret_realm'),
    `chapterCompleted=[${next.player.chapterCompleted.join(', ')}]`,
  )
}

// ── 4. 旧存档修复：卡在宗门第八章的存档读档后应能继续推进 ──
console.log('\n4. 旧存档读档修复')
{
  const session = stage(beginPlaying(createNewGame({ name: '测试', origin: 'noble_exile', seed: 20260924 })), 'sect_8', {
    history: ['enter_sect', 'demon_temptation'],
    flags: { loyal_to_sect: true },
    lastMainId: 'boss_thunder_beast',
  })
  const stuck: GameSession = {
    ...session,
    player: {
      ...session.player,
      chapterCompleted: CHAPTERS.sect_8.events.filter((id) => id !== 'demon_temptation'),
    },
  }
  saveGame(stuck)
  const loaded = loadGame()
  check('存档读取成功', loaded !== null)
  check(
    '读档时补记了 demon_temptation',
    !!loaded?.player.chapterCompleted.includes('demon_temptation'),
    `chapterCompleted=[${loaded?.player.chapterCompleted.join(', ')}]`,
  )
}

// ── 5. 反向保护：正常情况下不得凭空补记未发生的事件 ──
console.log('\n5. 反向保护')
{
  const session = stage(beginPlaying(createNewGame({ name: '测试', origin: 'noble_exile', seed: 20260924 })), 'sect_4', {
    history: ['enter_sect'],
    flags: { loyal_to_sect: true },
    lastMainId: 'boss_wolf_king',
  })
  const next = play(session)
  check('正常走完第四章后进入第五章', next.player.currentChapter === 'sect_5', next.player.currentChapter)
  check(
    '未发生过的主线不会被补记',
    !next.player.chapterCompleted.includes('beast_attack')
      && !next.player.chapterCompleted.includes('ancient_legacy'),
    `chapterCompleted=[${next.player.chapterCompleted.join(', ')}]`,
  )
}

console.log('')
if (failures.length) {
  console.error(`发现 ${failures.length} 项失败：`)
  for (const f of failures) console.error(`  ✖ ${f}`)
  process.exit(1)
}
console.log('✓ 章节推进回归检查全部通过')
