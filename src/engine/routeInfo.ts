import { getAlchemyLabel, getFormationLabel, getPathLabel } from '../data/cultivationSystems'
import type { PlayerState } from '../types/game'

export interface RouteTag {
  label: string
  tone: 'jade' | 'gold' | 'cinnabar' | 'mist'
}

export function getRouteTags(player: PlayerState): RouteTag[] {
  const tags: RouteTag[] = []

  if (player.flags.accepted_demon_path || player.stats.demonHeart >= 60) {
    tags.push({ label: '魔道线', tone: 'cinnabar' })
  }
  if (player.flags.has_companion) {
    const name = player.flags.met_su_qing
      ? '道侣·苏清雪'
      : player.flags.met_lin_wanyue
        ? '道侣·林挽月'
        : '道侣同行'
    tags.push({ label: name, tone: 'gold' })
  } else if (player.flags.met_su_qing) {
    tags.push({ label: '情缘·苏清雪', tone: 'gold' })
  } else if (player.flags.met_lin_wanyue) {
    tags.push({ label: '情缘·林挽月', tone: 'gold' })
  }
  if (player.flags.loyal_to_sect) {
    tags.push({ label: '宗门线', tone: 'jade' })
  }
  if (player.flags.refused_all_sects) {
    tags.push({ label: '散修线', tone: 'mist' })
  }
  const sys = player.cultivationSystems
  if (sys.path !== 'balanced') {
    tags.push({ label: `${getPathLabel(sys.path)}路`, tone: 'jade' })
  }
  if (sys.alchemyTier > 0) {
    tags.push({ label: `丹道·${getAlchemyLabel(sys.alchemyTier)}`, tone: 'gold' })
  }
  if (sys.formationTier > 0) {
    tags.push({ label: `阵法·${getFormationLabel(sys.formationTier)}`, tone: 'jade' })
  }
  if (sys.spiritBeast) {
    tags.push({ label: `灵兽·${sys.spiritBeast.name}`, tone: 'gold' })
  }
  if (tags.length === 0) {
    tags.push({ label: '初入仙途', tone: 'mist' })
  }

  return tags
}

export function getWarnings(player: PlayerState): string[] {
  const w: string[] = []
  const remaining = player.lifespan - player.age
  if (remaining <= 10) w.push(`寿元仅剩 ${remaining} 年`)
  if (player.stats.demonHeart >= 50) w.push(`心魔 ${player.stats.demonHeart}`)
  if (player.cultivation >= 90) w.push('修为将满，临近突破')
  return w
}
