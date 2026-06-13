# AGENTS.md

## Project

修仙模拟器 (Cultivation Simulator) — a single-page text RPG built with React 19, TypeScript 6, Vite 8, and Tailwind CSS 4. All UI is in Chinese. Deployed to GitHub Pages (base path `/CultGame/`).

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
  engine/       Pure game logic — no React, no DOM. Entry: gameEngine.ts
  data/         Static game content (events, endings, realms, items, spirit roots)
  components/   React UI components (one per screen/panel)
  hooks/        useGame.ts — the single state hook that owns GameSession
  types/        game.ts — all shared types live here
  audio/        Web Audio API synth sounds, no audio files
  styles/       Tailwind v4 with @theme custom tokens
```

### Key flow

`App.tsx` renders based on `session.phase` (`start → root_reveal → playing → shop → ending`). All state mutations go through `useGame()` which calls pure functions in `gameEngine.ts` and persists to `localStorage` automatically.

### Engine internals

- `gameEngine.ts` — create/load/save games, resolve choices, check endings
- `eventPicker.ts` — weighted random event selection with cooldowns and conditions
- `effects.ts` — applies `Effect[]` to `PlayerState`
- `conditions.ts` — checks `Condition[]` against `PlayerState`
- `rng.ts` — seed-based PRNG. `setSeed()` for deterministic mode, `getDailySeed()` for daily challenge
- `metaProgress.ts` — cross-run unlocks persisted in `localStorage` under key `cultgame_meta`
- `achievements.ts` / `milestone.ts` — achievement and milestone detection

### Event content

Events are split across four files and merged in `events.ts`:
- `CORE_EVENTS` in `events.ts` — main storyline (~1100 lines)
- `ROMANCE_EVENTS` in `eventsRomance.ts` — romance subplot
- `SYSTEM_EVENTS` in `eventsSystems.ts` — cultivation systems (alchemy, formations, beasts, etc.)
- `EXTRA_EVENTS` in `eventsExtra.ts` — additional encounters (~1170 lines)

## Conventions

- **No path aliases** — all imports use relative paths (`../engine/gameEngine`)
- **Tailwind v4** — uses `@import "tailwindcss"` and `@theme {}` directive, not `tailwind.config.js`. Custom design tokens (colors, fonts) are CSS custom properties defined in `src/styles/index.css`
- **Fonts** — `Ma Shan Zheng` (display/headings), `Noto Serif SC` (body). Both loaded via Google Fonts in `index.html`
- **Dark theme only** — `color-scheme: dark` on `<html>`, all colors are dark-palette CSS vars
- **TypeScript strict-ish** — `noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly` are on. No emit; bundler handles output
- **ESLint flat config** — uses `eslint.config.js` with `typescript-eslint` recommended (not type-aware). `dist/` is globally ignored
- **`verbatimModuleSyntax`** is enabled — use `import type` for type-only imports
- **No comments in code** unless complexity demands it (per project convention in CLAUDE.md)
- **Component pattern** — components are named exports, props typed with inline `interface Props`, no default exports except `App`

## Gotchas

- `npm run build` will **fail if typecheck fails** (`tsc -b` runs first). Fix TS errors before building
- Game state is saved to `localStorage` on every state change. Clearing localStorage resets the game
- The `scripts/` directory uses `tsx` (not bundled with deps — install globally or via npx). Scripts import from `../src/` directly
- Deploy sets `GITHUB_PAGES=true` or `GITEE_PAGES=true` env var which changes Vite `base` to `/CultGame/`. Local dev uses base `/`
- Events use `Condition[]` and `Effect[]` discriminated unions — when adding new conditions or effects, update the types in `types/game.ts` and the handler in `conditions.ts` / `effects.ts`
- `erasableSyntaxOnly` means you cannot use `enum` or `namespace` — use `type` unions and plain objects instead
