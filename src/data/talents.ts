export interface Talent {
  id: string
  name: string
  description: string
  category: 'combat' | 'utility' | 'luck' | 'social'
}

export const TALENTS: Talent[] = [
  { id: 'sword_heart', name: '剑心通明', description: '剑道事件成功率 +15%', category: 'combat' },
  { id: 'iron_body', name: '铜皮铁骨', description: '根骨 +8', category: 'combat' },
  { id: 'demon_slayer_talent', name: '斩魔天赋', description: 'Boss 战成功率 +10%', category: 'combat' },
  { id: 'quick_reflexes', name: '身手敏捷', description: '战斗事件成功率 +10%', category: 'combat' },
  { id: 'alchemy_nose', name: '丹道灵觉', description: '炼丹事件成功率 +15%', category: 'utility' },
  { id: 'formation_eye', name: '阵法慧眼', description: '阵法事件成功率 +15%', category: 'utility' },
  { id: 'beast_whisper', name: '万兽亲和', description: '灵兽事件成功率 +15%', category: 'utility' },
  { id: 'treasure_sense', name: '寻宝直觉', description: '秘境事件成功率 +10%', category: 'utility' },
  { id: 'golden_luck', name: '天降鸿运', description: '气运 +10', category: 'luck' },
  { id: 'fate_weaver', name: '命运编织', description: '所有概率型事件 +5%', category: 'luck' },
  { id: 'longevity', name: '长生体质', description: '寿元 +20', category: 'luck' },
  { id: 'spirit_affinity', name: '灵气亲和', description: '修为获取 +15%', category: 'luck' },
  { id: 'silver_tongue', name: '巧舌如簧', description: '因果获取 +30%', category: 'social' },
  { id: 'herb_knowledge', name: '百草通识', description: '悟性 +6', category: 'social' },
  { id: 'lucky_star', name: '福星高照', description: '稀有事件触发率 +20%', category: 'luck' },
]
