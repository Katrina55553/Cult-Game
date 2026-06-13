# 修仙模拟器

> 一款文字修仙 Roguelike 游戏，每一次抉择皆关机缘。

**在线体验** → https://katrina55553.github.io/Cult-Game/

## 简介

你是一名初入仙途的修士，从拜入宗门开始，经历修炼、奇遇、渡劫、抉择，最终走向属于你的结局。

- **69 个事件** — 主线剧情、情缘支线、修炼体系、随机奇遇
- **16 种结局** — 飞升成仙、堕魔陨落、神仙眷侣、凡人善终……
- **42 个成就** — 包含隐藏成就等待发掘
- **10 种出身** — 每种出身带来不同的起始加成
- **每日天命** — 每日固定种子，与天下修士同台较量

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
