import type { Effect } from '../types/game'

export const USABLE_ITEM_EFFECTS: Record<string, Effect[]> = {
  '疗伤丹': [{ type: 'lifespan', value: 10 }],
  '护身符': [{ type: 'lifespan', value: 8 }],
  '护体残卷': [{ type: 'stat', key: 'rootBone', value: 3 }],
  '悟道卷轴': [{ type: 'stat', key: 'comprehension', value: 5 }],
  '地脉灵液': [{ type: 'cultivation', value: 15 }],
}

export function getDefaultUsableEffect(): Effect[] {
  return [{ type: 'cultivation', value: 5 }]
}
