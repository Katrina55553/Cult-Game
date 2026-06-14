export interface ArtifactInfo {
  name: string
  description: string
  bonus?: string
}

export const ARTIFACTS: Record<string, ArtifactInfo> = {
  ancient_sword: { name: '古剑', description: '一柄锈迹斑斑的古剑，剑身隐有灵光流转。', bonus: '攻击时有概率触发剑气' },
  spirit_pendant: { name: '灵玉佩', description: '温润如玉的灵佩，佩戴后心神安宁。', bonus: '气运+5' },
  jade_slip: { name: '传承玉简', description: '上古修士遗留的玉简，内藏功法残篇。', bonus: '悟性+3' },
  realm_token: { name: '秘境令牌', description: '开启秘境的钥匙，令牌上刻着古老的符文。', bonus: '可反复进入秘境' },
  sect_seal: { name: '掌门信印', description: '天玄宗掌门信印，象征宗门最高权力。', bonus: '因果+10，宗门事件加成' },
  combo_scroll: { name: '合击秘卷', description: '记载合击秘法的卷轴，需道侣共同修炼。', bonus: '双修成功率+15%' },
  frost_sword: { name: '寒魄古剑', description: '剑冢深处取得的古剑，剑身通体雪白，寒气逼人。', bonus: '根骨+5' },
  ancient_seal: { name: '上古封印', description: '上古修士留下的封印法宝，可镇压邪祟。', bonus: '心魔-10' },
  dungeon_relic: { name: '秘境遗宝', description: '秘境深处古修遗留的宝物，灵光内敛。', bonus: '修为获取+10%' },
  demon_relic: { name: '远古魔宝', description: '远古魔修遗留的法宝，魔气森然。', bonus: '心魔+5，根骨+3' },
  golem_core: { name: '傀儡核心', description: '上古傀儡的核心，蕴含机械之力。', bonus: '阵法+1' },
  turtle_shell: { name: '玄龟甲', description: '千年玄龟的甲壳，坚不可摧。', bonus: '根骨+8' },
  puppet_army: { name: '傀儡军团', description: '由数百尊傀儡组成的军团，可为你而战。', bonus: '战斗成功率+10%' },
  stolen_puppet: { name: '偷来的傀儡', description: '从傀儡师处偷来的傀儡，机关精巧。', bonus: '悟性+2' },
  basic_puppet: { name: '初阶傀儡', description: '最基本的傀儡，可执行简单指令。', bonus: '根骨+2' },
  mid_puppet: { name: '中阶傀儡', description: '中阶傀儡，战斗力不俗。', bonus: '根骨+4' },
  reforged_weapon: { name: '重铸法宝', description: '以天外陨铁重铸的法宝，品质大进。', bonus: '根骨+5' },
  dungeon_sword: { name: '秘境灵剑', description: '秘境中取得的灵剑，剑气凌厉。', bonus: '根骨+4' },
  star_iron: { name: '星辰陨铁', description: '天外陨铁，蕴含星辰之力，是炼器至宝。', bonus: '可用于重铸法宝' },
  void_artifact: { name: '异界法宝', description: '来自虚空裂缝另一侧的法宝，材质未知。', bonus: '悟性+8' },
  mysterious_artifact: { name: '神秘法宝', description: '来历不明的法宝，灵光闪烁。', bonus: '气运+3' },
  tomb_relic: { name: '古修遗宝', description: '古修墓穴中取得的宝物，灵气充沛。', bonus: '修为+10' },
  realm_treasure: { name: '秘境灵宝', description: '秘境中发现的灵宝，宝光四射。', bonus: '灵石获取+20%' },
  ancient_ring: { name: '大能遗戒', description: '大能修士遗留的储物戒，内藏乾坤。', bonus: '灵石+50' },
  soul_blade: { name: '本命神兵·青霜', description: '以本命精血铸就的神兵，与你心意相通。', bonus: '根骨+6，战斗加成' },
  forged_blade: { name: '灵铸神兵', description: '由炼器大师代铸的神兵，品质上乘。', bonus: '根骨+4' },
  fire_forged_blade: { name: '地火玄刃', description: '以地火熔炉锻造的神兵，蕴含火属性灵力。', bonus: '根骨+5' },
  ancient_thunder_sword: { name: '太古雷剑', description: '古战场中取得的雷剑，剑身雷纹流转。', bonus: '根骨+7，雷属性加成' },
  star_iron_sword: { name: '星辰铁剑', description: '以天外陨铁铸成的铁剑，剑身星光流转，威力不凡。', bonus: '根骨+3' },
  star_iron_weapon: { name: '星辰法宝', description: '由炼器大师以天外陨铁锻造的法宝，品质上乘。', bonus: '根骨+5' },
  inheritance_seal: { name: '大能传承印', description: '化神期大能遗留的传承法印，内藏毕生修为感悟。', bonus: '悟性+8' },
  meteor_blade: { name: '陨星短刃', description: '以天外陨铁淬炼的短刃，星光流转。', bonus: '根骨+2' },
  spatial_ring: { name: '上古空间戒', description: '上古传送阵中取得的空间戒指，内藏乾坤。', bonus: '灵石+80' },
  spirit_sword: { name: '灵纹短剑', description: '坊市购得的灵纹短剑，轻巧锋利。', bonus: '根骨+2' },
}

export function formatArtifactName(value: string): string {
  return ARTIFACTS[value]?.name ?? value
}

export function resolveArtifactLabel(id: string, name?: string): string {
  return name ?? ARTIFACTS[id]?.name ?? id
}

export function getArtifactInfo(id: string): ArtifactInfo {
  return ARTIFACTS[id] ?? { name: id, description: '未知法宝' }
}
