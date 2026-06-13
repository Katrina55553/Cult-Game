import type { ShopItem } from '../types/game'
import { summarizeEffects } from '../engine/narrative'

export function formatShopEffectNote(effects: ShopItem['effect']): string {
  const summary = summarizeEffects(effects)
  const hint = effects.find((e) => e.type === 'hint')
  if (hint && hint.type === 'hint') {
    return summary ? `${summary}，${hint.text}` : hint.text
  }
  return summary
}

export const SHOP_ITEMS: ShopItem[] = [
  {
    id: 'lifespan_pill',
    name: '续命丹',
    description: '延寿二十年',
    cost: 60,
    effect: [{ type: 'lifespan', value: 20 }],
  },
  {
    id: 'tribulation_talisman',
    name: '护劫符',
    description: '降低心魔，助渡天劫',
    cost: 45,
    effect: [
      { type: 'stat', key: 'demonHeart', value: -15 },
      { type: 'cultivation', value: 10 },
    ],
  },
  {
    id: 'wash_marrow',
    name: '洗髓丹',
    description: '根骨与悟性各提升',
    cost: 80,
    effect: [
      { type: 'stat', key: 'rootBone', value: 5 },
      { type: 'stat', key: 'comprehension', value: 5 },
    ],
  },
  {
    id: 'intel',
    name: '天机情报',
    description: '预知下一机缘方向',
    cost: 35,
    effect: [{ type: 'hint', text: '下一机缘偏向高阶奇遇或情缘' }],
  },
  {
    id: 'spirit_gather',
    name: '聚灵散',
    description: '修为大幅提升',
    cost: 50,
    effect: [{ type: 'cultivation', value: 25 }],
  },
  {
    id: 'sense_pill',
    name: '养识丹',
    description: '滋养神识，法修必备',
    cost: 55,
    effect: [
      { type: 'divineSense', value: 15 },
      { type: 'stat', key: 'comprehension', value: 3 },
    ],
  },
  {
    id: 'formation_disk',
    name: '阵盘残片',
    description: '参悟阵理，提升阵法造诣',
    cost: 70,
    effect: [{ type: 'formationTier', value: 1 }],
  },
  {
    id: 'body_elixir',
    name: '淬体药液',
    description: '强筋健骨，炼体良药',
    cost: 65,
    effect: [
      { type: 'stat', key: 'rootBone', value: 6 },
      { type: 'cultivation', value: 10 },
    ],
  },
  {
    id: 'spirit_sword',
    name: '灵纹短剑',
    description: '刻有灵纹的短剑，可增强战斗能力',
    cost: 90,
    effect: [
      { type: 'artifact', id: 'spirit_sword', name: '灵纹短剑' },
      { type: 'stat', key: 'rootBone', value: 3 },
    ],
  },
  {
    id: 'amulet',
    name: '护身符',
    description: '蕴含护体灵力的玉符，关键时刻可保一命',
    cost: 40,
    effect: [
      { type: 'inventory', name: '护身符', description: '使用后寿元+8', usable: true },
      { type: 'stat', key: 'luck', value: 2 },
    ],
  },
  {
    id: 'healing_pills',
    name: '疗伤丹',
    description: '疗伤圣药，危急时刻可恢复寿元',
    cost: 30,
    effect: [
      { type: 'inventory', name: '疗伤丹', description: '使用后寿元+10', usable: true },
    ],
  },
  {
    id: 'comprehension_scroll',
    name: '悟道卷轴',
    description: '记载悟道心法的卷轴，研读后悟性提升',
    cost: 75,
    effect: [
      { type: 'stat', key: 'comprehension', value: 6 },
      { type: 'inventory', name: '悟道卷轴', description: '使用后悟性+5', usable: true },
    ],
  },
  {
    id: 'lucky_charm',
    name: '转运符',
    description: '据传佩戴后可转运消灾',
    cost: 25,
    effect: [
      { type: 'stat', key: 'luck', value: 5 },
      { type: 'stat', key: 'demonHeart', value: -3 },
    ],
  },
]
