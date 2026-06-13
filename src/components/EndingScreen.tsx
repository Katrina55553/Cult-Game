import { useCallback, useMemo, useState } from 'react'
import { ACHIEVEMENTS } from '../data/achievements'
import { getClosestEndings } from '../engine/endingProximity'
import { getEndingCodexProgress, loadMeta } from '../engine/metaProgress'
import { getRealmName } from '../engine/gameEngine'
import type { GameSession } from '../types/game'

interface Props {
  session: GameSession
  onRestart: () => void
}

export function EndingScreen({ session, onRestart }: Props) {
  const { ending, player } = session
  const meta = useMemo(() => loadMeta(), [])
  const [showLog, setShowLog] = useState(false)
  const [copied, setCopied] = useState(false)

  const exportText = useMemo(() => {
    if (!ending) return ''
    const header = `【修仙模拟器 · ${player.name} · ${ending.title} · 共 ${session.turn} 回合】\n${'─'.repeat(30)}\n`
    return header + player.log.join('\n')
  }, [player.log, player.name, ending, session.turn])

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(exportText).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => {})
  }, [exportText])

  const handleDownload = useCallback(() => {
    if (!ending) return
    const blob = new Blob([exportText], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `修仙日志_${player.name}_${ending.title}_${new Date().toISOString().slice(0, 10)}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }, [exportText, player.name, ending])

  if (!ending) return null

  const { unlocked, total } = getEndingCodexProgress(meta)
  const closest = getClosestEndings(player, 2).filter((c) => c.endingId !== ending.id)

  const keyChoices = player.log.filter(
    (l) =>
      l.includes('突破') ||
      l.includes('堕') ||
      l.includes('飞升') ||
      l.includes('陨落') ||
      l.includes('拜入') ||
      l.includes('散修') ||
      l.includes('沈霜凝') ||
      l.includes('叶轻眉') ||
      l.includes('双修'),
  )

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12 animate-fade-up safe-bottom">
      {session.newEndingUnlock && (
        <p className="text-[var(--color-gold)] text-sm tracking-[0.4em] mb-2">✦ 首通结局 ✦</p>
      )}
      <p className="text-[var(--color-gold-dim)] text-sm tracking-[0.4em] mb-4">— 天命已定 —</p>

      <h2
        className="text-4xl sm:text-5xl text-[var(--color-cinnabar-glow)] mb-4 text-center"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {ending.title}
      </h2>

      {session.endingReason && (
        <p className="text-sm text-[var(--color-gold)] text-center mb-6 max-w-md leading-relaxed">
          终局原因：{session.endingReason}
        </p>
      )}

      <div className="w-full max-w-lg border border-[var(--color-jade)]/40 bg-[rgba(45,90,74,0.1)] p-8 rounded-sm mb-6">
        <p className="text-[var(--color-parchment)] leading-[1.9] text-center mb-6">
          {ending.description}
        </p>
        <div className="text-sm text-[var(--color-mist)] space-y-1 text-center">
          <p>
            {player.name} · {player.spiritRoot} · {getRealmName(player.realm)} · {player.age} 岁
          </p>
          <p>共历 {session.turn} 回合</p>
          <p className="text-[var(--color-gold-dim)]">
            结局收集 {unlocked}/{total}
            {meta.bestTurn > 0 && ` · 历史最佳 ${meta.bestTurn} 回合`}
          </p>
        </div>
      </div>

      {closest.length > 0 && (
        <div className="w-full max-w-lg mb-6 border border-[var(--color-gold)]/20 p-4 rounded-sm">
          <p className="text-xs text-[var(--color-gold-dim)] tracking-wider mb-3 text-center">
            差一点达成的结局
          </p>
          {closest.map((c) => (
            <div key={c.endingId} className="text-sm text-center mb-2">
              <p className="text-[var(--color-parchment)]">{c.title}</p>
              <p className="text-xs text-[var(--color-mist)]">还差：{c.missing.join('、')}</p>
            </div>
          ))}
        </div>
      )}

      {session.newAchievements.length > 0 && (
        <div className="w-full max-w-lg mb-6 text-center">
          <p className="text-xs text-[var(--color-gold)] mb-2">新成就</p>
          {session.newAchievements.map((id) => (
            <p key={id} className="text-sm text-[var(--color-parchment-dim)]">
              {ACHIEVEMENTS.find((a) => a.id === id)?.title ?? id}
            </p>
          ))}
        </div>
      )}

      {keyChoices.length > 0 && (
        <div className="w-full max-w-lg mb-6">
          <p className="text-xs text-[var(--color-mist)] tracking-wider mb-3 text-center">关键抉择回顾</p>
          <div className="space-y-2">
            {keyChoices.slice(-5).map((entry, i) => (
              <p key={i} className="text-sm text-[var(--color-parchment-dim)] text-center">
                {entry}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* 日志导出 */}
      <div className="w-full max-w-lg mb-8">
        <button
          type="button"
          onClick={() => setShowLog((v) => !v)}
          className="w-full text-xs text-[var(--color-mist)] hover:text-[var(--color-gold)] cursor-pointer
            border border-[var(--color-mist)]/20 hover:border-[var(--color-gold)]/40 py-2 rounded-sm transition-colors"
        >
          {showLog ? '收起日志' : `查看完整日志 (${player.log.length} 条)`}
        </button>
        {showLog && (
          <div className="mt-3 space-y-3">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="flex-1 text-xs py-1.5 px-3 border border-[var(--color-jade)]/40 rounded-sm
                  text-[var(--color-parchment-dim)] hover:text-[var(--color-gold)] hover:border-[var(--color-gold)]/40
                  cursor-pointer transition-colors"
              >
                {copied ? '已复制 ✓' : '复制全部日志'}
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="flex-1 text-xs py-1.5 px-3 border border-[var(--color-jade)]/40 rounded-sm
                  text-[var(--color-parchment-dim)] hover:text-[var(--color-gold)] hover:border-[var(--color-gold)]/40
                  cursor-pointer transition-colors"
              >
                下载 txt
              </button>
            </div>
            <div className="max-h-60 overflow-y-auto log-scroll space-y-1 border border-[var(--color-jade)]/20 bg-[rgba(0,0,0,0.2)] p-3 rounded-sm">
              {player.log.map((entry, i) => (
                <p key={i} className="text-xs text-[var(--color-parchment-dim)] leading-relaxed">
                  {entry}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onRestart}
        className="w-full sm:w-auto px-10 py-3.5 min-h-[44px] bg-[var(--color-cinnabar)] hover:bg-[var(--color-cinnabar-glow)]
          text-[var(--color-parchment)] tracking-[0.2em] rounded-sm transition-all cursor-pointer
          border border-[var(--color-cinnabar-glow)]/50"
      >
        再入仙途
      </button>
    </div>
  )
}
