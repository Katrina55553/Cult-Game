import { useEffect, useRef, useState } from 'react'
import { CultivationSystemsPanel } from './CultivationSystemsPanel'
import { StorylinePanel } from './StorylinePanel'
import { formatArtifactName } from '../data/artifacts'
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

      <CultivationSystemsPanel player={player} />

      <div className="flex gap-2 mt-2">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" onClick={() => setShowInventory(false)}>
          <div
            className="max-w-sm w-full h-[400px] border border-[var(--color-jade)]/40 bg-[var(--color-ink)] p-5 rounded-sm animate-slide-up flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg text-[var(--color-gold)]" style={{ fontFamily: 'var(--font-display)' }}>👜 乾坤袋</h3>
              <button
                type="button"
                onClick={() => setShowInventory(false)}
                className="text-xs text-[var(--color-mist)] hover:text-[var(--color-parchment)] cursor-pointer border border-[var(--color-mist)]/20 px-2 py-1 rounded-sm"
              >
                关闭
              </button>
            </div>
            {player.artifacts.length === 0 && player.inventory.length === 0 && !player.cultivationSystems.spiritBeast ? (
              <p className="text-sm text-[var(--color-mist)] text-center py-4 flex-1 flex items-center justify-center">乾坤袋空空如也</p>
            ) : (
              <div className="space-y-3 flex-1 overflow-y-auto log-scroll min-h-0">
                {/* 灵兽 */}
                {player.cultivationSystems.spiritBeast && (
                  <div>
                    <p className="text-xs text-[var(--color-cinnabar-glow)] mb-1.5">灵兽</p>
                    <div className="text-xs px-3 py-2 border border-[var(--color-cinnabar)]/20 rounded-sm">
                      <p className="text-[var(--color-parchment)]">{player.cultivationSystems.spiritBeast.name} · {player.cultivationSystems.spiritBeast.tier}阶</p>
                    </div>
                  </div>
                )}

                {/* 血脉 */}
                {player.cultivationSystems.bloodline && (
                  <div>
                    <p className="text-xs text-[var(--color-cinnabar-glow)] mb-1.5">血脉</p>
                    <div className="text-xs px-3 py-2 border border-[var(--color-cinnabar)]/20 rounded-sm">
                      <p className="text-[var(--color-parchment)]">{player.cultivationSystems.bloodline}</p>
                    </div>
                  </div>
                )}

                {/* 法宝 */}
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

                {/* 物品 */}
                {player.inventory.length > 0 && (
                  <div>
                    <p className="text-xs text-[var(--color-jade-light)] mb-1.5">物品</p>
                    {player.inventory.map((item, i) => (
                      <div key={`i-${i}`} className="text-xs flex items-center justify-between gap-2 px-3 py-2 border border-[var(--color-jade)]/20 rounded-sm mb-1">
                        <div className="min-w-0">
                          <p className="text-[var(--color-parchment)]">{item.name}</p>
                          <p className="text-[var(--color-mist)]">{item.description}</p>
                        </div>
                        {item.usable && onUseItem && (
                          <button
                            type="button"
                            onClick={() => onUseItem(i)}
                            className="shrink-0 text-xs px-3 py-1 border border-[var(--color-jade)]/40 rounded-sm
                              text-[var(--color-jade-light)] hover:text-[var(--color-gold)] hover:border-[var(--color-gold)]/40
                              cursor-pointer transition-colors"
                          >
                            使用
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
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
