import { getAlchemyLabel, getBloodlineLabel, getDivineWeaponLabel, getFormationLabel, getPathLabel, getSwordLabel, getTechniqueLabel } from '../data/cultivationSystems'
import { getRealmOrder } from '../data/realms'
import type { Condition, PlayerState } from '../types/game'

export function checkConditions(state: PlayerState, conditions: Condition[] | undefined): boolean {
  if (!conditions || conditions.length === 0) return true
  return conditions.every((c) => checkCondition(state, c))
}

function checkCondition(state: PlayerState, condition: Condition): boolean {
  switch (condition.type) {
    case 'stat': {
      const value = state.stats[condition.key]
      if (condition.min !== undefined && value < condition.min) return false
      if (condition.max !== undefined && value > condition.max) return false
      return true
    }
    case 'realm':
      return getRealmOrder(state.realm) >= getRealmOrder(condition.min)
    case 'flag': {
      const actual = state.flags[condition.key] ?? false
      return actual === condition.value
    }
    case 'resource': {
      const resources: Record<string, number> = { spiritStones: state.spiritStones }
      return (resources[condition.key] ?? 0) >= condition.min
    }
    case 'age': {
      if (condition.min !== undefined && state.age < condition.min) return false
      if (condition.max !== undefined && state.age > condition.max) return false
      return true
    }
    case 'cultivation': {
      if (condition.min !== undefined && state.cultivation < condition.min) return false
      if (condition.max !== undefined && state.cultivation > condition.max) return false
      return true
    }
    case 'lifespan_remaining':
      return state.lifespan - state.age <= condition.max
    case 'divineSense':
      return state.cultivationSystems.divineSense >= condition.min
    case 'alchemyTier':
      return state.cultivationSystems.alchemyTier >= condition.min
    case 'formationTier':
      return state.cultivationSystems.formationTier >= condition.min
    case 'swordTier':
      return state.cultivationSystems.swordTier >= condition.min
    case 'bloodlineTier':
      return state.cultivationSystems.bloodlineTier >= condition.min
    case 'techniqueTier':
      return state.cultivationSystems.techniqueTier >= condition.min
    case 'divineWeaponTier':
      return state.cultivationSystems.divineWeaponTier >= condition.min
    case 'cultivationPath':
      return state.cultivationSystems.path === condition.path
    case 'origin':
      return state.origin === condition.value
    default:
      return true
  }
}

export function getFailedRequirements(
  state: PlayerState,
  conditions: Condition[] | undefined,
): string[] {
  if (!conditions) return []
  const failed: string[] = []
  for (const c of conditions) {
    if (!checkCondition(state, c)) {
      failed.push(describeCondition(c))
    }
  }
  return failed
}

function describeCondition(c: Condition): string {
  switch (c.type) {
    case 'stat':
      if (c.min !== undefined && c.max !== undefined) return `${statName(c.key)}在${c.min}到${c.max}之间`
      return c.min !== undefined ? `${statName(c.key)}≥${c.min}` : `${statName(c.key)}≤${c.max}`
    case 'realm':
      return `境界需达${c.min}`
    case 'flag':
      return '需满足特定条件'
    case 'resource':
      return `灵石≥${c.min}`
    case 'age':
      if (c.min !== undefined && c.max !== undefined) return `年龄在${c.min}到${c.max}之间`
      return c.min !== undefined ? `年龄≥${c.min}` : `年龄≤${c.max}`
    case 'cultivation':
      if (c.min !== undefined && c.max !== undefined) return `修为在${c.min}%到${c.max}%之间`
      return c.min !== undefined ? `修为≥${c.min}%` : `修为≤${c.max}%`
    case 'lifespan_remaining':
      return `寿元将尽`
    case 'divineSense':
      return `神识≥${c.min}`
    case 'alchemyTier':
      return `丹道≥${getAlchemyLabel(c.min)}`
    case 'formationTier':
      return `阵法≥${getFormationLabel(c.min)}`
    case 'swordTier':
      return `剑道≥${getSwordLabel(c.min)}`
    case 'bloodlineTier':
      return `血脉≥${getBloodlineLabel(c.min)}`
    case 'techniqueTier':
      return `功法≥${getTechniqueLabel(c.min)}`
    case 'divineWeaponTier':
      return `神兵≥${getDivineWeaponLabel(c.min)}`
    case 'cultivationPath':
      return `需${getPathLabel(c.path)}路线`
    case 'origin':
      return '需特定出身'
    default:
      return '条件未满足'
  }
}

function statName(key: string): string {
  const names: Record<string, string> = {
    rootBone: '根骨',
    comprehension: '悟性',
    luck: '气运',
    karma: '因果',
    demonHeart: '心魔',
  }
  return names[key] ?? key
}
