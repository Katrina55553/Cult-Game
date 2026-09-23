import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { highlightLogEntry, LOG_TONE_CLASS } from './logHighlight'

interface Props {
  logs: string[]
  playerName?: string
}

export function LogPanel({ logs, playerName }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const recentFirst = useMemo(() => [...logs].reverse(), [logs])
  const highlightedEntries = useMemo(
    () => recentFirst.map((entry) => highlightLogEntry(entry)),
    [recentFirst],
  )
  const [showExport, setShowExport] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' })
  }, [logs.length])

  const exportText = useMemo(() => {
    const header = `【修仙模拟器 · ${playerName ?? '无名修士'} · 共 ${logs.length} 条记录】\n${'─'.repeat(30)}\n`
    return header + logs.join('\n')
  }, [logs, playerName])

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(exportText).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => {})
  }, [exportText])

  const handleDownload = useCallback(() => {
    const blob = new Blob([exportText], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `修仙日志_${playerName ?? '无名修士'}_${new Date().toISOString().slice(0, 10)}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }, [exportText, playerName])

  return (
    <aside className="h-full flex flex-col min-h-0">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <h4
          className="modal-heading flex-1 text-lg text-gold-dim tracking-wider mr-3"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          修仙日志
        </h4>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowExport((v) => !v)}
            className="text-xs text-mist hover:text-gold cursor-pointer transition-colors tracking-wider"
          >
            {showExport ? '收起' : '导出'}
          </button>
        </div>
      </div>

      {showExport && (
        <div className="flex gap-2 mb-3 shrink-0">
          <button
            type="button"
            onClick={handleCopy}
            className="flex-1 text-xs py-1.5 px-3 border border-jade/40 rounded-sm
              text-parchment-dim hover:text-gold hover:border-gold/40
              hover:bg-gold/5 cursor-pointer transition-all"
          >
            {copied ? '已复制 ✓' : '复制到剪贴板'}
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="flex-1 text-xs py-1.5 px-3 border border-jade/40 rounded-sm
              text-parchment-dim hover:text-gold hover:border-gold/40
              hover:bg-gold/5 cursor-pointer transition-all"
          >
            下载 txt
          </button>
        </div>
      )}

      <div
        ref={scrollRef}
        className="log-scroll log-fade flex-1 min-h-0 overflow-y-auto space-y-2.5 pr-1 max-h-[40vh] lg:max-h-[calc(100vh-11rem)]"
      >
        {logs.length === 0 ? (
          <p className="text-sm text-mist/50 italic">尚无记录……</p>
        ) : (
          recentFirst.map((_entry, i) => (
            <p
              key={logs.length - 1 - i}
              className={`text-sm leading-relaxed border-l-2 pl-3 py-0.5 transition-colors
                ${i === 0
                  ? 'text-parchment border-gold/50 hover:border-gold/70'
                  : 'text-parchment-dim border-jade/30 hover:border-gold/40'
                }`}
            >
              {highlightedEntries[i].map((segment, j) =>
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
