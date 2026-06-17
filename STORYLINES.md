# 修仙模拟器 · 全剧情线整理

> 本文档整理了游戏中所有事件剧情，按故事线分类。

## 数据总览

| 文件 | 变量 | 事件数 |
|------|------|--------|
| `events.ts` | `CORE_EVENTS` | 31 |
| `eventsRomance.ts` | `ROMANCE_EVENTS` | 11 |
| `eventsSystems.ts` | `SYSTEM_EVENTS` | 16 |
| `eventsSect.ts` | `SECT_EVENTS` | 22 |
| `eventsWander.ts` | `WANDER_EVENTS` | 13 |
| `eventsCharacter.ts` | `CHARACTER_EVENTS` | 17 |
| `eventsSecret.ts` | `SECRET_EVENTS` | 13 |
| `eventsBoss.ts` | `BOSS_EVENTS` | 8 |
| `eventsCraft.ts` | `CRAFT_EVENTS` | 10 |
| `eventsMisc.ts` | `MISC_EVENTS` | 60+ |
| **总计** | | **~200+** |

---

## 1. 宗门主线

**触发条件**：`enter_sect` 选择「坦然展露灵根」→ 设置 `loyal_to_sect = true`

### 流程

```
入山问道 → 拜师问道 → 初领宗门任务 → 首次斗法 → 外门琐务
→ 长老授业 → 内门试炼 → 门内比武 → 禁地藏书阁
→ 天骄挑衅 → 宗门争锋 → 宗门结盟 → 宗门叛逃
→ 宗门灭门危机 → 宗门大战 → 掌门传承
```

### 事件列表

| ID | 标题 | 权重 | 条件 | 关键 Flag |
|---|---|---|---|---|
| `enter_sect` | 入山问道 | 100 | 无 | `loyal_to_sect` |
| `outer_sect_life` | 外门琐务 | 25 | `loyal_to_sect` | — |
| `mentor_assign` | 拜师问道 | 30 | `loyal_to_sect` | `sword_disciple` / `alchemy_disciple` |
| `first_mission` | 初领宗门任务 | 28 | `loyal_to_sect` | — |
| `first_duel` | 首次斗法 | 14 | `loyal_to_sect` | — |
| `elder_lecture` | 长老授业 | 9 | `loyal_to_sect` | `became_elder`（请教时） |
| `inner_sect_trial` | 内门试炼 | 22 | `loyal_to_sect` | `inner_disciple` |
| `sect_tournament` | 门内比武 | 12 | `loyal_to_sect` | `became_elder`（获胜时） |
| `forbidden_library` | 禁地藏书阁 | 7 | `loyal_to_sect` | `read_forbidden` |
| `elder_confession` | 长老秘辛 | 8 | `loyal_to_sect` | `fortified_seal` |
| `sect_politics` | 宗门暗流 | 8 | `loyal_to_sect` | `peace_faction` / `war_faction` |
| `sect_battlefield` | 宗门争锋 | 6 | `foundation` + `loyal_to_sect` | `sect_battle_hero` |
| `sect_alliance` | 宗门结盟 | 5 | `loyal_to_sect` | `spy_hero` |
| `sect_betrayal` | 宗门叛逃 | 10 | `loyal_to_sect` | `became_elder` / `refused_all_sects` |
| `sect_crisis` | 宗门灭门危机 | 9 | `loyal_to_sect` | `became_elder` |
| `sect_war` | 宗门大战 | 8 | `loyal_to_sect` | `war_hero` / `war_strategist` |
| `sect_master_legacy` | 掌门传承 | 8 | `loyal_to_sect` + `became_elder` | `sect_master` |
| `moyu_invasion` | 魔域入侵 | 6 | `loyal_to_sect` | `moyu_war_hero` |

### 宗门外交事件

