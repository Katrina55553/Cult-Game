import type { GameEvent } from '../types/game'

export const CONSEQUENCE_EVENTS: GameEvent[] = [
  {
    id: 'sect_departure_choice',
    title: '去留之问',
    description: '同门的敌意令你辗转难眠。山门外是无人约束的天地，山门内仍有未竟的修行。离去会失去宗门庇护，留下则要学会面对旧怨。这个决定，只能由你来做。',
    weight: 10, years: 0, once: true,
    conditions: [
      { type: 'route', route: 'sect' },
      { type: 'flag', key: 'zhao_enemy', value: true },
      { type: 'stat', key: 'demonHeart', min: 35 },
    ],
    choices: [
      { id: 'stay', text: '留下修行，不让旧怨决定去留', narrative: '你收起行囊，决定先完成眼前的修行。留在宗门是你的选择，并不意味着原谅暗算。', effects: [{ type: 'stat', key: 'demonHeart', value: -5 }] },
      { id: 'leave', text: '离开宗门，另寻自己的道路', narrative: '你交还弟子令牌，向山门作别。曾经的同门与旧怨留在身后，你选择从此独行。', effects: [{ type: 'route', route: 'wander' }] },
    ],
  },
  {
    id: 'demon_path_choice',
    title: '心魔岔路',
    description: '宗门暗流令你的心魔越发躁动。有人递来一卷魔功，许诺不必再受门规束缚。你尚能握住自己的道心：痛苦可以成为诱因，却不能替你作出决定。',
    weight: 10, years: 0, once: true,
    conditions: [{ type: 'route', route: 'sect' }, { type: 'stat', key: 'demonHeart', min: 30 }],
    choices: [
      { id: 'resist', text: '毁去魔卷，继续守住道心', narrative: '你将魔卷投入炉火。心魔仍在，但你决定正面面对它，继续留在宗门。', effects: [{ type: 'stat', key: 'demonHeart', value: -8 }] },
      { id: 'accept', text: '收下魔功，离宗入魔', narrative: '你亲手解开魔卷封印，决意离宗修魔。前路的代价，你已无法推给任何人。', effects: [{ type: 'route', route: 'demon' }, { type: 'stat', key: 'demonHeart', value: 10 }] },
    ],
  },
  {
    id: 'wander_sect_invitation',
    title: '山门再邀',
    description: '你救助凡人的事迹传到天玄宗。一位长老带来客卿之邀，愿让你随宗门弟子参与秘境历练。你可以接受这份庇护，也可以继续独行；善行不意味着必须归附宗门。',
    weight: 10, years: 0, once: true,
    conditions: [{ type: 'route', route: 'wander' }, { type: 'stat', key: 'karma', min: 40 }, { type: 'stat', key: 'demonHeart', max: 10 }],
    choices: [
      { id: 'decline', text: '谢过好意，仍愿独行', narrative: '你婉拒客卿之邀。长老尊重你的决定，约定日后仍可守望相助。', effects: [{ type: 'flag', key: 'declined_sect_invitation', value: true }] },
      { id: 'join', text: '接受邀请，以客卿身份同行', narrative: '你接过客卿令牌，约定与宗门弟子一同探索秘境。散修岁月没有被抹去，只是道路有了新的同行者。', effects: [{ type: 'route', route: 'sect', chapter: 'sect_5' }] },
    ],
  },
  {
    id: 'demon_redemption_choice',
    title: '回头之路',
    description: '你救下的村民愿为你作证，天玄宗也递来消息：若愿停止修习魔功，可在宗门大战中护佑百姓，以行动偿还旧债。善念重新萌发，去留却仍由你决定。',
    weight: 10, years: 0, once: true,
    conditions: [{ type: 'route', route: 'demon' }, { type: 'stat', key: 'demonHeart', max: 15 }, { type: 'stat', key: 'karma', min: 25 }],
    choices: [
      { id: 'stay', text: '留在魔道，按自己的原则修行', narrative: '你谢过来使，决定留在魔道约束自己。修习何种功法，不该成为伤害无辜的借口。', effects: [{ type: 'flag', key: 'demon_self_restraint', value: true }] },
      { id: 'redeem', text: '接受赎罪之约，援助天玄宗', narrative: '你封起魔卷，随来使赶赴战场。宗门尚未全然信任你，你愿先以护佑百姓的行动作答。', effects: [{ type: 'route', route: 'sect', chapter: 'sect_7' }] },
    ],
  },
  {
    id: 'companion_abandonment',
    title: '归来无灯',
    description: '你从秘境归来，道侣虽靠护身玉符勉强渡过雷劫，却伤了根基。洞府的灯没有为你亮起。她问：「机缘可以再等，我的性命在你心里，究竟值多少？」你必须面对离去的后果。',
    weight: 10, years: 1, once: true, priority: 'consequence', followUpOf: ['time_window'],
    conditions: [{ type: 'flag', key: 'abandoned_companion', value: true }, { type: 'flag', key: 'has_companion', value: true }],
    choices: [
      {
        id: 'repair', text: '购药疗伤，分担反噬，请求重建信任',
        requirements: [{ type: 'resource', key: 'spiritStones', min: 60 }],
        narrative: '你用秘境所得换来灵药，以自身精血替她温养受损经脉。她愿给你一次重新守约的机会，却不会忘记这次缺席。',
        effects: [{ type: 'spiritStones', value: -60 }, { type: 'lifespan', value: -10 }, { type: 'flag', key: 'companion_estranged', value: false }, { type: 'flag', key: 'companion_trust_rebuilt', value: true }],
      },
      {
        id: 'part', text: '承认无法相守，放她离去',
        narrative: '你承认自己的选择辜负了誓言。她收起传音符，从此不再与你共修；洞府中的空位，成了你无法用机缘填补的代价。',
        effects: [{ type: 'flag', key: 'has_companion', value: false }, { type: 'flag', key: 'companion_estranged', value: false }, { type: 'flag', key: 'companion_parted', value: true }, { type: 'stat', key: 'demonHeart', value: 8 }],
      },
    ],
  },
  {
    id: 'spy_counterplot',
    title: '反间回响',
    description: '道侣将你们拟好的假情报送往苍穹阁，对方果然派人前来接应。你们已有机会截断这条暗线，但一旦行动，她的身份也将暴露。她把最后的决定交给你：「这一次，我希望自己也能选择。」',
    weight: 10, years: 1, once: true, priority: 'consequence', followUpOf: ['spy_companion'],
    conditions: [{ type: 'flag', key: 'turned_spy', value: true }, { type: 'flag', key: 'has_companion', value: true }, { type: 'flag', key: 'su_qing_companion', value: true }],
    choices: [
      {
        id: 'expose', text: '与她商定退路，再公开暗线证据',
        narrative: '你们先安排好撤离之路，再将联络玉简交给受害的修士。苍穹阁的暗线被揭破，她也摆脱了旧日控制。此后你们的关系有了新的起点。',
        effects: [{ type: 'flag', key: 'counterplot_succeeded', value: true }, { type: 'flag', key: 'spy_aftermath_resolved', value: true }, { type: 'flag', key: 'spy_hero', value: true }, { type: 'spiritStones', value: 35 }, { type: 'stat', key: 'karma', value: 10 }],
      },
      {
        id: 'withdraw', text: '放弃诱捕，护她摆脱苍穹阁',
        narrative: '你们毁去联络玉简，带着仅有的证据避开接头人。暗线尚在，但她终于不必再以暗桩的身份活着。',
        effects: [{ type: 'flag', key: 'turned_spy', value: false }, { type: 'flag', key: 'forgave_spy', value: true }, { type: 'flag', key: 'spy_aftermath_resolved', value: true }, { type: 'spiritStones', value: -20 }, { type: 'stat', key: 'demonHeart', value: -5 }],
      },
    ],
  },
  {
    id: 'sect_sacrifice_aftermath',
    title: '阵后余声',
    description: '禁术大阵压住了劫潮，被献祭弟子的命牌却一枚枚碎裂。山门保住了，遗属在殿前追问亲人的下落。长老让你替宗门说话，你终于看清了「牺牲少数」具体意味着什么。',
    weight: 10, years: 1, once: true, priority: 'consequence', followUpOf: ['sect_choice'],
    conditions: [{ type: 'flag', key: 'chose_sacrifice', value: true }],
    choices: [
      {
        id: 'confess', text: '公开真相，承担责任并安置遗属',
        narrative: '你向遗属说明献祭真相，承认自己曾支持计划。有人接受补偿，有人始终不肯原谅。你推动宗门废止以弟子为祭的禁术，亡者却已无法回来。',
        effects: [{ type: 'spiritStones', value: -40 }, { type: 'flag', key: 'sect_sacrifice_accountable', value: true }, { type: 'flag', key: 'sect_choice_resolved', value: true }, { type: 'stat', key: 'karma', value: 8 }, { type: 'stat', key: 'demonHeart', value: -5 }],
      },
      {
        id: 'conceal', text: '隐瞒献祭，维护宗门名声',
        narrative: '你宣称弟子们死于劫潮，为宗门换来片刻安宁。遗属的哭声却时时在梦中响起，你与宗门共同背负了这场谎言。',
        effects: [{ type: 'flag', key: 'sect_sacrifice_concealed', value: true }, { type: 'flag', key: 'sect_choice_resolved', value: true }, { type: 'stat', key: 'karma', value: -15 }, { type: 'stat', key: 'demonHeart', value: 12 }],
      },
    ],
  },
  {
    id: 'sect_alternative_plan',
    title: '另一条生路',
    description: '你阻止了以弟子为祭的计划，劫潮却没有停下。阵堂提出一条艰难的替代方案：疏散山下凡人，以修士精血和灵石共同维持护阵。没有人必须被献祭，但拒绝禁术的人也需要承担代价。',
    weight: 10, years: 1, once: true, priority: 'consequence', followUpOf: ['sect_choice'],
    conditions: [{ type: 'flag', key: 'chose_righteous', value: true }],
    choices: [
      {
        id: 'guard', text: '以自身精血护阵，为撤离争取时间',
        narrative: '你站上阵眼，以自身精血接续断裂的灵流。山下凡人和低阶弟子陆续撤离，护阵最终熄灭，却没有一人被当作祭品。你因此伤了寿元，也守住了自己的原则。',
        effects: [{ type: 'lifespan', value: -15 }, { type: 'flag', key: 'sect_saved_without_sacrifice', value: true }, { type: 'flag', key: 'sect_choice_resolved', value: true }, { type: 'stat', key: 'karma', value: 15 }],
      },
      {
        id: 'evacuate', text: '放弃山门，组织众人撤离',
        narrative: '你拒绝再把人命与山门一同押上，带领凡人与弟子撤离。部分殿宇毁于劫潮，活下来的人却保住了重建宗门的希望。',
        effects: [{ type: 'spiritStones', value: -25 }, { type: 'flag', key: 'sect_evacuated', value: true }, { type: 'flag', key: 'sect_choice_resolved', value: true }, { type: 'stat', key: 'karma', value: 10 }],
      },
    ],
  },
]
