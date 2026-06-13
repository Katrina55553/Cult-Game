import type { GameEvent } from '../types/game'

/** 情缘支线：解救、结识、双修 */
export const ROMANCE_EVENTS: GameEvent[] = [
  {
    id: 'beauty_rescue',
    title: '路遇佳人',
    description:
      '林间传来娇喝与兽吼。你循声赶去，见一名白衣女修正被三头妖狼围困，她灵力将竭，袖裙染血，却仍咬牙祭出一道冰莲护体。',
    weight: 28,
    years: 1,
    once: true,
    conditions: [{ type: 'age', min: 17 }],
    choices: [
      {
        id: 'rescue',
        text: '拔剑相助，救下女修',
        hint: '约七成得手 · 败则两败俱伤',
        outcomes: [
          {
            chance: 0.75,
            luckBonus: 0.004,
            successEffects: [
              { type: 'flag', key: 'rescued_beauty', value: true },
              { type: 'flag', key: 'met_su_qing', value: true },
              { type: 'cultivation', value: 20 },
              { type: 'stat', key: 'karma', value: 12 },
              { type: 'stat', key: 'luck', value: 5 },
            ],
            failEffects: [
              { type: 'lifespan', value: -8 },
              { type: 'cultivation', value: 8 },
              { type: 'flag', key: 'met_su_qing', value: true },
            ],
            narrative: {
              success: '你斩杀妖狼，救下沈霜凝。她欠你一命之恩，目含感激。',
              fail: '你拼力击退妖狼，沈霜凝亦受内伤，二人互相扶持脱险。',
            },
          },
        ],
      },
      {
        id: 'clever',
        text: '以符箓诱敌，智取妖狼',
        hint: '约六成得手 · 需悟性38',
        requirements: [{ type: 'stat', key: 'comprehension', min: 38 }],
        outcomes: [
          {
            chance: 0.65,
            successEffects: [
              { type: 'flag', key: 'rescued_beauty', value: true },
              { type: 'flag', key: 'met_su_qing', value: true },
              { type: 'cultivation', value: 18 },
              { type: 'stat', key: 'comprehension', value: 5 },
              { type: 'spiritStones', value: 30 },
            ],
            failEffects: [
              { type: 'lifespan', value: -10 },
              { type: 'stat', key: 'demonHeart', value: 5 },
            ],
            narrative: {
              success: '符箓连环引爆，妖狼溃散。沈霜凝惊叹你心机缜密，赠灵石以表谢意。',
              fail: '符箓失灵，反被妖狼所伤，沈霜凝扶你遁走，结下一段孽缘。',
            },
          },
        ],
      },
      {
        id: 'leave',
        text: '不动声色，悄然离去',
        narrative: '你压下心头悸动，转身没入林雾。身后娇喝渐弱，道心虽稳，却留了一丝遗憾。',
        effects: [
          { type: 'stat', key: 'demonHeart', value: -5 },
          { type: 'cultivation', value: 5 },
        ],
      },
    ],
  },
  {
    id: 'beauty_gratitude',
    title: '佳人答谢',
    description:
      '沈霜凝持灵茶亲访你的居所，言称那日救命之恩未报，愿以家传心法相赠，并试探你是否愿与她结为道侣，共参大道。',
    weight: 32,
    years: 2,
    once: true,
    conditions: [
      { type: 'flag', key: 'met_su_qing', value: true },
      { type: 'flag', key: 'rescued_beauty', value: true },
    ],
    choices: [
      {
        id: 'companion',
        text: '欣然应允，结为道侣',
        narrative: '你与沈霜凝对天盟誓，结为道侣。冰莲心法与你的功法相融，修为精进，心魔亦散。',
        effects: [
          { type: 'flag', key: 'has_companion', value: true },
          { type: 'flag', key: 'su_qing_companion', value: true },
          { type: 'cultivation', value: 38 },
          { type: 'stat', key: 'comprehension', value: 8 },
          { type: 'stat', key: 'demonHeart', value: -12 },
          { type: 'lifespan', value: 8 },
        ],
      },
      {
        id: 'friend',
        text: '只做挚友，不谈风月',
        narrative: '你以礼相待，只接受心法相赠。沈霜凝浅笑不语，二人结为金兰，彼此砥砺修行。',
        effects: [
          { type: 'flag', key: 'met_su_qing', value: true },
          { type: 'cultivation', value: 18 },
          { type: 'stat', key: 'comprehension', value: 10 },
          { type: 'stat', key: 'luck', value: 5 },
        ],
      },
      {
        id: 'reject',
        text: '婉拒好意，专心修道',
        narrative: '你言明仙途孤峭，不宜牵绊。沈霜凝默然离去，留下一枚温玉，祝你大道有成。',
        effects: [
          { type: 'cultivation', value: 12 },
          { type: 'stat', key: 'comprehension', value: 5 },
          { type: 'spiritStones', value: 40 },
        ],
      },
    ],
  },
  {
    id: 'dual_cultivation',
    title: '月下双修',
    description:
      '月圆之夜，沈霜凝在你洞府外驻足。她提议以双修之法引动阴阳二气，助你们共同冲击修炼瓶颈——此法若成，修为一日千里；若心志不坚，则易生心魔。',
    weight: 26,
    years: 2,
    maxTimes: 2,
    cooldown: 4,
    conditions: [
      { type: 'flag', key: 'has_companion', value: true },
      { type: 'flag', key: 'su_qing_companion', value: true },
      { type: 'flag', key: 'dual_cultivation_mastered', value: false },
      { type: 'realm', min: 'qi_refining_1' },
    ],
    choices: [
      {
        id: 'harmony',
        text: '阴阳调和，循序渐进',
        outcomes: [
          {
            chance: 0.8,
            successEffects: [
              { type: 'cultivation', value: 38 },
              { type: 'stat', key: 'demonHeart', value: -10 },
              { type: 'stat', key: 'comprehension', value: 6 },
              { type: 'flag', key: 'dual_cultivation_done', value: true },
            ],
            failEffects: [
              { type: 'stat', key: 'demonHeart', value: 8 },
              { type: 'cultivation', value: 10 },
            ],
            narrative: {
              success: '月华如水，阴阳交汇。你与沈霜凝气息相融，修为大涨，道心愈发澄澈。',
              fail: '灵气紊乱，双修半途受阻，虽未酿成大祸，却留一丝杂念。',
            },
          },
        ],
      },
      {
        id: 'deep',
        text: '心血相融，行大成双修',
        requirements: [
          { type: 'stat', key: 'comprehension', min: 42 },
          { type: 'stat', key: 'karma', min: 0 },
        ],
        outcomes: [
          {
            chance: 0.58,
            luckBonus: 0.004,
            successEffects: [
              { type: 'cultivation', value: 52 },
              { type: 'stat', key: 'comprehension', value: 12 },
              { type: 'flag', key: 'dual_cultivation_mastered', value: true },
              { type: 'lifespan', value: 20 },
            ],
            failEffects: [
              { type: 'stat', key: 'demonHeart', value: 20 },
              { type: 'stat', key: 'karma', value: -15 },
            ],
            narrative: {
              success: '你们以心血为引，双修大成。天地灵气倒灌入体，寿元延绵，羡煞同门。',
              fail: '欲速则不达，心魔趁虚而入。沈霜凝以冰莲心法替你镇压，代价是因果受损。',
            },
          },
        ],
      },
      {
        id: 'decline',
        text: '守正不移，拒绝速成',
        narrative: '你婉拒双修之请，宁可以苦功渐进。沈霜凝虽遗憾，却更敬重你的道心。',
        effects: [
          { type: 'cultivation', value: 12 },
          { type: 'stat', key: 'karma', value: 8 },
          { type: 'stat', key: 'demonHeart', value: -5 },
        ],
      },
    ],
  },
  {
    id: 'jade_pool_encounter',
    title: '灵泉偶遇',
    description:
      '你在后山寻得一处灵泉，雾气氤氲。泉边竟有一位青衣女修正在疗伤，她察觉你来，慌忙以薄纱遮面，却仍掩不住清冷绝俗之姿。',
    weight: 16,
    years: 1,
    once: true,
    conditions: [
      { type: 'age', min: 18 },
      { type: 'flag', key: 'met_su_qing', value: false },
    ],
    choices: [
      {
        id: 'guard',
        text: '转身守门，为她护法',
        narrative: '你背对灵泉守门三日。女修伤愈出关，自称叶轻眉，愿以灵草相赠，并留下传音符。',
        effects: [
          { type: 'flag', key: 'met_lin_wanyue', value: true },
          { type: 'stat', key: 'karma', value: 15 },
          { type: 'cultivation', value: 12 },
          { type: 'spiritStones', value: 35 },
        ],
      },
      {
        id: 'companion_path',
        text: '以灵泉为媒，结为道侣',
        requirements: [{ type: 'stat', key: 'luck', min: 35 }],
        outcomes: [
          {
            chance: 0.55,
            successEffects: [
              { type: 'flag', key: 'has_companion', value: true },
              { type: 'flag', key: 'met_lin_wanyue', value: true },
              { type: 'cultivation', value: 22 },
              { type: 'stat', key: 'luck', value: 5 },
            ],
            failEffects: [
              { type: 'stat', key: 'karma', value: -8 },
              { type: 'stat', key: 'demonHeart', value: 10 },
            ],
            narrative: {
              success: '叶轻眉见你守礼有度，又气运不俗，遂与你结为道侣，共取灵泉造化。',
              fail: '唐突之举惹她不悦，灵泉灵气反噬，你只得赔礼退走。',
            },
          },
        ],
      },
      {
        id: 'steal',
        text: '趁其疗伤，夺取灵泉',
        narrative: '你趁女修虚弱强占灵泉，修为虽涨，却种下恶因。她愤而离去，誓言他日报复。',
        effects: [
          { type: 'cultivation', value: 20 },
          { type: 'stat', key: 'karma', value: -25 },
          { type: 'stat', key: 'demonHeart', value: 15 },
          { type: 'flag', key: 'beauty_enemy', value: true },
        ],
      },
    ],
  },
  {
    id: 'companion_tribulation',
    title: '道侣共渡劫',
    description:
      '天雷滚滚，你修为将破。道侣执意以双修之法与你共抗天劫——若成，你们双双进阶；若败，则同赴黄泉。',
    weight: 24,
    years: 2,
    once: true,
    conditions: [
      { type: 'flag', key: 'has_companion', value: true },
      { type: 'flag', key: 'su_qing_companion', value: true },
      { type: 'flag', key: 'dual_cultivation_mastered', value: true },
      { type: 'realm', min: 'foundation' },
      { type: 'cultivation', min: 72 },
    ],
    choices: [
      {
        id: 'together',
        text: '与道侣并肩，共抗天雷',
        outcomes: [
          {
            chance: 0.65,
            luckBonus: 0.003,
            successEffects: [
              { type: 'breakthrough' },
              { type: 'cultivation', value: 20 },
              { type: 'stat', key: 'karma', value: 10 },
              { type: 'flag', key: 'survived_together', value: true },
            ],
            failEffects: [
              { type: 'lifespan', value: -25 },
              { type: 'stat', key: 'demonHeart', value: 15 },
            ],
            narrative: {
              success: '雷劫之下，你们阴阳相济，竟双双破境。天边现彩虹，似天地祝福。',
              fail: '天雷过烈，你虽保住性命，道侣却元神受创，需闭关数年。',
            },
          },
        ],
      },
      {
        id: 'solo',
        text: '让她回避，独自渡劫',
        outcomes: [
          {
            chance: 0.45,
            successEffects: [
              { type: 'breakthrough' },
              { type: 'stat', key: 'rootBone', value: 5 },
            ],
            failEffects: [
              { type: 'lifespan', value: -20 },
              { type: 'cultivation', value: -25 },
            ],
            narrative: {
              success: '孤身抗劫，淬体炼魂，破境后体魄更为强韧。',
              fail: '劫雷贯体，突破失败，道侣以灵药救你，修为倒退。',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'lovers_ascension',
    title: '眷侣证道',
    description:
      '你与道侣双修圆满，又曾共渡天劫，金丹大道已成。天地灵气交汇，似在催促你们做出抉择——是携手证道，还是继续求索？',
    weight: 30,
    years: 2,
    once: true,
    conditions: [
      { type: 'flag', key: 'has_companion', value: true },
      { type: 'flag', key: 'dual_cultivation_mastered', value: true },
      { type: 'flag', key: 'survived_together', value: true },
      { type: 'realm', min: 'golden_core' },
      { type: 'stat', key: 'demonHeart', max: 40 },
      { type: 'flag', key: 'chose_lovers_ascension', value: false },
    ],
    choices: [
      {
        id: 'ascend_together',
        text: '携手证道，比翼双飞',
        narrative: '你与沈霜凝心意相通，双双踏入霞光之中，誓共证长生。',
        effects: [
          { type: 'flag', key: 'chose_lovers_ascension', value: true },
          { type: 'cultivation', value: 10 },
        ],
      },
      {
        id: 'continue',
        text: '暂缓飞升，继续修行',
        narrative: '你们约定再砺道心，待境界更稳时再论飞升。',
        effects: [
          { type: 'cultivation', value: 15 },
          { type: 'stat', key: 'comprehension', value: 5 },
          { type: 'lifespan', value: 10 },
        ],
      },
    ],
  },
  {
    id: 'ye_qingmei_reunion',
    title: '再遇叶轻眉',
    description:
      '坊市之中，你忽闻一阵幽香。回首望去，正是当日灵泉边的青衣女修叶轻眉。她见到你，浅浅一笑：「缘分不浅，又见面了。」',
    weight: 14,
    years: 1,
    once: true,
    conditions: [
      { type: 'flag', key: 'met_lin_wanyue', value: true },
      { type: 'flag', key: 'has_companion', value: false },
    ],
    choices: [
      {
        id: 'tea',
        text: '邀她品茶叙旧',
        effects: [
          { type: 'cultivation', value: 12 },
          { type: 'stat', key: 'comprehension', value: 4 },
          { type: 'flag', key: 'ye_qingmei_friend', value: true },
        ],
      },
      {
        id: 'ask_companion',
        text: '试探结为道侣之意',
        requirements: [{ type: 'stat', key: 'luck', min: 40 }],
        effects: [
          { type: 'flag', key: 'has_companion', value: true },
          { type: 'cultivation', value: 18 },
          { type: 'stat', key: 'luck', value: 3 },
        ],
      },
      {
        id: 'farewell',
        text: '点头致意，各自离去',
        effects: [
          { type: 'stat', key: 'karma', value: 3 },
        ],
      },
    ],
  },
  {
    id: 'ye_qingmei_help',
    title: '叶轻眉求助',
    description:
      '叶轻眉传音于你，语气少见地焦急。她发现了一处上古遗迹，但禁制凶险，需要帮手。「我信得过你。」',
    weight: 8,
    years: 2,
    once: true,
    conditions: [{ type: 'flag', key: 'ye_qingmei_friend', value: true }],
    choices: [
      {
        id: 'help_ye',
        text: '即刻前往相助',
        outcomes: [
          {
            chance: 0.55,
            luckBonus: 0.005,
            successEffects: [
              { type: 'spiritStones', value: 40 },
              { type: 'cultivation', value: 18 },
              { type: 'stat', key: 'comprehension', value: 5 },
              { type: 'flag', key: 'ye_qingmei_close', value: true },
            ],
            failEffects: [
              { type: 'lifespan', value: -8 },
              { type: 'cultivation', value: 10 },
            ],
            narrative: {
              success: '你二人联手破开禁制，各有所获。叶轻眉望向你的眼神多了几分暖意。',
              fail: '禁制反噬猛烈，你二人虽脱身，却都受了不轻的伤。',
            },
          },
        ],
      },
      {
        id: 'decline_ye',
        text: '近日闭关，无法分身',
        effects: [
          { type: 'cultivation', value: 5 },
        ],
      },
    ],
  },
]
