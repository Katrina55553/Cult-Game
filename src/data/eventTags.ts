import type { EventTag, GameEvent } from '../types/game'

/**
 * 历史事件标签表。
 *
 * 这里的内容是从旧版 `eventPicker.ts` 里 7 个手写 `*_EVENT_IDS` 集合原样迁移过来的，
 * 目的是把「分类」从抽取逻辑里挪回数据层：
 *
 *   - 抽取逻辑不再需要知道任何具体事件 id
 *   - 新增事件直接在 `GameEvent` 上写 `tags: ['alchemy']` 即可，不必回头登记集合
 *     （旧写法一旦忘记登记，事件就会静默失去所有倾向加成，和章节手写登记是同一类 bug）
 *
 * 只服务历史数据；`event.tags` 存在时优先使用后者。
 */
const LEGACY_TAGS: Record<string, EventTag[]> = {
  // 善行 / 救助
  wander_refugee: ['good'],
  wander_medical: ['good'],
  mountain_spirit: ['good'],
  demon_invasion: ['good'],
  mortal_plight: ['good'],
  spirit_stone_origin: ['good'],
  righteous_dark_side: ['good'],

  // 魔道 / 黑暗
  demon_whisper: ['dark'],
  demon_temptation: ['dark'],
  blood_sacrifice: ['dark'],
  demon_lord_offer: ['dark'],
  inner_demon: ['dark'],
  blood_moon: ['dark'],
  soul_possession: ['dark'],
  soul_demand: ['dark'],
  demon_nest: ['dark'],
  explore_demon_mountain: ['dark'],

  // 战斗
  beast_attack: ['combat'],
  boss_wolf_king: ['combat'],
  boss_shadow_assassin: ['combat'],
  boss_demon_general: ['combat'],
  boss_ancient_golem: ['combat'],
  boss_thunder_beast: ['combat'],
  first_duel: ['combat'],
  sect_tournament: ['combat'],
  rival_provocation: ['combat'],
  rival_ambush: ['combat'],
  ancient_battlefield: ['combat'],

  // 丹道
  alchemy_workshop: ['alchemy'],
  alchemy_master: ['alchemy'],
  alchemy_competition: ['alchemy'],
  alchemy_mystery: ['alchemy'],
  rare_ingredient: ['alchemy'],
  pill_recipe: ['alchemy'],
  find_healing_pill: ['alchemy'],

  // 阵法
  formation_study: ['formation'],
  ancient_formation_battle: ['formation'],
  ancient_formation: ['formation'],
  realm_formation: ['formation'],
  explore_ancient_tomb: ['formation'],

  // 剑道
  sword_enlightenment: ['sword'],
  sword_trial: ['sword'],
  sword_tomb: ['sword'],

  // 灵兽
  spirit_beast_train: ['beast'],
  spirit_crane: ['beast'],
  spirit_turtle: ['beast'],
  fire_tiger: ['beast'],
  thunder_falcon_nest: ['beast'],
  ice_phoenix: ['beast'],
}

export function getEventTags(event: GameEvent): EventTag[] {
  if (event.tags) return event.tags
  return LEGACY_TAGS[event.id] ?? []
}

/** 全部标签维度，供校验脚本遍历 */
export const ALL_EVENT_TAGS: EventTag[] = [
  'good',
  'dark',
  'combat',
  'alchemy',
  'formation',
  'sword',
  'beast',
]
