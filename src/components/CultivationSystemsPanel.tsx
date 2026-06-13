import {
  getAlchemyLabel,
  getBloodlineLabel,
  getDivineWeaponLabel,
  getFormationLabel,
  getPathLabel,
  getSwordLabel,
  getTechniqueLabel,
} from '../data/cultivationSystems'
import type { PlayerState } from '../types/game'

interface Props {
  player: PlayerState
}

export function CultivationSystemsPanel({ player }: Props) {
  const sys = player.cultivationSystems
  const items: string[] = []

  if (sys.path !== 'balanced') items.push(getPathLabel(sys.path))
  if (sys.bloodline) items.push(`${sys.bloodline}·${getBloodlineLabel(sys.bloodlineTier)}`)
  if (sys.divineSense > 10) items.push(`神识 ${sys.divineSense}`)
  if (sys.alchemyTier > 0) items.push(`丹道·${getAlchemyLabel(sys.alchemyTier)}`)
  if (sys.formationTier > 0) items.push(`阵法·${getFormationLabel(sys.formationTier)}`)
  if (sys.swordTier > 0) items.push(`剑道·${getSwordLabel(sys.swordTier)}`)
  if (sys.techniqueTier > 0) items.push(`功法·${getTechniqueLabel(sys.techniqueTier)}`)
  if (sys.divineWeaponTier > 0) items.push(`神兵·${getDivineWeaponLabel(sys.divineWeaponTier)}`)
  if (sys.techniques.length > 0) items.push(`功法 ${sys.techniques.join('、')}`)
  if (sys.divineWeapons.length > 0) items.push(`法宝 ${sys.divineWeapons.join('、')}`)
  if (sys.spiritBeast) {
    items.push(`灵兽 ${sys.spiritBeast.name} ${sys.spiritBeast.tier}阶`)
  }

  if (items.length === 0) return null

  return (
    <p className="mt-2 text-xs text-[var(--color-jade-light)]/90 leading-relaxed">
      修行：{items.join(' · ')}
    </p>
  )
}
