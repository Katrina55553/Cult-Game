import { useEffect, useState } from 'react'

interface Props {
  onAbandon: () => void
}

export function AbandonButton({ onAbandon }: Props) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!show) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShow(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [show])

  return (
    <>
      <button
        type="button"
        onClick={() => setShow(true)}
        className="text-sm text-[var(--color-mist)] hover:text-[var(--color-cinnabar-glow)] transition-colors cursor-pointer"
      >
        弃道归去
      </button>

      {show && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6"
          onClick={() => setShow(false)}
        >
          <div
            className="max-w-sm w-full border border-[var(--color-jade)]/40 bg-[var(--color-ink)] p-6 rounded-sm text-center animate-fade-up"
            onClick={(e) => e.stopPropagation()}
          >
            <p
              className="text-xl text-[var(--color-parchment)] mb-2"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              确认弃道？
            </p>
            <p className="text-sm text-[var(--color-mist)] mb-6">
              当前修行进度将丢失，不可恢复。
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShow(false)}
                className="flex-1 py-2.5 min-h-[44px] border border-[var(--color-mist)]/30 rounded-sm
                  text-[var(--color-mist)] hover:text-[var(--color-parchment)] hover:border-[var(--color-mist)]/60
                  cursor-pointer transition-colors"
              >
                继续修行
              </button>
              <button
                type="button"
                onClick={onAbandon}
                className="flex-1 py-2.5 min-h-[44px] bg-[var(--color-cinnabar)] hover:bg-[var(--color-cinnabar-glow)]
                  text-[var(--color-parchment)] rounded-sm cursor-pointer transition-colors
                  border border-[var(--color-cinnabar-glow)]/50"
              >
                确认弃道
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
