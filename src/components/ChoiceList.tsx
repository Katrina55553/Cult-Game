import { playSound } from '../audio/sounds'
import { checkConditions, getFailedRequirements } from '../engine/conditions'
import type { Choice, PlayerState } from '../types/game'

interface Props {
  choices: Choice[]
  player: PlayerState
  onChoose: (choiceId: string) => void
}

export function ChoiceList({ choices, player, onChoose }: Props) {
  return (
    <div className="space-y-3">
      <p className="text-xs text-[var(--color-mist)] tracking-wider mb-2">— 抉择 —</p>
      {choices.map((choice) => {
        const canChoose = checkConditions(player, choice.requirements)
        const failed = getFailedRequirements(player, choice.requirements)

        return (
          <button
            key={choice.id}
            type="button"
            disabled={!canChoose}
            onClick={() => {
              playSound('click')
              onChoose(choice.id)
            }}
            className={`
              w-full text-left px-4 py-3 min-h-[44px] rounded-sm border transition-all cursor-pointer
              ${canChoose
                ? 'border-[var(--color-jade)]/60 bg-[rgba(45,90,74,0.12)] hover:bg-[rgba(45,90,74,0.25)] hover:border-[var(--color-jade-light)] text-[var(--color-parchment)]'
                : 'border-[var(--color-mist)]/20 bg-[rgba(0,0,0,0.15)] text-[var(--color-mist)]/50 cursor-not-allowed'
              }
            `}
          >
            <span className="block leading-relaxed">{choice.text}</span>
            {choice.hint && canChoose && (
              <span className="block text-xs mt-1 text-[var(--color-gold-dim)]/80">{choice.hint}</span>
            )}
            {!canChoose && failed.length > 0 && (
              <span className="block text-xs mt-1 text-[var(--color-cinnabar)]/70">
                需要：{failed.join('、')}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
