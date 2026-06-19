import { useCallback, useEffect, useRef, useState } from 'react'
import { playSound, setMuted } from '../audio/sounds'

export function useSound() {
  const [soundOn, setSoundOn] = useState(true)
  const soundOnRef = useRef(soundOn)

  useEffect(() => { soundOnRef.current = soundOn }, [soundOn])

  useEffect(() => {
    setMuted(!soundOn)
  }, [soundOn])

  const play = useCallback((name: Parameters<typeof playSound>[0]) => {
    if (soundOnRef.current) playSound(name)
  }, [])

  const toggle = useCallback(() => {
    if (soundOnRef.current) playSound('click')
    setSoundOn((prev) => !prev)
  }, [])

  return { soundOn, soundOnRef, play, toggle }
}
