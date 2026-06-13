import { ENDINGS } from '../data/endings'
import { REALMS } from '../data/realms'
import { checkConditions } from './conditions'
import type { Condition, EndingProximity, PlayerState } from '../types/game'

function describeMissing(c: Condition): string {
  switch (c.type) {
    case 'stat':
      if (c.min !== undefined) {
        const names: Record<string, string> = {
          rootBone: '根骨',
          comprehension: '悟性',
          luck: '气运',
          karma: '因果',
          demonHeart: '心魔',
        }
        return `${names[c.key] ?? c.key}≥${c.min}`
      }
      return `心魔≤${c.max}`
    case 'realm':
      return `境界达${REALMS[c.min].name}`
    case 'flag':
      return c.value ? '达成特定剧情' : '未触发禁忌剧情'
    case 'resource':
      return `灵石≥${c.min}`
    case 'cultivation':
      return `修为≥${c.min}%`
    case 'lifespan_remaining':
      return '寿元将尽'
    default:
      return '未知条件'
  }
}

export function getClosestEndings(player: PlayerState, limit = 3): EndingProximity[] {
  const currentEndingIds = ENDINGS.filter((e) =>
    checkConditions(player, e.conditions),
  ).map((e) => e.id)

  const scored = ENDINGS.filter((e) => !currentEndingIds.includes(e.id))
    .map((ending) => {
      const missing = ending.conditions
        .filter((c) => !checkConditions(player, [c]))
        .map(describeMissing)
      const score = ending.conditions.length - missing.length
      return { endingId: ending.id, title: ending.title, missing, score }
    })
    .filter((e) => e.score > 0 && e.missing.length <= 3)
    .sort((a, b) => b.score - a.score || a.missing.length - b.missing.length)

  return scored.slice(0, limit)
}
