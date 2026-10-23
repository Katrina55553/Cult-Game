import assert from 'node:assert/strict'
import { act, createElement, StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { EVENTS } from '../src/data/events.ts'
import { beginPlaying, createNewGame, saveGame } from '../src/engine/gameEngine.ts'
import { loadMeta } from '../src/engine/metaProgress.ts'
import { getSeed, setSeed } from '../src/engine/rng.ts'
import { useGame } from '../src/hooks/useGame.ts'

const store = new Map<string, string>()
Object.defineProperty(globalThis, 'localStorage', { value: {
  getItem: (key: string) => store.get(key) ?? null,
  setItem: (key: string, value: string) => store.set(key, String(value)),
  removeItem: (key: string) => store.delete(key),
}, configurable: true })

const documentStub = {
  nodeType: 9,
  activeElement: null,
  addEventListener() {},
  removeEventListener() {},
}
const container = {
  nodeType: 1,
  tagName: 'DIV',
  namespaceURI: 'http://www.w3.org/1999/xhtml',
  ownerDocument: documentStub,
  addEventListener() {},
  removeEventListener() {},
  textContent: '',
}
Object.assign(globalThis, {
  IS_REACT_ACT_ENVIRONMENT: true,
  window: { document: documentStub, HTMLIFrameElement: class {} },
  document: documentStub,
})

let game: ReturnType<typeof useGame> | null = null
function Probe() {
  const current = useGame(false)
  useEffect(() => { game = current }, [current])
  return null
}

function currentGame() {
  assert.ok(game)
  return game
}

console.log('=== React StrictMode 与回溯集成回归 ===')
const session = beginPlaying(createNewGame({ name: 'React回归', origin: 'scholar', seed: 142 }))
session.currentEvent = EVENTS.find((event) => event.id === 'final_choice')!
saveGame(session)

const root = createRoot(container as unknown as HTMLElement)
try {
  await act(async () => root.render(createElement(StrictMode, null, createElement(Probe))))
  await act(async () => currentGame().choose('retire'))
  assert.equal(loadMeta().totalRuns, 1)
  assert.equal(currentGame().session?.phase, 'ending')
  assert.equal(currentGame().session?.newEndingUnlock, true)
  assert.ok(currentGame().session?.newAchievements.includes('first_run'))
  assert.ok(currentGame().achievementToast.includes('first_run'))
  await act(async () => currentGame().choose('retire'))
  assert.equal(loadMeta().totalRuns, 1)
  console.log('  ✓ StrictMode 一次选择只结算一次，保留首通标记及成就')

  await act(async () => currentGame().restart())
  await act(async () => currentGame().startGame({ name: '回溯回归', origin: 'scholar', seed: 142 }))
  await act(async () => currentGame().confirmLore())
  await act(async () => currentGame().confirmRoot())
  const before = currentGame().session!
  await act(async () => currentGame().choose('honest'))
  const after = currentGame().session!
  assert.equal(currentGame().canRewind, true)
  setSeed(999)
  await act(async () => currentGame().rewind())
  assert.equal(getSeed(), before.rngState)
  assert.equal(currentGame().canRewind, false)
  await act(async () => currentGame().choose('honest'))
  assert.deepEqual(currentGame().session?.player.stats, after.player.stats)
  assert.equal(currentGame().session?.currentEvent?.id, after.currentEvent?.id)
  console.log('  ✓ 回溯同步恢复随机状态且每局只能使用一次')
} finally {
  await act(async () => root.unmount())
}

store.clear()
const legacy = JSON.parse(JSON.stringify(session))
delete legacy.rngState
delete legacy.player.cultivationSystems
delete legacy.player.chapterCompleted
legacy.currentEvent = { ...EVENTS.find((event) => event.id === 'enter_sect'), choices: [] }
store.set('cultgame_save', JSON.stringify(legacy))
store.set('cultgame_rewind', JSON.stringify(legacy))
const legacyRoot = createRoot(container as unknown as HTMLElement)
try {
  await act(async () => legacyRoot.render(createElement(StrictMode, null, createElement(Probe))))
  await act(async () => currentGame().rewind())
  assert.ok(currentGame().session?.player.cultivationSystems)
  assert.deepEqual(currentGame().session?.player.chapterCompleted, [])
  assert.equal(currentGame().session?.currentEvent, EVENTS.find((event) => event.id === 'enter_sect'))
  await act(async () => currentGame().choose('honest'))
  assert.ok(currentGame().session?.player.history.includes('enter_sect'))
  console.log('  ✓ 旧快照回溯补全字段并更新旧事件，后续选择正常')
} finally {
  await act(async () => legacyRoot.unmount())
}
console.log('✓ React StrictMode 与回溯集成回归全部通过')
