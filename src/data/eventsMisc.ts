import type { GameEvent } from '../types/game'

export const MISC_EVENTS: GameEvent[] = [
  {
    id: 'immortal_guidance',
    title: '仙人指路',
    description: '云霭之中忽现一老者虚影，笑谓尔根骨清奇，愿授一条通天之径。语声未歇，周遭天地灵气骤然凝若实质。',
    weight: 4,
    years: 2,
    once: true,
    act: 'qi',
    rarity: 'legendary',
    choices: [
      {
        id: 'accept',
        text: '恭聆仙谕',
        hint: '气运加成 · 修为大涨',
        outcomes: [
          {
            chance: 0.7,
            luckBonus: 0.005,
            successEffects: [
              { type: 'cultivation', value: 35 },
              { type: 'stat', key: 'comprehension', value: 10 },
              { type: 'stat', key: 'luck', value: 8 },
            ],
            failEffects: [{ type: 'stat', key: 'demonHeart', value: 5 }],
            narrative: {
              success: '仙人口授真诀，修为一日千里，道心豁然贯通。',
              fail: '真诀玄奥难参，你仅悟得十之一二，心魔暗生。',
            },
          },
        ],
      },
      {
        id: 'decline',
        text: '婉辞仙缘',
        narrative: '你躬身谢过仙人，宁凭己身悟道。老者抚须含笑，身形渐散于云霭之中。',
        effects: [{ type: 'stat', key: 'karma', value: 8 }, { type: 'cultivation', value: 8 }],
      },
    ],
  },
  {
    id: 'past_life_memory',
    title: '前世记忆',
    description: '入定之际，前世残影纷涌灌入识海。尔前世莫非大能转世，抑或仅是南柯一梦？',
    weight: 3,
    years: 3,
    once: true,
    act: 'foundation',
    rarity: 'legendary',
    choices: [
      {
        id: 'embrace',
        text: '接纳宿忆，融归己身',
        hint: '有风险 · 悟性或心魔',
        outcomes: [
          {
            chance: 0.5,
            successEffects: [
              { type: 'stat', key: 'comprehension', value: 20 },
              { type: 'cultivation', value: 30 },
              { type: 'flag', key: 'got_inheritance', value: true },
              { type: 'flag', key: 'past_life_chosen', value: true },
            ],
            failEffects: [
              { type: 'stat', key: 'demonHeart', value: 25 },
              { type: 'lifespan', value: -15 },
            ],
            narrative: {
              success: '前世感悟如醍醐灌顶，你之道基愈发深厚。',
              fail: '宿忆冲击神识，心魔大炽，寿元折损。',
            },
          },
        ],
      },
      {
        id: 'seal',
        text: '封印残念，专注今生',
        narrative: '你将前世杂念尽数封禁，道心愈显澄明坚定。',
        effects: [
          { type: 'stat', key: 'demonHeart', value: -15 },
          { type: 'cultivation', value: 15 },
        ],
      },
    ],
  },
  {
    id: 'upper_realm_rumor',
    title: '上界传闻',
    description: '玉简传讯：上界遣使将临凡间遴选衣钵传人。此乃千载难逢之机，亦恐是夺命陷阱。',
    weight: 8,
    years: 2,
    once: true,
    act: 'golden',
    rarity: 'rare',
    requiresUnlock: 'upper_realm_rumor',
    conditions: [{ type: 'realm', min: 'golden_core' }],
    choices: [
      {
        id: 'seek',
        text: '主动求见仙使',
        outcomes: [
          {
            chance: 0.45,
            successEffects: [
              { type: 'cultivation', value: 40 },
              { type: 'flag', key: 'got_inheritance', value: true },
              { type: 'lifespan', value: 50 },
            ],
            failEffects: [{ type: 'lifespan', value: -20 }],
            narrative: {
              success: '仙使赐你仙缘印记，寿元大增。',
              fail: '仙使试探心性，你未能通过考较，寿元大损。',
            },
          },
        ],
      },
      {
        id: 'ignore',
        text: '不为所动',
        effects: [{ type: 'stat', key: 'comprehension', value: 8 }],
      },
    ],
  },
  {
    id: 'combo_art',
    title: '合击秘法',
    description: '你与道侣闭关数月，共研合击之术。若能大成，可越阶克敌；若有差池，则双双遭反噬。',
    weight: 14,
    once: true,
    act: 'golden',
    conditions: [
      { type: 'flag', key: 'has_companion', value: true },
      { type: 'flag', key: 'dual_cultivation_mastered', value: true },
    ],
    choices: [
      {
        id: 'create',
        text: '共创秘法',
        outcomes: [
          {
            chance: 0.6,
            successEffects: [
              { type: 'cultivation', value: 35 },
              { type: 'flag', key: 'combo_art_mastered', value: true },
              { type: 'artifact', id: 'combo_scroll', name: '合击秘卷' },
            ],
            failEffects: [
              { type: 'lifespan', value: -15 },
              { type: 'stat', key: 'demonHeart', value: 10 },
            ],
            narrative: {
              success: '合击秘法终得大成，二人联手可越阶一战。',
              fail: '秘法反噬，双双负伤。',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'stray_scripture',
    title: '残碑秘文',
    description: '山野古道旁，半截残碑没于荒草，上刻残缺功法。风过碑裂，灵光乍现。',
    weight: 8,
    years: 1,
    once: true,
    rarity: 'rare',
    choices: [
      {
        id: 'study',
        text: '参悟碑文',
        outcomes: [
          {
            chance: 0.65,
            successEffects: [
              { type: 'stat', key: 'comprehension', value: 6 },
              { type: 'cultivation', value: 12 },
            ],
            failEffects: [{ type: 'stat', key: 'demonHeart', value: 5 }],
            narrative: {
              success: '碑文残意入心，你悟性精进。',
              fail: '碑文残缺难辨，参悟无果，道心微生烦躁。',
            },
          },
        ],
      },
      {
        id: 'rub',
        text: '拓印带走',
        narrative: '你将碑文细心拓下，留待日后慢慢钻研。',
        effects: [
          { type: 'stat', key: 'comprehension', value: 3 },
          { type: 'cultivation', value: 6 },
        ],
      },
    ],
  },
  {
    id: 'roadside_duel',
    title: '路遇斗法',
    description: '两名修士在路边斗法，剑气纵横交错。旁观者议论纷纷，似在以赌注押胜负。',
    weight: 8,
    years: 1,
    cooldown: 5,
    choices: [
      {
        id: 'join',
        text: '出手襄助弱者',
        outcomes: [
          {
            chance: 0.55,
            successEffects: [
              { type: 'cultivation', value: 14 },
              { type: 'stat', key: 'karma', value: 8 },
              { type: 'spiritStones', value: 20 },
            ],
            failEffects: [
              { type: 'lifespan', value: -5 },
              { type: 'stat', key: 'karma', value: 3 },
            ],
            narrative: {
              success: '你助弱者脱困，对方赠灵石以谢。',
              fail: '你勉力取胜却负伤，但问心无愧。',
            },
          },
        ],
      },
      {
        id: 'watch',
        text: '旁观悟剑',
        narrative: '你从二人斗法中悟得几式剑意，修为微增。',
        effects: [
          { type: 'stat', key: 'comprehension', value: 3 },
          { type: 'cultivation', value: 8 },
        ],
      },
    ],
  },
  {
    id: 'misty_valley',
    title: '迷雾深谷',
    description: '你误入迷雾笼罩的深谷，异兽低吟与灵草幽香交织弥漫，凶险与机缘并存。',
    weight: 9,
    years: 2,
    once: true,
    rarity: 'rare',
    choices: [
      {
        id: 'hunt',
        text: '猎兽取丹',
        hint: '约四成得手 · 败则重伤',
        outcomes: [
          {
            chance: 0.4,
            successEffects: [
              { type: 'cultivation', value: 20 },
              { type: 'stat', key: 'rootBone', value: 3 },
              { type: 'lifespan', value: 5 },
            ],
            failEffects: [
              { type: 'lifespan', value: -8 },
              { type: 'stat', key: 'demonHeart', value: 8 },
            ],
            narrative: {
              success: '你斩杀异兽，取丹炼化，体魄更为坚韧。',
              fail: '异兽凶悍异常，你重伤逃出谷外。',
            },
          },
        ],
      },
      {
        id: 'gather',
        text: '采药退走',
        narrative: '你采得数株灵草，见好就收，安然离去。',
        effects: [
          { type: 'flag', key: 'mastered_alchemy', value: true },
          { type: 'cultivation', value: 10 },
          { type: 'spiritStones', value: 15 },
        ],
      },
    ],
  },
  {
    id: 'lucky_stone',
    title: '意外横财',
    description: '雨后溪畔，你无意间踢到一块灵石原矿，灵气外溢，附近似另有异象。',
    weight: 7,
    years: 1,
    once: true,
    rarity: 'rare',
    choices: [
      {
        id: 'dig',
        text: '深挖探查',
        outcomes: [
          {
            chance: 0.45,
            successEffects: [
              { type: 'spiritStones', value: 50 },
              { type: 'cultivation', value: 10 },
            ],
            failEffects: [
              { type: 'spiritStones', value: 10 },
              { type: 'stat', key: 'demonHeart', value: 5 },
            ],
            narrative: {
              success: '你掘出一处小型灵矿，发了一笔横财。',
              fail: '仅挖到零星碎石，还惊扰了一窝毒虫。',
            },
          },
        ],
      },
      {
        id: 'take',
        text: '拾取便走',
        narrative: '你将原矿炼化，得灵石二十枚。',
        effects: [
          { type: 'spiritStones', value: 20 },
          { type: 'cultivation', value: 5 },
        ],
      },
    ],
  },
  {
    id: 'thunder_marsh',
    title: '雷泽遗泽',
    description: '雷雨过后，沼泽深处雷纹未消，似有上古雷法残意蛰伏其间。',
    weight: 8,
    years: 2,
    once: true,
    rarity: 'rare',
    conditions: [{ type: 'realm', min: 'qi_refining_2' }],
    choices: [
      {
        id: 'absorb',
        text: '引雷入体，淬炼经脉',
        hint: '约五成得手 · 败则重伤',
        outcomes: [
          {
            chance: 0.5,
            luckBonus: 0.003,
            successEffects: [
              { type: 'cultivation', value: 22 },
              { type: 'stat', key: 'rootBone', value: 4 },
              { type: 'stat', key: 'demonHeart', value: -5 },
            ],
            failEffects: [
              { type: 'lifespan', value: -10 },
              { type: 'stat', key: 'demonHeart', value: 12 },
            ],
            narrative: {
              success: '雷意贯体，经脉愈发强韧，修为精进。',
              fail: '雷意失控反噬，你重伤退走，心魔暗生。',
            },
          },
        ],
      },
      {
        id: 'collect',
        text: '采集雷纹草后离去',
        narrative: '你采得数株雷纹草，可炼丹备用，修为微增。',
        effects: [
          { type: 'flag', key: 'mastered_alchemy', value: true },
          { type: 'cultivation', value: 10 },
          { type: 'spiritStones', value: 18 },
        ],
      },
    ],
  },
  {
    id: 'soul_ferry',
    title: '古渡遗舟',
    description: '迷雾弥漫的江面上，一叶孤舟无桨自流。舟中老者唤你上船，言可渡你至彼岸秘境。',
    weight: 7,
    years: 2,
    once: true,
    rarity: 'rare',
    choices: [
      {
        id: 'board',
        text: '登舟一探',
        hint: '气运加成 · 有成有败',
        outcomes: [
          {
            chance: 0.55,
            luckBonus: 0.005,
            successEffects: [
              { type: 'cultivation', value: 20 },
              { type: 'stat', key: 'comprehension', value: 8 },
              { type: 'lifespan', value: 8 },
            ],
            failEffects: [
              { type: 'lifespan', value: -6 },
              { type: 'stat', key: 'karma', value: -5 },
            ],
            narrative: {
              success: '舟行至秘境，你悟得几分彼岸真意，寿元微增。',
              fail: '孤舟误入迷津，你耗费寿元方得以脱身归返。',
            },
          },
        ],
      },
      {
        id: 'refuse',
        text: '婉拒登舟',
        narrative: '你守正不移，未上孤舟，道心愈发澄澈。',
        effects: [
          { type: 'stat', key: 'karma', value: 6 },
          { type: 'stat', key: 'demonHeart', value: -4 },
        ],
      },
    ],
  },
  {
    id: 'cloud_crane',
    title: '云海鹤唳',
    description: '云海翻涌如潮，白鹤盘旋长鸣，尾羽洒落点点灵光，恍若在为人引路。',
    weight: 8,
    years: 1,
    once: true,
    rarity: 'rare',
    choices: [
      {
        id: 'follow',
        text: '追随鹤影',
        outcomes: [
          {
            chance: 0.6,
            successEffects: [
              { type: 'stat', key: 'luck', value: 8 },
              { type: 'cultivation', value: 16 },
              { type: 'stat', key: 'comprehension', value: 5 },
            ],
            failEffects: [
              { type: 'cultivation', value: 6 },
              { type: 'stat', key: 'demonHeart', value: 4 },
            ],
            narrative: {
              success: '白鹤引你至灵泉之畔，你饮泉悟道，气运大涨。',
              fail: '鹤影消散于云海之中，你仅拾得些许灵气。',
            },
          },
        ],
      },
      {
        id: 'meditate',
        text: '原地参鹤鸣',
        narrative: '鹤鸣九皋，声闻于天。你静坐参悟，悟性精进。',
        effects: [
          { type: 'stat', key: 'comprehension', value: 6 },
          { type: 'cultivation', value: 8 },
        ],
      },
    ],
  },
  {
    id: 'jade_spring',
    title: '地脉灵泉',
    description: '山腹裂隙之中，一眼灵泉汩汩涌出，地脉灵气浓郁得几近凝为雾霭。',
    weight: 8,
    years: 2,
    once: true,
    act: 'foundation',
    rarity: 'rare',
    conditions: [{ type: 'realm', min: 'foundation' }],
    choices: [
      {
        id: 'bathe',
        text: '浸泡灵泉',
        outcomes: [
          {
            chance: 0.65,
            successEffects: [
              { type: 'cultivation', value: 25 },
              { type: 'lifespan', value: 12 },
              { type: 'stat', key: 'rootBone', value: 3 },
            ],
            failEffects: [
              { type: 'stat', key: 'demonHeart', value: 8 },
              { type: 'cultivation', value: 8 },
            ],
            narrative: {
              success: '灵泉洗筋伐髓，你寿元延长，修为大涨。',
              fail: '灵气过于猛烈，你仅勉强吸收小半，心魔微起。',
            },
          },
        ],
      },
      {
        id: 'seal',
        text: '封泉留待他日',
        narrative: '你记下灵泉方位，留待破境之日再来。',
        effects: [
          { type: 'flag', key: 'cave_marked', value: true },
          { type: 'stat', key: 'comprehension', value: 4 },
        ],
      },
    ],
  },
  {
    id: 'meteor_iron',
    title: '天外陨铁',
    description: '夜空骤亮，陨星坠于荒原，炽热未消，铁中隐约有星纹流转。',
    weight: 7,
    years: 2,
    once: true,
    rarity: 'rare',
    conditions: [{ type: 'realm', min: 'qi_refining_1' }],
    choices: [
      {
        id: 'forge',
        text: '淬炼陨铁',
        hint: '约四成得手 · 败则灼伤',
        outcomes: [
          {
            chance: 0.4,
            successEffects: [
              { type: 'artifact', id: 'meteor_blade', name: '陨星短刃' },
              { type: 'cultivation', value: 15 },
              { type: 'stat', key: 'rootBone', value: 2 },
            ],
            failEffects: [
              { type: 'lifespan', value: -8 },
              { type: 'cultivation', value: -5 },
            ],
            narrative: {
              success: '你淬出一柄陨星短刃，杀伐之气反助修行。',
              fail: '陨铁骤然炸裂，你灼伤倒退，修为受损。',
            },
          },
        ],
      },
      {
        id: 'sell',
        text: '售与炼器师',
        narrative: '炼器师以高价收购陨铁，你获灵石颇丰。',
        effects: [
          { type: 'spiritStones', value: 65 },
          { type: 'cultivation', value: 5 },
        ],
      },
    ],
  },
  {
    id: 'sword_tomb',
    title: '剑冢探秘',
    description:
      '深山之中隐现一座古剑冢，千柄断剑插满山谷，剑气纵横。谷中央一柄完好古剑悬于半空，通体雪白，寒气凛冽。四周刻有古篆：「能入此冢者，当为剑道有缘人。」',
    weight: 5,
    years: 2,
    once: true,
    act: 'qi',
    rarity: 'rare',
    choices: [
      {
        id: 'kneel',
        text: '跪拜古剑，诚心求取',
        effects: [
          { type: 'cultivation', value: 20 },
          { type: 'stat', key: 'comprehension', value: 5 },
          { type: 'swordTier', value: 1 },
          { type: 'flag', key: 'sword_tomb_visited', value: true },
        ],
      },
      {
        id: 'grab',
        text: '强行夺取古剑',
        outcomes: [
          {
            chance: 0.3,
            luckBonus: 0.005,
            successEffects: [
              { type: 'divineWeapon', id: 'frost_sword', name: '寒魄古剑' },
              { type: 'cultivation', value: 10 },
            ],
            failEffects: [
              { type: 'lifespan', value: -8 },
              { type: 'stat', key: 'demonHeart', value: 8 },
            ],
            narrative: {
              success: '你以真元强行收服古剑，寒魄认主，剑气入体。',
              fail: '古剑剑气反噬，你重伤退出剑冢。',
            },
          },
        ],
      },
      {
        id: 'observe',
        text: '静坐观悟千剑剑意',
        effects: [
          { type: 'cultivation', value: 15 },
          { type: 'stat', key: 'comprehension', value: 8 },
        ],
      },
    ],
  },
  {
    id: 'pill_auction',
    title: '丹药拍卖',
    description:
      '坊市中最大的拍卖行今日开拍一炉九品筑基丹，各方势力云集。你囊中羞涩，然机不可失。掌柜瞥你一眼，似觉你颇有几分潜力。',
    weight: 8,
    years: 1,
    once: true,
    act: 'qi',
    choices: [
      {
        id: 'bid',
        text: '倾尽灵石竞拍',
        outcomes: [
          {
            chance: 0.4,
            luckBonus: 0.004,
            successEffects: [
              { type: 'cultivation', value: 25 },
              { type: 'spiritStones', value: -30, set: false },
            ],
            failEffects: [
              { type: 'spiritStones', value: -15, set: false },
              { type: 'stat', key: 'luck', value: -2 },
            ],
            narrative: {
              success: '你倾囊拍得筑基丹，服下后修为大进。',
              fail: '竞价落败，灵石折损不少，只得空手而归。',
            },
          },
        ],
      },
      {
        id: 'work',
        text: '为拍卖行做护卫赚灵石',
        effects: [
          { type: 'spiritStones', value: 20 },
          { type: 'stat', key: 'rootBone', value: 2 },
        ],
      },
      {
        id: 'leave',
        text: '不参与，静心修炼',
        effects: [
          { type: 'cultivation', value: 8 },
          { type: 'stat', key: 'karma', value: 3 },
        ],
      },
    ],
  },
  {
    id: 'hermit_cave',
    title: '隐修洞府',
    description:
      '瀑布之后隐现一处洞府，石壁上刻满修炼心得。一位散修遗骸端坐蒲团之上，面前置有玉简一枚、灵酒一壶。洞府完好无损，似是特意留给后来者。',
    weight: 6,
    years: 1,
    once: true,
    act: 'foundation',
    choices: [
      {
        id: 'jade_slip',
        text: '参悟玉简中的功法',
        effects: [
          { type: 'cultivation', value: 20 },
          { type: 'stat', key: 'comprehension', value: 6 },
        ],
      },
      {
        id: 'wine',
        text: '饮下灵酒',
        outcomes: [
          {
            chance: 0.6,
            luckBonus: 0.003,
            successEffects: [
              { type: 'lifespan', value: 10 },
              { type: 'stat', key: 'rootBone', value: 4 },
            ],
            failEffects: [
              { type: 'stat', key: 'demonHeart', value: 8 },
              { type: 'lifespan', value: -5 },
            ],
            narrative: {
              success: '灵酒入腹，经脉通畅，寿元有所延长。',
              fail: '灵酒已然变质，饮后心魔暗生。',
            },
          },
        ],
      },
      {
        id: 'bury',
        text: '为散修前辈安葬',
        effects: [
          { type: 'stat', key: 'karma', value: 12 },
          { type: 'stat', key: 'luck', value: 4 },
        ],
      },
    ],
  },
  {
    id: 'demon_nest',
    title: '魔巢探查',
    description:
      '村中百姓告急，附近山中出现魔巢，魔物夜夜下山伤人。你循迹而至，见一处洞穴被黑雾笼罩，洞口白骨散落。深处传来低沉嘶吼。',
    weight: 7,
    years: 1,
    once: true,
    act: 'foundation',
    choices: [
      {
        id: 'fight',
        text: '杀入魔巢',
        outcomes: [
          {
            chance: 0.5,
            luckBonus: 0.004,
            successEffects: [
              { type: 'cultivation', value: 18 },
              { type: 'stat', key: 'karma', value: 15 },
              { type: 'spiritStones', value: 25 },
              { type: 'flag', key: 'demon_slayer', value: true },
            ],
            failEffects: [
              { type: 'lifespan', value: -12 },
              { type: 'stat', key: 'demonHeart', value: 10 },
            ],
            narrative: {
              success: '你斩杀魔物首领，村民感恩戴德，因果大增。',
              fail: '魔物凶悍异常，你重伤逃出，元气受损。',
            },
          },
        ],
      },
      {
        id: 'seal',
        text: '以阵法封印魔巢',
        effects: [
          { type: 'formationTier', value: 1 },
          { type: 'stat', key: 'karma', value: 10 },
          { type: 'cultivation', value: 10 },
        ],
      },
      {
        id: 'ignore',
        text: '事不关己，转身离去',
        effects: [
          { type: 'stat', key: 'karma', value: -8 },
          { type: 'stat', key: 'demonHeart', value: 3 },
        ],
      },
    ],
  },
  {
    id: 'star_river',
    title: '星河入梦',
    description:
      '夜观天象之际，你忽觉神识被无形之力牵引，坠入一片璀璨星河。星辰化作文字在眼前流转，竟是一篇上古功法残篇。星河深处似有声音在呼唤你的名字。',
    weight: 4,
    years: 1,
    once: true,
    rarity: 'rare',
    act: 'golden',
    choices: [
      {
        id: 'read',
        text: '记诵功法残篇',
        effects: [
          { type: 'cultivation', value: 25 },
          { type: 'stat', key: 'comprehension', value: 8 },
          { type: 'divineSense', value: 10 },
        ],
      },
      {
        id: 'follow',
        text: '追随声音深入星河',
        outcomes: [
          {
            chance: 0.4,
            luckBonus: 0.006,
            successEffects: [
              { type: 'cultivation', value: 35 },
              { type: 'stat', key: 'comprehension', value: 12 },
              { type: 'flag', key: 'star_river_deep', value: true },
            ],
            failEffects: [
              { type: 'stat', key: 'demonHeart', value: 12 },
              { type: 'cultivation', value: 10 },
            ],
            narrative: {
              success: '你在星河深处悟得大道真谛，神识暴涨。',
              fail: '星河深处心魔幻象丛生，你险些迷失其中。',
            },
          },
        ],
      },
      {
        id: 'wake',
        text: '强行挣脱星河幻境',
        effects: [
          { type: 'stat', key: 'demonHeart', value: -5 },
          { type: 'cultivation', value: 8 },
        ],
      },
    ],
  },
  {
    id: 'spirit_vein',
    title: '灵脉争锋',
    description:
      '你发现一处无主灵脉，灵气浓郁得化为雾霭。然而你并非唯一的发现者——一名散修已在灵脉旁打坐，见你前来，神色不善。',
    weight: 8,
    years: 1,
    maxTimes: 2,
    cooldown: 6,
    act: 'foundation',
    choices: [
      {
        id: 'share_vein',
        text: '提议共享灵脉',
        effects: [
          { type: 'cultivation', value: 15 },
          { type: 'stat', key: 'karma', value: 8 },
        ],
      },
      {
        id: 'fight_vein',
        text: '驱赶散修独占灵脉',
        outcomes: [
          {
            chance: 0.55,
            luckBonus: 0.003,
            successEffects: [
              { type: 'cultivation', value: 25 },
              { type: 'spiritStones', value: 15 },
            ],
            failEffects: [
              { type: 'lifespan', value: -8 },
              { type: 'stat', key: 'karma', value: -10 },
            ],
            narrative: {
              success: '你以实力驱走散修，独占灵脉修炼，修为大进。',
              fail: '散修实力不俗，你二人两败俱伤。',
            },
          },
        ],
      },
      {
        id: 'yield',
        text: '让出灵脉，结个善缘',
        effects: [
          { type: 'stat', key: 'karma', value: 12 },
          { type: 'stat', key: 'luck', value: 5 },
        ],
      },
    ],
  },
  {
    id: 'ancient_formation',
    title: '上古阵法',
    description:
      '荒野之中发现一座上古传送阵残骸，阵纹虽残破犹有微弱灵光流转。阵中央悬浮一枚空间戒指，似是阵法启钥。贸然取戒恐触发阵法反噬。',
    weight: 5,
    years: 1,
    once: true,
    act: 'golden',
    choices: [
      {
        id: 'take',
        text: '冒险取下空间戒指',
        outcomes: [
          {
            chance: 0.4,
            luckBonus: 0.005,
            successEffects: [
              { type: 'spiritStones', value: 80 },
              { type: 'artifact', id: 'spatial_ring', name: '上古空间戒' },
              { type: 'formationTier', value: 1 },
            ],
            failEffects: [
              { type: 'lifespan', value: -15 },
              { type: 'stat', key: 'demonHeart', value: 8 },
            ],
            narrative: {
              success: '你安然取下空间戒，内藏大量灵石与阵法典籍。',
              fail: '阵法反噬，空间裂缝割伤你数道，元气大损。',
            },
          },
        ],
      },
      {
        id: 'study_formation',
        text: '研究阵纹推演阵法',
        effects: [
          { type: 'formationTier', value: 2 },
          { type: 'cultivation', value: 12 },
          { type: 'stat', key: 'comprehension', value: 4 },
        ],
      },
      {
        id: 'leave_formation',
        text: '此地诡异，速速离去',
        effects: [
          { type: 'stat', key: 'luck', value: 2 },
        ],
      },
    ],
  },
  {
    id: 'daily_insight',
    title: '观星悟道',
    description: '夜深人静，你独坐仰观星斗，揣摩天地运行之理。',
    weight: 2,
    years: 1,
    cooldown: 10,
    choices: [
      {
        id: 'contemplate',
        text: '穷理致知',
        narrative: '星斗流转之间，你对道法多有领悟。',
        effects: [
          { type: 'stat', key: 'comprehension', value: 3 },
          { type: 'cultivation', value: 6 },
        ],
      },
      {
        id: 'rest',
        text: '调息养气',
        narrative: '你闭目调息，身心俱宁，寿元微增。',
        effects: [
          { type: 'stat', key: 'demonHeart', value: -2 },
          { type: 'lifespan', value: 2 },
        ],
      },
    ],
  },
  {
    id: 'daily_cultivation',
    title: '静坐吐纳',
    description: '你觅得一处清幽之所，盘膝而坐，吐纳天地灵气以固根基。',
    weight: 3,
    years: 1,
    cooldown: 8,
    choices: [
      {
        id: 'meditate',
        text: '专心打坐',
        narrative: '元气充盈于体，修行日积月累，修为稳步增长。',
        effects: [{ type: 'cultivation', value: 10 }],
      },
      {
        id: 'wander',
        text: '下山历练',
        narrative: '你游历山川，见闻渐广，气运与悟性皆有所增。',
        effects: [
          { type: 'stat', key: 'luck', value: 2 },
          { type: 'stat', key: 'comprehension', value: 2 },
          { type: 'cultivation', value: 5 },
        ],
      },
    ],
  },
  {
    id: 'market_rest',
    title: '坊市小憩',
    description: '修行途中，你驻足坊市歇息。灵石在握，可购丹药符箓以助仙途。',
    weight: 9,
    years: 0,
    cooldown: 4,
    choices: [
      {
        id: 'browse',
        text: '进入坊市（将开启购物）',
        narrative: '你步入坊市，各方宝物琳琅满目。',
      },
      {
        id: 'skip',
        text: '匆匆路过',
        narrative: '你未入坊市，只在街边略作调息，修为微有进益。',
        effects: [{ type: 'cultivation', value: 3 }],
      },
    ],
  },
  {
    id: 'qi_deviation',
    title: '走火入魔',
    description:
      '闭关修炼时急于求成，灵气运转失控，经脉寸寸断裂。你口吐鲜血，意识模糊，体内灵气如脱缰野马四处冲撞。若不及时施救，轻则修为倒退，重则走火入魔。',
    conditions: [{ type: 'cultivation', min: 20 }],
    weight: 10,
    years: 1,
    maxTimes: 2,
    cooldown: 8,
    minGap: 5,
    choices: [
      {
        id: 'self_rescue',
        text: '强运心法自救',
        outcomes: [
          {
            chance: 0.4,
            luckBonus: 0.004,
            successEffects: [
              { type: 'stat', key: 'demonHeart', value: -8 },
              { type: 'cultivation', value: 5 },
            ],
            failEffects: [
              { type: 'cultivation', value: -20 },
              { type: 'stat', key: 'demonHeart', value: 12 },
              { type: 'lifespan', value: -10 },
            ],
            narrative: {
              success: '你以强横意志压制灵气暴走，虽元气受损，却因祸得福，心魔反被压制。',
              fail: '自救失败，灵气暴走更加猛烈，你修为大幅倒退，心魔滋生。',
            },
          },
        ],
      },
      {
        id: 'seek_pill',
        text: '服用保命丹药',
        requirements: [{ type: 'resource', key: 'spiritStones', min: 20 }],
        effects: [
          { type: 'spiritStones', value: -20 },
          { type: 'cultivation', value: -8 },
        ],
      },
      {
        id: 'endure_qi',
        text: '咬牙硬撑',
        outcomes: [
          {
            chance: 0.3,
            luckBonus: 0.005,
            successEffects: [
              { type: 'stat', key: 'rootBone', value: 4 },
              { type: 'cultivation', value: 8 },
            ],
            failEffects: [
              { type: 'lifespan', value: -15 },
              { type: 'cultivation', value: -15 },
            ],
            narrative: {
              success: '你以肉身强扛灵气暴走，经脉虽损，根基却更加坚韧。',
              fail: '你撑不住了，灵气暴走摧毁数条经脉，寿元大损。',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'spirit_stone_theft',
    title: '灵石失窃',
    description:
      '你从闭关中醒来，发现储物袋被人割破，灵石不翼而飞。现场留下一枚黑色令牌，似是某个盗修组织的记号。你怒火中烧，却无从追查。',
    weight: 8,
    years: 0,
    maxTimes: 2,
    cooldown: 10,
    minGap: 5,
    conditions: [{ type: 'resource', key: 'spiritStones', min: 30 }],
    choices: [
      {
        id: 'hunt_thief',
        text: '追查盗修组织',
        outcomes: [
          {
            chance: 0.4,
            luckBonus: 0.004,
            successEffects: [
              { type: 'spiritStones', value: 40 },
              { type: 'stat', key: 'rootBone', value: 3 },
            ],
            failEffects: [
              { type: 'lifespan', value: -8 },
              { type: 'stat', key: 'demonHeart', value: 8 },
            ],
            narrative: {
              success: '你循迹找到盗修巢穴，以雷霆手段夺回灵石，还缴获了他们的赃物。',
              fail: '盗修早有防备，你中了埋伏，重伤而归，灵石也未能追回。',
            },
          },
        ],
      },
      {
        id: 'accept_loss',
        text: '破财消灾，不再追究',
        effects: [
          { type: 'spiritStones', value: -25 },
          { type: 'stat', key: 'karma', value: 5 },
        ],
      },
      {
        id: 'rob_others',
        text: '以其人之道还治其人之身',
        effects: [
          { type: 'spiritStones', value: 15 },
          { type: 'stat', key: 'demonHeart', value: 10 },
          { type: 'stat', key: 'karma', value: -12 },
        ],
      },
    ],
  },
  {
    id: 'senior_bullying',
    title: '前辈欺压',
    description:
      '一名修为远高于你的前辈修士看上了你的法宝，当众逼你交出。他气势汹汹，周围修士噤若寒蝉，无人敢为你说话。你修为低微，正面对抗毫无胜算。',
    weight: 8,
    years: 1,
    maxTimes: 2,
    cooldown: 10,
    minGap: 5,
    choices: [
      {
        id: 'submit',
        text: '忍辱交出法宝',
        effects: [
          { type: 'stat', key: 'demonHeart', value: 12 },
          { type: 'stat', key: 'karma', value: -5 },
          { type: 'cultivation', value: 3 },
        ],
      },
      {
        id: 'trick',
        text: '以计谋脱身',
        requirements: [{ type: 'stat', key: 'luck', min: 45 }],
        effects: [
          { type: 'stat', key: 'comprehension', value: 4 },
          { type: 'stat', key: 'luck', value: 3 },
        ],
      },
      {
        id: 'defy',
        text: '宁死不屈',
        outcomes: [
          {
            chance: 0.2,
            luckBonus: 0.006,
            successEffects: [
              { type: 'stat', key: 'karma', value: 15 },
              { type: 'stat', key: 'rootBone', value: 5 },
              { type: 'cultivation', value: 10 },
            ],
            failEffects: [
              { type: 'lifespan', value: -12 },
              { type: 'stat', key: 'demonHeart', value: 10 },
            ],
            narrative: {
              success: '你以弱胜强，拼死反抗竟逼退对方。围观修士纷纷惊叹，你的威名传遍四方。',
              fail: '实力差距过大，你被重伤，法宝也被夺走。但你的骨气让人敬佩。',
            },
          },
        ],
      },
      {
        id: 'beg',
        text: '跪地求饶',
        requirements: [{ type: 'stat', key: 'rootBone', max: 20 }],
        effects: [
          { type: 'stat', key: 'karma', value: -8 },
          { type: 'stat', key: 'demonHeart', value: 3 },
          { type: 'spiritStones', value: 5 },
        ],
      },
    ],
  },
  {
    id: 'calamity_plague',
    title: '灵瘟肆虐',
    description:
      '一场诡异的灵瘟席卷修真界，修士感染后修为倒退、灵根受损。你不幸被感染，体内灵气正缓缓流失。此瘟无药可解，唯有以强横肉身硬抗，或寻传说中的灵泉洗髓。',
    weight: 6,
    years: 1,
    once: true,
    minGap: 5,
    choices: [
      {
        id: 'resist_plague',
        text: '以肉身强扛灵瘟',
        outcomes: [
          {
            chance: 0.4,
            luckBonus: 0.004,
            successEffects: [
              { type: 'stat', key: 'rootBone', value: 6 },
              { type: 'lifespan', value: 5 },
            ],
            failEffects: [
              { type: 'cultivation', value: -15 },
              { type: 'lifespan', value: -10 },
              { type: 'stat', key: 'rootBone', value: -4 },
            ],
            narrative: {
              success: '你以强横肉身扛过灵瘟，脱胎换骨，根基更加扎实。',
              fail: '灵瘟侵蚀你的根基，修为倒退，寿元也有所折损。',
            },
          },
        ],
      },
      {
        id: 'find_spring',
        text: '四处寻访灵泉',
        effects: [
          { type: 'stat', key: 'luck', value: 3 },
          { type: 'lifespan', value: -5 },
          { type: 'cultivation', value: 5 },
        ],
      },
      {
        id: 'isolate',
        text: '闭关隔离，静待瘟退',
        effects: [
          { type: 'cultivation', value: -8 },
          { type: 'stat', key: 'demonHeart', value: -3 },
        ],
      },
    ],
  },
  {
    id: 'dao_heart_shaken',
    title: '道心动摇',
    description:
      '你目睹一名曾经叱咤风云的前辈修士寿尽坐化，化为一抔黄土。千年修为，终归尘土。你不禁怀疑：修仙问道，真的有意义吗？道心出现裂痕，若不及时修补，恐生心魔。',
    weight: 9,
    years: 1,
    maxTimes: 2,
    cooldown: 8,
    minGap: 5,
    choices: [
      {
        id: 'accept_mortality',
        text: '坦然接受生死轮回',
        effects: [
          { type: 'stat', key: 'demonHeart', value: -10 },
          { type: 'stat', key: 'comprehension', value: 5 },
          { type: 'cultivation', value: 8 },
        ],
      },
      {
        id: 'obsess_immortality',
        text: '发誓不惜一切代价求长生',
        effects: [
          { type: 'stat', key: 'demonHeart', value: 12 },
          { type: 'cultivation', value: 15 },
          { type: 'stat', key: 'karma', value: -8 },
        ],
      },
      {
        id: 'visit_mentor',
        text: '求教于师长',
        effects: [
          { type: 'stat', key: 'demonHeart', value: -5 },
          { type: 'stat', key: 'karma', value: 5 },
          { type: 'cultivation', value: 5 },
        ],
      },
    ],
  },
  {
    id: 'resource_conflict',
    title: '灵脉之争',
    description:
      '你发现一处小型灵脉正适合修炼，却有另一名修士早已在此打坐。他见你到来，面色不善：「此地是我先到，识趣的便滚。」灵脉资源稀缺，退让意味着修炼进度落后。',
    weight: 10,
    years: 0,
    maxTimes: 3,
    cooldown: 6,
    minGap: 4,
    choices: [
      {
        id: 'force_take',
        text: '以实力抢夺灵脉',
        outcomes: [
          {
            chance: 0.5,
            luckBonus: 0.004,
            successEffects: [
              { type: 'cultivation', value: 15 },
              { type: 'stat', key: 'demonHeart', value: 5 },
            ],
            failEffects: [
              { type: 'lifespan', value: -8 },
              { type: 'stat', key: 'demonHeart', value: 8 },
            ],
            narrative: {
              success: '你以强硬手段夺下灵脉，修为有所进益，却也树了一个敌人。',
              fail: '对方实力不俗，你两败俱伤，灵脉也被破坏。',
            },
          },
        ],
      },
      {
        id: 'share_vein',
        text: '提议共同修炼',
        effects: [
          { type: 'cultivation', value: 8 },
          { type: 'stat', key: 'karma', value: 5 },
        ],
      },
      {
        id: 'yield_vein',
        text: '让出灵脉',
        effects: [
          { type: 'stat', key: 'karma', value: 8 },
          { type: 'stat', key: 'demonHeart', value: -3 },
        ],
      },
      {
        id: 'sneak_vein',
        text: '趁其不备偷偷吸收灵气',
        requirements: [{ type: 'stat', key: 'rootBone', max: 20 }],
        effects: [
          { type: 'cultivation', value: 10 },
          { type: 'stat', key: 'luck', value: 3 },
        ],
      },
    ],
  },
  {
    id: 'inner_demon',
    title: '心魔幻境',
    description:
      '你陷入心魔幻境，眼前浮现你最恐惧的场景：亲朋离散、修为尽废、孤独终老。心魔低语：「放弃吧，一切皆是虚妄。」你必须做出抉择。',
    weight: 7,
    years: 1,
    maxTimes: 2,
    cooldown: 8,
    minGap: 5,
    conditions: [{ type: 'stat', key: 'demonHeart', min: 20 }],
    choices: [
      {
        id: 'face_demon',
        text: '直面心魔，斩断执念',
        outcomes: [
          {
            chance: 0.45,
            luckBonus: 0.005,
            successEffects: [
              { type: 'stat', key: 'demonHeart', value: -15 },
              { type: 'stat', key: 'comprehension', value: 6 },
              { type: 'cultivation', value: 12 },
            ],
            failEffects: [
              { type: 'stat', key: 'demonHeart', value: 10 },
              { type: 'cultivation', value: -10 },
            ],
            narrative: {
              success: '你以道心斩断心魔，心境澄明，修为大进。',
              fail: '心魔反噬，你道心受损，修为倒退。',
            },
          },
        ],
      },
      {
        id: 'embrace_demon',
        text: '拥抱心魔，以魔证道',
        effects: [
          { type: 'stat', key: 'demonHeart', value: 15 },
          { type: 'cultivation', value: 20 },
          { type: 'stat', key: 'karma', value: -10 },
        ],
      },
      {
        id: 'suppress_demon',
        text: '强行压制心魔',
        effects: [
          { type: 'stat', key: 'demonHeart', value: -5 },
          { type: 'cultivation', value: 5 },
          { type: 'lifespan', value: -5 },
        ],
      },
    ],
  },
  {
    id: 'ancient_map',
    title: '古图残卷',
    description:
      '你在坊市地摊上发现一卷泛黄的古图，上面标注着一处隐秘洞天的入口。摊主开价不高，但图上墨迹斑驳，真假难辨。',
    weight: 8,
    years: 1,
    once: true,
    choices: [
      {
        id: 'buy_map',
        text: '花灵石买下古图',
        requirements: [{ type: 'resource', key: 'spiritStones', min: 20 }],
        effects: [
          { type: 'spiritStones', value: -20 },
          { type: 'flag', key: 'has_ancient_map', value: true },
          { type: 'stat', key: 'luck', value: 3 },
        ],
      },
      {
        id: 'steal_map',
        text: '趁摊主不备顺走古图',
        outcomes: [
          {
            chance: 0.4,
            luckBonus: 0.004,
            successEffects: [
              { type: 'flag', key: 'has_ancient_map', value: true },
              { type: 'stat', key: 'demonHeart', value: 5 },
            ],
            failEffects: [
              { type: 'stat', key: 'karma', value: -10 },
              { type: 'spiritStones', value: -10, set: false },
            ],
            narrative: {
              success: '你趁摊主转身之际将古图收入袖中，悄然离去。',
              fail: '摊主早已察觉，一把抓住你，你被迫交出灵石赔罪。',
            },
          },
        ],
      },
      {
        id: 'ignore_map',
        text: '不感兴趣，转身离去',
        effects: [
          { type: 'cultivation', value: 3 },
        ],
      },
    ],
  },
  {
    id: 'ancient_map_follow',
    title: '洞天秘境',
    description:
      '你按古图所示，跋涉数日终于找到一处被藤蔓遮蔽的山洞。洞内灵气浓郁得化为雾霭，深处隐约可见一座石门，门上刻着古老的符文。',
    weight: 6,
    years: 2,
    once: true,
    conditions: [{ type: 'flag', key: 'has_ancient_map', value: true }],
    choices: [
      {
        id: 'open_gate',
        text: '以灵力催动符文开启石门',
        outcomes: [
          {
            chance: 0.5,
            luckBonus: 0.005,
            successEffects: [
              { type: 'spiritStones', value: 60 },
              { type: 'cultivation', value: 20 },
              { type: 'stat', key: 'comprehension', value: 6 },
              { type: 'artifact', id: 'ancient_seal', name: '上古封印' },
            ],
            failEffects: [
              { type: 'lifespan', value: -10 },
              { type: 'stat', key: 'demonHeart', value: 8 },
            ],
            narrative: {
              success: '石门缓缓开启，内藏大量灵石与一件上古法宝。你满载而归。',
              fail: '符文反噬，你被震飞数丈，重伤退出洞天。',
            },
          },
        ],
      },
      {
        id: 'study_gate',
        text: '先研究符文再做决定',
        effects: [
          { type: 'formationTier', value: 1 },
          { type: 'stat', key: 'comprehension', value: 4 },
          { type: 'cultivation', value: 10 },
        ],
      },
      {
        id: 'leave_gate',
        text: '此地诡异，速速离去',
        effects: [
          { type: 'stat', key: 'luck', value: 3 },
        ],
      },
    ],
  },
  {
    id: 'mysterious_merchant',
    title: '神秘商人',
    description:
      '夜市深处，一名戴着斗笠的神秘商人拦住你的去路。他的摊位上摆满了奇异的物品，每一件都散发着不同寻常的气息。「有缘人，看看我的货吧。」',
    weight: 7,
    years: 1,
    maxTimes: 3,
    cooldown: 6,
    choices: [
      {
        id: 'buy_pill',
        text: '购买一枚神秘丹药',
        requirements: [{ type: 'resource', key: 'spiritStones', min: 30 }],
        effects: [
          { type: 'spiritStones', value: -30 },
          { type: 'stat', key: 'rootBone', value: 5 },
          { type: 'cultivation', value: 10 },
        ],
      },
      {
        id: 'buy_artifact',
        text: '购买一件神秘法宝',
        requirements: [{ type: 'resource', key: 'spiritStones', min: 50 }],
        effects: [
          { type: 'spiritStones', value: -50 },
          { type: 'artifact', id: 'mysterious_artifact', name: '神秘法宝' },
        ],
      },
      {
        id: 'decline_merchant',
        text: '婉拒好意',
        effects: [
          { type: 'stat', key: 'luck', value: 2 },
        ],
      },
    ],
  },
  {
    id: 'spirit_spring',
    title: '灵泉沐浴',
    description:
      '深山中发现一处天然灵泉，泉水清澈见底，灵气氤氲。你犹豫是否要下去沐浴——灵泉可以洗筋伐髓，但也可能有未知风险。',
    weight: 8,
    years: 1,
    cooldown: 5,
    choices: [
      {
        id: 'bathe',
        text: '下泉沐浴',
        outcomes: [
          {
            chance: 0.6,
            luckBonus: 0.004,
            successEffects: [
              { type: 'stat', key: 'rootBone', value: 4 },
              { type: 'stat', key: 'comprehension', value: 3 },
              { type: 'lifespan', value: 5 },
            ],
            failEffects: [
              { type: 'lifespan', value: -5 },
              { type: 'stat', key: 'demonHeart', value: 3 },
            ],
            narrative: {
              success: '灵泉洗筋伐髓，你感到身体轻盈了许多，根骨悟性均有提升。',
              fail: '泉水中暗藏杂质，你被侵蚀了数条经脉，寿元微损。',
            },
          },
        ],
      },
      {
        id: 'collect_spring',
        text: '收集泉水带走',
        effects: [
          { type: 'spiritStones', value: 15 },
          { type: 'stat', key: 'luck', value: 2 },
        ],
      },
      {
        id: 'leave_spring',
        text: '不冒险，继续赶路',
        effects: [
          { type: 'cultivation', value: 3 },
        ],
      },
    ],
  },
  {
    id: 'blood_moon',
    title: '血月之夜',
    description:
      '天现异象，一轮血月高悬夜空。你感到体内灵气躁动不安，心魔蠢蠢欲动。这是修炼邪功的绝佳时机，但也极易走火入魔。',
    weight: 6,
    years: 1,
    once: true,
    rarity: 'rare',
    choices: [
      {
        id: 'cultivate_blood',
        text: '趁血月修炼',
        outcomes: [
          {
            chance: 0.4,
            luckBonus: 0.005,
            successEffects: [
              { type: 'cultivation', value: 25 },
              { type: 'stat', key: 'demonHeart', value: 10 },
              { type: 'stat', key: 'rootBone', value: 5 },
            ],
            failEffects: [
              { type: 'stat', key: 'demonHeart', value: 20 },
              { type: 'lifespan', value: -10 },
            ],
            narrative: {
              success: '你借血月之力突破瓶颈，修为大进，但心魔也随之增长。',
              fail: '血月之力过于狂暴，你险些走火入魔，心魔暴涨。',
            },
          },
        ],
      },
      {
        id: 'purify',
        text: '以道心压制躁动',
        effects: [
          { type: 'stat', key: 'demonHeart', value: -8 },
          { type: 'stat', key: 'karma', value: 5 },
        ],
      },
      {
        id: 'observe_moon',
        text: '静观血月，感悟天道',
        effects: [
          { type: 'stat', key: 'comprehension', value: 5 },
          { type: 'cultivation', value: 8 },
        ],
      },
    ],
  },
  {
    id: 'celestial_phenomenon',
    title: '天象异变',
    description:
      '九星连珠，天降异象。整个修真界都能看到天空中璀璨的星光汇聚成一道光柱，直指你所在的方向。各方势力蠢蠢欲动，你感到一股莫名的召唤。',
    weight: 5,
    years: 2,
    once: true,
    rarity: 'legendary',
    choices: [
      {
        id: 'follow_light',
        text: '追随光柱而去',
        outcomes: [
          {
            chance: 0.35,
            luckBonus: 0.006,
            successEffects: [
              { type: 'cultivation', value: 30 },
              { type: 'stat', key: 'comprehension', value: 10 },
              { type: 'lifespan', value: 15 },
              { type: 'flag', key: 'celestial_heritage', value: true },
            ],
            failEffects: [
              { type: 'lifespan', value: -15 },
              { type: 'stat', key: 'demonHeart', value: 12 },
            ],
            narrative: {
              success: '你在光柱尽头发现一处上古传承，获得无上机缘。',
              fail: '光柱消散，你被余波所伤，元气大损。',
            },
          },
        ],
      },
      {
        id: 'protect',
        text: '守护附近百姓免受异象波及',
        effects: [
          { type: 'stat', key: 'karma', value: 15 },
          { type: 'cultivation', value: 10 },
        ],
      },
      {
        id: 'ignore_phenomenon',
        text: '闭关不出，不为所动',
        effects: [
          { type: 'stat', key: 'demonHeart', value: -5 },
          { type: 'cultivation', value: 5 },
        ],
      },
    ],
  },
  {
    id: 'thunder_falcon_nest',
    title: '雷鹰巢穴',
    description:
      '悬崖峭壁上发现一处雷鹰巢穴，幼鹰浑身电弧闪烁，正独自嗷嗷待哺。它的父母似乎已经遭遇不测。',
    weight: 6,
    years: 1,
    once: true,
    rarity: 'rare',
    conditions: [{ type: 'realm', min: 'qi_refining_3' }],
    choices: [
      {
        id: 'adopt_falcon',
        text: '收养雷鹰幼崽',
        effects: [
          { type: 'spiritBeast', name: '雷鹰', tier: 1 },
          { type: 'stat', key: 'karma', value: 8 },
          { type: 'stat', key: 'luck', value: 3 },
        ],
      },
      {
        id: 'leave_falcon',
        text: '留下灵果，让它自生自灭',
        effects: [
          { type: 'stat', key: 'karma', value: 5 },
          { type: 'stat', key: 'luck', value: 2 },
        ],
      },
      {
        id: 'take_egg',
        text: '取走巢中雷鹰蛋',
        outcomes: [
          {
            chance: 0.5,
            luckBonus: 0.004,
            successEffects: [
              { type: 'spiritStones', value: 25 },
              { type: 'stat', key: 'demonHeart', value: 5 },
            ],
            failEffects: [
              { type: 'lifespan', value: -5 },
              { type: 'stat', key: 'karma', value: -8 },
            ],
            narrative: {
              success: '你取走雷鹰蛋，可高价出售给驯兽师。',
              fail: '雷鹰蛋在你手中破裂，你空手而归。',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'ice_phoenix',
    title: '冰凤现身',
    description:
      '极北冰原上，一只通体冰蓝的凤凰从天而降。它浑身散发着刺骨寒意，却目光温和地看着你。传说冰凤择主而侍，非有缘人不遇。',
    weight: 4,
    years: 2,
    once: true,
    rarity: 'legendary',
    conditions: [{ type: 'realm', min: 'foundation' }],
    choices: [
      {
        id: 'bond_phoenix',
        text: '以诚心结交冰凤',
        requirements: [{ type: 'stat', key: 'karma', min: 25 }],
        effects: [
          { type: 'spiritBeast', name: '冰凤', tier: 1 },
          { type: 'lifespan', value: 10 },
          { type: 'stat', key: 'comprehension', value: 6 },
        ],
      },
      {
        id: 'bow_phoenix',
        text: '恭敬行礼，不求回报',
        effects: [
          { type: 'stat', key: 'karma', value: 12 },
          { type: 'lifespan', value: 5 },
        ],
      },
      {
        id: 'capture_phoenix',
        text: '以法术强行收服',
        outcomes: [
          {
            chance: 0.15,
            luckBonus: 0.006,
            successEffects: [
              { type: 'spiritBeast', name: '冰凤', tier: 1 },
              { type: 'cultivation', value: 15 },
            ],
            failEffects: [
              { type: 'lifespan', value: -20 },
              { type: 'stat', key: 'demonHeart', value: 15 },
            ],
            narrative: {
              success: '你以强大法术收服冰凤，它认你为主。',
              fail: '冰凤震怒，寒冰之力将你冻伤，你仓皇逃窜。',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'explore_spirit_mountain',
    title: '灵山福地',
    description:
      '你来到一处灵气充沛的仙山，山中草木皆有灵性，灵花异草随处可见。山腰处有一片灵田，几名散修正在采集灵草。山顶云雾缭绕，隐约可见一座古亭。',
    weight: 8,
    years: 1,
    cooldown: 5,
    choices: [
      {
        id: 'gather_herbs',
        text: '采集灵草',
        effects: [
          { type: 'spiritStones', value: 15 },
          { type: 'stat', key: 'luck', value: 3 },
        ],
      },
      {
        id: 'climb_peak',
        text: '攀登山顶古亭',
        outcomes: [
          {
            chance: 0.6,
            luckBonus: 0.004,
            successEffects: [
              { type: 'cultivation', value: 15 },
              { type: 'stat', key: 'comprehension', value: 5 },
            ],
            failEffects: [
              { type: 'cultivation', value: 5 },
            ],
            narrative: {
              success: '山顶古亭中灵气浓郁，你在此打坐半日，修为有所进益。',
              fail: '山路崎岖，你未能登顶，但在半山腰也有所收获。',
            },
          },
        ],
      },
      {
        id: 'rest_mountain',
        text: '在山中静修一日',
        effects: [
          { type: 'cultivation', value: 8 },
          { type: 'stat', key: 'demonHeart', value: -3 },
        ],
      },
    ],
  },
  {
    id: 'explore_demon_mountain',
    title: '万魔山',
    description:
      '万魔山魔气弥漫，山中魔修与妖兽盘踞。你小心翼翼地潜入，发现一处被魔气侵蚀的洞穴，洞内似有宝物闪烁。但洞口有一头魔化妖兽把守。',
    weight: 7,
    years: 2,
    conditions: [{ type: 'realm', min: 'qi_refining_2' }],
    choices: [
      {
        id: 'fight_demon_beast',
        text: '斩杀魔化妖兽',
        outcomes: [
          {
            chance: 0.5,
            luckBonus: 0.005,
            successEffects: [
              { type: 'spiritStones', value: 25 },
              { type: 'stat', key: 'demonHeart', value: 5 },
              { type: 'cultivation', value: 12 },
            ],
            failEffects: [
              { type: 'lifespan', value: -8 },
              { type: 'stat', key: 'demonHeart', value: 8 },
            ],
            narrative: {
              success: '你斩杀魔化妖兽，洞中宝物尽归你所有。',
              fail: '妖兽凶猛，你被魔气侵蚀，心魔暗生。',
            },
          },
        ],
      },
      {
        id: 'sneak_demon',
        text: '绕过妖兽潜入',
        requirements: [{ type: 'stat', key: 'luck', min: 40 }],
        effects: [
          { type: 'spiritStones', value: 18 },
          { type: 'stat', key: 'comprehension', value: 3 },
        ],
      },
      {
        id: 'leave_demon',
        text: '此地凶险，速速离去',
        effects: [
          { type: 'stat', key: 'luck', value: 2 },
        ],
      },
    ],
  },
  {
    id: 'explore_ancient_tomb',
    title: '古修墓穴',
    description:
      '你发现一座上古修士的陵墓，墓门上刻着复杂的禁制符文。墓内机关重重，但若能破解，必有丰厚收获。入口处散落着前人留下的破阵工具。',
    weight: 6,
    years: 2,
    once: true,
    conditions: [{ type: 'realm', min: 'foundation' }],
    choices: [
      {
        id: 'enter_tomb',
        text: '破解禁制进入墓穴',
        outcomes: [
          {
            chance: 0.4,
            luckBonus: 0.005,
            successEffects: [
              { type: 'spiritStones', value: 40 },
              { type: 'formationTier', value: 1 },
              { type: 'artifact', id: 'tomb_relic', name: '古修遗宝' },
            ],
            failEffects: [
              { type: 'lifespan', value: -12 },
              { type: 'stat', key: 'demonHeart', value: 5 },
            ],
            narrative: {
              success: '你破解禁制进入墓穴深处，获得古修遗宝与大量灵石。',
              fail: '禁制反噬，你被古阵所伤，仓皇退出。',
            },
          },
        ],
      },
      {
        id: 'study_tomb',
        text: '研究墓门符文',
        effects: [
          { type: 'formationTier', value: 1 },
          { type: 'stat', key: 'comprehension', value: 5 },
        ],
      },
      {
        id: 'leave_tomb',
        text: '此地不详，不碰为妙',
        effects: [
          { type: 'stat', key: 'luck', value: 2 },
        ],
      },
    ],
  },
  {
    id: 'explore_thunder_valley',
    title: '雷泽秘境',
    description:
      '你踏入雷泽秘境，天空电闪雷鸣，地面处处焦痕。此地雷霆之力浓郁，是淬炼肉身的绝佳之地，但稍有不慎便会被雷电击中。',
    weight: 6,
    years: 2,
    conditions: [{ type: 'realm', min: 'foundation' }],
    choices: [
      {
        id: 'train_thunder',
        text: '引雷入体淬炼',
        outcomes: [
          {
            chance: 0.45,
            luckBonus: 0.005,
            successEffects: [
              { type: 'stat', key: 'rootBone', value: 6 },
              { type: 'cultivation', value: 18 },
            ],
            failEffects: [
              { type: 'lifespan', value: -10 },
              { type: 'stat', key: 'demonHeart', value: 5 },
            ],
            narrative: {
              success: '你引雷入体，经脉被雷霆淬炼，根骨大进。',
              fail: '雷霆之力过于狂暴，你被电得外焦里嫩，元气大损。',
            },
          },
        ],
      },
      {
        id: 'gather_thunder',
        text: '采集雷纹草',
        effects: [
          { type: 'spiritStones', value: 20 },
          { type: 'stat', key: 'luck', value: 3 },
        ],
      },
      {
        id: 'observe_thunder',
        text: '远观雷霆领悟天道',
        effects: [
          { type: 'stat', key: 'comprehension', value: 5 },
          { type: 'cultivation', value: 8 },
        ],
      },
    ],
  },
  {
    id: 'explore_ice_land',
    title: '极北冰原',
    description:
      '万里冰封的极北之地，寒风刺骨。你艰难跋涉，发现一处冰洞，洞内似有微弱的灵光闪烁。传说此地曾有上古冰凤栖息。',
    weight: 5,
    years: 2,
    once: true,
    conditions: [{ type: 'realm', min: 'golden_core' }],
    choices: [
      {
        id: 'enter_ice_cave',
        text: '进入冰洞探索',
        outcomes: [
          {
            chance: 0.4,
            luckBonus: 0.006,
            successEffects: [
              { type: 'spiritStones', value: 35 },
              { type: 'stat', key: 'comprehension', value: 8 },
              { type: 'lifespan', value: 8 },
            ],
            failEffects: [
              { type: 'lifespan', value: -12 },
              { type: 'stat', key: 'demonHeart', value: 5 },
            ],
            narrative: {
              success: '冰洞深处藏有上古冰凤遗留的灵光，你吸收后寿元延长。',
              fail: '冰洞深处寒气逼人，你被冻伤数处经脉。',
            },
          },
        ],
      },
      {
        id: 'meditate_ice',
        text: '在冰原上打坐修炼',
        effects: [
          { type: 'stat', key: 'demonHeart', value: -8 },
          { type: 'cultivation', value: 12 },
        ],
      },
      {
        id: 'leave_ice',
        text: '此地过于凶险，离去',
        effects: [
          { type: 'stat', key: 'luck', value: 2 },
        ],
      },
    ],
  },
  {
    id: 'explore_star_ruins',
    title: '星辰遗迹',
    description:
      '你来到一处陨石撞击形成的巨坑，坑底残留着浓郁的星辰之力。坑壁上刻满了上古符文，中央悬浮着一块散发星光的陨铁。',
    weight: 4,
    years: 2,
    once: true,
    rarity: 'rare',
    conditions: [{ type: 'realm', min: 'golden_core' }],
    choices: [
      {
        id: 'take_star_iron',
        text: '取走星辰陨铁',
        outcomes: [
          {
            chance: 0.45,
            luckBonus: 0.005,
            successEffects: [
              { type: 'artifact', id: 'star_iron', name: '星辰陨铁' },
              { type: 'divineWeaponTier', value: 1 },
              { type: 'stat', key: 'comprehension', value: 5 },
            ],
            failEffects: [
              { type: 'lifespan', value: -10 },
              { type: 'stat', key: 'demonHeart', value: 5 },
            ],
            narrative: {
              success: '你取走星辰陨铁，此物蕴含星辰之力，是炼器至宝。',
              fail: '星辰之力反噬，你被震飞出坑。',
            },
          },
        ],
      },
      {
        id: 'study_star',
        text: '参悟坑壁符文',
        effects: [
          { type: 'cultivation', value: 20 },
          { type: 'stat', key: 'comprehension', value: 8 },
        ],
      },
      {
        id: 'absorb_star',
        text: '吸收星辰之力',
        requirements: [{ type: 'stat', key: 'rootBone', min: 60 }],
        effects: [
          { type: 'stat', key: 'rootBone', value: 6 },
          { type: 'cultivation', value: 15 },
        ],
      },
    ],
  },
  {
    id: 'explore_void_rift',
    title: '虚空裂缝',
    description:
      '你发现一处空间不稳定之处，裂缝中透出异界的光芒。裂缝另一侧似有宝物闪烁，但空间随时可能崩塌。',
    weight: 3,
    years: 3,
    once: true,
    rarity: 'legendary',
    conditions: [{ type: 'realm', min: 'nascent_soul' }],
    choices: [
      {
        id: 'enter_void',
        text: '踏入虚空裂缝',
        outcomes: [
          {
            chance: 0.3,
            luckBonus: 0.006,
            successEffects: [
              { type: 'artifact', id: 'void_artifact', name: '异界法宝' },
              { type: 'cultivation', value: 30 },
              { type: 'stat', key: 'comprehension', value: 10 },
            ],
            failEffects: [
              { type: 'lifespan', value: -20 },
              { type: 'stat', key: 'demonHeart', value: 10 },
            ],
            narrative: {
              success: '你穿越虚空裂缝，在异界获得一件强大法宝后安全返回。',
              fail: '虚空裂缝崩塌，你被空间之力撕裂，重伤逃出。',
            },
          },
        ],
      },
      {
        id: 'study_void',
        text: '研究空间裂缝的规律',
        effects: [
          { type: 'stat', key: 'comprehension', value: 8 },
          { type: 'formationTier', value: 1 },
        ],
      },
      {
        id: 'seal_void',
        text: '封印裂缝，防止危险',
        effects: [
          { type: 'stat', key: 'karma', value: 10 },
          { type: 'formationTier', value: 1 },
        ],
      },
    ],
  },
  {
    id: 'find_healing_pill',
    title: '灵丹妙药',
    description:
      '你在山涧边发现一株灵草，叶片上凝结着晶莹的露珠。仔细辨认后，你认出这是可以疗伤的灵草，若能炼制成丹药，关键时刻可救一命。',
    weight: 8,
    years: 1,
    choices: [
      {
        id: 'refine_pill',
        text: '当场炼制成丹药',
        requirements: [{ type: 'alchemyTier', min: 1 }],
        effects: [
          { type: 'inventory', name: '疗伤丹', description: '可恢复寿元10点', usable: true },
          { type: 'alchemyTier', value: 1 },
        ],
      },
      {
        id: 'eat_raw',
        text: '直接服用灵草',
        effects: [
          { type: 'lifespan', value: 5 },
          { type: 'cultivation', value: 3 },
        ],
      },
      {
        id: 'sell_herb',
        text: '拿到坊市出售',
        effects: [
          { type: 'spiritStones', value: 12 },
        ],
      },
    ],
  },
  {
    id: 'find_scroll',
    title: '古卷残页',
    description:
      '你在古书堆中翻到一页泛黄的残卷，上面记载着一种失传的护体法门。残卷不完整，但核心口诀仍在。',
    weight: 7,
    years: 1,
    choices: [
      {
        id: 'study_scroll',
        text: '参悟残卷口诀',
        effects: [
          { type: 'inventory', name: '护体残卷', description: '使用后根骨+3', usable: true },
          { type: 'stat', key: 'comprehension', value: 3 },
        ],
      },
      {
        id: 'copy_scroll',
        text: '抄录一份副本',
        effects: [
          { type: 'inventory', name: '护体残卷', description: '使用后根骨+3', usable: true },
          { type: 'spiritStones', value: 8 },
        ],
      },
      {
        id: 'discard_scroll',
        text: '残卷不全，随手丢弃',
        effects: [
          { type: 'stat', key: 'karma', value: -2 },
        ],
      },
    ],
  },
  {
    id: 'find_elixir',
    title: '地脉灵液',
    description:
      '你在地底溶洞中发现一汪灵液，液面泛着淡金色的光芒。这是地脉精华凝聚而成的灵液，对修士大有裨益。',
    weight: 6,
    years: 1,
    once: true,
    choices: [
      {
        id: 'drink_elixir',
        text: '当场饮下灵液',
        effects: [
          { type: 'cultivation', value: 15 },
          { type: 'stat', key: 'rootBone', value: 3 },
          { type: 'lifespan', value: 5 },
        ],
      },
      {
        id: 'bottle_elixir',
        text: '装瓶带走',
        effects: [
          { type: 'inventory', name: '地脉灵液', description: '使用后修为+15', usable: true },
        ],
      },
      {
        id: 'share_elixir',
        text: '分给附近修士',
        effects: [
          { type: 'stat', key: 'karma', value: 10 },
          { type: 'cultivation', value: 8 },
        ],
      },
    ],
  },
  {
    id: 'enemy_cooperation',
    title: '仇人求合作',
    description:
      '一个曾经暗害过你的修士，如今落魄潦倒地找上门来。他声称发现了一处大机缘，但独力难取，需要你合作。他指天发誓事成之后平分。你看着他狼狈的模样，心中五味杂陈。',
    weight: 6,
    years: 1,
    once: true,
    choices: [
      {
        id: 'cooperate_enemy',
        text: '暂且合作，各取所需',
        effects: [
          { type: 'spiritStones', value: 35 },
          { type: 'stat', key: 'comprehension', value: 4 },
          { type: 'stat', key: 'demonHeart', value: 5 },
        ],
      },
      {
        id: 'refuse_enemy',
        text: '此人不可信，拒绝合作',
        effects: [
          { type: 'stat', key: 'karma', value: 5 },
          { type: 'stat', key: 'luck', value: 3 },
        ],
      },
      {
        id: 'betray_enemy',
        text: '假意合作，独吞机缘',
        requirements: [{ type: 'stat', key: 'comprehension', min: 45 }],
        effects: [
          { type: 'spiritStones', value: 55 },
          { type: 'stat', key: 'demonHeart', value: 10 },
          { type: 'stat', key: 'karma', value: -10 },
        ],
      },
    ],
  },
  {
    id: 'sever_ties',
    title: '斩尘缘',
    description:
      '你修炼一门上古功法，功法要求斩断尘缘方能大成。你需要做出抉择：放弃一段过往的羁绊，换取功法突破。尘缘一断，便是永别。',
    weight: 5,
    years: 2,
    once: true,
    conditions: [{ type: 'realm', min: 'foundation' }],
    choices: [
      {
        id: 'sever_lover',
        text: '斩断与道侣的尘缘',
        requirements: [{ type: 'flag', key: 'has_companion', value: true }],
        effects: [
          { type: 'flag', key: 'has_companion', value: false },
          { type: 'flag', key: 'su_qing_companion', value: false },
          { type: 'flag', key: 'severed_lover', value: true },
          { type: 'cultivation', value: 30 },
          { type: 'techniqueTier', value: 1 },
          { type: 'stat', key: 'demonHeart', value: 15 },
        ],
      },
      {
        id: 'sever_friend',
        text: '斩断与友人的尘缘',
        requirements: [{ type: 'flag', key: 'lin_yuan_ally', value: true }],
        effects: [
          { type: 'flag', key: 'lin_yuan_ally', value: false },
          { type: 'flag', key: 'severed_friend', value: true },
          { type: 'cultivation', value: 25 },
          { type: 'techniqueTier', value: 1 },
          { type: 'stat', key: 'demonHeart', value: 10 },
        ],
      },
      {
        id: 'refuse_sever',
        text: '宁可功法不成，不断尘缘',
        effects: [
          { type: 'stat', key: 'karma', value: 10 },
          { type: 'cultivation', value: 8 },
        ],
      },
    ],
  },
  {
    id: 'soul_possession',
    title: '夺舍诱惑',
    description:
      '一次濒死之际，一道上古残魂忽然出现在你识海中。它自称万年前的大能修士，愿以残魂之力助你复活——条件是与你共用一具身体。它的力量强大，但你不确定它的真实意图。',
    weight: 4,
    years: 2,
    once: true,
    rarity: 'rare',
    conditions: [{ type: 'stat', key: 'demonHeart', min: 30 }],
    choices: [
      {
        id: 'accept_soul',
        text: '接受残魂共体',
        effects: [
          { type: 'flag', key: 'soul_possessed', value: true },
          { type: 'cultivation', value: 25 },
          { type: 'stat', key: 'rootBone', value: 8 },
          { type: 'stat', key: 'demonHeart', value: 15 },
          { type: 'lifespan', value: -10 },
        ],
      },
      {
        id: 'negotiate_soul',
        text: '与残魂谈判，只借力不共享',
        requirements: [{ type: 'stat', key: 'comprehension', min: 50 }],
        effects: [
          { type: 'flag', key: 'soul_possessed', value: true },
          { type: 'cultivation', value: 15 },
          { type: 'stat', key: 'comprehension', value: 6 },
        ],
      },
      {
        id: 'reject_soul',
        text: '拒绝残魂，宁死不屈',
        effects: [
          { type: 'stat', key: 'karma', value: 10 },
          { type: 'stat', key: 'demonHeart', value: -10 },
        ],
      },
    ],
  },
  {
    id: 'soul_demand',
    title: '残魂索求',
    description:
      '你体内的残魂忽然开口：「小友，老夫有一事相求。」它的语气平静却带着不容拒绝的威压。残魂想借你的身体去完成一件未了的心愿——但这件事可能违背你的道心。',
    weight: 5,
    years: 2,
    maxTimes: 2,
    cooldown: 8,
    conditions: [{ type: 'flag', key: 'soul_possessed', value: true }],
    choices: [
      {
        id: 'obey_soul',
        text: '答应残魂的要求',
        effects: [
          { type: 'cultivation', value: 18 },
          { type: 'stat', key: 'demonHeart', value: 8 },
          { type: 'stat', key: 'karma', value: -5 },
        ],
      },
      {
        id: 'refuse_soul',
        text: '拒绝残魂的要求',
        effects: [
          { type: 'stat', key: 'demonHeart', value: -5 },
          { type: 'stat', key: 'karma', value: 5 },
          { type: 'stat', key: 'comprehension', value: 3 },
        ],
      },
      {
        id: 'negotiate_demand',
        text: '与残魂协商折中方案',
        requirements: [{ type: 'stat', key: 'comprehension', min: 40 }],
        effects: [
          { type: 'cultivation', value: 12 },
          { type: 'stat', key: 'comprehension', value: 4 },
        ],
      },
    ],
  },
  {
    id: 'inheritance_battle',
    title: '继承权之战',
    description:
      '一位化神期大能寿元将尽，公开选传人继承衣钵。你与数名候选人被扔进试炼场。但你很快发现，其他人都是世家子弟，只有你一个散修。他们的目光不善——先联手除掉你，再争夺传承。',
    weight: 5,
    years: 2,
    once: true,
    rarity: 'rare',
    conditions: [{ type: 'realm', min: 'foundation' }],
    choices: [
      {
        id: 'fight_inheritance',
        text: '以一敌多，正面突围',
        outcomes: [
          {
            chance: 0.35,
            luckBonus: 0.006,
            successEffects: [
              { type: 'cultivation', value: 30 },
              { type: 'stat', key: 'rootBone', value: 8 },
              { type: 'artifact', id: 'inheritance_seal', name: '大能传承印' },
              { type: 'flag', key: 'won_inheritance', value: true },
            ],
            failEffects: [
              { type: 'lifespan', value: -15 },
              { type: 'stat', key: 'demonHeart', value: 10 },
            ],
            narrative: {
              success: '你以一己之力击败所有对手，获得大能传承。散修之名响彻修真界。',
              fail: '世家子弟联手围攻，你寡不敌众，重伤退出。',
            },
          },
        ],
      },
      {
        id: 'ally_inheritance',
        text: '与最弱者结盟对抗强者',
        requirements: [{ type: 'stat', key: 'comprehension', min: 40 }],
        effects: [
          { type: 'cultivation', value: 18 },
          { type: 'stat', key: 'comprehension', value: 5 },
          { type: 'spiritStones', value: 20 },
        ],
      },
      {
        id: 'withdraw_inheritance',
        text: '放弃传承，保全性命',
        effects: [
          { type: 'stat', key: 'luck', value: 3 },
          { type: 'stat', key: 'demonHeart', value: -3 },
        ],
      },
    ],
  },
  {
    id: 'vein_depletion',
    title: '灵脉枯竭',
    description:
      '你洞府所在的灵脉正在枯竭，灵气日渐稀薄。你必须另觅灵脉迁移。探查后发现三处可选：一处在深山妖兽领地，一处在宗门势力边缘，一处在荒漠深处。每处都有不同的危险和机遇。',
    weight: 6,
    years: 2,
    once: true,
    conditions: [
      { type: 'realm', min: 'qi_refining_3' },
      { type: 'flag', key: 'refused_all_sects', value: true },
    ],
    choices: [
      {
        id: 'mountain_vein',
        text: '深山妖兽领地',
        effects: [
          { type: 'stat', key: 'rootBone', value: 5 },
          { type: 'cultivation', value: 15 },
          { type: 'stat', key: 'demonHeart', value: 3 },
        ],
      },
      {
        id: 'sect_vein',
        text: '宗门势力边缘',
        effects: [
          { type: 'spiritStones', value: 20 },
          { type: 'stat', key: 'karma', value: 5 },
          { type: 'cultivation', value: 10 },
        ],
      },
      {
        id: 'desert_vein',
        text: '荒漠深处',
        effects: [
          { type: 'stat', key: 'luck', value: 5 },
          { type: 'stat', key: 'comprehension', value: 4 },
          { type: 'cultivation', value: 12 },
        ],
      },
    ],
  },
  {
    id: 'mortal_plight',
    title: '凡人处境',
    description:
      '两名修士斗法，余波殃及附近的凡人城镇。房屋倒塌，死伤无数。但无人追究——在修仙者眼中，凡人如蝼蚁。你站在废墟前，看着哭泣的孩童和遍地的尸体，想起自己的父母也是凡人。',
    weight: 6,
    years: 1,
    once: true,
    choices: [
      {
        id: 'help_mortals',
        text: '出手救助幸存者',
        effects: [
          { type: 'stat', key: 'karma', value: 15 },
          { type: 'stat', key: 'comprehension', value: 4 },
          { type: 'cultivation', value: 5 },
        ],
      },
      {
        id: 'report_mortals',
        text: '向宗门举报肇事修士',
        requirements: [{ type: 'flag', key: 'loyal_to_sect', value: true }],
        effects: [
          { type: 'stat', key: 'karma', value: 10 },
          { type: 'spiritStones', value: 15 },
        ],
      },
      {
        id: 'ignore_mortals',
        text: '修仙界本就弱肉强食',
        effects: [
          { type: 'stat', key: 'demonHeart', value: 8 },
          { type: 'stat', key: 'karma', value: -10 },
        ],
      },
    ],
  },
  {
    id: 'spirit_stone_origin',
    title: '灵石从哪来',
    description:
      '你参观了一处灵石矿场。矿工是灵根驳杂不纯的低阶修士，被当作消耗品使用。他们日夜劳作，换取微薄的灵石修炼。你忽然想起——当年的你，差一点也走上了这条路。',
    weight: 5,
    years: 1,
    once: true,
    choices: [
      {
        id: 'sympathize_miners',
        text: '为矿工争取更好的待遇',
        effects: [
          { type: 'stat', key: 'karma', value: 12 },
          { type: 'stat', key: 'comprehension', value: 3 },
        ],
      },
      {
        id: 'buy_freedom',
        text: '出资赎几名矿工的自由',
        requirements: [{ type: 'resource', key: 'spiritStones', min: 30 }],
        effects: [
          { type: 'spiritStones', value: -30 },
          { type: 'stat', key: 'karma', value: 20 },
          { type: 'stat', key: 'luck', value: 5 },
        ],
      },
      {
        id: 'accept_system',
        text: '这就是修真界的法则',
        effects: [
          { type: 'stat', key: 'demonHeart', value: 5 },
          { type: 'spiritStones', value: 10 },
        ],
      },
    ],
  },
  {
    id: 'righteous_dark_side',
    title: '正道暗面',
    description:
      '你无意中发现，天玄宗的灵石矿场里，矿工竟是抓来的魔修俘虏和还不起债的散修。他们日夜劳作，待遇与牲畜无异。但监工长老毫不在意：「他们是魔道，活该如此。」你心中泛起一丝不适。',
    weight: 5,
    years: 1,
    once: true,
    conditions: [{ type: 'flag', key: 'loyal_to_sect', value: true }],
    choices: [
      {
        id: 'protest_dark',
        text: '向掌门举报矿场真相',
        effects: [
          { type: 'stat', key: 'karma', value: 12 },
          { type: 'stat', key: 'comprehension', value: 4 },
          { type: 'stat', key: 'demonHeart', value: -5 },
        ],
      },
      {
        id: 'accept_dark',
        text: '修仙界本就弱肉强食',
        effects: [
          { type: 'stat', key: 'demonHeart', value: 8 },
          { type: 'spiritStones', value: 15 },
        ],
      },
      {
        id: 'help_miners',
        text: '暗中帮助几名矿工逃脱',
        effects: [
          { type: 'stat', key: 'karma', value: 15 },
          { type: 'stat', key: 'luck', value: 3 },
          { type: 'stat', key: 'demonHeart', value: -3 },
        ],
      },
    ],
  },
  {
    id: 'demon_mercy',
    title: '魔道的另一面',
    description:
      '你深入魔域，本以为会见到人间炼狱。却意外发现一处魔修聚落，秩序井然，老幼皆有所养。一名魔修长老告诉你：「我们不是滥杀无辜，只是不守正道的规矩。正道说我们是魔，只是因为我们不服从他们。」',
    weight: 5,
    years: 2,
    once: true,
    choices: [
      {
        id: 'reconsider',
        text: '重新审视正魔之分',
        effects: [
          { type: 'stat', key: 'comprehension', value: 8 },
          { type: 'stat', key: 'demonHeart', value: -5 },
          { type: 'stat', key: 'karma', value: 5 },
        ],
      },
      {
        id: 'still_enemy',
        text: '魔道就是魔道，不改立场',
        effects: [
          { type: 'stat', key: 'karma', value: 5 },
          { type: 'cultivation', value: 8 },
        ],
      },
      {
        id: 'learn_demon',
        text: '向魔修请教他们的功法',
        effects: [
          { type: 'cultivation', value: 15 },
          { type: 'stat', key: 'demonHeart', value: 8 },
          { type: 'stat', key: 'comprehension', value: 4 },
        ],
      },
    ],
  },
  {
    id: 'mysterious_old_man',
    title: '杂役老头',
    description:
      '外门有个扫地的老头，谁也不在意他。直到有一天你深夜经过，看到他一掌拍碎了一头三阶妖兽。他看到你，叹了口气：「既然被你看到了，老夫便不再隐瞒。」他自称三百年前的宗门天才，因某些原因自我封印、隐姓埋名。',
    weight: 4,
    years: 2,
    once: true,
    rarity: 'rare',
    choices: [
      {
        id: 'learn_old_man',
        text: '向他请教修炼之道',
        effects: [
          { type: 'cultivation', value: 22 },
          { type: 'stat', key: 'comprehension', value: 8 },
          { type: 'flag', key: 'met_hidden_master', value: true },
        ],
      },
      {
        id: 'keep_secret',
        text: '替他保守秘密',
        effects: [
          { type: 'stat', key: 'karma', value: 10 },
          { type: 'stat', key: 'luck', value: 5 },
        ],
      },
      {
        id: 'report_old_man',
        text: '禀报宗门',
        effects: [
          { type: 'stat', key: 'karma', value: -5 },
          { type: 'spiritStones', value: 20 },
        ],
      },
    ],
  },
  {
    id: 'half_marriage_scroll',
    title: '半张婚书',
    description:
      '你在整理旧物时发现一张泛黄的半张婚书，上面写着你的名字。你忽然想起——年幼时父母曾为你定了娃娃亲，对方是谁不知道，只有这半张婚书。某天婚书突然发烫——对方也在附近。但你已经有了喜欢的人。',
    weight: 4,
    years: 2,
    once: true,
    choices: [
      {
        id: 'seek_match',
        text: '寻找婚书的另一半',
        effects: [
          { type: 'stat', key: 'luck', value: 5 },
          { type: 'stat', key: 'comprehension', value: 3 },
          { type: 'flag', key: 'sought_match', value: true },
        ],
      },
      {
        id: 'burn_scroll',
        text: '烧掉婚书，往事不究',
        effects: [
          { type: 'stat', key: 'demonHeart', value: -3 },
          { type: 'stat', key: 'karma', value: 3 },
        ],
      },
      {
        id: 'keep_scroll',
        text: '收好婚书，日后再看',
        effects: [
          { type: 'stat', key: 'luck', value: 2 },
        ],
      },
    ],
  },
  {
    id: 'letter_from_past',
    title: '褪色的储物戒',
    description:
      '你在古玩摊上买到一枚褪色的储物戒指，里面只有一封信。信纸发黄，是一个母亲写给儿子的：「娘等不到你了，你好好修炼，不要为我报仇。」落款是三百年前。没有署名，只有无尽的思念。',
    weight: 5,
    years: 1,
    once: true,
    choices: [
      {
        id: 'read_letter',
        text: '读完这封信，感慨万千',
        effects: [
          { type: 'stat', key: 'comprehension', value: 5 },
          { type: 'stat', key: 'karma', value: 5 },
          { type: 'stat', key: 'demonHeart', value: -5 },
        ],
      },
      {
        id: 'find_son',
        text: '试着找到信中的儿子',
        effects: [
          { type: 'stat', key: 'karma', value: 10 },
          { type: 'stat', key: 'luck', value: 3 },
          { type: 'flag', key: 'sought_letter_son', value: true },
        ],
      },
    ],
  },
]
