import type { GameSession } from '../types/game'
import { AbandonButton } from './AbandonButton'

interface Props {
  session: GameSession
  onConfirm: () => void
  onAbandon: () => void
}

export function RootRevealScreen({ session, onConfirm, onAbandon }: Props) {
  const root = session.revealedRoot!
  const { player } = session

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 animate-fade-up relative">
      <div className="absolute top-4 right-4">
        <AbandonButton onAbandon={onAbandon} />
      </div>
      <p className="text-[var(--color-gold-dim)] text-sm tracking-[0.3em] mb-2">测灵根</p>
      <h2
        className="text-4xl text-[var(--color-gold)] mb-8"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {player.name} 的资质
      </h2>

      <div className="w-full max-w-md border border-[var(--color-jade)] bg-[rgba(45,90,74,0.15)] p-8 rounded-sm text-center">
        <p className="text-3xl text-[var(--color-cinnabar-glow)] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
          {root.name}
        </p>
        <p className="text-[var(--color-parchment-dim)] mb-8 leading-relaxed">{root.description}</p>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <Stat label="根骨" value={player.stats.rootBone} />
          <Stat label="悟性" value={player.stats.comprehension} />
          <Stat label="气运" value={player.stats.luck} />
          <Stat label="寿元" value={player.lifespan} suffix="年" />
        </div>
      </div>

      <button
        type="button"
        onClick={onConfirm}
        className="mt-10 px-10 py-3 bg-[var(--color-jade)] hover:bg-[var(--color-jade-light)]
          text-[var(--color-parchment)] tracking-[0.2em] rounded-sm transition-all cursor-pointer
          border border-[var(--color-jade-light)]/50"
      >
        开始修行
      </button>
    </div>
  )
}

function Stat({ label, value, suffix = '' }: { label: string; value: number; suffix?: string }) {
  return (
    <div className="bg-[rgba(0,0,0,0.2)] py-3 px-4 rounded-sm">
      <p className="text-[var(--color-mist)] text-xs mb-1">{label}</p>
      <p className="text-[var(--color-parchment)] text-lg font-semibold">
        {value}{suffix}
      </p>
    </div>
  )
}
