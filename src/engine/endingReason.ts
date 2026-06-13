import type { Ending } from '../types/game'

export type EndingTrigger = 'condition' | 'lifespan' | 'no_events'

const CONDITION_REASONS: Record<string, string> = {
  ascension: '飞升通道开启，你择日飞升，求问道果。',
  demon_fall: '心魔吞噬道心，你在正魔大战中陨落。',
  body_death: '天劫之下肉身崩毁，元神溃散，身死道消。',
  pill_master: '丹道大成，你以炼丹立名，成为一代宗师。',
  sect_elder: '忠心宗门、历经磨难，你终成宗门长老。',
  immortal_lovers: '与道侣双修圆满，你们携手证道。',
  wandering_hermit: '你拒绝宗门束缚，独行天下，逍遥于世。',
  mortal_life: '你放下修仙执念，回归凡尘度日。',
  demon_overlord: '你击败正道联盟，魔威盖世，称霸荒域。',
  merchant_king: '你以灵石为道，富甲修真界，善终富贵。',
  reincarnation: '寿尽前保留元神，投入轮回，来世重修。',
  natural_death: '寿元耗尽，盘坐洞府，元神渐散。',
  path_exhausted: '天地机缘已尽，道心渐惰，仙途就此搁浅。',
}

export function getEndingReason(ending: Ending, trigger: EndingTrigger): string {
  if (trigger === 'lifespan') {
    return '寿元耗尽，你再无力支撑修行，魂归天地。'
  }
  if (trigger === 'no_events') {
    return '天地机缘已尽，仙途于此落幕，你收剑归隐。'
  }
  return CONDITION_REASONS[ending.id] ?? `你走出了「${ending.title}」之路。`
}
