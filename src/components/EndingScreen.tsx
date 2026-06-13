import { useMemo } from 'react'
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
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 animate-fade-up">
      {session.newEndingUnlock && (
        <p className="text-[var(--color-gold)] text-sm tracking-[0.4em] mb-2">✦ 首通结局 ✦</p>
      )}
      <p className="text-[var(--color-gold-dim)] text-sm tracking-[0.4em] mb-4">— 天命已定 —</p>

      <h2
        className="text-5xl text-[var(--color-cinnabar-glow)] mb-4 text-center"
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
        <div className="w-full max-w-lg mb-8">
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

      <button
        type="button"
        onClick={onRestart}
        className="px-10 py-3 bg-[var(--color-cinnabar)] hover:bg-[var(--color-cinnabar-glow)]
          text-[var(--color-parchment)] tracking-[0.2em] rounded-sm transition-all cursor-pointer
          border border-[var(--color-cinnabar-glow)]/50"
      >
        再入仙途
      </button>
    </div>
  )
}
