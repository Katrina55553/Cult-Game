import type { PlayerState } from '../types/game'

export type RouteId = 'sect' | 'wander' | 'demon'

export interface Chapter {
  id: string
  name: string
  route: RouteId
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
    events: ['enter_sect', 'mentor_assign', 'first_mission', 'first_duel', 'outer_sect_life'],
    nextChapter: 'sect_2',
  },

  'sect_2': {
    id: 'sect_2',
    name: '第二章 · 修行',
    route: 'sect',
    events: ['elder_lecture', 'herb_gather', 'sect_friend', 'night_whisper', 'cave_inheritance'],
    sideEvents: ['su_muyan_teach'],
    nextChapter: 'sect_3',
  },

  'sect_3': {
    id: 'sect_3',
    name: '第三章 · 崭露头角',
    route: 'sect',
    events: ['mountain_spirit', 'peer_trap', 'inner_sect_trial'],
    sideEvents: ['su_muyan_crisis', 'zhao_tianxing_revenge'],
    nextChapter: 'sect_4',
  },

  'sect_4': {
    id: 'sect_4',
    name: '第四章 · 天骄之争',
    route: 'sect',
    events: ['spirit_flood', 'forbidden_library', 'rival_provocation', 'sect_tournament'],
    sideEvents: ['mysterious_demon_first', 'zhao_tianxing_duel', 'qinglian_visit', 'yaogu_trade', 'guiyi_visit'],
    nextChapter: 'sect_5',
  },

  'sect_5': {
    id: 'sect_5',
    name: '第五章 · 秘境探索',
    route: 'sect',
    events: ['world_travel', 'ancient_legacy', 'secret_realm', 'ancient_battlefield', 'heavenly_treasure'],
    sideEvents: ['mysterious_demon_second', 'beauty_rescue', 'jade_pool_encounter', 'lin_yuan_breakthrough'],
    nextChapter: 'sect_6',
  },

  'sect_6': {
    id: 'sect_6',
    name: '第六章 · 情缘与暗流',
    route: 'sect',
    events: ['sect_politics', 'elder_confession', 'ancient_prophesy', 'dao_companion'],
    sideEvents: [
      'beauty_gratitude', 'su_muyan_past', 'zhao_tianxing_redemption', 'zhao_truth',
      'mysterious_demon_third', 'moli_backstory', 'ye_qingmei_reunion_alt', 'wanyao_encounter', 'sect_exchange',
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
    events: ['sect_alliance', 'spirit_vein_war', 'moyu_invasion', 'sect_war'],
    sideEvents: [
      'moli_sacrifice', 'lin_yuan_rescue', 'three_friends',
      'dual_cultivation', 'companion_tribulation', 'spy_companion', 'lover_jealousy',
      'qinglian_tournament', 'yaogu_plague', 'guiyi_seal',
    ],
    nextChapter: 'sect_8',
  },

  'sect_8': {
    id: 'sect_8',
    name: '第八章 · 突破之路',
    route: 'sect',
    events: ['demon_temptation', 'foundation_tribulation', 'demon_tribulation', 'dao_heart_trial', 'golden_tribulation'],
    sideEvents: [
      'lovers_ascension', 'time_window', 'rival_beauty',
      'yaogu_legacy', 'guiyi_enlightenment', 'sect_master_legacy',
    ],
    nextChapter: 'sect_9',
  },

  'sect_9': {
    id: 'sect_9',
    name: '第九章 · 终局',
    route: 'sect',
    events: ['lifespan_crisis', 'final_choice'],
    sideEvents: ['ancient_prophesy'],
  },

  // ═══════════════════════════════════════
  //  散修线
  // ═══════════════════════════════════════

  'wander_1': {
    id: 'wander_1',
    name: '第一章 · 独行',
    route: 'wander',
    events: ['wander_market', 'wander_companion', 'wander_danger'],
    nextChapter: 'wander_2',
  },

  'wander_2': {
    id: 'wander_2',
    name: '第二章 · 求生',
    route: 'wander',
    events: ['wander_hermit', 'wander_cave', 'wander_wilderness', 'wander_medical'],
    nextChapter: 'wander_3',
  },

  'wander_3': {
    id: 'wander_3',
    name: '第三章 · 声名渐起',
    route: 'wander',
    events: ['wander_festival', 'wander_reputation', 'wander_refugee'],
    nextChapter: 'wander_4',
  },

  'wander_4': {
    id: 'wander_4',
    name: '第四章 · 散修之路',
    route: 'wander',
    events: ['wander_trade', 'wander_crisis', 'market_duel', 'solo_tribulation'],
    nextChapter: 'wander_5',
  },

  'wander_5': {
    id: 'wander_5',
    name: '第五章 · 探索',
    route: 'wander',
    events: ['wander_ancient_site', 'wander_lone_wolf', 'mortal_plight', 'spirit_stone_origin'],
    nextChapter: 'wander_6',
  },

  'wander_6': {
    id: 'wander_6',
    name: '第六章 · 终局',
    route: 'wander',
    events: ['righteous_dark_side', 'demon_mercy', 'final_choice'],
  },

  // ═══════════════════════════════════════
  //  魔道线
  // ═══════════════════════════════════════

  'demon_1': {
    id: 'demon_1',
    name: '第一章 · 入魔',
    route: 'demon',
    events: ['demon_whisper', 'demon_temptation', 'blood_moon'],
    nextChapter: 'demon_2',
  },

  'demon_2': {
    id: 'demon_2',
    name: '第二章 · 堕落',
    route: 'demon',
    events: ['blood_sacrifice', 'inner_demon', 'qi_deviation'],
    nextChapter: 'demon_3',
  },

  'demon_3': {
    id: 'demon_3',
    name: '第三章 · 魔道势力',
    route: 'demon',
    events: ['demon_lord_offer', 'righteous_siege', 'soul_possession'],
    nextChapter: 'demon_4',
  },

  'demon_4': {
    id: 'demon_4',
    name: '第四章 · 终局',
    route: 'demon',
    events: ['demon_tribulation', 'lifespan_crisis', 'final_choice'],
  },
}

export function getChapter(id: string): Chapter | undefined {
  return CHAPTERS[id]
}

export function getFirstChapter(route: RouteId): string {
  return route === 'wander' ? 'wander_1' : route === 'demon' ? 'demon_1' : 'sect_1'
}
