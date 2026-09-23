import { useEffect, useState } from 'react'
import { formatShopEffectNote, SHOP_ITEMS } from '../data/shop'
import { getRealmName } from '../engine/gameEngine'
import type { GameSession } from '../types/game'
import { AbandonButton } from './AbandonButton'

interface PurchaseToast {
  name: string
  description: string
  effectNote: string
  cost: number
}

interface Props {
  session: GameSession
  onBuy: (itemId: string) => void
  onLeave: () => void
  onAbandon: () => void
}

export function ShopScreen({ session, onBuy, onLeave, onAbandon }: Props) {
  const { player } = session
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [purchaseToast, setPurchaseToast] = useState<PurchaseToast | null>(null)

  const selected = SHOP_ITEMS.find((item) => item.id === selectedId)
  const canConfirm = selected !== undefined && player.spiritStones >= selected.cost

  useEffect(() => {
    if (!purchaseToast) return
    const timer = window.setTimeout(() => setPurchaseToast(null), 3000)
    return () => window.clearTimeout(timer)
  }, [purchaseToast])

  const handleConfirm = () => {
    if (!selectedId || !canConfirm || !selected) return
    onBuy(selectedId)
    setPurchaseToast({
      name: selected.name,
      description: selected.description,
      effectNote: formatShopEffectNote(selected.effect),
      cost: selected.cost,
    })
    setSelectedId(null)
  }

  return (
    <div className="min-h-screen px-3 sm:px-4 py-6 sm:py-8 max-w-lg mx-auto animate-fade-up relative safe-bottom">
      {purchaseToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4 animate-fade-up">
          <div className="scroll-panel border border-gold/60 bg-ink-panel/95 px-4 py-4 rounded-sm shadow-lift text-center">
            <p className="text-xs text-gold tracking-wider mb-1">— 交易成功 —</p>
            <p className="text-parchment font-semibold">
              购得「{purchaseToast.name}」
            </p>
            <p className="text-xs text-mist mt-1">{purchaseToast.description}</p>
            <p className="text-xs text-jade-light mt-2">
              即刻生效：{purchaseToast.effectNote}
            </p>
            <p className="text-xs text-gold-dim mt-1">
              花费 {purchaseToast.cost} 灵石 · 剩余 {player.spiritStones} 灵石
            </p>
            <button
              type="button"
              onClick={() => setPurchaseToast(null)}
              className="mt-3 text-xs text-mist hover:text-parchment cursor-pointer"
            >
              知道了
            </button>
          </div>
        </div>
      )}
      <div className="absolute top-4 right-4">
        <AbandonButton onAbandon={onAbandon} />
      </div>
      <h2
        className="text-3xl text-gold mb-2 text-center"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        坊市小憩
      </h2>
      <p className="text-center text-sm text-mist mb-4">
        灵石：{player.spiritStones}
      </p>

      {/* 状态面板 */}
      <div className="border border-jade/30 bg-ink/50 p-4 rounded-sm mb-6">
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-parchment-dim mb-3 justify-center">
          <span>{getRealmName(player.realm)}</span>
          <span>·</span>
          <span>{player.spiritRoot}</span>
          <span>·</span>
          <span>{player.age} 岁</span>
          <span>·</span>
          <span className={player.lifespan - player.age <= 10 ? 'text-cinnabar' : ''}>
            寿元 {player.lifespan - player.age} 年
          </span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-xs">
          <MiniStat label="根骨" value={player.stats.rootBone} />
          <MiniStat label="悟性" value={player.stats.comprehension} />
          <MiniStat label="气运" value={player.stats.luck} />
          <MiniStat label="因果" value={player.stats.karma} />
          <MiniStat label="心魔" value={player.stats.demonHeart} warn={player.stats.demonHeart >= 50} />
          <MiniStat label="修为" value={`${player.cultivation}%`} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {SHOP_ITEMS.map((item) => {
          const affordable = player.spiritStones >= item.cost
          const isSelected = selectedId === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedId(item.id)}
              className={`text-left px-3 py-2.5 rounded-sm border transition-all duration-200 cursor-pointer
                ${isSelected
                  ? 'border-gold bg-gold/12 ring-1 ring-gold/40 shadow-glow-cinnabar'
                  : affordable
                    ? 'border-jade/60 bg-jade/12 hover:bg-jade/25 hover:-translate-y-0.5 hover:border-jade-light'
                    : 'border-mist/20 bg-ink/40 opacity-60'
                }`}
            >
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-sm text-parchment">{item.name}</span>
                <span className={`text-xs ${affordable ? 'text-gold' : 'text-mist'}`}>
                  {item.cost}
                </span>
              </div>
              <p className="text-[10px] text-mist leading-snug">{item.description}</p>
            </button>
          )
        })}
      </div>

      <div className="space-y-3">
        <button
          type="button"
          disabled={!canConfirm}
          onClick={handleConfirm}
          className={`w-full py-3.5 min-h-[44px] tracking-wider rounded-sm transition-all
            ${canConfirm
              ? 'btn-cinnabar cursor-pointer'
              : 'bg-jade/15 text-mist cursor-not-allowed border border-mist/20'
            }`}
        >
          {selected
            ? `确认购买「${selected.name}」（${selected.cost} 灵石）`
            : '请先选择商品'}
        </button>

        <button
          type="button"
          onClick={onLeave}
          className="w-full py-3.5 min-h-[44px] bg-jade hover:bg-jade-light
            text-parchment tracking-wider rounded-sm cursor-pointer transition-all"
        >
          离开坊市，继续修行
        </button>
      </div>
    </div>
  )
}

function MiniStat({ label, value, warn }: { label: string; value: string | number; warn?: boolean }) {
  return (
    <div className="stat-card px-2 py-1.5 rounded-sm text-center">
      <p className="text-mist text-[10px] tracking-wider">{label}</p>
      <p className={warn ? 'text-cinnabar' : 'text-parchment'}>{value}</p>
    </div>
  )
}