| ID | 标题 | 势力 | 条件 |
|---|---|---|---|
| `rival_provocation` | 天骄挑衅 | 苍穹阁 | `loyal_to_sect` |
| `rival_ambush` | 仇家伏击 | 苍穹阁 | `beat_rival` + `foundation` |
| `qinglian_visit` | 青莲剑宗来访 | 青莲剑宗 | `loyal_to_sect` + `qi_refining_2` |
| `qinglian_tournament` | 青莲论剑 | 青莲剑宗 | `foundation` + `loyal_to_sect` |
| `qinglian_mentor` | 青莲前辈 | 青莲剑宗 | `qinglian_friend` + `swordTier ≥ 1` |
| `yaogu_trade` | 药谷交易 | 药谷 | `loyal_to_sect` |
| `yaogu_plague` | 药谷求援 | 药谷 | `qi_refining_3` + `loyal_to_sect` |
| `yaogu_legacy` | 药谷传承 | 药谷 | `yaogu_ally` |
| `guiyi_visit` | 归一寺讲禅 | 归一寺 | `loyal_to_sect` |
| `guiyi_seal` | 归一封魔 | 归一寺 | `foundation` + `loyal_to_sect` |
| `guiyi_enlightenment` | 归一禅悟 | 归一寺 | `guiyi_ally` |
| `wanyao_encounter` | 万妖殿使者 | 万妖殿 | `loyal_to_sect` + `foundation` |
| `wanyao_trade` | 万妖殿交易 | 万妖殿 | `qi_refining_2` |
| `wanyao_crisis` | 万妖殿内乱 | 万妖殿 | `foundation` + `loyal_to_sect` |
| `sect_exchange` | 宗门交流 | 多势力 | `loyal_to_sect` + `qi_refining_3` |

---

## 2. 散修线

**触发条件**：`enter_sect` 选择「拒入宗门」→ 设置 `refused_all_sects = true`

### 流程

```
散修坊市 → 散修之危 → 散修前辈 → 散修同行
→ 散修洞府 → 荒野求生 → 散修商路 → 散修之名
→ 散修围剿 → 流民求助 → 悬壶济世 → 散修大会
→ 荒废宗门 → 孤狼传说 → 独行渡劫
```

### 事件列表

| ID | 标题 | 条件 |
|---|---|---|
| `wander_market` | 散修坊市 | `refused_all_sects` |
| `wander_danger` | 散修之危 | `refused_all_sects` |
| `wander_hermit` | 散修前辈 | `refused_all_sects` |
| `wander_companion` | 散修同行 | `refused_all_sects` |
| `wander_cave` | 散修洞府 | `refused_all_sects` |
| `wander_wilderness` | 荒野求生 | `refused_all_sects` |
| `wander_trade` | 散修商路 | `refused_all_sects` |
| `wander_reputation` | 散修之名 | `refused_all_sects` + `foundation` |
| `wander_crisis` | 散修围剿 | `refused_all_sects` + `foundation` |
| `wander_refugee` | 流民求助 | `refused_all_sects` |
| `wander_medical` | 悬壶济世 | `refused_all_sects` |
| `wander_festival` | 散修大会 | `refused_all_sects` + `qi_refining_2` |
| `wander_ancient_site` | 荒废宗门 | `refused_all_sects` |
| `wander_lone_wolf` | 孤狼传说 | `refused_all_sects` |
| `solo_tribulation` | 独行渡劫 | `refused_all_sects` |
| `market_duel` | 坊市争霸 | `refused_all_sects` |

---

## 3. 魔道线

**触发条件**：多种方式设置 `accepted_demon_path = true`

| 进入方式 | 事件 | 选择 |
|---|---|---|
| 心魔萌动 | `demon_whisper` | 「侧耳倾听」（失败时） |
| 魔修引诱 | `demon_temptation` | 「纳受魔功」 |
| 心魔大劫 | `demon_tribulation` | 「与心魔合一」 |
| 飞升抉择 | `final_choice` | 「以魔证道」 |
| 魔道血祭 | `blood_sacrifice` | 「参与血祭」 |

### 事件列表

| ID | 标题 | 条件 |
|---|---|---|
| `demon_cultivation` | 魔功初成 | `accepted_demon_path` |
| `demon_territory` | 魔域探索 | `accepted_demon_path` |
| `demon_alchemist` | 魔道丹师 | `accepted_demon_path` |
| `demon_conscience` | 魔心动摇 | `accepted_demon_path` |
| `blood_sacrifice` | 魔道血祭 | `demonHeart ≥ 30` |
| `demon_lord_offer` | 魔尊招揽 | `accepted_demon_path` + 金丹期 |
| `righteous_siege` | 正道围剿 | `accepted_demon_path` + `golden_core` |

---

## 4. 情缘线

### 沈霜凝线

