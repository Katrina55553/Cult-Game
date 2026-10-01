import { CHAPTERS } from '../src/data/chapters.ts'
import { EVENTS } from '../src/data/events.ts'
import { getArtifactInfo } from '../src/data/artifacts.ts'
import { applyEffects } from '../src/engine/effects.ts'
import { beginPlaying, createNewGame, resolveChoice } from '../src/engine/gameEngine.ts'
import { pickNextEvent } from '../src/engine/eventPicker.ts'
import { migrateSave } from '../src/engine/migrate.ts'
import {
  loadPersistedRewindState,
  persistRewindAvailable,
  persistRewindUsed,
} from '../src/hooks/useRewind.ts'
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
    console.log(`  ✖ ${label}${detail ? ` —— ${detail}` : ''}`)
    failures.push(label)
  }
}

function noopEvent(id: string): GameEvent {
  return {
    id,
    title: '回归测试事件',
    description: '仅用于验证状态转换。',
    weight: 1,
    choices: [{ id: 'continue', text: '继续', narrative: '继续前行。', effects: [] }],
  }
}

function baseSession(): GameSession {
  return beginPlaying(createNewGame({ name: '回归测试', origin: 'demon_blood', seed: 20261001 }))
}

console.log('=== 已知缺陷回归检查 ===\n')

console.log('1. 魔道赎罪后保持宗门路线')
{
  const base = baseSession()
  const lastMainId = 'demon_invasion'
  const staged: GameSession = {
    ...base,
    phase: 'playing',
    currentEvent: noopEvent(lastMainId),
    player: {
      ...base.player,
      currentChapter: 'demon_2',
      chapterCompleted: CHAPTERS.demon_2.events.filter((id) => id !== lastMainId),
      flags: {
        ...base.player.flags,
        accepted_demon_path: true,
        loyal_to_sect: false,
        refused_all_sects: false,
      },
      stats: { ...base.player.stats, demonHeart: 10, karma: 30 },
    },
  }
  const redeemed = resolveChoice(staged, 'continue')
  check('赎罪后进入宗门第七章', redeemed.player.currentChapter === 'sect_7', redeemed.player.currentChapter)
  check('进入宗门时清除魔道立场', !redeemed.player.flags.accepted_demon_path)

  const following = resolveChoice(
    { ...redeemed, currentEvent: noopEvent('sect_alliance'), phase: 'playing' },
    'continue',
  )
  check('下一回合不会反弹回魔道第一章', following.player.currentChapter !== 'demon_1', following.player.currentChapter)
}

console.log('\n2. 回溯状态可跨刷新恢复且已使用状态持久化')
{
  const snapshot = baseSession()
  persistRewindAvailable(snapshot)
  const available = loadPersistedRewindState()
  check('已有快照在刷新后仍可回溯', available.snapshot !== null && !available.used)

  persistRewindUsed()
  const used = loadPersistedRewindState()
  check('已使用状态在刷新后仍然保留', used.snapshot === null && used.used)

  localStorage.setItem('cultgame_rewind', JSON.stringify(snapshot))
  const legacy = loadPersistedRewindState()
  check('旧版纯快照格式仍按可回溯状态读取', legacy.snapshot !== null && !legacy.used)
}

console.log('\n3. 法宝始终以 canonical ID 保存')
{
  const player = baseSession().player
  const gained = applyEffects(player, [{ type: 'artifact', id: 'ancient_sword', name: '古剑' }])
  check('玩家状态保存法宝 ID', gained.artifacts[0] === 'ancient_sword', String(gained.artifacts[0]))
  check('法宝 ID 能查到完整详情', getArtifactInfo(gained.artifacts[0]).description !== '未知法宝')

  const gainedAgain = applyEffects(gained, [{ type: 'artifact', id: 'ancient_sword', name: '古剑别名' }])
  check('同一法宝 ID 不会因显示名不同而重复', gainedAgain.artifacts.length === 1, String(gainedAgain.artifacts.length))

  const migrated = migrateSave({
    ...baseSession(),
    player: {
      ...player,
      artifacts: ['古剑', 'ancient_sword', '星辰碎片'],
    },
  })
  check(
    '旧存档显示名会迁移并去重为 ID',
    migrated?.player.artifacts.join(',') === 'ancient_sword,celestial_fragment',
    migrated?.player.artifacts.join(','),
  )
}

console.log('\n4. 章节事件遵守统一资格规则')
{
  const base = baseSession().player
  const mortalDemon: PlayerState = {
    ...base,
    realm: 'mortal',
    currentChapter: 'demon_1',
    chapterCompleted: CHAPTERS.demon_1.events.filter((id) => id !== 'demon_nest'),
    flags: { ...base.flags, accepted_demon_path: true },
  }
  const picked = pickNextEvent(mortalDemon, EVENTS)
  check('凡人境不会抽到要求筑基阶段的主线', picked?.id !== 'demon_nest', String(picked?.id))

  const foundationDemon: PlayerState = { ...mortalDemon, realm: 'foundation' }
  check(
    '达到要求阶段后仍能抽到该主线',
    pickNextEvent(foundationDemon, EVENTS)?.id === 'demon_nest',
  )

  const repeatableSide: PlayerState = {
    ...base,
    currentChapter: 'sect_3',
    chapterCompleted: [...CHAPTERS.sect_3.events],
    history: ['alchemy_workshop', ...Array.from({ length: 10 }, (_, i) => `gap_${i}`)],
    flags: {
      ...base.flags,
      loyal_to_sect: false,
      mastered_alchemy: true,
      met_su_muyan: false,
    },
  }
  const side = pickNextEvent(repeatableSide, EVENTS)
  check('可重复支线在冷却结束且未达 maxTimes 时仍可出现', side?.id === 'alchemy_workshop', String(side?.id))

  const exhaustedSide: PlayerState = {
    ...repeatableSide,
    history: [
      'alchemy_workshop',
      'alchemy_workshop',
      ...Array.from({ length: 10 }, (_, i) => `gap_${i}`),
    ],
  }
  check(
    '达到 maxTimes 后支线不再出现',
    pickNextEvent(exhaustedSide, EVENTS)?.id !== 'alchemy_workshop',
  )
}

console.log('')
if (failures.length > 0) {
  console.error(`发现 ${failures.length} 项失败：`)
  for (const failure of failures) console.error(`  ✖ ${failure}`)
  process.exit(1)
}

console.log('✓ 已知缺陷回归检查全部通过')
