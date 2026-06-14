import { useState } from 'react'
import { getActiveStorylines } from '../engine/storylineTracker'
import type { PlayerState } from '../types/game'

const TONE_COLORS: Record<string, { bar: string; text: string; border: string }> = {
  jade: {
    bar: 'bg-[var(--color-jade)]',
    text: 'text-[var(--color-jade-light)]',
    border: 'border-[var(--color-jade)]/20',
  },
  gold: {
    bar: 'bg-[var(--color-gold)]',
    text: 'text-[var(--color-gold)]',
    border: 'border-[var(--color-gold)]/20',
  },
  cinnabar: {
    bar: 'bg-[var(--color-cinnabar)]',
    text: 'text-[var(--color-cinnabar-glow)]',
    border: 'border-[var(--color-cinnabar)]/20',
  },
  mist: {
    bar: 'bg-[var(--color-mist)]',
    text: 'text-[var(--color-mist)]',
    border: 'border-[var(--color-mist)]/20',
  },
}

interface Props {
  player: PlayerState
}

export function StorylinePanel({ player }: Props) {
  const [expanded, setExpanded] = useState(false)
  const storylines = getActiveStorylines(player)

  const sorted = [...storylines].sort((a, b) => b.percent - a.percent)

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between text-xs text-[var(--color-mist)] hover:text-[var(--color-parchment)]
          cursor-pointer transition-colors py-1"
      >
        <span>📜 剧情线 ({storylines.length})</span>
        <span className="text-[10px]">{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <div className="space-y-2.5 mt-2">
          {sorted.length === 0 && (
            <p className="text-[10px] text-[var(--color-mist)]/50 italic px-1">
              尚无剧情线开启，做出选择后将逐步解锁……
            </p>
          )}
          {sorted.map((sp) => {
            const colors = TONE_COLORS[sp.storyline.tone] ?? TONE_COLORS.mist
            return (
              <div key={sp.storyline.id} className={`border ${colors.border} rounded-sm px-3 py-2`}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-xs font-medium ${colors.text}`}>
                    {sp.storyline.name}
                  </span>
                  <span className="text-[10px] text-[var(--color-mist)]">
                    {sp.completedSteps}/{sp.totalSteps}
                  </span>
                </div>

                <div className="h-1 bg-[rgba(0,0,0,0.3)] rounded-full overflow-hidden mb-1.5">
                  <div
                    className={`h-full ${colors.bar} transition-all duration-500 rounded-full`}
                    style={{ width: `${sp.percent}%` }}
                  />
                </div>

                <div className="flex flex-wrap gap-1">
                  {sp.storyline.steps.map((step, i) => {
                    const done = i < sp.completedSteps
                    const isCurrent = i === sp.completedSteps
                    return (
                      <span
                        key={step.flag}
                        className={`text-[10px] px-1.5 py-0.5 rounded-sm ${
                          done
                            ? `${colors.text} opacity-80`
                            : isCurrent
                              ? 'text-[var(--color-parchment)] border border-[var(--color-gold)]/30'
                              : 'text-[var(--color-mist)]/40'
                        }`}
                      >
                        {done ? '✓' : isCurrent ? '►' : '○'} {step.label}
                      </span>
                    )
                  })}
                </div>

                {sp.nextLabel && (
                  <p className="text-[10px] text-[var(--color-mist)]/60 mt-1.5 italic">
                    下一步：{sp.nextLabel}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
