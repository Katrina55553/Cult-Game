import { ARTIFACTS } from '../src/data/artifacts'
import { CHAPTERS } from '../src/data/chapters'
import { EVENTS } from '../src/data/events'
import type { Choice, Effect, GameEvent } from '../src/types/game'

interface ValidationIssue {
  type: 'error' | 'warning'
  message: string
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
