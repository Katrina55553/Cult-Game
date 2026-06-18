import type { GameEvent } from '../types/game'

interface Props {
  event: GameEvent
}

export function EventCard({ event }: Props) {
  return (
    <article className="animate-fade-up">
      <h3
        className="text-2xl sm:text-3xl text-[var(--color-cinnabar-glow)] mb-5 text-center tracking-wider"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        <span className="title-flanked">「{event.title}」</span>
      </h3>
      <p className="text-[var(--color-parchment)] leading-[2] text-base sm:text-[17px] whitespace-pre-wrap">
        {event.description}
      </p>
    </article>
  )
}
