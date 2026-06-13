# 修仙模拟器

> 一款文字修仙 Roguelike 游戏，每一次抉择皆关机缘。

**在线体验** → https://katrina55553.github.io/Cult-Game/

## 简介

你是一名初入仙途的修士，从拜入宗门开始，经历修炼、奇遇、渡劫、抉择，最终走向属于你的结局。

- **116 个事件** — 主线剧情、情缘支线、修炼体系、秘境寻宝、宗门对战、散修江湖
- **19 种结局** — 飞升成仙、剑道圣者、神仙眷侣、散修盟主、魔修挚友……
- **54 个成就** — 包含隐藏成就等待发掘
- **10 种出身** — 魔裔宿命、世家遗孤、隐世遗脉等，影响灵根品质
- **4 种灵宠** — 妖狼、灵鹤、玄龟、赤焰虎，最高可升至 3 阶
- **每日天命** — 每日固定种子，与天下修士同台较量

## 玩法特色

- **多线剧情** — 宗门线、散修线、情缘线、魔道线，各有专属事件和结局
- **概率抉择** — 气运属性影响所有概率型事件的成功率
- **属性系统** — 根骨、悟性、气运、因果、心魔五大属性相互制衡
- **修炼体系** — 剑道、丹道、阵法、神识、血脉、灵兽、神兵、功法八大分支
- **声望系统** — 与苍穹阁的恩怨纠葛，从秘境争锋到宗门对战

## 技术栈

- React 19 + TypeScript 6
- Vite 8
- Tailwind CSS 4
- Web Audio API（音效，无外部音频文件）
- localStorage 持久化存档

## 本地开发

```bash
npm install
npm run dev       # 启动开发服务器
npm run build     # 类型检查 + 生产构建
npm run lint      # ESLint 检查
npm run preview   # 预览生产构建
npx tsx scripts/playtest.ts  # 自动化试玩测试
```

## 项目结构

```
src/
  engine/       游戏引擎（纯逻辑，无 UI 依赖）
  data/         静态数据（事件、结局、物品、灵根）
  components/   React 组件
  hooks/        状态管理（useGame）
  types/        TypeScript 类型定义
  audio/        Web Audio 合成音效
  styles/       Tailwind 样式
scripts/        自动化测试脚本
```

## 部署

推送到 `main` 分支自动部署到 GitHub Pages。构建时设置 `GITHUB_PAGES=true` 环境变量，Vite 会将 `base` 设为 `/Cult-Game/`。

## License

MIT
