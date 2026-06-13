import type { RealmId, RealmInfo } from '../types/game'

export const REALMS: Record<RealmId, RealmInfo> = {
  mortal: { id: 'mortal', name: '凡人', order: 0, lifespanBonus: 0, breakthroughThreshold: 100 },
  qi_refining_1: { id: 'qi_refining_1', name: '炼气一层', order: 1, lifespanBonus: 10, breakthroughThreshold: 100 },
  qi_refining_2: { id: 'qi_refining_2', name: '炼气二层', order: 2, lifespanBonus: 5, breakthroughThreshold: 100 },
  qi_refining_3: { id: 'qi_refining_3', name: '炼气三层', order: 3, lifespanBonus: 5, breakthroughThreshold: 100 },
  foundation: { id: 'foundation', name: '筑基期', order: 4, lifespanBonus: 80, breakthroughThreshold: 100 },
  golden_core: { id: 'golden_core', name: '金丹期', order: 5, lifespanBonus: 150, breakthroughThreshold: 100 },
  nascent_soul: { id: 'nascent_soul', name: '元婴期', order: 6, lifespanBonus: 300, breakthroughThreshold: 100 },
  deity: { id: 'deity', name: '化神期', order: 7, lifespanBonus: 500, breakthroughThreshold: 100 },
}

export const REALM_ORDER: RealmId[] = [
  'mortal',
  'qi_refining_1',
  'qi_refining_2',
  'qi_refining_3',
  'foundation',
  'golden_core',
  'nascent_soul',
  'deity',
]

export function getRealmOrder(realm: RealmId): number {
  return REALMS[realm].order
}

export function getNextRealm(realm: RealmId): RealmId | null {
  const idx = REALM_ORDER.indexOf(realm)
  return idx < REALM_ORDER.length - 1 ? REALM_ORDER[idx + 1] : null
}
