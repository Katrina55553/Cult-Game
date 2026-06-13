export interface Sect {
  id: string
  name: string
  tier: 'small' | 'medium' | 'large'
  description: string
  specialty: string
  attitude: 'friendly' | 'neutral' | 'hostile'
}

export const SECTS: Sect[] = [
  {
    id: 'tianxuan',
    name: '天玄宗',
    tier: 'large',
    description: '正道之首，据守东方灵脉，门下弟子数万。',
    specialty: '剑道',
    attitude: 'friendly',
  },
  {
    id: 'cangqiong',
    name: '苍穹阁',
    tier: 'large',
    description: '盘踞北方，与天玄宗分庭抗礼，底蕴深厚。',
    specialty: '阵法',
    attitude: 'hostile',
  },
  {
    id: 'qinglian',
    name: '青莲剑宗',
    tier: 'medium',
    description: '以剑入道，门下弟子皆佩三尺青锋，剑意凛然。',
    specialty: '剑道',
    attitude: 'neutral',
  },
  {
    id: 'yaogu',
    name: '药谷',
    tier: 'medium',
    description: '隐于深山幽谷，精研丹道，丹药闻名修真界。',
    specialty: '丹道',
    attitude: 'friendly',
  },
  {
    id: 'wanyao',
    name: '万妖殿',
    tier: 'medium',
    description: '妖修聚集之地，殿主乃千年狐妖，统御万妖。',
    specialty: '灵兽',
    attitude: 'neutral',
  },
  {
    id: 'moyu',
    name: '魔域六宗',
    tier: 'large',
    description: '魔道六大宗门联盟，蛰伏暗处，伺机而动。',
    specialty: '魔功',
    attitude: 'hostile',
  },
  {
    id: 'xuanbing',
    name: '玄冰门',
    tier: 'small',
    description: '北地小门派，弟子皆修冰系功法，性情冷傲。',
    specialty: '法术',
    attitude: 'neutral',
  },
  {
    id: 'leize',
    name: '雷泽派',
    tier: 'small',
    description: '居于雷泽之畔，以雷法闻名，弟子脾气火爆。',
    specialty: '法术',
    attitude: 'neutral',
  },
  {
    id: 'guiyi',
    name: '归一寺',
    tier: 'medium',
    description: '佛门圣地，僧人修禅悟道，以因果轮回为根本。',
    specialty: '神识',
    attitude: 'friendly',
  },
  {
    id: 'huangsha',
    name: '黄沙门',
    tier: 'small',
    description: '西域荒漠中的门派，弟子擅长御兽与沙遁之术。',
    specialty: '灵兽',
    attitude: 'neutral',
  },
]
