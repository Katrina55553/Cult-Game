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
          <div className="border border-[var(--color-gold)] bg-[rgba(12,15,13,0.95)] px-4 py-4 rounded-sm text-center">
            <p className="text-xs text-[var(--color-gold)] tracking-wider mb-1">— 交易成功 —</p>
            <p className="text-[var(--color-parchment)] font-semibold">
              购得「{purchaseToast.name}」
            </p>
            <p className="text-xs text-[var(--color-mist)] mt-1">{purchaseToast.description}</p>
            <p className="text-xs text-[var(--color-jade-light)] mt-2">
              即刻生效：{purchaseToast.effectNote}
            </p>
            <p className="text-xs text-[var(--color-gold-dim)] mt-1">
              花费 {purchaseToast.cost} 灵石 · 剩余 {player.spiritStones} 灵石
            </p>
            <button
              type="button"
              onClick={() => setPurchaseToast(null)}
              className="mt-3 text-xs text-[var(--color-mist)] hover:text-[var(--color-parchment)] cursor-pointer"
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
        className="text-3xl text-[var(--color-gold)] mb-2 text-center"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        坊市小憩
      </h2>
      <p className="text-center text-sm text-[var(--color-mist)] mb-4">
        灵石：{player.spiritStones}
      </p>

      {/* 状态面板 */}
      <div className="border border-[var(--color-jade)]/30 bg-[rgba(12,15,13,0.5)] p-4 rounded-sm mb-6">
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-[var(--color-parchment-dim)] mb-3 justify-center">
          <span>{getRealmName(player.realm)}</span>
          <span>·</span>
          <span>{player.spiritRoot}</span>
          <span>·</span>
          <span>{player.age} 岁</span>
          <span>·</span>
          <span className={player.lifespan - player.age <= 10 ? 'text-[var(--color-cinnabar)]' : ''}>
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

      <div className="space-y-3 mb-6">
        {SHOP_ITEMS.map((item) => {
          const affordable = player.spiritStones >= item.cost
          const isSelected = selectedId === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedId(item.id)}
              className={`w-full text-left px-4 py-3 rounded-sm border transition-all cursor-pointer
                ${isSelected
                  ? 'border-[var(--color-gold)] bg-[rgba(201,162,39,0.12)] ring-1 ring-[var(--color-gold)]/40'
                  : affordable
                    ? 'border-[var(--color-jade)]/60 bg-[rgba(45,90,74,0.12)] hover:bg-[rgba(45,90,74,0.25)]'
                    : 'border-[var(--color-mist)]/20 bg-[rgba(12,15,13,0.4)] opacity-60'
                }`}
            >
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-[var(--color-parchment)]">{item.name}</span>
                <span className={`text-sm ${affordable ? 'text-[var(--color-gold)]' : 'text-[var(--color-mist)]'}`}>
                  {item.cost} 灵石
                </span>
              </div>
              <p className="text-xs text-[var(--color-mist)]">{item.description}</p>
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
              ? 'bg-[var(--color-cinnabar)] hover:bg-[var(--color-cinnabar-glow)] text-[var(--color-parchment)] cursor-pointer border border-[var(--color-cinnabar-glow)]/50'
              : 'bg-[rgba(45,90,74,0.15)] text-[var(--color-mist)] cursor-not-allowed border border-[var(--color-mist)]/20'
            }`}
        >
          {selected
            ? `确认购买「${selected.name}」（${selected.cost} 灵石）`
            : '请先选择商品'}
        </button>

        <button
          type="button"
          onClick={onLeave}
          className="w-full py-3.5 min-h-[44px] bg-[var(--color-jade)] hover:bg-[var(--color-jade-light)]
            text-[var(--color-parchment)] tracking-wider rounded-sm cursor-pointer transition-all"
        >
          离开坊市，继续修行
        </button>
      </div>
    </div>
  )
}

function MiniStat({ label, value, warn }: { label: string; value: string | number; warn?: boolean }) {
  return (
    <div className="bg-[rgba(0,0,0,0.2)] px-2 py-1.5 rounded-sm text-center">
      <p className="text-[var(--color-mist)]">{label}</p>
      <p className={warn ? 'text-[var(--color-cinnabar)]' : 'text-[var(--color-parchment)]'}>{value}</p>
    </div>
  )
}
