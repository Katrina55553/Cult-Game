import { useCallback, useEffect, useRef, useState } from 'react'
import { playSound, setMuted } from '../audio/sounds'
import {
  beginPlaying,
  clearSave,
  createNewGame,
  leaveShop,
  loadGame,
  purchaseShopItem,
  resolveChoice,
  saveGame,
} from '../engine/gameEngine'
import type { GameSession, Milestone, NewGameOptions, OriginId } from '../types/game'

export function useGame() {
  const [session, setSession] = useState<GameSession | null>(() => loadGame())
  const [currentSlot, setCurrentSlot] = useState<number>(0)
  const [soundOn, setSoundOn] = useState(true)
  const [milestone, setMilestone] = useState<Milestone | null>(null)
  const [achievementToast, setAchievementToast] = useState<string[]>([])
  const soundOnRef = useRef(soundOn)

  useEffect(() => {
    soundOnRef.current = soundOn
  }, [soundOn])

  useEffect(() => {
    if (session && (session.phase === 'playing' || session.phase === 'shop' || session.phase === 'ending')) {
      saveGame(session, currentSlot)
    }
  }, [session, currentSlot])

  useEffect(() => {
    setMuted(!soundOn)
  }, [soundOn])

  const showAchievements = useCallback((ids: string[]) => {
    if (ids.length > 0) setAchievementToast(ids)
  }, [])

  const startGame = useCallback(
    (options: NewGameOptions & { slot?: number }) => {
      const slot = options.slot ?? 0
      if (soundOnRef.current) playSound('start')
      setCurrentSlot(slot)
      setSession(createNewGame(options))
      setMilestone(null)
      setAchievementToast([])
    },
    [],
  )

  const loadSlot = useCallback((slot: number) => {
    const s = loadGame(slot)
    if (s) {
      setCurrentSlot(slot)
      setSession(s)
      setMilestone(null)
      setAchievementToast([])
    }
  }, [])

  const deleteSlot = useCallback((slot: number) => {
    clearSave(slot)
    if (soundOnRef.current) playSound('click')
  }, [])

  const confirmRoot = useCallback(() => {
    setSession((prev) => {
      if (!prev) return prev
      if (soundOnRef.current) playSound('rootReveal')
      const next = beginPlaying(prev)
      if (next.lastMilestone) {
        setMilestone(next.lastMilestone)
        if (soundOnRef.current) playSound('success')
      } else if (soundOnRef.current) {
        playSound('event')
      }
      return next
    })
  }, [])

  const choose = useCallback(
    (choiceId: string) => {
      setSession((prev) => {
        if (!prev || prev.phase !== 'playing') return prev

        if (soundOnRef.current) playSound('choice')

        const prevAch = prev.newAchievements.length
        const next = resolveChoice(prev, choiceId)

        if (next.phase === 'ending') {
          setMilestone(null)
        } else if (next.lastMilestone) {
          setMilestone(next.lastMilestone)
          if (soundOnRef.current) {
            if (next.lastMilestone.type === 'breakthrough') playSound('breakthrough')
            else if (next.lastMilestone.type === 'rare_event') playSound('success')
            else if (next.lastMilestone.type === 'lifespan_low') playSound('fail')
          }
        }

        const newLog = next.player.log.slice(prev.player.log.length)
        if (soundOnRef.current && !next.lastMilestone) {
          const lastLog = newLog[newLog.length - 1] ?? ''
          if (lastLog.includes('突破') || lastLog.includes('晋升')) playSound('breakthrough')
          else if (lastLog.includes('失败') || lastLog.includes('重伤') || lastLog.includes('身死')) {
            playSound('fail')
          } else if (lastLog.includes('成功') || lastLog.includes('获')) {
            playSound('success')
          }
        }

        if (next.phase === 'ending') {
          if (soundOnRef.current) {
            playSound('ending')
            if (next.newEndingUnlock) playSound('success')
          }
        } else if (next.phase === 'playing' && soundOnRef.current) {
          playSound('event')
        } else if (next.phase === 'shop' && soundOnRef.current) {
          playSound('click')
        }

        const freshAch = next.newAchievements.slice(prevAch)
        if (freshAch.length > 0) {
          showAchievements(freshAch)
          if (soundOnRef.current) playSound('success')
        }

        return next
      })
    },
    [showAchievements],
  )

  const buyItem = useCallback(
    (itemId: string) => {
      setSession((prev) => {
        if (!prev || prev.phase !== 'shop') return prev
        if (soundOnRef.current) playSound('click')
        const achBefore = prev.newAchievements.length
        const next = purchaseShopItem(prev, itemId)
        if (next.player.spiritStones < prev.player.spiritStones && soundOnRef.current) {
          playSound('success')
        }
        const fresh = next.newAchievements.slice(achBefore)
        if (fresh.length > 0) showAchievements(fresh)
        return next
      })
    },
    [showAchievements],
  )

  const exitShop = useCallback(() => {
    setSession((prev) => {
      if (!prev) return prev
      const next = leaveShop(prev)
      if (next.lastMilestone) {
        setMilestone(next.lastMilestone)
        if (soundOnRef.current) playSound('success')
      } else if (soundOnRef.current) {
        playSound('event')
      }
      return next
    })
  }, [])

  const dismissMilestone = useCallback(() => setMilestone(null), [])
  const dismissAchievements = useCallback(() => setAchievementToast([]), [])

  const restart = useCallback(() => {
    clearSave(currentSlot)
    setSession(null)
    setMilestone(null)
    setAchievementToast([])
    if (soundOnRef.current) playSound('click')
  }, [currentSlot])

  const toggleSound = useCallback(() => {
    if (soundOnRef.current) playSound('click')
    setSoundOn((prev) => !prev)
  }, [])

  return {
    session,
    soundOn,
    milestone,
    achievementToast,
    currentSlot,
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
  }
}

export type StartGameParams = {
  name: string
  dailyMode: boolean
  useInnateBody: boolean
  origin: OriginId
  slot?: number
}
