import { useEffect, useRef, useState } from 'react'
import { AttributeModal } from './AttributeModal'
import { CultivationModal } from './CultivationModal'
import { InventoryModal } from './InventoryModal'
import { StorylinePanel } from './StorylinePanel'
import { getRealmName } from '../engine/gameEngine'
import { getRouteTags, getWarnings } from '../engine/routeInfo'
import type { PlayerState } from '../types/game'

interface Props {
  player: PlayerState
  turn: number
  onUseItem?: (index: number) => void
}

const TONE_CLASS: Record<string, string> = {
  jade: 'border-[var(--color-jade)]/50 text-[var(--color-jade-light)]',
  gold: 'border-[var(--color-gold)]/50 text-[var(--color-gold)]',
  cinnabar: 'border-[var(--color-cinnabar)]/50 text-[var(--color-cinnabar-glow)]',
  mist: 'border-[var(--color-mist)]/30 text-[var(--color-mist)]',
}

export function StatusPanel({ player, turn, onUseItem }: Props) {
  const remaining = player.lifespan - player.age
  const routes = getRouteTags(player)
  const warnings = getWarnings(player)
  const prevRealm = useRef(player.realm)
  const [realmFlash, setRealmFlash] = useState(false)
  const prevCultivation = useRef(player.cultivation)
  const [barFlash, setBarFlash] = useState(false)
  const [showInventory, setShowInventory] = useState(false)
  const [showAttr, setShowAttr] = useState(false)
  const [showCultivation, setShowCultivation] = useState(false)
  const [showStoryline, setShowStoryline] = useState(false)

  useEffect(() => {
    if (player.realm !== prevRealm.current) {
      setRealmFlash(true)
      const t = setTimeout(() => setRealmFlash(false), 1500)
      prevRealm.current = player.realm
      return () => clearTimeout(t)
    }
  }, [player.realm])

  useEffect(() => {
    if (player.cultivation !== prevCultivation.current) {
      setBarFlash(true)
      const t = setTimeout(() => setBarFlash(false), 1000)
      prevCultivation.current = player.cultivation
      return () => clearTimeout(t)
    }
  }, [player.cultivation])

  return (
    <header className="border-b border-[var(--color-jade)]/40 pb-4 mb-6 relative">
      {realmFlash && (
        <div className="absolute inset-0 bg-[var(--color-gold)]/10 animate-breakthrough pointer-events-none z-10" />
      )}

      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
        <h2 className="text-xl text-[var(--color-gold)]" style={{ fontFamily: 'var(--font-display)' }}>
          {player.name}
        </h2>
        <span className="text-xs text-[var(--color-mist)]">第 {turn} 回合</span>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {routes.map((r) => (
          <span
            key={r.label}
            className={`text-xs px-2 py-0.5 rounded-sm border ${TONE_CLASS[r.tone]}`}
          >
            {r.label}
          </span>
        ))}
      </div>

      {warnings.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {warnings.map((w) => (
            <span key={w} className="text-xs text-[var(--color-cinnabar)] animate-pulse-glow px-2">
              ⚠ {w}
            </span>
          ))}
        </div>
      )}

      {player.nextEventHint && (
        <p className="text-xs text-[var(--color-gold-dim)] mb-3 italic">
          天机示警：{player.nextEventHint}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm text-[var(--color-parchment-dim)] mb-3">
        <span className={realmFlash ? 'animate-stat-gain font-semibold' : ''}>
          {getRealmName(player.realm)}
        </span>
        <span className="hidden sm:inline">·</span>
        <span>{player.spiritRoot}</span>
        <span className="hidden sm:inline">·</span>
        <span>{player.age} 岁</span>
        <span className="hidden sm:inline">·</span>
        <span className={remaining <= 10 ? 'text-[var(--color-cinnabar)]' : ''}>
          寿元 {remaining} 年
        </span>
      </div>

      <div className="mb-3">
        <div className="flex justify-between text-xs text-[var(--color-mist)] mb-1">
          <span>修为</span>
          <span>{player.cultivation}%</span>
        </div>
        <div
          className={`h-1.5 bg-[rgba(0,0,0,0.3)] rounded-full overflow-hidden ${barFlash ? 'animate-bar-glow' : ''}`}
          role="progressbar"
          aria-valuenow={player.cultivation}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="修为进度"
        >
          <div
            className="h-full bg-gradient-to-r from-[var(--color-jade)] to-[var(--color-gold)] transition-all duration-500"
            style={{ width: `${player.cultivation}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-xs">
        <AnimatedStat label="根骨" value={player.stats.rootBone} />
        <AnimatedStat label="悟性" value={player.stats.comprehension} />
        <AnimatedStat label="气运" value={player.stats.luck} />
        <AnimatedStat label="因果" value={player.stats.karma} />
        <AnimatedStat label="心魔" value={player.stats.demonHeart} warn={player.stats.demonHeart >= 50} />
        <AnimatedStat label="灵石" value={player.spiritStones} />
      </div>

      <div className="flex gap-2 mt-2">
        <button
          type="button"
          onClick={() => setShowAttr(true)}
          className="text-xs text-[var(--color-jade-light)] hover:text-[var(--color-gold)] cursor-pointer
            border border-[var(--color-jade)]/30 hover:border-[var(--color-gold)]/40 px-3 py-1.5 rounded-sm transition-colors"
        >
          📊 属性
        </button>
        <button
          type="button"
          onClick={() => setShowCultivation(true)}
          className="text-xs text-[var(--color-jade-light)] hover:text-[var(--color-gold)] cursor-pointer
            border border-[var(--color-jade)]/30 hover:border-[var(--color-gold)]/40 px-3 py-1.5 rounded-sm transition-colors"
        >
          ⚔ 修炼
        </button>
        <button
          type="button"
          onClick={() => setShowInventory(true)}
          className="text-xs text-[var(--color-jade-light)] hover:text-[var(--color-gold)] cursor-pointer
            border border-[var(--color-jade)]/30 hover:border-[var(--color-gold)]/40 px-3 py-1.5 rounded-sm transition-colors"
        >
          👜 乾坤袋
        </button>
        <button
          type="button"
          onClick={() => setShowStoryline(true)}
          className="text-xs text-[var(--color-jade-light)] hover:text-[var(--color-gold)] cursor-pointer
            border border-[var(--color-jade)]/30 hover:border-[var(--color-gold)]/40 px-3 py-1.5 rounded-sm transition-colors"
        >
          📜 剧情线
        </button>
      </div>

      {showInventory && (
        <InventoryModal
          player={player}
          onClose={() => setShowInventory(false)}
          onUseItem={onUseItem}
        />
      )}

      {showAttr && (
        <AttributeModal player={player} onClose={() => setShowAttr(false)} />
      )}

      {showCultivation && (
        <CultivationModal player={player} onClose={() => setShowCultivation(false)} />
      )}

      <StorylinePanel player={player} open={showStoryline} onClose={() => setShowStoryline(false)} />
    </header>
  )
}

function AnimatedStat({ label, value, warn }: { label: string; value: number; warn?: boolean }) {
  const prev = useRef(value)
  const [flash, setFlash] = useState<'gain' | 'loss' | null>(null)

  useEffect(() => {
    if (value !== prev.current) {
      setFlash(value > prev.current ? 'gain' : 'loss')
      const t = setTimeout(() => setFlash(null), 600)
      prev.current = value
      return () => clearTimeout(t)
    }
  }, [value])

  const flashClass = flash === 'gain' ? 'animate-stat-gain' : flash === 'loss' ? 'animate-stat-loss' : ''

  return (
    <div className="bg-[rgba(0,0,0,0.2)] px-2 py-1.5 rounded-sm text-center">
      <p className="text-[var(--color-mist)]">{label}</p>
      <p className={`${warn ? 'text-[var(--color-cinnabar)]' : 'text-[var(--color-parchment)]'} ${flashClass}`}>
        {value}
      </p>
    </div>
  )
}
