import type { Chapter, SharedChapterEvent } from '../data/chapters'
import type { GameEvent, RouteId } from '../types/game'

export interface ValidationIssue {
  type: 'error' | 'warning'
  message: string
}

export function validateChapterRegistrations(
  events: GameEvent[],
  chapters: Record<string, Chapter>,
  sharedEvents: Record<string, SharedChapterEvent>,
): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  const eventMap = new Map(events.map((event) => [event.id, event]))
  const registeredIn = new Map<string, { chapter: Chapter; main: boolean }[]>()
  const routeFlags: Partial<Record<string, RouteId>> = {
    loyal_to_sect: 'sect', refused_all_sects: 'wander', accepted_demon_path: 'demon',
  }

  for (const chapter of Object.values(chapters)) {
    const seen = new Set<string>()
    for (const [ids, main] of [
      [chapter.events, true], [chapter.sideEvents ?? [], false], [chapter.triggeredEvents ?? [], false],
    ] as const) {
      for (const id of ids) {
        if (seen.has(id)) {
          issues.push({ type: 'error', message: `章节 ${chapter.id} 重复登记事件 ${id}` })
        }
        seen.add(id)
        const registrations = registeredIn.get(id) ?? []
        registrations.push({ chapter, main })
        registeredIn.set(id, registrations)
        for (const condition of eventMap.get(id)?.conditions ?? []) {
          const incompatible = condition.type === 'route'
            ? condition.route !== chapter.route
            : condition.type === 'flag' && routeFlags[condition.key]
              ? (routeFlags[condition.key] === chapter.route) !== condition.value
              : false
          if (incompatible) {
            issues.push({ type: 'error', message: `章节 ${chapter.id} 的事件 ${id} 存在与 ${chapter.route} 路线互斥的条件` })
          }
        }
      }
    }
  }

  for (const [id, registrations] of registeredIn) {
    if (!eventMap.get(id)?.once || !registrations.some((entry) => entry.main)) continue
    if (new Set(registrations.map((entry) => entry.chapter.id)).size < 2) continue
    if (!sharedEvents[id]) {
      issues.push({ type: 'warning', message: `一次性主线事件 ${id} 被多个章节登记，但没有声明跨路线复用用途` })
    }
  }

  for (const [id, shared] of Object.entries(sharedEvents)) {
    const registrations = registeredIn.get(id) ?? []
    const actual = new Set(registrations.map((entry) => entry.chapter.id))
    const declared = new Set(shared.chapters)
    if (!eventMap.get(id)?.once || !registrations.some((entry) => entry.main)) {
      issues.push({ type: 'error', message: `共享事件 ${id} 必须存在且为一次性主线事件` })
    }
    if (!shared.reason.trim()) {
      issues.push({ type: 'error', message: `共享事件 ${id} 必须说明跨路线复用用途` })
    }
    if (declared.size < 2 || declared.size !== shared.chapters.length
      || actual.size !== declared.size || [...declared].some((chapter) => !actual.has(chapter))) {
      issues.push({ type: 'error', message: `共享事件 ${id} 的章节声明与实际登记不一致` })
    }
    const routes = registrations.map((entry) => entry.chapter.route)
    if (new Set(routes).size !== registrations.length) {
      issues.push({ type: 'error', message: `共享事件 ${id} 只能在不同路线间复用，同一路线不得重复登记` })
    }
  }

  return issues
}
