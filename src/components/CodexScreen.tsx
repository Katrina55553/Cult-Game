import { useEffect, useMemo, useRef } from 'react'
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
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  return (
    <div className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center px-4 py-8">
      <div className="modal-panel animate-modal-in w-full max-w-lg max-h-[85vh] flex flex-col">
        {/* 吸顶头部 */}
        <div className="flex items-center px-6 py-4 border-b border-jade/30 shrink-0
          sticky top-0 z-10">
          <h2 className="modal-heading flex-1 text-2xl text-gold" style={{ fontFamily: 'var(--font-display)' }}>
            修仙志
          </h2>
        </div>

        {/* 可滚动内容 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 log-scroll">
          <section>
            <p className="text-sm text-mist mb-2">战绩统计</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <Stat label="修行次数" value={String(meta.totalRuns)} />
              <Stat label="结局收集" value={`${unlocked}/${total}`} />
              <Stat label="最佳境界" value={getRealmName(meta.bestRealm)} />
              <Stat label="最长回合" value={String(meta.bestTurn)} />
            </div>
          </section>

          <section>
            <p className="text-sm text-mist mb-2">结局图鉴</p>
            <div className="space-y-2">
              {ENDINGS.map((e) => {
                const got = meta.unlockedEndings.includes(e.id)
                return (
                  <div
                    key={e.id}
                    className={`px-3 py-2 rounded-sm text-sm border ${got ? 'border-gold/40 text-parchment' : 'border-mist/20 text-mist/50'}`}
                  >
                    {got ? e.title : '？？？'}
                  </div>
                )
              })}
            </div>
          </section>

          <section>
            <p className="text-sm text-mist mb-2">
              成就 ({meta.unlockedAchievements.length}/{ACHIEVEMENTS.length})
            </p>
            <div className="space-y-2">
              {ACHIEVEMENTS.map((a) => {
                const got = meta.unlockedAchievements.includes(a.id)
                const hidden = a.hidden && !got
                return (
                  <div
                    key={a.id}
                    className={`px-3 py-2 rounded-sm text-sm border ${got ? 'border-jade/40' : 'border-mist/20 opacity-60'}`}
                  >
                    <p className="text-parchment">{hidden ? '隐藏成就' : a.title}</p>
                    {got && <p className="text-xs text-mist">{a.description}</p>}
                  </div>
                )
              })}
            </div>
          </section>

          {meta.innateBodyUnlocked && (
            <p className="text-xs text-gold-dim">已解锁：开局可选先天道体</p>
          )}
          {meta.romanceBoost && (
            <p className="text-xs text-gold-dim">已解锁：情缘事件权重提升</p>
          )}
        </div>

        {/* 底部关闭按钮 */}
        <div className="px-6 py-3 border-t border-jade/30 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost w-full py-2 text-sm cursor-pointer"
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
    <div className="bg-black/20 px-3 py-2 rounded-sm">
      <p className="text-mist text-xs">{label}</p>
      <p className="text-parchment">{value}</p>
    </div>
  )
}
