import { useState } from 'react'
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
  const inv = player.inventory
  const detail = detailIdx !== null ? inv[detailIdx] : null
  const hasContent = player.artifacts.length > 0 || inv.length > 0 || !!player.cultivationSystems.spiritBeast

  return createPortal(
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.6)', padding: '16px',
      }}
      onClick={(e) => {
        // 点击遮罩关闭
        if ((e.target as HTMLElement).dataset.overlay) onClose()
      }}
    >
      <div
        data-overlay="false"
        style={{
          width: '100%', maxWidth: '380px', height: '420px',
          border: '1px solid rgba(74,138,114,0.4)', background: '#0c0f0d',
          padding: '20px', display: 'flex', flexDirection: 'column',
        }}
      >
        {/* 标题 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ color: '#c9a84c', fontSize: '18px', fontFamily: 'var(--font-display)' }}>
            {detail ? '物品详情' : '👜 乾坤袋'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            style={{ color: '#8a9188', fontSize: '12px', cursor: 'pointer', border: '1px solid rgba(138,145,136,0.2)', padding: '2px 8px' }}
          >
            关闭
          </button>
        </div>

        {/* 详情 */}
        {detail && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1 }}>
              <p style={{ color: '#e8dcc8', fontSize: '16px', marginBottom: '8px', fontFamily: 'var(--font-display)' }}>
                {detail.name}
              </p>
              <p style={{ color: '#8a9188', fontSize: '14px', lineHeight: 1.8 }}>
                {detail.description}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {detail.usable && onUseItem && (
                <button
                  type="button"
                  onClick={() => { onUseItem(detailIdx!); setDetailIdx(null) }}
                  style={{
                    flex: 1, fontSize: '14px', padding: '8px 16px', cursor: 'pointer',
                    border: '1px solid rgba(74,138,114,0.6)', background: 'rgba(45,90,74,0.12)',
                    color: '#7ab89c',
                  }}
                >
                  使用
                </button>
              )}
              <button
                type="button"
                onClick={() => setDetailIdx(null)}
                style={{
                  fontSize: '14px', padding: '8px 16px', cursor: 'pointer',
                  border: '1px solid rgba(138,145,136,0.2)', color: '#8a9188',
                }}
              >
                返回
              </button>
            </div>
          </div>
        )}

        {/* 空 */}
        {!detail && !hasContent && (
          <p style={{ color: '#8a9188', fontSize: '14px', textAlign: 'center', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            乾坤袋空空如也
          </p>
        )}

        {/* 列表 */}
        {!detail && hasContent && (
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {player.cultivationSystems.spiritBeast && (
              <div>
                <p style={{ color: '#e06050', fontSize: '12px', marginBottom: '6px' }}>灵兽</p>
                <div style={{ fontSize: '12px', padding: '8px 12px', border: '1px solid rgba(224,96,80,0.2)' }}>
                  <p style={{ color: '#e8dcc8' }}>{player.cultivationSystems.spiritBeast.name} · {player.cultivationSystems.spiritBeast.tier}阶</p>
                </div>
              </div>
            )}

            {player.cultivationSystems.bloodline && (
              <div>
                <p style={{ color: '#e06050', fontSize: '12px', marginBottom: '6px' }}>血脉</p>
                <div style={{ fontSize: '12px', padding: '8px 12px', border: '1px solid rgba(224,96,80,0.2)' }}>
                  <p style={{ color: '#e8dcc8' }}>{player.cultivationSystems.bloodline}</p>
                </div>
              </div>
            )}

            {player.artifacts.length > 0 && (
              <div>
                <p style={{ color: '#b89a4c', fontSize: '12px', marginBottom: '6px' }}>法宝</p>
                {player.artifacts.map((id, i) => (
                  <div key={`a-${i}`} style={{ fontSize: '12px', padding: '8px 12px', border: '1px solid rgba(184,154,76,0.2)', marginBottom: '4px' }}>
                    <p style={{ color: '#c9a84c' }}>{formatArtifactName(id)}</p>
                  </div>
                ))}
              </div>
            )}

            {inv.length > 0 && (
              <div>
                <p style={{ color: '#7ab89c', fontSize: '12px', marginBottom: '6px' }}>物品</p>
                {inv.map((item, i) => (
                  <div
                    key={`item-${i}`}
                    onClick={() => { setDetailIdx(i) }}
                    style={{
                      fontSize: '12px', padding: '8px 12px',
                      border: '1px solid rgba(74,138,114,0.2)', marginBottom: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    <p style={{ color: '#e8dcc8' }}>{item.name}</p>
                    <p style={{ color: '#8a9188', fontSize: '10px' }}>{item.description}</p>
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
