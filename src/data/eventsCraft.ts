import type { GameEvent } from '../types/game'

export const CRAFT_EVENTS: GameEvent[] = [
  {
    id: 'alchemy_competition',
    title: '丹道比试',
    description:
      '坊市举办丹道大会，各方丹师齐聚一堂比试炼丹之术。你虽非专职丹师，却也想一试身手。对手中有名震一方的老丹师，也有天赋异禀的年轻丹修。',
    weight: 7,
    years: 1,
    once: true,
    choices: [
      {
        id: 'enter_comp',
        text: '参加丹道比试',
        requirements: [{ type: 'alchemyTier', min: 1 }],
        outcomes: [
          {
            chance: 0.4,
            luckBonus: 0.005,
            successEffects: [
              { type: 'alchemyTier', value: 1 },
              { type: 'spiritStones', value: 40 },
              { type: 'stat', key: 'comprehension', value: 5 },
            ],
            failEffects: [
              { type: 'stat', key: 'comprehension', value: 3 },
              { type: 'alchemyTier', value: 1 },
            ],
            narrative: {
              success: '你炼出一炉品质上乘的丹药，力压群雄夺得头名，获赐丰厚灵石。',
              fail: '你炼丹经验不足，丹药品质平平。但观摩他人炼丹，丹道见识有所长进。',
            },
          },
        ],
      },
      {
        id: 'watch_comp',
        text: '旁观学习',
        effects: [
          { type: 'alchemyTier', value: 1 },
          { type: 'stat', key: 'comprehension', value: 4 },
        ],
      },
      {
        id: 'skip_comp',
        text: '不感兴趣，转身离去',
        effects: [
          { type: 'cultivation', value: 3 },
        ],
      },
    ],
  },
  {
    id: 'alchemy_mystery',
    title: '丹毒之祸',
    description:
      '你服下一枚来路不明的丹药后，体内灵气突然紊乱，丹毒发作。四肢百骸如被烈火焚烧，必须立即采取措施化解丹毒，否则修为将大幅倒退。',
    weight: 5,
    years: 1,
    once: true,
    conditions: [{ type: 'alchemyTier', min: 1 }],
    choices: [
      {
        id: 'self_detox',
        text: '以丹道知识自行解毒',
        outcomes: [
          {
            chance: 0.55,
            luckBonus: 0.004,
            successEffects: [
              { type: 'alchemyTier', value: 1 },
              { type: 'stat', key: 'comprehension', value: 5 },
              { type: 'cultivation', value: 8 },
            ],
            failEffects: [
              { type: 'lifespan', value: -10 },
              { type: 'stat', key: 'demonHeart', value: 8 },
            ],
            narrative: {
              success: '你以丹道知识化解丹毒，反而因祸得福，对丹道领悟更深。',
              fail: '解毒失败，丹毒侵蚀经脉，你元气大伤。',
            },
          },
        ],
      },
      {
        id: 'seek_help',
        text: '求助宗门丹师',
        effects: [
          { type: 'stat', key: 'karma', value: 5 },
          { type: 'spiritStones', value: -15, set: false },
          { type: 'cultivation', value: 5 },
        ],
      },
      {
        id: 'endure',
        text: '以强横肉身硬抗丹毒',
        requirements: [{ type: 'stat', key: 'rootBone', min: 45 }],
        effects: [
          { type: 'stat', key: 'rootBone', value: 4 },
          { type: 'lifespan', value: -5 },
        ],
      },
    ],
  },
  {
    id: 'puppet_workshop',
    title: '傀儡工坊',
    description:
      '你发现一处隐秘的傀儡工坊，四周摆满了各种机关零件和半成品傀儡。工坊主人是一位白发苍苍的老者，他正专注地为一尊傀儡雕刻符文。见你到来，他头也不抬：「想学傀儡术？先帮我搬三天木头。」',
    weight: 7,
    years: 1,
    once: true,
    choices: [
      {
        id: 'learn_puppet',
        text: '老老实实搬了三天木头',
        effects: [
          { type: 'stat', key: 'comprehension', value: 5 },
          { type: 'stat', key: 'rootBone', value: 3 },
          { type: 'flag', key: 'learned_puppet', value: true },
        ],
      },
      {
        id: 'show_talent',
        text: '展示你对符文的理解',
        requirements: [{ type: 'formationTier', min: 1 }],
        effects: [
          { type: 'formationTier', value: 1 },
          { type: 'stat', key: 'comprehension', value: 6 },
          { type: 'flag', key: 'learned_puppet', value: true },
        ],
      },
      {
        id: 'steal_puppet',
        text: '趁老者不备偷走一尊傀儡',
        outcomes: [
          {
            chance: 0.3,
            luckBonus: 0.004,
            successEffects: [
              { type: 'artifact', id: 'stolen_puppet', name: '偷来的傀儡' },
              { type: 'stat', key: 'demonHeart', value: 8 },
            ],
            failEffects: [
              { type: 'lifespan', value: -8 },
              { type: 'stat', key: 'karma', value: -15 },
            ],
            narrative: {
              success: '你趁老者打盹偷走一尊傀儡，悄然离去。',
              fail: '老者早已察觉，一道禁制将你定在原地，你被狠狠教训了一顿。',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'puppet_duel',
    title: '傀儡斗法',
    description:
      '傀儡工坊老者要考校你的傀儡术。他放出三尊不同等级的傀儡，让你选一尊与之对战。这是一场以傀儡术定胜负的比试。',
    weight: 7,
    years: 1,
    once: true,
    conditions: [{ type: 'flag', key: 'learned_puppet', value: true }],
    choices: [
      {
        id: 'fight_basic',
        text: '挑战初阶傀儡',
        effects: [
          { type: 'cultivation', value: 12 },
          { type: 'stat', key: 'comprehension', value: 4 },
          { type: 'artifact', id: 'basic_puppet', name: '初阶傀儡' },
        ],
      },
      {
        id: 'fight_mid',
        text: '挑战中阶傀儡',
        outcomes: [
          {
            chance: 0.5,
            luckBonus: 0.005,
            successEffects: [
              { type: 'artifact', id: 'mid_puppet', name: '中阶傀儡' },
              { type: 'cultivation', value: 18 },
              { type: 'stat', key: 'comprehension', value: 6 },
            ],
            failEffects: [
              { type: 'cultivation', value: 8 },
              { type: 'stat', key: 'demonHeart', value: 3 },
            ],
            narrative: {
              success: '你操控傀儡击败中阶傀儡，老者赞许地点头。',
              fail: '中阶傀儡攻击凶猛，你的傀儡被击碎，但你学到了不少。',
            },
          },
        ],
      },
      {
        id: 'skip_duel',
        text: '不比了，继续学习',
        effects: [
          { type: 'stat', key: 'comprehension', value: 3 },
        ],
      },
    ],
  },
  {
    id: 'artifact_reforge',
    title: '法宝重铸',
    description:
      '你得到一块罕见的天外陨铁，此物蕴含星辰之力，是重铸法宝的绝佳材料。炼器师说若能找到合适的辅材，可将你的法宝品质提升一个档次。',
    weight: 7,
    years: 1,
    choices: [
      {
        id: 'reforge_weapon',
        text: '以陨铁重铸本命法宝',
        requirements: [{ type: 'divineWeaponTier', min: 1 }],
        outcomes: [
          {
            chance: 0.5,
            luckBonus: 0.005,
            successEffects: [
              { type: 'divineWeaponTier', value: 1 },
              { type: 'cultivation', value: 15 },
              { type: 'stat', key: 'rootBone', value: 3 },
            ],
            failEffects: [
              { type: 'stat', key: 'demonHeart', value: 5 },
              { type: 'spiritStones', value: -15, set: false },
            ],
            narrative: {
              success: '法宝重铸成功，品质大进，威能更胜从前。',
              fail: '重铸失败，材料尽毁，你白白浪费了一块天外陨铁。',
            },
          },
        ],
      },
      {
        id: 'forge_new',
        text: '请炼器师打造新法宝',
        requirements: [{ type: 'resource', key: 'spiritStones', min: 30 }],
        effects: [
          { type: 'spiritStones', value: -30 },
          { type: 'divineWeaponTier', value: 1 },
          { type: 'artifact', id: 'reforged_weapon', name: '重铸法宝' },
        ],
      },
      {
        id: 'sell_iron',
        text: '将陨铁高价出售',
        effects: [
          { type: 'spiritStones', value: 40 },
        ],
      },
    ],
  },
  {
    id: 'artifact_spirit',
    title: '器灵觉醒',
    description:
      '你的法宝在一次战斗中忽然发出耀眼光芒，似有器灵觉醒。器灵化作一团灵光，在你面前凝聚成形。「主人，我已沉睡千年，今日终于苏醒。」',
    weight: 5,
    years: 2,
    once: true,
    rarity: 'rare',
    conditions: [{ type: 'divineWeaponTier', min: 2 }],
    choices: [
      {
        id: 'commune_spirit',
        text: '与器灵交流',
        effects: [
          { type: 'cultivation', value: 20 },
          { type: 'stat', key: 'comprehension', value: 8 },
          { type: 'divineWeaponTier', value: 1 },
        ],
      },
      {
        id: 'suppress_spirit',
        text: '压制器灵，不让它干扰',
        effects: [
          { type: 'stat', key: 'demonHeart', value: 5 },
          { type: 'cultivation', value: 10 },
        ],
      },
    ],
  },
  {
    id: 'artifact_competition',
    title: '炼器大会',
    description:
      '修真界百年一度的炼器大会召开，各方炼器大师齐聚一堂。你也受邀参加，展示自己的炼器造诣。大会设有三个奖项：最佳法宝、最佳创意、最佳新人。',
    weight: 6,
    years: 2,
    once: true,
    conditions: [{ type: 'divineWeaponTier', min: 1 }],
    choices: [
      {
        id: 'compete_best',
        text: '竞争最佳法宝奖',
        outcomes: [
          {
            chance: 0.4,
            luckBonus: 0.005,
            successEffects: [
              { type: 'spiritStones', value: 50 },
              { type: 'divineWeaponTier', value: 1 },
              { type: 'stat', key: 'comprehension', value: 5 },
            ],
            failEffects: [
              { type: 'stat', key: 'comprehension', value: 3 },
              { type: 'divineWeaponTier', value: 1 },
            ],
            narrative: {
              success: '你的法宝力压群雄，夺得最佳法宝奖。名声大噪。',
              fail: '高手如云，你的法宝虽不错但未能获奖。但观摩他人作品，炼器造诣有所提升。',
            },
          },
        ],
      },
      {
        id: 'compete_creative',
        text: '竞争最佳创意奖',
        effects: [
          { type: 'stat', key: 'comprehension', value: 6 },
          { type: 'divineWeaponTier', value: 1 },
          { type: 'spiritStones', value: 20 },
        ],
      },
      {
        id: 'watch_competition',
        text: '旁观学习',
        effects: [
          { type: 'stat', key: 'comprehension', value: 5 },
          { type: 'divineWeaponTier', value: 1 },
        ],
      },
    ],
  },
  {
    id: 'puppet_army',
    title: '傀儡军团',
    description:
      '你在古战场发现了一处傀儡军团的遗迹。数百尊傀儡整齐排列，虽已残破但仍可修复。若能修复这些傀儡，你将拥有一支强大的傀儡军团。',
    weight: 5,
    years: 2,
    once: true,
    rarity: 'rare',
    conditions: [
      { type: 'flag', key: 'learned_puppet', value: true },
      { type: 'realm', min: 'foundation' },
    ],
    choices: [
      {
        id: 'repair_army',
        text: '尝试修复傀儡军团',
        outcomes: [
          {
            chance: 0.35,
            luckBonus: 0.006,
            successEffects: [
              { type: 'artifact', id: 'puppet_army', name: '傀儡军团' },
              { type: 'cultivation', value: 25 },
              { type: 'stat', key: 'comprehension', value: 8 },
            ],
            failEffects: [
              { type: 'lifespan', value: -10 },
              { type: 'stat', key: 'demonHeart', value: 5 },
            ],
            narrative: {
              success: '你成功修复了部分傀儡，组成了一支小型傀儡军团。',
              fail: '傀儡年代久远，修复过程中发生爆炸，你被炸伤。',
            },
          },
        ],
      },
      {
        id: 'study_army',
        text: '研究傀儡制造技术',
        effects: [
          { type: 'stat', key: 'comprehension', value: 8 },
          { type: 'formationTier', value: 1 },
          { type: 'cultivation', value: 12 },
        ],
      },
      {
        id: 'salvage_army',
        text: '拆解傀儡取零件出售',
        effects: [
          { type: 'spiritStones', value: 35 },
        ],
      },
    ],
  },
  {
    id: 'rare_ingredient',
    title: '灵药奇遇',
    description:
      '深山幽谷中发现一株千年灵芝，周围灵气浓郁得化为雾气。但灵芝旁盘踞着一条赤鳞蟒蛇，蛇身粗如水桶，吐信嘶嘶。此等灵药若炼成丹药，定能修为大进。',
    weight: 8,
    years: 1,
    once: true,
    act: 'qi',
    choices: [
      {
        id: 'fight_snake',
        text: '斩蛇取药',
        outcomes: [
          {
            chance: 0.5,
            luckBonus: 0.004,
            successEffects: [
              { type: 'alchemyTier', value: 1 },
              { type: 'cultivation', value: 15 },
              { type: 'stat', key: 'rootBone', value: 3 },
            ],
            failEffects: [
              { type: 'lifespan', value: -8 },
              { type: 'stat', key: 'demonHeart', value: 5 },
            ],
            narrative: {
              success: '你以凌厉剑法斩杀蟒蛇，采得千年灵芝。以此入药，丹道修为大进。',
              fail: '蟒蛇剧毒无比，你虽逃脱却被咬伤，灵芝也未能采到。',
            },
          },
        ],
      },
      {
        id: 'negotiate_snake',
        text: '以灵石与蟒蛇交换',
        requirements: [{ type: 'resource', key: 'spiritStones', min: 20 }],
        effects: [
          { type: 'spiritStones', value: -20 },
          { type: 'alchemyTier', value: 1 },
          { type: 'cultivation', value: 12 },
        ],
      },
      {
        id: 'leave_ingredient',
        text: '此物有主，不强求',
        effects: [
          { type: 'stat', key: 'karma', value: 8 },
          { type: 'stat', key: 'luck', value: 3 },
        ],
      },
    ],
  },
  {
    id: 'pill_recipe',
    title: '古丹残方',
    description:
      '在一处废弃的丹房中发现半卷古丹方，记载着一种名为「洗髓丹」的奇效丹药。丹方残缺不全，但你隐约能推演出缺失的部分。若能炼成，可脱胎换骨。',
    weight: 6,
    years: 1,
    once: true,
    act: 'qi',
    choices: [
      {
        id: 'refine_recipe',
        text: '闭关推演丹方并炼制',
        outcomes: [
          {
            chance: 0.35,
            luckBonus: 0.005,
            successEffects: [
              { type: 'alchemyTier', value: 1 },
              { type: 'stat', key: 'rootBone', value: 6 },
              { type: 'stat', key: 'comprehension', value: 4 },
              { type: 'cultivation', value: 12 },
            ],
            failEffects: [
              { type: 'stat', key: 'demonHeart', value: 5 },
              { type: 'cultivation', value: 5 },
            ],
            narrative: {
              success: '你推演出完整丹方，炼出洗髓丹。服下后经脉通畅，根骨大进。',
              fail: '丹方残缺太多，你推演失误，炸炉了。虽有收获却也心魔暗生。',
            },
          },
        ],
      },
      {
        id: 'study_recipe',
        text: '只研读丹方不急于炼制',
        effects: [
          { type: 'alchemyTier', value: 1 },
          { type: 'stat', key: 'comprehension', value: 6 },
        ],
      },
      {
        id: 'sell_recipe',
        text: '将丹方卖给坊市丹铺',
        effects: [
          { type: 'spiritStones', value: 25 },
          { type: 'stat', key: 'karma', value: -3 },
        ],
      },
    ],
  },
  {
    id: 'forge_fire',
    title: '地火熔炉',
    description:
      '火山深处发现一座天然地火熔炉，炉火纯青，温度极高。此乃炼器圣地，若能以此地火锻造法宝，品质定当不凡。但地火凶猛，稍有不慎便会被灼伤。',
    weight: 7,
    years: 2,
    once: true,
    act: 'foundation',
    choices: [
      {
        id: 'forge_weapon',
        text: '以地火锻造本命法宝',
        outcomes: [
          {
            chance: 0.4,
            luckBonus: 0.005,
            successEffects: [
              { type: 'divineWeapon', id: 'fire_forged_blade', name: '地火玄刃' },
              { type: 'divineWeaponTier', value: 1 },
              { type: 'cultivation', value: 15 },
            ],
            failEffects: [
              { type: 'lifespan', value: -10 },
              { type: 'stat', key: 'demonHeart', value: 8 },
            ],
            narrative: {
              success: '你以地火淬炼七日七夜，终于铸成一柄品质上乘的法宝，地火认主。',
              fail: '地火失控，你被灼伤数处经脉，锻造的法宝也碎裂报废。',
            },
          },
        ],
      },
      {
        id: 'refine_existing',
        text: '以地火淬炼已有法宝',
        requirements: [{ type: 'stat', key: 'rootBone', min: 40 }],
        effects: [
          { type: 'cultivation', value: 12 },
          { type: 'stat', key: 'rootBone', value: 3 },
        ],
      },
      {
        id: 'study_fire',
        text: '参悟地火之理',
        effects: [
          { type: 'stat', key: 'comprehension', value: 6 },
          { type: 'cultivation', value: 8 },
        ],
      },
    ],
  },
  {
    id: 'weapon_material',
    title: '天材地宝',
    description:
      '你偶然得到一块天外陨铁，其中蕴含星辰之力。此乃炼器至宝，若能找到合适的炼器师，定能铸成一件威力不凡的法宝。但你也可以自己尝试锻造。',
    weight: 6,
    years: 1,
    once: true,
    choices: [
      {
        id: 'self_forge',
        text: '自己动手锻造',
        outcomes: [
          {
            chance: 0.35,
            luckBonus: 0.005,
            successEffects: [
              { type: 'artifact', id: 'star_iron_sword', name: '星辰铁剑' },
              { type: 'cultivation', value: 12 },
            ],
            failEffects: [
              { type: 'stat', key: 'demonHeart', value: 5 },
              { type: 'spiritStones', value: -10, set: false },
            ],
            narrative: {
              success: '你以陨铁铸成一柄星辰铁剑，剑身星光流转，威力不凡。',
              fail: '锻造失败，陨铁碎裂，你白白浪费了一块天材地宝。',
            },
          },
        ],
      },
      {
        id: 'hire_forge',
        text: '请炼器师代为锻造',
        requirements: [{ type: 'resource', key: 'spiritStones', min: 30 }],
        effects: [
          { type: 'spiritStones', value: -30 },
          { type: 'artifact', id: 'star_iron_weapon', name: '星辰法宝' },
        ],
      },
      {
        id: 'sell_material',
        text: '将陨铁高价出售',
        effects: [
          { type: 'spiritStones', value: 45 },
          { type: 'stat', key: 'karma', value: -3 },
        ],
      },
    ],
  },
]
