import type { GameEvent } from '../types/game'
import { EXTRA_EVENTS } from './eventsExtra'
import { ROMANCE_EVENTS } from './eventsRomance'
import { SYSTEM_EVENTS } from './eventsSystems'

const CORE_EVENTS: GameEvent[] = [
  {
    id: 'enter_sect',
    title: '拜入宗门',
    description:
      '青云宗收徒大典，数百少年齐聚山门前。长老扫视众人，目光如电。你站在人群中，心跳加速——这是踏入仙途的第一步。',
    weight: 100,
    years: 0,
    once: true,
    choices: [
      {
        id: 'honest',
        text: '诚实地展示灵根，求取入门',
        effects: [
          { type: 'flag', key: 'loyal_to_sect', value: true },
          { type: 'cultivation', value: 15 },
          { type: 'log', text: '16岁：拜入青云宗，成为外门弟子。' },
        ],
      },
      {
        id: 'boast',
        text: '夸大资质，试图进入内门',
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
              { type: 'stat', key: 'karma', value: -10 },
              { type: 'cultivation', value: 10 },
            ],
            narrative: {
              success: '长老识才，破格收入内门，赐灵石五十。',
              fail: '谎言被识破，仅得外门弟子身份，因果受损。',
            },
          },
        ],
      },
      {
        id: 'refuse',
        text: '拒绝宗门，决意独行',
        effects: [
          { type: 'flag', key: 'refused_all_sects', value: true },
          { type: 'stat', key: 'luck', value: 5 },
          { type: 'cultivation', value: 12 },
          { type: 'log', text: '16岁：拒绝宗门，踏上散修之路。' },
        ],
      },
    ],
  },
  {
    id: 'cave_inheritance',
    title: '洞府遗泽',
    description:
      '你在后山禁地边缘，发现一处被封印的洞府。石门上古篆流转，灵气隐隐透出，似有机缘，亦有凶险。',
    weight: 15,
    years: 2,
    once: true,
    conditions: [{ type: 'realm', min: 'qi_refining_1' }],
    choices: [
      {
        id: 'force',
        text: '强行破阵',
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
              success: '破阵而入，获古剑一柄与残卷，道基大进。',
              fail: '阵法反噬，重伤逃遁，寿元大损，心魔暗生。',
            },
          },
        ],
      },
      {
        id: 'comprehend',
        text: '静心参悟门上符文',
        requirements: [{ type: 'stat', key: 'comprehension', min: 35 }],
        effects: [
          { type: 'stat', key: 'comprehension', value: 12 },
          { type: 'flag', key: 'got_inheritance', value: true },
          { type: 'cultivation', value: 15 },
        ],
      },
      {
        id: 'mark',
        text: '记下位置，日后再来',
        effects: [
          { type: 'flag', key: 'cave_marked', value: true },
          { type: 'stat', key: 'luck', value: 3 },
        ],
      },
    ],
  },
  {
    id: 'market_find',
    title: '集市捡漏',
    description:
      '坊市角落，一落魄修士摆摊出售"古物"。多数皆是假货，但你目光一扫，其中似有一件灵器微光一闪而逝。',
    rarity: 'rare',
    weight: 9,
    years: 1,
    once: true,
    choices: [
      {
        id: 'buy',
        text: '花30灵石买下',
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
              success: '果然是灵玉佩，佩戴后气运大增。',
              fail: '买来竟是赝品，白白浪费灵石。',
            },
          },
        ],
      },
      {
        id: 'bargain',
        text: '砍价至10灵石',
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
              success: '摊主恼怒甩卖，你竟得一小块灵石原矿。',
              fail: '摊主翻脸，将你赶出摊位。',
            },
          },
        ],
      },
      {
        id: 'ignore',
        text: '不予理会，径直走过',
        effects: [{ type: 'stat', key: 'comprehension', value: 2 }],
      },
    ],
  },
  {
    id: 'peer_trap',
    title: '同门陷害',
    description:
      '同门师兄邀你共探秘境，言语殷勤。你察觉他目光闪烁，显然别有用心。',
    weight: 10,
    years: 1,
    once: true,
    storyGroup: 'sect_intrigue',
    conditions: [{ type: 'flag', key: 'loyal_to_sect', value: true }],
    choices: [
      {
        id: 'expose',
        text: '当面揭穿，上报长老',
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
              success: '长老嘉奖你的正直，赐灵石三十，记为宗门功臣。',
              fail: '反被诬陷，受罚闭关，心魔暗生。',
            },
          },
        ],
      },
      {
        id: 'play_along',
        text: '将计就计，反设陷阱',
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
              success: '反夺对方机缘，获灵石五十，修为精进。',
              fail: '计谋败露，被打成重伤，寿元受损。',
            },
          },
        ],
      },
      {
        id: 'avoid',
        text: '婉言拒绝，避而远之',
        effects: [
          { type: 'stat', key: 'demonHeart', value: -3 },
          { type: 'cultivation', value: 5 },
        ],
      },
    ],
  },
  {
    id: 'beast_attack',
    title: '妖兽袭击',
    description:
      '夜行山林，腥风扑面。一头二阶妖狼从暗处扑出，双目猩红，利爪如刀。',
    weight: 10,
    years: 1,
    once: true,
    choices: [
      {
        id: 'fight',
        text: '正面迎战',
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
              success: '险胜妖狼，取其妖丹，体魄更为坚韧。',
              fail: '不敌妖狼，重伤逃遁，寿元受损，心魔暗生。',
            },
          },
        ],
      },
      {
        id: 'flee',
        text: '施展遁术逃跑',
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
              success: '脱身成功，虽无收获，保全性命。',
              fail: '遁术不及，被划伤后背，心生动摇。',
            },
          },
        ],
      },
      {
        id: 'tame',
        text: '尝试以神识驯服',
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
              success: '神识贯通，妖狼臣服，结为灵宠。',
              fail: '神识遭反噬，元神受创，重伤退走。',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'elder_lecture',
    title: '长老讲道',
    description:
      '宗门长老开坛讲道，百余名弟子端坐听讲。天地灵气随道音流转，沁人心脾。',
    weight: 9,
    years: 2,
    maxTimes: 2,
    cooldown: 4,
    conditions: [{ type: 'flag', key: 'loyal_to_sect', value: true }],
    choices: [
      {
        id: 'attend',
        text: '全神贯注，认真听讲',
        narrative: '道音入耳，你凝神静听，灵气随讲道流转周身，修为大进，悟性亦有所增。',
        effects: [
          { type: 'cultivation', value: 20 },
          { type: 'stat', key: 'comprehension', value: 5 },
        ],
      },
      {
        id: 'ask',
        text: '提问修炼疑惑',
        requirements: [{ type: 'stat', key: 'comprehension', min: 30 }],
        narrative: '你起身提问，长老欣然解惑，令你茅塞顿开。众弟子侧目，长老更将你记为宗门翘楚。',
        effects: [
          { type: 'cultivation', value: 25 },
          { type: 'stat', key: 'comprehension', value: 8 },
          { type: 'flag', key: 'became_elder', value: true },
        ],
      },
      {
        id: 'sleep',
        text: '昏昏欲睡，敷衍了事',
        narrative: '你昏昏欲睡，长老蹙眉不语，同门窃笑。虽略有收获，因果却微损。',
        effects: [
          { type: 'cultivation', value: 5 },
          { type: 'stat', key: 'karma', value: -5 },
        ],
      },
    ],
  },
  {
    id: 'herb_gather',
    title: '灵草采集',
    rarity: 'rare',
    description:
      '药园深处，百年灵草散发清香。然而附近有毒蛇盘踞，采摘需格外小心。',
    weight: 8,
    years: 1,
    once: true,
    choices: [
      {
        id: 'careful',
        text: '谨慎采摘',
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
              success: '成功采得灵草，对丹道有了初步领悟。',
              fail: '被毒蛇咬伤，虽采得灵草，却损耗寿元。',
            },
          },
        ],
      },
      {
        id: 'rush',
        text: '快速采摘，冒险一搏',
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
              success: '险中求富贵，获稀有灵草。',
              fail: '毒蛇突袭，重伤退走，心魔滋生。',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'demon_whisper',
    title: '心魔初现',
    description:
      '闭关修炼时，心底浮现低语，诱惑你放弃正道，改修魔功。修为可一日千里，但因果深重。',
    weight: 10,
    years: 2,
    once: true,
    conditions: [{ type: 'realm', min: 'qi_refining_2' }],
    choices: [
      {
        id: 'resist',
        text: '坚守道心，强行压制',
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
              success: '道心坚定，心魔退散，修为更进一层。',
              fail: '心魔难压，虽未入魔，却已滋生暗根。',
            },
          },
        ],
      },
      {
        id: 'accept',
        text: '倾听魔音，试探魔功',
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
              success: '你克制魔音，小有顿悟，修为进益。',
              fail: '魔音反噬，你堕入魔道边缘，心魔大起。',
            },
          },
        ],
      },
      {
        id: 'seek_help',
        text: '出关求长老指点',
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
    title: '筑基天劫',
    description:
      '修为圆满，天劫将至。乌云密布，雷光如龙，这是踏入筑基期的生死关头。',
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
        text: '以肉身硬抗天雷',
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
              success: '雷劫过后，筑基成功，肉身更为强韧。',
              fail: '天雷贯体，道基受损，你重伤脱身，筑基未成。',
            },
          },
        ],
      },
      {
        id: 'artifact',
        text: '祭出法宝抵御',
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
              success: '法宝护体，有惊无险，成功筑基。',
              fail: '法宝碎裂，勉强保住性命，筑基失败。',
            },
          },
        ],
      },
      {
        id: 'pill',
        text: '服用护劫丹药',
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
              success: '丹药生效，顺利渡过天劫，踏入筑基。',
              fail: '丹药品质不足，天劫失败，修为倒退。',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'sect_tournament',
    title: '宗门大比',
    description:
      '宗门大比开幕，弟子们摩拳擦掌。胜者可得灵石、丹药，甚至长老亲传。',
    weight: 12,
    years: 2,
    conditions: [{ type: 'realm', min: 'foundation' }],
    choices: [
      {
        id: 'compete',
        text: '参加比试，全力以赴',
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
              success: '力压群雄，夺得头名，名声大振。',
              fail: '首轮落败，虽败犹荣，略有收获。',
            },
          },
        ],
      },
      {
        id: 'observe',
        text: '旁观悟法，不参与',
        effects: [
          { type: 'stat', key: 'comprehension', value: 8 },
          { type: 'cultivation', value: 10 },
        ],
      },
    ],
  },
  {
    id: 'demon_temptation',
    title: '魔修诱惑',
    description:
      '一名魔修悄然现身，许诺传你无上魔功，只需杀一人献祭。杀意与诱惑交织，道心面临考验。',
    weight: 10,
    years: 1,
    conditions: [{ type: 'realm', min: 'foundation' }],
    choices: [
      {
        id: 'reject',
        text: '断然拒绝，出手斩魔',
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
              success: '斩灭魔修，正道名声远扬，获战利品。',
              fail: '魔修遁走，你反受伤，心魔暗生。',
            },
          },
        ],
      },
      {
        id: 'accept',
        text: '接受魔功，献祭无辜',
        effects: [
          { type: 'flag', key: 'accepted_demon_path', value: true },
          { type: 'stat', key: 'demonHeart', value: 35 },
          { type: 'stat', key: 'karma', value: -40 },
          { type: 'cultivation', value: 35 },
        ],
      },
      {
        id: 'pretend',
        text: '假意接受，伺机反杀',
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
              success: '反杀魔修，夺得魔储物袋。',
              fail: '计谋被识破，被迫修炼魔功，心魔大生。',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'ancient_legacy',
    title: '古修传承',
    description:
      '秘境深处，一具古修遗骸盘坐，身前悬浮一枚玉简，似有传承等待有缘人。',
    weight: 8,
    years: 3,
    once: true,
    conditions: [{ type: 'realm', min: 'foundation' }],
    choices: [
      {
        id: 'inherit',
        text: '跪拜传承',
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
              success: '玉简入体，获古修传承，大道可期。',
              fail: '传承排斥，神识受创，心魔暗生。',
            },
          },
        ],
      },
      {
        id: 'loot',
        text: '只取遗物，不拜传承',
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
              success: '你悄然取走遗物，迅速离去。',
              fail: '禁制反扑，你受伤逃遁，因果大损。',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'dao_companion',
    title: '道侣结缘',
    description:
      '秘境深处，一名紫衣女修与你狭路相逢。她自称来自南海，资质不俗，提议结为道侣，共参大道。',
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
        text: '结为道侣，双修共进',
        narrative: '你与紫衣女修对天盟誓，结为道侣。二人功法互补，修为一日千里。',
        effects: [
          { type: 'flag', key: 'has_companion', value: true },
          { type: 'cultivation', value: 25 },
          { type: 'stat', key: 'demonHeart', value: -8 },
        ],
      },
      {
        id: 'decline',
        text: '婉言谢绝，专心修道',
        narrative: '你以礼相送，女修叹你道心坚定，留下一枚玉佩后飘然离去。',
        effects: [
          { type: 'cultivation', value: 15 },
          { type: 'stat', key: 'comprehension', value: 5 },
        ],
      },
      {
        id: 'betray',
        text: '趁其不备，夺其机缘',
        narrative: '你暗算女修，夺其储物袋。修为虽涨，因果大损，心魔暗生。',
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
    title: '秘境开启',
    description:
      '天地异象，上古秘境开启。各方修士蜂拥而入，机缘与杀机并存。',
    weight: 10,
    years: 3,
    conditions: [{ type: 'realm', min: 'foundation' }],
    choices: [
      {
        id: 'explore',
        text: '深入秘境核心',
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
              success: '核心区域获重宝，修为大进。',
              fail: '遭遇空间裂缝，你被震出秘境，重伤濒死却保住一命。',
            },
          },
        ],
      },
      {
        id: 'periphery',
        text: '在外围搜寻',
        effects: [
          { type: 'spiritStones', value: 40 },
          { type: 'cultivation', value: 15 },
        ],
      },
      {
        id: 'skip',
        text: '谨慎观望，不入秘境',
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
      '你偶得丹方残卷，欲炼九转金丹。需集齐灵草，闭关七七四十九日。',
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
        text: '闭关炼丹',
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
              success: '丹成九转，药香四溢，丹道大成。',
              fail: '丹炉炸裂，反噬受伤，心魔暗生。',
            },
          },
        ],
      },
      {
        id: 'study',
        text: '只研丹方，不急于炼制',
        effects: [
          { type: 'stat', key: 'comprehension', value: 8 },
          { type: 'cultivation', value: 10 },
        ],
      },
    ],
  },
  {
    id: 'golden_tribulation',
    title: '金丹天劫',
    description:
      '金丹将成，天劫再临。此次雷劫比筑基时猛烈十倍，稍有不慎便是灰飞烟灭。',
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
        text: '以身渡劫',
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
              success: '雷劫过后，金丹凝成，光芒万丈。',
              fail: '天劫之下，身死道消。',
            },
          },
        ],
      },
      {
        id: 'array',
        text: '布阵护体',
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
              success: '阵法抵挡雷劫，金丹凝成。',
              fail: '阵法破碎，勉强保住性命，金丹未成。',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'lifespan_crisis',
    title: '寿元将尽',
    description:
      '你感到体内生机流逝，须发渐白。若不寻得续命之法，大限将至。',
    weight: 12,
    years: 2,
    once: true,
    conditions: [{ type: 'lifespan_remaining', max: 15 }],
    choices: [
      {
        id: 'search_pill',
        text: '寻访续命丹药',
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
              success: '购得续命丹，寿元延长三十年。',
              fail: '丹药无效，灵石白费，心魔暗生。',
            },
          },
        ],
      },
      {
        id: 'breakthrough',
        text: '强行突破，以境界换寿元',
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
              success: '破境成功，寿元大增。',
              fail: '突破失败，寿元更为紧迫。',
            },
          },
        ],
      },
      {
        id: 'accept',
        text: '坦然面对，整理遗训',
        hint: '因果清正 · 本回合后寿尽坐化',
        narrative: '你将毕生感悟写成遗训，传予后辈，随后安然坐化。',
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
      '修炼至关键时刻，心魔化形，化作你内心最深的恐惧与执念，向你扑来。',
    weight: 10,
    years: 3,
    conditions: [{ type: 'stat', key: 'demonHeart', min: 40 }],
    choices: [
      {
        id: 'face',
        text: '直面心魔，以道心斩之',
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
              success: '斩灭心魔，道心通明，修为大进。',
              fail: '道心失守，心魔入主，堕入魔道边缘。',
            },
          },
        ],
      },
      {
        id: 'merge',
        text: '与心魔融合，以魔证道',
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
    title: '飞升契机',
    description:
      '天地异象，飞升通道开启。你可择日飞升，亦可留世守护，或堕入魔道，一念之间，命运迥异。',
    weight: 20,
    years: 1,
    once: true,
    conditions: [{ type: 'realm', min: 'nascent_soul' }],
    choices: [
      {
        id: 'ascend',
        text: '踏入飞升通道，求成仙道',
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
        text: '留世守护，做人间地仙',
        effects: [
          { type: 'flag', key: 'refused_all_sects', value: true },
          { type: 'cultivation', value: 20 },
          { type: 'lifespan', value: 50 },
        ],
      },
      {
        id: 'demon',
        text: '以魔入道，打破飞升规则',
        effects: [
          { type: 'flag', key: 'accepted_demon_path', value: true },
          { type: 'stat', key: 'demonHeart', value: 50 },
          { type: 'cultivation', value: 30 },
        ],
      },
      {
        id: 'retire',
        text: '放弃修仙，回归凡尘',
        effects: [
          { type: 'flag', key: 'gave_up_cultivation', value: true },
        ],
      },
    ],
  },
  {
    id: 'outer_sect_life',
    title: '外门杂务',
    description:
      '入门已有数月，你每日挑水砍柴、清扫殿堂，修为进展缓慢。今日管事师兄分配新差事：灵田除草可近灵气，丹房打杂可窥丹道，巡山守夜可磨心志。',
    weight: 25,
    years: 1,
    once: true,
    conditions: [{ type: 'realm', min: 'qi_refining_1' }],
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
        text: '丹房打杂，偷学丹道',
        effects: [
          { type: 'alchemyTier', value: 1 },
          { type: 'cultivation', value: 8 },
        ],
      },
      {
        id: 'patrol',
        text: '巡山守夜，磨炼心志',
        effects: [
          { type: 'stat', key: 'rootBone', value: 3 },
          { type: 'stat', key: 'karma', value: 5 },
        ],
      },
    ],
  },
  {
    id: 'inner_sect_trial',
    title: '内门考核',
    description:
      '青云宗一年一度内门考核开启。三道关卡：灵阵幻境考验心性，御剑飞行考验根骨，对战擂台考验实战。通过者可晋升内门弟子，获更多修炼资源。',
    weight: 22,
    years: 1,
    once: true,
    conditions: [{ type: 'realm', min: 'qi_refining_2' }],
    choices: [
      {
        id: 'heart',
        text: '以心性过幻境关',
        effects: [
          { type: 'flag', key: 'inner_disciple', value: true },
          { type: 'cultivation', value: 15 },
          { type: 'spiritStones', value: 20 },
          { type: 'stat', key: 'karma', value: 8 },
        ],
      },
      {
        id: 'body',
        text: '以根骨过御剑关',
        effects: [
          { type: 'flag', key: 'inner_disciple', value: true },
          { type: 'cultivation', value: 15 },
          { type: 'stat', key: 'rootBone', value: 5 },
        ],
      },
      {
        id: 'fight',
        text: '以实战过擂台关',
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
              success: '你以凌厉剑法击败对手，破格晋升内门，获赐灵石三十。',
              fail: '擂台上惜败，仍是外门弟子，但实战经验大增。',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'world_travel',
    title: '下山历练',
    description:
      '修为小有所成，师尊命你下山历练。红尘万丈，机缘与凶险并存。你行至三岔路口：繁华都城人烟稠密，深山古刹钟声悠远，荒野古道黄沙漫天。',
    weight: 18,
    years: 2,
    once: true,
    conditions: [{ type: 'realm', min: 'qi_refining_3' }],
    choices: [
      {
        id: 'city',
        text: '入繁华都城，见世间百态',
        effects: [
          { type: 'spiritStones', value: 25 },
          { type: 'stat', key: 'luck', value: 4 },
          { type: 'stat', key: 'karma', value: 6 },
        ],
      },
      {
        id: 'temple',
        text: '入深山古刹，寻隐世高人',
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
              success: '古刹老僧传你一卷心法，悟性大增。',
              fail: '古刹已荒废百年，唯有断壁残垣，你静坐半日略有感悟。',
            },
          },
        ],
      },
      {
        id: 'wild',
        text: '走荒野古道，磨炼意志',
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
      '血云压境，魔道六宗联军围攻青云宗。山门护阵摇摇欲坠，长老们浴血奋战。你站在城墙上，望着铺天盖地的魔修大军，生死存亡在此一战。',
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
        text: '死守山门，与宗门共存亡',
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
        text: '率精锐绕后突袭魔军粮草',
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
              success: '奇袭成功，魔军大乱，你以智取胜名扬四方。',
              fail: '中了埋伏，险些丧命，拼死突围而出。',
            },
          },
        ],
      },
      {
        id: 'evacuate',
        text: '护送低阶弟子撤离',
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
    title: '道心试炼',
    description:
      '闭关突破之际，你坠入道心幻境。眼前浮现三道幻象：一世你是帝王坐拥天下，一世你是乞丐饥寒交迫，一世你是枯骨黄土一抔。道心在此一念之间。',
    weight: 10,
    years: 1,
    once: true,
    conditions: [{ type: 'realm', min: 'golden_core' }],
    choices: [
      {
        id: 'emperor',
        text: '帝王幻象中悟权势如浮云',
        effects: [
          { type: 'stat', key: 'demonHeart', value: -15 },
          { type: 'stat', key: 'karma', value: 10 },
          { type: 'cultivation', value: 15 },
        ],
      },
      {
        id: 'beggar',
        text: '乞丐幻象中悟万物皆空',
        effects: [
          { type: 'stat', key: 'comprehension', value: 8 },
          { type: 'stat', key: 'demonHeart', value: -10 },
          { type: 'cultivation', value: 20 },
        ],
      },
      {
        id: 'bones',
        text: '枯骨幻象中直面生死',
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
    title: '古战场遗迹',
    description:
      '荒漠深处发现上古战场遗迹，遍地残破法宝与枯骨。中央一柄古剑插在巨石中，剑身雷纹隐隐发光。四周灵气紊乱，似有远古禁制未散。',
    weight: 7,
    years: 2,
    once: true,
    conditions: [{ type: 'realm', min: 'golden_core' }],
    choices: [
      {
        id: 'pull_sword',
        text: '拔出古剑',
        outcomes: [
          {
            chance: 0.35,
            luckBonus: 0.006,
            successEffects: [
              { type: 'divineWeapon', id: 'ancient_thunder_sword', name: '太古雷剑' },
              { type: 'cultivation', value: 15 },
            ],
            failEffects: [
              { type: 'stat', key: 'demonHeart', value: 10 },
              { type: 'lifespan', value: -10 },
            ],
            narrative: {
              success: '你以金丹之力拔出古剑，雷纹认主，此剑威能通天。',
              fail: '古剑反噬，雷电入体，你重伤退出。',
            },
          },
        ],
      },
      {
        id: 'study',
        text: '参悟战场残余道韵',
        effects: [
          { type: 'cultivation', value: 25 },
          { type: 'stat', key: 'comprehension', value: 6 },
        ],
      },
      {
        id: 'loot',
        text: '搜刮残破法宝换取灵石',
        effects: [
          { type: 'spiritStones', value: 60 },
          { type: 'stat', key: 'karma', value: -5 },
        ],
      },
    ],
  },
  {
    id: 'heavenly_treasure',
    title: '天降奇缘',
    description:
      '天穹骤然裂开一道缝隙，一枚散发五彩霞光的灵果坠落于前。灵果落地之处灵气暴涨，方圆百丈草木疯长。此乃传说中的先天灵果，食之可脱胎换骨。',
    weight: 4,
    years: 0,
    once: true,
    rarity: 'legendary',
    conditions: [{ type: 'realm', min: 'foundation' }],
    choices: [
      {
        id: 'eat',
        text: '立即服下灵果',
        effects: [
          { type: 'stat', key: 'rootBone', value: 12 },
          { type: 'stat', key: 'comprehension', value: 8 },
          { type: 'lifespan', value: 20 },
          { type: 'cultivation', value: 15 },
        ],
      },
      {
        id: 'refine',
        text: '带回炼制成丹药',
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
              success: '你以精妙丹术将灵果炼成脱胎换骨丹，效果倍增。',
              fail: '炼制失败灵果精华散失大半，但丹术有所长进。',
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
]

export const EVENTS: GameEvent[] = [
  ...CORE_EVENTS,
  ...ROMANCE_EVENTS,
  ...EXTRA_EVENTS,
  ...SYSTEM_EVENTS,
]
