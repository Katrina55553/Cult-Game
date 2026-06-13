import type { GameEvent } from '../types/game'

/** 功法、阵法、炼丹、灵兽、神识、神兵、血脉、法修/炼体 */
export const SYSTEM_EVENTS: GameEvent[] = [
  {
    id: 'cultivation_path',
    title: '道途抉择',
    description: '师尊问你欲修何道：以气血淬体，还是以神识御法？此择一经定下，将影响日后修行。',
    weight: 16,
    years: 1,
    once: true,
    conditions: [{ type: 'realm', min: 'qi_refining_1' }],
    choices: [
      {
        id: 'body',
        text: '走炼体之路，以根骨为本',
        narrative: '你日夜淬炼筋骨，气血如龙，体魄日益强韧。',
        effects: [
          { type: 'cultivationPath', path: 'body' },
          { type: 'flag', key: 'body_path', value: true },
          { type: 'stat', key: 'rootBone', value: 8 },
          { type: 'technique', name: '金刚淬体诀' },
        ],
      },
      {
        id: 'law',
        text: '走法修之路，以神识御气',
        narrative: '你凝神观想，神识渐长，御气之术日益纯熟。',
        effects: [
          { type: 'cultivationPath', path: 'law' },
          { type: 'flag', key: 'law_path', value: true },
          { type: 'divineSense', value: 12 },
          { type: 'technique', name: '清心御灵诀' },
        ],
      },
      {
        id: 'balanced',
        text: '兼修并重，不偏一隅',
        narrative: '你选择兼修并重，道基平稳，日后可再专精。',
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
    title: '神识试炼',
    description: '静室之中，你以神识探入识海深处，幻象丛生，稍有不慎便神魂受损。',
    weight: 8,
    years: 1,
    maxTimes: 2,
    cooldown: 8,
    choices: [
      {
        id: 'meditate',
        text: '凝神破妄',
        outcomes: [
          {
            chance: 0.6,
            successEffects: [
              { type: 'divineSense', value: 8 },
              { type: 'stat', key: 'comprehension', value: 3 },
            ],
            failEffects: [{ type: 'stat', key: 'demonHeart', value: 6 }],
            narrative: {
              success: '幻象尽散，神识更为凝实。',
              fail: '幻象缠身，你勉强守住道心，心魔微生。',
            },
          },
        ],
      },
      {
        id: 'rest',
        text: '暂且作罢',
        effects: [{ type: 'stat', key: 'demonHeart', value: -2 }],
      },
    ],
  },
  {
    id: 'formation_study',
    title: '阵法参悟',
    description: '古阵残图浮现眼前，阵纹如星河流转。若能参透一二，日后渡劫布阵皆有裨益。',
    weight: 8,
    years: 2,
    once: true,
    rarity: 'rare',
    choices: [
      {
        id: 'study',
        text: '彻夜推演阵纹',
        outcomes: [
          {
            chance: 0.55,
            successEffects: [
              { type: 'formationTier', value: 1 },
              { type: 'stat', key: 'comprehension', value: 5 },
            ],
            failEffects: [{ type: 'stat', key: 'demonHeart', value: 5 }],
            narrative: {
              success: '你悟得基础阵理，可布简单护阵。',
              fail: '阵纹繁杂，你略感焦躁，心魔暗生。',
            },
          },
        ],
      },
      {
        id: 'copy',
        text: '拓印阵图日后再研',
        effects: [{ type: 'formationTier', value: 1 }, { type: 'cultivation', value: 5 }],
      },
    ],
  },
  {
    id: 'alchemy_workshop',
    title: '丹房炼制',
    description: '丹炉火光熊熊，你欲以灵草炼制丹药。火候一分差，便是炸炉反噬。',
    weight: 9,
    years: 2,
    maxTimes: 2,
    cooldown: 10,
    conditions: [{ type: 'flag', key: 'mastered_alchemy', value: true }],
    choices: [
      {
        id: 'first_brew',
        text: '初试炼丹',
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
              success: '首炉丹成，你正式踏入丹道之门。',
              fail: '火候欠佳，丹炉微裂，心魔暗生。',
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
              success: '丹成八转，药香四溢，修为与寿元皆增。',
              fail: '丹炉炸裂，灵石尽毁，心魔暗生。',
            },
          },
        ],
      },
      {
        id: 'learn',
        text: '观摩丹师炼制',
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
    title: '血脉觉醒',
    description: '入定之时，体内沉寂血脉骤然沸腾，似与天地共鸣。这是觉醒的契机。',
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
        text: '引导血脉觉醒',
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
              success: '魔裔血脉觉醒，体魄与修为皆大涨。',
              fail: '血脉反噬，心魔骤起，你勉强压制。',
            },
          },
        ],
      },
      {
        id: 'heaven',
        text: '以天眷之力觉醒',
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
              success: '天眷血脉觉醒，气运与寿元皆增。',
              fail: '觉醒半途受阻，寿元略损。',
            },
          },
        ],
      },
      {
        id: 'suppress',
        text: '压制异象，稳固道基',
        narrative: '你压下血脉躁动，道基更为稳固。',
        effects: [
          { type: 'stat', key: 'demonHeart', value: -8 },
          { type: 'cultivation', value: 10 },
        ],
      },
    ],
  },
  {
    id: 'spirit_beast_train',
    title: '灵兽驯养',
    description: '你的灵宠盘膝在侧，你以神识与血脉之气助其洗髓，或可助其进阶。',
    weight: 10,
    years: 2,
    cooldown: 5,
    conditions: [{ type: 'flag', key: 'has_spirit_beast', value: true }],
    choices: [
      {
        id: 'train',
        text: '以神识助灵兽洗髓',
        requirements: [{ type: 'divineSense', min: 25 }],
        outcomes: [
          {
            chance: 0.55,
            successEffects: [
              { type: 'spiritBeast', name: '妖狼', tier: 2 },
              { type: 'cultivation', value: 12 },
              { type: 'stat', key: 'luck', value: 3 },
            ],
            failEffects: [{ type: 'stat', key: 'demonHeart', value: 5 }],
            narrative: {
              success: '灵兽进阶，与你心意相通，气运微增。',
              fail: '灵兽躁动，你安抚许久，心魔微生。',
            },
          },
        ],
      },
      {
        id: 'feed',
        text: '喂食灵丹',
        requirements: [{ type: 'resource', key: 'spiritStones', min: 25 }],
        effects: [
          { type: 'spiritStones', value: -25 },
          { type: 'spiritBeast', name: '妖狼' },
          { type: 'cultivation', value: 8 },
        ],
      },
    ],
  },
  {
    id: 'divine_weapon_forge',
    title: '神兵淬炼',
    description: '地火熔炉之前，你以本命精血淬炼兵胚，欲铸一件神兵伴身。',
    weight: 8,
    years: 3,
    once: true,
    act: 'foundation',
    rarity: 'rare',
    conditions: [{ type: 'realm', min: 'foundation' }],
    choices: [
      {
        id: 'forge',
        text: '以精血淬炼',
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
              success: '神兵初成，杀伐之气助益修行，然耗去些许寿元。',
              fail: '兵胚炸裂，精血反噬，寿元大损。',
            },
          },
        ],
      },
      {
        id: 'commission',
        text: '请炼器师代铸',
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
    title: '功法阁',
    description: '藏经阁深处，数部功法玉简陈列。你可择一修习，或兼览概要。',
    weight: 9,
    years: 2,
    once: true,
    conditions: [{ type: 'realm', min: 'qi_refining_2' }],
    choices: [
      {
        id: 'sword',
        text: '修习剑诀',
        effects: [
          { type: 'technique', name: '青云剑诀' },
          { type: 'cultivation', value: 12 },
          { type: 'stat', key: 'comprehension', value: 4 },
        ],
      },
      {
        id: 'body_art',
        text: '修习炼体功法',
        effects: [
          { type: 'technique', name: '龙象霸体功' },
          { type: 'stat', key: 'rootBone', value: 5 },
          { type: 'cultivationPath', path: 'body' },
          { type: 'flag', key: 'body_path', value: true },
        ],
      },
      {
        id: 'spell',
        text: '修习法术心法',
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
