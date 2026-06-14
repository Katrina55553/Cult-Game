import type { PlayerState } from '../types/game'

export interface StorylineStep {
  flag: string
  label: string
  /** 若需额外条件（非纯 flag），在此扩展 */
  extraCheck?: (player: PlayerState) => boolean
}

export interface Storyline {
  id: string
  name: string
  tone: 'jade' | 'gold' | 'cinnabar' | 'mist'
  /** 进入剧情线的前置条件，null 表示始终可见 */
  entryCheck: ((player: PlayerState) => boolean) | null
  steps: StorylineStep[]
}

export const STORYLINES: Storyline[] = [
  // ──── 宗门主线 ────
  {
    id: 'sect_main',
    name: '天玄宗主线',
    tone: 'jade',
    entryCheck: (p) => !!p.flags.loyal_to_sect,
    steps: [
      { flag: 'loyal_to_sect', label: '拜入宗门' },
      { flag: 'inner_disciple', label: '晋升内门' },
      { flag: 'became_elder', label: '崭露头角' },
      { flag: 'war_hero', label: '宗门大战' },
      { flag: 'sect_master', label: '接任掌门' },
    ],
  },

  // ──── 道侣·沈霜凝线 ────
  {
    id: 'romance_su',
    name: '沈霜凝线',
    tone: 'gold',
    entryCheck: (p) => !!p.flags.met_su_qing,
    steps: [
      { flag: 'met_su_qing', label: '路遇佳人' },
      { flag: 'su_qing_companion', label: '结为道侣' },
      { flag: 'dual_cultivation_mastered', label: '双修大成' },
      { flag: 'survived_together', label: '共渡天劫' },
      { flag: 'chose_lovers_ascension', label: '眷侣证道' },
    ],
  },

  // ──── 道侣·叶轻眉线 ────
  {
    id: 'romance_ye',
    name: '叶轻眉线',
    tone: 'gold',
    entryCheck: (p) => !!p.flags.met_lin_wanyue,
    steps: [
      { flag: 'met_lin_wanyue', label: '灵泉偶遇' },
      { flag: 'ye_qingmei_friend', label: '品茶叙旧' },
      { flag: 'ye_qingmei_close', label: '携手探险' },
      { flag: 'has_companion', label: '结为道侣', extraCheck: (p) => !!p.flags.met_lin_wanyue },
    ],
  },

  // ──── 墨离线 ────
  {
    id: 'moli',
    name: '墨离线',
    tone: 'cinnabar',
    entryCheck: (p) => !!p.flags.met_moli,
    steps: [
      { flag: 'met_moli', label: '秘境黑影' },
      { flag: 'moli_ally', label: '结为善缘' },
      { flag: 'moli_trusted', label: '篝火倾诉' },
      { flag: 'moli_friend', label: '并肩探秘' },
      { flag: 'moli_brother', label: '以命相护' },
    ],
  },

  // ──── 林远线 ────
  {
    id: 'lin_yuan',
    name: '林远线',
    tone: 'jade',
    entryCheck: (p) => !!p.flags.helped_lin_yuan,
    steps: [
      { flag: 'helped_lin_yuan', label: '同门之谊' },
      { flag: 'lin_yuan_ally', label: '挚友相交' },
      { flag: 'lin_yuan_brother', label: '生死之交' },
    ],
  },

  // ──── 苏暮烟线 ────
  {
    id: 'su_muyan',
    name: '苏暮烟线',
    tone: 'gold',
    entryCheck: (p) => !!p.flags.met_su_muyan,
    steps: [
      { flag: 'met_su_muyan', label: '师姐指教' },
      { flag: 'su_muyan_ally', label: '出手相救' },
      { flag: 'su_muyan_close', label: '月下倾诉' },
    ],
  },

  // ──── 赵天行线 ────
  {
    id: 'zhao',
    name: '赵天行线',
    tone: 'cinnabar',
    entryCheck: (p) => !!p.flags.zhao_enemy || !!p.flags.beat_zhao,
    steps: [
      { flag: 'zhao_enemy', label: '结下梁子' },
      { flag: 'beat_zhao', label: '当众击败' },
      { flag: 'zhao_reconciled', label: '握手言和' },
      { flag: 'zhao_friend', label: '真相大白' },
    ],
  },

  // ──── 苍穹阁恩怨线 ────
  {
    id: 'cangqiong',
    name: '苍穹阁恩怨',
    tone: 'cinnabar',
    entryCheck: (p) => !!p.flags.rival_cangqiong || !!p.flags.beat_rival || !!p.flags.lost_to_rival,
    steps: [
      { flag: 'rival_cangqiong', label: '结怨苍穹阁' },
      { flag: 'beat_rival', label: '击败天骄' },
      { flag: 'survived_ambush', label: '伏击生还' },
      { flag: 'sect_battle_hero', label: '宗门争锋' },
    ],
  },

  // ──── 散修线 ────
  {
    id: 'wander',
    name: '散修之路',
    tone: 'mist',
    entryCheck: (p) => !!p.flags.refused_all_sects,
    steps: [
      { flag: 'refused_all_sects', label: '拒入宗门' },
      { flag: 'wander_alliance', label: '加入散修盟' },
      { flag: 'wander_leader', label: '散修盟主' },
      { flag: 'wander_defender', label: '守护散修' },
      { flag: 'met_lone_legend', label: '孤狼传说' },
    ],
  },

  // ──── 魔道线 ────
  {
    id: 'demon',
    name: '魔道之路',
    tone: 'cinnabar',
    entryCheck: (p) => !!p.flags.accepted_demon_path,
    steps: [
      { flag: 'accepted_demon_path', label: '踏入魔道' },
      { flag: 'demon_lord_servant', label: '投效魔尊' },
      { flag: 'demon_overlord', label: '自号魔尊' },
    ],
  },

  // ──── 秘境副本线 ────
  {
    id: 'dungeon',
    name: '秘境探索',
    tone: 'jade',
    entryCheck: (p) => !!p.flags.in_dungeon,
    steps: [
      { flag: 'in_dungeon', label: '踏入秘境' },
      { flag: 'dungeon_boss_ready', label: '抵达深处' },
      { flag: 'dungeon_cleared', label: '秘境通关' },
    ],
  },

  // ──── 古图支线 ────
  {
    id: 'ancient_map',
    name: '古图秘境',
    tone: 'gold',
    entryCheck: (p) => !!p.flags.has_ancient_map,
    steps: [
      { flag: 'has_ancient_map', label: '获得古图' },
    ],
  },

  // ──── 道侣间谍线 ────
  {
    id: 'spy',
    name: '道侣真相',
    tone: 'cinnabar',
    entryCheck: (p) => !!p.flags.forgave_spy || !!p.flags.turned_spy,
    steps: [
      { flag: 'forgave_spy', label: '往事不究' },
      { flag: 'turned_spy', label: '反间苍穹阁' },
    ],
  },
]
