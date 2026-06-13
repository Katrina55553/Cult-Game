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
    bgmOn,
    milestone,
    achievementToast,
    startGame,
    confirmLore,
    confirmRoot,
    choose,
    buyItem,
    exitShop,
    useItem,
    restart,
    toggleSound,
    toggleBgm,
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
          bgmOn={bgmOn}
          onToggleBgm={toggleBgm}
          onAbandon={restart}
          onUseItem={useItem}
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
