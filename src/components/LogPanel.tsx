import { useEffect, useMemo, useRef } from 'react'
import { highlightLogEntry, LOG_TONE_CLASS } from './logHighlight'

interface Props {
  logs: string[]
}

export function LogPanel({ logs }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const recentFirst = useMemo(() => [...logs].reverse(), [logs])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' })
  }, [logs.length])

  return (
    <aside className="h-full flex flex-col min-h-0">
      <h4
        className="text-lg text-[var(--color-gold-dim)] mb-4 shrink-0"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        修仙日志
      </h4>
      <div
        ref={scrollRef}
        className="log-scroll flex-1 min-h-0 overflow-y-auto space-y-2 pr-1 max-h-[40vh] lg:max-h-[calc(100vh-11rem)]"
      >
        {logs.length === 0 ? (
          <p className="text-sm text-[var(--color-mist)]/50">尚无记录……</p>
        ) : (
          recentFirst.map((entry, i) => (
            <p
              key={logs.length - 1 - i}
              className="text-sm text-[var(--color-parchment-dim)] leading-relaxed border-l-2 border-[var(--color-jade)]/30 pl-3"
            >
              {highlightLogEntry(entry).map((segment, j) =>
                segment.tone ? (
                  <span key={j} className={LOG_TONE_CLASS[segment.tone]}>
                    {segment.text}
                  </span>
                ) : (
                  <span key={j}>{segment.text}</span>
                ),
              )}
            </p>
          ))
        )}
      </div>
    </aside>
  )
}
