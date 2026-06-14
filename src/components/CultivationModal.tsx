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
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 px-4"
      onClick={(e) => { if ((e.target as HTMLElement).dataset.overlay) onClose() }}
    >
      <div
        data-overlay="false"
        className="max-w-sm w-full border border-[var(--color-jade)]/40 bg-[var(--color-ink)] p-5 flex flex-col"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg text-[var(--color-gold)]" style={{ fontFamily: 'var(--font-display)' }}>
            ⚔ 修炼体系
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-[var(--color-mist)] hover:text-[var(--color-parchment)] cursor-pointer border border-[var(--color-mist)]/20 px-2 py-1 rounded-sm"
          >
            关闭
          </button>
        </div>

        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between text-sm px-3 py-2 bg-[rgba(0,0,0,0.2)] rounded-sm"
            >
              <span className="text-[var(--color-mist)]">{item.label}</span>
              <span style={{ color: item.color }}>{item.value}</span>
            </div>
          ))}
        </div>

        {/* 功法列表 */}
        {sys.techniques.length > 0 && (
          <div className="mt-4">
            <p className="text-xs text-[var(--color-mist)] mb-1.5">已习得功法</p>
            <div className="flex flex-wrap gap-1.5">
              {sys.techniques.map((name, i) => (
                <span key={i} className="text-xs px-2 py-0.5 border border-[var(--color-jade)]/20 rounded-sm text-[var(--color-jade-light)]">
                  {name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 神兵列表 */}
        {sys.divineWeapons.length > 0 && (
          <div className="mt-3">
            <p className="text-xs text-[var(--color-mist)] mb-1.5">已铸神兵</p>
            <div className="flex flex-wrap gap-1.5">
              {sys.divineWeapons.map((name, i) => (
                <span key={i} className="text-xs px-2 py-0.5 border border-[var(--color-gold)]/20 rounded-sm text-[var(--color-gold)]">
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
