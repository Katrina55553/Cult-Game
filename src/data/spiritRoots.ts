import type { SpiritRoot } from '../types/game'

export const SPIRIT_ROOTS: SpiritRoot[] = [
  {
    id: 'heaven',
    name: '天灵根',
    description: '万中无一的绝世天资，天道眷顾。',
    weight: 3,
    stats: { rootBone: [75, 95], comprehension: [70, 90], luck: [60, 85] },
    lifespan: [100, 120],
  },
  {
    id: 'single',
    name: '单灵根',
    description: '单一属性，修炼事半功倍。',
    weight: 10,
    stats: { rootBone: [55, 75], comprehension: [50, 70], luck: [40, 60] },
    lifespan: [85, 100],
  },
  {
    id: 'dual',
    name: '双灵根',
    description: '两种属性并存，资质上佳。',
    weight: 20,
    stats: { rootBone: [40, 60], comprehension: [40, 55], luck: [30, 50] },
    lifespan: [75, 90],
  },
  {
    id: 'triple',
    name: '三灵根',
    description: '资质平平，需勤能补拙。',
    weight: 30,
    stats: { rootBone: [30, 45], comprehension: [30, 45], luck: [25, 40] },
    lifespan: [65, 80],
  },
  {
    id: 'quad',
    name: '四灵根',
    description: '杂灵根，修炼艰难。',
    weight: 25,
    stats: { rootBone: [20, 35], comprehension: [20, 35], luck: [15, 30] },
    lifespan: [55, 70],
  },
  {
    id: 'penta',
    name: '五灵根',
    description: '废灵根，仙途渺茫。',
    weight: 12,
    stats: { rootBone: [10, 25], comprehension: [10, 25], luck: [10, 25] },
    lifespan: [50, 65],
  },
]
