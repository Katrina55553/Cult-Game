import { memo, useEffect, useRef, useState } from 'react'
import { AttributeModal } from './AttributeModal'
import { Badge } from './Badge'
import { CultivationModal } from './CultivationModal'
import { InventoryModal } from './InventoryModal'
import { StorylinePanel } from './StorylinePanel'
import { getChapter } from '../data/chapters'
import { getRealmName } from '../engine/gameEngine'
import { getRouteTags, getWarnings } from '../engine/routeInfo'
import type { PlayerState } from '../types/game'

interface Props {
  player: PlayerState
  turn: number
  onUseItem?: (index: number) => void
}

export const StatusPanel = memo(function StatusPanel({ player, turn, onUseItem }: Props) {
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
    <header className="border-b border-[var(--color-jade)]/40 pb-5 mb-6 relative">
      {realmFlash && (
        <div className="absolute inset-0 bg-[var(--color-gold)]/10 animate-breakthrough pointer-events-none z-10" />
      )}

      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
        <h2 className="text-2xl text-[var(--color-gold)] tracking-wide" style={{ fontFamily: 'var(--font-display)' }}>
          {player.name}
        </h2>
        <div className="flex items-center gap-2">
          {(() => {
            const ch = getChapter(player.currentChapter)
            if (!ch) return null
            const total = ch.events.length
            const done = player.chapterCompleted.filter((id) => ch.events.includes(id)).length
            return (
              <Badge tone="jade" size="sm">
                {ch.name} · {done}/{total}
              </Badge>
            )
          })()}
          <Badge tone="mist" size="sm">
            第 {turn} 回合
          </Badge>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {routes.map((r) => (
          <Badge key={r.label} tone={r.tone as 'jade' | 'gold' | 'cinnabar' | 'mist'} size="md">
            {r.label}
          </Badge>
        ))}
      </div>

      {warnings.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {warnings.map((w) => (
            <Badge key={w} tone="cinnabar" size="sm" className="animate-pulse-glow">
              ⚠ {w}
            </Badge>
          ))}
        </div>
      )}

      {player.nextEventHint && (
        <p className="text-xs text-[var(--color-gold-dim)] mb-3 italic">
          天机示警：{player.nextEventHint}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Badge tone="gold" size="sm" className={realmFlash ? 'animate-stat-gain font-semibold' : ''}>
          {getRealmName(player.realm)}
        </Badge>
        <Badge tone="mist" size="sm">
          {player.spiritRoot}
        </Badge>
        <Badge tone="mist" size="sm">
          {player.age} 岁
        </Badge>
        <Badge tone={remaining <= 10 ? 'cinnabar' : 'mist'} size="sm">
          寿元 {remaining} 年
        </Badge>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-xs text-[var(--color-mist)] mb-1.5 tracking-wider">
          <span>修为</span>
          <span className="text-[var(--color-gold-dim)]">{player.cultivation}%</span>
        </div>
        <div
          className={`h-2 bg-[rgba(0,0,0,0.4)] rounded-full overflow-hidden border border-[var(--color-jade)]/20 ${barFlash ? 'animate-bar-glow' : ''}`}
          role="progressbar"
          aria-valuenow={player.cultivation}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="修为进度"
        >
          <div
            className="h-full bg-gradient-to-r from-[var(--color-jade)] via-[var(--color-jade-light)] to-[var(--color-gold)] transition-all duration-500 bar-shimmer"
            style={{ width: `${player.cultivation}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-xs mb-4">
        <AnimatedStat label="根骨" value={player.stats.rootBone} />
        <AnimatedStat label="悟性" value={player.stats.comprehension} />
        <AnimatedStat label="气运" value={player.stats.luck} />
        <AnimatedStat label="因果" value={player.stats.karma} />
        <AnimatedStat label="心魔" value={player.stats.demonHeart} warn={player.stats.demonHeart >= 50} />
        <AnimatedStat label="灵石" value={player.spiritStones} />
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setShowAttr(true)}
          className="text-xs text-[var(--color-jade-light)] hover:text-[var(--color-gold)] cursor-pointer
            border border-[var(--color-jade)]/30 hover:border-[var(--color-gold)]/50 px-3.5 py-1.5 rounded-sm transition-all
            hover:bg-[var(--color-gold)]/5 tracking-wider"
        >
          📊 属性
        </button>
        <button
          type="button"
          onClick={() => setShowCultivation(true)}
          className="text-xs text-[var(--color-jade-light)] hover:text-[var(--color-gold)] cursor-pointer
            border border-[var(--color-jade)]/30 hover:border-[var(--color-gold)]/50 px-3.5 py-1.5 rounded-sm transition-all
            hover:bg-[var(--color-gold)]/5 tracking-wider"
        >
          ⚔ 修炼
        </button>
        <button
          type="button"
          onClick={() => setShowInventory(true)}
          className="text-xs text-[var(--color-jade-light)] hover:text-[var(--color-gold)] cursor-pointer
            border border-[var(--color-jade)]/30 hover:border-[var(--color-gold)]/50 px-3.5 py-1.5 rounded-sm transition-all
            hover:bg-[var(--color-gold)]/5 tracking-wider"
        >
          👜 乾坤袋
        </button>
        <button
          type="button"
          onClick={() => setShowStoryline(true)}
          className="text-xs text-[var(--color-jade-light)] hover:text-[var(--color-gold)] cursor-pointer
            border border-[var(--color-jade)]/30 hover:border-[var(--color-gold)]/50 px-3.5 py-1.5 rounded-sm transition-all
            hover:bg-[var(--color-gold)]/5 tracking-wider"
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
})

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
    <div className="stat-card px-2 py-1.5 rounded-sm text-center">
      <p className="text-[10px] text-[var(--color-mist)] tracking-wider">{label}</p>
      <p className={`text-sm font-semibold ${warn ? 'text-[var(--color-cinnabar)]' : 'text-[var(--color-parchment)]'} ${flashClass}`}>
        {value}
      </p>
    </div>
  )
}
