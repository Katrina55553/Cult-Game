import { lazy, Suspense, useState } from 'react'
import { StartScreen } from './components/StartScreen'
import { SAVE_KEY } from './engine/storageKeys'
import { useSound } from './hooks/useSound'
import type { NewGameOptions } from './types/game'

const GameRuntime = lazy(() =>
  import('./components/GameRuntime').then((module) => ({ default: module.GameRuntime })),
)

function hasSavedGame(): boolean {
  try {
    return localStorage.getItem(SAVE_KEY) !== null
  } catch {
    return false
  }
}

export default function App() {
  const [shouldLoadRuntime, setShouldLoadRuntime] = useState(hasSavedGame)
  const [initialOptions, setInitialOptions] = useState<NewGameOptions | null>(null)
  const { soundOn, toggle: toggleSound } = useSound()

  if (!shouldLoadRuntime) {
    return (
      <StartScreen
        onStart={(options) => {
          setInitialOptions(options)
          setShouldLoadRuntime(true)
        }}
        soundOn={soundOn}
        onToggleSound={toggleSound}
      />
    )
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center text-mist" role="status">
        正在载入修仙世界……
      </div>
    }>
      <GameRuntime
        initialOptions={initialOptions}
        initialSoundOn={soundOn}
        onInitialRunStarted={() => setInitialOptions(null)}
      />
    </Suspense>
  )
}
