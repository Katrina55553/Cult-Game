export interface ExploreArea {
  id: string
  name: string
  description: string
  dangerLevel: 'low' | 'medium' | 'high' | 'extreme'
  minRealm: string
  rewards: string
}

export const EXPLORE_AREAS: ExploreArea[] = [
  {
    id: 'spirit_mountain',
    name: '灵山福地',
    description: '灵气充沛的仙山，草木皆有灵性，偶有灵兽出没。',
    dangerLevel: 'low',
    minRealm: 'qi_refining_1',
    rewards: '灵石、灵草、低阶法宝',
  },
  {
    id: 'demon_mountain',
    name: '万魔山',
    description: '魔气弥漫的险山，魔修与妖兽盘踞其中。',
    dangerLevel: 'medium',
    minRealm: 'qi_refining_2',
    rewards: '魔功秘籍、血脉觉醒材料',
  },
  {
    id: 'ancient_tomb',
    name: '古修墓穴',
    description: '上古修士的陵墓，机关重重，宝物无数。',
    dangerLevel: 'medium',
    minRealm: 'foundation',
    rewards: '古修传承、法宝、阵法残卷',
  },
  {
    id: 'thunder_valley',
    name: '雷泽秘境',
    description: '终年雷暴不断的山谷，雷霆之力淬炼肉身的绝佳之地。',
    dangerLevel: 'high',
    minRealm: 'foundation',
    rewards: '雷属性功法、根骨提升',
  },
  {
    id: 'ice_land',
    name: '极北冰原',
    description: '万里冰封的极北之地，传说有上古冰凤栖息。',
    dangerLevel: 'high',
    minRealm: 'golden_core',
    rewards: '冰属性功法、灵宠冰凤',
  },
  {
    id: 'star_ruins',
    name: '星辰遗迹',
    description: '陨石撞击形成的巨坑，坑底残留星辰之力。',
    dangerLevel: 'extreme',
    minRealm: 'golden_core',
    rewards: '天外陨铁、星辰功法',
  },
  {
    id: 'void_rift',
    name: '虚空裂缝',
    description: '空间不稳定之处，裂缝连接着未知的异界。',
    dangerLevel: 'extreme',
    minRealm: 'nascent_soul',
    rewards: '异界宝物、空间法宝',
  },
]
