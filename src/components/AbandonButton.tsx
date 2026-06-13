import { useState } from 'react'

interface Props {
  onAbandon: () => void
}

export function AbandonButton({ onAbandon }: Props) {
  const [confirm, setConfirm] = useState(false)

  if (confirm) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="text-[var(--color-mist)]">确认弃道？</span>
        <button
          type="button"
          onClick={onAbandon}
          className="text-[var(--color-cinnabar-glow)] hover:text-[var(--color-cinnabar)] cursor-pointer"
        >
          确认
        </button>
        <button
          type="button"
          onClick={() => setConfirm(false)}
          className="text-[var(--color-mist)] hover:text-[var(--color-parchment)] cursor-pointer"
        >
          取消
        </button>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setConfirm(true)}
      className="text-sm text-[var(--color-mist)] hover:text-[var(--color-cinnabar-glow)] transition-colors cursor-pointer"
    >
      弃道归去
    </button>
  )
}
