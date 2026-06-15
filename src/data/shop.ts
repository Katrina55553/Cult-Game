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
    description: '以百年灵芝炼制，服之可延寿二十载。老修士们趋之若鹜的续命圣药。',
    cost: 60,
    effect: [{ type: 'lifespan', value: 20 }],
  },
  {
    id: 'tribulation_talisman',
    name: '护劫符',
    description: '高僧以因果之力绘制的符箓，佩戴后心魔渐消，渡劫时多一分把握。',
    cost: 45,
    effect: [
      { type: 'stat', key: 'demonHeart', value: -15 },
      { type: 'cultivation', value: 10 },
    ],
  },
  {
    id: 'wash_marrow',
    name: '洗髓丹',
    description: '传说中的脱胎换骨圣药。服下后经脉重塑，根骨悟性皆有提升，痛苦亦随之而来。',
    cost: 80,
    effect: [
      { type: 'stat', key: 'rootBone', value: 5 },
      { type: 'stat', key: 'comprehension', value: 5 },
    ],
  },
  {
    id: 'intel',
    name: '天机情报',
    description: '坊市中最灵通的情报贩子，以灵石换取一则天机。据说他的消息从不出错。',
    cost: 35,
    effect: [{ type: 'hint', text: '下一机缘偏向高阶奇遇或情缘' }],
  },
  {
    id: 'spirit_gather',
    name: '聚灵散',
    description: '以地脉精华凝聚而成的药散，服后灵气暴涨，修为一日千里。副作用是三日内无法入睡。',
    cost: 50,
    effect: [{ type: 'cultivation', value: 25 }],
  },
  {
    id: 'sense_pill',
    name: '养识丹',
    description: '专滋养神识的灵丹，法修视若珍宝。服后神识清明，感知万物细微变化。',
    cost: 55,
    effect: [
      { type: 'divineSense', value: 15 },
      { type: 'stat', key: 'comprehension', value: 3 },
    ],
  },
  {
    id: 'formation_disk',
    name: '阵盘残片',
    description: '上古大阵的残碎片段，虽已残破，阵纹中仍蕴含深奥的阵道至理。',
    cost: 70,
    effect: [{ type: 'formationTier', value: 1 }],
  },
  {
    id: 'body_elixir',
    name: '淬体药液',
    description: '以妖兽精血配制的药液，浸泡后筋骨强韧如铁。炼体修士的最爱。',
    cost: 65,
    effect: [
      { type: 'stat', key: 'rootBone', value: 6 },
      { type: 'cultivation', value: 10 },
    ],
  },
  {
    id: 'spirit_sword',
    name: '灵纹短剑',
    description: '剑身刻有灵纹，出鞘时隐隐有灵光流转。虽非法宝，却也锋利异常。',
    cost: 90,
    effect: [
      { type: 'artifact', id: 'spirit_sword', name: '灵纹短剑' },
      { type: 'stat', key: 'rootBone', value: 3 },
    ],
  },
  {
    id: 'amulet',
    name: '护身符',
    description: '蕴含护体灵力的温润玉符，危急时刻自动激发，可挡致命一击。',
    cost: 40,
    effect: [
      { type: 'inventory', name: '护身符', description: '使用后寿元+8', usable: true },
      { type: 'stat', key: 'luck', value: 2 },
    ],
  },
  {
    id: 'healing_pills',
    name: '疗伤丹',
    description: '最常见的疗伤灵药，药效温和却可靠。散修们出门必备之物。',
    cost: 30,
    effect: [
      { type: 'inventory', name: '疗伤丹', description: '使用后寿元+10', usable: true },
    ],
  },
  {
    id: 'comprehension_scroll',
    name: '悟道卷轴',
    description: '记载前人悟道心法的古老卷轴，展卷细读，如闻大道之音。',
    cost: 75,
    effect: [
      { type: 'stat', key: 'comprehension', value: 6 },
      { type: 'inventory', name: '悟道卷轴', description: '使用后悟性+5', usable: true },
    ],
  },
  {
    id: 'lucky_charm',
    name: '转运符',
    description: '据说是从归一寺求来的开光符箓，佩戴后诸事顺遂，心魔不侵。',
    cost: 25,
    effect: [
      { type: 'stat', key: 'luck', value: 5 },
      { type: 'stat', key: 'demonHeart', value: -3 },
    ],
  },
]
