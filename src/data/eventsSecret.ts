import type { GameEvent } from '../types/game'

export const SECRET_EVENTS: GameEvent[] = [
  {
    id: 'secret_realm_treasure',
    title: '秘境夺宝',
    description:
      '上古秘境开启，你深入其中，发现一座被禁制封印的石殿。殿内宝光冲天，似有重宝。然而你不远处，苍穹阁的天骄弟子也盯上了此处，双方剑拔弩张。',
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
              { type: 'flag', key: 'rival_cangqiong', value: true },
              { type: 'cultivation', value: 15 },
            ],
            failEffects: [
              { type: 'lifespan', value: -12 },
              { type: 'stat', key: 'demonHeart', value: 10 },
              { type: 'flag', key: 'rival_cangqiong', value: true },
            ],
            narrative: {
              success: '你以迅雷之势夺下灵宝，苍穹阁天骄怒目而视，立誓日后必报此仇。',
              fail: '苍穹阁天骄早有防备，一掌将你震退，灵宝落入他手。你含恨而退。',
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
    id: 'ancient_ruins_deep',
    title: '遗迹深处',
    description:
      '大能遗迹深处，你发现一座悬浮的玉台，上面放着一枚散发古朴气息的储物戒指。然而另一名修士也从侧门闯入，他身着苍穹阁服饰，修为与你不相上下。二人对视，空气凝固。',
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
              success: '你抢先一步夺下储物戒，内藏大量灵石与一件古宝。苍穹阁修士恨恨离去。',
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
    id: 'dungeon_entrance',
    title: '秘境入口',
    description:
      '天地灵气汇聚之处，一道古老的空间裂缝缓缓撕开。裂缝内霞光流转，隐约可见亭台楼阁、灵田药圃。这是一处上古修士遗留的秘境，内藏无数机缘与凶险。入口处已有数名修士在观望。',
    weight: 8,
    years: 2,
    once: true,
    conditions: [{ type: 'realm', min: 'qi_refining_2' }],
    choices: [
      {
        id: 'enter_dungeon',
        text: '踏入秘境',
        effects: [
          { type: 'flag', key: 'in_dungeon', value: true },
          { type: 'flag', key: 'dungeon_floor_1', value: true },
          { type: 'cultivation', value: 5 },
        ],
      },
      {
        id: 'observe_dungeon',
        text: '先在外围观察地形',
        effects: [
          { type: 'stat', key: 'comprehension', value: 3 },
          { type: 'flag', key: 'in_dungeon', value: true },
          { type: 'flag', key: 'dungeon_floor_1', value: true },
          { type: 'flag', key: 'dungeon_observed', value: true },
        ],
      },
      {
        id: 'avoid_dungeon',
        text: '秘境凶险，不进去',
        effects: [
          { type: 'stat', key: 'karma', value: 3 },
        ],
      },
    ],
  },
  {
    id: 'dungeon_fork',
    title: '秘境分岔',
    description:
      '秘境内部分为三条通道。左侧传来金铁交鸣之声，似有战斗；正前方弥漫着浓郁灵气，似有宝物；右侧刻满符文的石壁上写着「悟道者得传承」。你必须择一而行。',
    weight: 10,
    years: 1,
    once: true,
    conditions: [{ type: 'flag', key: 'dungeon_floor_1', value: true }],
    choices: [
      {
        id: 'combat_path',
        text: '走左侧战斗通道',
        effects: [
          { type: 'flag', key: 'dungeon_combat', value: true },
          { type: 'stat', key: 'rootBone', value: 3 },
        ],
      },
      {
        id: 'treasure_path',
        text: '走前方灵气通道',
        effects: [
          { type: 'flag', key: 'dungeon_treasure', value: true },
          { type: 'stat', key: 'luck', value: 3 },
        ],
      },
      {
        id: 'puzzle_path',
        text: '走右侧符文通道',
        effects: [
          { type: 'flag', key: 'dungeon_puzzle', value: true },
          { type: 'stat', key: 'comprehension', value: 3 },
        ],
      },
    ],
  },
  {
    id: 'dungeon_combat_battle',
    title: '秘境试炼·战',
    description:
      '战斗通道尽头是一座巨大的演武场。场中一头三阶妖兽正虎视眈眈，它已吞食了数名闯入的修士。妖兽感应到你的气息，猛然扑来。',
    weight: 10,
    years: 1,
    once: true,
    conditions: [{ type: 'flag', key: 'dungeon_combat', value: true }],
    choices: [
      {
        id: 'fight_beast',
        text: '全力迎战妖兽',
        outcomes: [
          {
            chance: 0.5,
            luckBonus: 0.005,
            successEffects: [
              { type: 'cultivation', value: 20 },
              { type: 'stat', key: 'rootBone', value: 5 },
              { type: 'spiritStones', value: 30 },
              { type: 'flag', key: 'dungeon_boss_ready', value: true },
            ],
            failEffects: [
              { type: 'lifespan', value: -10 },
              { type: 'stat', key: 'demonHeart', value: 5 },
            ],
            narrative: {
              success: '你以凌厉手段斩杀妖兽，取出其妖丹。演武场后方出现一道传送门。',
              fail: '妖兽凶猛异常，你重伤逃出，但记下了它的弱点。',
            },
          },
        ],
      },
      {
        id: 'trap_beast',
        text: '利用地形设陷阱',
        requirements: [{ type: 'formationTier', min: 1 }],
        effects: [
          { type: 'cultivation', value: 15 },
          { type: 'formationTier', value: 1 },
          { type: 'flag', key: 'dungeon_boss_ready', value: true },
        ],
      },
      {
        id: 'retreat_beast',
        text: '妖兽太强，先撤',
        effects: [
          { type: 'stat', key: 'luck', value: 2 },
        ],
      },
    ],
  },
  {
    id: 'dungeon_treasure_room',
    title: '秘境试炼·宝',
    description:
      '灵气通道尽头是一座藏宝阁。三件宝物悬浮于光柱之中：一柄灵剑、一瓶丹药、一卷阵图。但每件宝物都有禁制守护，你只能选其一。',
    weight: 10,
    years: 1,
    once: true,
    conditions: [{ type: 'flag', key: 'dungeon_treasure', value: true }],
    choices: [
      {
        id: 'take_sword',
        text: '取灵剑',
        outcomes: [
          {
            chance: 0.6,
            luckBonus: 0.004,
            successEffects: [
              { type: 'divineWeapon', id: 'dungeon_sword', name: '秘境灵剑' },
              { type: 'cultivation', value: 10 },
              { type: 'flag', key: 'dungeon_boss_ready', value: true },
            ],
            failEffects: [
              { type: 'lifespan', value: -5 },
              { type: 'stat', key: 'demonHeart', value: 3 },
            ],
            narrative: {
              success: '你破开禁制取下灵剑，剑身嗡鸣，似认你为主。',
              fail: '禁制反噬，你被震退数步，灵剑飞走。',
            },
          },
        ],
      },
      {
        id: 'take_pill',
        text: '取丹药',
        effects: [
          { type: 'cultivation', value: 20 },
          { type: 'lifespan', value: 8 },
          { type: 'flag', key: 'dungeon_boss_ready', value: true },
        ],
      },
      {
        id: 'take_formation',
        text: '取阵图',
        effects: [
          { type: 'formationTier', value: 1 },
          { type: 'stat', key: 'comprehension', value: 6 },
          { type: 'flag', key: 'dungeon_boss_ready', value: true },
        ],
      },
    ],
  },
  {
    id: 'dungeon_puzzle_trial',
    title: '秘境试炼·悟',
    description:
      '符文通道尽头是一间密室，四壁刻满上古文字。中央石台上放着一枚玉简，上书：「悟透此阵，方可得道。」你需要参悟这些符文才能通过。',
    weight: 10,
    years: 1,
    once: true,
    conditions: [{ type: 'flag', key: 'dungeon_puzzle', value: true }],
    choices: [
      {
        id: 'study_puzzle',
        text: '静心参悟符文',
        outcomes: [
          {
            chance: 0.5,
            luckBonus: 0.005,
            successEffects: [
              { type: 'cultivation', value: 22 },
              { type: 'stat', key: 'comprehension', value: 8 },
              { type: 'formationTier', value: 1 },
              { type: 'flag', key: 'dungeon_boss_ready', value: true },
            ],
            failEffects: [
              { type: 'cultivation', value: 8 },
              { type: 'stat', key: 'demonHeart', value: 3 },
            ],
            narrative: {
              success: '你参透符文玄机，密室石门缓缓开启，内藏大能传承。',
              fail: '符文晦涩难懂，你只领悟了皮毛，但也有所收获。',
            },
          },
        ],
      },
      {
        id: 'brute_puzzle',
        text: '以蛮力破开禁制',
        requirements: [{ type: 'stat', key: 'rootBone', min: 50 }],
        effects: [
          { type: 'cultivation', value: 12 },
          { type: 'flag', key: 'dungeon_boss_ready', value: true },
        ],
      },
      {
        id: 'copy_puzzle',
        text: '拓印符文带走研究',
        effects: [
          { type: 'stat', key: 'comprehension', value: 5 },
          { type: 'formationTier', value: 1 },
          { type: 'flag', key: 'dungeon_boss_ready', value: true },
        ],
      },
    ],
  },
  {
    id: 'dungeon_boss',
    title: '秘境之主',
    description:
      '三条通道汇合于一座宏伟的大殿。殿中央盘坐着一具古修遗骸，遗骸前的玉台上放着一件散发耀眼光芒的宝物。当你靠近时，遗骸忽然睁开双眼——古修以残魂化为守关者，要考验你的实力。',
    weight: 10,
    years: 1,
    once: true,
    conditions: [{ type: 'flag', key: 'dungeon_boss_ready', value: true }],
    choices: [
      {
        id: 'fight_guardian',
        text: '以实力通过考验',
        outcomes: [
          {
            chance: 0.4,
            luckBonus: 0.006,
            successEffects: [
              { type: 'cultivation', value: 30 },
              { type: 'artifact', id: 'dungeon_relic', name: '秘境遗宝' },
              { type: 'spiritStones', value: 50 },
              { type: 'stat', key: 'comprehension', value: 8 },
              { type: 'flag', key: 'dungeon_cleared', value: true },
            ],
            failEffects: [
              { type: 'lifespan', value: -15 },
              { type: 'stat', key: 'demonHeart', value: 8 },
            ],
            narrative: {
              success: '你以强横实力通过古修考验，获得秘境遗宝。古修残魂含笑消散。',
              fail: '古修残魂实力恐怖，你被震飞出殿，秘境开始崩塌。',
            },
          },
        ],
      },
      {
        id: 'respect_guardian',
        text: '恭敬行礼，以诚意打动',
        requirements: [{ type: 'stat', key: 'karma', min: 25 }],
        effects: [
          { type: 'cultivation', value: 20 },
          { type: 'artifact', id: 'dungeon_relic', name: '秘境遗宝' },
          { type: 'stat', key: 'comprehension', value: 6 },
          { type: 'flag', key: 'dungeon_cleared', value: true },
        ],
      },
      {
        id: 'flee_guardian',
        text: '秘境将崩，速速逃离',
        effects: [
          { type: 'stat', key: 'luck', value: 3 },
          { type: 'cultivation', value: 8 },
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
]
