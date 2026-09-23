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

  const lowLifespan = remaining <= 10

  return (
    <header className="rule-fade pb-5 mb-6 relative">
      {realmFlash && (
        <div className="absolute inset-0 bg-gold/10 animate-breakthrough pointer-events-none z-10" />
      )}

      {/* pr-28 给右上角绝对定位工具栏让位，防止章节/回合徽标被压住 */}
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3 pr-28">
        <h2 className="text-2xl text-gold tracking-wide" style={{ fontFamily: 'var(--font-display)' }}>
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

      {/* 生存要害：修为进度与寿元提到首行，强调层级 */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex justify-between text-xs text-mist mb-1.5 tracking-wider">
            <span>修为</span>
            <span className="text-gold-dim">{player.cultivation}%</span>
          </div>
          <div
            className={`h-2.5 bg-black/40 rounded-full overflow-hidden border border-jade/20 ${barFlash ? 'animate-bar-glow' : ''}`}
            role="progressbar"
            aria-valuenow={player.cultivation}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="修为进度"
          >
            <div
              className="h-full bg-gradient-to-r from-jade via-jade-light to-gold transition-all duration-500 bar-shimmer"
              style={{ width: `${player.cultivation}%` }}
            />
          </div>
        </div>
        <div
          className={`shrink-0 px-3 py-1 rounded-sm border text-right bg-ink/40 ${
            lowLifespan ? 'border-cinnabar/50 animate-pulse-cinnabar' : 'border-jade/20'
          }`}
        >
          <p className="text-[10px] text-mist tracking-wider">寿元</p>
          <p className={`text-xl font-semibold leading-none ${lowLifespan ? 'text-cinnabar' : 'text-parchment'}`}>
            {remaining}
            <span className="text-xs ml-0.5 font-normal">年</span>
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-3">
        <Badge tone="gold" size="sm" className={realmFlash ? 'animate-stat-gain font-semibold' : ''}>
          {getRealmName(player.realm)}
        </Badge>
        <Badge tone="mist" size="sm">
          {player.spiritRoot}
        </Badge>
        <Badge tone="mist" size="sm">
          {player.age} 岁
        </Badge>
      </div>

      {routes.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {routes.map((r) => (
            <Badge key={r.label} tone={r.tone as 'jade' | 'gold' | 'cinnabar' | 'mist'} size="md">
              {r.label}
            </Badge>
          ))}
        </div>
      )}

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
        <p className="text-xs text-gold-dim mb-3 italic">
          天机示警：{player.nextEventHint}
        </p>
      )}

      {/* 六维数值降权成一行小字 */}
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
          className="btn-ghost text-xs px-3.5 py-1.5 tracking-wider cursor-pointer"
        >
          📊 属性
        </button>
        <button
          type="button"
          onClick={() => setShowCultivation(true)}
          className="btn-ghost text-xs px-3.5 py-1.5 tracking-wider cursor-pointer"
        >
          ⚔ 修炼
        </button>
        <button
          type="button"
          onClick={() => setShowInventory(true)}
          className="btn-ghost text-xs px-3.5 py-1.5 tracking-wider cursor-pointer"
        >
          👜 乾坤袋
        </button>
        <button
          type="button"
          onClick={() => setShowStoryline(true)}
          className="btn-ghost text-xs px-3.5 py-1.5 tracking-wider cursor-pointer"
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
    <div className={`stat-card px-2 py-1.5 rounded-sm text-center ${warn ? 'animate-demon-creep' : ''}`}>
      <p className="text-[10px] text-mist tracking-wider">{label}</p>
      <p className={`text-sm font-semibold ${warn ? 'text-cinnabar' : 'text-parchment'} ${flashClass}`}>
        {value}
      </p>
    </div>
  )
}
