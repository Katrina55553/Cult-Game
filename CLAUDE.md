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
  engine/       Pure game logic — zero React/DOM dependencies. All functions are pure (immutable state transforms)
  data/         Static game content (events, endings, realms, items, spirit roots, storylines, artifacts)
  components/   React UI components (one per screen/panel)
  hooks/        useGame.ts — single state hook owning GameSession, bridges engine ↔ React
  types/        game.ts — ALL shared types live here (Condition, Effect, GameEvent, PlayerState, etc.)
  audio/        Procedural Web Audio API sounds — no audio files
  styles/       Tailwind v4 with @theme custom tokens in index.css
```

### Data flow

`App.tsx` renders based on `session.phase` (start → lore → root_reveal → playing → shop → ending). No router — single-component conditional render. All state mutations flow through `useGame()`, which calls pure engine functions and auto-persists to `localStorage`.

### Key engine files

- `gameEngine.ts` — create/load/save, resolve choices, purchase shop items, check endings, origin-specific flags
- `eventPicker.ts` — weighted random event selection with cooldowns, story groups, filler logic, behavior-based weight adjustment
- `effects.ts` / `conditions.ts` — apply and check `Effect[]`/`Condition[]` discriminated unions
- `rng.ts` — seed-based PRNG (LCG). `setSeed()` for deterministic mode, `getDailySeed()` for daily challenge
- `metaProgress.ts` — cross-run unlocks in `localStorage` under key `cultgame_meta`
- `storylineTracker.ts` — computes storyline progress from player flags

### Event content structure

Events are split across 10 data files and merged into a single `EVENTS` array in `events.ts`:
- `CORE_EVENTS` (events.ts) — main storyline
- `ROMANCE_EVENTS` (eventsRomance.ts) — romance subplot
- `SYSTEM_EVENTS` (eventsSystems.ts) — cultivation subsystems
- `SECT_EVENTS` (eventsSect.ts) — sect conflicts
- `WANDER_EVENTS` (eventsWander.ts) — wandering/hermit path
- `CHARACTER_EVENTS` (eventsCharacter.ts) — NPC interactions
- `SECRET_EVENTS` (eventsSecret.ts) — secret encounters
- `BOSS_EVENTS` (eventsBoss.ts) — boss fights
- `CRAFT_EVENTS` (eventsCraft.ts) — crafting
- `MISC_EVENTS` (eventsMisc.ts) — miscellaneous

### UI system

Four modal buttons in StatusPanel: 📊属性, ⚔修炼, 👜乾坤袋, 📜剧情线

- `AttributeModal` — stats, realm, age, lifespan, bloodline
- `CultivationModal` — cultivation path, tiers, techniques, divine weapons
- `InventoryModal` — spirit stones, beasts, techniques, weapons, artifacts, usable items (all clickable with detail views)
- `StorylinePanel` — 12 storyline progress trackers

Modals use `createPortal` to `document.body` to avoid stacking context issues.

## Conventions

- **No path aliases** — all imports use relative paths (`../engine/gameEngine`)
- **Tailwind v4** — `@import "tailwindcss"` and `@theme {}` directive, no `tailwind.config.js`
- **Dark theme only** — `color-scheme: dark` on `<html>`
- **Fonts** — `Ma Shan Zheng` (display), `Noto Serif SC` (body), loaded via Google Fonts
- **TypeScript** — `erasableSyntaxOnly` (no `enum`/`namespace`), `verbatimModuleSyntax` (use `import type` for type-only imports), `noUnusedLocals`, `noUnusedParameters`
- **ESLint flat config** — `eslint.config.js` with `typescript-eslint` (not type-aware). `dist/` ignored
- **Component pattern** — named exports, props typed with inline `interface Props`, no default exports except `App`
- **No comments** unless complexity demands it

## Gotchas

- `npm run build` **fails if typecheck fails** — `tsc -b` runs first
- Deploy sets `GITHUB_PAGES=true` or `GITEE_PAGES=true`, changing Vite `base` to `/Cult-Game/`. Local dev uses `/`
- `erasableSyntaxOnly` means no `enum` or `namespace` — use `type` unions and plain objects
- `scripts/` uses `tsx` (not in deps — use `npx tsx`). Scripts import from `../src/` directly
- Adding new `Condition` or `Effect` variants requires updating types in `types/game.ts` AND the handler in `conditions.ts` / `effects.ts`
- Adding new artifact IDs in events requires registering them in `data/artifacts.ts` ARTIFACTS map
- Game state auto-saves to `localStorage` on every change; clearing it resets the game

See [AGENTS.md](AGENTS.md) for additional architecture details and engine internals.
