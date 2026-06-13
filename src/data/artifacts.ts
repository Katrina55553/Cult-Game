export const ARTIFACT_NAMES: Record<string, string> = {
  ancient_sword: '古剑',
  spirit_pendant: '灵玉佩',
  jade_slip: '传承玉简',
  realm_token: '秘境令牌',
  sect_seal: '掌门信印',
  combo_scroll: '合击秘卷',
}

export function formatArtifactName(value: string): string {
  return ARTIFACT_NAMES[value] ?? value
}

export function resolveArtifactLabel(id: string, name?: string): string {
  return name ?? ARTIFACT_NAMES[id] ?? id
}
