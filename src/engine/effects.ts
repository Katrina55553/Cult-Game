import { resolveArtifactLabel } from '../data/artifacts'
import { getNextRealm, REALMS } from '../data/realms'
import type { Effect, PlayerState } from '../types/game'
import { getCultivationMultiplier } from './pathBonuses'

function cloneSystems(state: PlayerState): PlayerState {
  return {
    ...state,
    stats: { ...state.stats },
    flags: { ...state.flags },
    artifacts: [...state.artifacts],
    log: [...state.log],
    shopBuffs: { ...state.shopBuffs },
    cultivationSystems: {
      ...state.cultivationSystems,
      techniques: [...state.cultivationSystems.techniques],
      divineWeapons: [...state.cultivationSystems.divineWeapons],
      spiritBeast: state.cultivationSystems.spiritBeast
        ? { ...state.cultivationSystems.spiritBeast }
        : null,
    },
  }
}

export function applyEffects(state: PlayerState, effects: Effect[]): PlayerState {
  let next = cloneSystems(state)
  for (const effect of effects) {
    next = applyEffect(next, effect)
  }
  return next
}

function applyEffect(state: PlayerState, effect: Effect): PlayerState {
  switch (effect.type) {
    case 'stat': {
      const value = clamp(
        state.stats[effect.key] + effect.value,
        effect.key === 'karma' ? -100 : 0,
        effect.key === 'karma' ? 100 : effect.key === 'demonHeart' ? 100 : 999,
      )
      return { ...state, stats: { ...state.stats, [effect.key]: value } }
    }
    case 'cultivation': {
      const bonus = Math.round(effect.value * getCultivationMultiplier(state))
      let cultivation = state.cultivation + bonus
      let realm = state.realm
      let lifespan = state.lifespan

      while (cultivation >= 100) {
        const nextRealm = getNextRealm(realm)
        if (!nextRealm) {
          cultivation = 100
          break
        }
        cultivation -= 100
        realm = nextRealm
        lifespan += REALMS[nextRealm].lifespanBonus
      }

      cultivation = clamp(cultivation, 0, 100)
      return { ...state, cultivation, realm, lifespan }
    }
    case 'lifespan':
      return { ...state, lifespan: Math.max(state.age + 1, state.lifespan + effect.value) }
    case 'spiritStones': {
      if (effect.set) {
        return { ...state, spiritStones: Math.max(0, effect.value) }
      }
      return { ...state, spiritStones: Math.max(0, state.spiritStones + effect.value) }
    }
    case 'flag':
      return { ...state, flags: { ...state.flags, [effect.key]: effect.value } }
    case 'artifact': {
      const label = resolveArtifactLabel(effect.id, effect.name)
      if (state.artifacts.includes(effect.id) || state.artifacts.includes(label)) {
        return state
      }
      return { ...state, artifacts: [...state.artifacts, label] }
    }
    case 'divineSense': {
      const divineSense = clamp(state.cultivationSystems.divineSense + effect.value, 0, 100)
      return {
        ...state,
        cultivationSystems: { ...state.cultivationSystems, divineSense },
      }
    }
    case 'alchemyTier': {
      const alchemyTier = clamp(state.cultivationSystems.alchemyTier + effect.value, 0, 3)
      return {
        ...state,
        cultivationSystems: { ...state.cultivationSystems, alchemyTier },
      }
    }
    case 'formationTier': {
      const formationTier = clamp(state.cultivationSystems.formationTier + effect.value, 0, 3)
      return {
        ...state,
        cultivationSystems: { ...state.cultivationSystems, formationTier },
      }
    }
    case 'swordTier': {
      const swordTier = clamp(state.cultivationSystems.swordTier + effect.value, 0, 3)
      return {
        ...state,
        cultivationSystems: { ...state.cultivationSystems, swordTier },
      }
    }
    case 'bloodline':
      return {
        ...state,
        cultivationSystems: { ...state.cultivationSystems, bloodline: effect.name },
      }
    case 'bloodlineTier': {
      const bloodlineTier = clamp(state.cultivationSystems.bloodlineTier + effect.value, 0, 3)
      return {
        ...state,
        cultivationSystems: { ...state.cultivationSystems, bloodlineTier },
      }
    }
    case 'technique': {
      if (state.cultivationSystems.techniques.includes(effect.name)) return state
      return {
        ...state,
        cultivationSystems: {
          ...state.cultivationSystems,
          techniques: [...state.cultivationSystems.techniques, effect.name],
        },
      }
    }
    case 'techniqueTier': {
      const techniqueTier = clamp(state.cultivationSystems.techniqueTier + effect.value, 0, 3)
      return {
        ...state,
        cultivationSystems: { ...state.cultivationSystems, techniqueTier },
      }
    }
    case 'divineWeapon': {
      const label = effect.name
      if (state.cultivationSystems.divineWeapons.includes(label)) return state
      return {
        ...state,
        cultivationSystems: {
          ...state.cultivationSystems,
          divineWeapons: [...state.cultivationSystems.divineWeapons, label],
        },
      }
    }
    case 'divineWeaponTier': {
      const divineWeaponTier = clamp(state.cultivationSystems.divineWeaponTier + effect.value, 0, 3)
      return {
        ...state,
        cultivationSystems: { ...state.cultivationSystems, divineWeaponTier },
      }
    }
    case 'spiritBeast': {
      const current = state.cultivationSystems.spiritBeast
      const name = effect.name === '*' && current ? current.name : effect.name
      const tier = effect.tier ?? (current?.name === name ? (current.tier + 1) : 1)
      const seen = state.spiritBeastsSeen ?? []
      const newSeen = seen.includes(name) ? seen : [...seen, name]
      return {
        ...state,
        flags: { ...state.flags, has_spirit_beast: true },
        cultivationSystems: {
          ...state.cultivationSystems,
          spiritBeast: { name, tier: clamp(tier, 1, 3) },
        },
        spiritBeastsSeen: newSeen,
      }
    }
    case 'cultivationPath':
      return {
        ...state,
        cultivationSystems: { ...state.cultivationSystems, path: effect.path },
      }
    case 'inventory':
      if (state.inventory.length >= state.bagCapacity) return state
      return {
        ...state,
        inventory: [
          ...state.inventory,
          { name: effect.name, description: effect.description, usable: effect.usable ?? false },
        ],
      }
    case 'log':
      return { ...state, log: [...state.log, effect.text] }
    case 'age':
      return { ...state, age: state.age + effect.value }
    case 'endLife':
      return { ...state, lifespan: state.age + 1 }
    case 'breakthrough': {
      const nextRealm = getNextRealm(state.realm)
      if (!nextRealm) return state
      return {
        ...state,
        realm: nextRealm,
        cultivation: 0,
        lifespan: state.lifespan + REALMS[nextRealm].lifespanBonus,
        log: [...state.log, `突破成功！晋升${REALMS[nextRealm].name}！`],
      }
    }
    case 'hint':
      return { ...state, nextEventHint: effect.text }
    default:
      return state
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}
