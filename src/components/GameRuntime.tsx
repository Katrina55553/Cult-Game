import { lazy, Suspense, useEffect, useRef } from 'react'
import { AchievementToast } from './AchievementToast'
import { GameScreen } from './GameScreen'
import { MilestoneToast } from './MilestoneToast'
import { StartScreen } from './StartScreen'
import { useGame } from '../hooks/useGame'
import type { NewGameOptions } from '../types/game'

const EndingScreen = lazy(() =>
  import('./EndingScreen').then((module) => ({ default: module.EndingScreen })),
)
const LoreScreen = lazy(() =>
  import('./LoreScreen').then((module) => ({ default: module.LoreScreen })),
)
const RootRevealScreen = lazy(() =>
  import('./RootRevealScreen').then((module) => ({ default: module.RootRevealScreen })),
)
const ShopScreen = lazy(() =>
  import('./ShopScreen').then((module) => ({ default: module.ShopScreen })),
)

interface Props {
  initialOptions: NewGameOptions | null
  initialSoundOn: boolean
}

export function GameRuntime({ initialOptions, initialSoundOn }: Props) {
  const {
    session,
    soundOn,
    milestone,
    achievementToast,
    canRewind,
    startGame,
    confirmLore,
    confirmRoot,
    choose,
    buyItem,
    exitShop,
    useItem,
    rewind,
    restart,
    toggleSound,
    dismissMilestone,
    dismissAchievements,
  } = useGame(initialSoundOn)
  const startedInitialRun = useRef(false)

  useEffect(() => {
    if (!initialOptions || startedInitialRun.current) return
    startedInitialRun.current = true
    startGame(initialOptions)
  }, [initialOptions, startGame])

  if (!session) {
    if (initialOptions && !startedInitialRun.current) {
      return (
        <div className="min-h-screen flex items-center justify-center text-mist" role="status">
          正在载入修仙世界……
        </div>
      )
    }

    return <StartScreen onStart={startGame} soundOn={soundOn} onToggleSound={toggleSound} />
  }

  return (
    <>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center text-mist" role="status">
          正在载入场景……
        </div>
      }>
        {session.phase === 'lore' && (
          <LoreScreen onContinue={confirmLore} onAbandon={restart} />
        )}

        {session.phase === 'root_reveal' && (
          <RootRevealScreen session={session} onConfirm={confirmRoot} onAbandon={restart} />
        )}

        {session.phase === 'playing' && (
          <GameScreen
            session={session}
            onChoose={choose}
            soundOn={soundOn}
            onToggleSound={toggleSound}
            onAbandon={restart}
            onUseItem={useItem}
            canRewind={canRewind}
            onRewind={rewind}
          />
        )}

        {session.phase === 'shop' && (
          <ShopScreen session={session} onBuy={buyItem} onLeave={exitShop} onAbandon={restart} />
        )}

        {session.phase === 'ending' && (
          <EndingScreen session={session} onRestart={restart} />
        )}
      </Suspense>

      <MilestoneToast
        milestone={session.phase === 'ending' ? null : milestone}
        onDismiss={dismissMilestone}
      />
      <AchievementToast ids={achievementToast} onDismiss={dismissAchievements} />
    </>
  )
}
