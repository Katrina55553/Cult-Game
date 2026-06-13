import type { GameEvent } from '../types/game'

/** 功法、阵法、炼丹、灵兽、神识、神兵、血脉、法修/炼体 */
export const SYSTEM_EVENTS: GameEvent[] = [
  {
    id: 'cultivation_path',
    title: '修行歧路',
    description: '恩师垂询，欲择何途以证大道？锻体魄以通玄，抑或凝元神以驭气？此一念之间，定日后修行之基。',
    weight: 16,
    years: 1,
    once: true,
    conditions: [{ type: 'realm', min: 'qi_refining_1' }],
    choices: [
      {
        id: 'body',
        text: '择炼体一途，以筋骨为根基',
        narrative: '昼夜不辍，锤炼筋骨。气血奔涌如龙象之力，体魄日愈坚韧，渐有铜皮铁骨之象。',
        effects: [
          { type: 'cultivationPath', path: 'body' },
          { type: 'flag', key: 'body_path', value: true },
          { type: 'stat', key: 'rootBone', value: 8 },
          { type: 'technique', name: '金刚淬体诀' },
        ],
      },
      {
        id: 'law',
        text: '择法修一途，以元神驭灵气',
        narrative: '澄心静虑，冥想入定。元神日益凝练，驭气化形之术渐趋精妙圆融。',
        effects: [
          { type: 'cultivationPath', path: 'law' },
          { type: 'flag', key: 'law_path', value: true },
          { type: 'divineSense', value: 12 },
          { type: 'technique', name: '清心御灵诀' },
        ],
      },
      {
        id: 'balanced',
        text: '体法兼修，不偏不倚',
        narrative: '你决意体法并重，道基四平八稳。他日若有机缘，再择一途精研不迟。',
        effects: [
          { type: 'cultivationPath', path: 'balanced' },
          { type: 'stat', key: 'comprehension', value: 4 },
          { type: 'divineSense', value: 5 },
        ],
      },
    ],
  },
  {
    id: 'divine_sense_trial',
    title: '元神试炼',
    description: '密室端坐，以神念探入识海幽深处。幻象纷至沓来，一念之差便有魂伤神损之虞。',
    weight: 8,
    years: 1,
    maxTimes: 2,
    cooldown: 8,
    choices: [
      {
        id: 'meditate',
        text: '凝神定志，破除虚妄',
        outcomes: [
          {
            chance: 0.6,
            successEffects: [
              { type: 'divineSense', value: 8 },
              { type: 'stat', key: 'comprehension', value: 3 },
            ],
            failEffects: [{ type: 'stat', key: 'demonHeart', value: 6 }],
            narrative: {
              success: '诸般幻象烟消云散，元神愈发凝实通透。',
              fail: '妄念缠缚不休，你勉力守住灵台清明，却已种下一缕心魔。',
            },
          },
        ],
      },
      {
        id: 'rest',
        text: '暂且收功，来日再试',
        effects: [{ type: 'stat', key: 'demonHeart', value: -2 }],
      },
    ],
  },
  {
    id: 'formation_study',
    title: '古阵参悟',
    description: '一卷残破古阵图浮现眼前，阵纹流转若星河旋斡。若能窥得其中三昧，日后渡劫布阵必大有裨益。',
    weight: 8,
    years: 2,
    once: true,
    rarity: 'rare',
    choices: [
      {
        id: 'study',
        text: '秉烛夜读，推演阵纹',
        outcomes: [
          {
            chance: 0.55,
            successEffects: [
              { type: 'formationTier', value: 1 },
              { type: 'stat', key: 'comprehension', value: 5 },
            ],
            failEffects: [{ type: 'stat', key: 'demonHeart', value: 5 }],
            narrative: {
              success: '终悟阵法根基之理，已可布设简易护阵。',
              fail: '阵纹变幻莫测，你渐生烦闷焦躁，心魔暗暗滋长。',
            },
          },
        ],
      },
      {
        id: 'copy',
        text: '将阵图拓印留存，待日后细细研读',
        effects: [{ type: 'formationTier', value: 1 }, { type: 'cultivation', value: 5 }],
      },
    ],
  },
  {
    id: 'alchemy_workshop',
    title: '开炉炼丹',
    description: '丹炉之下地火熊熊，灵草已备。此番欲开炉炼药，然火候稍有差池，便有炸炉之险。',
    weight: 9,
    years: 2,
    maxTimes: 2,
    cooldown: 10,
    conditions: [{ type: 'flag', key: 'mastered_alchemy', value: true }],
    choices: [
      {
        id: 'first_brew',
        text: '初次开炉试炼',
        hint: '约五成成丹 · 入门丹道',
        outcomes: [
          {
            chance: 0.5,
            successEffects: [
              { type: 'alchemyTier', value: 1 },
              { type: 'cultivation', value: 12 },
            ],
            failEffects: [{ type: 'stat', key: 'demonHeart', value: 6 }],
            narrative: {
              success: '头一炉丹药竟成，丹道之门自此为你敞开。',
              fail: '火候拿捏不精，丹炉微微开裂，心魔悄然萌生。',
            },
          },
        ],
      },
      {
        id: 'refine',
        text: '炼制培元丹',
        hint: '需丹道入门 · 约六成成丹',
        requirements: [{ type: 'alchemyTier', min: 1 }],
        outcomes: [
          {
            chance: 0.6,
            successEffects: [
              { type: 'cultivation', value: 20 },
              { type: 'lifespan', value: 8 },
              { type: 'alchemyTier', value: 1 },
            ],
            failEffects: [
              { type: 'stat', key: 'demonHeart', value: 8 },
              { type: 'spiritStones', value: -15 },
            ],
            narrative: {
              success: '丹成八转，药香馥郁满室。修为精进，寿元亦有所增益。',
              fail: '丹炉骤然炸裂，灵石化为齑粉，心魔随之暗生。',
            },
          },
        ],
      },
      {
        id: 'learn',
        text: '旁观丹师操炉，揣摩手法',
        requirements: [{ type: 'resource', key: 'spiritStones', min: 20 }],
        effects: [
          { type: 'spiritStones', value: -20 },
          { type: 'alchemyTier', value: 1 },
          { type: 'flag', key: 'mastered_alchemy', value: true },
        ],
      },
    ],
  },
  {
    id: 'bloodline_awakening',
    title: '血脉苏醒',
    description: '入定冥想之际，体内沉寂已久的古老血脉陡然沸腾，隐隐与天地元气交感共鸣。此乃血脉苏醒之兆。',
    weight: 7,
    years: 2,
    once: true,
    rarity: 'rare',
    conditions: [
      { type: 'flag', key: 'bloodline_awakened', value: false },
    ],
    choices: [
      {
        id: 'awaken',
        text: '顺应血脉之力，引其苏醒',
        requirements: [{ type: 'origin', value: 'demon_blood' }],
        outcomes: [
          {
            chance: 0.55,
            successEffects: [
              { type: 'bloodline', name: '魔裔血脉' },
              { type: 'flag', key: 'bloodline_awakened', value: true },
              { type: 'stat', key: 'rootBone', value: 6 },
              { type: 'cultivation', value: 15 },
            ],
            failEffects: [{ type: 'stat', key: 'demonHeart', value: 15 }],
            narrative: {
              success: '魔裔血脉轰然觉醒，体魄与修为俱是大进。',
              fail: '血脉之力反噬己身，心魔骤起，你苦苦压制方才稳住。',
            },
          },
        ],
      },
      {
        id: 'heaven',
        text: '借天命气运引导觉醒',
        requirements: [{ type: 'stat', key: 'luck', min: 55 }],
        outcomes: [
          {
            chance: 0.5,
            successEffects: [
              { type: 'bloodline', name: '天眷血脉' },
              { type: 'flag', key: 'bloodline_awakened', value: true },
              { type: 'flag', key: 'heavenly_bloodline', value: true },
              { type: 'stat', key: 'luck', value: 5 },
              { type: 'lifespan', value: 10 },
            ],
            failEffects: [{ type: 'lifespan', value: -5 }],
            narrative: {
              success: '天眷血脉应运而生，福缘深厚，寿元绵长。',
              fail: '觉醒半途遭遇阻滞，反折损了些许寿元。',
            },
          },
        ],
      },
      {
        id: 'suppress',
        text: '强行镇压血脉异动，稳固道基',
        narrative: '你以莫大毅力压下血脉躁动，道基因此愈发坚固沉稳。',
        effects: [
          { type: 'stat', key: 'demonHeart', value: -8 },
          { type: 'cultivation', value: 10 },
        ],
      },
    ],
  },
  {
    id: 'spirit_beast_train',
    title: '灵兽喂养',
    description: '灵宠伏于身侧，你以神念辅以血脉精元为其伐毛洗髓，或可助其突破桎梏、更上层楼。',
    weight: 10,
    years: 2,
    cooldown: 5,
    maxTimes: 3,
    minGap: 3,
    conditions: [{ type: 'flag', key: 'has_spirit_beast', value: true }],
    choices: [
      {
        id: 'train',
        text: '以神识灌注，助灵兽洗髓',
        requirements: [{ type: 'divineSense', min: 25 }],
        outcomes: [
          {
            chance: 0.55,
            successEffects: [
              { type: 'spiritBeast', name: '*' },
              { type: 'cultivation', value: 12 },
              { type: 'stat', key: 'luck', value: 3 },
            ],
            failEffects: [{ type: 'stat', key: 'demonHeart', value: 5 }],
            narrative: {
              success: '灵兽破境进阶，与你心意相通。冥冥之中，气运亦微有增益。',
              fail: '灵兽体内妖气躁动不安，你安抚许久方才平息，心中却添了几分烦扰。',
            },
          },
        ],
      },
      {
        id: 'feed',
        text: '投喂灵丹妙药',
        requirements: [{ type: 'resource', key: 'spiritStones', min: 25 }],
        effects: [
          { type: 'spiritStones', value: -25 },
          { type: 'spiritBeast', name: '*' },
          { type: 'cultivation', value: 8 },
        ],
      },
    ],
  },
  {
    id: 'divine_weapon_forge',
    title: '铸炼神兵',
    description: '地火熔炉之前，你取本命精血浇灌兵胚，欲以此铸就一柄随身神兵。此乃以命铸器之举，成则利器在手，败则元气大伤。',
    weight: 8,
    years: 3,
    once: true,
    act: 'foundation',
    rarity: 'rare',
    conditions: [{ type: 'realm', min: 'foundation' }],
    choices: [
      {
        id: 'forge',
        text: '以精血为引，亲自铸炼',
        hint: '约四成成兵 · 败则反噬',
        outcomes: [
          {
            chance: 0.4,
            successEffects: [
              { type: 'divineWeapon', id: 'soul_blade', name: '本命神兵·青霜' },
              { type: 'cultivation', value: 18 },
              { type: 'lifespan', value: -5 },
            ],
            failEffects: [
              { type: 'lifespan', value: -10 },
              { type: 'stat', key: 'demonHeart', value: 10 },
            ],
            narrative: {
              success: '神兵终成，锋芒毕露。杀伐之气反哺修行，却也折损了些许寿元。',
              fail: '兵胚承受不住精血之力骤然炸裂，血气倒灌，寿元大损。',
            },
          },
        ],
      },
      {
        id: 'commission',
        text: '委托炼器大师代为铸造',
        requirements: [{ type: 'resource', key: 'spiritStones', min: 80 }],
        effects: [
          { type: 'spiritStones', value: -80 },
          { type: 'divineWeapon', id: 'forged_blade', name: '灵铸神兵' },
          { type: 'cultivation', value: 10 },
        ],
      },
    ],
  },
  {
    id: 'technique_pavilion',
    title: '藏经阁',
    description: '藏经阁幽深之处，数枚功法玉简静静陈列于架上。你可择其一潜心修习，亦可泛览诸法以广见闻。',
    weight: 9,
    years: 2,
    once: true,
    conditions: [{ type: 'realm', min: 'qi_refining_2' }],
    choices: [
      {
        id: 'sword',
        text: '取剑诀玉简，潜心研习',
        effects: [
          { type: 'technique', name: '青云剑诀' },
          { type: 'cultivation', value: 12 },
          { type: 'stat', key: 'comprehension', value: 4 },
        ],
      },
      {
        id: 'body_art',
        text: '取炼体功法，苦修不辍',
        effects: [
          { type: 'technique', name: '龙象霸体功' },
          { type: 'stat', key: 'rootBone', value: 5 },
          { type: 'cultivationPath', path: 'body' },
          { type: 'flag', key: 'body_path', value: true },
        ],
      },
      {
        id: 'spell',
        text: '取法术心法，凝神参悟',
        effects: [
          { type: 'technique', name: '九霄雷法' },
          { type: 'divineSense', value: 8 },
          { type: 'cultivationPath', path: 'law' },
          { type: 'flag', key: 'law_path', value: true },
        ],
      },
    ],
  },
]
