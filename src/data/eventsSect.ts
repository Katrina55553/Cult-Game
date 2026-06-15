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
    conditions: [{ type: 'flag', key: 'loyal_to_sect', value: true }],
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
    conditions: [{ type: 'flag', key: 'loyal_to_sect', value: true }],
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
  {
    id: 'qinglian_visit',
    title: '青莲剑宗来访',
    description:
      '青莲剑宗派人前来天玄宗切磋剑道。领队是一名冷峻的青年剑修，剑意凌厉。他当众挑战天玄宗弟子，无人敢应。长老看向了你。',
    weight: 8,
    years: 1,
    once: true,
    conditions: [
      { type: 'flag', key: 'loyal_to_sect', value: true },
      { type: 'realm', min: 'qi_refining_2' },
    ],
    choices: [
      {
        id: 'accept_qinglian',
        text: '应战，捍卫宗门颜面',
        outcomes: [
          {
            chance: 0.45,
            luckBonus: 0.005,
            successEffects: [
              { type: 'cultivation', value: 20 },
              { type: 'stat', key: 'karma', value: 10 },
              { type: 'flag', key: 'beat_qinglian', value: true },
            ],
            failEffects: [
              { type: 'cultivation', value: 10 },
              { type: 'stat', key: 'demonHeart', value: 3 },
            ],
            narrative: {
              success: '你以精妙剑法击败青莲剑宗弟子，赢得满堂喝彩。',
              fail: '青莲剑宗剑法凌厉，你惜败但赢得了对手的尊重。',
            },
          },
        ],
      },
      {
        id: 'learn_qinglian',
        text: '借机观摩青莲剑法',
        effects: [
          { type: 'cultivation', value: 12 },
          { type: 'stat', key: 'comprehension', value: 5 },
        ],
      },
      {
        id: 'decline_qinglian',
        text: '实力不足，不逞强',
        effects: [
          { type: 'stat', key: 'karma', value: 3 },
        ],
      },
    ],
  },
  {
    id: 'yaogu_trade',
    title: '药谷交易',
    description:
      '药谷派人来天玄宗兜售丹药，价格公道。你若有灵石，可购置一些提升修为的丹药。药谷弟子还透露，他们正在招收外门丹师。',
    weight: 8,
    years: 1,
    maxTimes: 2,
    cooldown: 6,
    conditions: [{ type: 'flag', key: 'loyal_to_sect', value: true }],
    choices: [
      {
        id: 'buy_yaogu',
        text: '购买丹药',
        requirements: [{ type: 'resource', key: 'spiritStones', min: 20 }],
        effects: [
          { type: 'spiritStones', value: -20 },
          { type: 'cultivation', value: 15 },
          { type: 'alchemyTier', value: 1 },
        ],
      },
      {
        id: 'learn_yaogu',
        text: '向药谷弟子请教丹道',
        effects: [
          { type: 'alchemyTier', value: 1 },
          { type: 'stat', key: 'comprehension', value: 3 },
        ],
      },
      {
        id: 'skip_yaogu',
        text: '不感兴趣',
        effects: [
          { type: 'cultivation', value: 3 },
        ],
      },
    ],
  },
  {
    id: 'wanyao_encounter',
    title: '万妖殿使者',
    description:
      '一名万妖殿使者前来天玄宗递交和书。她是一只化形的白狐，举止优雅却透着妖异。长老们对此争论不休，有人主张接受，有人坚决反对。',
    weight: 7,
    years: 2,
    once: true,
    conditions: [
      { type: 'flag', key: 'loyal_to_sect', value: true },
      { type: 'realm', min: 'foundation' },
    ],
    choices: [
      {
        id: 'support_wanyao',
        text: '支持与万妖殿结盟',
        effects: [
          { type: 'stat', key: 'karma', value: 5 },
          { type: 'stat', key: 'comprehension', value: 4 },
        ],
      },
      {
        id: 'oppose_wanyao',
        text: '反对与妖修为伍',
        effects: [
          { type: 'stat', key: 'karma', value: 8 },
          { type: 'stat', key: 'rootBone', value: 3 },
        ],
      },
      {
        id: 'talk_wanyao',
        text: '私下与白狐使者交谈',
        effects: [
          { type: 'stat', key: 'comprehension', value: 6 },
          { type: 'stat', key: 'luck', value: 3 },
        ],
      },
    ],
  },
  {
    id: 'guiyi_visit',
    title: '归一寺讲禅',
    description:
      '归一寺高僧前来天玄宗讲禅说法。他言道：「因果轮回，善恶有报。修仙者当以修心为本。」你听后若有所悟。',
    weight: 7,
    years: 1,
    once: true,
    conditions: [{ type: 'flag', key: 'loyal_to_sect', value: true }],
    choices: [
      {
        id: 'listen_guiyi',
        text: '认真聆听禅理',
        effects: [
          { type: 'stat', key: 'demonHeart', value: -8 },
          { type: 'stat', key: 'karma', value: 8 },
          { type: 'stat', key: 'comprehension', value: 4 },
        ],
      },
      {
        id: 'debate_guiyi',
        text: '与高僧辩论修仙之道',
        effects: [
          { type: 'stat', key: 'comprehension', value: 6 },
          { type: 'divineSense', value: 5 },
        ],
      },
      {
        id: 'skip_guiyi',
        text: '对佛法不感兴趣',
        effects: [
          { type: 'cultivation', value: 3 },
        ],
      },
    ],
  },
  {
    id: 'sect_exchange',
    title: '宗门交流',
    description:
      '天玄宗与其他几家宗门商议弟子交流计划。你可以选择前往青莲剑宗学习剑法，或去药谷研习丹道，或去归一寺修炼神识。',
    weight: 7,
    years: 2,
    once: true,
    conditions: [
      { type: 'flag', key: 'loyal_to_sect', value: true },
      { type: 'realm', min: 'qi_refining_3' },
    ],
    choices: [
      {
        id: 'visit_qinglian',
        text: '前往青莲剑宗',
        effects: [
          { type: 'cultivation', value: 18 },
          { type: 'stat', key: 'rootBone', value: 5 },
        ],
      },
      {
        id: 'visit_yaogu',
        text: '前往药谷',
        effects: [
          { type: 'alchemyTier', value: 1 },
          { type: 'stat', key: 'comprehension', value: 5 },
        ],
      },
      {
        id: 'visit_guiyi',
        text: '前往归一寺',
        effects: [
          { type: 'divineSense', value: 10 },
          { type: 'stat', key: 'demonHeart', value: -8 },
        ],
      },
    ],
  },
  {
    id: 'moyu_invasion',
    title: '魔域入侵',
    description:
      '魔域六宗突然发难，联合进攻正道势力。天玄宗首当其冲，山门外魔气冲天。你必须为宗门而战。',
    weight: 6,
    years: 2,
    once: true,
    conditions: [{ type: 'flag', key: 'loyal_to_sect', value: true }],
    choices: [
      {
        id: 'frontline',
        text: '冲上最前线',
        outcomes: [
          {
            chance: 0.4,
            luckBonus: 0.005,
            successEffects: [
              { type: 'cultivation', value: 25 },
              { type: 'stat', key: 'karma', value: 15 },
              { type: 'flag', key: 'moyu_war_hero', value: true },
            ],
            failEffects: [
              { type: 'lifespan', value: -15 },
              { type: 'stat', key: 'demonHeart', value: 10 },
            ],
            narrative: {
              success: '你在前线浴血奋战，击退魔域先锋。宗门上下对你敬佩不已。',
              fail: '魔域攻势凶猛，你身受重伤，拼死才退回山门。',
            },
          },
        ],
      },
      {
        id: 'defend_gate',
        text: '守护山门大阵',
        effects: [
          { type: 'formationTier', value: 1 },
          { type: 'stat', key: 'karma', value: 10 },
          { type: 'cultivation', value: 12 },
        ],
      },
      {
        id: 'evacuate_disciples',
        text: '护送低阶弟子撤离',
        effects: [
          { type: 'stat', key: 'karma', value: 12 },
          { type: 'stat', key: 'luck', value: 4 },
        ],
      },
    ],
  },

  // ──── 青莲剑宗：论剑大会 ────
  {
    id: 'qinglian_tournament',
    title: '青莲论剑',
    description:
      '青莲剑宗广发英雄帖，邀天下剑修齐聚西山论剑。天玄宗遣你为代表前往赴会。西山之巅，千柄长剑悬于崖壁，剑气冲霄。各宗天骄已在擂台前列阵等候。',
    weight: 6,
    years: 2,
    once: true,
    conditions: [
      { type: 'realm', min: 'foundation' },
      { type: 'flag', key: 'loyal_to_sect', value: true },
    ],
    choices: [
      {
        id: 'fight_qinglian_tournament',
        text: '登台论剑，以剑会友',
        outcomes: [
          {
            chance: 0.45,
            luckBonus: 0.005,
            successEffects: [
              { type: 'cultivation', value: 25 },
              { type: 'swordTier', value: 1 },
              { type: 'stat', key: 'comprehension', value: 6 },
              { type: 'flag', key: 'qinglian_champion', value: true },
            ],
            failEffects: [
              { type: 'cultivation', value: 12 },
              { type: 'stat', key: 'comprehension', value: 4 },
            ],
            narrative: {
              success: '你以天玄宗剑法力压群雄，夺得论剑魁首。青莲剑宗长老赞你剑心通明，赠你一枚剑意玉简。',
              fail: '高手如云，你惜败于半决赛。但观摩各派剑法，剑道领悟大有长进。',
            },
          },
        ],
      },
      {
        id: 'observe_qinglian_tournament',
        text: '旁观论剑，揣摩各家剑意',
        effects: [
          { type: 'stat', key: 'comprehension', value: 8 },
          { type: 'swordTier', value: 1 },
          { type: 'cultivation', value: 10 },
        ],
      },
      {
        id: 'befriend_qinglian',
        text: '与青莲弟子切磋交流',
        effects: [
          { type: 'cultivation', value: 15 },
          { type: 'stat', key: 'karma', value: 8 },
          { type: 'flag', key: 'qinglian_friend', value: true },
        ],
      },
    ],
  },

  // ──── 青莲剑宗：剑道指点 ────
  {
    id: 'qinglian_mentor',
    title: '青莲前辈',
    description:
      '你在青莲剑宗后山偶遇一位白发剑修，他独坐崖边，膝上横着一柄古朴长剑。见你走近，他淡淡道：「你的剑意尚缺一味，可愿听老夫一言？」',
    weight: 5,
    years: 2,
    once: true,
    rarity: 'rare',
    conditions: [
      { type: 'flag', key: 'qinglian_friend', value: true },
      { type: 'swordTier', min: 1 },
    ],
    choices: [
      {
        id: 'listen_qinglian_mentor',
        text: '恭敬请教',
        effects: [
          { type: 'swordTier', value: 1 },
          { type: 'cultivation', value: 20 },
          { type: 'stat', key: 'comprehension', value: 8 },
        ],
      },
      {
        id: 'spar_qinglian_mentor',
        text: '请求切磋印证',
        outcomes: [
          {
            chance: 0.4,
            luckBonus: 0.005,
            successEffects: [
              { type: 'swordTier', value: 1 },
              { type: 'cultivation', value: 25 },
              { type: 'stat', key: 'rootBone', value: 5 },
            ],
            failEffects: [
              { type: 'cultivation', value: 10 },
              { type: 'stat', key: 'comprehension', value: 5 },
            ],
            narrative: {
              success: '你与前辈过招百招，他赞你剑中有情，传你一式青莲剑诀。',
              fail: '前辈剑法深不可测，你十招便败。但他指点你的不足，受益匪浅。',
            },
          },
        ],
      },
    ],
  },

  // ──── 药谷：瘟疫求援 ────
  {
    id: 'yaogu_plague',
    title: '药谷求援',
    description:
      '药谷急信传来：谷中突发诡异丹毒，数名丹师走火入魔，药谷谷主亲自传信向天玄宗求援。你身为宗门弟子，主动请缨前往。',
    weight: 6,
    years: 2,
    once: true,
    conditions: [
      { type: 'realm', min: 'qi_refining_3' },
      { type: 'flag', key: 'loyal_to_sect', value: true },
    ],
    choices: [
      {
        id: 'help_yaogu',
        text: '以丹道知识协助解毒',
        outcomes: [
          {
            chance: 0.55,
            luckBonus: 0.004,
            successEffects: [
              { type: 'alchemyTier', value: 1 },
              { type: 'cultivation', value: 18 },
              { type: 'stat', key: 'karma', value: 15 },
              { type: 'flag', key: 'yaogu_ally', value: true },
            ],
            failEffects: [
              { type: 'lifespan', value: -8 },
              { type: 'stat', key: 'demonHeart', value: 5 },
            ],
            narrative: {
              success: '你以精湛丹术协助药谷解毒，谷主感激不尽，赠你一卷珍稀丹方。',
              fail: '丹毒诡异异常，你虽尽力却未能完全化解，自己也沾染了些许丹毒。',
            },
          },
        ],
      },
      {
        id: 'study_yaogu_plague',
        text: '研究丹毒成因',
        effects: [
          { type: 'alchemyTier', value: 1 },
          { type: 'stat', key: 'comprehension', value: 6 },
          { type: 'cultivation', value: 10 },
        ],
      },
    ],
  },

  // ──── 药谷：大师传承 ────
  {
    id: 'yaogu_legacy',
    title: '药谷传承',
    description:
      '药谷深处的丹房中，一位隐退多年的丹道大师正在整理毕生丹方。他见你根骨不凡，又曾助药谷度过难关，便问道：「老夫这些丹方，你可愿继承？」',
    weight: 5,
    years: 2,
    once: true,
    rarity: 'rare',
    conditions: [{ type: 'flag', key: 'yaogu_ally', value: true }],
    choices: [
      {
        id: 'accept_yaogu_legacy',
        text: '叩首受传',
        effects: [
          { type: 'alchemyTier', value: 1 },
          { type: 'cultivation', value: 20 },
          { type: 'stat', key: 'comprehension', value: 8 },
          { type: 'lifespan', value: 10 },
        ],
      },
      {
        id: 'decline_yaogu_legacy',
        text: '只取一卷丹方，不贪多',
        effects: [
          { type: 'alchemyTier', value: 1 },
          { type: 'stat', key: 'karma', value: 8 },
          { type: 'cultivation', value: 10 },
        ],
      },
    ],
  },

  // ──── 归一寺：封魔协助 ────
  {
    id: 'guiyi_seal',
    title: '归一封魔',
    description:
      '归一寺方丈急召各宗弟子：寺下镇压的远古魔物蠢蠢欲动，封印日渐松动。需各方修士以灵力协助加固封印。此乃功德无量之举，却也凶险异常。',
    weight: 6,
    years: 2,
    once: true,
    conditions: [
      { type: 'realm', min: 'foundation' },
      { type: 'flag', key: 'loyal_to_sect', value: true },
    ],
    choices: [
      {
        id: 'help_guiyi_seal',
        text: '以灵力协助加固封印',
        outcomes: [
          {
            chance: 0.5,
            luckBonus: 0.005,
            successEffects: [
              { type: 'stat', key: 'karma', value: 20 },
              { type: 'divineSense', value: 10 },
              { type: 'cultivation', value: 18 },
              { type: 'flag', key: 'guiyi_ally', value: true },
            ],
            failEffects: [
              { type: 'lifespan', value: -10 },
              { type: 'stat', key: 'demonHeart', value: 10 },
            ],
            narrative: {
              success: '你以纯净灵力注入封印阵眼，封印重归稳固。方丈合十道：「施主功德无量。」',
              fail: '魔物反噬猛烈，你被魔气所伤，封印勉强稳住。',
            },
          },
        ],
      },
      {
        id: 'pray_guiyi',
        text: '在寺中诵经祈福',
        effects: [
          { type: 'stat', key: 'demonHeart', value: -10 },
          { type: 'stat', key: 'karma', value: 10 },
          { type: 'divineSense', value: 5 },
        ],
      },
    ],
  },

  // ──── 归一寺：禅修顿悟 ────
  {
    id: 'guiyi_enlightenment',
    title: '归一禅悟',
    description:
      '归一寺后山禅房，一位老僧正在打坐。你受邀入内，他递给你一杯清茶，缓缓道：「施主心中有执念。放下，方能得道。」茶香袅袅，禅意悠远。',
    weight: 5,
    years: 2,
    once: true,
    rarity: 'rare',
    conditions: [{ type: 'flag', key: 'guiyi_ally', value: true }],
    choices: [
      {
        id: 'meditate_guiyi',
        text: '静坐参禅，放下执念',
        effects: [
          { type: 'stat', key: 'demonHeart', value: -20 },
          { type: 'stat', key: 'comprehension', value: 10 },
          { type: 'cultivation', value: 15 },
          { type: 'lifespan', value: 5 },
        ],
      },
      {
        id: 'debate_guiyi',
        text: '与老僧论道',
        effects: [
          { type: 'stat', key: 'comprehension', value: 8 },
          { type: 'divineSense', value: 12 },
          { type: 'cultivation', value: 12 },
        ],
      },
    ],
  },

  // ──── 万妖殿：妖兽交易 ────
  {
    id: 'wanyao_trade',
    title: '万妖殿交易',
    description:
      '一名万妖殿妖修在坊市中开设摊位，出售罕见的妖兽内丹和灵材。价格不菲，但货真价实。妖修见你驻足，微微一笑：「人族修士，有兴趣看看吗？」',
    weight: 7,
    years: 1,
    maxTimes: 2,
    cooldown: 6,
    conditions: [{ type: 'realm', min: 'qi_refining_2' }],
    choices: [
      {
        id: 'buy_wanyao',
        text: '购买妖兽内丹',
        requirements: [{ type: 'resource', key: 'spiritStones', min: 30 }],
        effects: [
          { type: 'spiritStones', value: -30 },
          { type: 'cultivation', value: 18 },
          { type: 'stat', key: 'rootBone', value: 3 },
        ],
      },
      {
        id: 'exchange_wanyao',
        text: '以灵草交换灵材',
        effects: [
          { type: 'alchemyTier', value: 1 },
          { type: 'stat', key: 'comprehension', value: 4 },
          { type: 'stat', key: 'luck', value: 3 },
        ],
      },
      {
        id: 'chat_wanyao',
        text: '与妖修闲聊，打探消息',
        effects: [
          { type: 'stat', key: 'comprehension', value: 5 },
          { type: 'stat', key: 'luck', value: 3 },
        ],
      },
    ],
  },

  // ──── 万妖殿：妖潮危机 ────
  {
    id: 'wanyao_crisis',
    title: '万妖殿内乱',
    description:
      '万妖殿爆发内乱，主战派妖修失控，大批低阶妖兽涌出妖域，殃及附近村镇。万妖殿使者紧急找到你：「殿主求和，但主战派不从。你可愿助我们平息内乱？」',
    weight: 5,
    years: 2,
    once: true,
    conditions: [
      { type: 'realm', min: 'foundation' },
      { type: 'flag', key: 'loyal_to_sect', value: true },
    ],
    choices: [
      {
        id: 'help_wanyao',
        text: '深入妖域协助平乱',
        outcomes: [
          {
            chance: 0.45,
            luckBonus: 0.005,
            successEffects: [
              { type: 'cultivation', value: 25 },
              { type: 'stat', key: 'karma', value: 15 },
              { type: 'spiritStones', value: 40 },
              { type: 'flag', key: 'wanyao_friend', value: true },
            ],
            failEffects: [
              { type: 'lifespan', value: -12 },
              { type: 'stat', key: 'demonHeart', value: 8 },
            ],
            narrative: {
              success: '你协助万妖殿平息内乱，殿主以厚礼相赠，人妖两族关系缓和。',
              fail: '妖域深处妖气冲天，你被主战派妖修重伤，拼死才脱身。',
            },
          },
        ],
      },
      {
        id: 'defend_village_wanyao',
        text: '守护附近村镇百姓',
        effects: [
          { type: 'stat', key: 'karma', value: 15 },
          { type: 'stat', key: 'rootBone', value: 3 },
          { type: 'cultivation', value: 10 },
        ],
      },
      {
        id: 'ignore_wanyao',
        text: '万妖殿内乱与我何干',
        effects: [
          { type: 'stat', key: 'karma', value: -5 },
          { type: 'cultivation', value: 5 },
        ],
      },
    ],
  },
]
