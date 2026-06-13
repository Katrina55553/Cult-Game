import type { Ending } from '../types/game'

export const ENDINGS: Ending[] = [
  {
    id: 'ascension',
    title: '飞升成仙',
    description:
      '九霄雷劫过后，你肉身成圣，元神飞升仙界。回首凡间，千年修行化作一念，自此逍遥天外，与天地同寿。',
    priority: 100,
    conditions: [
      { type: 'realm', min: 'nascent_soul' },
      { type: 'stat', key: 'demonHeart', max: 30 },
      { type: 'flag', key: 'got_inheritance', value: true },
      { type: 'flag', key: 'chose_ascension', value: true },
    ],
  },
  {
    id: 'demon_fall',
    title: '堕魔陨落',
    description:
      '心魔吞噬道心，你堕入魔道。最后一战，正道群雄围剿，魔躯崩碎，魂飞魄散，千年修为化为乌有。',
    priority: 90,
    conditions: [
      { type: 'stat', key: 'demonHeart', min: 80 },
      { type: 'flag', key: 'accepted_demon_path', value: true },
    ],
  },
  {
    id: 'body_death',
    title: '身死道消',
    description:
      '天劫之下，肉身崩毁，元神溃散。千年修行，一朝尽付东流。世人只记得，曾有一位修士，陨落于天地之间。',
    priority: 85,
    conditions: [{ type: 'flag', key: 'died_in_tribulation', value: true }],
  },
  {
    id: 'pill_master',
    title: '丹道宗师',
    description:
      '你以丹入道，炼出九转金丹，名震修真界。虽未能飞升，却成为一代丹道宗师，弟子满堂，传承千载。',
    priority: 80,
    conditions: [
      { type: 'stat', key: 'comprehension', min: 60 },
      { type: 'flag', key: 'golden_pill_refined', value: true },
      { type: 'realm', min: 'golden_core' },
    ],
  },
  {
    id: 'sect_elder',
    title: '宗门长老',
    description:
      '你忠心宗门，历经磨难，最终成为宗门长老，守护一方山门。虽未证大道，却得万人敬仰，善终宗门。',
    priority: 75,
    conditions: [
      { type: 'realm', min: 'golden_core' },
      { type: 'flag', key: 'loyal_to_sect', value: true },
      { type: 'flag', key: 'became_elder', value: true },
    ],
  },
  {
    id: 'immortal_lovers',
    title: '神仙眷侣',
    description:
      '你与道侣双修圆满，情丝与道心相融。破境之时，你们携手飞升，成为修真界千古传颂的神仙眷侣，比翼双飞，同享长生。',
    priority: 82,
    conditions: [
      { type: 'flag', key: 'has_companion', value: true },
      { type: 'flag', key: 'dual_cultivation_mastered', value: true },
      { type: 'flag', key: 'survived_together', value: true },
      { type: 'flag', key: 'chose_lovers_ascension', value: true },
      { type: 'realm', min: 'golden_core' },
      { type: 'stat', key: 'demonHeart', max: 40 },
    ],
  },
  {
    id: 'wandering_hermit',
    title: '逍遥散修',
    description:
      '你拒绝宗门束缚，独行天下，看遍山河岁月。虽未飞升，却活得洒脱自在，成为传说中的一代散修。',
    priority: 70,
    conditions: [
      { type: 'realm', min: 'golden_core' },
      { type: 'flag', key: 'refused_all_sects', value: true },
    ],
  },
  {
    id: 'mortal_life',
    title: '凡人善终',
    description:
      '你放下修仙执念，回归凡尘，娶妻生子，平淡度日。晚年坐在院中品茶，笑谈当年修仙旧事，亦无遗憾。',
    priority: 65,
    conditions: [{ type: 'flag', key: 'gave_up_cultivation', value: true }],
  },
  {
    id: 'demon_overlord',
    title: '魔尊称霸',
    description:
      '你击败正道联盟，魔威盖世，统领荒域。虽未飞升，却成一代魔尊，令修真界闻风丧胆。',
    priority: 78,
    conditions: [
      { type: 'flag', key: 'demon_overlord', value: true },
      { type: 'realm', min: 'golden_core' },
    ],
  },
  {
    id: 'merchant_king',
    title: '凡俗首富',
    description:
      '你以灵石为道，坊市为家，富甲修真界。虽无大道修为，却享尽人间荣华，善终富贵。',
    priority: 55,
    conditions: [
      { type: 'resource', key: 'spiritStones', min: 500 },
      { type: 'flag', key: 'gave_up_cultivation', value: true },
    ],
  },
  {
    id: 'reincarnation',
    title: '轮回重修',
    description:
      '寿尽之时，你保留一丝元神投入轮回。来世，你将以新的灵根再踏仙途——这一世的故事，成为传说。',
    priority: 45,
    conditions: [
      { type: 'flag', key: 'past_life_chosen', value: true },
      { type: 'realm', min: 'foundation' },
    ],
  },
  {
    id: 'natural_death',
    title: '寿尽坐化',
    description:
      '寿元耗尽，你盘坐洞府，元神渐散。未能证道长生，却也在修行路上走过一遭，魂归天地，道消人亡。',
    priority: 10,
    conditions: [{ type: 'lifespan_remaining', max: 0 }],
  },
  {
    id: 'path_exhausted',
    title: '道途搁浅',
    description:
      '修行路上再无新机缘可寻，你止步不前，道心渐惰，最终泯然众人。仙途于此搁浅，徒留一声叹息。',
    priority: 5,
    conditions: [{ type: 'flag', key: '__path_exhausted__', value: true }],
  },
  {
    id: 'war_hero',
    title: '宗门护法',
    description:
      '宗门大战中你力挽狂澜，击退魔军，被封为护法长老。此后镇守山门数百年，威名赫赫，成为修真界一代传奇。',
    priority: 72,
    conditions: [
      { type: 'flag', key: 'war_hero', value: true },
      { type: 'realm', min: 'golden_core' },
      { type: 'flag', key: 'loyal_to_sect', value: true },
    ],
  },
  {
    id: 'sword_saint',
    title: '剑道圣者',
    description:
      '你以剑入道，一剑破万法。太古雷剑在手，剑意通天。最终以剑证道，肉身化剑，成为传说中的剑道圣者。',
    priority: 88,
    conditions: [
      { type: 'realm', min: 'nascent_soul' },
      { type: 'flag', key: 'got_inheritance', value: true },
      { type: 'flag', key: 'chose_ascension', value: true },
      { type: 'stat', key: 'rootBone', min: 80 },
    ],
  },
  {
    id: 'formation_master',
    title: '阵法宗师',
    description:
      '你痴迷阵道，穷尽一生钻研上古阵法。虽未飞升，却能以阵法困杀元婴修士，成为修真界公认的阵法第一人。',
    priority: 68,
    conditions: [
      { type: 'formationTier', min: 3 },
      { type: 'realm', min: 'golden_core' },
    ],
  },
]
