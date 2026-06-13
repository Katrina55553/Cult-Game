import { useMemo, useState } from 'react'
import { resumeAudio } from '../audio/sounds'
import { getEndingCodexProgress, loadMeta } from '../engine/metaProgress'
import type { OriginId } from '../types/game'
import type { StartGameParams } from '../hooks/useGame'
import { CodexScreen } from './CodexScreen'
import { OriginPicker } from './OriginPicker'

interface Props {
  onStart: (params: StartGameParams) => void
  soundOn: boolean
  onToggleSound: () => void
}

export function StartScreen({ onStart, soundOn, onToggleSound }: Props) {
  const [name, setName] = useState('')
  const [dailyMode, setDailyMode] = useState(false)
  const [useInnateBody, setUseInnateBody] = useState(false)
  const [origin, setOrigin] = useState<OriginId>(null)
  const [showCodex, setShowCodex] = useState(false)

  const meta = useMemo(() => loadMeta(), [])
  const { unlocked, total } = getEndingCodexProgress(meta)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    resumeAudio()
    onStart({ name, dailyMode, useInnateBody, origin })
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 animate-fade-up relative">
      <div className="absolute top-4 right-4 flex gap-3">
        <button
          type="button"
          onClick={() => setShowCodex(true)}
          className="text-sm text-[var(--color-mist)] hover:text-[var(--color-gold)] transition-colors cursor-pointer"
        >
          修仙志
        </button>
        <button
          type="button"
          onClick={onToggleSound}
          aria-label={soundOn ? '关闭音效' : '开启音效'}
          className="text-sm text-[var(--color-mist)] hover:text-[var(--color-gold)] transition-colors cursor-pointer"
        >
          {soundOn ? '🔔' : '🔕'}
        </button>
      </div>

      <div className="text-center max-w-lg">
        <p className="text-[var(--color-gold-dim)] text-sm tracking-[0.3em] mb-4">天道渺渺 · 仙途漫漫</p>
        <h1
          className="text-6xl md:text-7xl text-[var(--color-gold)] mb-6 animate-pulse-glow"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          修仙模拟器
        </h1>
        <p className="text-[var(--color-parchment-dim)] leading-relaxed mb-4 text-base">
          你是主角，每一次抉择皆关机缘。收集结局、解锁成就，追寻你的道。
        </p>
        {meta.totalRuns > 0 && (
          <p className="text-xs text-[var(--color-gold-dim)] mb-6">
            已修行 {meta.totalRuns} 次 · 结局 {unlocked}/{total}
          </p>
        )}
      </div>

      <form autoComplete="off" onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <div>
          <label htmlFor="dao-hao" className="block text-sm text-[var(--color-mist)] mb-2 tracking-wider">
            道号
          </label>
          <input
            id="dao-hao"
            name="dao-hao"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="请输入你的名字"
            maxLength={12}
            autoComplete="off"
            className="w-full px-4 py-3 bg-[#141a17] border border-[var(--color-jade)] rounded-sm
              text-[var(--color-parchment)] text-base
              focus:outline-none focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)]/30"
          />
        </div>

        <div>
          <label className="block text-sm text-[var(--color-mist)] mb-2">出身</label>
          <OriginPicker value={origin} onChange={setOrigin} />
        </div>

        <label className="flex items-center gap-2 text-sm text-[var(--color-parchment-dim)] cursor-pointer">
          <input type="checkbox" checked={dailyMode} onChange={(e) => setDailyMode(e.target.checked)} />
          今日天命（每日固定机缘种子）
        </label>

        {meta.innateBodyUnlocked && (
          <label className="flex items-center gap-2 text-sm text-[var(--color-gold-dim)] cursor-pointer">
            <input
              type="checkbox"
              checked={useInnateBody}
              onChange={(e) => setUseInnateBody(e.target.checked)}
            />
            先天道体（根骨悟性略增）
          </label>
        )}

        <button
          type="submit"
          className="w-full py-3 bg-[var(--color-cinnabar)] hover:bg-[var(--color-cinnabar-glow)]
            text-[var(--color-parchment)] font-semibold tracking-[0.2em] rounded-sm
            transition-all cursor-pointer border border-[var(--color-cinnabar-glow)]/50"
        >
          踏入仙途
        </button>
      </form>

      {showCodex && <CodexScreen onClose={() => setShowCodex(false)} />}
    </div>
  )
}
