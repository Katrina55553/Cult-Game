import { useEffect } from 'react'
import type { Milestone } from '../types/game'

interface Props {
  milestone: Milestone | null
  onDismiss: () => void
}

const TONE: Record<Milestone['type'], string> = {
  breakthrough: 'text-[var(--color-gold)] border-[var(--color-gold)]',
  lifespan_low: 'text-[var(--color-cinnabar)] border-[var(--color-cinnabar)]',
  cultivation_full: 'text-[var(--color-jade-light)] border-[var(--color-jade-light)]',
  rare_event: 'text-[var(--color-cinnabar-glow)] border-[var(--color-cinnabar-glow)]',
}

export function MilestoneToast({ milestone, onDismiss }: Props) {
  useEffect(() => {
    if (!milestone) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDismiss()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [milestone, onDismiss])

  if (!milestone) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6 animate-fade-up"
      onClick={onDismiss}
      role="presentation"
    >
      <div
        className={`max-w-md w-full border-2 bg-[rgba(12,15,13,0.95)] px-8 py-6 rounded-sm text-center ${TONE[milestone.type]}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="里程碑通知"
      >
        <p className="text-xs tracking-[0.3em] mb-3 opacity-70">— 天机感应 —</p>
        <p className="text-xl leading-relaxed" style={{ fontFamily: 'var(--font-display)' }}>
          {milestone.message}
        </p>
        <button
          type="button"
          onClick={onDismiss}
          className="mt-6 text-sm text-[var(--color-mist)] hover:text-[var(--color-parchment)] cursor-pointer"
        >
          继续
        </button>
      </div>
    </div>
  )
}
