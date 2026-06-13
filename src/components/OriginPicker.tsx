import { useEffect, useRef, useState } from 'react'
import type { OriginId } from '../types/game'

const OPTIONS: { value: OriginId; label: string; desc: string }[] = [
  { value: null, label: '随机散修', desc: '无特殊加成，全凭天命' },
  { value: 'farmer', label: '田园牧歌', desc: '因果 +8 · 心性质朴' },
  { value: 'scholar', label: '书香门第', desc: '悟性 +10 · 饱读经卷' },
  { value: 'merchant', label: '商贾世家', desc: '灵石 +50 · 家资丰厚' },
  { value: 'noble_exile', label: '世家遗孤', desc: '悟性 +6 · 灵石 +30' },
  { value: 'hermit', label: '隐世遗脉', desc: '寿元 +15 · 因果 +5' },
  { value: 'sect_orphan', label: '宗门弃婴', desc: '根骨悟性气运各 +3' },
  { value: 'healer', label: '悬壶济世', desc: '因果 +12 · 悟性 +3' },
  { value: 'tomb_raider', label: '墓中求生', desc: '气运 +8 · 灵石 +15 · 心魔 +5' },
  { value: 'demon_blood', label: '魔裔宿命', desc: '根骨 +6 · 心魔 +12 · 觉醒血脉' },
]

interface Props {
  value: OriginId
  onChange: (value: OriginId) => void
}

export function OriginPicker({ value, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const selected = OPTIONS.find((o) => o.value === value) ?? OPTIONS[0]

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="w-full px-4 py-3 bg-[#0a0d0c] border border-[var(--color-jade)]/40 rounded-sm
          flex items-center justify-between gap-3 text-base text-[var(--color-parchment)] cursor-pointer
          hover:border-[var(--color-jade-light)] focus:outline-none focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)]/30
          transition-colors"
      >
        <span className="shrink-0">{selected.label}</span>
        <span className="text-xs text-[var(--color-mist)] truncate text-right hidden sm:inline">{selected.desc}</span>
      </button>

      {open && (
        <ul
          className="absolute z-20 bottom-full mb-1 w-full max-h-60 overflow-y-auto border border-[var(--color-jade)]/40 bg-[#0a0d0c] rounded-sm
            shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
          role="listbox"
        >
          {OPTIONS.map((opt) => {
            const active = opt.value === value
            return (
              <li key={opt.label} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(opt.value)
                    setOpen(false)
                  }}
                  className={`w-full px-4 py-2.5 flex items-center justify-between gap-3 cursor-pointer transition-colors
                    ${active
                      ? 'bg-[var(--color-jade)]/60 text-[var(--color-parchment)]'
                      : 'text-[var(--color-parchment)] hover:bg-[#1c2420]'
                    }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-3 min-w-0">
                    <span className="shrink-0 text-sm">{opt.label}</span>
                    <span className={`text-xs ${active ? 'text-[var(--color-parchment-dim)]' : 'text-[var(--color-mist)]'}`}>
                      {opt.desc}
                    </span>
                  </div>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
