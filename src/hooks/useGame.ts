import { useCallback, useEffect, useRef, useState } from 'react'
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
import { applyEffects } from '../engine/effects'
import { getDefaultUsableEffect, USABLE_ITEM_EFFECTS } from '../data/items'
import type { GameSession, Milestone, NewGameOptions } from '../types/game'
import { useRewind } from './useRewind'
import { useSound } from './useSound'

type SoundId =
  | 'click'
  | 'choice'
  | 'success'
  | 'fail'
  | 'event'
  | 'ending'
  | 'start'
  | 'breakthrough'
  | 'rootReveal'
  | 'gain'
  | 'loss'
  | 'demon'
  | 'sword'
  | 'alchemy'
  | 'coin'
  | 'heal'

export function useGame() {
  const [session, setSession] = useState<GameSession | null>(() => loadGame())
  const [milestone, setMilestone] = useState<Milestone | null>(null)
  const [achievementToast, setAchievementToast] = useState<string[]>([])

  const { soundOn, play, toggle: toggleSound } = useSound()
  const { canRewind, capture, consume, reset: resetRewind } = useRewind()

  const sessionRef = useRef(session)
  useEffect(() => { sessionRef.current = session }, [session])

  useEffect(() => {
    if (session && session.phase !== 'start') {
      saveGame(session)
    }
  }, [session])

  // 音效从 session 变化中派生，避免在 setSession updater 中调用副作用
  const prevSessionForSoundRef = useRef(session)
  const hasHandledInitialSessionRef = useRef(false)

  useEffect(() => {
    if (!hasHandledInitialSessionRef.current) {
      prevSessionForSoundRef.current = session
      hasHandledInitialSessionRef.current = true
      return
    }

    const prev = prevSessionForSoundRef.current
    const next = session
    prevSessionForSoundRef.current = next

    if (!next || !prev) return

    const sound = deriveFeedbackSound(prev, next)
    if (sound) play(sound)
  }, [session, play])

  const showAchievements = useCallback((ids: string[]) => {
    if (ids.length > 0) setAchievementToast(ids)
  }, [])

  const startGame = useCallback(
    (options: NewGameOptions) => {
      play('start')
      setSession(createNewGame(options))
      setMilestone(null)
      setAchievementToast([])
      resetRewind()
    },
    [play, resetRewind],
  )

  const confirmLore = useCallback(() => {
    setSession((prev) => (prev ? { ...prev, phase: 'root_reveal' } : prev))
  }, [])

  const confirmRoot = useCallback(() => {
    setSession((prev) => {
      if (!prev) return prev
      const next = beginPlaying(prev)
      if (next.lastMilestone) setMilestone(next.lastMilestone)
      return next
    })
  }, [])

  const choose = useCallback(
    (choiceId: string) => {
      capture(sessionRef.current)

      setSession((prev) => {
        if (!prev || prev.phase !== 'playing') return prev

        const prevAch = prev.newAchievements.length
        const next = resolveChoice(prev, choiceId)

        if (next.phase === 'ending') {
          setMilestone(null)
        } else if (next.lastMilestone) {
          setMilestone(next.lastMilestone)
        }

        const freshAch = next.newAchievements.slice(prevAch)
        if (freshAch.length > 0) {
          showAchievements(freshAch)
        }

        return next
      })
    },
    [capture, showAchievements],
  )

  const buyItem = useCallback(
    (itemId: string) => {
      setSession((prev) => {
        if (!prev || prev.phase !== 'shop') return prev
        const achBefore = prev.newAchievements.length
        const next = purchaseShopItem(prev, itemId)
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
      if (next.lastMilestone) setMilestone(next.lastMilestone)
      return next
    })
  }, [])

  const rewind = useCallback(() => {
    const snap = consume()
    if (!snap) return
    setSession(snap)
    setMilestone(null)
    play('click')
  }, [consume, play])

  const useItem = useCallback((index: number) => {
    setSession((prev) => {
      if (!prev) return prev
      const item = prev.player.inventory[index]
      if (!item?.usable) return prev
      const newInventory = prev.player.inventory.filter((_, i) => i !== index)
      const effects = USABLE_ITEM_EFFECTS[item.name] ?? getDefaultUsableEffect()
      const player = applyEffects({ ...prev.player, inventory: newInventory }, effects)
      return { ...prev, player }
    })
  }, [])

  const restart = useCallback(() => {
    clearSave()
    resetRewind()
    setSession(null)
    setMilestone(null)
    setAchievementToast([])
    play('click')
  }, [play, resetRewind])

  const dismissMilestone = useCallback(() => setMilestone(null), [])
  const dismissAchievements = useCallback(() => setAchievementToast([]), [])

  return {
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
  }
}

function deriveFeedbackSound(prev: GameSession, next: GameSession): SoundId | null {
  if (next.phase === 'ending') {
    if (next.newEndingUnlock) return 'success'
    return 'ending'
  }

  if (next.lastMilestone && next.lastMilestone !== prev.lastMilestone) {
    switch (next.lastMilestone.type) {
      case 'breakthrough':
        return 'breakthrough'
      case 'rare_event':
        return 'success'
      case 'lifespan_low':
        return 'fail'
      default:
        return 'success'
    }
  }

  const newAch = next.newAchievements.slice(prev.newAchievements.length)
  if (newAch.length > 0) return 'success'

  if (next.phase !== prev.phase) {
    if (next.phase === 'shop') return 'click'
    if (next.phase === 'playing') return 'event'
    if (next.phase === 'root_reveal') return 'rootReveal'
    return 'event'
  }

  const newLog = next.player.log.slice(prev.player.log.length)
  const lastLog = newLog[newLog.length - 1] ?? ''
  const logSound = soundFromLog(lastLog)
  if (logSound) return logSound

  if (next.player.spiritStones > prev.player.spiritStones) return 'gain'
  if (next.player.spiritStones < prev.player.spiritStones) return 'loss'

  if (next.phase === 'playing' && prev.phase === 'playing') return 'choice'

  return null
}

function soundFromLog(log: string): SoundId | null {
  if (log.includes('突破') || log.includes('晋升')) return 'breakthrough'
  if (log.includes('失败') || log.includes('重伤') || log.includes('身死')) return 'fail'
  if (log.includes('成功') || log.includes('获') || log.includes('得')) return 'success'
  if (log.includes('心魔') || log.includes('魔')) return 'demon'
  if (log.includes('剑') || log.includes('刀') || log.includes('斩')) return 'sword'
  if (log.includes('丹') || log.includes('炼')) return 'alchemy'
  if (log.includes('灵石')) return 'coin'
  if (log.includes('寿元') || log.includes('延寿')) return 'heal'
  return null
}
