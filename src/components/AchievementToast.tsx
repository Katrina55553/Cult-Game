import { useEffect } from 'react'
import { ACHIEVEMENTS } from '../data/achievements'

interface Props {
  ids: string[]
  onDismiss: () => void
}

const BASE_MS = 3200
const EXTRA_PER_ITEM_MS = 600

export function AchievementToast({ ids, onDismiss }: Props) {
  useEffect(() => {
    if (ids.length === 0) return
    const duration = BASE_MS + (ids.length - 1) * EXTRA_PER_ITEM_MS
    const timer = window.setTimeout(onDismiss, duration)
    return () => clearTimeout(timer)
  }, [ids, onDismiss])

  if (ids.length === 0) return null

  const items = ids
    .map((id) => ACHIEVEMENTS.find((a) => a.id === id))
    .filter((a): a is NonNullable<typeof a> => a !== undefined)

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4 space-y-2">
      {items.map((a) => (
        <div
          key={a.id}
          className="border border-[var(--color-gold)] bg-[rgba(12,15,13,0.95)] px-4 py-3 rounded-sm animate-fade-up"
        >
          <p className="text-xs text-[var(--color-gold)] tracking-wider">成就解锁</p>
          <p className="text-[var(--color-parchment)] font-semibold">{a.title}</p>
          <p className="text-xs text-[var(--color-mist)]">{a.description}</p>
        </div>
      ))}
      <button
        type="button"
        onClick={onDismiss}
        className="w-full text-center text-xs text-[var(--color-mist)] py-1 cursor-pointer"
      >
        关闭
      </button>
    </div>
  )
}
