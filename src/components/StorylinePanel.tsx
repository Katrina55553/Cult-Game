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
  open: boolean
  onClose: () => void
}

export function StorylinePanel({ player, open, onClose }: Props) {
  if (!open) return null

  const storylines = getActiveStorylines(player)
  const sorted = [...storylines].sort((a, b) => b.percent - a.percent)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" onClick={onClose}>
      <div
        className="max-w-lg w-full h-[520px] border border-[var(--color-jade)]/40 bg-[var(--color-ink)] p-6 rounded-sm animate-slide-up flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl text-[var(--color-gold)]" style={{ fontFamily: 'var(--font-display)' }}>
            📜 剧情线
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-[var(--color-mist)] hover:text-[var(--color-parchment)] cursor-pointer border border-[var(--color-mist)]/20 px-3 py-1 rounded-sm"
          >
            关闭
          </button>
        </div>

        {sorted.length === 0 ? (
          <p className="text-sm text-[var(--color-mist)] text-center py-4 flex-1 flex items-center justify-center">
            尚无剧情线开启，做出选择后将逐步解锁……
          </p>
        ) : (
          <div className="space-y-3 flex-1 overflow-y-auto log-scroll min-h-0">
            {sorted.map((sp) => {
              const colors = TONE_COLORS[sp.storyline.tone] ?? TONE_COLORS.mist
              return (
                <div key={sp.storyline.id} className={`border ${colors.border} rounded-sm px-4 py-3`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-medium ${colors.text}`}>
                      {sp.storyline.name}
                    </span>
                    <span className="text-xs text-[var(--color-mist)]">
                      {sp.completedSteps}/{sp.totalSteps}
                    </span>
                  </div>

                  <div className="h-1.5 bg-[rgba(0,0,0,0.3)] rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full ${colors.bar} transition-all duration-500 rounded-full`}
                      style={{ width: `${sp.percent}%` }}
                    />
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {sp.storyline.steps.map((step, i) => {
                      const done = i < sp.completedSteps
                      const isCurrent = i === sp.completedSteps
                      return (
                        <span
                          key={step.flag}
                          className={`text-xs px-2 py-0.5 rounded-sm ${
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
                    <p className="text-xs text-[var(--color-mist)]/60 mt-2 italic">
                      下一步：{sp.nextLabel}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
