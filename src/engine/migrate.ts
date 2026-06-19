import { migrateCultivationSystems } from '../data/cultivationSystems'
import type { GameSession, MetaProgress, PlayerState } from '../types/game'

export const SAVE_VERSION = 1
export const META_VERSION = 1

const DEFAULT_PLAYER_FIELDS: Partial<PlayerState> = {
  name: '无名修士',
  origin: null,
  realm: 'mortal',
  age: 16,
  lifespan: 60,
  cultivation: 0,
  spiritStones: 10,
  artifacts: [],
  inventory: [],
  bagCapacity: 5,
  bagTier: 0,
  flags: {},
  history: [],
  log: [],
  shopBuffs: { purchases: 0 },
  spiritBeastsSeen: [],
  currentChapter: 'sect_1',
  chapterCompleted: [],
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

export function migrateSave(data: unknown): GameSession | null {
  if (!data || typeof data !== 'object') return null
  const s = data as Partial<GameSession>
  if (!s.player || typeof s.player !== 'object') return null
  if (!s.phase || typeof s.phase !== 'string') return null

  const rawPlayer = s.player as Partial<PlayerState>

  // 旧存档可能没有 cultivationSystems，需从 flags/origin 推断
  const defaultSystems = migrateCultivationSystems(rawPlayer as PlayerState)

  const player: PlayerState = {
    ...DEFAULT_PLAYER_FIELDS,
    name: rawPlayer.name ?? DEFAULT_PLAYER_FIELDS.name ?? '无名修士',
    spiritRoot: rawPlayer.spiritRoot ?? '五灵根',
    origin: rawPlayer.origin ?? null,
    realm: rawPlayer.realm ?? 'mortal',
    age: Math.max(0, rawPlayer.age ?? 16),
    lifespan: Math.max(1, rawPlayer.lifespan ?? 60),
    cultivation: clamp(rawPlayer.cultivation ?? 0, 0, 100),
    stats: {
      rootBone: clamp(rawPlayer.stats?.rootBone ?? 10, 0, 999),
      comprehension: clamp(rawPlayer.stats?.comprehension ?? 10, 0, 999),
      luck: clamp(rawPlayer.stats?.luck ?? 10, 0, 999),
      karma: clamp(rawPlayer.stats?.karma ?? 0, -100, 100),
      demonHeart: clamp(rawPlayer.stats?.demonHeart ?? 0, 0, 100),
    },
    spiritStones: Math.max(0, rawPlayer.spiritStones ?? 10),
    artifacts: [...(rawPlayer.artifacts ?? [])],
    inventory: [...(rawPlayer.inventory ?? [])],
    bagCapacity: rawPlayer.bagCapacity ?? 5,
    bagTier: rawPlayer.bagTier ?? 0,
    cultivationSystems: {
      ...defaultSystems,
      ...rawPlayer.cultivationSystems,
      divineSense: clamp(rawPlayer.cultivationSystems?.divineSense ?? defaultSystems.divineSense, 0, 100),
      alchemyTier: clamp(rawPlayer.cultivationSystems?.alchemyTier ?? defaultSystems.alchemyTier, 0, 3),
      formationTier: clamp(rawPlayer.cultivationSystems?.formationTier ?? defaultSystems.formationTier, 0, 3),
      swordTier: clamp(rawPlayer.cultivationSystems?.swordTier ?? defaultSystems.swordTier, 0, 3),
      bloodline: rawPlayer.cultivationSystems?.bloodline ?? defaultSystems.bloodline,
      bloodlineTier: clamp(rawPlayer.cultivationSystems?.bloodlineTier ?? defaultSystems.bloodlineTier, 0, 3),
      techniques: [...(rawPlayer.cultivationSystems?.techniques ?? defaultSystems.techniques)],
      techniqueTier: clamp(rawPlayer.cultivationSystems?.techniqueTier ?? defaultSystems.techniqueTier, 0, 3),
      divineWeapons: [...(rawPlayer.cultivationSystems?.divineWeapons ?? defaultSystems.divineWeapons)],
      divineWeaponTier: clamp(rawPlayer.cultivationSystems?.divineWeaponTier ?? defaultSystems.divineWeaponTier, 0, 3),
      spiritBeast: rawPlayer.cultivationSystems?.spiritBeast
        ? { ...rawPlayer.cultivationSystems.spiritBeast }
        : defaultSystems.spiritBeast,
      path: rawPlayer.cultivationSystems?.path ?? defaultSystems.path,
    },
    flags: { ...(rawPlayer.flags ?? {}) },
    history: [...(rawPlayer.history ?? [])],
    log: [...(rawPlayer.log ?? [])],
    shopBuffs: { purchases: 0, ...(rawPlayer.shopBuffs ?? {}) },
    spiritBeastsSeen: [...(rawPlayer.spiritBeastsSeen ?? [])],
    currentChapter: rawPlayer.currentChapter ?? 'sect_1',
    chapterCompleted: [...(rawPlayer.chapterCompleted ?? [])],
  }

  return {
    phase: s.phase as GameSession['phase'],
    player,
    currentEvent: s.currentEvent ?? null,
    ending: s.ending ?? null,
    endingReason: s.endingReason,
    turn: s.turn ?? 0,
    revealedRoot: s.revealedRoot ?? null,
    lastMilestone: s.lastMilestone ?? null,
    dailySeed: s.dailySeed ?? null,
    useInnateBody: s.useInnateBody ?? false,
    newEndingUnlock: s.newEndingUnlock ?? false,
    newAchievements: [...(s.newAchievements ?? [])],
    version: SAVE_VERSION,
  } as GameSession
}

const DEFAULT_META: MetaProgress = {
  unlockedEndings: [],
  unlockedAchievements: [],
  unlockedEvents: [],
  totalRuns: 0,
  bestRealm: 'mortal',
  bestTurn: 0,
  flagsEverTriggered: [],
  romanceBoost: false,
  innateBodyUnlocked: false,
  unlockedOrigins: [],
}

export function migrateMeta(data: unknown): MetaProgress {
  if (!data || typeof data !== 'object') return { ...DEFAULT_META, version: META_VERSION }
  const m = data as Partial<MetaProgress>
  return {
    ...DEFAULT_META,
    ...m,
    unlockedEndings: [...(m.unlockedEndings ?? DEFAULT_META.unlockedEndings)],
    unlockedAchievements: [...(m.unlockedAchievements ?? DEFAULT_META.unlockedAchievements)],
    unlockedEvents: [...(m.unlockedEvents ?? DEFAULT_META.unlockedEvents)],
    flagsEverTriggered: [...(m.flagsEverTriggered ?? DEFAULT_META.flagsEverTriggered)],
    unlockedOrigins: [...(m.unlockedOrigins ?? DEFAULT_META.unlockedOrigins)],
    version: META_VERSION,
  } as MetaProgress
}
