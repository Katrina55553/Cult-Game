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

/**
 * 事件倾向标签。玩家在对应维度上的「倾向度」是连续值（0~1），
 * 标签决定该事件吃哪些维度的加成——取代原先手写的 *_EVENT_IDS 集合。
 */
export type EventTag = 'good' | 'dark' | 'combat' | 'alchemy' | 'formation' | 'sword' | 'beast'

/**
 * 结局性质：
 * - `terminal`  玩家显式选择终局（飞升 / 双修飞升 / 放弃修行 / 轮回 / 称霸魔道）
 *   或死亡（天劫身死 / 堕魔 / 寿尽坐化）→ 随时结算。这是玩家的主动决定或既成事实，
 *   推迟它反而会吞掉玩家刚做出的选择。
 * - `milestone` 默认：成就、关系、传承、专精类 → **只在路线走完、或无事件可抽时结算**
 *
 * 「结束」应当是被动结算的结果，而不是主动打断的动作。旧实现是所有结局每回合按
 * priority 取首个命中者，于是「阵法 ≥2 阶 + 筑基」这种浅条件会在约第五章掐断整局，
 * 元婴/化神与全部飞升线都看不到。
 *
 * 彻底的做法是把成就类一律推迟，其前提是每条路线都能走完。此前
 * `wander_6`（主线要求 loyal_to_sect，与散修路线互斥）、`sect_6`（主线要求
 * `met_su_qing=false`）、`sect_9` 与 `demon_4`（主线要求剩余寿命 ≤15）都存在结构性
 * 不可完成的主线，一旦推迟整局就只能靠死亡结束。这些主线已在 `chapters.ts` 修正
 * （互斥事件降为支线），故本方案现在成立。
 */
export type EndingKind = 'terminal' | 'milestone'
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
  inventory: { name: string; description: string; usable: boolean; tier?: number }[]
  bagCapacity: number
  bagTier: number
  cultivationSystems: CultivationSystems
  flags: Record<string, boolean>
  history: string[]
  log: string[]
  nextEventHint?: string
  shopBuffs: Record<string, number>
  spiritBeastsSeen: string[]
  currentChapter: string
  chapterCompleted: string[]
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
  | { type: 'inventory'; name: string; description: string; usable?: boolean }

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
  /** 倾向标签；不写则回退到 data/eventTags.ts 的历史表 */
  tags?: EventTag[]
  /** 按标签覆写权重系数（默认取 affinity.ts 的 TAG_BIAS） */
  bias?: Partial<Record<EventTag, number>>
  conditions?: Condition[]
  choices: Choice[]
}

export interface Ending {
  id: string
  title: string
  description: string
  priority: number
  /** 不写按 milestone 处理（只在路线走完 / 无事件可抽时结算） */
  kind?: EndingKind
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
  reward?: {
    type: 'stat' | 'spiritStones' | 'lifespan' | 'cultivation'
    key?: keyof PlayerStats
    value: number
    label: string
  }
}

export interface MetaProgress {
  version?: number
  unlockedEndings: string[]
  unlockedAchievements: string[]
  unlockedEvents: string[]
  totalRuns: number
  bestRealm: RealmId
  bestTurn: number
  flagsEverTriggered: string[]
  romanceBoost: boolean
  innateBodyUnlocked: boolean
  unlockedOrigins: string[]
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
  version?: number
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
