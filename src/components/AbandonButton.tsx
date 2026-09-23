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
        className="text-sm text-mist hover:text-cinnabar-glow transition-colors cursor-pointer"
      >
        弃道归去
      </button>

      {show && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop px-6"
          onClick={() => setShow(false)}
        >
          <div
            className="modal-panel animate-modal-in max-w-sm w-full p-6 text-center"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="确认弃道"
          >
            <p
              className="text-xl text-parchment mb-2"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              确认弃道？
            </p>
            <p className="text-sm text-mist mb-6">
              当前修行进度将丢失，不可恢复。
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShow(false)}
                className="btn-ghost flex-1 py-2.5 min-h-[44px] text-sm cursor-pointer"
              >
                继续修行
              </button>
              <button
                type="button"
                onClick={onAbandon}
                className="btn-cinnabar flex-1 py-2.5 min-h-[44px] text-sm cursor-pointer"
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
