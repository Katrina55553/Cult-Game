import type { EventTag, PlayerState } from '../types/game'

/**
 * 倾向度系统。
 *
 * 取代旧版 `getBehaviorMultiplier` 的分段常数实现。旧写法形如
 * `if (karma >= 15) mult *= 1.5`，问题有三个：
 *
 *   1. 悬崖：karma 14→15 权重直接跳 50%，13→14 完全无变化，玩家无法感知过渡
 *   2. 复合放大：多条 if 连乘（1.5 × 1.3 × 1.4 …），单条数值看似温和，乘积却难以预估
 *   3. 不可调：11 个魔法数字散落在抽取逻辑里，且与事件 id 硬编码耦合
 *
 * 现在改为「先算连续倾向度，再按标签乘性叠加」：
 *
 *     weight = base × Π_{tag∈event.tags} (1 + (bias[tag] − 1) × affinity[tag])
 *
 * 曲线是纯函数，可以单测；标定值见下方 CALIBRATION，保证「到达旧阈值时的强度」大致不变，
 * 但阈值两侧是平滑过渡而不是跳变。
 *
 * 两类维度要分开看：
 *   - 连续量（karma / demonHeart / rootBone）：旧写法是任意划线，15 和 14 的玩家状态几乎一样
 *     却拿到 50% 的权重差，这是真正需要消除的悬崖，斜坡能彻底解决。
 *   - 序数量（丹/阵/剑/血脉等 tier、是否持有灵兽）：只有少数几个取值，阶与阶之间的跳变
 *     来自状态本身的变化（「学会了丹道」就是一次质变），不存在人为悬崖。
 *     ramp 在这里的作用不是消除跳变，而是让阶与阶之间有梯度（旧实现里 tier 1/2/3 完全同权）。
 */

const clamp01 = (value: number): number => (value < 0 ? 0 : value > 1 ? 1 : value)

/**
 * 平滑阶跃：把 value 从 from 线性映射到 [0,1]，再用 smoothstep 抹掉两端的折角。
 * from/to 之间为过渡区，区间外饱和到 0 或 1。
 */
export function ramp(value: number, from: number, to: number): number {
  if (to === from) return value >= to ? 1 : 0
  const t = clamp01((value - from) / (to - from))
  return t * t * (3 - 2 * t)
}

/**
 * 各标签的最大权重系数。数值对齐旧实现的「阈值处」倍率，
 * 因此上限不变、中段更温和。
 */
export const TAG_BIAS: Record<EventTag, number> = {
  good: 1.95, // 旧：karma≥15 ×1.5，karma≥30 再 ×1.3 → 1.95
  dark: 2.24, // 旧：demonHeart≥40 ×1.6，≥60 再 ×1.4 → 2.24
  combat: 1.4, // 旧：rootBone≥35 ×1.4
  alchemy: 1.5, // 旧：alchemyTier≥1 ×1.5
  formation: 1.5, // 旧：formationTier≥1 ×1.5
  sword: 1.5, // 旧：swordTier≥1 ×1.5
  beast: 1.4, // 旧：持有灵兽 ×1.4
}

/**
 * 权重标定表。
 *
 * 过渡区刻意**以旧阈值为中点**，这样曲线在旧阈值处的取值 ≈ 旧实现的阶跃值，
 * 整段行为的期望强度基本不变，只是把跳变摊平成斜坡。
 * 若把 from 调小（提前起算），会显著放大对应维度的正反馈——心魔越高越容易抽到黑暗事件，
 * 黑暗事件又继续加心魔，很容易让整局失控成魔道线独大，这一点务必谨慎。
 */
const CALIBRATION: { tag: EventTag; source: string; from: number; to: number }[] = [
  { tag: 'good', source: 'karma', from: 5, to: 25 }, // 中点 15
  { tag: 'dark', source: 'demonHeart', from: 25, to: 55 }, // 中点 40
  { tag: 'combat', source: 'rootBone', from: 20, to: 40 }, // 中点 30
  { tag: 'alchemy', source: 'alchemyTier', from: 0, to: 1.5 },
  { tag: 'formation', source: 'formationTier', from: 0, to: 1.5 },
  { tag: 'sword', source: 'swordTier', from: 0, to: 1.5 },
  { tag: 'beast', source: 'spiritBeast', from: 0, to: 1 },
]

export type AffinityVector = Record<EventTag, number>

/** 各维度取自玩家状态的哪个字段 */
function affinitySource(state: PlayerState, tag: EventTag): number {
  const { stats, cultivationSystems: sys } = state
  switch (tag) {
    case 'good':
      return stats.karma
    case 'dark':
      return stats.demonHeart
    case 'combat':
      return stats.rootBone
    case 'alchemy':
      return sys.alchemyTier
    case 'formation':
      return sys.formationTier
    case 'sword':
      return sys.swordTier
    case 'beast':
      return sys.spiritBeast ? 1 : 0
  }
}

/** 玩家在各倾向维度上的强度，每维 [0,1]。曲线参数只在 CALIBRATION 里定义一次。 */
export function computeAffinity(state: PlayerState): AffinityVector {
  const result = {} as AffinityVector
  for (const { tag, from, to } of CALIBRATION) {
    result[tag] = ramp(affinitySource(state, tag), from, to)
  }
  return result
}

/**
 * 全局倾向：与标签无关、对所有事件生效的两条。
 * 旧实现限制较死（悟性要 ≥50 且事件为稀有以上、气运要 ≥40），这里同样只在
 * 高区间给小幅加成，只是换成连续曲线。
 */
export function globalAffinity(state: PlayerState): { insight: number; fortune: number } {
  return {
    insight: ramp(state.stats.comprehension, 30, 70),
    fortune: ramp(state.stats.luck, 20, 60),
  }
}

/** 供文档 / 调试：把标定表暴露出去，方便核对曲线与旧阈值的关系 */
export function getCalibration() {
  return CALIBRATION.map((c) => ({ ...c, bias: TAG_BIAS[c.tag] }))
}