```
路遇佳人 (beauty_rescue) → 佳人答谢 (beauty_gratitude)
→ 月下双修 (dual_cultivation) → 道侣共渡劫 (companion_tribulation)
→ 眷侣证道 (lovers_ascension)
```

支线：道侣真相 (spy_companion) / 百年一遇 (time_window) / 道侣反目 (lover_jealousy) / 情敌现身 (rival_beauty)

### 叶轻眉线

```
灵泉偶遇 (jade_pool_encounter) → 再遇叶轻眉 (ye_qingmei_reunion)
→ 叶轻眉求助 (ye_qingmei_help)
```

### 关键 Flag 链

| Flag | 设置于 | 作用 |
|---|---|---|
| `met_su_qing` | `beauty_rescue` | 触发沈霜凝事件 |
| `rescued_beauty` | `beauty_rescue` | 答谢事件前置 |
| `has_companion` | `beauty_gratitude` | 道侣激活 |
| `su_qing_companion` | `beauty_gratitude` | 沈霜凝专属 |
| `dual_cultivation_mastered` | `dual_cultivation` | 双修大成 |
| `survived_together` | `companion_tribulation` | 共渡天劫 |
| `met_lin_wanyue` | `jade_pool_encounter` | 叶轻眉相识 |
| `has_mysterious_origin` | 出身设置 | 身世之谜前置 |

---

## 5. NPC 关系线

### 墨离线（神秘魔修）

**友好线**：
```
秘境黑影 (mysterious_demon_first) → 再遇墨离 (mysterious_demon_second)
→ 墨离之邀 (mysterious_demon_third) → 墨离往事 (moli_backstory)
→ 墨离挡刀 (moli_sacrifice)
```

**敌对线**：
```
秘境黑影（偷袭）→ 墨离索命 (moli_revenge)
```

### 林远线（同门挚友）

```
同门之谊 (sect_friend) → 林远突破 (lin_yuan_breakthrough)
→ 林远报恩 (lin_yuan_rescue)
```

### 苏暮烟线（师姐）

```
师姐指教 (su_muyan_teach) → 师姐之危 (su_muyan_crisis)
→ 师姐往事 (su_muyan_past)
```

### 赵天行线（宿敌→和解）

```
同门暗算 (peer_trap) → 赵天行报复 (zhao_tianxing_revenge)
→ 赵天行约战 (zhao_tianxing_duel) → 赵天行悔过 (zhao_tianxing_redemption)
→ 赵天行的真相 (zhao_truth)
```

### 联动事件

| 事件 | 条件 |
|---|---|
| 三人同游 (three_friends) | `lin_yuan_ally` + `su_muyan_ally` |
| 竞争对手的善意 (rival_kindness) | `beat_zhao` + `foundation` |
| 前辈的真面目 (elder_suspicion) | `qi_refining_3` |

---

## 6. 修炼体系

### 路径选择

| 事件 | 选择 | 效果 |
|---|---|---|
| 修行歧路 (cultivation_path) | 炼体/法修/均衡 | 设置路径 + 初始功法 |
| 天赋觉醒·战 (talent_combat) | 剑心/铁骨/敏捷 | 战斗天赋 |
| 天赋觉醒·道 (talent_utility) | 丹道/阵法/灵兽 | 辅助天赋 |
| 天赋觉醒·命 (talent_fate) | 鸿运/编织/长生 | 命运天赋 |

### 修炼进度

| 体系 | 事件 | 进阶方式 |
|---|---|---|
| 剑道 | `sword_enlightenment`(×3), `sword_trial` | `swordTier++` |
| 阵法 | `formation_study`, `realm_formation`, `ancient_formation` | `formationTier++` |
| 丹道 | `herb_gather`, `alchemy_workshop`(×2), `alchemy_master` | `alchemyTier++` + `mastered_alchemy` |
| 血脉 | `bloodline_awakening`, `bloodline_resonance`(×2) | `bloodlineTier++` |
| 神识 | `divine_sense_trial`(×2) | `divineSense++` |
| 神兵 | `divine_weapon_forge`, `weapon_reforge`(×2) | `divineWeaponTier++` |
| 功法 | `technique_pavilion`, `technique_fusion`(×2) | `techniqueTier++` |
| 灵兽 | `spirit_beast_train`(×3) | `spiritBeast.tier++` |

---

## 7. 秘境探索

