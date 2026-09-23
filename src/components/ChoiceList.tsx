import { playSound } from '../audio/sounds'
import { checkConditions, getFailedRequirements } from '../engine/conditions'
import type { Choice, PlayerState } from '../types/game'
import { Badge } from './Badge'

interface Props {
  choices: Choice[]
  player: PlayerState
  onChoose: (choiceId: string) => void
}

const ORDINAL = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十']

export function ChoiceList({ choices, player, onChoose }: Props) {
  return (
    <div className="space-y-3">
      <p className="text-xs text-mist tracking-[0.3em] mb-3 text-center">— 抉择 —</p>
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
                ? 'choice-ink border-jade/50 bg-jade/10 hover:border-jade-light text-parchment'
                : 'border-mist/15 bg-black/15 text-mist/85 cursor-not-allowed'
              }
            `}
          >
            {canChoose && (
              <Badge tone="jade" size="sm" className="mt-0.5">
                {ORDINAL[idx] ?? idx + 1}
              </Badge>
            )}
            <span className="flex-1 leading-relaxed">
              <span className="block">{choice.text}</span>
              {choice.hint && canChoose && (
                <span className="block text-xs mt-1 text-gold-dim/80">{choice.hint}</span>
              )}
              {!canChoose && failed.length > 0 && (
                <span className="block text-xs mt-1 text-cinnabar/70">
                  需要：{failed.join('、')}
                </span>
              )}
            </span>
            {canChoose && (
              <span className="choice-arrow" aria-hidden="true">▸</span>
            )}
          </button>
        )
      })}
    </div>
  )
}
