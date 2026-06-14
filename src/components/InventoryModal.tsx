import { useState } from 'react'
import { createPortal } from 'react-dom'
import { getArtifactInfo } from '../data/artifacts'
import type { PlayerState } from '../types/game'

interface Props {
  player: PlayerState
  onClose: () => void
  onUseItem?: (index: number) => void
}

type DetailTarget =
  | { kind: 'artifact'; index: number }
  | { kind: 'item'; index: number }

export function InventoryModal({ player, onClose, onUseItem }: Props) {
  const [detail, setDetail] = useState<DetailTarget | null>(null)
  const inv = player.inventory
  const sys = player.cultivationSystems
  const hasContent = player.artifacts.length > 0 || inv.length > 0 || !!sys.spiritBeast
    || !!sys.bloodline || sys.techniques.length > 0 || sys.divineWeapons.length > 0

  let detailName = ''
  let detailDesc = ''
  let detailBonus = ''
  let detailUsable = false
  if (detail?.kind === 'artifact') {
    const info = getArtifactInfo(player.artifacts[detail.index])
    detailName = info.name
    detailDesc = info.description
    detailBonus = info.bonus ?? ''
  } else if (detail?.kind === 'item') {
    const item = inv[detail.index]
    if (item) {
      detailName = item.name
      detailDesc = item.description
      detailUsable = item.usable
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 px-4"
      onClick={(e) => { if ((e.target as HTMLElement).dataset.overlay) onClose() }}
    >
      <div
        data-overlay="false"
        className="max-w-sm w-full h-[420px] border border-[var(--color-jade)]/40 bg-[var(--color-ink)] p-5 flex flex-col"
      >
        {/* 标题 */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg text-[var(--color-gold)]" style={{ fontFamily: 'var(--font-display)' }}>
            {detail ? '详情' : '👜 乾坤袋'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-[var(--color-mist)] hover:text-[var(--color-parchment)] cursor-pointer border border-[var(--color-mist)]/20 px-2 py-1 rounded-sm"
          >
            关闭
          </button>
        </div>

        {/* 详情 */}
        {detail && (
          <div className="flex-1 flex flex-col">
            <div className="flex-1">
              <p className="text-base text-[var(--color-parchment)] mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                {detailName}
              </p>
              <p className="text-sm text-[var(--color-mist)] leading-relaxed mb-3">
                {detailDesc}
              </p>
              {detailBonus && (
                <p className="text-xs text-[var(--color-jade-light)]">✦ {detailBonus}</p>
              )}
            </div>
            <div className="flex gap-2">
              {detailUsable && detail.kind === 'item' && onUseItem && (
                <button
                  type="button"
                  onClick={() => { onUseItem(detail.index); setDetail(null) }}
                  className="flex-1 text-sm px-4 py-2 border border-[var(--color-jade)]/60 rounded-sm
                    text-[var(--color-jade-light)] hover:text-[var(--color-gold)] hover:border-[var(--color-gold)]/40
                    bg-[rgba(45,90,74,0.12)] hover:bg-[rgba(45,90,74,0.25)] cursor-pointer transition-colors"
                >
                  使用
                </button>
              )}
              <button
                type="button"
                onClick={() => setDetail(null)}
                className="flex-1 text-sm px-4 py-2 border border-[var(--color-mist)]/20 rounded-sm
                  text-[var(--color-mist)] hover:text-[var(--color-parchment)] cursor-pointer transition-colors"
              >
                返回
              </button>
            </div>
          </div>
        )}

        {/* 空 */}
        {!detail && !hasContent && (
          <p className="text-sm text-[var(--color-mist)] text-center flex-1 flex items-center justify-center">
            乾坤袋空空如也
          </p>
        )}

        {/* 列表 */}
        {!detail && hasContent && (
          <div className="flex-1 overflow-y-auto min-h-0 space-y-3" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(74,138,114,0.45) transparent' }}>
            {/* 灵兽 */}
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

            {/* 血脉 */}
            {sys.bloodline && (
              <div>
                <p className="text-xs text-[var(--color-cinnabar-glow)] mb-1.5">血脉</p>
                <div className="text-xs px-3 py-2 border border-[var(--color-cinnabar)]/20 rounded-sm">
                  <p className="text-[var(--color-parchment)]">{sys.bloodline}</p>
                </div>
              </div>
            )}

            {/* 功法 */}
            {sys.techniques.length > 0 && (
              <div>
                <p className="text-xs text-[var(--color-jade-light)] mb-1.5">功法</p>
                {sys.techniques.map((name, i) => (
                  <div key={`t-${i}`} className="text-xs px-3 py-2 border border-[var(--color-jade)]/20 rounded-sm mb-1">
                    <p className="text-[var(--color-jade-light)]">{name}</p>
                  </div>
                ))}
              </div>
            )}

            {/* 神兵 */}
            {sys.divineWeapons.length > 0 && (
              <div>
                <p className="text-xs text-[var(--color-gold-dim)] mb-1.5">神兵</p>
                {sys.divineWeapons.map((name, i) => (
                  <div key={`w-${i}`} className="text-xs px-3 py-2 border border-[var(--color-gold)]/20 rounded-sm mb-1">
                    <p className="text-[var(--color-gold)]">{name}</p>
                  </div>
                ))}
              </div>
            )}

            {/* 法宝 */}
            {player.artifacts.length > 0 && (
              <div>
                <p className="text-xs text-[var(--color-gold-dim)] mb-1.5">法宝</p>
                {player.artifacts.map((id, i) => {
                  const info = getArtifactInfo(id)
                  return (
                    <div
                      key={`a-${i}`}
                      onClick={() => setDetail({ kind: 'artifact', index: i })}
                      className="text-xs px-3 py-2 border border-[var(--color-gold)]/20 rounded-sm mb-1 cursor-pointer
                        hover:border-[var(--color-gold)]/40 hover:bg-[rgba(184,154,76,0.06)] transition-colors"
                    >
                      <p className="text-[var(--color-gold)]">{info.name}</p>
                    </div>
                  )
                })}
              </div>
            )}

            {/* 物品 */}
            {inv.length > 0 && (
              <div>
                <p className="text-xs text-[var(--color-jade-light)] mb-1.5">物品</p>
                {inv.map((item, i) => (
                  <div
                    key={`item-${i}`}
                    onClick={() => setDetail({ kind: 'item', index: i })}
                    className="text-xs px-3 py-2 border border-[var(--color-jade)]/20 rounded-sm mb-1 cursor-pointer
                      hover:border-[var(--color-jade)]/40 hover:bg-[rgba(45,90,74,0.06)] transition-colors"
                  >
                    <p className="text-[var(--color-parchment)]">{item.name}</p>
                    <p className="text-[var(--color-mist)] text-[10px]">{item.description}</p>
                  </div>
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
