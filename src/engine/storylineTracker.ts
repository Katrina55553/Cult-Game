import type { PlayerState } from '../types/game'
import { STORYLINES, type Storyline } from '../data/storylines'

export interface StorylineProgress {
  storyline: Storyline
  completedSteps: number
  totalSteps: number
  currentLabel: string | null
  nextLabel: string | null
  percent: number
}

export function getActiveStorylines(player: PlayerState): StorylineProgress[] {
  const results: StorylineProgress[] = []

  for (const sl of STORYLINES) {
    if (sl.entryCheck && !sl.entryCheck(player)) continue

    let completed = 0
    for (const step of sl.steps) {
      const flagSet = !!player.flags[step.flag]
      const extra = step.extraCheck ? step.extraCheck(player) : true
      if (flagSet && extra) completed++
    }

    const total = sl.steps.length
    const currentStep = completed > 0 ? sl.steps[completed - 1] : null
    const nextStep = completed < total ? sl.steps[completed] : null

    results.push({
      storyline: sl,
      completedSteps: completed,
      totalSteps: total,
      currentLabel: currentStep?.label ?? null,
      nextLabel: nextStep?.label ?? null,
      percent: total > 0 ? Math.round((completed / total) * 100) : 0,
    })
  }

  return results
}
