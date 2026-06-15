import { ACHIEVEMENTS } from '../data/achievements'
import { EVENTS } from '../data/events'
import { ENDINGS } from '../data/endings'
import { getRealmOrder } from '../data/realms'
import type { Ending, GameSession, MetaProgress } from '../types/game'

const SYSTEM_EVENT_IDS = [
  'cultivation_path',
  'divine_sense_trial',
  'formation_study',
  'alchemy_workshop',
  'bloodline_awakening',
  'spirit_beast_train',
  'divine_weapon_forge',
  'technique_pavilion',
]

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
      demon_overlord: 'demon_first',
      immortal_lovers: 'lovers_first',
      sect_elder: 'sect_elder_path',
      pill_master: 'pill_guru',
      natural_death: 'natural_death',
      body_death: 'body_death',
      mortal_life: 'mortal_end',
      wandering_hermit: 'wander_end',
      war_hero: 'war_hero_first',
      sword_saint: 'sword_saint_first',
      formation_master: 'formation_master_first',
      moli_friend: 'moli_friend_first',
      wander_leader: 'wander_leader_first',
      demon_conqueror: 'demon_conqueror_first',
      bloodline_lord: 'bloodline_lord_first',
      weapon_master: 'weapon_master_first',
      technique_sage: 'technique_sage_first',
      celestial_heir: 'celestial_heir_first',
      beast_king: 'beast_king_first',
      map_inheritance: 'map_inheritance_first',
    }
    if (map[ending.id]) add(map[ending.id])

    if (player.spiritRoot === '五灵根') add('penta_root')
    if (player.spiritRoot === '天灵根') add('heaven_root')
    if (player.flags.refused_all_sects) add('no_sect')
    if (session.dailySeed !== null) add('daily_player')
    if (session.useInnateBody) add('innate_body')
    if (session.turn <= 10) add('speed_run')
    if ((player.shopBuffs.purchases ?? 0) === 0) add('no_shop')
  }
  if (player.flags.rescued_beauty) add('rescue_beauty')
  if (player.flags.dual_cultivation_mastered) add('dual_master')
  if (player.flags.survived_together) add('companion_trib')
  if (player.flags.war_hero) add('war_hero')
  if (player.flags.war_strategist) add('war_strategist')
  if (player.flags.demon_slayer) add('demon_slayer')
  if (player.flags.met_moli) add('met_moli')
  if (player.flags.moli_ally) add('moli_ally')
  if (player.flags.defeated_moli) add('defeated_moli')
  if (player.flags.wander_defender) add('wander_defender')
  if (player.flags.sect_battle_hero) add('sect_battle_hero')
  if (player.flags.spy_hero) add('spy_hero')
  if (player.history.includes('calamity_plague')) add('survived_plague')
  if (player.history.includes('qi_deviation')) add('survived_qi_deviation')
  if (player.history.includes('inner_demon')) add('defeated_demon_heart')
  if (player.flags.has_ancient_map) add('ancient_map_found')
  if (player.history.includes('blood_moon')) add('blood_moon_cultivate')
  if (player.flags.celestial_heritage) add('celestial_witness')
  if (player.flags.vein_war_hero) add('vein_war_hero')
  if (player.flags.lin_yuan_brother) add('lin_yuan_brother')
  if (player.flags.su_muyan_close) add('su_muyan_close')
  if (player.flags.zhao_reconciled) add('zhao_reconciled')
  if (player.flags.lin_yuan_ally && player.flags.su_muyan_ally) add('three_friends')
  if (player.flags.ye_qingmei_close) add('ye_qingmei_close')
  if (player.flags.moli_brother) add('moli_brother')
  if (player.flags.dungeon_cleared) add('dungeon_cleared')
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
  if (session.turn >= 50) add('turn_50')
  if (player.age <= 50 && getRealmOrder(player.realm) >= getRealmOrder('golden_core')) add('young_golden')
  if (SYSTEM_EVENT_IDS.every((id) => player.history.includes(id))) add('all_systems')

  const ALL_BEASTS = ['妖狼', '灵鹤', '玄龟', '赤焰虎', '雷鹰', '冰凤']
  const seen = player.spiritBeastsSeen ?? []
  if (ALL_BEASTS.every((b) => seen.includes(b))) add('all_spirit_beasts')

  const ALL_ORIGINS = ['farmer', 'noble_exile', 'demon_blood', 'scholar', 'merchant', 'hermit', 'sect_orphan', 'tomb_raider', 'healer']
  if (ALL_ORIGINS.every((o) => meta.unlockedOrigins.includes(o))) add('all_origins')

  return newly.filter((id) => ACHIEVEMENTS.some((a) => a.id === id))
}
