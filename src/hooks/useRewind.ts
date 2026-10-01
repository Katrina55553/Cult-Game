import { useCallback, useRef, useState } from 'react'
import type { GameSession } from '../types/game'

const REWIND_KEY = 'cultgame_rewind'

interface PersistedRewindState {
  snapshot: GameSession | null
  used: boolean
}

interface StoredRewindAvailable {
  version: 1
  status: 'available'
  snapshot: GameSession
}

interface StoredRewindUsed {
  version: 1
  status: 'used'
}

export function loadPersistedRewindState(): PersistedRewindState {
  try {
    const raw = localStorage.getItem(REWIND_KEY)
    if (!raw) return { snapshot: null, used: false }
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return { snapshot: null, used: false }

    if (parsed.version === 1 && parsed.status === 'used') {
      return { snapshot: null, used: true }
    }
    if (parsed.version === 1 && parsed.status === 'available') {
      const snapshot = parsed.snapshot
      if (!snapshot?.player || typeof snapshot.player !== 'object') {
        return { snapshot: null, used: false }
      }
      if (typeof snapshot.phase !== 'string') return { snapshot: null, used: false }
      return { snapshot: snapshot as GameSession, used: false }
    }

    // 兼容旧格式：历史版本直接把 GameSession 存在该 key 下。
    if (!parsed.player || typeof parsed.player !== 'object') return { snapshot: null, used: false }
    if (typeof parsed.phase !== 'string') return { snapshot: null, used: false }
    return { snapshot: parsed as GameSession, used: false }
  } catch {
    return { snapshot: null, used: false }
  }
}

export function persistRewindAvailable(snapshot: GameSession): void {
  try {
    const stored: StoredRewindAvailable = { version: 1, status: 'available', snapshot }
    localStorage.setItem(REWIND_KEY, JSON.stringify(stored))
  } catch { /* ignore */ }
}

export function persistRewindUsed(): void {
  try {
    const stored: StoredRewindUsed = { version: 1, status: 'used' }
    localStorage.setItem(REWIND_KEY, JSON.stringify(stored))
  } catch { /* ignore */ }
}

function clearPersistedRewind(): void {
  try {
    localStorage.removeItem(REWIND_KEY)
  } catch { /* ignore */ }
}

export function useRewind() {
  const [rewindState, setRewindState] = useState(loadPersistedRewindState)
  const rewindUsedRef = useRef(rewindState.used)

  const canRewind = !rewindState.used && rewindState.snapshot !== null

  const capture = useCallback((session: GameSession | null) => {
    if (rewindUsedRef.current || !session || session.phase !== 'playing') return
    setRewindState({ snapshot: session, used: false })
    persistRewindAvailable(session)
  }, [])

  const consume = useCallback((): GameSession | null => {
    if (!rewindState.snapshot) return null
    const snap = rewindState.snapshot
    setRewindState({ snapshot: null, used: true })
    rewindUsedRef.current = true
    persistRewindUsed()
    return snap
  }, [rewindState.snapshot])

  const reset = useCallback(() => {
    setRewindState({ snapshot: null, used: false })
    rewindUsedRef.current = false
    clearPersistedRewind()
  }, [])

  return { canRewind, capture, consume, reset }
}
