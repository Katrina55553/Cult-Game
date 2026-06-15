# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

修仙模拟器 (Cultivation Simulator) — a single-page text-based Roguelike RPG set in a Chinese xianxia universe. React 19 + TypeScript 6 + Vite 8 + Tailwind CSS 4. All UI text is in Chinese. Deployed to GitHub Pages and Gitee Pages.

Live: https://katrina55553.github.io/Cult-Game/

## Commands

| Task | Command |
|------|---------|
| Dev server | `npm run dev` |
| Typecheck + build | `npm run build` (`tsc -b` then `vite build`) |
| Lint | `npm run lint` |
| Preview production | `npm run preview` |
| Automated playtest | `npx tsx scripts/playtest.ts` |

No test framework installed — verification is lint + typecheck + build + playtest.

## Architecture

```
src/
  engine/       Pure game logic — zero React/DOM dependencies
  data/         Static game content (events, chapters, endings, realms, items, spirit roots, artifacts)
  components/   React UI components (one per screen/panel)
  hooks/        useGame.ts — single state hook owning GameSession
  types/        game.ts — ALL shared types live here
  audio/        Procedural Web Audio API sounds (effects only)
  styles/       Tailwind v4 with @theme custom tokens in index.css
```

### Data flow

`App.tsx` renders based on `session.phase` (start → lore → root_reveal → playing → shop → ending). No router — single-component conditional render. All state mutations flow through `useGame()`, which calls pure engine functions and auto-persists to `localStorage`.

### Chapter system

The game uses a **chapter-based event system**. Three routes with independent chapter sequences:

- **Sect** (9 chapters): 入门 → 修行 → 崭露头角 → 天骄之争 → 秘境探索 → 情缘与暗流 → 宗门大战 → 突破之路 → 终局
- **Wander** (6 chapters): 独行 → 求生 → 声名渐起 → 散修之路 → 探索 → 终局
- **Demon** (4 chapters): 入魔 → 堕落 → 魔道势力 → 终局

Each chapter has `events` (main, must complete), `sideEvents` (optional), `intro` (scene text), and optional `branchNext` for route switching. `eventPicker.ts` selects: main events → side events → filler events.

### Key engine files

- `gameEngine.ts` — create/load/save, resolve choices, chapter progression, route switching
- `eventPicker.ts` — chapter-based event selection with filler fallback
- `effects.ts` / `conditions.ts` — apply and check `Effect[]`/`Condition[]` discriminated unions
- `storylineTracker.ts` — computes storyline progress from player flags
- `novelExporter.ts` — exports playthrough as formatted novel text

### UI system

Four modal buttons in StatusPanel: 📊属性, ⚔修炼, 👜乾坤袋, 📜剧情线

Modals use `createPortal` to `document.body` and support ESC key. InventoryModal has clickable items with detail views. StorylinePanel tracks 12 storyline arcs.

Ending screen has novel export (📖 导出为小说) that compiles the full playthrough into a structured text file.

## Conventions

- **No path aliases** — all imports use relative paths
- **Tailwind v4** — `@import "tailwindcss"` and `@theme {}` directive, no `tailwind.config.js`
- **Dark theme only** — `color-scheme: dark` on `<html>`
- **Fonts** — `Ma Shan Zheng` (display), `Noto Serif SC` (body), loaded via Google Fonts
- **TypeScript** — `erasableSyntaxOnly` (no `enum`/`namespace`), `verbatimModuleSyntax`, `noUnusedLocals`, `noUnusedParameters`
- **ESLint flat config** — `eslint.config.js` with `typescript-eslint` (not type-aware). `dist/` ignored
- **Component pattern** — named exports, props typed with inline `interface Props`, no default exports except `App`
- **No comments** unless complexity demands it

## Gotchas

- `npm run build` **fails if typecheck fails** — `tsc -b` runs first
- Deploy sets `GITHUB_PAGES=true` or `GITEE_PAGES=true`, changing Vite `base` to `/Cult-Game/`
- `erasableSyntaxOnly` means no `enum` or `namespace` — use `type` unions and plain objects
- `scripts/` uses `tsx` (not in deps — use `npx tsx`)
- Adding new `Condition` or `Effect` variants requires updating types in `types/game.ts` AND the handler
- Adding new artifact IDs in events requires registering them in `data/artifacts.ts` ARTIFACTS map
- Chapter events should NOT have realm conditions — chapter order controls pacing, not realm gates
- `checkCondition` default returns `false` — unknown condition types are rejected

See [AGENTS.md](AGENTS.md) for additional architecture details and engine internals.
