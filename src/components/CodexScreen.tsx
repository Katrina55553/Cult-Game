import { useEffect, useMemo } from 'react'
import { ACHIEVEMENTS } from '../data/achievements'
import { ENDINGS } from '../data/endings'
import { getRealmName } from '../engine/gameEngine'
import { getEndingCodexProgress, loadMeta } from '../engine/metaProgress'

interface Props {
  onClose: () => void
}

export function CodexScreen({ onClose }: Props) {
  const meta = useMemo(() => loadMeta(), [])
  const { unlocked, total } = getEndingCodexProgress(meta)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg max-h-[85vh] flex flex-col border border-[var(--color-jade)] bg-[var(--color-ink)] rounded-sm">
        {/* 吸顶头部 */}
        <div className="flex items-center px-6 py-4 border-b border-[var(--color-jade)]/30 shrink-0
          bg-[var(--color-ink)] sticky top-0 z-10">
          <h2 className="text-2xl text-[var(--color-gold)]" style={{ fontFamily: 'var(--font-display)' }}>
            修仙志
          </h2>
        </div>

        {/* 可滚动内容 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 log-scroll">
          <section>
            <p className="text-sm text-[var(--color-mist)] mb-2">战绩统计</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <Stat label="修行次数" value={String(meta.totalRuns)} />
              <Stat label="结局收集" value={`${unlocked}/${total}`} />
              <Stat label="最佳境界" value={getRealmName(meta.bestRealm)} />
              <Stat label="最长回合" value={String(meta.bestTurn)} />
            </div>
          </section>

          <section>
            <p className="text-sm text-[var(--color-mist)] mb-2">结局图鉴</p>
            <div className="space-y-2">
              {ENDINGS.map((e) => {
                const got = meta.unlockedEndings.includes(e.id)
                return (
                  <div
                    key={e.id}
                    className={`px-3 py-2 rounded-sm text-sm border ${got ? 'border-[var(--color-gold)]/40 text-[var(--color-parchment)]' : 'border-[var(--color-mist)]/20 text-[var(--color-mist)]/50'}`}
                  >
                    {got ? e.title : '？？？'}
                  </div>
                )
              })}
            </div>
          </section>

          <section>
            <p className="text-sm text-[var(--color-mist)] mb-2">
              成就 ({meta.unlockedAchievements.length}/{ACHIEVEMENTS.length})
            </p>
            <div className="space-y-2">
              {ACHIEVEMENTS.map((a) => {
                const got = meta.unlockedAchievements.includes(a.id)
                const hidden = a.hidden && !got
                return (
                  <div
                    key={a.id}
                    className={`px-3 py-2 rounded-sm text-sm border ${got ? 'border-[var(--color-jade)]/40' : 'border-[var(--color-mist)]/20 opacity-60'}`}
                  >
                    <p className="text-[var(--color-parchment)]">{hidden ? '隐藏成就' : a.title}</p>
                    {got && <p className="text-xs text-[var(--color-mist)]">{a.description}</p>}
                  </div>
                )
              })}
            </div>
          </section>

          {meta.innateBodyUnlocked && (
            <p className="text-xs text-[var(--color-gold-dim)]">已解锁：开局可选先天道体</p>
          )}
          {meta.romanceBoost && (
            <p className="text-xs text-[var(--color-gold-dim)]">已解锁：情缘事件权重提升</p>
          )}
        </div>

        {/* 底部关闭按钮 */}
        <div className="px-6 py-3 border-t border-[var(--color-jade)]/30 shrink-0 bg-[var(--color-ink)]">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 text-sm text-[var(--color-mist)] hover:text-[var(--color-gold)]
              border border-[var(--color-mist)]/20 hover:border-[var(--color-gold)]/40 rounded-sm transition-colors cursor-pointer"
          >
            关闭修仙志
          </button>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[rgba(0,0,0,0.2)] px-3 py-2 rounded-sm">
      <p className="text-[var(--color-mist)] text-xs">{label}</p>
      <p className="text-[var(--color-parchment)]">{value}</p>
    </div>
  )
}