### 副本流程

```
秘境入口 → 秘境分岔
├── 战斗通道 → 秘境试炼·战 → 秘境之主
├── 宝物通道 → 秘境试炼·宝 → 秘境之主
└── 悟道通道 → 秘境试炼·悟 → 秘境之主
```

### 其他秘境事件

| ID | 标题 | 条件 |
|---|---|---|
| `secret_realm_treasure` | 秘境夺宝 | `foundation` 期 |
| `ancient_ruins_deep` | 遗迹深处 | `golden` 期 |
| `realm_formation` | 秘境阵眼 | `foundation` 期 |
| `floating_isle` | 浮空残岛 | 稀有 |
| `spirit_crane` | 云中灵鹤 | `qi_refining_2` |
| `spirit_turtle` | 玄潭老龟 | `foundation` |
| `fire_tiger` | 赤焰幼虎 | `qi_refining_3` |
| `secret_realm` | 洞天现世 | 无 |

---

## 8. Boss 战

| ID | 标题 | 境界要求 | 胜率 | 关键奖励 |
|---|---|---|---|---|
| `boss_wolf_king` | 妖狼王 | 炼气二阶 | 45%/60% | `slayed_wolf_king` |
| `boss_shadow_assassin` | 暗影刺客 | 炼气三阶 | 50% | `survived_assassin` |
| `boss_demon_general` | 血魔将 | 筑基+宗门 | 40%/60% | `slayed_demon_general` |
| `boss_ancient_golem` | 上古傀儡 | 筑基 | 35% | `defeated_golem` + 傀儡核心 |
| `boss_spider_queen` | 蛛后妖巢 | 筑基 | 45% | `slayed_spider_queen` |
| `boss_thunder_beast` | 雷兽降世 | 金丹 | 35% | `slayed_thunder_beast` |
| `boss_ice_wyrm` | 冰螭降世 | 金丹 | 35% | `slayed_ice_wyrm` |
| `boss_demon_lord` | 魔尊化身 | 元婴 | 30% | `defeated_demon_lord` |

---

## 9. 炼器/傀儡

### 炼丹链

```
采药遇险 → 开炉炼丹 → 炼丹悟道（九转金丹）
丹道比试 / 丹毒之祸 / 灵药奇遇 / 古丹残方
```

### 傀儡链

```
傀儡工坊 → 傀儡斗法 → 傀儡军团
```

### 炼器链

```
铸炼神兵 → 神兵重铸 / 法宝重铸 → 器灵觉醒
炼器大会 / 地火熔炉 / 天材地宝
```

---

## 10. 连锁剧情（10 条）

### ① 灵狐报恩

```
山间灵兽（救灵狐）→ 灵狐报恩 → 灵狐引路 → 灵狐化形
```

### ② 古老预言

```
古老预言 → 神器线索·一 → 神器线索·二 → 预言抉择
```

### ③ 身世之谜

```
身世线索 → 身世真相 → 命运抉择
```

### ④ 正魔之争

```
宗门暗流 → 真相大白 → 宗门抉择
```

### ⑤ 散修盟崛起

```
散修盟成立 → 散修盟危机 → 散修盟传奇
```

### ⑥ 魔道觉醒

```
魔道觉醒 → 魔道真相 → 魔道超越
```

### ⑦ 师徒传承

```
师尊之托 → 师叔的秘密 → 师徒传承
```

### ⑧ 灵脉秘境

```
灵脉发现 → 灵脉守护者 → 灵脉丰收
```

### ⑨ 古战场遗迹

```
战场记忆 → 战场真相 → 战场遗产
```

### ⑩ 道侣同心

```
道侣之梦 → 道侣试炼 → 道侣永恒
```

---

## 11. 天象奇遇（稀有/传说）

| ID | 标题 | 稀有度 |
|---|---|---|
| `immortal_guidance` | 仙人指路 | 传说 |
| `past_life_memory` | 前世记忆 | 传说 |
| `celestial_phenomenon` | 天象异变 | 传说 |
| `ice_phoenix` | 冰凤现身 | 传说 |
| `explore_void_rift` | 虚空裂缝 | 传说 |
| `blood_moon` | 血月之夜 | 稀有 |
| `star_river` | 星河入梦 | 稀有 |
| `thunder_marsh` | 雷泽遗泽 | 稀有 |
| `upper_realm_rumor` | 上界传闻 | 稀有 |
| `meteor_iron` | 天外陨铁 | 稀有 |

