import { playSound } from '../audio/sounds'
import { checkConditions, getFailedRequirements } from '../engine/conditions'
import type { Choice, PlayerState } from '../types/game'

interface Props {
  choices: Choice[]
  player: PlayerState
  onChoose: (choiceId: string) => void
}

const ORDINAL = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十']

export function ChoiceList({ choices, player, onChoose }: Props) {
  return (
    <div className="space-y-3">
      <p className="text-xs text-[var(--color-mist)] tracking-[0.3em] mb-3 text-center">— 抉择 —</p>
      {choices.map((choice, idx) => {
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
              group w-full text-left px-4 py-3 min-h-[44px] rounded-sm border transition-all cursor-pointer
              flex items-start gap-3
              ${canChoose
                ? 'border-[var(--color-jade)]/50 bg-[rgba(45,90,74,0.10)] hover:bg-[rgba(45,90,74,0.22)] hover:border-[var(--color-jade-light)] hover:translate-x-1 text-[var(--color-parchment)]'
                : 'border-[var(--color-mist)]/15 bg-[rgba(0,0,0,0.15)] text-[var(--color-mist)]/50 cursor-not-allowed'
              }
            `}
          >
            {canChoose && (
              <span className="choice-index mt-0.5 group-hover:border-[var(--color-gold)] group-hover:text-[var(--color-gold)]">
                {ORDINAL[idx] ?? idx + 1}
              </span>
            )}
            <span className="flex-1 leading-relaxed">
              <span className="block">{choice.text}</span>
              {choice.hint && canChoose && (
                <span className="block text-xs mt-1 text-[var(--color-gold-dim)]/80">{choice.hint}</span>
              )}
              {!canChoose && failed.length > 0 && (
                <span className="block text-xs mt-1 text-[var(--color-cinnabar)]/70">
                  需要：{failed.join('、')}
                </span>
              )}
            </span>
          </button>
        )
      })}
    </div>
  )
}
