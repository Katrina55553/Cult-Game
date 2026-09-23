import { useCallback, useMemo, useState } from 'react'
import { ACHIEVEMENTS } from '../data/achievements'
import { getClosestEndings } from '../engine/endingProximity'
import { getEndingCodexProgress, loadMeta } from '../engine/metaProgress'
import { getRealmName } from '../engine/gameEngine'
import { downloadNovel } from '../engine/novelExporter'
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
        <p className="text-gold text-sm tracking-[0.4em] mb-2">✦ 首通结局 ✦</p>
      )}
      <p className="text-gold-dim text-sm tracking-[0.4em] mb-4">— 天命已定 —</p>

      <h2
        className="text-4xl sm:text-5xl text-cinnabar-glow mb-4 text-center"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {ending.title}
      </h2>

      {session.endingReason && (
        <p className="text-sm text-gold text-center mb-6 max-w-md leading-relaxed">
          终局原因：{session.endingReason}
        </p>
      )}

      <div className="scroll-panel mist-overlay relative w-full max-w-lg border border-jade/40 bg-jade/10 p-8 rounded-sm mb-6">
        <p className="relative z-10 text-parchment leading-[1.9] text-center mb-6">
          {ending.description}
        </p>
        <div className="relative z-10 text-sm text-mist space-y-1 text-center">
          <p>
            {player.name} · {player.spiritRoot} · {getRealmName(player.realm)} · {player.age} 岁
          </p>
          <p>共历 {session.turn} 回合</p>
          <p className="text-gold-dim">
            结局收集 {unlocked}/{total}
            {meta.bestTurn > 0 && ` · 历史最佳 ${meta.bestTurn} 回合`}
          </p>
        </div>
      </div>

      {closest.length > 0 && (
        <div className="w-full max-w-lg mb-6 border border-gold/20 bg-gold/[0.04] p-4 rounded-sm">
          <p className="text-xs text-gold-dim tracking-wider mb-3 text-center">
            差一点达成的结局
          </p>
          {closest.map((c) => (
            <div key={c.endingId} className="text-sm text-center mb-2">
              <p className="text-parchment">{c.title}</p>
              <p className="text-xs text-mist">还差：{c.missing.join('、')}</p>
            </div>
          ))}
        </div>
      )}

      {session.newAchievements.length > 0 && (
        <div className="w-full max-w-lg mb-6 text-center">
          <p className="text-xs text-gold mb-2">新成就</p>
          {session.newAchievements.map((id) => (
            <p key={id} className="text-sm text-parchment-dim">
              {ACHIEVEMENTS.find((a) => a.id === id)?.title ?? id}
            </p>
          ))}
        </div>
      )}

      {keyChoices.length > 0 && (
        <div className="w-full max-w-lg mb-6">
          <p className="text-xs text-mist tracking-wider mb-3 text-center">关键抉择回顾</p>
          <div className="space-y-2">
            {keyChoices.slice(-5).map((entry, i) => (
              <p key={i} className="text-sm text-parchment-dim text-center">
                {entry}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* 导出 */}
      <div className="w-full max-w-lg mb-8 space-y-2">
        <button
          type="button"
          onClick={() => downloadNovel(session)}
          className="w-full text-sm py-2.5 border border-gold/40 rounded-sm
            text-gold hover:text-parchment hover:border-gold
            hover:bg-gold/8 cursor-pointer transition-colors"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          📖 导出为小说
        </button>
        <button
          type="button"
          onClick={() => setShowLog((v) => !v)}
          className="w-full text-xs text-mist hover:text-gold cursor-pointer
            border border-mist/20 hover:border-gold/40 py-2 rounded-sm transition-colors"
        >
          {showLog ? '收起日志' : `查看完整日志 (${player.log.length} 条)`}
        </button>
        {showLog && (
          <div className="mt-3 space-y-3">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="flex-1 text-xs py-1.5 px-3 border border-jade/40 rounded-sm
                  text-parchment-dim hover:text-gold hover:border-gold/40
                  cursor-pointer transition-colors"
              >
                {copied ? '已复制 ✓' : '复制全部日志'}
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="flex-1 text-xs py-1.5 px-3 border border-jade/40 rounded-sm
                  text-parchment-dim hover:text-gold hover:border-gold/40
                  cursor-pointer transition-colors"
              >
                下载日志 txt
              </button>
            </div>
            <div className="max-h-60 overflow-y-auto log-scroll space-y-1 border border-jade/20 bg-black/20 p-3 rounded-sm">
              {player.log.map((entry, i) => (
                <p key={i} className="text-xs text-parchment-dim leading-relaxed">
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
        className="btn-cinnabar w-full sm:w-auto px-10 py-3.5 min-h-[44px]
          tracking-[0.2em] cursor-pointer"
      >
        再入仙途
      </button>
    </div>
  )
}
