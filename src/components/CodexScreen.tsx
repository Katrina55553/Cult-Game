import { useMemo } from 'react'
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

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg max-h-[85vh] overflow-y-auto border border-[var(--color-jade)] bg-[var(--color-ink)] p-6 rounded-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl text-[var(--color-gold)]" style={{ fontFamily: 'var(--font-display)' }}>
            修仙志
          </h2>
          <button type="button" onClick={onClose} className="text-[var(--color-mist)] cursor-pointer">
            关闭
          </button>
        </div>

        <section className="mb-6">
          <p className="text-sm text-[var(--color-mist)] mb-2">战绩统计</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <Stat label="修行次数" value={String(meta.totalRuns)} />
            <Stat label="结局收集" value={`${unlocked}/${total}`} />
            <Stat label="最佳境界" value={getRealmName(meta.bestRealm)} />
            <Stat label="最长回合" value={String(meta.bestTurn)} />
          </div>
        </section>

        <section className="mb-6">
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
          <p className="mt-4 text-xs text-[var(--color-gold-dim)]">已解锁：开局可选先天道体</p>
        )}
        {meta.romanceBoost && (
          <p className="mt-1 text-xs text-[var(--color-gold-dim)]">已解锁：情缘事件权重提升</p>
        )}
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
