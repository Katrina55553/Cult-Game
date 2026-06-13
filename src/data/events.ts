import type { GameEvent } from '../types/game'
import { EXTRA_EVENTS } from './eventsExtra'
import { ROMANCE_EVENTS } from './eventsRomance'
import { SYSTEM_EVENTS } from './eventsSystems'

const CORE_EVENTS: GameEvent[] = [
  {
    id: 'enter_sect',
    title: '入山问道',
    description:
      '天玄宗百年一度的收徒盛会，数百名少年才俊齐聚于巍峨山门之前。执事长老目光如炬，逐一看过众人资质。你置身人群之中，心潮起伏——此乃踏入仙途的第一道门槛。',
    weight: 100,
    years: 0,
    once: true,
    choices: [
      {
        id: 'honest',
        text: '坦然展露灵根，诚心求入',
        effects: [
          { type: 'flag', key: 'loyal_to_sect', value: true },
          { type: 'cultivation', value: 15 },
          { type: 'log', text: '16岁：拜入天玄宗，列为外门弟子。' },
        ],
      },
      {
        id: 'boast',
        text: '虚夸资质，图谋内门之位',
        outcomes: [
          {
            chance: 0.3,
            luckBonus: 0.005,
            successEffects: [
              { type: 'flag', key: 'loyal_to_sect', value: true },
              { type: 'cultivation', value: 25 },
              { type: 'spiritStones', value: 50 },
            ],
            failEffects: [
              { type: 'flag', key: 'loyal_to_sect', value: true },
              { type: 'stat', key: 'karma', value: -10 },
              { type: 'cultivation', value: 10 },
            ],
            narrative: {
              success: '长老慧眼识珠，破例收入内门，并赐下灵石五十枚。',
              fail: '谎言被当场揭穿，仅得外门身份，因果蒙尘。',
            },
          },
        ],
      },
      {
        id: 'refuse',
        text: '拒入宗门，甘为散修',
        effects: [
          { type: 'flag', key: 'refused_all_sects', value: true },
          { type: 'stat', key: 'luck', value: 5 },
          { type: 'cultivation', value: 12 },
          { type: 'log', text: '16岁：婉拒宗门，独行于天地之间。' },
        ],
      },
    ],
  },
  {
    id: 'cave_inheritance',
    title: '古洞秘藏',
    description:
      '你于后山禁地边缘，偶然寻得一座被重重封印所护的古洞府。石门之上篆文流转不息，灵气丝丝外泄，似藏着一段机缘，却也暗伏凶险。',
    weight: 15,
    years: 2,
    once: true,
    conditions: [{ type: 'realm', min: 'qi_refining_1' }],
    choices: [
      {
        id: 'force',
        text: '以力破阵，强行闯入',
        outcomes: [
          {
            chance: 0.35,
            luckBonus: 0.004,
            successEffects: [
              { type: 'artifact', id: 'ancient_sword', name: '古剑' },
              { type: 'stat', key: 'comprehension', value: 8 },
              { type: 'flag', key: 'got_inheritance', value: true },
              { type: 'cultivation', value: 20 },
            ],
            failEffects: [
              { type: 'lifespan', value: -15 },
              { type: 'stat', key: 'demonHeart', value: 10 },
            ],
            narrative: {
              success: '阵法告破，你得古剑残卷，道基为之大进。',
              fail: '禁制反噬，你负伤遁走，寿元折损，心魔渐生。',
            },
          },
        ],
      },
      {
        id: 'comprehend',
        text: '凝神静参门上符文',
        requirements: [{ type: 'stat', key: 'comprehension', min: 35 }],
        effects: [
          { type: 'stat', key: 'comprehension', value: 12 },
          { type: 'flag', key: 'got_inheritance', value: true },
          { type: 'cultivation', value: 15 },
        ],
      },
      {
        id: 'mark',
        text: '暗记方位，改日再来',
        effects: [
          { type: 'flag', key: 'cave_marked', value: true },
          { type: 'stat', key: 'luck', value: 3 },
        ],
      },
    ],
  },
  {
    id: 'market_find',
    title: '坊市觅宝',
    description:
      '坊市一角，一落魄修士设摊叫卖"上古奇珍"。满目皆为赝品劣货，但你眸光一闪，瞥见其中一件器物微微泛起灵光，转瞬即逝。',
    rarity: 'rare',
    weight: 9,
    years: 1,
    once: true,
    choices: [
      {
        id: 'buy',
        text: '以三十灵石购入',
        requirements: [{ type: 'resource', key: 'spiritStones', min: 30 }],
        outcomes: [
          {
            chance: 0.5,
            luckBonus: 0.006,
            successEffects: [
              { type: 'spiritStones', value: -30 },
              { type: 'artifact', id: 'spirit_pendant', name: '灵玉佩' },
              { type: 'stat', key: 'luck', value: 5 },
              { type: 'cultivation', value: 10 },
            ],
            failEffects: [
              { type: 'spiritStones', value: -30 },
              { type: 'stat', key: 'karma', value: -5 },
            ],
            narrative: {
              success: '果不其然，乃一枚灵玉佩，佩戴之后气运大增。',
              fail: '购得之物竟是仿造赝品，灵石白白折损。',
            },
          },
        ],
      },
      {
        id: 'bargain',
        text: '狠压至十灵石',
        requirements: [{ type: 'resource', key: 'spiritStones', min: 10 }],
        outcomes: [
          {
            chance: 0.25,
            successEffects: [
              { type: 'spiritStones', value: -10 },
              { type: 'spiritStones', value: 25 },
              { type: 'cultivation', value: 5 },
            ],
            failEffects: [
              { type: 'stat', key: 'karma', value: -3 },
            ],
            narrative: {
              success: '摊主恼羞成怒低价甩卖，你竟意外得了一块灵石原矿。',
              fail: '摊主勃然翻脸，将你驱离摊前。',
            },
          },
        ],
      },
      {
        id: 'ignore',
        text: '视若无睹，拂袖而过',
        effects: [{ type: 'stat', key: 'comprehension', value: 2 }],
      },
    ],
  },
  {
    id: 'peer_trap',
    title: '同门暗算',
    description:
      '同门师兄赵天行前来相邀，言称共探秘境，言辞恳切。但你察觉其目光游移闪烁，分明暗藏祸心。',
    weight: 10,
    years: 1,
    once: true,
    storyGroup: 'sect_intrigue',
    conditions: [{ type: 'flag', key: 'loyal_to_sect', value: true }],
    choices: [
      {
        id: 'expose',
        text: '当众揭发，禀报长老',
        outcomes: [
          {
            chance: 0.6,
            successEffects: [
              { type: 'stat', key: 'karma', value: 10 },
              { type: 'spiritStones', value: 30 },
              { type: 'flag', key: 'became_elder', value: true },
            ],
            failEffects: [
              { type: 'stat', key: 'demonHeart', value: 8 },
              { type: 'cultivation', value: -5 },
            ],
            narrative: {
              success: '长老赞许你秉性刚正，赏灵石三十，并记你为宗门功臣。',
              fail: '反遭对方倒打一耙，受罚禁闭思过，心魔暗伏。',
            },
          },
        ],
      },
      {
        id: 'play_along',
        text: '将计就计，暗设反局',
        requirements: [{ type: 'stat', key: 'comprehension', min: 40 }],
        outcomes: [
          {
            chance: 0.55,
            successEffects: [
              { type: 'spiritStones', value: 50 },
              { type: 'cultivation', value: 15 },
              { type: 'stat', key: 'comprehension', value: 5 },
            ],
            failEffects: [
              { type: 'lifespan', value: -10 },
              { type: 'stat', key: 'demonHeart', value: 15 },
            ],
            narrative: {
              success: '反夺其机缘，获灵石五十，修为亦有所精进。',
              fail: '计策败露，遭其重创，寿元折损。',
            },
          },
        ],
      },
      {
        id: 'avoid',
        text: '委婉回绝，敬而远之',
        effects: [
          { type: 'stat', key: 'demonHeart', value: -3 },
          { type: 'cultivation', value: 5 },
        ],
      },
    ],
  },
  {
    id: 'beast_attack',
    title: '妖狼夜袭',
    description:
      '月黑风高，你穿行于密林之中，忽觉一股腥风扑面而来。一头二阶妖狼自暗影中窜出，双瞳赤红如血，利爪森然似刃。',
    weight: 10,
    years: 1,
    once: true,
    choices: [
      {
        id: 'fight',
        text: '正面交锋',
        hint: '约四成胜算 · 败则重伤',
        outcomes: [
          {
            chance: 0.38,
            luckBonus: 0.002,
            successEffects: [
              { type: 'cultivation', value: 18 },
              { type: 'spiritStones', value: 20 },
              { type: 'stat', key: 'rootBone', value: 3 },
            ],
            failEffects: [
              { type: 'lifespan', value: -12 },
              { type: 'stat', key: 'demonHeart', value: 10 },
              { type: 'cultivation', value: -8 },
            ],
            narrative: {
              success: '一番苦战终斩妖狼，取其妖丹，体魄愈发强横。',
              fail: '不敌妖狼凶威，重伤遁逃，寿元折损，心魔渐起。',
            },
          },
        ],
      },
      {
        id: 'flee',
        text: '催动遁术逃离',
        hint: '较安全 · 收益低',
        outcomes: [
          {
            chance: 0.7,
            successEffects: [{ type: 'cultivation', value: 5 }],
            failEffects: [
              { type: 'lifespan', value: -5 },
              { type: 'stat', key: 'demonHeart', value: 5 },
            ],
            narrative: {
              success: '安然脱身，虽无所获，却保全了性命。',
              fail: '遁术未及施展，后背被利爪划伤，道心微动。',
            },
          },
        ],
      },
      {
        id: 'tame',
        text: '以神识之力降伏',
        hint: '需悟性45 · 高风险高回报',
        requirements: [{ type: 'stat', key: 'comprehension', min: 45 }],
        outcomes: [
          {
            chance: 0.2,
            successEffects: [
              { type: 'spiritBeast', name: '妖狼', tier: 1 },
              { type: 'stat', key: 'luck', value: 8 },
              { type: 'cultivation', value: 12 },
            ],
            failEffects: [
              { type: 'lifespan', value: -12 },
              { type: 'stat', key: 'demonHeart', value: 15 },
              { type: 'cultivation', value: -8 },
            ],
            narrative: {
              success: '神识贯入妖狼识海，妖兽俯首帖耳，化为你的灵宠。',
              fail: '神识遭猛烈反噬，元神受创，你踉跄退走。',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'elder_lecture',
    title: '长老授业',
    description:
      '宗门长老于论道台上开坛说法，百余名弟子盘膝而坐，凝神聆听。天地灵气随着道音流转回旋，令人周身通泰。',
    weight: 9,
    years: 2,
    maxTimes: 2,
    cooldown: 4,
    conditions: [{ type: 'flag', key: 'loyal_to_sect', value: true }],
    choices: [
      {
        id: 'attend',
        text: '正襟危坐，悉心聆听',
        narrative: '道音如潮灌入耳中，你澄心静虑，灵气随讲道流转周天，修为精进，悟性亦有长进。',
        effects: [
          { type: 'cultivation', value: 20 },
          { type: 'stat', key: 'comprehension', value: 5 },
        ],
      },
      {
        id: 'ask',
        text: '起身请教修行疑难',
        requirements: [{ type: 'stat', key: 'comprehension', min: 30 }],
        narrative: '你起身发问，长老含笑作答，令你豁然开朗。四座侧目，长老亦将你视为可造之材。',
        effects: [
          { type: 'cultivation', value: 25 },
          { type: 'stat', key: 'comprehension', value: 8 },
          { type: 'flag', key: 'became_elder', value: true },
        ],
      },
      {
        id: 'sleep',
        text: '昏然欲寐，心不在焉',
        narrative: '你神思恍惚，长老微微蹙眉，同门窃笑不已。虽略有微末所得，因果却添一笔折损。',
        effects: [
          { type: 'cultivation', value: 5 },
          { type: 'stat', key: 'karma', value: -5 },
        ],
      },
    ],
  },
  {
    id: 'herb_gather',
    title: '采药遇险',
    rarity: 'rare',
    description:
      '药园幽深处，一株百年灵草散发着沁人清香。然而近旁有毒蛇盘踞守候，采摘之事实非易事。',
    weight: 8,
    years: 1,
    once: true,
    choices: [
      {
        id: 'careful',
        text: '小心谨慎，徐徐采摘',
        outcomes: [
          {
            chance: 0.75,
            successEffects: [
              { type: 'spiritStones', value: 25 },
              { type: 'stat', key: 'comprehension', value: 3 },
              { type: 'flag', key: 'mastered_alchemy', value: true },
            ],
            failEffects: [
              { type: 'lifespan', value: -8 },
            ],
            narrative: {
              success: '灵草到手，你对炼丹之道亦有了些许感悟。',
              fail: '不慎被毒蛇噬咬，虽得灵草，寿元却有所损耗。',
            },
          },
        ],
      },
      {
        id: 'rush',
        text: '速战速决，铤而走险',
        outcomes: [
          {
            chance: 0.4,
            successEffects: [
              { type: 'spiritStones', value: 40 },
              { type: 'cultivation', value: 10 },
            ],
            failEffects: [
              { type: 'lifespan', value: -15 },
              { type: 'stat', key: 'demonHeart', value: 8 },
            ],
            narrative: {
              success: '险中取胜，你夺得一株珍稀灵草。',
              fail: '毒蛇暴起发难，你重伤败退，心魔乘虚而入。',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'demon_whisper',
    title: '心魔萌动',
    description:
      '闭关之时，心底忽起阵阵低语，蛊惑你弃正道而修魔功。魔功进境虽可一日千里，然因果之重难以估量。',
    weight: 10,
    years: 2,
    once: true,
    conditions: [{ type: 'realm', min: 'qi_refining_2' }],
    choices: [
      {
        id: 'resist',
        text: '抱元守一，强行镇压',
        outcomes: [
          {
            chance: 0.65,
            successEffects: [
              { type: 'stat', key: 'demonHeart', value: -10 },
              { type: 'stat', key: 'karma', value: 5 },
              { type: 'cultivation', value: 10 },
            ],
            failEffects: [
              { type: 'stat', key: 'demonHeart', value: 15 },
            ],
            narrative: {
              success: '道心坚如磐石，心魔溃散，修为更上一层。',
              fail: '心魔难以根除，虽未入魔，暗根已然种下。',
            },
          },
        ],
      },
      {
        id: 'accept',
        text: '侧耳倾听，试探魔道',
        hint: '约五成失控 · 修为涨或心魔反噬',
        outcomes: [
          {
            chance: 0.5,
            successEffects: [
              { type: 'cultivation', value: 30 },
              { type: 'stat', key: 'demonHeart', value: 15 },
            ],
            failEffects: [
              { type: 'flag', key: 'accepted_demon_path', value: true },
              { type: 'stat', key: 'demonHeart', value: 30 },
              { type: 'cultivation', value: 10 },
            ],
            narrative: {
              success: '你堪堪驾驭魔音，偶有所悟，修为小进。',
              fail: '魔音反客为主，你被推向魔道深渊，心魔大炽。',
            },
          },
        ],
      },
      {
        id: 'seek_help',
        text: '出关请长老开导',
        requirements: [{ type: 'flag', key: 'loyal_to_sect', value: true }],
        effects: [
          { type: 'stat', key: 'demonHeart', value: -15 },
          { type: 'cultivation', value: 15 },
          { type: 'stat', key: 'karma', value: 8 },
        ],
      },
    ],
  },
  {
    id: 'foundation_tribulation',
    title: '筑基雷劫',
    description:
      '修为圆满，天劫应期而至。乌云翻涌遮天蔽日，雷霆如龙蛇狂舞，此乃踏入筑基境界的生死之关。',
    weight: 20,
    years: 3,
    once: true,
    conditions: [
      { type: 'realm', min: 'qi_refining_3' },
      { type: 'cultivation', min: 80 },
    ],
    choices: [
      {
        id: 'hard',
        text: '凭肉身硬撼天雷',
        hint: '约四成得手 · 败则重伤',
        outcomes: [
          {
            chance: 0.4,
            luckBonus: 0.004,
            successEffects: [
              { type: 'breakthrough' },
              { type: 'stat', key: 'rootBone', value: 10 },
            ],
            failEffects: [
              { type: 'lifespan', value: -30 },
              { type: 'cultivation', value: -35 },
              { type: 'stat', key: 'demonHeart', value: 12 },
              { type: 'flag', key: 'grievously_wounded', value: true },
            ],
            narrative: {
              success: '雷劫历尽，筑基功成，肉身百炼成钢。',
              fail: '天雷贯体而过，道基崩裂，你重伤退场，筑基未成。',
            },
          },
        ],
      },
      {
        id: 'artifact',
        text: '祭出法宝抵挡雷劫',
        requirements: [{ type: 'stat', key: 'comprehension', min: 40 }],
        outcomes: [
          {
            chance: 0.6,
            successEffects: [
              { type: 'breakthrough' },
              { type: 'cultivation', value: 10 },
            ],
            failEffects: [
              { type: 'lifespan', value: -20 },
              { type: 'stat', key: 'demonHeart', value: 10 },
            ],
            narrative: {
              success: '法宝护持周全，有惊无险，你顺利筑基。',
              fail: '法宝承受不住雷威碎裂，你勉强保命，筑基功亏一篑。',
            },
          },
        ],
      },
      {
        id: 'pill',
        text: '吞服护劫灵丹',
        requirements: [{ type: 'resource', key: 'spiritStones', min: 50 }],
        outcomes: [
          {
            chance: 0.75,
            successEffects: [
              { type: 'breakthrough' },
              { type: 'spiritStones', value: -50 },
            ],
            failEffects: [
              { type: 'spiritStones', value: -50 },
              { type: 'cultivation', value: -20 },
            ],
            narrative: {
              success: '灵丹药力发作，你安然渡劫，迈入筑基之境。',
              fail: '灵丹品质欠佳，雷劫未能化解，修为倒退。',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'sect_tournament',
    title: '门内比武',
    description:
      '天玄宗门内大比拉开帷幕，弟子们个个摩拳擦掌。夺魁者可获灵石丹药，更有机会被长老收为亲传。',
    weight: 12,
    years: 2,
    maxTimes: 2,
    cooldown: 6,
    conditions: [
      { type: 'realm', min: 'foundation' },
      { type: 'flag', key: 'loyal_to_sect', value: true },
    ],
    choices: [
      {
        id: 'compete',
        text: '登台比试，竭尽全力',
        outcomes: [
          {
            chance: 0.5,
            luckBonus: 0.003,
            successEffects: [
              { type: 'spiritStones', value: 80 },
              { type: 'cultivation', value: 20 },
              { type: 'flag', key: 'became_elder', value: true },
              { type: 'stat', key: 'rootBone', value: 5 },
            ],
            failEffects: [
              { type: 'stat', key: 'demonHeart', value: 8 },
              { type: 'cultivation', value: 5 },
            ],
            narrative: {
              success: '你技压群雄拔得头筹，声名远播。',
              fail: '首轮即遭淘汰，虽败犹有所获。',
            },
          },
        ],
      },
      {
        id: 'observe',
        text: '旁观悟道，不参战',
        effects: [
          { type: 'stat', key: 'comprehension', value: 8 },
          { type: 'cultivation', value: 10 },
        ],
      },
    ],
  },
  {
    id: 'demon_temptation',
    title: '魔修引诱',
    description:
      '一名魔修不知从何处现身，许以无上魔功，条件仅是取一无辜之人的性命。杀意与贪念交织涌来，你的道心正面临严峻的考验。',
    weight: 10,
    years: 1,
    once: true,
    conditions: [{ type: 'realm', min: 'foundation' }],
    choices: [
      {
        id: 'reject',
        text: '断然回绝，拔剑斩魔',
        outcomes: [
          {
            chance: 0.55,
            successEffects: [
              { type: 'stat', key: 'karma', value: 15 },
              { type: 'cultivation', value: 15 },
              { type: 'spiritStones', value: 40 },
            ],
            failEffects: [
              { type: 'lifespan', value: -15 },
              { type: 'stat', key: 'demonHeart', value: 10 },
            ],
            narrative: {
              success: '魔修伏诛，你正道之名传扬四方，并缴获不少战利品。',
              fail: '魔修遁形而去，你反受其伤，心魔暗中滋长。',
            },
          },
        ],
      },
      {
        id: 'accept',
        text: '纳受魔功，献祭无辜',
        effects: [
          { type: 'flag', key: 'accepted_demon_path', value: true },
          { type: 'stat', key: 'demonHeart', value: 35 },
          { type: 'stat', key: 'karma', value: -40 },
          { type: 'cultivation', value: 35 },
        ],
      },
      {
        id: 'pretend',
        text: '佯装应允，伺机反戈',
        requirements: [{ type: 'stat', key: 'comprehension', min: 50 }],
        outcomes: [
          {
            chance: 0.45,
            successEffects: [
              { type: 'cultivation', value: 25 },
              { type: 'spiritStones', value: 60 },
              { type: 'stat', key: 'comprehension', value: 5 },
            ],
            failEffects: [
              { type: 'flag', key: 'accepted_demon_path', value: true },
              { type: 'stat', key: 'demonHeart', value: 20 },
            ],
            narrative: {
              success: '趁其不备反杀成功，夺取魔修储物袋。',
              fail: '伪装被识破，你被迫修习魔功，心魔大炽。',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'ancient_legacy',
    title: '先贤遗泽',
    description:
      '秘境深处，一位古修遗骸端坐于蒲团之上，面前悬浮着一枚温润玉简，似有毕生传承静候有缘之人。',
    weight: 8,
    years: 3,
    once: true,
    conditions: [{ type: 'realm', min: 'foundation' }],
    choices: [
      {
        id: 'inherit',
        text: '叩首受传',
        outcomes: [
          {
            chance: 0.55,
            luckBonus: 0.005,
            successEffects: [
              { type: 'flag', key: 'got_inheritance', value: true },
              { type: 'stat', key: 'comprehension', value: 15 },
              { type: 'cultivation', value: 30 },
              { type: 'artifact', id: 'jade_slip', name: '传承玉简' },
            ],
            failEffects: [
              { type: 'stat', key: 'demonHeart', value: 12 },
            ],
            narrative: {
              success: '玉简化作流光没入眉心，古修传承尽归于你，大道有望。',
              fail: '传承之力排斥你的神识，你受创退开，心魔暗伏。',
            },
          },
        ],
      },
      {
        id: 'loot',
        text: '只取遗物，不受传承',
        hint: '约六成得手 · 败则触怒禁制',
        outcomes: [
          {
            chance: 0.55,
            successEffects: [
              { type: 'spiritStones', value: 100 },
              { type: 'stat', key: 'karma', value: -15 },
              { type: 'cultivation', value: 10 },
            ],
            failEffects: [
              { type: 'stat', key: 'karma', value: -25 },
              { type: 'lifespan', value: -10 },
              { type: 'stat', key: 'demonHeart', value: 12 },
            ],
            narrative: {
              success: '你悄然取走遗物，迅速抽身离去。',
              fail: '禁制骤然发作，你受伤逃遁，因果大损。',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'dao_companion',
    title: '道侣之缘',
    description:
      '秘境深处，一位身着紫衣的女修与你不期而遇。她自称来自南海，灵根资质颇佳，欲与你结为道侣，同参大道。',
    weight: 10,
    years: 2,
    once: true,
    conditions: [
      { type: 'realm', min: 'foundation' },
      { type: 'flag', key: 'has_companion', value: false },
      { type: 'flag', key: 'met_su_qing', value: false },
    ],
    choices: [
      {
        id: 'accept',
        text: '缔结道侣，双修同进',
        narrative: '你与紫衣女修对天盟誓，结为道侣。二人功法相辅相成，修为日进千里。',
        effects: [
          { type: 'flag', key: 'has_companion', value: true },
          { type: 'cultivation', value: 25 },
          { type: 'stat', key: 'demonHeart', value: -8 },
        ],
      },
      {
        id: 'decline',
        text: '以礼相辞，潜心修道',
        narrative: '你恭送女修离去，她赞叹你道心坚定，赠你一枚玉佩后飘然而去。',
        effects: [
          { type: 'cultivation', value: 15 },
          { type: 'stat', key: 'comprehension', value: 5 },
        ],
      },
      {
        id: 'betray',
        text: '趁其不备，夺其造化',
        narrative: '你暗施手段偷袭女修，夺走她的储物袋。修为虽有长进，因果大损，心魔渐生。',
        effects: [
          { type: 'spiritStones', value: 80 },
          { type: 'stat', key: 'karma', value: -30 },
          { type: 'stat', key: 'demonHeart', value: 20 },
          { type: 'cultivation', value: 20 },
        ],
      },
    ],
  },
  {
    id: 'secret_realm',
    title: '洞天现世',
    description:
      '天地忽生异象，一座上古洞天裂空而出。四方修士闻风而动蜂拥而至，机缘与杀机并存其间。',
    weight: 10,
    years: 3,
    once: true,
    conditions: [{ type: 'realm', min: 'foundation' }],
    choices: [
      {
        id: 'explore',
        text: '深入洞天腹地',
        hint: '约四成得手 · 败则重伤',
        outcomes: [
          {
            chance: 0.4,
            luckBonus: 0.005,
            successEffects: [
              { type: 'cultivation', value: 35 },
              { type: 'artifact', id: 'realm_token', name: '秘境令牌' },
              { type: 'spiritStones', value: 120 },
            ],
            failEffects: [
              { type: 'lifespan', value: -20 },
              { type: 'cultivation', value: -25 },
              { type: 'stat', key: 'demonHeart', value: 10 },
              { type: 'flag', key: 'grievously_wounded', value: true },
            ],
            narrative: {
              success: '腹地之中重宝在手，修为暴涨。',
              fail: '遭遇空间裂缝，你被震出洞天，重伤濒死却侥幸保命。',
            },
          },
        ],
      },
      {
        id: 'periphery',
        text: '在外围搜刮',
        effects: [
          { type: 'spiritStones', value: 40 },
          { type: 'cultivation', value: 15 },
        ],
      },
      {
        id: 'skip',
        text: '谨慎旁观，不涉险地',
        effects: [
          { type: 'stat', key: 'comprehension', value: 5 },
          { type: 'cultivation', value: 8 },
        ],
      },
    ],
  },
  {
    id: 'alchemy_master',
    title: '炼丹悟道',
    description:
      '你偶得一卷丹方残篇，可炼九转金丹。需备齐诸般灵草，闭关七七四十九日方可开炉。',
    weight: 8,
    years: 5,
    once: true,
    conditions: [
      { type: 'flag', key: 'mastered_alchemy', value: true },
      { type: 'realm', min: 'foundation' },
    ],
    choices: [
      {
        id: 'refine',
        text: '闭关开炉炼丹',
        outcomes: [
          {
            chance: 0.45,
            luckBonus: 0.004,
            successEffects: [
              { type: 'flag', key: 'mastered_alchemy', value: true },
              { type: 'flag', key: 'golden_pill_refined', value: true },
              { type: 'alchemyTier', value: 3 },
              { type: 'cultivation', value: 30 },
              { type: 'stat', key: 'comprehension', value: 10 },
              { type: 'lifespan', value: 30 },
            ],
            failEffects: [
              { type: 'stat', key: 'demonHeart', value: 10 },
              { type: 'cultivation', value: -10 },
            ],
            narrative: {
              success: '金丹九转功成，药香弥漫四野，你的丹道造诣登峰造极。',
              fail: '丹炉骤然炸裂，炉火反噬，你受伤不轻，心魔暗生。',
            },
          },
        ],
      },
      {
        id: 'study',
        text: '只研丹方，暂不开炉',
        effects: [
          { type: 'stat', key: 'comprehension', value: 8 },
          { type: 'cultivation', value: 10 },
        ],
      },
    ],
  },
  {
    id: 'golden_tribulation',
    title: '金丹雷劫',
    description:
      '金丹将成，天劫再度降临。此番雷劫威势远胜筑基之时十倍有余，稍有差池便是灰飞烟灭之局。',
    weight: 15,
    years: 5,
    once: true,
    conditions: [
      { type: 'realm', min: 'foundation' },
      { type: 'cultivation', min: 90 },
    ],
    choices: [
      {
        id: 'endure',
        text: '以血肉之躯硬扛雷劫',
        hint: '约三成得手 · 败则身死',
        outcomes: [
          {
            chance: 0.35,
            luckBonus: 0.003,
            successEffects: [
              { type: 'breakthrough' },
              { type: 'stat', key: 'rootBone', value: 8 },
            ],
            failEffects: [
              { type: 'flag', key: 'died_in_tribulation', value: true },
            ],
            narrative: {
              success: '雷霆退散，金丹凝结，光华万道。',
              fail: '天威之下，身死道消。',
            },
          },
        ],
      },
      {
        id: 'array',
        text: '布设护体阵法',
        requirements: [{ type: 'stat', key: 'comprehension', min: 55 }],
        outcomes: [
          {
            chance: 0.55,
            successEffects: [{ type: 'breakthrough' }],
            failEffects: [
              { type: 'lifespan', value: -25 },
              { type: 'cultivation', value: -30 },
            ],
            narrative: {
              success: '阵法堪堪挡住雷劫，你金丹大成。',
              fail: '阵法崩溃，你勉强苟全性命，金丹终未成形。',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'lifespan_crisis',
    title: '暮年将至',
    description:
      '你感知到体内生机如流水般逝去，鬓发渐白、面容渐老。若寻不到续命之法，大限恐在眼前。',
    weight: 12,
    years: 2,
    once: true,
    conditions: [{ type: 'lifespan_remaining', max: 15 }],
    choices: [
      {
        id: 'search_pill',
        text: '四处求购续命丹药',
        requirements: [{ type: 'resource', key: 'spiritStones', min: 80 }],
        outcomes: [
          {
            chance: 0.5,
            successEffects: [
              { type: 'lifespan', value: 30 },
              { type: 'spiritStones', value: -80 },
            ],
            failEffects: [
              { type: 'spiritStones', value: -80 },
              { type: 'stat', key: 'demonHeart', value: 10 },
            ],
            narrative: {
              success: '幸得续命灵丹，寿元再延三十载。',
              fail: '所购丹药毫无效用，灵石尽付东流，心魔渐起。',
            },
          },
        ],
      },
      {
        id: 'breakthrough',
        text: '孤注一掷，以破境求寿',
        outcomes: [
          {
            chance: 0.3,
            successEffects: [
              { type: 'breakthrough' },
            ],
            failEffects: [
              { type: 'lifespan', value: -10 },
            ],
            narrative: {
              success: '破境功成，寿元大增。',
              fail: '突破未果，寿元愈发紧迫。',
            },
          },
        ],
      },
      {
        id: 'accept',
        text: '坦然受命，安排后事',
        hint: '因果清正 · 本回合后寿尽坐化',
        narrative: '你将毕生修行感悟编撰成册，传予后辈弟子，而后安然坐化。',
        effects: [
          { type: 'stat', key: 'karma', value: 10 },
          { type: 'stat', key: 'demonHeart', value: -15 },
          { type: 'endLife' },
        ],
      },
    ],
  },
  {
    id: 'demon_tribulation',
    title: '心魔大劫',
    description:
      '修行到了紧要关头，心魔忽然化形而出，幻作你内心最深处的恐惧与执念，直扑而来。',
    weight: 10,
    years: 3,
    maxTimes: 2,
    cooldown: 8,
    conditions: [
      { type: 'stat', key: 'demonHeart', min: 40 },
      { type: 'realm', min: 'foundation' },
    ],
    choices: [
      {
        id: 'face',
        text: '正面迎击，以道心斩灭心魔',
        outcomes: [
          {
            chance: 0.5,
            successEffects: [
              { type: 'stat', key: 'demonHeart', value: -30 },
              { type: 'cultivation', value: 25 },
              { type: 'stat', key: 'comprehension', value: 8 },
            ],
            failEffects: [
              { type: 'stat', key: 'demonHeart', value: 25 },
              { type: 'flag', key: 'accepted_demon_path', value: true },
            ],
            narrative: {
              success: '心魔应声而灭，道心澄澈如镜，修为突飞猛进。',
              fail: '道心失守，心魔鸠占鹊巢，你已站在魔道的边缘。',
            },
          },
        ],
      },
      {
        id: 'merge',
        text: '与心魔合一，以魔入道',
        effects: [
          { type: 'flag', key: 'accepted_demon_path', value: true },
          { type: 'stat', key: 'demonHeart', value: 40 },
          { type: 'cultivation', value: 40 },
        ],
      },
    ],
  },
  {
    id: 'final_choice',
    title: '飞升抉择',
    description:
      '天地异象骤起，飞升通道洞开于前。你可飞升成仙，亦可留驻人间守护苍生，或堕入魔道改写天规——一念之间，命运迥然不同。',
    weight: 20,
    years: 1,
    once: true,
    conditions: [{ type: 'realm', min: 'nascent_soul' }],
    choices: [
      {
        id: 'ascend',
        text: '步入飞升通道，追寻仙道',
        requirements: [
          { type: 'stat', key: 'demonHeart', max: 30 },
          { type: 'flag', key: 'got_inheritance', value: true },
        ],
        effects: [
          { type: 'flag', key: 'chose_ascension', value: true },
          { type: 'cultivation', value: 10 },
        ],
      },
      {
        id: 'stay',
        text: '留守人间，做一方地仙',
        effects: [
          { type: 'flag', key: 'chose_stay', value: true },
          { type: 'cultivation', value: 20 },
          { type: 'lifespan', value: 50 },
        ],
      },
      {
        id: 'demon',
        text: '以魔证道，打破飞升天规',
        effects: [
          { type: 'flag', key: 'accepted_demon_path', value: true },
          { type: 'stat', key: 'demonHeart', value: 50 },
          { type: 'cultivation', value: 30 },
        ],
      },
      {
        id: 'retire',
        text: '弃绝仙途，回归红尘',
        effects: [
          { type: 'flag', key: 'gave_up_cultivation', value: true },
        ],
      },
    ],
  },
  {
    id: 'outer_sect_life',
    title: '外门琐务',
    description:
      '入门已有数月，你每日挑水斫柴、洒扫殿宇，修为进展甚缓。今日执事师兄分派新差：灵田除草可近灵气修行，丹房帮佣可窥丹道门径，巡山值夜可磨砺心志。',
    weight: 25,
    years: 1,
    once: true,
    conditions: [
      { type: 'realm', min: 'qi_refining_1' },
      { type: 'flag', key: 'loyal_to_sect', value: true },
    ],
    choices: [
      {
        id: 'field',
        text: '灵田除草，借灵气修炼',
        effects: [
          { type: 'cultivation', value: 12 },
          { type: 'stat', key: 'comprehension', value: 2 },
        ],
      },
      {
        id: 'alchemy',
        text: '丹房帮佣，暗学丹道',
        effects: [
          { type: 'alchemyTier', value: 1 },
          { type: 'cultivation', value: 8 },
        ],
      },
      {
        id: 'patrol',
        text: '巡山值夜，砥砺心性',
        effects: [
          { type: 'stat', key: 'rootBone', value: 3 },
          { type: 'stat', key: 'karma', value: 5 },
        ],
      },
    ],
  },
  {
    id: 'inner_sect_trial',
    title: '内门试炼',
    description:
      '天玄宗一年一度的内门考核如期而至。三道关隘依次设下：灵阵幻境考验心性，御剑飞行考验根骨，擂台对战考验实战。过关者可晋升内门弟子，享有更多修炼资源。',
    weight: 22,
    years: 1,
    once: true,
    conditions: [
      { type: 'realm', min: 'qi_refining_2' },
      { type: 'flag', key: 'loyal_to_sect', value: true },
    ],
    choices: [
      {
        id: 'heart',
        text: '凭心性闯幻境之关',
        effects: [
          { type: 'flag', key: 'inner_disciple', value: true },
          { type: 'cultivation', value: 15 },
          { type: 'spiritStones', value: 20 },
          { type: 'stat', key: 'karma', value: 8 },
        ],
      },
      {
        id: 'body',
        text: '凭根骨闯御剑之关',
        effects: [
          { type: 'flag', key: 'inner_disciple', value: true },
          { type: 'cultivation', value: 15 },
          { type: 'stat', key: 'rootBone', value: 5 },
        ],
      },
      {
        id: 'fight',
        text: '凭实战闯擂台之关',
        outcomes: [
          {
            chance: 0.55,
            luckBonus: 0.004,
            successEffects: [
              { type: 'flag', key: 'inner_disciple', value: true },
              { type: 'cultivation', value: 20 },
              { type: 'stat', key: 'rootBone', value: 3 },
              { type: 'spiritStones', value: 30 },
            ],
            failEffects: [
              { type: 'cultivation', value: 8 },
              { type: 'stat', key: 'demonHeart', value: 5 },
            ],
            narrative: {
              success: '你以凌厉剑招击败对手，破格晋升内门，并获灵石三十之赏。',
              fail: '擂台上惜败于人，仍是外门弟子，但实战阅历大为增长。',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'world_travel',
    title: '入世历练',
    description:
      '修为初有所成，师尊遣你下山入世历练。红尘滚滚，机缘与凶险并存。你行至一处三岔路口：繁华都城车水马龙，深山古刹钟磬悠扬，荒野古道黄沙蔽日。',
    weight: 18,
    years: 2,
    once: true,
    conditions: [{ type: 'realm', min: 'qi_refining_3' }],
    choices: [
      {
        id: 'city',
        text: '入繁华都城，阅尽人间百态',
        effects: [
          { type: 'spiritStones', value: 25 },
          { type: 'stat', key: 'luck', value: 4 },
          { type: 'stat', key: 'karma', value: 6 },
        ],
      },
      {
        id: 'temple',
        text: '入深山古刹，寻访隐世高人',
        outcomes: [
          {
            chance: 0.5,
            luckBonus: 0.005,
            successEffects: [
              { type: 'cultivation', value: 20 },
              { type: 'stat', key: 'comprehension', value: 6 },
              { type: 'hint', text: '古刹高人指点迷津' },
            ],
            failEffects: [
              { type: 'cultivation', value: 8 },
              { type: 'stat', key: 'comprehension', value: 2 },
            ],
            narrative: {
              success: '古刹老僧传授你一卷心法，你悟性大增。',
              fail: '古刹早已荒废百年，仅余断壁残垣，你静坐半日略有所悟。',
            },
          },
        ],
      },
      {
        id: 'wild',
        text: '走荒野古道，以苦行磨砺',
        effects: [
          { type: 'stat', key: 'rootBone', value: 5 },
          { type: 'stat', key: 'demonHeart', value: 3 },
          { type: 'cultivation', value: 12 },
        ],
      },
    ],
  },
  {
    id: 'sect_war',
    title: '宗门大战',
    description:
      '血云压境而来，魔道六宗联军将天玄宗团团围困。山门护阵摇摇欲坠，长老们浴血厮杀。你伫立城头，望着铺天盖地的魔修大军，此战关乎存亡。',
    weight: 8,
    years: 2,
    once: true,
    conditions: [
      { type: 'realm', min: 'foundation' },
      { type: 'flag', key: 'loyal_to_sect', value: true },
    ],
    choices: [
      {
        id: 'defend',
        text: '死守山门，誓与宗门共存亡',
        outcomes: [
          {
            chance: 0.5,
            luckBonus: 0.005,
            successEffects: [
              { type: 'flag', key: 'war_hero', value: true },
              { type: 'cultivation', value: 25 },
              { type: 'stat', key: 'karma', value: 15 },
              { type: 'spiritStones', value: 40 },
            ],
            failEffects: [
              { type: 'lifespan', value: -20 },
              { type: 'stat', key: 'demonHeart', value: 15 },
              { type: 'cultivation', value: 10 },
            ],
            narrative: {
              success: '你浴血奋战击退魔军，被封为宗门功臣，名震修仙界。',
              fail: '大战中身受重伤，虽保住山门，但元气大伤。',
            },
          },
        ],
      },
      {
        id: 'flank',
        text: '率精锐迂回奇袭魔军粮草',
        outcomes: [
          {
            chance: 0.6,
            luckBonus: 0.004,
            successEffects: [
              { type: 'flag', key: 'war_strategist', value: true },
              { type: 'cultivation', value: 20 },
              { type: 'stat', key: 'comprehension', value: 5 },
            ],
            failEffects: [
              { type: 'lifespan', value: -15 },
              { type: 'cultivation', value: 8 },
            ],
            narrative: {
              success: '奇袭得手，魔军阵脚大乱，你凭智谋名扬四海。',
              fail: '中了埋伏，险些殒命，拼死方才突围。',
            },
          },
        ],
      },
      {
        id: 'evacuate',
        text: '护送低阶弟子撤离战场',
        effects: [
          { type: 'stat', key: 'karma', value: 12 },
          { type: 'stat', key: 'luck', value: 3 },
          { type: 'cultivation', value: 8 },
        ],
      },
    ],
  },
  {
    id: 'dao_heart_trial',
    title: '道心幻境',
    description:
      '闭关突破之际，你坠入道心幻境之中。三重幻象接踵而至：一世你是帝王坐拥四海，一世你是乞儿饥寒交迫，一世你是枯骨黄土一抔。道心存亡，在此一念。',
    weight: 10,
    years: 1,
    once: true,
    conditions: [{ type: 'realm', min: 'golden_core' }],
    choices: [
      {
        id: 'emperor',
        text: '帝王幻象中参透权势如浮云',
        effects: [
          { type: 'stat', key: 'demonHeart', value: -15 },
          { type: 'stat', key: 'karma', value: 10 },
          { type: 'cultivation', value: 15 },
        ],
      },
      {
        id: 'beggar',
        text: '乞丐幻象中体悟万物皆空',
        effects: [
          { type: 'stat', key: 'comprehension', value: 8 },
          { type: 'stat', key: 'demonHeart', value: -10 },
          { type: 'cultivation', value: 20 },
        ],
      },
      {
        id: 'bones',
        text: '枯骨幻象中直面生死大限',
        effects: [
          { type: 'lifespan', value: 15 },
          { type: 'stat', key: 'demonHeart', value: -20 },
          { type: 'cultivation', value: 10 },
        ],
      },
    ],
  },
  {
    id: 'ancient_battlefield',
    title: '远古战场',
    description:
      '荒漠腹地发掘出一片远古战场遗迹，遍地皆是残破法宝与累累白骨。中央巨石之中插着一柄古剑，剑身雷纹隐隐放光。四周灵气紊乱不堪，似有上古禁制余威未散。',
    weight: 7,
    years: 2,
    once: true,
    conditions: [{ type: 'realm', min: 'golden_core' }],
    choices: [
      {
        id: 'pull_sword',
        text: '拔出石中古剑',
        outcomes: [
          {
            chance: 0.35,
            luckBonus: 0.006,
            successEffects: [
              { type: 'divineWeapon', id: 'ancient_thunder_sword', name: '太古雷剑' },
              { type: 'divineWeaponTier', value: 1 },
              { type: 'cultivation', value: 15 },
            ],
            failEffects: [
              { type: 'stat', key: 'demonHeart', value: 10 },
              { type: 'lifespan', value: -10 },
            ],
            narrative: {
              success: '你以金丹之力将古剑拔出，雷纹认主归服，此剑威力通天彻地。',
              fail: '古剑猛然反噬，雷电贯入体内，你重伤退走。',
            },
          },
        ],
      },
      {
        id: 'study',
        text: '参悟战场残存道韵',
        effects: [
          { type: 'cultivation', value: 25 },
          { type: 'stat', key: 'comprehension', value: 6 },
          { type: 'swordTier', value: 1 },
        ],
      },
      {
        id: 'loot',
        text: '搜集残破法宝换取灵石',
        effects: [
          { type: 'spiritStones', value: 60 },
          { type: 'stat', key: 'karma', value: -5 },
        ],
      },
    ],
  },
  {
    id: 'heavenly_treasure',
    title: '天赐仙缘',
    description:
      '天穹骤然裂开一道缝隙，一枚散发五彩霞光的灵果坠落在你面前。灵果落地之处灵气暴涨，方圆百丈内草木疯长。此乃传说中的先天灵果，服之可脱胎换骨。',
    weight: 4,
    years: 0,
    once: true,
    rarity: 'legendary',
    conditions: [{ type: 'realm', min: 'foundation' }],
    choices: [
      {
        id: 'eat',
        text: '当场服下灵果',
        effects: [
          { type: 'stat', key: 'rootBone', value: 12 },
          { type: 'stat', key: 'comprehension', value: 8 },
          { type: 'lifespan', value: 20 },
          { type: 'cultivation', value: 15 },
        ],
      },
      {
        id: 'refine',
        text: '带回炼制成灵丹',
        outcomes: [
          {
            chance: 0.5,
            luckBonus: 0.005,
            successEffects: [
              { type: 'alchemyTier', value: 1 },
              { type: 'stat', key: 'rootBone', value: 15 },
              { type: 'stat', key: 'comprehension', value: 10 },
            ],
            failEffects: [
              { type: 'stat', key: 'rootBone', value: 5 },
              { type: 'alchemyTier', value: 1 },
            ],
            narrative: {
              success: '你以精湛丹术将灵果炼成脱胎换骨丹，功效倍增。',
              fail: '炼制失败，灵果精华散逸大半，不过丹术倒有几分长进。',
            },
          },
        ],
      },
      {
        id: 'share',
        text: '分与同门共食',
        effects: [
          { type: 'stat', key: 'karma', value: 20 },
          { type: 'stat', key: 'rootBone', value: 5 },
          { type: 'stat', key: 'luck', value: 5 },
        ],
      },
    ],
  },
  {
    id: 'mentor_assign',
    title: '拜师问道',
    description:
      '入门半载，天玄宗依例为新弟子分配引道师尊。三位长老各有专擅：一位精于剑道、一位通晓丹术、一位擅长大阵。你跪于大殿之中，静候师尊择徒。',
    weight: 30,
    years: 1,
    once: true,
    conditions: [{ type: 'flag', key: 'loyal_to_sect', value: true }],
    choices: [
      {
        id: 'sword_master',
        text: '拜入剑道长老门下',
        effects: [
          { type: 'stat', key: 'rootBone', value: 4 },
          { type: 'cultivation', value: 12 },
          { type: 'flag', key: 'sword_disciple', value: true },
        ],
      },
      {
        id: 'alchemy_master',
        text: '拜入丹术长老门下',
        effects: [
          { type: 'alchemyTier', value: 1 },
          { type: 'stat', key: 'comprehension', value: 4 },
          { type: 'flag', key: 'alchemy_disciple', value: true },
        ],
      },
      {
        id: 'formation_master',
        text: '拜入阵法长老门下',
        effects: [
          { type: 'formationTier', value: 1 },
          { type: 'stat', key: 'comprehension', value: 3 },
          { type: 'stat', key: 'luck', value: 3 },
        ],
      },
    ],
  },
  {
    id: 'first_mission',
    title: '初领宗门任务',
    description:
      '天玄宗每月派发宗门任务以磨砺弟子。你初次领命，可选三桩差事：巡守山门外围、赴坊市采买灵材、前往药田除虫。',
    weight: 28,
    years: 1,
    once: true,
    conditions: [{ type: 'flag', key: 'loyal_to_sect', value: true }],
    choices: [
      {
        id: 'patrol',
        text: '巡守山门，熟悉地形',
        effects: [
          { type: 'stat', key: 'rootBone', value: 3 },
          { type: 'stat', key: 'luck', value: 2 },
          { type: 'cultivation', value: 6 },
        ],
      },
      {
        id: 'errand',
        text: '赴坊市采买，见见世面',
        effects: [
          { type: 'spiritStones', value: 12 },
          { type: 'stat', key: 'luck', value: 3 },
        ],
      },
      {
        id: 'herb_field',
        text: '药田除虫，亲近灵草',
        effects: [
          { type: 'alchemyTier', value: 1 },
          { type: 'cultivation', value: 8 },
        ],
      },
    ],
  },
  {
    id: 'night_whisper',
    title: '夜半低语',
    description:
      '夜深人静，你于房中打坐。忽闻窗外传来幽幽低语，似有无形之物在呢喃你的名字。窗外月色如水，树影婆娑，那声音时远时近，令人毛骨悚然。',
    weight: 15,
    years: 1,
    once: true,
    choices: [
      {
        id: 'investigate',
        text: '循声而出，一探究竟',
        outcomes: [
          {
            chance: 0.5,
            luckBonus: 0.005,
            successEffects: [
              { type: 'stat', key: 'comprehension', value: 6 },
              { type: 'cultivation', value: 10 },
              { type: 'stat', key: 'luck', value: 3 },
            ],
            failEffects: [
              { type: 'stat', key: 'demonHeart', value: 8 },
              { type: 'lifespan', value: -5 },
            ],
            narrative: {
              success: '你循声至后山古井旁，井中灵光一闪，竟是一枚先辈遗留的玉简。你参悟其中法诀，悟性大增。',
              fail: '你循声而行，不知不觉走入禁地，被残留的魔气侵袭，心魔暗生。',
            },
          },
        ],
      },
      {
        id: 'meditate',
        text: '不为所动，静心打坐',
        effects: [
          { type: 'stat', key: 'demonHeart', value: -3 },
          { type: 'stat', key: 'karma', value: 5 },
          { type: 'cultivation', value: 5 },
        ],
      },
      {
        id: 'report',
        text: '禀报值守师兄',
        requirements: [{ type: 'flag', key: 'loyal_to_sect', value: true }],
        effects: [
          { type: 'stat', key: 'karma', value: 8 },
          { type: 'spiritStones', value: 8 },
        ],
      },
    ],
  },
  {
    id: 'sect_friend',
    title: '同门之谊',
    description:
      '演武场旁，一名同门弟子盘坐树下，满面愁容。攀谈之下，他名叫林远，坦言修炼瓶颈已久，若无法突破便要被遣送下山。你心生恻隐。',
    weight: 12,
    years: 1,
    once: true,
    conditions: [{ type: 'flag', key: 'loyal_to_sect', value: true }],
    choices: [
      {
        id: 'teach',
        text: '倾囊相授修炼心得',
        effects: [
          { type: 'stat', key: 'karma', value: 10 },
          { type: 'stat', key: 'comprehension', value: 3 },
          { type: 'flag', key: 'helped_lin_yuan', value: true },
        ],
      },
      {
        id: 'compete',
        text: '暗自庆幸少一个对手',
        effects: [
          { type: 'stat', key: 'demonHeart', value: 5 },
          { type: 'cultivation', value: 8 },
        ],
      },
      {
        id: 'trade',
        text: '提议互相切磋印证',
        effects: [
          { type: 'cultivation', value: 10 },
          { type: 'stat', key: 'rootBone', value: 2 },
          { type: 'stat', key: 'karma', value: 5 },
        ],
      },
    ],
  },
  {
    id: 'mountain_spirit',
    title: '山间灵兽',
    description:
      '深山采药时，你偶遇一头幼小的灵狐，通体雪白，眸泛灵光。它受了伤，蜷缩在溪边瑟瑟发抖。远处传来猎人追捕的呼喝声。',
    weight: 12,
    years: 1,
    once: true,
    choices: [
      {
        id: 'rescue_fox',
        text: '救下灵狐，为其疗伤',
        effects: [
          { type: 'stat', key: 'karma', value: 10 },
          { type: 'stat', key: 'luck', value: 5 },
          { type: 'flag', key: 'saved_fox', value: true },
        ],
      },
      {
        id: 'ignore_fox',
        text: '事不关己，转身离去',
        effects: [
          { type: 'cultivation', value: 5 },
        ],
      },
      {
        id: 'catch_fox',
        text: '趁机捕获灵狐取丹',
        outcomes: [
          {
            chance: 0.4,
            luckBonus: 0.004,
            successEffects: [
              { type: 'spiritStones', value: 20 },
              { type: 'stat', key: 'demonHeart', value: 10 },
            ],
            failEffects: [
              { type: 'stat', key: 'karma', value: -10 },
              { type: 'stat', key: 'luck', value: -5 },
            ],
            narrative: {
              success: '你趁灵狐虚弱取其内丹，修为有所进益，却种下一段恶因。',
              fail: '灵狐虽弱却灵智极高，拼死逃脱时抓伤了你。你空手而归，反添因果。',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'first_duel',
    title: '首次斗法',
    description:
      '宗门比武场开放，你首次与同门弟子正面交锋。对手修为与你相当，招式凌厉。围观的师兄弟议论纷纷，这是你在宗门中证明自己的机会。',
    weight: 14,
    years: 1,
    once: true,
    conditions: [{ type: 'flag', key: 'loyal_to_sect', value: true }],
    choices: [
      {
        id: 'aggressive',
        text: '全力进攻，速战速决',
        outcomes: [
          {
            chance: 0.5,
            luckBonus: 0.004,
            successEffects: [
              { type: 'cultivation', value: 15 },
              { type: 'stat', key: 'rootBone', value: 3 },
              { type: 'spiritStones', value: 10 },
            ],
            failEffects: [
              { type: 'cultivation', value: 5 },
              { type: 'stat', key: 'demonHeart', value: 3 },
            ],
            narrative: {
              success: '你攻势如潮，对手节节败退，最终认输。围观同门纷纷喝彩。',
              fail: '你急于求成露出破绽，被对手反击得手，遗憾落败。',
            },
          },
        ],
      },
      {
        id: 'defensive',
        text: '以守为攻，寻找破绽',
        effects: [
          { type: 'cultivation', value: 10 },
          { type: 'stat', key: 'comprehension', value: 3 },
        ],
      },
      {
        id: 'forfeit',
        text: '主动认负，保存实力',
        effects: [
          { type: 'stat', key: 'karma', value: 5 },
          { type: 'cultivation', value: 3 },
        ],
      },
    ],
  },
]

export const EVENTS: GameEvent[] = [
  ...CORE_EVENTS,
  ...ROMANCE_EVENTS,
  ...EXTRA_EVENTS,
  ...SYSTEM_EVENTS,
]
