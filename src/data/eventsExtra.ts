import type { GameEvent } from '../types/game'

export const EXTRA_EVENTS: GameEvent[] = [
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
    id: 'market_duel',
    title: '坊市争霸',
    description: '坊市举办斗宝盛会，夺魁者可获海量灵石与珍稀丹方。你手头灵石宽裕，可要一试？',
    weight: 9,
    act: 'qi',
    maxTimes: 2,
    cooldown: 6,
    conditions: [{ type: 'flag', key: 'refused_all_sects', value: true }],
    choices: [
      {
        id: 'join',
        text: '参加斗宝',
        hint: '需灵石 · 有成有败',
        requirements: [{ type: 'resource', key: 'spiritStones', min: 40 }],
        outcomes: [
          {
            chance: 0.5,
            luckBonus: 0.004,
            successEffects: [
              { type: 'spiritStones', value: 80 },
              { type: 'flag', key: 'mastered_alchemy', value: true },
            ],
            failEffects: [{ type: 'spiritStones', value: 0, set: true }],
            narrative: {
              success: '你力压群雄夺魁，丹方与灵石尽入囊中。',
              fail: '斗宝落败，灵石尽数赔光。',
            },
          },
        ],
      },
      {
        id: 'watch',
        text: '旁观悟法',
        effects: [{ type: 'stat', key: 'comprehension', value: 5 }],
      },
    ],
  },
  {
    id: 'solo_tribulation',
    title: '独行渡劫',
    description: '你孑然立于荒峰之巅，天劫将至。无宗门护法，无道侣相佐，唯凭一己道心硬抗。',
    weight: 10,
    once: true,
    act: 'foundation',
    conditions: [
      { type: 'flag', key: 'refused_all_sects', value: true },
      { type: 'cultivation', min: 85 },
    ],
    choices: [
      {
        id: 'endure',
        text: '以身渡劫',
        outcomes: [
          {
            chance: 0.4,
            successEffects: [
              { type: 'breakthrough' },
              { type: 'stat', key: 'rootBone', value: 8 },
            ],
            failEffects: [{ type: 'lifespan', value: -25 }],
            narrative: {
              success: '独抗天雷而不屈，筑基大成，道心愈发坚固。',
              fail: '天劫未能渡过，重伤闭关。',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'lover_jealousy',
    title: '道侣反目',
    description: '沈霜凝得知你与叶轻眉曾有机缘纠葛，冷落数日，彼此道心蒙尘。',
    weight: 12,
    once: true,
    conditions: [
      { type: 'flag', key: 'has_companion', value: true },
      { type: 'flag', key: 'met_lin_wanyue', value: true },
      { type: 'flag', key: 'met_su_qing', value: true },
    ],
    choices: [
      {
        id: 'apologize',
        text: '坦诚相告，消弭嫌隙',
        effects: [
          { type: 'stat', key: 'demonHeart', value: -10 },
          { type: 'cultivation', value: 15 },
        ],
      },
      {
        id: 'cold',
        text: '冷淡处之，潜心修道',
        effects: [
          { type: 'stat', key: 'demonHeart', value: 15 },
          { type: 'cultivation', value: 10 },
        ],
      },
      {
        id: 'break',
        text: '割袍断义',
        effects: [
          { type: 'flag', key: 'has_companion', value: false },
          { type: 'stat', key: 'demonHeart', value: 20 },
        ],
      },
    ],
  },
  {
    id: 'rival_beauty',
    title: '情敌现身',
    description: '一名世家公子当众向你的道侣提亲，携厚礼登门，言语之间满是挑衅之意。',
    weight: 10,
    once: true,
    act: 'foundation',
    conditions: [{ type: 'flag', key: 'has_companion', value: true }],
    choices: [
      {
        id: 'duel',
        text: '公开决斗',
        outcomes: [
          {
            chance: 0.55,
            successEffects: [
              { type: 'cultivation', value: 20 },
              { type: 'stat', key: 'karma', value: 10 },
            ],
            failEffects: [
              { type: 'stat', key: 'demonHeart', value: 12 },
            ],
            narrative: {
              success: '你击败情敌，道侣对你更为倾心。',
              fail: '决斗落败，心魔暗生，道侣好言宽慰。',
            },
          },
        ],
      },
      {
        id: 'ignore',
        text: '置之不理',
        effects: [{ type: 'stat', key: 'demonHeart', value: 8 }],
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
    id: 'floating_isle',
    title: '浮空残岛',
    description: '云雾拨开，一座残破浮岛显现于天际。岛上古木蔽日，隐约有宝光流转。',
    weight: 9,
    years: 2,
    once: true,
    rarity: 'rare',
    choices: [
      {
        id: 'explore',
        text: '登岛探宝',
        hint: '约五成得手 · 败则轻伤',
        outcomes: [
          {
            chance: 0.5,
            luckBonus: 0.004,
            successEffects: [
              { type: 'cultivation', value: 18 },
              { type: 'spiritStones', value: 35 },
              { type: 'stat', key: 'luck', value: 3 },
            ],
            failEffects: [
              { type: 'lifespan', value: -5 },
              { type: 'cultivation', value: 5 },
            ],
            narrative: {
              success: '你在浮岛残殿中觅得灵石与残卷，修为大涨。',
              fail: '误触残阵禁制，你轻伤脱身，仍有所悟。',
            },
          },
        ],
      },
      {
        id: 'observe',
        text: '远观悟法',
        narrative: '你远观浮岛灵气流转之势，对天地法则多了一分体悟。',
        effects: [
          { type: 'stat', key: 'comprehension', value: 4 },
          { type: 'cultivation', value: 8 },
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
    maxTimes: 2,
    cooldown: 8,
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
    maxTimes: 3,
    cooldown: 6,
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
    id: 'spirit_crane',
    title: '云中灵鹤',
    description:
      '云海之上，一只通体雪白的灵鹤盘旋而下，落在你面前的古松之上。它眸泛灵光，翅展丈余，竟是开了灵智的仙禽。灵鹤歪头看你片刻，似在考量你是否有缘。',
    weight: 6,
    years: 1,
    once: true,
    rarity: 'rare',
    conditions: [{ type: 'realm', min: 'qi_refining_2' }],
    choices: [
      {
        id: 'befriend_crane',
        text: '以灵果引诱，诚心结交',
        requirements: [{ type: 'resource', key: 'spiritStones', min: 15 }],
        effects: [
          { type: 'spiritStones', value: -15 },
          { type: 'spiritBeast', name: '灵鹤', tier: 1 },
          { type: 'stat', key: 'luck', value: 5 },
          { type: 'cultivation', value: 8 },
        ],
      },
      {
        id: 'bow_crane',
        text: '恭敬行礼，不强求缘分',
        effects: [
          { type: 'stat', key: 'karma', value: 8 },
          { type: 'stat', key: 'luck', value: 3 },
        ],
      },
      {
        id: 'catch_crane',
        text: '以法术强行收服',
        outcomes: [
          {
            chance: 0.25,
            luckBonus: 0.005,
            successEffects: [
              { type: 'spiritBeast', name: '灵鹤', tier: 1 },
              { type: 'cultivation', value: 10 },
            ],
            failEffects: [
              { type: 'stat', key: 'karma', value: -10 },
              { type: 'lifespan', value: -5 },
            ],
            narrative: {
              success: '你以法术困住灵鹤，它挣扎片刻后认你为主。',
              fail: '灵鹤振翅高飞，一道灵风将你掀翻在地，它扬长而去。',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'spirit_turtle',
    title: '玄潭老龟',
    description:
      '深潭之中浮出一只巨龟，龟甲上天然生有八卦纹路，灵光隐现。它已在此潭修行数百年，性情温吞，见你不躲不避，缓缓开口道：「小友，可愿听老朽讲一段古？」',
    weight: 5,
    years: 2,
    once: true,
    rarity: 'rare',
    conditions: [{ type: 'realm', min: 'foundation' }],
    choices: [
      {
        id: 'listen_turtle',
        text: '恭敬聆听老龟讲古',
        effects: [
          { type: 'stat', key: 'comprehension', value: 8 },
          { type: 'cultivation', value: 15 },
          { type: 'stat', key: 'karma', value: 5 },
          { type: 'flag', key: 'befriended_turtle', value: true },
        ],
      },
      {
        id: 'bond_turtle',
        text: '恳请老龟与你同行',
        requirements: [{ type: 'stat', key: 'karma', min: 20 }],
        effects: [
          { type: 'spiritBeast', name: '玄龟', tier: 1 },
          { type: 'stat', key: 'comprehension', value: 5 },
          { type: 'lifespan', value: 10 },
        ],
      },
      {
        id: 'take_shell',
        text: '夺取龟甲炼器',
        outcomes: [
          {
            chance: 0.35,
            luckBonus: 0.004,
            successEffects: [
              { type: 'artifact', id: 'turtle_shell', name: '玄龟甲' },
              { type: 'stat', key: 'demonHeart', value: 12 },
            ],
            failEffects: [
              { type: 'lifespan', value: -15 },
              { type: 'stat', key: 'karma', value: -20 },
            ],
            narrative: {
              success: '你趁老龟不备夺其甲壳，此甲坚不可摧，却让你因果大损。',
              fail: '老龟虽温吞却修行深厚，一道水柱将你震飞，你重伤跌入深潭。',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'fire_tiger',
    title: '赤焰幼虎',
    description:
      '火山熔岩旁的洞穴中，一只赤红色幼虎正在舔舐伤口。它浑身冒着微弱火焰，虎目圆睁，虽年幼却凶性十足。洞壁上留有成年妖虎的爪痕——它的母亲恐怕已经遭遇不测。',
    weight: 6,
    years: 1,
    once: true,
    rarity: 'rare',
    conditions: [{ type: 'realm', min: 'qi_refining_3' }],
    choices: [
      {
        id: 'adopt_tiger',
        text: '以灵泉替它疗伤，带它同行',
        effects: [
          { type: 'spiritBeast', name: '赤焰虎', tier: 1 },
          { type: 'stat', key: 'karma', value: 8 },
          { type: 'stat', key: 'rootBone', value: 3 },
        ],
      },
      {
        id: 'leave_tiger',
        text: '留下灵药，悄然离去',
        effects: [
          { type: 'stat', key: 'karma', value: 10 },
          { type: 'stat', key: 'luck', value: 3 },
        ],
      },
      {
        id: 'kill_tiger',
        text: '击杀幼虎取其火丹',
        outcomes: [
          {
            chance: 0.5,
            luckBonus: 0.003,
            successEffects: [
              { type: 'spiritStones', value: 30 },
              { type: 'stat', key: 'rootBone', value: 5 },
              { type: 'stat', key: 'demonHeart', value: 10 },
            ],
            failEffects: [
              { type: 'lifespan', value: -10 },
              { type: 'stat', key: 'demonHeart', value: 8 },
            ],
            narrative: {
              success: '你击杀幼虎取出火丹，火属性灵力灌入经脉，根骨有所提升。',
              fail: '幼虎虽幼，临死反扑的火焰仍灼伤了你数处经脉。',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'secret_realm_treasure',
    title: '秘境夺宝',
    description:
      '上古秘境开启，你深入其中，发现一座被禁制封印的石殿。殿内宝光冲天，似有重宝。然而你不远处，玄天宗的天骄弟子也盯上了此处，双方剑拔弩张。',
    weight: 8,
    years: 2,
    once: true,
    act: 'foundation',
    choices: [
      {
        id: 'fight_for_treasure',
        text: '抢先出手，夺宝在先',
        outcomes: [
          {
            chance: 0.45,
            luckBonus: 0.005,
            successEffects: [
              { type: 'spiritStones', value: 50 },
              { type: 'artifact', id: 'realm_treasure', name: '秘境灵宝' },
              { type: 'flag', key: 'rival_xuantian', value: true },
              { type: 'cultivation', value: 15 },
            ],
            failEffects: [
              { type: 'lifespan', value: -12 },
              { type: 'stat', key: 'demonHeart', value: 10 },
              { type: 'flag', key: 'rival_xuantian', value: true },
            ],
            narrative: {
              success: '你以迅雷之势夺下灵宝，玄天宗天骄怒目而视，立誓日后必报此仇。',
              fail: '玄天宗天骄早有防备，一掌将你震退，灵宝落入他手。你含恨而退。',
            },
          },
        ],
      },
      {
        id: 'negotiate',
        text: '提议平分宝物',
        effects: [
          { type: 'spiritStones', value: 25 },
          { type: 'stat', key: 'karma', value: 8 },
          { type: 'cultivation', value: 10 },
        ],
      },
      {
        id: 'retreat',
        text: '退避三舍，另寻他处',
        effects: [
          { type: 'stat', key: 'luck', value: 5 },
          { type: 'cultivation', value: 5 },
        ],
      },
    ],
  },
  {
    id: 'rival_provocation',
    title: '天骄挑衅',
    description:
      '宗门论道大会上，玄天宗一名天骄弟子当众出言不逊，嘲讽天玄宗弟子不过尔尔。他目光挑衅地看着你，周围各宗弟子纷纷注目。此乃宗门颜面之争。',
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
              success: '你以凌厉手段击败玄天宗天骄，天玄宗弟子欢呼雷动，你名震各宗。',
              fail: '玄天宗天骄技高一筹，你惜败当场。虽败犹荣，却心有不甘。',
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
          { type: 'flag', key: 'rival_xuantian', value: true },
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
      '天玄宗与玄天宗因灵脉归属争执不下，最终以弟子比斗定胜负。你作为天玄宗代表之一出战，对面是玄天宗精心培养的天骄。两宗弟子列阵观战，此战关乎宗门颜面与灵脉归属。',
    weight: 6,
    years: 2,
    once: true,
    conditions: [{ type: 'realm', min: 'foundation' }],
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
    id: 'ancient_ruins_deep',
    title: '遗迹深处',
    description:
      '大能遗迹深处，你发现一座悬浮的玉台，上面放着一枚散发古朴气息的储物戒指。然而另一名修士也从侧门闯入，他身着玄天宗服饰，修为与你不相上下。二人对视，空气凝固。',
    weight: 7,
    years: 2,
    once: true,
    act: 'golden',
    choices: [
      {
        id: 'claim_first',
        text: '先下手为强',
        outcomes: [
          {
            chance: 0.5,
            luckBonus: 0.005,
            successEffects: [
              { type: 'spiritStones', value: 70 },
              { type: 'artifact', id: 'ancient_ring', name: '大能遗戒' },
              { type: 'flag', key: 'deep_rival', value: true },
              { type: 'cultivation', value: 20 },
            ],
            failEffects: [
              { type: 'lifespan', value: -15 },
              { type: 'stat', key: 'demonHeart', value: 12 },
              { type: 'flag', key: 'deep_rival', value: true },
            ],
            narrative: {
              success: '你抢先一步夺下储物戒，内藏大量灵石与一件古宝。玄天宗修士恨恨离去。',
              fail: '对方早有防备，一道剑气划伤你手臂，储物戒被他夺走。',
            },
          },
        ],
      },
      {
        id: 'share_ruins',
        text: '提议各取一半',
        effects: [
          { type: 'spiritStones', value: 35 },
          { type: 'stat', key: 'karma', value: 10 },
          { type: 'cultivation', value: 12 },
        ],
      },
      {
        id: 'yield_ruins',
        text: '让出宝物，结个善缘',
        effects: [
          { type: 'stat', key: 'karma', value: 15 },
          { type: 'stat', key: 'luck', value: 6 },
        ],
      },
    ],
  },
  {
    id: 'rival_ambush',
    title: '仇家伏击',
    description:
      '你独自赶路时，前方道路突然被阵法封锁。数名玄天宗弟子从暗处现身，为首者正是曾败于你手的天骄。他冷笑一声：「今日，便是你的死期。」',
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
              success: '你以一己之力击退数名玄天宗弟子，天骄也被你重伤遁走。你的威名更盛。',
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
              success: '你施展遁术瞬间消失，玄天宗弟子扑了个空。',
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
    id: 'realm_formation',
    title: '秘境阵眼',
    description:
      '秘境深处发现一座上古大阵的阵眼，阵中封印着大能遗留的功法玉简。但阵法凶险异常，强行破阵可能引发反噬。更棘手的是，远处已有数道身影朝此方向飞来。',
    weight: 7,
    years: 2,
    once: true,
    act: 'foundation',
    choices: [
      {
        id: 'break_formation',
        text: '强行破阵取宝',
        outcomes: [
          {
            chance: 0.35,
            luckBonus: 0.005,
            successEffects: [
              { type: 'cultivation', value: 25 },
              { type: 'stat', key: 'comprehension', value: 8 },
              { type: 'formationTier', value: 1 },
            ],
            failEffects: [
              { type: 'lifespan', value: -12 },
              { type: 'stat', key: 'demonHeart', value: 10 },
            ],
            narrative: {
              success: '你以精妙手法破解阵法，获得功法玉简与阵道感悟。',
              fail: '阵法反噬，雷电入体，你重伤退出。功法玉简被后来者夺走。',
            },
          },
        ],
      },
      {
        id: 'study_realm_formation',
        text: '参悟阵法不急于取宝',
        effects: [
          { type: 'formationTier', value: 1 },
          { type: 'stat', key: 'comprehension', value: 5 },
          { type: 'cultivation', value: 12 },
        ],
      },
      {
        id: 'ambush_others',
        text: '藏身暗处，等后来者破阵后抢夺',
        outcomes: [
          {
            chance: 0.55,
            luckBonus: 0.003,
            successEffects: [
              { type: 'spiritStones', value: 40 },
              { type: 'cultivation', value: 15 },
              { type: 'stat', key: 'demonHeart', value: 8 },
            ],
            failEffects: [
              { type: 'stat', key: 'karma', value: -10 },
              { type: 'lifespan', value: -8 },
            ],
            narrative: {
              success: '你趁他人破阵疲惫之际出手，轻松夺下宝物。',
              fail: '对方早有察觉，反将你一军，你仓皇逃窜。',
            },
          },
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
]
