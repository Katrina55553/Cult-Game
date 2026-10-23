import type { PlayerState } from '../types/game'
import { STORYLINES, type Storyline } from '../data/storylines'

export interface StorylineProgress {
  storyline: Storyline
  completedSteps: number
  totalSteps: number
  currentLabel: string | null
  nextLabel: string | null
  percent: number
  completedFlags: string[]
  nextFlag: string | null
}

export function getActiveStorylines(player: PlayerState): StorylineProgress[] {
  const results: StorylineProgress[] = []

  for (const sl of STORYLINES) {
    if (sl.entryCheck && !sl.entryCheck(player)) continue

    const completedSteps = sl.steps.map((step) => {
      const flagSet = !!player.flags[step.flag]
      const extra = step.extraCheck ? step.extraCheck(player) : true
      return flagSet && extra
    })
    const completed = completedSteps.filter(Boolean).length

    const total = sl.steps.length
    const currentIndex = completedSteps.findLastIndex(Boolean)
    const currentStep = sl.steps[currentIndex]
    const nextStep = sl.steps[currentIndex + 1]

    results.push({
      storyline: sl,
      completedSteps: completed,
      totalSteps: total,
      currentLabel: currentStep?.label ?? null,
      nextLabel: nextStep?.label ?? null,
      percent: total > 0 ? Math.round((completed / total) * 100) : 0,
      completedFlags: sl.steps.filter((_, index) => completedSteps[index]).map((step) => step.flag),
      nextFlag: nextStep?.flag ?? null,
    })
  }

  return results
}
