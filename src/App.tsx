import { AchievementToast } from './components/AchievementToast'
import { EndingScreen } from './components/EndingScreen'
import { GameScreen } from './components/GameScreen'
import { MilestoneToast } from './components/MilestoneToast'
import { RootRevealScreen } from './components/RootRevealScreen'
import { ShopScreen } from './components/ShopScreen'
import { StartScreen } from './components/StartScreen'
import { useGame, type StartGameParams } from './hooks/useGame'

export default function App() {
  const {
    session,
    soundOn,
    milestone,
    achievementToast,
    startGame,
    loadSlot,
    deleteSlot,
    confirmRoot,
    choose,
    buyItem,
    exitShop,
    restart,
    toggleSound,
    dismissMilestone,
    dismissAchievements,
  } = useGame()

  const handleStart = (params: StartGameParams) => {
    startGame({
      name: params.name,
      dailyMode: params.dailyMode,
      useInnateBody: params.useInnateBody,
      origin: params.origin,
      slot: params.slot,
    })
  }

  if (!session) {
    return (
      <StartScreen
        onStart={handleStart}
        onLoadSlot={loadSlot}
        onDeleteSlot={deleteSlot}
        soundOn={soundOn}
        onToggleSound={toggleSound}
      />
    )
  }

  return (
    <>
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
        />
      )}

      {session.phase === 'shop' && (
        <ShopScreen session={session} onBuy={buyItem} onLeave={exitShop} onAbandon={restart} />
      )}

      {session.phase === 'ending' && (
        <EndingScreen session={session} onRestart={restart} />
      )}

      <MilestoneToast
        milestone={session.phase === 'ending' ? null : milestone}
        onDismiss={dismissMilestone}
      />
      <AchievementToast ids={achievementToast} onDismiss={dismissAchievements} />
    </>
  )
}
