import type { CultivationPath, CultivationSystems } from '../types/game'

export const PATH_LABELS: Record<CultivationPath, string> = {
  balanced: '兼修',
  body: '炼体',
  law: '法修',
}

export const ALCHEMY_TIER_LABELS = ['未入门', '丹徒', '丹师', '丹宗'] as const
export const FORMATION_TIER_LABELS = ['未入门', '阵徒', '阵师', '阵宗'] as const

export function createDefaultCultivationSystems(
  bloodline: string | null = null,
): CultivationSystems {
  return {
    path: 'balanced',
    divineSense: 10,
    alchemyTier: 0,
    formationTier: 0,
    bloodline,
    techniques: [],
    divineWeapons: [],
    spiritBeast: null,
  }
}

export function getPathLabel(path: CultivationPath): string {
  return PATH_LABELS[path]
}

export function getAlchemyLabel(tier: number): string {
  return ALCHEMY_TIER_LABELS[Math.min(tier, ALCHEMY_TIER_LABELS.length - 1)]
}

export function getFormationLabel(tier: number): string {
  return FORMATION_TIER_LABELS[Math.min(tier, FORMATION_TIER_LABELS.length - 1)]
}

export function migrateCultivationSystems(player: {
  origin: import('../types/game').OriginId
  flags: Record<string, boolean>
  cultivationSystems?: CultivationSystems
}): CultivationSystems {
  if (player.cultivationSystems) return player.cultivationSystems

  const bloodline =
    player.origin === 'demon_blood' || player.flags.bloodline_awakened
      ? '魔裔血脉'
      : player.flags.heavenly_bloodline
        ? '天眷血脉'
        : null

  const systems = createDefaultCultivationSystems(bloodline)
  if (player.flags.mastered_alchemy) systems.alchemyTier = Math.max(systems.alchemyTier, 1)
  if (player.flags.has_spirit_beast) {
    systems.spiritBeast = { name: '妖狼', tier: 1 }
  }
  if (player.flags.body_path) systems.path = 'body'
  if (player.flags.law_path) systems.path = 'law'

  return systems
}
