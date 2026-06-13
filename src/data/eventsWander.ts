import type { GameEvent } from '../types/game'

export const WANDER_EVENTS: GameEvent[] = [
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
    id: 'wander_market',
    title: '散修坊市',
    description:
      '你行至一处偏僻坊市，此地多为散修聚集，鱼龙混杂。坊市角落有人摆摊出售来历不明的灵器，茶馆中散修们交换着各处秘境的消息。你孑然一身，在这江湖中倒也自在。',
    weight: 12,
    years: 1,
    maxTimes: 3,
    cooldown: 6,
    minGap: 4,
    conditions: [{ type: 'flag', key: 'refused_all_sects', value: true }],
    choices: [
      {
        id: 'trade_info',
        text: '在茶馆打探秘境消息',
        effects: [
          { type: 'spiritStones', value: 10 },
          { type: 'stat', key: 'luck', value: 4 },
          { type: 'cultivation', value: 6 },
        ],
      },
      {
        id: 'odd_job',
        text: '接些散修杂活赚灵石',
        effects: [
          { type: 'spiritStones', value: 18 },
          { type: 'stat', key: 'rootBone', value: 2 },
        ],
      },
      {
        id: 'gather_intel',
        text: '暗中观察各方势力动向',
        effects: [
          { type: 'stat', key: 'comprehension', value: 5 },
          { type: 'stat', key: 'luck', value: 3 },
        ],
      },
    ],
  },
  {
    id: 'wander_danger',
    title: '散修之危',
    description:
      '荒野赶路时，你被三名散修拦住去路。为首者目光贪婪，盯着你身上的储物袋：「没有宗门庇护的散修，最好欺负。交出灵石，饶你不死。」',
    weight: 10,
    years: 1,
    maxTimes: 2,
    cooldown: 8,
    minGap: 5,
    conditions: [{ type: 'flag', key: 'refused_all_sects', value: true }],
    choices: [
      {
        id: 'fight_bandits',
        text: '以一敌三，正面迎战',
        outcomes: [
          {
            chance: 0.45,
            luckBonus: 0.005,
            successEffects: [
              { type: 'spiritStones', value: 25 },
              { type: 'stat', key: 'rootBone', value: 4 },
              { type: 'cultivation', value: 10 },
            ],
            failEffects: [
              { type: 'spiritStones', value: -15, set: false },
              { type: 'lifespan', value: -8 },
            ],
            narrative: {
              success: '你以凌厉手段击退三名散修，缴获他们的灵石。散修之路虽险，却也磨炼出真本事。',
              fail: '三名散修联手围攻，你寡不敌众，被抢走部分灵石后重伤脱身。',
            },
          },
        ],
      },
      {
        id: 'outsmart',
        text: '佯装交灵石，趁机反杀',
        requirements: [{ type: 'stat', key: 'luck', min: 40 }],
        effects: [
          { type: 'spiritStones', value: 15 },
          { type: 'stat', key: 'comprehension', value: 3 },
          { type: 'stat', key: 'demonHeart', value: 3 },
        ],
      },
      {
        id: 'pay_off',
        text: '破财消灾，交出灵石',
        effects: [
          { type: 'spiritStones', value: -20, set: false },
          { type: 'stat', key: 'karma', value: -3 },
        ],
      },
      {
        id: 'beg_mercy',
        text: '跪地求饶，装可怜',
        requirements: [{ type: 'stat', key: 'rootBone', max: 18 }],
        effects: [
          { type: 'stat', key: 'karma', value: -5 },
          { type: 'stat', key: 'luck', value: 3 },
          { type: 'spiritStones', value: -10, set: false },
        ],
      },
    ],
  },
  {
    id: 'wander_hermit',
    title: '散修前辈',
    description:
      '深山中偶遇一位白发散修，他独居茅庐，周身灵气内敛却深不可测。见你亦是散修，他微微颔首：「老夫独行三百年，见过太多散修半途而废。你若有心，老夫可指点一二。」',
    weight: 7,
    years: 2,
    once: true,
    rarity: 'rare',
    conditions: [{ type: 'flag', key: 'refused_all_sects', value: true }],
    choices: [
      {
        id: 'learn_hermit',
        text: '恭敬请教',
        effects: [
          { type: 'cultivation', value: 20 },
          { type: 'stat', key: 'comprehension', value: 8 },
          { type: 'stat', key: 'karma', value: 5 },
        ],
      },
      {
        id: 'spar_hermit',
        text: '请求切磋印证',
        outcomes: [
          {
            chance: 0.4,
            luckBonus: 0.005,
            successEffects: [
              { type: 'cultivation', value: 25 },
              { type: 'stat', key: 'rootBone', value: 5 },
              { type: 'flag', key: 'hermit_guide', value: true },
            ],
            failEffects: [
              { type: 'cultivation', value: 12 },
              { type: 'stat', key: 'comprehension', value: 5 },
            ],
            narrative: {
              success: '你与散修前辈切磋百招，他赞你根基扎实，传你一套散修秘法。',
              fail: '前辈功法深不可测，你十招便败。但他点评你的不足，受益匪浅。',
            },
          },
        ],
      },
      {
        id: 'decline_hermit',
        text: '婉拒好意，继续独行',
        effects: [
          { type: 'stat', key: 'karma', value: 3 },
          { type: 'cultivation', value: 5 },
        ],
      },
    ],
  },
  {
    id: 'wander_companion',
    title: '散修同行',
    description:
      '旅途中遇到一名志趣相投的散修，他修为与你相当，性格豁达。二人一见如故，他提议结伴同行一段路程。散修之路孤寂，有个伴总是好的。',
    weight: 10,
    years: 1,
    maxTimes: 2,
    cooldown: 6,
    conditions: [{ type: 'flag', key: 'refused_all_sects', value: true }],
    choices: [
      {
        id: 'travel_together',
        text: '结伴同行',
        effects: [
          { type: 'cultivation', value: 10 },
          { type: 'stat', key: 'karma', value: 8 },
          { type: 'stat', key: 'luck', value: 4 },
        ],
      },
      {
        id: 'exchange_skills',
        text: '互相切磋交流功法',
        effects: [
          { type: 'cultivation', value: 15 },
          { type: 'stat', key: 'comprehension', value: 4 },
        ],
      },
      {
        id: 'solo_path',
        text: '独来独往，不与人同行',
        effects: [
          { type: 'stat', key: 'demonHeart', value: -3 },
          { type: 'cultivation', value: 5 },
        ],
      },
    ],
  },
  {
    id: 'wander_reputation',
    title: '散修之名',
    description:
      '你的名声在散修圈中渐渐传开。有人称你为「独行客」，敬你胆识过人；也有人视你为眼中钉，觉得无宗无派的散修不配拥有这般名声。一名自称「散修盟」首领的人找上门来。',
    weight: 6,
    years: 2,
    once: true,
    conditions: [
      { type: 'flag', key: 'refused_all_sects', value: true },
      { type: 'realm', min: 'foundation' },
    ],
    choices: [
      {
        id: 'join_alliance',
        text: '加入散修盟',
        effects: [
          { type: 'spiritStones', value: 25 },
          { type: 'stat', key: 'karma', value: 10 },
          { type: 'flag', key: 'wander_alliance', value: true },
        ],
      },
      {
        id: 'lead_alliance',
        text: '提出由你来领导散修盟',
        requirements: [{ type: 'stat', key: 'karma', min: 30 }],
        effects: [
          { type: 'spiritStones', value: 35 },
          { type: 'flag', key: 'wander_leader', value: true },
          { type: 'stat', key: 'karma', value: 8 },
          { type: 'cultivation', value: 12 },
        ],
      },
      {
        id: 'reject_alliance',
        text: '散修之道在于自由，不入盟',
        effects: [
          { type: 'stat', key: 'luck', value: 5 },
          { type: 'cultivation', value: 8 },
        ],
      },
    ],
  },
  {
    id: 'wander_crisis',
    title: '散修围剿',
    description:
      '宗门弟子视散修为眼中钉，联合数家宗门发起「清野行动」，驱赶占据灵脉的散修。你修炼的洞府也在清剿范围之内。数十名宗门弟子列阵而来，气势汹汹。',
    weight: 5,
    years: 2,
    once: true,
    conditions: [
      { type: 'flag', key: 'refused_all_sects', value: true },
      { type: 'realm', min: 'foundation' },
    ],
    choices: [
      {
        id: 'defend_cave',
        text: '据理力争，守护洞府',
        outcomes: [
          {
            chance: 0.4,
            luckBonus: 0.005,
            successEffects: [
              { type: 'cultivation', value: 20 },
              { type: 'stat', key: 'karma', value: 15 },
              { type: 'flag', key: 'wander_defender', value: true },
              { type: 'spiritStones', value: 20 },
            ],
            failEffects: [
              { type: 'lifespan', value: -12 },
              { type: 'stat', key: 'demonHeart', value: 8 },
            ],
            narrative: {
              success: '你以一己之力击退宗门弟子，散修们纷纷传颂你的威名。',
              fail: '宗门弟子人多势众，你寡不敌众，被迫放弃洞府另寻修炼之地。',
            },
          },
        ],
      },
      {
        id: 'negotiate_crisis',
        text: '提议以灵石买平安',
        requirements: [{ type: 'resource', key: 'spiritStones', min: 40 }],
        effects: [
          { type: 'spiritStones', value: -40 },
          { type: 'stat', key: 'karma', value: -5 },
        ],
      },
      {
        id: 'flee_cave',
        text: '暂避锋芒，另觅灵地',
        effects: [
          { type: 'stat', key: 'luck', value: 4 },
          { type: 'cultivation', value: 5 },
        ],
      },
    ],
  },
  {
    id: 'wander_cave',
    title: '散修洞府',
    description:
      '你在深山中发现一处被遗弃的散修洞府，洞内灵气充沛，石壁上刻着前人留下的修炼心得。洞府主人似乎已坐化多年，留下了一封遗书和几件遗物。',
    weight: 8,
    years: 1,
    once: true,
    conditions: [{ type: 'flag', key: 'refused_all_sects', value: true }],
    choices: [
      {
        id: 'inherit_cave',
        text: '继承洞府，研读心得',
        effects: [
          { type: 'cultivation', value: 18 },
          { type: 'stat', key: 'comprehension', value: 6 },
          { type: 'spiritStones', value: 15 },
        ],
      },
      {
        id: 'take_items',
        text: '取走遗物继续赶路',
        effects: [
          { type: 'spiritStones', value: 25 },
          { type: 'stat', key: 'karma', value: -3 },
        ],
      },
      {
        id: 'bury_elder',
        text: '为前辈散修立碑安葬',
        effects: [
          { type: 'stat', key: 'karma', value: 12 },
          { type: 'stat', key: 'luck', value: 4 },
        ],
      },
    ],
  },
  {
    id: 'wander_wilderness',
    title: '荒野求生',
    description:
      '你深入无人荒野寻找天材地宝，却遭遇暴风雪。灵气紊乱，方向难辨，你必须在恶劣环境中求生。没有宗门庇护，一切只能靠自己。',
    weight: 8,
    years: 1,
    conditions: [{ type: 'flag', key: 'refused_all_sects', value: true }],
    choices: [
      {
        id: 'endure_storm',
        text: '以灵气护体硬撑',
        outcomes: [
          {
            chance: 0.5,
            luckBonus: 0.004,
            successEffects: [
              { type: 'stat', key: 'rootBone', value: 5 },
              { type: 'cultivation', value: 12 },
              { type: 'stat', key: 'luck', value: 3 },
            ],
            failEffects: [
              { type: 'lifespan', value: -8 },
              { type: 'cultivation', value: 5 },
            ],
            narrative: {
              success: '你在暴风雪中苦撑三日，竟意外领悟了天地灵气运转之理。',
              fail: '暴风雪过于猛烈，你被冻伤数处，元气受损。',
            },
          },
        ],
      },
      {
        id: 'find_shelter',
        text: '寻找避风处所',
        effects: [
          { type: 'stat', key: 'comprehension', value: 3 },
          { type: 'cultivation', value: 6 },
        ],
      },
      {
        id: 'turn_back',
        text: '果断撤退',
        effects: [
          { type: 'stat', key: 'luck', value: 2 },
        ],
      },
    ],
  },
  {
    id: 'wander_trade',
    title: '散修商路',
    description:
      '你发现一条连接两座坊市的商路，沿途散修往来频繁。若能在此经商或护送商队，可获丰厚报酬。但商路上盗匪横行，风险不小。',
    weight: 8,
    years: 1,
    maxTimes: 2,
    cooldown: 6,
    conditions: [{ type: 'flag', key: 'refused_all_sects', value: true }],
    choices: [
      {
        id: 'escort',
        text: '护送商队赚取报酬',
        outcomes: [
          {
            chance: 0.6,
            luckBonus: 0.004,
            successEffects: [
              { type: 'spiritStones', value: 25 },
              { type: 'stat', key: 'karma', value: 5 },
            ],
            failEffects: [
              { type: 'spiritStones', value: -10, set: false },
              { type: 'lifespan', value: -5 },
            ],
            narrative: {
              success: '你安全护送商队抵达目的地，商队首领付你丰厚报酬。',
              fail: '途中遭遇盗匪劫掠，你虽脱身，却丢了部分灵石。',
            },
          },
        ],
      },
      {
        id: 'trade',
        text: '自己经商倒卖灵材',
        requirements: [{ type: 'resource', key: 'spiritStones', min: 20 }],
        effects: [
          { type: 'spiritStones', value: 15 },
          { type: 'stat', key: 'comprehension', value: 3 },
        ],
      },
      {
        id: 'skip_trade',
        text: '不感兴趣，继续赶路',
        effects: [
          { type: 'cultivation', value: 3 },
        ],
      },
    ],
  },
  {
    id: 'wander_festival',
    title: '散修大会',
    description:
      '一年一度的散修大会在荒原上召开，数百名散修齐聚一堂。大会上有比武切磋、灵材交易、功法交流。这是散修们难得的盛会。',
    weight: 7,
    years: 2,
    once: true,
    conditions: [
      { type: 'flag', key: 'refused_all_sects', value: true },
      { type: 'realm', min: 'qi_refining_2' },
    ],
    choices: [
      {
        id: 'compete_festival',
        text: '参加比武切磋',
        outcomes: [
          {
            chance: 0.45,
            luckBonus: 0.005,
            successEffects: [
              { type: 'cultivation', value: 20 },
              { type: 'spiritStones', value: 30 },
              { type: 'stat', key: 'karma', value: 8 },
            ],
            failEffects: [
              { type: 'cultivation', value: 10 },
              { type: 'stat', key: 'demonHeart', value: 3 },
            ],
            narrative: {
              success: '你在比武中力压群雄，赢得灵石与散修们的尊敬。',
              fail: '高手如云，你惜败于半决赛，但收获了宝贵的战斗经验。',
            },
          },
        ],
      },
      {
        id: 'trade_festival',
        text: '在灵材市场淘宝',
        effects: [
          { type: 'spiritStones', value: 12 },
          { type: 'stat', key: 'luck', value: 4 },
        ],
      },
      {
        id: 'socialize',
        text: '与各方散修交流心得',
        effects: [
          { type: 'cultivation', value: 12 },
          { type: 'stat', key: 'comprehension', value: 5 },
        ],
      },
    ],
  },
  {
    id: 'wander_refugee',
    title: '流民求助',
    description:
      '一群凡人流民拦住你的去路，他们家园被妖兽摧毁，无处可去。老人抱着孩子跪在你面前：「仙人，求您救救我们。」你作为散修，没有宗门的资源，但你有实力。',
    weight: 7,
    years: 1,
    conditions: [{ type: 'flag', key: 'refused_all_sects', value: true }],
    choices: [
      {
        id: 'help_refugee',
        text: '出手相助，清除妖兽',
        outcomes: [
          {
            chance: 0.55,
            luckBonus: 0.004,
            successEffects: [
              { type: 'stat', key: 'karma', value: 15 },
              { type: 'cultivation', value: 12 },
              { type: 'stat', key: 'luck', value: 4 },
            ],
            failEffects: [
              { type: 'lifespan', value: -8 },
              { type: 'stat', key: 'karma', value: 8 },
            ],
            narrative: {
              success: '你清除妖兽，流民们感恩戴德。你的善行在民间传为佳话。',
              fail: '妖兽凶猛，你虽击退它们，自己却受了不轻的伤。',
            },
          },
        ],
      },
      {
        id: 'guide_refugee',
        text: '指引他们去安全之地',
        effects: [
          { type: 'stat', key: 'karma', value: 8 },
          { type: 'stat', key: 'luck', value: 3 },
        ],
      },
      {
        id: 'ignore_refugee',
        text: '自顾不暇，无力相助',
        effects: [
          { type: 'stat', key: 'karma', value: -5 },
          { type: 'stat', key: 'demonHeart', value: 3 },
        ],
      },
    ],
  },
  {
    id: 'wander_medical',
    title: '悬壶济世',
    description:
      '你途经一座小镇，镇上瘟疫横行，百姓苦不堪言。镇上的郎中束手无策，你若懂些丹道皮毛，或许能帮上忙。',
    weight: 7,
    years: 1,
    conditions: [
      { type: 'flag', key: 'refused_all_sects', value: true },
      { type: 'alchemyTier', min: 1 },
    ],
    choices: [
      {
        id: 'heal_town',
        text: '炼制解毒丹救治百姓',
        effects: [
          { type: 'stat', key: 'karma', value: 15 },
          { type: 'alchemyTier', value: 1 },
          { type: 'spiritStones', value: 15 },
        ],
      },
      {
        id: 'sell_pills',
        text: '高价出售丹药',
        effects: [
          { type: 'spiritStones', value: 30 },
          { type: 'stat', key: 'karma', value: -8 },
        ],
      },
      {
        id: 'leave_town',
        text: '爱莫能助，继续赶路',
        effects: [
          { type: 'stat', key: 'karma', value: -3 },
        ],
      },
    ],
  },
  {
    id: 'wander_ancient_site',
    title: '荒废宗门',
    description:
      '你发现一处荒废已久的宗门遗址，山门倾颓，殿宇残破。但从遗迹的规模来看，这曾是一个大宗门。废墟中或许还藏着未被发现的宝物。',
    weight: 6,
    years: 2,
    once: true,
    conditions: [
      { type: 'flag', key: 'refused_all_sects', value: true },
      { type: 'realm', min: 'foundation' },
    ],
    choices: [
      {
        id: 'explore_ruins',
        text: '深入废墟探索',
        outcomes: [
          {
            chance: 0.45,
            luckBonus: 0.005,
            successEffects: [
              { type: 'spiritStones', value: 40 },
              { type: 'cultivation', value: 18 },
              { type: 'stat', key: 'comprehension', value: 5 },
            ],
            failEffects: [
              { type: 'lifespan', value: -8 },
              { type: 'stat', key: 'demonHeart', value: 5 },
            ],
            narrative: {
              success: '你在废墟中发现了一处密室，内藏大量灵石与功法残卷。',
              fail: '废墟中残留的禁制被触发，你被阵法所伤。',
            },
          },
        ],
      },
      {
        id: 'study_ruins',
        text: '研究宗门遗迹的阵法',
        effects: [
          { type: 'formationTier', value: 1 },
          { type: 'stat', key: 'comprehension', value: 5 },
        ],
      },
      {
        id: 'mark_ruins',
        text: '标记位置，日后再来',
        effects: [
          { type: 'stat', key: 'luck', value: 3 },
        ],
      },
    ],
  },
  {
    id: 'wander_lone_wolf',
    title: '孤狼传说',
    description:
      '散修圈中流传着一个传说：在极北冰原上，有一位独行千年的散修前辈，他从未加入任何宗门，却修炼到了元婴境界。有人说他已经坐化，有人说他仍在冰原上游荡。',
    weight: 5,
    years: 2,
    once: true,
    rarity: 'rare',
    conditions: [
      { type: 'flag', key: 'refused_all_sects', value: true },
      { type: 'realm', min: 'golden_core' },
    ],
    choices: [
      {
        id: 'seek_legend',
        text: '前往极北冰原寻找',
        outcomes: [
          {
            chance: 0.3,
            luckBonus: 0.006,
            successEffects: [
              { type: 'cultivation', value: 30 },
              { type: 'stat', key: 'comprehension', value: 10 },
              { type: 'lifespan', value: 10 },
              { type: 'flag', key: 'met_lone_legend', value: true },
            ],
            failEffects: [
              { type: 'lifespan', value: -10 },
              { type: 'cultivation', value: 8 },
            ],
            narrative: {
              success: '你在冰原深处找到了那位传说中的散修。他传你毕生所学，然后化作冰晶消散。',
              fail: '冰原凶险异常，你未能找到传说中的散修，却在苦寒中磨炼了意志。',
            },
          },
        ],
      },
      {
        id: 'dismiss_legend',
        text: '不过是传说罢了',
        effects: [
          { type: 'stat', key: 'comprehension', value: 3 },
        ],
      },
    ],
  },
]