---

## 12. 出身专属

| ID | 标题 | 出身 |
|---|---|---|
| `origin_noble_heirloom` | 世家遗物 | 世家遗孤 |
| `origin_merchant_contact` | 商路旧识 | 商贾世家 |
| `origin_farmer_homeland` | 故土重归 | 田园牧歌 |
| `origin_scholar_text` | 家传古籍 | 书香门第 |
| `origin_orphan_secret` | 弃婴之谜 | 宗门弃婴 |
| `origin_healer_plague` | 故人求药 | 悬壶济世 |
| `origin_tomb_revisit` | 古墓再探 | 墓中求生 |

---

## 13. 负面事件

| ID | 标题 | 风险 |
|---|---|---|
| `qi_deviation` | 走火入魔 | 修为-20，心魔+12，寿元-15 |
| `spirit_stone_theft` | 灵石失窃 | 灵石损失 |
| `senior_bullying` | 前辈欺压 | 法宝丢失，心魔+12 |
| `calamity_plague` | 灵瘟肆虐 | 修为-15，根骨-4，寿元-10 |
| `dao_heart_shaken` | 道心动摇 | 心魔+12 |
| `resource_conflict` | 灵脉之争 | 寿元-8 |
| `inner_demon` | 心魔幻境 | 心魔+10 |
| `demon_tribulation` | 心魔大劫 | 心魔+25 |

---

## 14. 日常/探索

### 可重复日常

| ID | 标题 | 冷却 |
|---|---|---|
| `daily_cultivation` | 静坐吐纳 | 8 |
| `daily_insight` | 观星悟道 | 10 |
| `market_rest` | 坊市小憩 | 4 |
| `daily_sparring` | 同门切磋 | 4 |
| `daily_scripture` | 藏经阁阅读 | 4 |

### 道德/哲学事件

| ID | 标题 | 主题 |
|---|---|---|
| `mortal_plight` | 凡人处境 | 修士斗法殃及凡人 |
| `spirit_stone_origin` | 灵石从哪来 | 灵石矿场的血汗 |
| `righteous_dark_side` | 正道暗面 | 正道宗门的黑暗面 |
| `demon_mercy` | 魔道的另一面 | 魔道未必全是恶 |
| `sever_ties` | 斩尘缘 | 断尘缘换修为 |
| `soul_possession` | 夺舍诱惑 | 上古残魂共体 |
| `half_marriage_scroll` | 半张婚书 | 幼时娃娃亲 |
| `letter_from_past` | 褪色的储物戒 | 三百年前母亲的信 |

---

## 关键 Flag 依赖图

### 路线分支 Flag

| Flag | 设置于 | 控制 |
|---|---|---|
| `loyal_to_sect` | `enter_sect`（坦诚） | 宗门线全部事件 |
| `refused_all_sects` | `enter_sect`（拒绝） | 散修线全部事件 |
| `accepted_demon_path` | 多个事件 | 魔道线全部事件 |

### 关系 Flag

| Flag | 设置于 | 控制 |
|---|---|---|
| `has_companion` | `beauty_gratitude` | 道侣事件 |
| `su_qing_companion` | `beauty_gratitude` | 沈霜凝专属 |
| `met_moli` | `mysterious_demon_first` | 墨离事件 |
| `moli_ally` | `mysterious_demon_second` | 墨离友好线 |
| `moli_enemy` | 多个背叛选择 | 墨끊敌对线 |

### 结局 Flag

| Flag | 触发事件 | 含义 |
|---|---|---|
| `chose_ascension` | `final_choice` | 飞升成仙 |
| `chose_stay` | `final_choice` | 留守人间 |
| `chose_lovers_ascension` | `lovers_ascension` | 携手飞升 |
| `chose_sacrifice` | `sect_choice` | 支持牺牲计划 |
| `chose_righteous` | `sect_choice` | 坚持正道 |
| `gave_up_cultivation` | `final_choice` | 弃绝仙途 |
| `died_in_tribulation` | `golden_tribulation` | 渡劫身死 |
| `sect_master` | `sect_master_legacy` | 接任掌门 |
| `demon_overlord` | `righteous_siege` | 魔尊称霸 |
