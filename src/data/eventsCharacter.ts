import type { GameEvent } from '../types/game'

export const CHARACTER_EVENTS: GameEvent[] = [
  {
    id: 'mysterious_demon_first',
    title: '秘境黑影',
    description:
      '秘境深处，你察觉一道幽暗气息。循迹而去，只见一名黑袍修士独坐于枯骨遍地的石台上，周身魔气缭绕却异常内敛。他睁开双眼，目光如深渊般幽冷，淡淡扫了你一眼便闭目不语。此人修为深不可测，却孤身一人，既无敌意也无善意。',
    weight: 7,
    years: 1,
    once: true,
    rarity: 'rare',
    act: 'foundation',
    choices: [
      {
        id: 'greet_demon',
        text: '拱手施礼，试探攀谈',
        effects: [
          { type: 'flag', key: 'met_moli', value: true },
          { type: 'stat', key: 'comprehension', value: 4 },
          { type: 'cultivation', value: 8 },
        ],
      },
      {
        id: 'ignore_demon',
        text: '不打扰他，自行探索',
        effects: [
          { type: 'cultivation', value: 5 },
        ],
      },
      {
        id: 'challenge_demon',
        text: '趁其闭关偷袭',
        outcomes: [
          {
            chance: 0.15,
            luckBonus: 0.005,
            successEffects: [
              { type: 'spiritStones', value: 40 },
              { type: 'stat', key: 'demonHeart', value: 15 },
              { type: 'flag', key: 'moli_enemy', value: true },
            ],
            failEffects: [
              { type: 'lifespan', value: -15 },
              { type: 'stat', key: 'demonHeart', value: 10 },
              { type: 'flag', key: 'moli_enemy', value: true },
            ],
            narrative: {
              success: '你趁其不备出手，黑袍修士重伤遁走，留下一地灵石。但你清楚，此人不会善罢甘休。',
              fail: '你刚一动杀念，黑袍修士眼都没睁，一道魔气便将你震飞十丈。你仓皇逃窜，不敢回头。',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'mysterious_demon_second',
    title: '再遇墨离',
    description:
      '古战场遗迹中，你再次遇见那名黑袍修士。这次他正在破解一座上古禁制，手法精妙绝伦。他似乎察觉你的到来，头也不回地说：「又见面了。你若想分一杯羹，便替我挡住禁制反噬。」',
    weight: 6,
    years: 2,
    once: true,
    rarity: 'rare',
    conditions: [{ type: 'flag', key: 'met_moli', value: true }],
    choices: [
      {
        id: 'help_moli',
        text: '替他挡下反噬，结个善缘',
        outcomes: [
          {
            chance: 0.6,
            luckBonus: 0.004,
            successEffects: [
              { type: 'flag', key: 'moli_ally', value: true },
              { type: 'spiritStones', value: 35 },
              { type: 'cultivation', value: 18 },
              { type: 'stat', key: 'comprehension', value: 6 },
            ],
            failEffects: [
              { type: 'lifespan', value: -8 },
              { type: 'cultivation', value: 10 },
            ],
            narrative: {
              success: '禁制破解，墨离将一半收获分给你。临走前留下一句：「你这人，倒有几分意思。」',
              fail: '禁制反噬猛烈，你虽挡住大部分冲击，仍被余波所伤。墨离点了点头，算是记下这份情。',
            },
          },
        ],
      },
      {
        id: 'observe_moli',
        text: '远远旁观，不插手',
        effects: [
          { type: 'stat', key: 'comprehension', value: 3 },
          { type: 'cultivation', value: 5 },
        ],
      },
      {
        id: 'betray_moli',
        text: '趁他专注禁制，夺其宝物',
        outcomes: [
          {
            chance: 0.2,
            luckBonus: 0.005,
            successEffects: [
              { type: 'spiritStones', value: 50 },
              { type: 'flag', key: 'moli_enemy', value: true },
            ],
            failEffects: [
              { type: 'lifespan', value: -20 },
              { type: 'stat', key: 'demonHeart', value: 12 },
              { type: 'flag', key: 'moli_enemy', value: true },
            ],
            narrative: {
              success: '你趁其不备夺走禁制中的宝物。墨离缓缓转身，眼中寒光一闪：「好，很好。」',
              fail: '墨离早有防备，反手一掌将你击退。他冷冷道：「不自量力。」你重伤遁走。',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'mysterious_demon_third',
    title: '墨离之邀',
    description:
      '你正在洞府打坐，一道传音符破空而至。墨离的声音传来：「有一处远古魔修洞府，禁制凶险，我一人难以破之。你若有意，三日后秘境入口见。」这是他第一次主动联系你，语气依旧淡漠，却似有几分信任。',
    weight: 5,
    years: 2,
    once: true,
    rarity: 'rare',
    conditions: [{ type: 'flag', key: 'moli_ally', value: true }],
    choices: [
      {
        id: 'accept_moli',
        text: '如约前往',
        outcomes: [
          {
            chance: 0.55,
            luckBonus: 0.005,
            successEffects: [
              { type: 'artifact', id: 'demon_relic', name: '远古魔宝' },
              { type: 'cultivation', value: 25 },
              { type: 'stat', key: 'comprehension', value: 8 },
              { type: 'flag', key: 'moli_friend', value: true },
              { type: 'stat', key: 'demonHeart', value: 5 },
            ],
            failEffects: [
              { type: 'lifespan', value: -12 },
              { type: 'cultivation', value: 12 },
              { type: 'stat', key: 'demonHeart', value: 8 },
            ],
            narrative: {
              success: '你二人联手破开洞府禁制，各得一件远古魔宝。墨离难得露出一丝笑意：「下次有缘再见。」',
              fail: '洞府禁制远超预料，你二人虽破开外围，却触发了自毁阵法。你重伤脱出，墨离不知所踪。',
            },
          },
        ],
      },
      {
        id: 'decline_moli',
        text: '婉拒邀约',
        effects: [
          { type: 'stat', key: 'karma', value: 5 },
          { type: 'cultivation', value: 5 },
        ],
      },
      {
        id: 'betray_moli_final',
        text: '设下陷阱伏击墨离',
        outcomes: [
          {
            chance: 0.25,
            luckBonus: 0.005,
            successEffects: [
              { type: 'spiritStones', value: 60 },
              { type: 'stat', key: 'demonHeart', value: 20 },
              { type: 'flag', key: 'moli_enemy', value: true },
            ],
            failEffects: [
              { type: 'lifespan', value: -25 },
              { type: 'stat', key: 'demonHeart', value: 15 },
              { type: 'flag', key: 'moli_enemy', value: true },
            ],
            narrative: {
              success: '你设下埋伏，趁墨离不备出手。他重伤遁走前留下一句：「我记住了。」',
              fail: '墨离早已看穿你的意图，反将你引入他布下的魔阵。你拼死才脱身，修为大损。',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'moli_revenge',
    title: '墨离索命',
    description:
      '夜色如墨，你忽感一股森然魔气逼近。墨离立于月下，黑袍猎猎作响，手中一柄漆黑长刀泛着幽光。他淡淡开口：「欠我的，今日该还了。」',
    weight: 4,
    years: 2,
    once: true,
    conditions: [
      { type: 'flag', key: 'moli_enemy', value: true },
      { type: 'flag', key: 'met_moli', value: true },
      { type: 'realm', min: 'foundation' },
    ],
    choices: [
      {
        id: 'fight_moli',
        text: '正面迎战',
        outcomes: [
          {
            chance: 0.3,
            luckBonus: 0.006,
            successEffects: [
              { type: 'cultivation', value: 25 },
              { type: 'stat', key: 'rootBone', value: 5 },
              { type: 'flag', key: 'defeated_moli', value: true },
            ],
            failEffects: [
              { type: 'lifespan', value: -20 },
              { type: 'stat', key: 'demonHeart', value: 12 },
            ],
            narrative: {
              success: '你与墨离激战百招，最终以半招之差险胜。他收刀入鞘，冷冷道：「下次未必这般好运。」',
              fail: '墨离刀法诡异莫测，你数十招便露败象。拼死逃出后，你元气大伤。',
            },
          },
        ],
      },
      {
        id: 'apologize_moli',
        text: '诚心赔罪',
        requirements: [{ type: 'resource', key: 'spiritStones', min: 50 }],
        effects: [
          { type: 'spiritStones', value: -50 },
          { type: 'flag', key: 'moli_enemy', value: false },
          { type: 'flag', key: 'met_moli', value: true },
          { type: 'stat', key: 'karma', value: 5 },
        ],
      },
      {
        id: 'flee_moli',
        text: '施展遁术逃离',
        effects: [
          { type: 'stat', key: 'luck', value: -3 },
          { type: 'stat', key: 'demonHeart', value: 3 },
        ],
      },
    ],
  },
  {
    id: 'moli_backstory',
    title: '墨离往事',
    description:
      '篝火旁，墨离罕见地开口说起往事。他原是北荒散修之子，父母被宗门弟子所杀，从此独行修魔。「我不恨正道，我只是不信任何人。」他望着火焰，语气平淡如水。',
    weight: 6,
    years: 2,
    once: true,
    conditions: [{ type: 'flag', key: 'moli_ally', value: true }],
    choices: [
      {
        id: 'empathize',
        text: '坦言自己也曾历经坎坷',
        effects: [
          { type: 'stat', key: 'karma', value: 5 },
          { type: 'stat', key: 'demonHeart', value: -3 },
          { type: 'flag', key: 'moli_trusted', value: true },
        ],
      },
      {
        id: 'promise',
        text: '许诺不会辜负他的信任',
        effects: [
          { type: 'stat', key: 'karma', value: 8 },
          { type: 'flag', key: 'moli_trusted', value: true },
        ],
      },
      {
        id: 'silent',
        text: '沉默不语，只是添柴',
        effects: [
          { type: 'stat', key: 'comprehension', value: 3 },
        ],
      },
    ],
  },
  {
    id: 'moli_sacrifice',
    title: '墨离挡刀',
    description:
      '你与墨离并肩作战之际，一道暗箭直射你后心。墨离身形一闪，以肉身替你挡下这一击。他单膝跪地，嘴角溢血，淡淡道：「别误会，只是还你之前的人情。」',
    weight: 5,
    years: 2,
    once: true,
    conditions: [{ type: 'flag', key: 'moli_trusted', value: true }],
    choices: [
      {
        id: 'heal_moli',
        text: '拼尽灵力为他疗伤',
        effects: [
          { type: 'lifespan', value: -5 },
          { type: 'stat', key: 'karma', value: 12 },
          { type: 'flag', key: 'moli_brother', value: true },
        ],
      },
      {
        id: 'acknowledge',
        text: '默默记下这份情',
        effects: [
          { type: 'stat', key: 'karma', value: 8 },
          { type: 'flag', key: 'moli_brother', value: true },
        ],
      },
    ],
  },
  {
    id: 'ye_qingmei_reunion_alt',
    title: '叶轻眉重逢',
    description:
      '坊市深处，你恍惚间看到一个熟悉的身影。那名白衣女子转过身来，正是当年宗门中与你交好的叶轻眉。数年未见，她已是筑基修士，眉宇间多了几分沧桑。「好久不见。」她微微一笑。',
    weight: 8,
    years: 2,
    once: true,
    conditions: [
      { type: 'flag', key: 'loyal_to_sect', value: true },
      { type: 'realm', min: 'foundation' },
    ],
    choices: [
      {
        id: 'catch_up',
        text: '与她叙旧',
        effects: [
          { type: 'stat', key: 'karma', value: 8 },
          { type: 'cultivation', value: 10 },
          { type: 'flag', key: 'ye_qingmei_ally', value: true },
        ],
      },
      {
        id: 'train_together_ye',
        text: '提议切磋交流功法',
        effects: [
          { type: 'cultivation', value: 15 },
          { type: 'stat', key: 'comprehension', value: 4 },
          { type: 'flag', key: 'ye_qingmei_ally', value: true },
        ],
      },
      {
        id: 'part_ways',
        text: '点头致意后各自离去',
        effects: [
          { type: 'cultivation', value: 3 },
        ],
      },
    ],
  },
  {
    id: 'ye_qingmei_help_alt',
    title: '叶轻眉求助',
    description:
      '叶轻眉急匆匆找到你，面色凝重。她发现了一处藏有邪修据点的山谷，内有被囚禁的凡人百姓。「我一人势单力薄，你可愿助我一臂之力？」',
    weight: 7,
    years: 1,
    once: true,
    conditions: [{ type: 'flag', key: 'ye_qingmei_ally', value: true }],
    choices: [
      {
        id: 'help_ye',
        text: '义不容辞，同往救人',
        outcomes: [
          {
            chance: 0.55,
            luckBonus: 0.004,
            successEffects: [
              { type: 'stat', key: 'karma', value: 15 },
              { type: 'cultivation', value: 18 },
              { type: 'stat', key: 'rootBone', value: 3 },
            ],
            failEffects: [
              { type: 'lifespan', value: -10 },
              { type: 'stat', key: 'demonHeart', value: 5 },
            ],
            narrative: {
              success: '你二人联手击破邪修据点，救出被困百姓。叶轻眉望向你的目光中多了几分敬意。',
              fail: '邪修实力超出预期，你二人虽救出部分百姓，却都负了伤。',
            },
          },
        ],
      },
      {
        id: 'plan_ye',
        text: '先侦查敌情再行动',
        effects: [
          { type: 'stat', key: 'comprehension', value: 5 },
          { type: 'stat', key: 'karma', value: 8 },
          { type: 'cultivation', value: 8 },
        ],
      },
      {
        id: 'refuse_ye',
        text: '此事凶险，恕难从命',
        effects: [
          { type: 'stat', key: 'karma', value: -5 },
          { type: 'stat', key: 'demonHeart', value: 3 },
        ],
      },
    ],
  },
  {
    id: 'lin_yuan_breakthrough',
    title: '林远突破',
    description:
      '闭关数月后，林远兴冲冲地来找你，眼中满是感激。他终于突破了瓶颈，修为更上一层楼。「若非当日你倾囊相授，我早已被遣送下山。这份恩情，林远铭记于心。」',
    weight: 10,
    years: 1,
    once: true,
    conditions: [
      { type: 'flag', key: 'helped_lin_yuan', value: true },
      { type: 'flag', key: 'loyal_to_sect', value: true },
    ],
    choices: [
      {
        id: 'encourage',
        text: '勉励他继续努力',
        effects: [
          { type: 'stat', key: 'karma', value: 8 },
          { type: 'cultivation', value: 10 },
          { type: 'flag', key: 'lin_yuan_ally', value: true },
        ],
      },
      {
        id: 'spar_lin',
        text: '提议切磋一番',
        effects: [
          { type: 'cultivation', value: 15 },
          { type: 'stat', key: 'comprehension', value: 3 },
          { type: 'flag', key: 'lin_yuan_ally', value: true },
        ],
      },
    ],
  },
  {
    id: 'lin_yuan_rescue',
    title: '林远报恩',
    description:
      '你被苍穹阁弟子围攻之际，林远挺身而出挡在你身前。「今日我林远在此，谁敢动我师兄！」他修为虽不如你，却以命相搏，硬生生撑到援军赶到。',
    weight: 7,
    years: 2,
    once: true,
    conditions: [
      { type: 'flag', key: 'lin_yuan_ally', value: true },
      { type: 'realm', min: 'foundation' },
    ],
    choices: [
      {
        id: 'grateful',
        text: '感激林远的义气',
        effects: [
          { type: 'stat', key: 'karma', value: 10 },
          { type: 'stat', key: 'comprehension', value: 3 },
          { type: 'flag', key: 'lin_yuan_brother', value: true },
        ],
      },
      {
        id: 'train_lin',
        text: '传授他更强的功法',
        effects: [
          { type: 'cultivation', value: 12 },
          { type: 'stat', key: 'karma', value: 8 },
          { type: 'flag', key: 'lin_yuan_brother', value: true },
        ],
      },
    ],
  },
  {
    id: 'su_muyan_teach',
    title: '师姐指教',
    description:
      '天玄宗藏经阁中，你偶遇师姐苏暮烟。她身着素白长裙，气质清冷出尘，正翻阅一卷古籍。见你入门，她微微颔首：「你便是新来的师弟？根骨尚可，若有不解之处，可来问我。」',
    weight: 12,
    years: 1,
    once: true,
    conditions: [{ type: 'flag', key: 'loyal_to_sect', value: true }],
    choices: [
      {
        id: 'learn_su',
        text: '恭敬请教修炼疑难',
        effects: [
          { type: 'cultivation', value: 15 },
          { type: 'stat', key: 'comprehension', value: 5 },
          { type: 'flag', key: 'met_su_muyan', value: true },
        ],
      },
      {
        id: 'observe_su',
        text: '远远观摩，不打扰',
        effects: [
          { type: 'stat', key: 'comprehension', value: 3 },
          { type: 'flag', key: 'met_su_muyan', value: true },
        ],
      },
    ],
  },
  {
    id: 'su_muyan_crisis',
    title: '师姐之危',
    description:
      '苏暮烟在秘境中遭遇妖兽围困，传音符急促响起。你循声赶至，只见她孤身奋战，衣衫染血，却仍神色从容。见你到来，她淡然道：「你来了。」',
    weight: 8,
    years: 1,
    once: true,
    conditions: [
      { type: 'flag', key: 'met_su_muyan', value: true },
      { type: 'realm', min: 'qi_refining_2' },
    ],
    choices: [
      {
        id: 'rescue_su',
        text: '冲入重围救她',
        outcomes: [
          {
            chance: 0.6,
            luckBonus: 0.004,
            successEffects: [
              { type: 'flag', key: 'su_muyan_ally', value: true },
              { type: 'cultivation', value: 18 },
              { type: 'stat', key: 'karma', value: 10 },
            ],
            failEffects: [
              { type: 'lifespan', value: -8 },
              { type: 'flag', key: 'su_muyan_ally', value: true },
            ],
            narrative: {
              success: '你以凌厉剑法击退妖兽，苏暮烟微微一笑：「师弟，多谢。」',
              fail: '你拼死救出苏暮烟，自己却身受重伤。她默默替你疗伤。',
            },
          },
        ],
      },
      {
        id: 'plan_su',
        text: '布阵引妖兽入瓮',
        requirements: [{ type: 'formationTier', min: 1 }],
        effects: [
          { type: 'flag', key: 'su_muyan_ally', value: true },
          { type: 'formationTier', value: 1 },
          { type: 'stat', key: 'comprehension', value: 4 },
        ],
      },
      {
        id: 'retreat_su',
        text: '寡不敌众，先撤再说',
        effects: [
          { type: 'stat', key: 'karma', value: -5 },
          { type: 'stat', key: 'demonHeart', value: 3 },
        ],
      },
    ],
  },
  {
    id: 'su_muyan_past',
    title: '师姐往事',
    description:
      '月下，苏暮烟罕见地放下冷淡面具，与你倾诉往事。她原是世家千金，家族覆灭后被天玄宗收留。「修仙之路，我已无退路。」她望向明月，眼中似有泪光。',
    weight: 7,
    years: 2,
    once: true,
    conditions: [{ type: 'flag', key: 'su_muyan_ally', value: true }],
    choices: [
      {
        id: 'comfort_su',
        text: '静静陪伴，不发一言',
        effects: [
          { type: 'stat', key: 'karma', value: 8 },
          { type: 'stat', key: 'comprehension', value: 3 },
          { type: 'flag', key: 'su_muyan_close', value: true },
        ],
      },
      {
        id: 'promise_su',
        text: '许诺助她复仇',
        effects: [
          { type: 'stat', key: 'karma', value: 5 },
          { type: 'flag', key: 'su_muyan_close', value: true },
          { type: 'flag', key: 'promise_su_vengeance', value: true },
        ],
      },
      {
        id: 'leave_su',
        text: '不涉私事，告辞离去',
        effects: [
          { type: 'stat', key: 'demonHeart', value: -3 },
        ],
      },
    ],
  },
  {
    id: 'zhao_tianxing_revenge',
    title: '赵天行报复',
    description:
      '赵天行被你揭发后怀恨在心，暗中散布谣言说你偷学禁术。长老召你前去询问，你必须自证清白。',
    weight: 8,
    years: 1,
    once: true,
    conditions: [
      { type: 'flag', key: 'loyal_to_sect', value: true },
      { type: 'realm', min: 'qi_refining_2' },
    ],
    choices: [
      {
        id: 'prove_innocent',
        text: '以实力证明清白',
        outcomes: [
          {
            chance: 0.55,
            luckBonus: 0.004,
            successEffects: [
              { type: 'stat', key: 'karma', value: 10 },
              { type: 'spiritStones', value: 20 },
              { type: 'flag', key: 'cleared_name', value: true },
            ],
            failEffects: [
              { type: 'stat', key: 'demonHeart', value: 8 },
              { type: 'cultivation', value: -5 },
            ],
            narrative: {
              success: '你以纯正功法证明清白，赵天行反被长老训斥。',
              fail: '长老半信半疑，你虽未受重罚，名声却受损。',
            },
          },
        ],
      },
      {
        id: 'confront_zhao',
        text: '当面质问赵天行',
        effects: [
          { type: 'flag', key: 'zhao_enemy', value: true },
          { type: 'stat', key: 'karma', value: 5 },
        ],
      },
      {
        id: 'ignore_zhao',
        text: '清者自清，不予理会',
        effects: [
          { type: 'stat', key: 'demonHeart', value: -5 },
          { type: 'cultivation', value: 8 },
        ],
      },
    ],
  },
  {
    id: 'zhao_tianxing_duel',
    title: '赵天行约战',
    description:
      '赵天行在演武场当众向你下战书。「你我之间的恩怨，今日当众了结。」围观弟子议论纷纷，此战关乎你在宗门中的颜面。',
    weight: 7,
    years: 1,
    once: true,
    conditions: [
      { type: 'flag', key: 'zhao_enemy', value: true },
      { type: 'realm', min: 'qi_refining_2' },
    ],
    choices: [
      {
        id: 'accept_duel',
        text: '应战，正面击败他',
        outcomes: [
          {
            chance: 0.5,
            luckBonus: 0.005,
            successEffects: [
              { type: 'cultivation', value: 20 },
              { type: 'stat', key: 'karma', value: 10 },
              { type: 'flag', key: 'beat_zhao', value: true },
              { type: 'spiritStones', value: 15 },
            ],
            failEffects: [
              { type: 'cultivation', value: 8 },
              { type: 'stat', key: 'demonHeart', value: 5 },
            ],
            narrative: {
              success: '你以精妙功法击败赵天行，围观弟子纷纷喝彩。',
              fail: '赵天行暗藏杀招，你惜败当场，心中不甘。',
            },
          },
        ],
      },
      {
        id: 'decline_duel',
        text: '不与他一般见识',
        effects: [
          { type: 'stat', key: 'demonHeart', value: -5 },
          { type: 'stat', key: 'karma', value: 3 },
        ],
      },
    ],
  },
  {
    id: 'zhao_tianxing_redemption',
    title: '赵天行悔过',
    description:
      '数年后，赵天行独自找到你，神色复杂。「当年是我心胸狭隘，嫉贤妒能。今日特来赔罪。」他递上一壶灵酒，眼中似有悔意。',
    weight: 6,
    years: 2,
    once: true,
    conditions: [{ type: 'flag', key: 'beat_zhao', value: true }],
    choices: [
      {
        id: 'forgive_zhao',
        text: '接受赔罪，往事不提',
        effects: [
          { type: 'stat', key: 'karma', value: 12 },
          { type: 'stat', key: 'demonHeart', value: -5 },
          { type: 'flag', key: 'zhao_reconciled', value: true },
        ],
      },
      {
        id: 'reject_zhao',
        text: '往事已矣，但信任难复',
        effects: [
          { type: 'stat', key: 'demonHeart', value: -3 },
          { type: 'stat', key: 'comprehension', value: 3 },
        ],
      },
    ],
  },
  {
    id: 'three_friends',
    title: '三人同游',
    description:
      '春日晴好，林远提议与你和苏暮烟一同下山游历。三人行于山间小道，林远活泼话多，苏暮烟安静微笑，你走在中间，忽觉修行路上有此二友，亦是幸事。',
    weight: 6,
    years: 2,
    once: true,
    conditions: [
      { type: 'flag', key: 'lin_yuan_ally', value: true },
      { type: 'flag', key: 'su_muyan_ally', value: true },
    ],
    choices: [
      {
        id: 'enjoy',
        text: '珍惜当下，尽情游玩',
        effects: [
          { type: 'stat', key: 'karma', value: 10 },
          { type: 'lifespan', value: 3 },
          { type: 'stat', key: 'demonHeart', value: -5 },
        ],
      },
      {
        id: 'train_together',
        text: '趁机切磋交流功法',
        effects: [
          { type: 'cultivation', value: 15 },
          { type: 'stat', key: 'comprehension', value: 4 },
        ],
      },
    ],
  },
]
