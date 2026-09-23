import { useEffect, useMemo, useState } from 'react'
import type { GameEvent } from '../types/game'

interface Props {
  event: GameEvent
}

const SENTENCE_END = new Set(['。', '！', '？', '；', '!', '?', '\n'])

// 按句末标点切分，让叙事一句句渗出来，而不是整块淡入
function splitLines(text: string): string[] {
  const lines: string[] = []
  let buf = ''
  for (const ch of text) {
    buf += ch
    if (SENTENCE_END.has(ch)) {
      lines.push(buf)
      buf = ''
    }
  }
  if (buf) lines.push(buf)
  return lines
}

const STEP_MS = 70
const MAX_DELAY_MS = 700

export function EventCard({ event }: Props) {
  const [animationKey, setAnimationKey] = useState(0)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 切换事件时需要重启动画
    setAnimationKey((k) => k + 1)
    setRevealed(false)
  }, [event.id])

  const lines = useMemo(() => splitLines(event.description), [event.description])

  return (
    <article key={animationKey}>
      <h3
        className="text-2xl sm:text-3xl text-cinnabar-glow mb-5 text-center tracking-wider"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        <span className="title-flanked">「{event.title}」</span>
      </h3>
      {!revealed && lines.length > 3 && (
        <p className="text-center text-[10px] text-mist/40 tracking-[0.3em] mb-4 animate-fade-up">
          点击正文速览全文
        </p>
      )}
      {/* 长叙事会让人干等，点一下直接全部显形 */}
      <p
        className="text-parchment leading-[2] text-base sm:text-[17px] whitespace-pre-wrap"
        onClick={() => setRevealed(true)}
      >
        {lines.map((line, i) => (
          <span
            key={i}
            className={revealed ? undefined : 'ink-line'}
            style={
              revealed
                ? undefined
                : ({ '--ink-delay': `${Math.min(i * STEP_MS, MAX_DELAY_MS)}ms` } as React.CSSProperties)
            }
          >
            {line}
          </span>
        ))}
      </p>
    </article>
  )
}
