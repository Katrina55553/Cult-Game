import type { GameEvent } from '../types/game'

export const SECT_EVENTS: GameEvent[] = [
  {
    id: 'sect_betrayal',
    title: '宗门叛逃',
    description: '你察觉宗门暗中炼制邪丹，竟以弟子性命为祭。是揭穿阴谋，还是趁夜出逃？',
    weight: 10,
    once: true,
    storyGroup: 'sect_intrigue',
    act: 'foundation',
    conditions: [{ type: 'flag', key: 'loyal_to_sect', value: true }],
    choices: [
      {
        id: 'expose',
        text: '揭发阴谋',
        hint: '因果+ · 败则重伤逃亡',
        outcomes: [
          {
            chance: 0.5,
            successEffects: [
              { type: 'stat', key: 'karma', value: 20 },
              { type: 'flag', key: 'became_elder', value: true },
              { type: 'cultivation', value: 20 },
            ],
            failEffects: [
              { type: 'lifespan', value: -25 },
              { type: 'cultivation', value: -20 },
              { type: 'stat', key: 'demonHeart', value: 15 },
              { type: 'flag', key: 'loyal_to_sect', value: false },
              { type: 'flag', key: 'grievously_wounded', value: true },
            ],
            narrative: {
              success: '你扳倒邪长老，声名远播，受封真传弟子。',
              fail: '揭发败露，你遭诬陷构罪，身受重创，连夜逃离宗门。',
            },
          },
        ],
      },
      {
        id: 'flee',
        text: '叛逃宗门',
        hint: '约七成脱身 · 败则身受追杀',
        outcomes: [
          {
            chance: 0.65,
            successEffects: [
              { type: 'flag', key: 'loyal_to_sect', value: false },
              { type: 'flag', key: 'refused_all_sects', value: true },
              { type: 'cultivation', value: 15 },
            ],
            failEffects: [
              { type: 'lifespan', value: -15 },
              { type: 'stat', key: 'demonHeart', value: 12 },
              { type: 'flag', key: 'loyal_to_sect', value: false },
            ],
            narrative: {
              success: '你趁夜遁走，自此脱离宗门，沦为散修。',
              fail: '追兵紧随不舍，你重伤方得脱身，成了宗门弃徒。',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'sect_master_legacy',
    title: '掌门传承',
    description: '掌门弥留之际召你入密室，欲传掌门之位与镇派绝学，但需以性命护佑宗门。',
    weight: 8,
    once: true,
    act: 'golden',
    conditions: [
      { type: 'flag', key: 'loyal_to_sect', value: true },
      { type: 'flag', key: 'became_elder', value: true },
    ],
    choices: [
      {
        id: 'accept',
        text: '接任掌门',
        effects: [
          { type: 'cultivation', value: 35 },
          { type: 'flag', key: 'sect_master', value: true },
          { type: 'artifact', id: 'sect_seal', name: '掌门信印' },
        ],
      },
      {
        id: 'decline',
        text: '举荐同门',
        effects: [
          { type: 'stat', key: 'karma', value: 15 },
          { type: 'cultivation', value: 20 },
        ],
      },
    ],
  },
  {
    id: 'sect_crisis',
    title: '宗门灭门危机',
    description: '魔道大举围攻山门，护山大阵摇摇欲坠。你是死守不退，还是率同门突围？',
    weight: 9,
    once: true,
    act: 'foundation',
    conditions: [{ type: 'flag', key: 'loyal_to_sect', value: true }],
    choices: [
      {
        id: 'defend',
        text: '死守山门',
        hint: '有成有败 · 败则重伤',
        outcomes: [
          {
            chance: 0.4,
            successEffects: [
              { type: 'cultivation', value: 30 },
              { type: 'stat', key: 'karma', value: 25 },
              { type: 'flag', key: 'became_elder', value: true },
            ],
            failEffects: [
              { type: 'lifespan', value: -30 },
              { type: 'cultivation', value: -30 },
              { type: 'stat', key: 'demonHeart', value: 18 },
              { type: 'flag', key: 'grievously_wounded', value: true },
            ],
            narrative: {
              success: '你力挽狂澜，守住宗门基业，被尊为护宗英雄。',
              fail: '山门终告失守，你重伤濒死，幸得同门拼死救出。',
            },
          },
        ],
      },
      {
        id: 'escape',
        text: '突围求生',
        hint: '约六成脱险 · 败则伤亡惨重',
        outcomes: [
          {
            chance: 0.6,
            successEffects: [
              { type: 'cultivation', value: 10 },
              { type: 'stat', key: 'demonHeart', value: 5 },
            ],
            failEffects: [
              { type: 'lifespan', value: -20 },
              { type: 'stat', key: 'demonHeart', value: 15 },
              { type: 'cultivation', value: -5 },
            ],
            narrative: {
              success: '你率同门突围成功，虽折损惨重，终保全性命。',
              fail: '突围之战惨烈异常，你九死一生方得脱身，同门伤亡甚众。',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'blood_sacrifice',
    title: '魔道血祭',
    description: '魔修邀你共参血祭禁阵，可一日破境飞升，然须屠戮凡人村落以祭。',
    weight: 8,
    once: true,
    act: 'foundation',
    conditions: [{ type: 'stat', key: 'demonHeart', min: 30 }],
    choices: [
      {
        id: 'join',
        text: '参与血祭',
        hint: '修为+++ · 因果---',
        effects: [
          { type: 'flag', key: 'accepted_demon_path', value: true },
          { type: 'cultivation', value: 40 },
          { type: 'stat', key: 'karma', value: -40 },
          { type: 'stat', key: 'demonHeart', value: 30 },
        ],
      },
      {
        id: 'stop',
        text: '阻止魔修',
        outcomes: [
          {
            chance: 0.45,
            successEffects: [
              { type: 'stat', key: 'karma', value: 30 },
              { type: 'cultivation', value: 20 },
            ],
            failEffects: [{ type: 'lifespan', value: -20 }],
            narrative: {
              success: '你斩灭魔修，正道之名远扬。',
              fail: '魔修拼死反扑，你身受重创。',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'demon_lord_offer',
    title: '魔尊招揽',
    description: '魔尊分身亲至，许以魔道至尊功法为酬，条件是献祭正道挚友。',
    weight: 7,
    once: true,
    act: 'golden',
    rarity: 'rare',
    conditions: [{ type: 'flag', key: 'accepted_demon_path', value: true }],
    choices: [
      {
        id: 'accept',
        text: '投效魔尊',
        effects: [
          { type: 'cultivation', value: 50 },
          { type: 'flag', key: 'demon_lord_servant', value: true },
          { type: 'stat', key: 'demonHeart', value: 20 },
        ],
      },
      {
        id: 'betray',
        text: '虚与委蛇，伺机反噬',
        requirements: [{ type: 'stat', key: 'comprehension', min: 55 }],
        outcomes: [
          {
            chance: 0.35,
            successEffects: [
              { type: 'cultivation', value: 35 },
              { type: 'spiritStones', value: 100 },
            ],
            failEffects: [
              { type: 'flag', key: 'demon_lord_servant', value: true },
              { type: 'stat', key: 'demonHeart', value: 30 },
            ],
            narrative: {
              success: '你反杀魔尊分身，夺得魔道秘藏。',
              fail: '奸计败露，你被迫俯首称臣。',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'righteous_siege',
    title: '正道围剿',
    description: '你魔名远播，正道联盟倾巢围剿。是力战群雄，还是遁入蛮荒？',
    weight: 10,
    once: true,
    act: 'golden',
    conditions: [
      { type: 'flag', key: 'accepted_demon_path', value: true },
      { type: 'realm', min: 'golden_core' },
    ],
    choices: [
      {
        id: 'fight',
        text: '力战群雄',
        outcomes: [
          {
            chance: 0.3,
            successEffects: [
              { type: 'cultivation', value: 40 },
              { type: 'flag', key: 'demon_overlord', value: true },
            ],
            failEffects: [{ type: 'flag', key: 'died_in_tribulation', value: true }],
            narrative: {
              success: '你击退群雄，魔威震世，自号魔尊。',
              fail: '寡不敌众，身死道消。',
            },
          },
        ],
      },
      {
        id: 'flee',
        text: '遁入蛮荒',
        hint: '约七成脱身 · 败则遭追杀',
        outcomes: [
          {
            chance: 0.7,
            successEffects: [
              { type: 'cultivation', value: 20 },
              { type: 'lifespan', value: 30 },
            ],
            failEffects: [
              { type: 'lifespan', value: -25 },
              { type: 'stat', key: 'demonHeart', value: 15 },
              { type: 'cultivation', value: 5 },
            ],
            narrative: {
              success: '你遁入蛮荒深处，正道难以追缉，暂得安身。',
              fail: '正道紧追不舍，你重伤遁走，寿元大损。',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'rival_provocation',
    title: '天骄挑衅',
    description:
      '宗门论道大会上，苍穹阁一名天骄弟子当众出言不逊，嘲讽天玄宗弟子不过尔尔。他目光挑衅地看着你，周围各宗弟子纷纷注目。此乃宗门颜面之争。',
    weight: 10,
    years: 1,
    once: true,
    conditions: [
      { type: 'realm', min: 'qi_refining_2' },
      { type: 'flag', key: 'loyal_to_sect', value: true },
    ],
    choices: [
      {
        id: 'accept_challenge',
        text: '当众应战，捍卫宗门',
        outcomes: [
          {
            chance: 0.5,
            luckBonus: 0.004,
            successEffects: [
              { type: 'cultivation', value: 18 },
              { type: 'stat', key: 'karma', value: 12 },
              { type: 'flag', key: 'beat_rival', value: true },
              { type: 'spiritStones', value: 20 },
            ],
            failEffects: [
              { type: 'cultivation', value: 8 },
              { type: 'stat', key: 'demonHeart', value: 8 },
              { type: 'flag', key: 'lost_to_rival', value: true },
            ],
            narrative: {
              success: '你以凌厉手段击败苍穹阁天骄，天玄宗弟子欢呼雷动，你名震各宗。',
              fail: '苍穹阁天骄技高一筹，你惜败当场。虽败犹荣，却心有不甘。',
            },
          },
        ],
      },
      {
        id: 'ignore',
        text: '不与之争，静心论道',
        effects: [
          { type: 'stat', key: 'karma', value: 5 },
          { type: 'stat', key: 'demonHeart', value: -5 },
          { type: 'cultivation', value: 8 },
        ],
      },
      {
        id: 'scheme',
        text: '暗中记下，伺机报复',
        effects: [
          { type: 'flag', key: 'rival_cangqiong', value: true },
          { type: 'stat', key: 'demonHeart', value: 5 },
          { type: 'cultivation', value: 5 },
        ],
      },
    ],
  },
  {
    id: 'sect_battlefield',
    title: '宗门争锋',
    description:
      '天玄宗与苍穹阁因灵脉归属争执不下，最终以弟子比斗定胜负。你作为天玄宗代表之一出战，对面是苍穹阁精心培养的天骄。两宗弟子列阵观战，此战关乎宗门颜面与灵脉归属。',
    weight: 6,
    years: 2,
    once: true,
    conditions: [
      { type: 'realm', min: 'foundation' },
      { type: 'flag', key: 'loyal_to_sect', value: true },
    ],
    choices: [
      {
        id: 'fight_sect',
        text: '全力以赴，为宗门而战',
        outcomes: [
          {
            chance: 0.45,
            luckBonus: 0.005,
            successEffects: [
              { type: 'flag', key: 'sect_battle_hero', value: true },
              { type: 'cultivation', value: 25 },
              { type: 'stat', key: 'karma', value: 15 },
              { type: 'spiritStones', value: 40 },
            ],
            failEffects: [
              { type: 'lifespan', value: -10 },
              { type: 'cultivation', value: 10 },
              { type: 'stat', key: 'demonHeart', value: 5 },
            ],
            narrative: {
              success: '你以精妙功法击败对手，为天玄宗赢得灵脉。宗门上下对你刮目相看。',
              fail: '对手功法诡异，你惜败阵前。宗门虽未责怪，你却暗自发誓要苦修雪耻。',
            },
          },
        ],
      },
      {
        id: 'strategy',
        text: '以阵法布局，智取对手',
        requirements: [{ type: 'formationTier', min: 2 }],
        effects: [
          { type: 'flag', key: 'sect_battle_strategist', value: true },
          { type: 'cultivation', value: 18 },
          { type: 'stat', key: 'comprehension', value: 6 },
          { type: 'spiritStones', value: 30 },
        ],
      },
      {
        id: 'decline_sect',
        text: '主动退让，避免冲突升级',
        effects: [
          { type: 'stat', key: 'karma', value: 8 },
          { type: 'stat', key: 'demonHeart', value: -5 },
        ],
      },
    ],
  },
  {
    id: 'sect_alliance',
    title: '宗门结盟',
    description:
      '魔道势力蠢蠢欲动，天玄宗与数家正道宗门商议结盟抵御。你作为宗门代表参与议事，各宗天骄齐聚一堂。盟约已定，但需派人深入魔域刺探虚实——这既是危险，也是机遇。',
    weight: 5,
    years: 2,
    once: true,
    conditions: [
      { type: 'realm', min: 'foundation' },
      { type: 'flag', key: 'loyal_to_sect', value: true },
    ],
    choices: [
      {
        id: 'volunteer_spy',
        text: '主动请缨，深入魔域',
        outcomes: [
          {
            chance: 0.4,
            luckBonus: 0.005,
            successEffects: [
              { type: 'cultivation', value: 22 },
              { type: 'stat', key: 'karma', value: 15 },
              { type: 'flag', key: 'spy_hero', value: true },
              { type: 'spiritStones', value: 30 },
            ],
            failEffects: [
              { type: 'lifespan', value: -15 },
              { type: 'stat', key: 'demonHeart', value: 12 },
            ],
            narrative: {
              success: '你深入魔域探得虚实，带回重要情报。各宗对你赞誉有加。',
              fail: '魔域凶险，你被魔修发现，重伤逃回。虽完成任务，却元气大伤。',
            },
          },
        ],
      },
      {
        id: 'stay_alliance',
        text: '留守宗门，巩固防线',
        effects: [
          { type: 'stat', key: 'karma', value: 10 },
          { type: 'cultivation', value: 10 },
          { type: 'formationTier', value: 1 },
        ],
      },
      {
        id: 'refuse_alliance',
        text: '独善其身，不参与联盟',
        effects: [
          { type: 'stat', key: 'demonHeart', value: 3 },
          { type: 'cultivation', value: 5 },
        ],
      },
    ],
  },
  {
    id: 'daily_sparring',
    title: '同门切磋',
    description: '演武场上人声喧阗，师兄邀你过招，以验修行进境。',
    weight: 6,
    years: 1,
    cooldown: 4,
    conditions: [{ type: 'flag', key: 'loyal_to_sect', value: true }],
    choices: [
      {
        id: 'spar',
        text: '全力切磋',
        hint: '约五五胜算 · 败则轻伤',
        outcomes: [
          {
            chance: 0.55,
            successEffects: [
              { type: 'cultivation', value: 12 },
              { type: 'stat', key: 'rootBone', value: 2 },
            ],
            failEffects: [
              { type: 'lifespan', value: -5 },
              { type: 'cultivation', value: 3 },
            ],
            narrative: {
              success: '你来我往数十回合，险胜半招，体魄与修为皆有所进。',
              fail: '不慎落败，轻伤退场，却也长了几分见识。',
            },
          },
        ],
      },
      {
        id: 'watch',
        text: '旁观悟招',
        narrative: '你静坐一旁观摩，悟得几式妙解，悟性微增。',
        effects: [
          { type: 'stat', key: 'comprehension', value: 3 },
          { type: 'cultivation', value: 5 },
        ],
      },
    ],
  },
  {
    id: 'daily_scripture',
    title: '藏经阁阅读',
    description: '闲暇无事，你踱入藏经阁，翻阅前人遗留的心得札记。',
    weight: 6,
    years: 1,
    cooldown: 4,
    conditions: [{ type: 'flag', key: 'loyal_to_sect', value: true }],
    choices: [
      {
        id: 'read',
        text: '研读功法',
        narrative: '残卷之中偶现灵光，你对功法领悟更深一层。',
        effects: [
          { type: 'stat', key: 'comprehension', value: 4 },
          { type: 'cultivation', value: 8 },
        ],
      },
      {
        id: 'copy',
        text: '抄录心经',
        narrative: '你誊抄心经数日，心魔稍减，道心愈静。',
        effects: [
          { type: 'stat', key: 'demonHeart', value: -3 },
          { type: 'stat', key: 'karma', value: 2 },
        ],
      },
    ],
  },
  {
    id: 'rival_ambush',
    title: '仇家伏击',
    description:
      '你独自赶路时，前方道路突然被阵法封锁。数名苍穹阁弟子从暗处现身，为首者正是曾败于你手的天骄。他冷笑一声：「今日，便是你的死期。」',
    weight: 5,
    years: 2,
    once: true,
    conditions: [
      { type: 'flag', key: 'beat_rival', value: true },
      { type: 'realm', min: 'foundation' },
    ],
    choices: [
      {
        id: 'fight_ambush',
        text: '以一敌众，背水一战',
        outcomes: [
          {
            chance: 0.35,
            luckBonus: 0.006,
            successEffects: [
              { type: 'cultivation', value: 25 },
              { type: 'stat', key: 'rootBone', value: 5 },
              { type: 'flag', key: 'survived_ambush', value: true },
              { type: 'spiritStones', value: 30 },
            ],
            failEffects: [
              { type: 'lifespan', value: -20 },
              { type: 'stat', key: 'demonHeart', value: 15 },
            ],
            narrative: {
              success: '你以一己之力击退数名苍穹阁弟子，天骄也被你重伤遁走。你的威名更盛。',
              fail: '寡不敌众，你身受重伤，拼死突围而出，元气大损。',
            },
          },
        ],
      },
      {
        id: 'escape_ambush',
        text: '施展遁术脱身',
        outcomes: [
          {
            chance: 0.6,
            luckBonus: 0.004,
            successEffects: [
              { type: 'cultivation', value: 8 },
              { type: 'stat', key: 'luck', value: 3 },
            ],
            failEffects: [
              { type: 'lifespan', value: -10 },
              { type: 'cultivation', value: 5 },
            ],
            narrative: {
              success: '你施展遁术瞬间消失，苍穹阁弟子扑了个空。',
              fail: '阵法封锁了遁术，你被迫硬接一掌才脱身。',
            },
          },
        ],
      },
      {
        id: 'surrender_ambush',
        text: '交出灵石求和',
        effects: [
          { type: 'spiritStones', value: -40, set: false },
          { type: 'stat', key: 'karma', value: -5 },
          { type: 'stat', key: 'demonHeart', value: 5 },
        ],
      },
    ],
  },
  {
    id: 'ancient_formation_battle',
    title: '阵法对决',
    description:
      '你与一名苍穹阁阵法师在秘境中狭路相逢。双方都盯上了同一处阵法遗迹，唯有以阵法造诣一决高下。',
    weight: 6,
    years: 2,
    once: true,
    conditions: [
      { type: 'formationTier', min: 1 },
      { type: 'realm', min: 'foundation' },
    ],
    choices: [
      {
        id: 'formation_duel',
        text: '以阵法造诣一决高下',
        outcomes: [
          {
            chance: 0.45,
            luckBonus: 0.005,
            successEffects: [
              { type: 'formationTier', value: 1 },
              { type: 'cultivation', value: 18 },
              { type: 'stat', key: 'comprehension', value: 5 },
            ],
            failEffects: [
              { type: 'cultivation', value: 8 },
              { type: 'stat', key: 'demonHeart', value: 5 },
            ],
            narrative: {
              success: '你以精妙阵法压制对手，获得阵法传承，阵道修为大进。',
              fail: '对手阵法更胜一筹，你惜败而归。',
            },
          },
        ],
      },
      {
        id: 'study_formation',
        text: '不争不抢，静心参悟',
        effects: [
          { type: 'formationTier', value: 1 },
          { type: 'stat', key: 'comprehension', value: 4 },
        ],
      },
      {
        id: 'retreat_formation',
        text: '主动退让',
        effects: [
          { type: 'stat', key: 'karma', value: 5 },
          { type: 'stat', key: 'demonHeart', value: -3 },
        ],
      },
    ],
  },
]
