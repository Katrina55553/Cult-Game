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
              { type: 'bloodlineTier', value: 1 },
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
              { type: 'bloodlineTier', value: 1 },
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
              { type: 'divineWeaponTier', value: 1 },
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
          { type: 'divineWeaponTier', value: 1 },
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
          { type: 'techniqueTier', value: 1 },
          { type: 'swordTier', value: 1 },
          { type: 'cultivation', value: 12 },
          { type: 'stat', key: 'comprehension', value: 4 },
        ],
      },
      {
        id: 'body_art',
        text: '取炼体功法，苦修不辍',
        effects: [
          { type: 'technique', name: '龙象霸体功' },
          { type: 'techniqueTier', value: 1 },
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
          { type: 'techniqueTier', value: 1 },
          { type: 'divineSense', value: 8 },
          { type: 'cultivationPath', path: 'law' },
          { type: 'flag', key: 'law_path', value: true },
        ],
      },
    ],
  },
  {
    id: 'sword_enlightenment',
    title: '剑意初悟',
    description:
      '你于悬崖之巅静坐，观山风呼啸、飞瀑倾泻。忽然心中一动，似有剑意自天道中涌来。你拔剑起舞，剑光如水，一招一式渐入佳境。',
    weight: 10,
    years: 2,
    maxTimes: 3,
    cooldown: 6,
    choices: [
      {
        id: 'comprehend',
        text: '沉浸剑意，细细领悟',
        outcomes: [
          {
            chance: 0.55,
            luckBonus: 0.004,
            successEffects: [
              { type: 'swordTier', value: 1 },
              { type: 'cultivation', value: 12 },
              { type: 'stat', key: 'comprehension', value: 4 },
            ],
            failEffects: [
              { type: 'cultivation', value: 5 },
              { type: 'stat', key: 'comprehension', value: 2 },
            ],
            narrative: {
              success: '你悟得一丝剑意，剑道修为大进。剑光过处，落叶纷飞。',
              fail: '剑意稍纵即逝，你未能完全领悟，但对剑道的理解略有加深。',
            },
          },
        ],
      },
      {
        id: 'force',
        text: '强行催动剑意',
        outcomes: [
          {
            chance: 0.35,
            luckBonus: 0.005,
            successEffects: [
              { type: 'swordTier', value: 1 },
              { type: 'cultivation', value: 18 },
              { type: 'stat', key: 'rootBone', value: 3 },
            ],
            failEffects: [
              { type: 'lifespan', value: -5 },
              { type: 'stat', key: 'demonHeart', value: 5 },
            ],
            narrative: {
              success: '你以强横意志催动剑意，竟突破瓶颈，剑道大进。',
              fail: '强行催动导致剑气反噬，你受了轻伤。',
            },
          },
        ],
      },
      {
        id: 'observe',
        text: '静观山川，不急于领悟',
        effects: [
          { type: 'stat', key: 'comprehension', value: 3 },
          { type: 'cultivation', value: 5 },
        ],
      },
    ],
  },
  {
    id: 'sword_trial',
    title: '剑阵试炼',
    description:
      '古籍中记载的剑阵浮现于前，千柄虚影剑悬浮半空，剑气纵横交错。你必须以剑道修为破阵，方能获得剑阵中的传承。',
    weight: 7,
    years: 2,
    once: true,
    conditions: [{ type: 'swordTier', min: 1 }],
    choices: [
      {
        id: 'break_sword_trial',
        text: '以剑破阵',
        outcomes: [
          {
            chance: 0.45,
            luckBonus: 0.005,
            successEffects: [
              { type: 'swordTier', value: 1 },
              { type: 'cultivation', value: 20 },
              { type: 'stat', key: 'rootBone', value: 5 },
            ],
            failEffects: [
              { type: 'lifespan', value: -8 },
              { type: 'cultivation', value: 8 },
            ],
            narrative: {
              success: '你以精妙剑法破开剑阵，获得剑道传承，剑意更上一层。',
              fail: '剑阵威力超乎想象，你虽未能破阵，却在搏杀中领悟了不少。',
            },
          },
        ],
      },
      {
        id: 'study_sword_trial',
        text: '参悟剑阵中的剑意',
        effects: [
          { type: 'swordTier', value: 1 },
          { type: 'stat', key: 'comprehension', value: 5 },
        ],
      },
    ],
  },
  {
    id: 'bloodline_resonance',
    title: '血脉共鸣',
    description:
      '体内沉寂的血脉忽然沸腾，一股古老的力量自血脉深处涌来。你感到身体正在发生蜕变，血脉之力正在觉醒更深层的力量。',
    weight: 8,
    years: 2,
    maxTimes: 2,
    cooldown: 8,
    conditions: [{ type: 'bloodlineTier', min: 1 }],
    choices: [
      {
        id: 'guide_bloodline',
        text: '引导血脉之力',
        outcomes: [
          {
            chance: 0.5,
            luckBonus: 0.004,
            successEffects: [
              { type: 'bloodlineTier', value: 1 },
              { type: 'stat', key: 'rootBone', value: 5 },
              { type: 'cultivation', value: 15 },
            ],
            failEffects: [
              { type: 'stat', key: 'demonHeart', value: 8 },
              { type: 'lifespan', value: -5 },
            ],
            narrative: {
              success: '你成功引导血脉之力，血脉纯度提升，肉身更加强横。',
              fail: '血脉之力过于狂暴，你险些失控，心魔趁虚而入。',
            },
          },
        ],
      },
      {
        id: 'suppress_bloodline',
        text: '压制血脉躁动',
        effects: [
          { type: 'stat', key: 'demonHeart', value: -5 },
          { type: 'stat', key: 'rootBone', value: 2 },
        ],
      },
    ],
  },
  {
    id: 'weapon_reforge',
    title: '神兵重铸',
    description:
      '你得到一块罕见的天外陨铁，此物蕴含星辰之力，是重铸神兵的绝佳材料。若能以此提升已有法宝的品质，威力必将大增。',
    weight: 7,
    years: 2,
    maxTimes: 2,
    cooldown: 8,
    conditions: [{ type: 'divineWeaponTier', min: 1 }],
    choices: [
      {
        id: 'reforge',
        text: '以陨铁重铸神兵',
        outcomes: [
          {
            chance: 0.45,
            luckBonus: 0.005,
            successEffects: [
              { type: 'divineWeaponTier', value: 1 },
              { type: 'cultivation', value: 12 },
            ],
            failEffects: [
              { type: 'stat', key: 'demonHeart', value: 5 },
              { type: 'spiritStones', value: -15, set: false },
            ],
            narrative: {
              success: '神兵重铸成功，品质大进，威能更胜从前。',
              fail: '重铸失败，材料尽毁，你白白浪费了一块天外陨铁。',
            },
          },
        ],
      },
      {
        id: 'study_weapon',
        text: '参悟陨铁中的星辰之力',
        effects: [
          { type: 'stat', key: 'comprehension', value: 5 },
          { type: 'divineWeaponTier', value: 1 },
        ],
      },
    ],
  },
  {
    id: 'technique_fusion',
    title: '功法融合',
    description:
      '你修炼多年，所学功法渐多，忽然领悟到万法归一之理。若能将所学功法融会贯通，必能突破现有境界。',
    weight: 7,
    years: 2,
    maxTimes: 2,
    cooldown: 8,
    conditions: [{ type: 'techniqueTier', min: 1 }],
    choices: [
      {
        id: 'merge',
        text: '闭关融合功法',
        outcomes: [
          {
            chance: 0.45,
            luckBonus: 0.005,
            successEffects: [
              { type: 'techniqueTier', value: 1 },
              { type: 'cultivation', value: 18 },
              { type: 'stat', key: 'comprehension', value: 6 },
            ],
            failEffects: [
              { type: 'cultivation', value: 8 },
              { type: 'stat', key: 'demonHeart', value: 5 },
            ],
            narrative: {
              success: '你成功融合功法，领悟万法归一之理，功法修为大进。',
              fail: '功法冲突导致灵气紊乱，你不得不中止融合。',
            },
          },
        ],
      },
      {
        id: 'partial_merge',
        text: '只融合部分功法',
        effects: [
          { type: 'techniqueTier', value: 1 },
          { type: 'cultivation', value: 10 },
        ],
      },
    ],
  },
  {
    id: 'talent_combat',
    title: '天赋觉醒·战',
    description:
      '突破之际，你体内涌起一股战斗本能。天地灵气在你经脉中流转，凝聚成一种与生俱来的天赋之力。你必须选择一种天赋来强化自身。',
    weight: 15,
    years: 0,
    once: true,
    conditions: [{ type: 'realm', min: 'qi_refining_1' }],
    choices: [
      {
        id: 'sword_heart',
        text: '剑心通明 — 剑道事件成功率 +15%',
        effects: [
          { type: 'flag', key: 'talent_sword_heart', value: true },
          { type: 'stat', key: 'comprehension', value: 3 },
        ],
      },
      {
        id: 'iron_body',
        text: '铜皮铁骨 — 根骨 +8',
        effects: [
          { type: 'flag', key: 'talent_iron_body', value: true },
          { type: 'stat', key: 'rootBone', value: 8 },
        ],
      },
      {
        id: 'quick_reflexes',
        text: '身手敏捷 — 战斗事件成功率 +10%',
        effects: [
          { type: 'flag', key: 'talent_quick_reflexes', value: true },
          { type: 'stat', key: 'rootBone', value: 4 },
        ],
      },
    ],
  },
  {
    id: 'talent_utility',
    title: '天赋觉醒·道',
    description:
      '突破之际，你对天地之道有了更深的领悟。丹道、阵法、灵兽之道在你脑海中流转，你必须选择一种来深化修炼。',
    weight: 15,
    years: 0,
    once: true,
    conditions: [{ type: 'realm', min: 'qi_refining_1' }],
    choices: [
      {
        id: 'alchemy_nose',
        text: '丹道灵觉 — 炼丹事件成功率 +15%',
        effects: [
          { type: 'flag', key: 'talent_alchemy_nose', value: true },
          { type: 'stat', key: 'comprehension', value: 3 },
        ],
      },
      {
        id: 'formation_eye',
        text: '阵法慧眼 — 阵法事件成功率 +15%',
        effects: [
          { type: 'flag', key: 'talent_formation_eye', value: true },
          { type: 'stat', key: 'comprehension', value: 3 },
        ],
      },
      {
        id: 'beast_whisper',
        text: '万兽亲和 — 灵兽事件成功率 +15%',
        effects: [
          { type: 'flag', key: 'talent_beast_whisper', value: true },
          { type: 'stat', key: 'luck', value: 3 },
        ],
      },
    ],
  },
  {
    id: 'talent_fate',
    title: '天赋觉醒·命',
    description:
      '突破之际，你感应到命运之线的牵引。福祸相依，气运流转，你必须选择一种与命运相关的天赋。',
    weight: 15,
    years: 0,
    once: true,
    conditions: [{ type: 'realm', min: 'qi_refining_1' }],
    choices: [
      {
        id: 'golden_luck',
        text: '天降鸿运 — 气运 +10',
        effects: [
          { type: 'flag', key: 'talent_golden_luck', value: true },
          { type: 'stat', key: 'luck', value: 10 },
        ],
      },
      {
        id: 'fate_weaver',
        text: '命运编织 — 所有概率型事件 +5%',
        effects: [
          { type: 'flag', key: 'talent_fate_weaver', value: true },
          { type: 'stat', key: 'luck', value: 5 },
        ],
      },
      {
        id: 'longevity',
        text: '长生体质 — 寿元 +20',
        effects: [
          { type: 'flag', key: 'talent_longevity', value: true },
          { type: 'lifespan', value: 20 },
        ],
      },
    ],
  },
]
