import { AchievementToast } from './components/AchievementToast'
import { EndingScreen } from './components/EndingScreen'
import { GameScreen } from './components/GameScreen'
import { LoreScreen } from './components/LoreScreen'
import { MilestoneToast } from './components/MilestoneToast'
import { RootRevealScreen } from './components/RootRevealScreen'
import { ShopScreen } from './components/ShopScreen'
import { StartScreen } from './components/StartScreen'
import { useGame } from './hooks/useGame'

export default function App() {
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
  } = useGame()

  if (!session) {
    return (
      <StartScreen
        onStart={startGame}
        soundOn={soundOn}
        onToggleSound={toggleSound}
      />
    )
  }

  return (
    <>
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

      <MilestoneToast
        milestone={session.phase === 'ending' ? null : milestone}
        onDismiss={dismissMilestone}
      />
      <AchievementToast ids={achievementToast} onDismiss={dismissAchievements} />
    </>
  )
}
