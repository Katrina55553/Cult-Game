import { ARTIFACTS } from '../src/data/artifacts'
import { CHAPTERS } from '../src/data/chapters'
import { EVENTS } from '../src/data/events'
import { STORYLINES } from '../src/data/storylines'
import type { Choice, Effect, GameEvent } from '../src/types/game'

interface ValidationIssue {
  type: 'error' | 'warning'
  message: string
}

/** 各路线**不**该出现的主线前置 flag：出现即说明事件放错了路线 */
const ROUTE_CONFLICT_FLAGS: Record<string, string[]> = {
  sect: ['refused_all_sects', 'accepted_demon_path'],
  wander: ['loyal_to_sect', 'accepted_demon_path'],
  demon: ['loyal_to_sect', 'refused_all_sects'],
}

function validateGameData(): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  const eventMap = new Map<string, GameEvent>()
  const choiceIds = new Set<string>()

  // 1. 事件 ID 唯一性
  for (const event of EVENTS) {
    if (eventMap.has(event.id)) {
      issues.push({ type: 'error', message: `事件 ID 重复：${event.id}` })
    } else {
      eventMap.set(event.id, event)
    }
  }

  // 2. 每个事件内 choice ID 唯一性
  for (const event of EVENTS) {
    const seen = new Set<string>()
    for (const choice of event.choices) {
      if (seen.has(choice.id)) {
        issues.push({ type: 'error', message: `事件 ${event.id} 内 choice ID 重复：${choice.id}` })
      }
      seen.add(choice.id)
      const globalId = `${event.id}:${choice.id}`
      if (choiceIds.has(globalId)) {
        issues.push({ type: 'warning', message: `跨事件 choice ID 重复：${globalId}` })
      }
      choiceIds.add(globalId)
    }
  }

  // 3. 章节引用的事件必须存在
  for (const chapter of Object.values(CHAPTERS)) {
    for (const eventId of chapter.events) {
      if (!eventMap.has(eventId)) {
        issues.push({ type: 'error', message: `章节 ${chapter.id} 引用了不存在的事件：${eventId}` })
      }
    }
    for (const eventId of chapter.sideEvents ?? []) {
      if (!eventMap.has(eventId)) {
        issues.push({ type: 'error', message: `章节 ${chapter.id} 的 sideEvents 引用了不存在的事件：${eventId}` })
      }
    }
  }

  // 4. artifact 效果中引用的 ID 必须已注册
  for (const event of EVENTS) {
    for (const choice of event.choices) {
      const effects = collectEffects(choice)
      for (const effect of effects) {
        if (effect.type === 'artifact' && effect.id && !ARTIFACTS[effect.id]) {
          issues.push({ type: 'error', message: `事件 ${event.id} 的 choice ${choice.id} 使用了未注册的 artifact：${effect.id}` })
        }
      }
    }
  }

  // 5. 检查 storyGroup 是否有效（非空字符串）
  const storyGroups = new Set<string>()
  for (const event of EVENTS) {
    if (event.storyGroup) storyGroups.add(event.storyGroup)
  }
  for (const event of EVENTS) {
    if (event.storyGroup && event.storyGroup.trim() === '') {
      issues.push({ type: 'warning', message: `事件 ${event.id} 的 storyGroup 为空字符串` })
    }
  }

  // 6. 警告：无 choices 的事件
  for (const event of EVENTS) {
    if (event.choices.length === 0) {
      issues.push({ type: 'warning', message: `事件 ${event.id} 没有任何 choice` })
    }
  }

  // 7. 章节主线必须与所在路线相容
  //
  // 章节推进要求 `events` 全部完成，因此任何一个「条件永远无法满足」的主线都会让该章
  // 永久卡死——整局再也收不了尾，只能靠死亡结束。历史上这条规则缺失时，
  // 曾有 5 个章节中招（wander_6 / sect_6 / sect_9 / demon_4 / sect_8），
  // 直接导致全部飞升类结局不可达。此处把它变成可自动检出的错误。
  for (const chapter of Object.values(CHAPTERS)) {
    const conflictingFlags = ROUTE_CONFLICT_FLAGS[chapter.route] ?? []
    for (const eventId of chapter.events) {
      const event = eventMap.get(eventId)
      if (!event) continue
      for (const cond of event.conditions ?? []) {
        if (cond.type === 'flag' && cond.value === true && conflictingFlags.includes(cond.key)) {
          issues.push({
            type: 'error',
            message: `章节 ${chapter.id}（${chapter.route} 线）的主线 ${eventId} 要求 ${cond.key}=true，与所在路线互斥，该章永远无法完成 → 应移入 sideEvents`,
          })
        }
        if (cond.type === 'lifespan_remaining') {
          issues.push({
            type: 'error',
            message: `章节 ${chapter.id} 的主线 ${eventId} 要求剩余寿命 ≤${String(cond.max)}，只有濒死时才满足，该章无法正常完成 → 应移入 sideEvents`,
          })
        }
        if (cond.type === 'stat' && cond.key === 'demonHeart' && cond.min !== undefined && chapter.route !== 'demon') {
          issues.push({
            type: 'error',
            message: `章节 ${chapter.id}（${chapter.route} 线）的主线 ${eventId} 要求心魔 ≥${cond.min}，正道玩法无法满足，该章会永久卡死 → 应移入 sideEvents`,
          })
        }
        if (cond.type === 'stat' && cond.key === 'karma' && cond.min !== undefined && chapter.route === 'demon') {
          issues.push({
            type: 'error',
            message: `章节 ${chapter.id}（魔道线）的主线 ${eventId} 要求善业 ≥${cond.min}，与魔道路线互斥，该章会永久卡死 → 应移入 sideEvents`,
          })
        }
      }
    }
  }

  // 8. 跨章节重复登记「只出现一次」的事件
  //
  // `pickNextEvent` 对 `once` 事件一旦出现在 `history` 中就直接跳过，而每次章节跳转
  // 都会清空 `chapterCompleted`。于是同一事件若既是 A 章主线、又被 B 章登记，B 章就抽不到它、
  // 也无法把它计为完成。引擎侧 `reconcileChapterProgress` 会自动补记（所以不再会卡死），
  // 但代价是**玩家静默少看一个主线节拍**——所以这里仍然报警，提醒作者收敛到一处。
  // 只有「既是主线、又在多处登记」才值得报；纯支线之间的复用不影响推进。
  const registeredIn = new Map<string, { main: string[]; side: string[] }>()
  for (const chapter of Object.values(CHAPTERS)) {
    for (const eventId of chapter.events) {
      const entry = registeredIn.get(eventId) ?? { main: [], side: [] }
      entry.main.push(chapter.id)
      registeredIn.set(eventId, entry)
    }
    for (const eventId of chapter.sideEvents ?? []) {
      const entry = registeredIn.get(eventId) ?? { main: [], side: [] }
      if (entry.main.includes(chapter.id)) {
        issues.push({
          type: 'error',
          message: `章节 ${chapter.id} 同时把 ${eventId} 列进 events 和 sideEvents，主线判定会与自身冲突`,
        })
      }
      entry.side.push(chapter.id)
      registeredIn.set(eventId, entry)
    }
  }
  for (const [eventId, where] of registeredIn) {
    if (eventMap.get(eventId)?.once !== true) continue
    if (where.main.length === 0) continue
    if (where.main.length + where.side.length < 2) continue
    issues.push({
      type: 'warning',
      message: `事件 ${eventId} 是 once 主线，却还被别章登记（主线[${where.main.join(', ')}] 支线[${where.side.join(', ') || '无'}]）`
        + '：先被消耗的章节会让后到的章节静默跳过这个节拍 → 建议只登记一处',
    })
  }

  // 9. 剧情线的每个步骤 flag 必须有来源
  //
  // `storylineTracker` 用 `player.flags[step.flag]` 判断步骤是否完成。若某个 step flag
  // 从未被任何事件设置过，玩家在「剧情线」面板里会看到进度永远停在倒数第二步。
  // 历史上 10 条连锁剧情线里有 7 条中招（步骤 flag 名取了事件 id，但事件实际设的是别的 flag）。
  const sourceFlags = new Set<string>()
  for (const event of EVENTS) {
    for (const choice of event.choices) {
      for (const effect of collectEffects(choice)) {
        if (effect.type === 'flag') sourceFlags.add(effect.key)
      }
    }
  }
  for (const storyline of STORYLINES) {
    for (const step of storyline.steps) {
      if (sourceFlags.has(step.flag)) continue
      issues.push({
        type: 'error',
        message: `剧情线 ${storyline.id}（${storyline.name}）的步骤「${step.label}」要求 flag ${step.flag}，但没有任何事件设置它 → 该步骤永远无法点亮`,
      })
    }
  }

  return issues
}

function collectEffects(choice: Choice): Effect[] {
  const effects: Effect[] = []
  if (choice.effects) effects.push(...choice.effects)
  for (const outcome of choice.outcomes ?? []) {
    effects.push(...outcome.successEffects)
    effects.push(...outcome.failEffects)
  }
  return effects
}

const issues = validateGameData()
const errors = issues.filter((i) => i.type === 'error')
const warnings = issues.filter((i) => i.type === 'warning')

if (errors.length > 0) {
  console.error(`发现 ${errors.length} 个错误：`)
  for (const issue of errors) console.error(`  ✖ ${issue.message}`)
}
if (warnings.length > 0) {
  console.warn(`发现 ${warnings.length} 个警告：`)
  for (const issue of warnings) console.warn(`  ⚠ ${issue.message}`)
}

if (errors.length === 0 && warnings.length === 0) {
  console.log('✓ 游戏数据校验通过')
} else if (errors.length > 0) {
  process.exit(1)
}
