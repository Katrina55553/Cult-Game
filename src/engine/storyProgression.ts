import { CHAPTERS, getChapter, getFirstChapter } from '../data/chapters'
import { EVENTS } from '../data/events'
import type { PlayerState, RouteId } from '../types/game'
import { isEventPermanentlyUnavailable } from './eventPicker'

const EVENT_BY_ID = new Map(EVENTS.map((event) => [event.id, event]))

const ROUTE_HISTORY_FLAGS: Record<RouteId, string> = {
  sect: 'ever_joined_sect',
  wander: 'ever_walked_wander_path',
  demon: 'ever_walked_demon_path',
}

const ROUTE_TRANSITION_LOGS: Record<RouteId, string> = {
  sect: '你决定加入宗门，踏上新的道路。',
  wander: '你离开宗门，独行于天地之间。',
  demon: '你踏入魔道，再无回头之路。',
}

export function getCurrentRoute(player: Pick<PlayerState, 'currentChapter'>): RouteId | null {
  return getChapter(player.currentChapter)?.route ?? null
}

function markRouteVisited(player: PlayerState, route: RouteId): PlayerState {
  const flag = ROUTE_HISTORY_FLAGS[route]
  if (player.flags[flag]) return player
  return { ...player, flags: { ...player.flags, [flag]: true } }
}

function reconcileChapterProgress(player: PlayerState): PlayerState {
  const chapter = getChapter(player.currentChapter)
  if (!chapter) return player

  const completed = [...player.chapterCompleted]
  for (const eventId of chapter.events) {
    if (completed.includes(eventId)) continue
    const event = EVENT_BY_ID.get(eventId)
    if (event && isEventPermanentlyUnavailable(player, event, EVENTS)) completed.push(eventId)
  }

  if (completed.length === player.chapterCompleted.length) return player
  return { ...player, chapterCompleted: completed }
}

function enterChapter(player: PlayerState, nextChapterId: string): PlayerState {
  const nextChapter = CHAPTERS[nextChapterId]
  if (!nextChapter) return player

  const currentRoute = getCurrentRoute(player)
  const routeSwitched = currentRoute !== null && currentRoute !== nextChapter.route
  let next: PlayerState = {
    ...player,
    currentChapter: nextChapterId,
    chapterCompleted: [],
    routeIntent: undefined,
    flags: {
      ...player.flags,
      route_switched: player.flags.route_switched || routeSwitched,
    },
    log: [...player.log, `— ${nextChapter.name} —`],
  }
  next = markRouteVisited(next, nextChapter.route)

  if (nextChapter.intro) next.log.push(nextChapter.intro)
  if (routeSwitched) next.log.push(ROUTE_TRANSITION_LOGS[nextChapter.route])

  return reconcileChapterProgress(next)
}

function tryAdvanceChapter(player: PlayerState, depth = 0): PlayerState {
  const chapter = getChapter(player.currentChapter)
  if (!chapter) return player
  if (!chapter.events.every((eventId) => player.chapterCompleted.includes(eventId))) return player

  const nextChapterId = chapter.branchNext ? chapter.branchNext(player) : chapter.nextChapter
  if (!nextChapterId || !CHAPTERS[nextChapterId]) return player

  const entered = enterChapter(player, nextChapterId)
  if (depth >= 16) return entered
  return tryAdvanceChapter(entered, depth + 1)
}

function consumeRouteIntent(player: PlayerState): PlayerState {
  const route = player.routeIntent
  if (!route) return player

  const currentRoute = getCurrentRoute(player)
  const marked = markRouteVisited({ ...player, routeIntent: undefined }, route)
  if (route === currentRoute) return marked
  return enterChapter(marked, getFirstChapter(route))
}

export function advanceStory(player: PlayerState, completedEventId: string): PlayerState {
  const previousChapter = player.currentChapter
  let next = consumeRouteIntent(player)

  if (next.currentChapter !== previousChapter) {
    return tryAdvanceChapter(reconcileChapterProgress(next))
  }

  const chapter = getChapter(next.currentChapter)
  if (!chapter) return next
  if (chapter.events.includes(completedEventId) && !next.chapterCompleted.includes(completedEventId)) {
    next = { ...next, chapterCompleted: [...next.chapterCompleted, completedEventId] }
  }
  return tryAdvanceChapter(reconcileChapterProgress(next))
}

export function repairStoryProgress(player: PlayerState): PlayerState {
  const currentChapter = CHAPTERS[player.currentChapter] ? player.currentChapter : 'sect_1'
  const chapter = CHAPTERS[currentChapter]
  const validCompleted = [...new Set(player.chapterCompleted)].filter((id) => chapter.events.includes(id))
  let repaired: PlayerState = {
    ...player,
    currentChapter,
    chapterCompleted: validCompleted,
    routeIntent: undefined,
  }
  repaired = markRouteVisited(repaired, chapter.route)
  return tryAdvanceChapter(reconcileChapterProgress(repaired))
}

export function isRouteExhausted(player: PlayerState): boolean {
  const chapter = getChapter(player.currentChapter)
  if (!chapter) return true
  if (!chapter.events.every((id) => player.chapterCompleted.includes(id))) return false
  return !chapter.nextChapter && !chapter.branchNext
}
