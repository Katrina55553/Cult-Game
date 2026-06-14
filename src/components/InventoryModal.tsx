import { useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { formatArtifactName } from '../data/artifacts'
import type { PlayerState } from '../types/game'

interface Props {
  player: PlayerState
  onClose: () => void
  onUseItem?: (index: number) => void
}

export function InventoryModal({ player, onClose, onUseItem }: Props) {
  const [detailIdx, setDetailIdx] = useState<number | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const inv = player.inventory
  const detail = detailIdx !== null ? inv[detailIdx] : null
  const hasContent = player.artifacts.length > 0 || inv.length > 0 || !!player.cultivationSystems.spiritBeast

  function handleOverlayClick(e: React.MouseEvent) {
    // 只在点击遮罩层（非内容区域）时关闭
    if (contentRef.current && !contentRef.current.contains(e.target as Node)) {
      onClose()
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" onClick={handleOverlayClick}>
      <div
        ref={contentRef}
        className="max-w-sm w-full h-[400px] border border-[var(--color-jade)]/40 bg-[var(--color-ink)] p-5 rounded-sm animate-slide-up flex flex-col"
      >
        {/* 标题栏 */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg text-[var(--color-gold)]" style={{ fontFamily: 'var(--font-display)' }}>
            {detail ? '物品详情' : '👜 乾坤袋'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-[var(--color-mist)] hover:text-[var(--color-parchment)] cursor-pointer border border-[var(--color-mist)]/20 px-2 py-1 rounded-sm"
          >
            关闭
          </button>
        </div>

        {/* 详情视图 */}
        {detail && (
          <div className="flex-1 flex flex-col">
            <div className="flex-1">
              <p className="text-base text-[var(--color-parchment)] mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                {detail.name}
              </p>
              <p className="text-sm text-[var(--color-mist)] leading-relaxed mb-4">
                {detail.description}
              </p>
            </div>
            <div className="flex gap-2">
              {detail.usable && onUseItem && (
                <button
                  type="button"
                  onClick={() => { onUseItem(detailIdx!); setDetailIdx(null) }}
                  className="flex-1 text-sm px-4 py-2 border border-[var(--color-jade)]/60 rounded-sm
                    text-[var(--color-jade-light)] hover:text-[var(--color-gold)] hover:border-[var(--color-gold)]/40
                    bg-[rgba(45,90,74,0.12)] hover:bg-[rgba(45,90,74,0.25)] cursor-pointer transition-colors"
                >
                  使用
                </button>
              )}
              <button
                type="button"
                onClick={() => setDetailIdx(null)}
                className="text-sm px-4 py-2 border border-[var(--color-mist)]/20 rounded-sm
                  text-[var(--color-mist)] hover:text-[var(--color-parchment)] cursor-pointer transition-colors"
              >
                返回
              </button>
            </div>
          </div>
        )}

        {/* 空状态 */}
        {!detail && !hasContent && (
          <p className="text-sm text-[var(--color-mist)] text-center py-4 flex-1 flex items-center justify-center">
            乾坤袋空空如也
          </p>
        )}

        {/* 列表视图 */}
        {!detail && hasContent && (
          <div className="space-y-3 flex-1 overflow-y-auto min-h-0" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(74,138,114,0.45) transparent' }}>
            {player.cultivationSystems.spiritBeast && (
              <div>
                <p className="text-xs text-[var(--color-cinnabar-glow)] mb-1.5">灵兽</p>
                <div className="text-xs px-3 py-2 border border-[var(--color-cinnabar)]/20 rounded-sm">
                  <p className="text-[var(--color-parchment)]">
                    {player.cultivationSystems.spiritBeast.name} · {player.cultivationSystems.spiritBeast.tier}阶
                  </p>
                </div>
              </div>
            )}

            {player.cultivationSystems.bloodline && (
              <div>
                <p className="text-xs text-[var(--color-cinnabar-glow)] mb-1.5">血脉</p>
                <div className="text-xs px-3 py-2 border border-[var(--color-cinnabar)]/20 rounded-sm">
                  <p className="text-[var(--color-parchment)]">{player.cultivationSystems.bloodline}</p>
                </div>
              </div>
            )}

            {player.artifacts.length > 0 && (
              <div>
                <p className="text-xs text-[var(--color-gold-dim)] mb-1.5">法宝</p>
                {player.artifacts.map((id, i) => (
                  <div key={`a-${i}`} className="text-xs px-3 py-2 border border-[var(--color-gold)]/20 rounded-sm mb-1">
                    <p className="text-[var(--color-gold)]">{formatArtifactName(id)}</p>
                  </div>
                ))}
              </div>
            )}

            {inv.length > 0 && (
              <div>
                <p className="text-xs text-[var(--color-jade-light)] mb-1.5">物品</p>
                {inv.map((item, i) => (
                  <button
                    key={`item-${i}`}
                    type="button"
                    onClick={() => setDetailIdx(i)}
                    style={{ cursor: 'pointer' }}
                    className="w-full text-left px-3 py-2 border border-[var(--color-jade)]/20 rounded-sm mb-1
                      hover:border-[var(--color-jade)]/40 hover:bg-[rgba(45,90,74,0.08)] transition-colors"
                  >
                    <p className="text-xs text-[var(--color-parchment)]">{item.name}</p>
                    <p className="text-[10px] text-[var(--color-mist)]">{item.description}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}
