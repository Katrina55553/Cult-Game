const COMPANION_PROGRESS_FLAGS = [
  'su_qing_companion', 'ye_qingmei_companion', 'dual_cultivation_done',
  'dual_cultivation_mastered', 'survived_together', 'chose_lovers_ascension',
  'companion_estranged',
  'companion_dream', 'companion_trial', 'companion_eternity',
]

export function clearCompanion(flags: Record<string, boolean>): Record<string, boolean> {
  const next: Record<string, boolean> = { ...flags, has_companion: false }
  for (const key of COMPANION_PROGRESS_FLAGS) next[key] = false
  return next
}

export function applyRelationshipFlag(flags: Record<string, boolean>, key: string, value: boolean): Record<string, boolean> {
  if (key === 'moli_enemy' && value) {
    return { ...flags, met_moli: true, moli_enemy: true, moli_ally: false, moli_trusted: false, moli_friend: false, moli_brother: false }
  }
  if (key === 'has_companion' && !value) return clearCompanion(flags)
  if ((key === 'su_qing_companion' || key === 'ye_qingmei_companion') && value) {
    const next = flags[key] ? { ...flags } : clearCompanion(flags)
    return { ...next, has_companion: true, [key]: true }
  }
  return { ...flags, [key]: value }
}

export function repairRelationships(flags: Record<string, boolean>): Record<string, boolean> {
  let next = flags.moli_enemy ? applyRelationshipFlag(flags, 'moli_enemy', true) : flags
  if (!next.has_companion) next = clearCompanion(next)
  if (next.su_qing_companion && next.ye_qingmei_companion) next = { ...next, ye_qingmei_companion: false }
  return next
}
