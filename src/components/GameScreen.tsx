import type { GameSession } from '../types/game'
import { AbandonButton } from './AbandonButton'
import { ChoiceList } from './ChoiceList'
import { EventCard } from './EventCard'
import { LogPanel } from './LogPanel'
import { StatusPanel } from './StatusPanel'

interface Props {
  session: GameSession
  onChoose: (choiceId: string) => void
  soundOn: boolean
  onToggleSound: () => void
  bgmOn: boolean
  onToggleBgm: () => void
  onAbandon: () => void
}

export function GameScreen({ session, onChoose, soundOn, onToggleSound, bgmOn, onToggleBgm, onAbandon }: Props) {
  const { player, currentEvent, turn } = session

  if (!currentEvent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[var(--color-mist)]">天道渺渺，机缘未至……</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-3 py-4 sm:px-4 sm:py-6 md:px-8 md:py-8 max-w-6xl mx-auto relative">
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-2 sm:gap-3 z-10">
        <AbandonButton onAbandon={onAbandon} />
        <button
          type="button"
          onClick={onToggleBgm}
          aria-label={bgmOn ? '关闭音乐' : '开启音乐'}
          className="text-sm text-[var(--color-mist)] hover:text-[var(--color-gold)] transition-colors cursor-pointer"
        >
          {bgmOn ? '🎵' : '🔇'}
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

      <StatusPanel player={player} turn={turn} />

      <div className="grid lg:grid-cols-[1fr_280px] gap-4 sm:gap-6 lg:gap-8">
        <main className="border border-[var(--color-jade)]/30 bg-[rgba(12,15,13,0.6)] p-4 sm:p-6 rounded-sm">
          <EventCard key={currentEvent.id} event={currentEvent} />
          <ChoiceList choices={currentEvent.choices} player={player} onChoose={onChoose} />
        </main>

        <div className="border border-[var(--color-jade)]/20 bg-[rgba(12,15,13,0.4)] p-4 sm:p-5 rounded-sm flex flex-col min-h-0 lg:max-h-[calc(100vh-10rem)]">
          <LogPanel logs={player.log} />
        </div>
      </div>
    </div>
  )
}
