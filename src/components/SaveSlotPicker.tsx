import { useState } from 'react'
import type { SaveSlotInfo } from '../engine/gameEngine'

const PHASE_LABELS: Record<string, string> = {
  root_reveal: '灵根揭晓',
  playing: '修行中',
  shop: '坊市',
  ending: '已结局',
}

interface Props {
  slots: SaveSlotInfo[]
  onSelect: (slot: number) => void
  onDelete: (slot: number) => void
  onNewGame: (slot: number) => void
}

export function SaveSlotPicker({ slots, onSelect, onDelete, onNewGame }: Props) {
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null)

  const allSlots = [0, 1, 2].map((id) => {
    const info = slots.find((s) => s.id === id)
    return { id, info }
  })

  return (
    <div className="w-full max-w-sm space-y-3 animate-fade-up relative z-10">
      <p className="text-sm text-[var(--color-mist)] text-center tracking-wider mb-2">— 存档选择 —</p>
      {allSlots.map(({ id, info }) => (
        <div
          key={id}
          className="border border-[var(--color-jade)]/30 bg-[rgba(12,15,13,0.5)] rounded-sm overflow-hidden"
        >
          {info ? (
            <div className="flex items-center justify-between px-4 py-3">
              <button
                type="button"
                onClick={() => onSelect(id)}
                className="flex-1 text-left cursor-pointer min-w-0"
              >
                <div className="flex items-baseline gap-2 mb-0.5">
                  <span className="text-[var(--color-parchment)] font-semibold">{info.player.name}</span>
                  <span className="text-xs text-[var(--color-mist)]">
                    {info.player.spiritRoot} · {info.player.realm}
                  </span>
                </div>
                <div className="text-xs text-[var(--color-mist)]">
                  {info.player.age} 岁 · 第 {info.turn} 回合 · {PHASE_LABELS[info.phase] ?? info.phase}
                </div>
              </button>
              {confirmDelete === id ? (
                <div className="flex items-center gap-2 ml-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      onDelete(id)
                      setConfirmDelete(null)
                    }}
                    className="text-xs text-[var(--color-cinnabar-glow)] cursor-pointer"
                  >
                    确认
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(null)}
                    className="text-xs text-[var(--color-mist)] cursor-pointer"
                  >
                    取消
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(id)}
                  className="text-xs text-[var(--color-mist)] hover:text-[var(--color-cinnabar-glow)] cursor-pointer ml-3 shrink-0"
                >
                  删除
                </button>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onNewGame(id)}
              className="w-full px-4 py-3 text-left cursor-pointer hover:bg-[rgba(45,90,74,0.12)] transition-colors"
            >
              <span className="text-sm text-[var(--color-mist)]">空存档槽 · 点击开始新游戏</span>
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
