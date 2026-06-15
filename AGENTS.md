# AGENTS.md

## Project

修仙模拟器 (Cultivation Simulator) — a single-page text RPG built with React 19, TypeScript 6, Vite 8, and Tailwind CSS 4. All UI is in Chinese. Deployed to GitHub Pages (base path `/Cult-Game/`).

## Commands

| Task | Command |
|------|---------|
| Dev server | `npm run dev` |
| Typecheck + production build | `npm run build` (runs `tsc -b` then `vite build`) |
| Lint | `npm run lint` |
| Preview production build | `npm run preview` |
| Automated playtest | `npx tsx scripts/playtest.ts` |

There is **no test framework** installed. Verification is lint + typecheck + build + manual or automated playtest.

## Architecture

```
src/
  engine/       Pure game logic — no React, no DOM
  data/         Static game content (events, chapters, endings, realms, items, spirit roots, artifacts)
  components/   React UI components (one per screen/panel)
  hooks/        useGame.ts — single state hook owning GameSession
  types/        game.ts — all shared types live here
  audio/        Web Audio API synth sounds (effects only, no BGM)
  styles/       Tailwind v4 with @theme custom tokens
```

### Key flow

`App.tsx` renders based on `session.phase` (`start → lore → root_reveal → playing → shop → ending`). All state mutations go through `useGame()` which calls pure functions in `gameEngine.ts` and persists to `localStorage` automatically.

### Chapter system

Events are organized into **chapters** (`data/chapters.ts`). Three routes: **sect** (9 chapters), **wander** (6 chapters), **demon** (4 chapters). Each chapter has:
- `events` — main storyline events (must all complete to advance)
- `sideEvents` — optional NPC/Boss/crafting events (don't block progression)
- `intro` — scene-setting text shown when chapter begins
- `branchNext` — optional function for route switching

`eventPicker.ts` picks events in order: main chapter events → side events → filler events. Chapter progression is tracked via `player.chapterCompleted[]`.

Route switching: sect→wander (betrayed by sect), wander→sect (karma high), sect→demon (demonHeart high), demon→sect (redemption).

### Engine internals

- `gameEngine.ts` — create/load/save games, resolve choices, check endings, chapter progression, route switching
- `eventPicker.ts` — chapter-based event selection with filler fallback
- `effects.ts` — applies `Effect[]` to `PlayerState`
- `conditions.ts` — checks `Condition[]` against `PlayerState`
- `rng.ts` — seed-based PRNG. `setSeed()` for deterministic mode, `getDailySeed()` for daily challenge
- `metaProgress.ts` — cross-run unlocks persisted in `localStorage` under key `cultgame_meta`
- `achievements.ts` / `milestone.ts` — achievement and milestone detection
- `storylineTracker.ts` — computes storyline progress from player flags
- `novelExporter.ts` — exports playthrough as a formatted novel text file

### Event content

Events are split across 10 data files and merged in `events.ts`:
- `CORE_EVENTS` (events.ts) — main storyline
- `ROMANCE_EVENTS` (eventsRomance.ts) — romance subplot
- `SYSTEM_EVENTS` (eventsSystems.ts) — cultivation subsystems
- `SECT_EVENTS` (eventsSect.ts) — sect conflicts + minor sect events
- `WANDER_EVENTS` (eventsWander.ts) — wandering/hermit path
- `CHARACTER_EVENTS` (eventsCharacter.ts) — NPC interactions (墨离, 林远, 苏暮烟, 赵天行, 叶轻眉)
- `SECRET_EVENTS` (eventsSecret.ts) — secret encounters + spirit beasts
- `BOSS_EVENTS` (eventsBoss.ts) — boss fights
- `CRAFT_EVENTS` (eventsCraft.ts) — crafting + puppet systems
- `MISC_EVENTS` (eventsMisc.ts) — miscellaneous + origin-specific events

### UI system

Four modal buttons in StatusPanel: 📊属性, ⚔修炼, 👜乾坤袋, 📜剧情线

- `AttributeModal` — stats, realm, age, lifespan, bloodline
- `CultivationModal` — cultivation path, tiers, techniques, divine weapons
- `InventoryModal` — spirit stones, beasts, techniques, weapons, artifacts, usable items (all clickable with detail views)
- `StorylinePanel` — 12 storyline progress trackers

Modals use `createPortal` to `document.body`. All modals support ESC key to close.

## Conventions

- **No path aliases** — all imports use relative paths
- **Tailwind v4** — `@import "tailwindcss"` and `@theme {}` directive, no `tailwind.config.js`
- **Dark theme only** — `color-scheme: dark` on `<html>`
- **Fonts** — `Ma Shan Zheng` (display), `Noto Serif SC` (body)
- **TypeScript** — `erasableSyntaxOnly` (no `enum`/`namespace`), `verbatimModuleSyntax`, `noUnusedLocals`, `noUnusedParameters`
- **ESLint flat config** — `eslint.config.js` with `typescript-eslint` (not type-aware). `dist/` ignored
- **Component pattern** — named exports, props typed with inline `interface Props`, no default exports except `App`
- **No comments** unless complexity demands it

## Gotchas

- `npm run build` **fails if typecheck fails** — `tsc -b` runs first
- Deploy sets `GITHUB_PAGES=true` or `GITEE_PAGES=true`, changing Vite `base` to `/Cult-Game/`
- `erasableSyntaxOnly` means no `enum` or `namespace` — use `type` unions and plain objects
- `scripts/` uses `tsx` (not in deps — use `npx tsx`)
- Adding new `Condition` or `Effect` variants requires updating types in `types/game.ts` AND the handler in `conditions.ts` / `effects.ts`
- Adding new artifact IDs in events requires registering them in `data/artifacts.ts` ARTIFACTS map
- Chapter events should NOT have realm conditions (chapter order controls pacing)
- `pickFillerEvent` checks `maxTimes`, `cooldown`, AND `checkConditions` — filler events with unmet conditions are skipped
- `cloneSystems` in effects.ts clones ALL mutable arrays (history, inventory, chapterCompleted, spiritBeastsSeen)
