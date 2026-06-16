import type { PlayerState } from '../types/game'

export type RouteId = 'sect' | 'wander' | 'demon'

export interface Chapter {
  id: string
  name: string
  route: RouteId
  /** 章节开始时的过渡文字 */
  intro: string
  /** 主线事件ID列表，必须全部完成才能推进章节 */
  events: string[]
  /** 支线事件ID列表，可选，不影响章节推进 */
  sideEvents?: string[]
  /** 下一章节ID（固定路线时使用） */
  nextChapter?: string
  /** 分支判断：根据玩家选择决定去哪个章节 */
  branchNext?: (player: PlayerState) => string
}

export const CHAPTERS: Record<string, Chapter> = {
  // ═══════════════════════════════════════
  //  宗门线
  // ═══════════════════════════════════════

  'sect_1': {
    id: 'sect_1',
    name: '第一章 · 入门',
    route: 'sect',
    intro: '天玄宗百年一度的收徒盛会，数百名少年才俊齐聚山门。你站在人群之中，灵根初显，仙途在即。',
    events: ['enter_sect', 'mentor_assign', 'first_mission', 'first_duel', 'outer_sect_life'],
    nextChapter: 'sect_2',
  },

  'sect_2': {
    id: 'sect_2',
    name: '第二章 · 修行',
    route: 'sect',
    intro: '入门已有数月，你渐渐适应了宗门生活。日复一日的修炼中，你感到体内灵气日益充盈，修为稳步精进。',
    events: ['elder_lecture', 'herb_gather', 'sect_friend', 'night_whisper', 'cave_inheritance'],
    sideEvents: [
      'su_muyan_teach',
      'origin_noble_heirloom', 'origin_merchant_contact', 'origin_farmer_homeland',
      'origin_scholar_text', 'origin_orphan_secret', 'origin_tomb_revisit', 'origin_healer_plague',
    ],
    nextChapter: 'sect_3',
  },

  'sect_3': {
    id: 'sect_3',
    name: '第三章 · 崭露头角',
    route: 'sect',
    intro: '你的修为渐长，在同辈弟子中已崭露头角。内门试炼在即，这是你证明自己的机会。',
    events: ['mountain_spirit', 'peer_trap', 'inner_sect_trial', 'beast_attack'],
    sideEvents: ['su_muyan_crisis', 'zhao_tianxing_revenge', 'alchemy_workshop'],
    nextChapter: 'sect_4',
  },

  'sect_4': {
    id: 'sect_4',
    name: '第四章 · 天骄之争',
    route: 'sect',
    intro: '各宗论道大会将至，天玄宗与苍穹阁的明争暗斗日趋激烈。你作为宗门新秀，被推上了风口浪尖。',
    events: ['spirit_flood', 'forbidden_library', 'rival_provocation', 'sect_tournament', 'boss_wolf_king'],
    sideEvents: ['mysterious_demon_first', 'zhao_tianxing_duel', 'qinglian_visit', 'yaogu_trade', 'guiyi_visit', 'formation_study', 'sword_enlightenment'],
    nextChapter: 'sect_5',
    branchNext: (p) => {
      // 被宗门伤透心 + 心魔高 → 叛逃散修
      if (p.flags.zhao_enemy && p.stats.demonHeart >= 35) return 'wander_1'
      return 'sect_5'
    },
  },

  'sect_5': {
    id: 'sect_5',
    name: '第五章 · 秘境探索',
    route: 'sect',
    intro: '上古秘境裂空而出，各方修士闻风而动。你奉师命下山历练，红尘滚滚，机缘与凶险并存。',
    events: ['world_travel', 'ancient_legacy', 'secret_realm', 'ancient_battlefield', 'heavenly_treasure', 'boss_ancient_golem'],
    sideEvents: ['mysterious_demon_second', 'beauty_rescue', 'jade_pool_encounter', 'lin_yuan_breakthrough', 'alchemy_master', 'divine_weapon_forge'],
    nextChapter: 'sect_6',
  },

  'sect_6': {
    id: 'sect_6',
    name: '第六章 · 情缘与暗流',
    route: 'sect',
    intro: '秘境归来，你的修为和见识都大有长进。然而宗门内部暗流涌动，外部势力蠢蠢欲动。一段情缘，也可能在此悄然降临。',
    events: ['sect_politics', 'elder_confession', 'ancient_prophesy', 'dao_companion'],
    sideEvents: [
      'beauty_gratitude', 'su_muyan_past', 'zhao_tianxing_redemption', 'zhao_truth',
      'mysterious_demon_third', 'moli_backstory', 'ye_qingmei_reunion_alt', 'wanyao_encounter', 'sect_exchange',
      'beast_bond', 'beast_evolution',
      'fox_saved', 'fox_guide', 'fox_transform',
      'found_prophecy', 'seek_artifact_1', 'seek_artifact_2', 'prophecy_choice',
      'origin_clue', 'origin_truth', 'origin_destiny',
      'sect_conflict', 'sect_truth', 'sect_choice',
      'master_quest', 'master_secret', 'master_legacy',
      'vein_found', 'vein_guardian', 'vein_harvest',
      'battlefield_memory', 'battlefield_truth', 'battlefield_legacy',
    ],
    nextChapter: 'sect_7',
    branchNext: (p) => {
      if (p.stats.demonHeart >= 30) return 'demon_1'
      return 'sect_7'
    },
  },

  'sect_7': {
    id: 'sect_7',
    name: '第七章 · 宗门大战',
    route: 'sect',
    intro: '血云压境，魔道六宗联军将天玄宗团团围困。山门护阵摇摇欲坠，长老们浴血厮杀。此战关乎存亡。',
    events: ['sect_alliance', 'spirit_vein_war', 'moyu_invasion', 'sect_war', 'boss_demon_general'],
    sideEvents: [
      'moli_sacrifice', 'lin_yuan_rescue', 'three_friends',
      'dual_cultivation', 'companion_tribulation', 'spy_companion', 'lover_jealousy',
      'qinglian_tournament', 'yaogu_plague', 'guiyi_seal', 'ancient_formation_battle',
      'beast_combat_aid', 'beast_jealousy', 'boss_spider_queen',
    ],
    nextChapter: 'sect_8',
  },

  'sect_8': {
    id: 'sect_8',
    name: '第八章 · 突破之路',
    route: 'sect',
    intro: '大战过后，修真界元气大伤。你闭关苦修，修为逼近瓶颈。突破还是陨落，在此一举。',
    events: ['demon_temptation', 'foundation_tribulation', 'demon_tribulation', 'dao_heart_trial', 'golden_tribulation', 'boss_thunder_beast'],
    sideEvents: [
      'lovers_ascension', 'time_window', 'rival_beauty',
      'yaogu_legacy', 'guiyi_enlightenment', 'sect_master_legacy',
      'bloodline_resonance', 'weapon_reforge', 'technique_fusion', 'boss_ice_wyrm',
    ],
    nextChapter: 'sect_9',
  },

  'sect_9': {
    id: 'sect_9',
    name: '第九章 · 终局',
    route: 'sect',
    intro: '天地异象骤起，飞升通道洞开于前。千年修行，一念之间。你将做出此生最重要的抉择。',
    events: ['lifespan_crisis', 'final_choice'],
    sideEvents: ['boss_demon_lord', 'time_window', 'lovers_ascension'],
  },

  // ═══════════════════════════════════════
  //  散修线
  // ═══════════════════════════════════════

  'wander_1': {
    id: 'wander_1',
    name: '第一章 · 独行',
    route: 'wander',
    intro: '你拒绝了宗门的邀请，独自踏上仙途。没有宗门庇护，一切只能靠自己。天地之大，何处不可去？',
    events: ['wander_market', 'wander_companion', 'wander_danger', 'beast_attack'],
    sideEvents: [
      'herb_gather', 'night_whisper', 'alchemy_workshop',
      'origin_noble_heirloom', 'origin_merchant_contact', 'origin_farmer_homeland',
      'origin_scholar_text', 'origin_orphan_secret', 'origin_tomb_revisit', 'origin_healer_plague',
    ],
    nextChapter: 'wander_2',
  },

  'wander_2': {
    id: 'wander_2',
    name: '第二章 · 求生',
    route: 'wander',
    intro: '散修之路远比想象中艰难。没有稳定的灵石来源，没有师长指点，一切都靠自己摸索。荒野之中，你学会了生存。',
    events: ['wander_hermit', 'wander_cave', 'wander_wilderness', 'wander_medical'],
    sideEvents: ['mountain_spirit', 'formation_study', 'sword_enlightenment', 'boss_wolf_king'],
    nextChapter: 'wander_3',
  },

  'wander_3': {
    id: 'wander_3',
    name: '第三章 · 声名渐起',
    route: 'wander',
    intro: '你的名声在散修圈中渐渐传开。有人敬你胆识过人，有人视你为眼中钉。散修大会在即，各方势力齐聚。',
    events: ['wander_festival', 'wander_reputation', 'wander_refugee', 'spirit_flood'],
    sideEvents: ['ancient_legacy', 'secret_realm', 'mysterious_demon_first', 'divine_weapon_forge'],
    nextChapter: 'wander_4',
    branchNext: (p) => {
      if (p.stats.karma >= 40 && p.stats.demonHeart <= 10) return 'sect_5'
      return 'wander_4'
    },
  },

  'wander_4': {
    id: 'wander_4',
    name: '第四章 · 散修之路',
    route: 'wander',
    intro: '散修之路越走越远。商路、围剿、渡劫——每一步都是生死抉择。你开始思考，这条路的尽头是什么。',
    events: ['wander_trade', 'wander_crisis', 'market_duel', 'solo_tribulation'],
    sideEvents: ['ancient_battlefield', 'heavenly_treasure', 'boss_shadow_assassin', 'alchemy_master'],
    nextChapter: 'wander_5',
  },

  'wander_5': {
    id: 'wander_5',
    name: '第五章 · 探索',
    route: 'wander',
    intro: '你深入荒野，探索未知之地。废弃的宗门遗址、千年的散修传说、凡人与修士的纠葛——你见到了修真界的另一面。',
    events: ['wander_ancient_site', 'wander_lone_wolf', 'mortal_plight', 'spirit_stone_origin'],
    sideEvents: ['demon_invasion', 'bloodline_awakening', 'technique_fusion', 'boss_ancient_golem'],
    nextChapter: 'wander_6',
  },

  'wander_6': {
    id: 'wander_6',
    name: '第六章 · 终局',
    route: 'wander',
    intro: '独行千里，你终于看清了修真界的真相。正道未必光明，魔道未必黑暗。你将做出最后的抉择。',
    events: ['righteous_dark_side', 'demon_mercy', 'final_choice'],
    sideEvents: ['boss_demon_lord', 'boss_thunder_beast', 'inheritance_battle', 'bloodline_resonance', 'weapon_reforge', 'alliance_legacy'],
  },

  // ═══════════════════════════════════════
  //  魔道线
  // ═══════════════════════════════════════

  'demon_1': {
    id: 'demon_1',
    name: '第一章 · 入魔',
    route: 'demon',
    intro: '心底的低语越来越清晰。魔功的诱惑难以抗拒——进境一日千里，代价却是道心沦丧。你已站在魔道的门槛上。',
    events: ['demon_whisper', 'demon_temptation', 'blood_moon', 'demon_nest'],
    sideEvents: [
      'beast_attack', 'night_whisper', 'sword_enlightenment',
      'origin_noble_heirloom', 'origin_merchant_contact', 'origin_farmer_homeland',
      'origin_scholar_text', 'origin_orphan_secret', 'origin_tomb_revisit', 'origin_healer_plague',
    ],
    nextChapter: 'demon_2',
  },

  'demon_2': {
    id: 'demon_2',
    name: '第二章 · 堕落',
    route: 'demon',
    intro: '你踏过那条线，再无回头之路。血祭、心魔、走火入魔——魔道的代价，你一一品尝。修为飞涨，道心渐远。',
    events: ['blood_sacrifice', 'inner_demon', 'qi_deviation', 'demon_invasion'],
    sideEvents: ['boss_shadow_assassin', 'alchemy_workshop', 'formation_study', 'demon_cultivation', 'demon_conscience'],
    nextChapter: 'demon_3',
    branchNext: (p) => {
      if (p.stats.demonHeart <= 15 && p.stats.karma >= 25) return 'sect_7'
      return 'demon_3'
    },
  },

  'demon_3': {
    id: 'demon_3',
    name: '第三章 · 魔道势力',
    route: 'demon',
    intro: '魔尊亲自招揽，正道联盟围剿。你在魔道中越陷越深，却也获得了前所未有的力量。何去何从？',
    events: ['demon_lord_offer', 'righteous_siege', 'soul_possession'],
    sideEvents: ['boss_demon_general', 'bloodline_awakening', 'soul_demand', 'divine_weapon_forge', 'technique_fusion', 'demon_territory', 'demon_alchemist', 'demon_power', 'demon_truth'],
    nextChapter: 'demon_4',
  },

  'demon_4': {
    id: 'demon_4',
    name: '第四章 · 终局',
    route: 'demon',
    intro: '心魔大劫将至，寿元所剩无几。你必须做出最后的抉择——是以魔证道，还是就此陨落。',
    events: ['demon_tribulation', 'lifespan_crisis', 'final_choice'],
    sideEvents: ['boss_demon_lord', 'bloodline_resonance', 'weapon_reforge', 'demon_transcend'],
  },
}

export function getChapter(id: string): Chapter | undefined {
  return CHAPTERS[id]
}

export function getFirstChapter(route: RouteId): string {
  return route === 'wander' ? 'wander_1' : route === 'demon' ? 'demon_1' : 'sect_1'
}
