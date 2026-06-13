import { useEffect, useRef, useState } from 'react'
import type { OriginId } from '../types/game'

const OPTIONS: { value: OriginId; label: string; desc: string }[] = [
  { value: null, label: '随机散修', desc: '无特殊加成' },
  { value: 'farmer', label: '农家子弟', desc: '因果 +8' },
  { value: 'noble_exile', label: '世家弃子', desc: '悟性 +6 · 灵石 +30' },
  { value: 'demon_blood', label: '魔裔血脉', desc: '根骨 +6 · 心魔 +12' },
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
        className="w-full px-4 py-3 bg-[#141a17] border border-[var(--color-jade)] rounded-sm
          flex items-center justify-between gap-3 text-base text-[var(--color-parchment)] cursor-pointer
          hover:border-[var(--color-jade-light)] focus:outline-none focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)]/30"
      >
        <span className="shrink-0">{selected.label}</span>
        <span className="text-xs text-[var(--color-mist)] truncate text-right">{selected.desc}</span>
      </button>

      {open && (
        <ul
          className="absolute z-20 mt-1 w-full border border-[var(--color-jade)] bg-[#141a17] rounded-sm
            shadow-[0_8px_24px_rgba(0,0,0,0.5)] overflow-hidden"
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
                  className={`w-full px-4 py-3 flex items-center justify-between gap-3 cursor-pointer transition-colors
                    ${active
                      ? 'bg-[var(--color-jade)] text-[var(--color-parchment)]'
                      : 'bg-[#141a17] text-[var(--color-parchment)] hover:bg-[#1c2420]'
                    }`}
                >
                  <span className="shrink-0">{opt.label}</span>
                  <span className={`text-xs truncate text-right ${active ? 'text-[var(--color-parchment-dim)]' : 'text-[var(--color-mist)]'}`}>
                    {opt.desc}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
