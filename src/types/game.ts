export type RealmId =
  | 'mortal'
  | 'qi_refining_1'
  | 'qi_refining_2'
  | 'qi_refining_3'
  | 'foundation'
  | 'golden_core'
  | 'nascent_soul'
  | 'deity'

export type EventAct = 'qi' | 'foundation' | 'golden' | 'any'
export type EventRarity = 'common' | 'rare' | 'legendary'
export type MilestoneType = 'breakthrough' | 'lifespan_low' | 'cultivation_full' | 'rare_event'
export type GamePhase = 'start' | 'lore' | 'root_reveal' | 'playing' | 'shop' | 'ending'
export type OriginId = 'farmer' | 'noble_exile' | 'demon_blood' | 'scholar' | 'merchant' | 'hermit' | 'sect_orphan' | 'tomb_raider' | 'healer' | null
export type CultivationPath = 'balanced' | 'body' | 'law'

export interface SpiritBeastState {
  name: string
  tier: number
}

export interface CultivationSystems {
  path: CultivationPath
  divineSense: number
  alchemyTier: number
  formationTier: number
  swordTier: number
  bloodline: string | null
  bloodlineTier: number
  techniques: string[]
  techniqueTier: number
  divineWeapons: string[]
  divineWeaponTier: number
  spiritBeast: SpiritBeastState | null
}

export interface RealmInfo {
  id: RealmId
  name: string
  order: number
  lifespanBonus: number
  breakthroughThreshold: number
}

export interface SpiritRoot {
  id: string
  name: string
  description: string
  weight: number
  stats: {
    rootBone: [number, number]
    comprehension: [number, number]
    luck: [number, number]
  }
  lifespan: [number, number]
}

export interface PlayerStats {
  rootBone: number
  comprehension: number
  luck: number
  karma: number
  demonHeart: number
}

export interface PlayerState {
  name: string
  spiritRoot: string
  origin: OriginId
  realm: RealmId
  age: number
  lifespan: number
  cultivation: number
  stats: PlayerStats
  spiritStones: number
  artifacts: string[]
  cultivationSystems: CultivationSystems
  flags: Record<string, boolean>
  history: string[]
  log: string[]
  nextEventHint?: string
  shopBuffs: Record<string, number>
}

export type Condition =
  | { type: 'stat'; key: keyof PlayerStats; min?: number; max?: number }
  | { type: 'realm'; min: RealmId }
  | { type: 'flag'; key: string; value: boolean }
  | { type: 'resource'; key: 'spiritStones'; min: number }
  | { type: 'age'; min?: number; max?: number }
  | { type: 'cultivation'; min?: number; max?: number }
  | { type: 'lifespan_remaining'; max: number }
  | { type: 'divineSense'; min: number }
  | { type: 'alchemyTier'; min: number }
  | { type: 'formationTier'; min: number }
  | { type: 'swordTier'; min: number }
  | { type: 'bloodlineTier'; min: number }
  | { type: 'techniqueTier'; min: number }
  | { type: 'divineWeaponTier'; min: number }
  | { type: 'cultivationPath'; path: CultivationPath }
  | { type: 'origin'; value: NonNullable<OriginId> }

export type Effect =
  | { type: 'stat'; key: keyof PlayerStats; value: number }
  | { type: 'cultivation'; value: number }
  | { type: 'lifespan'; value: number }
  | { type: 'spiritStones'; value: number; set?: boolean }
  | { type: 'flag'; key: string; value: boolean }
  | { type: 'artifact'; id: string; name?: string }
  | { type: 'log'; text: string }
  | { type: 'age'; value: number }
  | { type: 'breakthrough' }
  | { type: 'endLife' }
  | { type: 'hint'; text: string }
  | { type: 'divineSense'; value: number }
  | { type: 'alchemyTier'; value: number }
  | { type: 'formationTier'; value: number }
  | { type: 'swordTier'; value: number }
  | { type: 'bloodline'; name: string }
  | { type: 'bloodlineTier'; value: number }
  | { type: 'technique'; name: string }
  | { type: 'techniqueTier'; value: number }
  | { type: 'divineWeapon'; id: string; name: string }
  | { type: 'divineWeaponTier'; value: number }
  | { type: 'spiritBeast'; name: string; tier?: number }
  | { type: 'cultivationPath'; path: CultivationPath }

export interface Outcome {
  chance: number
  luckBonus?: number
  successEffects: Effect[]
  failEffects: Effect[]
  narrative: { success: string; fail: string }
}

export interface Choice {
  id: string
  text: string
  narrative?: string
  hint?: string
  requirements?: Condition[]
  effects?: Effect[]
  outcomes?: Outcome[]
}

export interface GameEvent {
  id: string
  title: string
  description: string
  weight: number
  years?: number
  once?: boolean
  maxTimes?: number
  cooldown?: number
  minGap?: number
  storyGroup?: string
  act?: EventAct
  rarity?: EventRarity
  requiresUnlock?: string
  conditions?: Condition[]
  choices: Choice[]
}

export interface Ending {
  id: string
  title: string
  description: string
  priority: number
  conditions: Condition[]
}

export interface ShopItem {
  id: string
  name: string
  description: string
  cost: number
  effect: Effect[]
}

export interface Achievement {
  id: string
  title: string
  description: string
  hidden?: boolean
}

export interface MetaProgress {
  unlockedEndings: string[]
  unlockedAchievements: string[]
  unlockedEvents: string[]
  totalRuns: number
  bestRealm: RealmId
  bestTurn: number
  flagsEverTriggered: string[]
  romanceBoost: boolean
  innateBodyUnlocked: boolean
}

export interface Milestone {
  type: MilestoneType
  message: string
}

export interface EndingProximity {
  endingId: string
  title: string
  missing: string[]
  score: number
}

export interface GameSession {
  phase: GamePhase
  player: PlayerState
  currentEvent: GameEvent | null
  ending: Ending | null
  endingReason?: string
  turn: number
  revealedRoot: SpiritRoot | null
  lastMilestone: Milestone | null
  dailySeed: number | null
  useInnateBody: boolean
  newEndingUnlock: boolean
  newAchievements: string[]
}

export interface NewGameOptions {
  name: string
  dailyMode?: boolean
  useInnateBody?: boolean
  origin?: OriginId
}
