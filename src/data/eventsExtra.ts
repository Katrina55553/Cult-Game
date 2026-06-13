import type { GameEvent } from '../types/game'

export const EXTRA_EVENTS: GameEvent[] = [
  {
    id: 'immortal_guidance',
    title: '仙人指路',
    description: '云雾中现一老者虚影，笑言你根骨不凡，愿指一条明路。话音未落，天地灵气骤然凝实。',
    weight: 4,
    years: 2,
    once: true,
    act: 'qi',
    rarity: 'legendary',
    choices: [
      {
        id: 'accept',
        text: '恭听指点',
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
              success: '仙人传你口诀，修为暴涨，道心通透。',
              fail: '口诀艰涩，你只悟得一二，心魔微生。',
            },
          },
        ],
      },
      {
        id: 'decline',
        text: '婉拒机缘',
        narrative: '你谢过仙人，宁可以己身悟道。仙人抚须一笑，消失于云雾。',
        effects: [{ type: 'stat', key: 'karma', value: 8 }, { type: 'cultivation', value: 8 }],
      },
    ],
  },
  {
    id: 'past_life_memory',
    title: '前世记忆',
    description: '入定之时，前世碎片涌入识海。你曾是大能转世，抑或只是黄粱一梦？',
    weight: 3,
    years: 3,
    once: true,
    act: 'foundation',
    rarity: 'legendary',
    choices: [
      {
        id: 'embrace',
        text: '接纳记忆，融为己用',
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
              success: '前世感悟灌顶而来，你道基更为深厚。',
              fail: '记忆冲击神识，心魔大起，寿元受损。',
            },
          },
        ],
      },
      {
        id: 'seal',
        text: '封印记忆，专注今生',
        narrative: '你封住前世残念，道心更为纯粹坚定。',
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
    description: '玉简传讯：上界使者将在凡间遴选传人。此乃千年难遇之机，亦可能是致命陷阱。',
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
        text: '主动求见使者',
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
              success: '使者赐你仙缘印记，寿元大增。',
              fail: '使者试你心性，你未通过考验，寿元大损。',
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
    description: '你发现宗门暗中炼制邪丹，以弟子性命献祭。是揭发，还是连夜叛逃？',
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
              success: '你扳倒邪长老，名震宗门，被封真传。',
              fail: '揭发失败，你被诬陷，身受重伤，只得连夜逃出宗门。',
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
              success: '你连夜叛逃，脱离宗门，成为一名散修。',
              fail: '追杀不舍，你重伤脱身，却成了宗门弃徒。',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'sect_master_legacy',
    title: '掌门传承',
    description: '掌门临终召你入密室，欲传掌门之位与镇派神功，但需以性命守护宗门。',
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
        text: '推荐同门',
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
    description: '魔道围攻山门，护山大阵将破。你是死守，还是带同门突围？',
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
              success: '你力挽狂澜，保住宗门，成为英雄。',
              fail: '山门失守，你重伤濒死，却被同门拼死救出。',
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
              success: '你带同门突围成功，虽损失惨重，却保住性命。',
              fail: '突围惨烈，你濒死脱险，同门折损甚众。',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'blood_sacrifice',
    title: '魔道血祭',
    description: '魔修邀你共参血祭大阵，可一日破境，但需屠戮凡人村落。',
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
              success: '你斩灭魔修，正道名声大振。',
              fail: '魔修反扑，你身受重伤。',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'demon_lord_offer',
    title: '魔尊招揽',
    description: '魔尊化身亲临，许诺传你魔道至尊功法，只要你献祭正道好友。',
    weight: 7,
    once: true,
    act: 'golden',
    rarity: 'rare',
    conditions: [{ type: 'flag', key: 'accepted_demon_path', value: true }],
    choices: [
      {
        id: 'accept',
        text: '投靠魔尊',
        effects: [
          { type: 'cultivation', value: 50 },
          { type: 'flag', key: 'demon_lord_servant', value: true },
          { type: 'stat', key: 'demonHeart', value: 20 },
        ],
      },
      {
        id: 'betray',
        text: '假意投靠，伺机反杀',
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
              success: '你反杀魔尊化身，夺得魔道秘宝。',
              fail: '计谋败露，你被迫臣服魔尊。',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'righteous_siege',
    title: '正道围剿',
    description: '你魔名远扬，正道联盟集结围剿。是力战到底，还是遁入荒域？',
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
              success: '你击退群雄，魔威盖世，号称魔尊。',
              fail: '寡不敌众，身死道消。',
            },
          },
        ],
      },
      {
        id: 'flee',
        text: '遁入荒域',
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
              success: '你遁入荒域，正道难追，得以喘息。',
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
    description: '坊市举行斗宝大会，胜者可得海量灵石与稀有丹方。你手中灵石充裕，是否参战？',
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
              success: '你夺得头名，获丹方与灵石。',
              fail: '斗宝失利，灵石尽失。',
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
    description: '你孤身立于荒峰，天劫将至。无宗门护法，无道侣相助，全凭一己道心。',
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
              success: '独抗天雷，筑基成功，道心更为坚定。',
              fail: '天劫失败，重伤闭关。',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'lover_jealousy',
    title: '道侣反目',
    description: '苏清雪发现你曾与林挽月有过机缘传闻，冷战数日，道心蒙尘。',
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
        text: '坦诚相待，化解误会',
        effects: [
          { type: 'stat', key: 'demonHeart', value: -10 },
          { type: 'cultivation', value: 15 },
        ],
      },
      {
        id: 'cold',
        text: '冷处理，专注修道',
        effects: [
          { type: 'stat', key: 'demonHeart', value: 15 },
          { type: 'cultivation', value: 10 },
        ],
      },
      {
        id: 'break',
        text: '割席断义',
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
    description: '一名世家公子当众向你的道侣提亲，携重礼而来，言语间尽是挑衅。',
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
              fail: '决斗落败，心魔暗生，道侣安慰你。',
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
    description: '你与道侣闭关数月，共创合击秘法。若成，可越阶克敌；若败，则双双反噬。',
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
              success: '合击秘法大成，你们可越阶一战。',
              fail: '秘法反噬，双双受伤。',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'daily_sparring',
    title: '同门切磋',
    description: '演武场上人声鼎沸，师兄邀你过几招，以检验修行成果。',
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
              success: '你来我往，险胜半招，体魄与修为皆有进益。',
              fail: '不慎落败，轻伤退场，却也长了见闻。',
            },
          },
        ],
      },
      {
        id: 'watch',
        text: '旁观悟招',
        narrative: '你静坐旁观，悟得几式妙解，悟性微增。',
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
    description: '闲来无事，你踱入藏经阁，翻阅前人心得。',
    weight: 6,
    years: 1,
    cooldown: 4,
    conditions: [{ type: 'flag', key: 'loyal_to_sect', value: true }],
    choices: [
      {
        id: 'read',
        text: '研读功法',
        narrative: '残卷之中偶有灵光，你对功法理解更深。',
        effects: [
          { type: 'stat', key: 'comprehension', value: 4 },
          { type: 'cultivation', value: 8 },
        ],
      },
      {
        id: 'copy',
        text: '抄录心经',
        narrative: '你抄录心经数日，心魔稍减，道心更静。',
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
    description: '云雾散去，一座残破浮岛浮现天际。岛上古木参天，隐有宝光流转。',
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
              success: '你在浮岛残殿觅得灵石与残卷，修为大涨。',
              fail: '触发残阵，你轻伤脱身，仍有所悟。',
            },
          },
        ],
      },
      {
        id: 'observe',
        text: '远观悟法',
        narrative: '你远观浮岛灵气运转，对天地法则多了一分体悟。',
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
    description: '山野古道上，半埋残碑刻着残缺功法。风吹碑裂，灵光忽现。',
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
              fail: '碑文残缺难辨，你略感烦躁，心魔微生。',
            },
          },
        ],
      },
      {
        id: 'rub',
        text: '拓印带走',
        narrative: '你拓下碑文，日后再慢慢钻研。',
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
    description: '两名修士在路边斗法，剑气纵横。围观者议论纷纷，似在赌斗。',
    weight: 8,
    years: 1,
    maxTimes: 2,
    cooldown: 8,
    choices: [
      {
        id: 'join',
        text: '出手相助弱者',
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
              success: '你助弱者脱险，对方赠灵石以谢。',
              fail: '你险胜却受伤，仍觉问心无愧。',
            },
          },
        ],
      },
      {
        id: 'watch',
        text: '旁观悟剑',
        narrative: '你从斗法中悟得几式剑意，修为微增。',
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
    description: '你误入迷雾深谷，异兽低吼与灵草幽香交织，危机与机缘并存。',
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
              fail: '异兽凶猛，你重伤逃出谷外。',
            },
          },
        ],
      },
      {
        id: 'gather',
        text: '采药退走',
        narrative: '你采得几株灵草，见好就收，安然离去。',
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
    description: '雨后溪边，你偶然踢到一块灵石原矿，灵气外溢，附近似还有异象。',
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
              success: '你掘出小型灵矿，发了一笔横财。',
              fail: '只挖到零星灵石，还惊动了一窝毒虫。',
            },
          },
        ],
      },
      {
        id: 'take',
        text: '拾取便走',
        narrative: '你将原矿炼化，获灵石二十枚。',
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
    description: '雷雨过后，沼泽深处雷纹未散，似有上古雷法残意留存其间。',
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
              success: '雷意入体，你经脉更为强韧，修为精进。',
              fail: '雷意失控，你重伤退走，心魔暗生。',
            },
          },
        ],
      },
      {
        id: 'collect',
        text: '采集雷纹草后离去',
        narrative: '你采得几株雷纹草，炼丹备用，修为微增。',
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
    description: '迷雾江面，一叶孤舟无桨自渡。舟中老者邀你上船，称可渡你至彼岸秘境。',
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
              success: '舟过秘境，你悟得几分彼岸真意，寿元微增。',
              fail: '舟入迷津，你耗费寿元才脱身而归。',
            },
          },
        ],
      },
      {
        id: 'refuse',
        text: '婉拒登舟',
        narrative: '你守正不移，未上孤舟，道心更为澄澈。',
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
    description: '云海翻涌，白鹤盘旋长唳，尾羽洒落点点灵光，似在引路。',
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
              success: '鹤引你到灵泉边，你饮泉悟道，气运大涨。',
              fail: '鹤影消散于云海，你只拾得些许灵气。',
            },
          },
        ],
      },
      {
        id: 'meditate',
        text: '原地参鹤鸣',
        narrative: '鹤鸣九皋，声闻于天，你静坐参悟，悟性精进。',
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
    description: '山腹裂隙中，一眼灵泉汩汩涌出，地脉灵气浓郁得几乎凝成雾气。',
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
              success: '灵泉洗髓，你寿元延长，修为大涨。',
              fail: '灵气过烈，你勉强吸收小半，心魔微起。',
            },
          },
        ],
      },
      {
        id: 'seal',
        text: '封泉留待他日',
        narrative: '你记下灵泉方位，留待破境再来。',
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
    description: '夜空炸亮，陨星坠于荒原，炽热未散，铁中似有星纹流转。',
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
              success: '你淬出陨星短刃，杀伐之气助益修行。',
              fail: '陨铁炸裂，你灼伤倒退，修为受损。',
            },
          },
        ],
      },
      {
        id: 'sell',
        text: '售与炼器师',
        narrative: '炼器师高价收购陨铁，你获灵石颇丰。',
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
    description: '夜深独坐，你仰观星斗，揣摩天地运转之理。',
    weight: 2,
    years: 1,
    cooldown: 10,
    choices: [
      {
        id: 'contemplate',
        text: '穷理致知',
        narrative: '星斗流转间，你对道法多有领悟。',
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
    description: '你寻一处清幽之地，稳固根基，吐纳天地灵气。',
    weight: 3,
    years: 1,
    cooldown: 8,
    choices: [
      {
        id: 'meditate',
        text: '专心打坐',
        narrative: '元气盈体，修行日深，修为稳步增长。',
        effects: [{ type: 'cultivation', value: 10 }],
      },
      {
        id: 'wander',
        text: '下山历练',
        narrative: '你行走山川，见闻广开，气运与悟性皆有所增。',
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
    description: '修行路上，你驻足坊市，灵石在握，可购丹药符箓以助仙途。',
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
]
