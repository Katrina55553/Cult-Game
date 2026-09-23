import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { getRealmName } from '../engine/gameEngine'
import type { PlayerState } from '../types/game'

interface Props {
  player: PlayerState
  onClose: () => void
}

export function AttributeModal({ player, onClose }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const s = player.stats
  const sys = player.cultivationSystems
  const remaining = player.lifespan - player.age

  const mainStats = [
    { label: '根骨', value: s.rootBone, color: 'var(--color-jade-light)' },
    { label: '悟性', value: s.comprehension, color: 'var(--color-gold)' },
    { label: '气运', value: s.luck, color: 'var(--color-gold)' },
    { label: '因果', value: s.karma, color: s.karma >= 0 ? 'var(--color-jade-light)' : 'var(--color-cinnabar)' },
    { label: '心魔', value: s.demonHeart, color: s.demonHeart >= 50 ? 'var(--color-cinnabar)' : 'var(--color-mist)' },
  ]

  return createPortal(
    <div
      data-overlay="true"
      className="fixed inset-0 z-[9999] flex items-center justify-center modal-backdrop px-4"
      onClick={(e) => { if ((e.target as HTMLElement).dataset.overlay) onClose() }}
    >
      <div
        className="modal-panel animate-modal-in max-w-md w-full max-h-[85vh] p-6 flex flex-col overflow-y-auto"
        style={{ scrollbarWidth: 'thin', scrollbarColor: 'color-mix(in srgb, var(--color-jade-light) 45%, transparent) transparent' }}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="modal-heading flex-1 text-xl text-gold" style={{ fontFamily: 'var(--font-display)' }}>
            📊 属性
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-mist hover:text-gold cursor-pointer border border-mist/20 hover:border-gold/40 px-2.5 py-1 rounded-sm transition-colors"
          >
            关闭
          </button>
        </div>

        {/* 基本信息 */}
        <div className="space-y-2 mb-5 text-sm">
          <div className="flex justify-between">
            <span className="text-mist">境界</span>
            <span className="text-parchment">{getRealmName(player.realm)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-mist">年龄</span>
            <span className="text-parchment">{player.age} 岁</span>
          </div>
          <div className="flex justify-between">
            <span className="text-mist">寿元</span>
            <span className={remaining <= 10 ? 'text-cinnabar' : 'text-parchment'}>
              {remaining} 年
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-mist">修为</span>
            <span className="text-parchment">{player.cultivation}%</span>
          </div>
        </div>

        {/* 六维属性 */}
        <div className="mb-5">
          <p className="text-sm text-mist mb-2.5">基础属性</p>
          <div className="grid grid-cols-2 gap-2.5">
            {mainStats.map((stat) => (
              <div key={stat.label} className="flex justify-between text-sm px-3 py-2 bg-black/20 rounded-sm">
                <span className="text-mist">{stat.label}</span>
                <span style={{ color: stat.color }}>{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 血脉 */}
        {sys.bloodline && (
          <div className="mb-2">
            <p className="text-sm text-mist mb-2.5">血脉</p>
            <div className="text-sm px-4 py-2.5 border border-cinnabar/20 rounded-sm">
              <p className="text-cinnabar-glow">{sys.bloodline}</p>
              {sys.bloodlineTier > 0 && (
                <p className="text-mist text-xs mt-1">纯度 {sys.bloodlineTier} 阶</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}
