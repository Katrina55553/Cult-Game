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
  const selected = OPTIONS.find((o) => o.value === value) ?? OPTIONS[0]

  return (
    <div>
      <select
        id="origin"
        value={value ?? ''}
        onChange={(event) => {
          const option = OPTIONS.find((o) => (o.value ?? '') === event.target.value)
          if (option) onChange(option.value)
        }}
        aria-describedby="origin-description"
        className="w-full px-4 py-3 bg-ink-deep border border-jade/40 rounded-sm
          text-base text-parchment cursor-pointer
          hover:border-jade-light focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30
          transition-colors"
      >
        {OPTIONS.map((option) => (
          <option key={option.label} value={option.value ?? ''}>
            {option.label} · {option.desc}
          </option>
        ))}
      </select>
      <p id="origin-description" className="mt-2 text-xs text-mist">{selected.desc}</p>
    </div>
  )
}
