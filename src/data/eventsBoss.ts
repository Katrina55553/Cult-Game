import type { GameEvent } from '../types/game'

export const BOSS_EVENTS: GameEvent[] = [
  {
    id: 'boss_wolf_king',
    title: '妖狼王',
    description:
      '深山古林中，一头三丈巨狼盘踞于白骨堆上，通体漆黑如墨，双目赤红。它已吞食无数修士，方圆百里无人敢近。妖狼王感应到你的气息，发出震天怒吼。',
    weight: 6,
    years: 2,
    once: true,
    conditions: [{ type: 'realm', min: 'qi_refining_2' }],
    choices: [
      {
        id: 'fight_wolf',
        text: '正面迎战妖狼王',
        outcomes: [
          {
            chance: 0.45,
            luckBonus: 0.005,
            successEffects: [
              { type: 'cultivation', value: 20 },
              { type: 'stat', key: 'rootBone', value: 5 },
              { type: 'spiritStones', value: 25 },
              { type: 'flag', key: 'slayed_wolf_king', value: true },
            ],
            failEffects: [
              { type: 'lifespan', value: -12 },
              { type: 'stat', key: 'demonHeart', value: 8 },
            ],
            narrative: {
              success: '你以凌厉剑法斩杀妖狼王，取出其妖丹。此战让你声名初显。',
              fail: '妖狼王凶猛异常，你重伤逃出，险些丧命。',
            },
          },
        ],
      },
      {
        id: 'overpower_wolf',
        text: '以蛮力硬撼妖狼王',
        requirements: [{ type: 'stat', key: 'rootBone', min: 40 }],
        outcomes: [
          {
            chance: 0.6,
            luckBonus: 0.004,
            successEffects: [
              { type: 'cultivation', value: 25 },
              { type: 'stat', key: 'rootBone', value: 8 },
              { type: 'spiritStones', value: 30 },
              { type: 'flag', key: 'slayed_wolf_king', value: true },
            ],
            failEffects: [
              { type: 'lifespan', value: -8 },
              { type: 'stat', key: 'demonHeart', value: 5 },
            ],
            narrative: {
              success: '你以强横肉身硬抗妖狼王数十爪，最终将其击杀。根骨越强，胜算越大。',
              fail: '妖狼王力量超出预期，你被震退数步，但伤势不重。',
            },
          },
        ],
      },
      {
        id: 'trap_wolf',
        text: '布阵困杀妖狼王',
        requirements: [{ type: 'formationTier', min: 1 }],
        effects: [
          { type: 'cultivation', value: 15 },
          { type: 'spiritStones', value: 20 },
          { type: 'formationTier', value: 1 },
          { type: 'flag', key: 'slayed_wolf_king', value: true },
        ],
      },
      {
        id: 'avoid_wolf',
        text: '绕道而行，不招惹它',
        effects: [
          { type: 'stat', key: 'luck', value: 3 },
        ],
      },
    ],
  },
  {
    id: 'boss_demon_general',
    title: '血魔将',
    description:
      '魔道入侵，一名血魔将领兵围攻天玄宗外门据点。他身披血色铠甲，手持血矛，修为已达筑基巅峰。据点内数十名弟子危在旦夕。',
    weight: 5,
    years: 2,
    once: true,
    conditions: [
      { type: 'realm', min: 'foundation' },
      { type: 'flag', key: 'loyal_to_sect', value: true },
    ],
    choices: [
      {
        id: 'challenge_general',
        text: '单挑血魔将',
        outcomes: [
          {
            chance: 0.4,
            luckBonus: 0.005,
            successEffects: [
              { type: 'cultivation', value: 25 },
              { type: 'stat', key: 'rootBone', value: 6 },
              { type: 'spiritStones', value: 35 },
              { type: 'flag', key: 'slayed_demon_general', value: true },
              { type: 'stat', key: 'karma', value: 12 },
            ],
            failEffects: [
              { type: 'lifespan', value: -15 },
              { type: 'stat', key: 'demonHeart', value: 10 },
            ],
            narrative: {
              success: '你以一己之力斩杀血魔将，救出被困弟子。宗门上下对你刮目相看。',
              fail: '血魔将实力远超预期，你重伤败退，据点沦陷。',
            },
          },
        ],
      },
      {
        id: 'overpower_general',
        text: '以蛮力硬撼血魔将',
        requirements: [{ type: 'stat', key: 'rootBone', min: 55 }],
        outcomes: [
          {
            chance: 0.6,
            luckBonus: 0.004,
            successEffects: [
              { type: 'cultivation', value: 30 },
              { type: 'stat', key: 'rootBone', value: 8 },
              { type: 'spiritStones', value: 40 },
              { type: 'flag', key: 'slayed_demon_general', value: true },
              { type: 'stat', key: 'karma', value: 15 },
            ],
            failEffects: [
              { type: 'lifespan', value: -10 },
              { type: 'stat', key: 'demonHeart', value: 8 },
            ],
            narrative: {
              success: '你以强横肉身硬抗血魔将数十矛，最终将其击杀。根骨越强，胜算越大。',
              fail: '血魔将实力超出预期，你被震退数步，但伤势不重。',
            },
          },
        ],
      },
      {
        id: 'rally_defense',
        text: '召集弟子合力防守',
        effects: [
          { type: 'cultivation', value: 15 },
          { type: 'stat', key: 'karma', value: 10 },
          { type: 'stat', key: 'comprehension', value: 4 },
        ],
      },
      {
        id: 'retreat_general',
        text: '战略撤退，保全实力',
        effects: [
          { type: 'stat', key: 'karma', value: -5 },
          { type: 'cultivation', value: 5 },
        ],
      },
      {
        id: 'sense_general',
        text: '以神识探查血魔将弱点',
        requirements: [{ type: 'divineSense', min: 30 }],
        effects: [
          { type: 'cultivation', value: 22 },
          { type: 'stat', key: 'comprehension', value: 6 },
          { type: 'flag', key: 'slayed_demon_general', value: true },
        ],
      },
    ],
  },
  {
    id: 'boss_shadow_assassin',
    title: '暗影刺客',
    description:
      '夜深人静，你感应到一股冰冷杀气逼近。一名黑衣刺客无声无息地出现在你身后，匕首寒光一闪。「有人出价买你的命。」',
    weight: 6,
    years: 1,
    once: true,
    conditions: [{ type: 'realm', min: 'qi_refining_3' }],
    choices: [
      {
        id: 'fight_assassin',
        text: '反手制敌',
        outcomes: [
          {
            chance: 0.5,
            luckBonus: 0.005,
            successEffects: [
              { type: 'cultivation', value: 15 },
              { type: 'stat', key: 'comprehension', value: 5 },
              { type: 'spiritStones', value: 20 },
              { type: 'flag', key: 'survived_assassin', value: true },
            ],
            failEffects: [
              { type: 'lifespan', value: -10 },
              { type: 'stat', key: 'demonHeart', value: 5 },
            ],
            narrative: {
              success: '你反手擒住刺客，逼问出幕后主使。刺客咬毒自尽，你获得其遗物。',
              fail: '刺客刀法诡异，你被划伤数处，他趁乱逃走。',
            },
          },
        ],
      },
      {
        id: 'negotiate_assassin',
        text: '出双倍价格买通刺客',
        requirements: [{ type: 'resource', key: 'spiritStones', min: 40 }],
        effects: [
          { type: 'spiritStones', value: -40 },
          { type: 'stat', key: 'comprehension', value: 3 },
          { type: 'flag', key: 'survived_assassin', value: true },
        ],
      },
      {
        id: 'flee_assassin',
        text: '施展遁术逃离',
        effects: [
          { type: 'stat', key: 'luck', value: 3 },
          { type: 'stat', key: 'demonHeart', value: 3 },
        ],
      },
      {
        id: 'sense_assassin',
        text: '以神识锁定刺客行踪',
        requirements: [{ type: 'divineSense', min: 25 }],
        effects: [
          { type: 'cultivation', value: 12 },
          { type: 'stat', key: 'comprehension', value: 5 },
          { type: 'spiritStones', value: 15 },
          { type: 'flag', key: 'survived_assassin', value: true },
        ],
      },
    ],
  },
  {
    id: 'boss_ancient_golem',
    title: '上古傀儡',
    description:
      '秘境深处，一尊三丈高的石像突然睁开双眼。它是上古修士留下的守护傀儡，浑身刻满符文，力大无穷。傀儡挡在传承石台前，不击败它便无法获取传承。',
    weight: 5,
    years: 2,
    once: true,
    conditions: [{ type: 'realm', min: 'foundation' }],
    choices: [
      {
        id: 'fight_golem',
        text: '以力破力，硬撼傀儡',
        outcomes: [
          {
            chance: 0.35,
            luckBonus: 0.006,
            successEffects: [
              { type: 'cultivation', value: 25 },
              { type: 'stat', key: 'rootBone', value: 8 },
              { type: 'artifact', id: 'golem_core', name: '傀儡核心' },
              { type: 'flag', key: 'defeated_golem', value: true },
            ],
            failEffects: [
              { type: 'lifespan', value: -15 },
              { type: 'stat', key: 'demonHeart', value: 5 },
            ],
            narrative: {
              success: '你以强横体魄硬抗傀儡数十拳，最终击碎其核心。傀儡轰然倒地，你获得其核心。',
              fail: '傀儡力量远超想象，你被震飞数丈，重伤退出。',
            },
          },
        ],
      },
      {
        id: 'study_golem',
        text: '研究傀儡符文找弱点',
        requirements: [{ type: 'formationTier', min: 2 }],
        effects: [
          { type: 'formationTier', value: 1 },
          { type: 'cultivation', value: 18 },
          { type: 'flag', key: 'defeated_golem', value: true },
        ],
      },
      {
        id: 'bypass_golem',
        text: '绕过傀儡，不碰传承',
        effects: [
          { type: 'stat', key: 'luck', value: 3 },
        ],
      },
    ],
  },
  {
    id: 'boss_thunder_beast',
    title: '雷兽降世',
    description:
      '天降异象，一头浑身缠绕雷霆的巨兽从云层中坠落。它是上古雷兽后裔，体内蕴含天雷之力。雷兽落地之处方圆十里化为焦土，你恰好在其肆虐范围之内。',
    weight: 4,
    years: 2,
    once: true,
    rarity: 'rare',
    conditions: [{ type: 'realm', min: 'golden_core' }],
    choices: [
      {
        id: 'fight_thunder',
        text: '以金丹之力对抗雷兽',
        outcomes: [
          {
            chance: 0.35,
            luckBonus: 0.006,
            successEffects: [
              { type: 'cultivation', value: 30 },
              { type: 'stat', key: 'rootBone', value: 8 },
              { type: 'divineSense', value: 15 },
              { type: 'flag', key: 'slayed_thunder_beast', value: true },
            ],
            failEffects: [
              { type: 'lifespan', value: -20 },
              { type: 'stat', key: 'demonHeart', value: 10 },
            ],
            narrative: {
              success: '你以金丹之力引天雷入体，与雷兽大战三百回合，最终将其斩杀。雷霆之力融入你的金丹，修为暴涨。',
              fail: '雷兽天雷之力远超预期，你被雷电贯穿全身，重伤逃出。',
            },
          },
        ],
      },
      {
        id: 'absorb_thunder',
        text: '引雷入体，借雷淬炼',
        requirements: [{ type: 'stat', key: 'rootBone', min: 60 }],
        effects: [
          { type: 'cultivation', value: 20 },
          { type: 'stat', key: 'rootBone', value: 5 },
          { type: 'divineSense', value: 10 },
        ],
      },
      {
        id: 'evade_thunder',
        text: '雷兽凶猛，速速逃离',
        effects: [
          { type: 'stat', key: 'luck', value: 3 },
        ],
      },
    ],
  },
  {
    id: 'boss_demon_lord',
    title: '魔尊化身',
    description:
      '虚空裂开一道缝隙，一尊魔尊化身从中走出。他浑身散发着令人窒息的魔气，目光如深渊般幽冷。「本尊给你两个选择：臣服，或死。」',
    weight: 4,
    years: 3,
    once: true,
    rarity: 'legendary',
    conditions: [{ type: 'realm', min: 'nascent_soul' }],
    choices: [
      {
        id: 'defy_lord',
        text: '宁死不屈，正面迎战',
        outcomes: [
          {
            chance: 0.3,
            luckBonus: 0.006,
            successEffects: [
              { type: 'cultivation', value: 35 },
              { type: 'stat', key: 'karma', value: 20 },
              { type: 'stat', key: 'rootBone', value: 10 },
              { type: 'flag', key: 'defeated_demon_lord', value: true },
            ],
            failEffects: [
              { type: 'lifespan', value: -25 },
              { type: 'stat', key: 'demonHeart', value: 15 },
            ],
            narrative: {
              success: '你以元婴之力硬撼魔尊化身，最终将其击溃。此战之后，你的名号响彻修真界。',
              fail: '魔尊化身实力恐怖，你拼死才逃脱，元神受创严重。',
            },
          },
        ],
      },
      {
        id: 'submit_lord',
        text: '假意臣服，伺机而动',
        effects: [
          { type: 'stat', key: 'demonHeart', value: 15 },
          { type: 'cultivation', value: 20 },
          { type: 'stat', key: 'karma', value: -10 },
        ],
      },
      {
        id: 'negotiate_lord',
        text: '以利诱之，提出交易',
        requirements: [{ type: 'stat', key: 'comprehension', min: 70 }],
        effects: [
          { type: 'cultivation', value: 15 },
          { type: 'stat', key: 'comprehension', value: 8 },
          { type: 'stat', key: 'demonHeart', value: 5 },
        ],
      },
    ],
  },
]
