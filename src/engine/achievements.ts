import { ACHIEVEMENTS } from '../data/achievements'
import { EVENTS } from '../data/events'
import { ENDINGS } from '../data/endings'
import { getRealmOrder } from '../data/realms'
import type { Ending, GameSession, MetaProgress } from '../types/game'

export function checkAchievements(
  session: GameSession,
  meta: MetaProgress,
  ending?: Ending | null,
): string[] {
  const { player } = session
  const unlocked = new Set(meta.unlockedAchievements)
  const newly: string[] = []

  const add = (id: string) => {
    if (!unlocked.has(id) && !newly.includes(id)) newly.push(id)
  }

  if (ending) {
    add('first_run')
    if (meta.unlockedEndings.length >= 3) add('ending_collector_3')
    if (meta.unlockedEndings.length >= ENDINGS.length) add('ending_collector_all')

    const map: Record<string, string> = {
      ascension: 'ascension_first',
      demon_fall: 'demon_first',
      immortal_lovers: 'lovers_first',
      sect_elder: 'sect_elder_path',
      pill_master: 'pill_guru',
      natural_death: 'natural_death',
      body_death: 'body_death',
      mortal_life: 'mortal_end',
      wandering_hermit: 'wander_end',
      demon_overlord: 'demon_first',
    }
    if (map[ending.id]) add(map[ending.id])

    if (player.spiritRoot === '五灵根') add('penta_root')
    if (player.spiritRoot === '天灵根') add('heaven_root')
    if (player.flags.refused_all_sects) add('no_sect')
    if (session.dailySeed !== null) add('daily_player')
    if (session.useInnateBody) add('innate_body')
  }
  if (player.flags.rescued_beauty) add('rescue_beauty')
  if (player.flags.dual_cultivation_mastered) add('dual_master')
  if (player.flags.survived_together) add('companion_trib')
  if (player.stats.demonHeart >= 90) add('demon_heart_90')
  if (player.lifespan - player.age <= 1) add('lifespan_1')
  if (player.spiritStones >= 300) add('rich')
  if (player.artifacts.length >= 3) add('artifact_3')
  if (getRealmOrder(player.realm) >= getRealmOrder('golden_core')) add('golden_core')
  if (getRealmOrder(player.realm) >= getRealmOrder('nascent_soul')) add('nascent_soul')
  const rareEventIds = new Set(
    EVENTS.filter((e) => e.rarity === 'rare' || e.rarity === 'legendary').map((e) => e.id),
  )
  if (player.history.some((id) => rareEventIds.has(id))) add('rare_event')
  if ((player.shopBuffs.purchases ?? 0) >= 5) add('shop_master')
  if (player.stats.karma >= 50) add('karma_saint')
  if (player.stats.karma <= -50) add('karma_devil')
  if (session.turn >= 30) add('turn_30')
  if (player.age <= 50 && getRealmOrder(player.realm) >= getRealmOrder('golden_core')) add('young_golden')

  return newly.filter((id) => ACHIEVEMENTS.some((a) => a.id === id))
}
