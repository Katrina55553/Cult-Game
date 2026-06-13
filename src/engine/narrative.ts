import { getPathLabel } from '../data/cultivationSystems'
import { REALMS, getNextRealm, getRealmOrder } from '../data/realms'
import type { Choice, Effect, PlayerState } from '../types/game'

const STAT_LABELS: Record<string, string> = {
  rootBone: '根骨',
  comprehension: '悟性',
  luck: '气运',
  karma: '因果',
  demonHeart: '心魔',
}

const FLAG_PHRASES: Record<string, string> = {
  loyal_to_sect: '拜入青云宗，成为宗门弟子',
  refused_all_sects: '决意独行，踏上散修之路',
  got_inheritance: '获上古传承，道基更为深厚',
  cave_marked: '记下洞府方位，留待他日再来',
  became_elder: '长老对你刮目相看，宗门瞩目',
  accepted_demon_path: '踏上魔道，修为精进却因果深重',
  has_companion: '与佳人结为道侣，双人同修',
  chose_ascension: '踏入飞升通道，求问道果',
  chose_lovers_ascension: '与道侣携手证道，比翼双飞',
  gave_up_cultivation: '放下仙缘，回归凡尘',
  sect_master: '接任掌门之位，名震一方',
  mastered_alchemy: '丹道领悟更深',
  has_spirit_beast: '妖兽臣服，结为灵宠',
  past_life_chosen: '前世感悟融于今生',
  demon_lord_servant: '臣服魔尊，魔威渐长',
  demon_overlord: '魔威盖世，群雄侧目',
  combo_art_mastered: '合击秘法大成',
  grievously_wounded: '重伤脱身，道途未绝',
}

function formatSigned(label: string, value: number): string {
  const sign = value >= 0 ? '+' : ''
  return `${label} ${sign}${value}`
}

export function summarizeEffects(effects: Effect[]): string {
  const numeric: Record<string, number> = {}
  const extras: string[] = []

  for (const effect of effects) {
    switch (effect.type) {
      case 'cultivation':
        numeric['修为'] = (numeric['修为'] ?? 0) + effect.value
        break
      case 'lifespan':
        numeric['寿元'] = (numeric['寿元'] ?? 0) + effect.value
        break
      case 'spiritStones':
        if (effect.set) {
          extras.push(effect.value === 0 ? '灵石 归零' : formatSigned('灵石', effect.value))
        } else {
          numeric['灵石'] = (numeric['灵石'] ?? 0) + effect.value
        }
        break
      case 'stat': {
        const label = STAT_LABELS[effect.key] ?? effect.key
        numeric[label] = (numeric[label] ?? 0) + effect.value
        break
      }
      case 'flag':
        if (FLAG_PHRASES[effect.key]) extras.push(FLAG_PHRASES[effect.key])
        break
      case 'artifact':
        extras.push(`得${effect.name ?? '法宝'}`)
        break
      case 'breakthrough':
        extras.push('境界突破')
        break
      case 'endLife':
        extras.push('寿元将尽')
        break
      case 'divineSense':
        numeric['神识'] = (numeric['神识'] ?? 0) + effect.value
        break
      case 'alchemyTier':
        extras.push(`丹道阶 +${effect.value}`)
        break
      case 'formationTier':
        extras.push(`阵法阶 +${effect.value}`)
        break
      case 'bloodline':
        extras.push(`觉醒${effect.name}`)
        break
      case 'technique':
        extras.push(`习得${effect.name}`)
        break
      case 'divineWeapon':
        extras.push(`铸得${effect.name}`)
        break
      case 'spiritBeast':
        extras.push(effect.tier ? `灵兽${effect.name}升至${effect.tier}阶` : `得灵兽${effect.name}`)
        break
      case 'cultivationPath':
        extras.push(`择${getPathLabel(effect.path)}之路`)
        break
      case 'log':
      case 'hint':
      case 'age':
        break
      default:
        break
    }
  }

  const parts = [
    ...Object.entries(numeric)
      .filter(([, value]) => value !== 0)
      .map(([label, value]) => formatSigned(label, value)),
    ...extras,
  ]

  return parts.join('，')
}

export function appendEffectSummary(narrative: string, effects: Effect[]): string {
  const summary = summarizeEffects(effects)
  if (!summary) {
    return narrative.endsWith('。') ? narrative : `${narrative}。`
  }

  const base = narrative.replace(/。$/, '')
  return `${base}（${summary}）。`
}

export function augmentNarrativeWithBreakthrough(
  narrative: string,
  prevPlayer: PlayerState,
  player: PlayerState,
): string {
  if (getRealmOrder(player.realm) <= getRealmOrder(prevPlayer.realm)) {
    return narrative
  }

  const promotions: string[] = []
  let current = prevPlayer.realm
  while (getRealmOrder(current) < getRealmOrder(player.realm)) {
    const next = getNextRealm(current)
    if (!next) break
    promotions.push(REALMS[next].name)
    current = next
  }
  if (promotions.length === 0) return narrative

  const extras = [`突破成功，晋升${promotions.join('、')}`]
  const lifespanGain = player.lifespan - prevPlayer.lifespan
  if (lifespanGain > 0) extras.push(`寿元 +${lifespanGain}`)

  const summaryMatch = narrative.match(/^(.+?)（([^）]*)）。$/)
  if (summaryMatch) {
    return `${summaryMatch[1]}（${summaryMatch[2]}，${extras.join('，')}）。`
  }

  const base = narrative.replace(/。$/, '')
  return `${base}（${extras.join('，')}）。`
}

export function resolveChoiceNarrative(choice: Choice): string {
  if (choice.narrative) {
    return choice.effects?.length
      ? appendEffectSummary(choice.narrative, choice.effects)
      : choice.narrative.endsWith('。')
        ? choice.narrative
        : `${choice.narrative}。`
  }

  if (!choice.effects?.length) return choice.text

  const summary = summarizeEffects(choice.effects)
  if (summary) return `${summary}。`

  const logEffect = choice.effects.find((e) => e.type === 'log')
  if (logEffect && logEffect.type === 'log') return logEffect.text

  return choice.text
}
