import { useEffect, useState } from 'react'
import type { GameEvent } from '../types/game'

interface Props {
  event: GameEvent
}

export function EventCard({ event }: Props) {
  const [animationKey, setAnimationKey] = useState(0)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 切换事件时需要重启动画
    setAnimationKey((k) => k + 1)
  }, [event.id])

  return (
    <article key={animationKey} className="animate-fade-up">
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
