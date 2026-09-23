import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import {
  getPathLabel, getAlchemyLabel, getFormationLabel,
  getSwordLabel, getTechniqueLabel, getDivineWeaponLabel,
} from '../data/cultivationSystems'
import type { PlayerState } from '../types/game'

interface Props {
  player: PlayerState
  onClose: () => void
}

export function CultivationModal({ player, onClose }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const sys = player.cultivationSystems

  const items = [
    { label: '修炼路径', value: getPathLabel(sys.path), color: 'var(--color-jade-light)' },
    { label: '丹道', value: getAlchemyLabel(sys.alchemyTier), color: 'var(--color-gold)' },
    { label: '阵法', value: getFormationLabel(sys.formationTier), color: 'var(--color-jade-light)' },
    { label: '剑道', value: getSwordLabel(sys.swordTier), color: 'var(--color-cinnabar-glow)' },
    { label: '功法', value: getTechniqueLabel(sys.techniqueTier), color: 'var(--color-gold)' },
    { label: '神兵', value: getDivineWeaponLabel(sys.divineWeaponTier), color: 'var(--color-gold)' },
    { label: '神识', value: `${sys.divineSense}`, color: 'var(--color-jade-light)' },
  ]

  return createPortal(
    <div
      data-overlay="true"
      className="fixed inset-0 z-[9999] flex items-center justify-center modal-backdrop px-4"
      onClick={(e) => { if ((e.target as HTMLElement).dataset.overlay) onClose() }}
    >
      <div
        className="modal-panel animate-modal-in max-w-sm w-full max-h-[85vh] overflow-y-auto p-5 flex flex-col"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="modal-heading flex-1 text-lg text-gold" style={{ fontFamily: 'var(--font-display)' }}>
            ⚔ 修炼体系
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-mist hover:text-gold cursor-pointer border border-mist/20 hover:border-gold/40 px-2.5 py-1 rounded-sm transition-colors"
          >
            关闭
          </button>
        </div>

        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between text-sm px-3 py-2 bg-black/20 rounded-sm"
            >
              <span className="text-mist">{item.label}</span>
              <span style={{ color: item.color }}>{item.value}</span>
            </div>
          ))}
        </div>

        {/* 功法列表 */}
        {sys.techniques.length > 0 && (
          <div className="mt-4">
            <p className="text-xs text-mist mb-1.5">已习得功法</p>
            <div className="flex flex-wrap gap-1.5">
              {sys.techniques.map((name, i) => (
                <span key={i} className="text-xs px-2 py-0.5 border border-jade/20 rounded-sm text-jade-light">
                  {name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 神兵列表 */}
        {sys.divineWeapons.length > 0 && (
          <div className="mt-3">
            <p className="text-xs text-mist mb-1.5">已铸神兵</p>
            <div className="flex flex-wrap gap-1.5">
              {sys.divineWeapons.map((name, i) => (
                <span key={i} className="text-xs px-2 py-0.5 border border-gold/20 rounded-sm text-gold">
                  {name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}
