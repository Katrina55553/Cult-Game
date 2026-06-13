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
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12 relative overflow-hidden safe-bottom">
      {/* 背景装饰 */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[var(--color-jade)]/[0.04] blur-3xl" />
        <div className="absolute bottom-[10%] left-[20%] w-[300px] h-[300px] rounded-full bg-[var(--color-cinnabar)]/[0.03] blur-3xl" />
      </div>

      {/* 右上角按钮 */}
      <div className="absolute top-5 right-5 flex items-center gap-4 z-10">
        <button
          type="button"
          onClick={() => setShowCodex(true)}
          className="text-sm text-[var(--color-mist)] hover:text-[var(--color-gold)] transition-colors cursor-pointer
            border border-[var(--color-mist)]/20 hover:border-[var(--color-gold)]/40 px-3 py-1.5 rounded-sm"
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

      {/* 主标题区域 */}
      <div className="text-center max-w-lg mb-10 animate-fade-up relative z-10">
        <div className="flex items-center justify-center gap-4 mb-5">
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-[var(--color-gold)]/40" />
          <p className="text-[var(--color-gold-dim)] text-xs tracking-[0.5em] uppercase">天道渺渺 · 仙途漫漫</p>
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-[var(--color-gold)]/40" />
        </div>

        <h1
          className="text-6xl md:text-8xl mb-3 title-shimmer leading-tight"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          修仙模拟器
        </h1>

        <p className="text-[var(--color-mist)] text-sm tracking-widest mb-6">
          Cultivation Simulator
        </p>

        <p className="text-[var(--color-parchment-dim)] leading-relaxed text-base max-w-md mx-auto">
          每一次抉择皆关机缘，每一步修行皆是天命。<br />
          <span className="text-[var(--color-mist)]">收集结局 · 解锁成就 · 追寻你的道</span>
        </p>

        {meta.totalRuns > 0 && (
          <div className="mt-6 flex items-center justify-center gap-6 text-xs">
            <div className="text-center">
              <p className="text-[var(--color-gold)] text-lg font-semibold">{meta.totalRuns}</p>
              <p className="text-[var(--color-mist)] tracking-wider">修行次数</p>
            </div>
            <span className="h-8 w-px bg-[var(--color-mist)]/20" />
            <div className="text-center">
              <p className="text-[var(--color-gold)] text-lg font-semibold">{unlocked}/{total}</p>
              <p className="text-[var(--color-mist)] tracking-wider">结局收集</p>
            </div>
            {meta.bestTurn > 0 && (
              <>
                <span className="h-8 w-px bg-[var(--color-mist)]/20" />
                <div className="text-center">
                  <p className="text-[var(--color-gold)] text-lg font-semibold">{meta.bestTurn}</p>
                  <p className="text-[var(--color-mist)] tracking-wider">最佳回合</p>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* 表单区域 */}
      <form
        autoComplete="off"
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-5 animate-fade-up relative z-10"
        style={{ animationDelay: '0.15s' }}
      >
        <div className="border border-[var(--color-jade)]/30 bg-[rgba(12,15,13,0.5)] p-5 rounded-sm space-y-4">
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
              className="w-full px-4 py-3 bg-[#0a0d0c] border border-[var(--color-jade)]/40 rounded-sm
                text-[var(--color-parchment)] text-base
                focus:outline-none focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)]/30
                placeholder:text-[var(--color-mist)]/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm text-[var(--color-mist)] mb-2 tracking-wider">出身</label>
            <OriginPicker value={origin} onChange={setOrigin} />
          </div>

          <div className="space-y-2.5 pt-1">
            <label className="flex items-center gap-3 text-sm text-[var(--color-parchment-dim)] cursor-pointer group">
              <input
                type="checkbox"
                checked={dailyMode}
                onChange={(e) => setDailyMode(e.target.checked)}
                className="group-hover:border-[var(--color-gold)]/50 transition-colors"
              />
              <span>今日天命 <span className="text-[var(--color-mist)] text-xs">每日固定机缘种子</span></span>
            </label>

            {meta.innateBodyUnlocked && (
              <label className="flex items-center gap-3 text-sm text-[var(--color-gold-dim)] cursor-pointer group">
                <input
                  type="checkbox"
                  checked={useInnateBody}
                  onChange={(e) => setUseInnateBody(e.target.checked)}
                  className="group-hover:border-[var(--color-gold)]/50 transition-colors"
                />
                <span>先天道体 <span className="text-[var(--color-mist)] text-xs">根骨悟性略增</span></span>
              </label>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 min-h-[44px] bg-[var(--color-cinnabar)] hover:bg-[var(--color-cinnabar-glow)]
            text-[var(--color-parchment)] font-semibold tracking-[0.3em] rounded-sm
            transition-all cursor-pointer border border-[var(--color-cinnabar-glow)]/50
            hover:shadow-[0_0_20px_rgba(184,58,42,0.2)] active:scale-[0.98]"
        >
          踏入仙途
        </button>
      </form>

      {showCodex && <CodexScreen onClose={() => setShowCodex(false)} />}
    </div>
  )
}
