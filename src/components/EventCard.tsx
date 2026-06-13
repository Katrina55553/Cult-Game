import type { GameEvent } from '../types/game'

interface Props {
  event: GameEvent
}

export function EventCard({ event }: Props) {
  return (
    <article className="animate-fade-up mb-6">
      <h3
        className="text-2xl text-[var(--color-cinnabar-glow)] mb-4"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        「{event.title}」
      </h3>
      <p className="text-[var(--color-parchment)] leading-[1.9] text-base whitespace-pre-wrap">
        {event.description}
      </p>
    </article>
  )
}
