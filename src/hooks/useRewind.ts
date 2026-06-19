import { useCallback, useRef, useState } from 'react'
import type { GameSession } from '../types/game'

const REWIND_KEY = 'cultgame_rewind'

function loadRewindSnapshot(): GameSession | null {
  try {
    const raw = localStorage.getItem(REWIND_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null
    if (!parsed.player || typeof parsed.player !== 'object') return null
    if (typeof parsed.phase !== 'string') return null
    return parsed as GameSession
  } catch {
    return null
  }
}

function saveRewindSnapshot(s: GameSession | null) {
  try {
    if (s) localStorage.setItem(REWIND_KEY, JSON.stringify(s))
    else localStorage.removeItem(REWIND_KEY)
  } catch { /* ignore */ }
}

export function useRewind() {
  const [prevSession, setPrevSession] = useState<GameSession | null>(() => loadRewindSnapshot())
  const [rewindUsed, setRewindUsed] = useState(() => loadRewindSnapshot() !== null)
  const rewindUsedRef = useRef(rewindUsed)

  const canRewind = !rewindUsed && prevSession !== null

  const capture = useCallback((session: GameSession | null) => {
    if (rewindUsedRef.current || !session || session.phase !== 'playing') return
    setPrevSession(session)
    saveRewindSnapshot(session)
  }, [])

  const consume = useCallback((): GameSession | null => {
    if (!prevSession) return null
    const snap = prevSession
    setPrevSession(null)
    setRewindUsed(true)
    rewindUsedRef.current = true
    saveRewindSnapshot(null)
    return snap
  }, [prevSession])

  const reset = useCallback(() => {
    setPrevSession(null)
    setRewindUsed(false)
    rewindUsedRef.current = false
    saveRewindSnapshot(null)
  }, [])

  return { canRewind, capture, consume, reset }
}
