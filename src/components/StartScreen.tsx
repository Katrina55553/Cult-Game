import { useMemo, useState } from 'react'
import { Badge } from './Badge'
import { resumeAudio } from '../audio/sounds'
import { getEndingCodexProgress, loadMeta } from '../engine/metaProgress'
import type { NewGameOptions, OriginId } from '../types/game'
import { CodexScreen } from './CodexScreen'
import { OriginPicker } from './OriginPicker'

interface Props {
  onStart: (params: NewGameOptions) => void
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
        <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-jade/[0.04] blur-3xl" />
        <div className="absolute bottom-[10%] left-[20%] w-[300px] h-[300px] rounded-full bg-cinnabar/[0.03] blur-3xl" />
      </div>

      {/* 右上角按钮 */}
      <div className="absolute top-5 right-5 flex items-center gap-4 z-10">
        <button
          type="button"
          onClick={() => setShowCodex(true)}
          className="btn-ghost text-sm px-3 py-1.5 cursor-pointer"
        >
          修仙志
        </button>
        <button
          type="button"
          onClick={onToggleSound}
          aria-label={soundOn ? '关闭音效' : '开启音效'}
          className="text-sm text-mist hover:text-gold transition-colors cursor-pointer"
        >
          {soundOn ? '🔔' : '🔕'}
        </button>
      </div>

      {/* 主标题区域 */}
      <div className="text-center max-w-lg mb-10 animate-fade-up relative z-10">
        <div className="flex items-center justify-center gap-4 mb-5">
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold/40" />
          <p className="text-gold-dim text-xs tracking-[0.5em] uppercase">天道渺渺 · 仙途漫漫</p>
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold/40" />
        </div>

        <div className="relative inline-block mb-3">
          <h1
            className="text-6xl md:text-8xl title-shimmer leading-tight whitespace-nowrap"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            修仙模拟器
          </h1>
          {/* 外层 div 负责响应式隐藏：.seal-stamp 是非层叠 CSS，会压过 Tailwind 的 hidden */}
          <div className="hidden sm:block absolute -right-16 top-2">
            <span className="seal-stamp" aria-hidden="true">仙</span>
          </div>
        </div>

        <p className="text-mist text-sm tracking-widest mb-6">
          Cultivation Simulator
        </p>

        <p className="text-parchment-dim leading-relaxed text-base max-w-md mx-auto">
          每一次抉择皆关机缘，每一步修行皆是天命。<br />
          <span className="text-mist">收集结局 · 解锁成就 · 追寻你的道</span>
        </p>

        {meta.totalRuns > 0 && (
          <div className="mt-6 flex items-center justify-center gap-2 flex-wrap">
            <Badge tone="gold" size="md">
              修行 {meta.totalRuns} 次
            </Badge>
            <Badge tone="jade" size="md">
              结局 {unlocked}/{total}
            </Badge>
            {meta.bestTurn > 0 && (
              <Badge tone="cinnabar" size="md">
                最佳 {meta.bestTurn} 回合
              </Badge>
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
        <div className="scroll-panel border border-jade/30 bg-ink/50 p-5 rounded-sm space-y-4 overflow-hidden">
          <div className="spirit-motes" aria-hidden="true" />
          <div>
            <label htmlFor="dao-hao" className="block text-sm text-mist mb-2 tracking-wider">
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
              className="w-full px-4 py-3 bg-ink-deep border border-jade/40 rounded-sm
                text-parchment text-base
                focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30
                placeholder:text-mist/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm text-mist mb-2 tracking-wider">出身</label>
            <OriginPicker value={origin} onChange={setOrigin} />
          </div>

          <div className="space-y-2.5 pt-1">
            <label className="flex items-center gap-3 text-sm text-parchment-dim cursor-pointer group">
              <input
                type="checkbox"
                checked={dailyMode}
                onChange={(e) => setDailyMode(e.target.checked)}
                className="group-hover:border-gold/50 transition-colors"
              />
              <span>今日天命 <span className="text-mist text-xs">每日固定机缘种子</span></span>
            </label>

            {meta.innateBodyUnlocked && (
              <label className="flex items-center gap-3 text-sm text-gold-dim cursor-pointer group">
                <input
                  type="checkbox"
                  checked={useInnateBody}
                  onChange={(e) => setUseInnateBody(e.target.checked)}
                  className="group-hover:border-gold/50 transition-colors"
                />
                <span>先天道体 <span className="text-mist text-xs">根骨悟性略增</span></span>
              </label>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="btn-cinnabar w-full py-3.5 min-h-[44px]
            font-semibold tracking-[0.3em] cursor-pointer"
        >
          踏入仙途
        </button>
      </form>

      {showCodex && <CodexScreen onClose={() => setShowCodex(false)} />}
    </div>
  )
}
