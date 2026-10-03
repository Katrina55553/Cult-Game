# AGENTS.md

This is the single source of agent guidance for this repo. All AI coding tools should read this file.

## Project

修仙模拟器 (Cultivation Simulator) — a single-page text Roguelike RPG built with React 19, TypeScript 6, Vite 8, and Tailwind CSS 4. All UI is in Chinese. Deployed to GitHub Pages (base path `/Cult-Game/`) and Gitee Pages.

Live: https://katrina55553.github.io/Cult-Game/

## Commands

| Task | Command |
|------|---------|
| Dev server | `npm run dev` |
| Typecheck + production build | `npm run build` (runs `tsc -b` then `vite build`) |
| Lint | `npm run lint` |
| Preview production build | `npm run preview` |
| Automated playtest | `npx tsx scripts/playtest.ts` |
| Deep playtest | `npx tsx scripts/playtest-deep.ts` |
| Validate game data | `npx tsx scripts/validate-game-data.ts` |
| Chapter progression regression | `npx tsx scripts/check-chapter-progress.ts` |
| Chapter registration regression | `npx tsx scripts/check-chapter-validation.ts` |
| Known bug regressions | `npx tsx scripts/check-known-regressions.ts` |
| Story continuity regression | `npx tsx scripts/check-story-continuity.ts` |
| Deploy to Gitee Pages | `bash scripts/deploy-gitee-pages.sh` (requires `GITEE_TOKEN` env var) |

There is **no test framework** installed. Verification is lint + typecheck + build + manual or automated playtest.

Playtest strategies: `cultivate`, `romance`, `sect`, `greedy`, `random`, `wander`, `demon`. The canonical `FILLER_EVENT_IDS` lives in `src/data/eventCategories.ts`; `playtest-helpers.ts` re-exports it as `FILLER_IDS` so engine and playtests classify waiting-period events identically.

Playtest runs are seeded: pass `seed` through `NewGameOptions` (e.g. `createNewGame({ name, origin, seed })`). Calling `rng.setSeed()` before `createNewGame` has **no effect** — `createNewGame` reseeds internally, so runs would not be reproducible.

`check-chapter-progress.ts` guards the cross-route chapter deadlock described below. Note the playtest strategies never take those branches, so `playtest.ts` alone cannot catch a regression there.

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

`App.tsx` renders based on `session.phase` (`start → lore → root_reveal → playing → shop → ending`). No router — single-component conditional render. All state mutations go through `useGame()` which calls pure functions in `gameEngine.ts` and persists to `localStorage` automatically.

### Chapter system

Events are organized into **chapters** (`data/chapters.ts`). Three routes with independent chapter sequences:

- **Sect** (9 chapters): 入门 → 修行 → 崭露头角 → 天骄之争 → 秘境探索 → 情缘与暗流 → 宗门大战 → 突破之路 → 终局
- **Wander** (6 chapters): 独行 → 求生 → 声名渐起 → 散修之路 → 探索 → 终局
- **Demon** (4 chapters): 入魔 → 堕落 → 魔道势力 → 终局

Each chapter has:
- `events` — main storyline events (must all complete to advance)
- `sideEvents` — optional NPC/Boss/crafting events (don't block progression)
- `intro` — scene-setting text shown when chapter begins
- `branchNext` — optional function for route switching

`eventPicker.ts` responds to consequence events and chapter-triggered decisions first, then alternates eligible side events with the ordered main storyline. Opened chapters are recorded in `player.visitedChapters[]`; unfinished side events remain available after a chapter transition. Side events never block advancement. `followUpOf` names prerequisite encounters and prioritizes continuation of an opened chain over unrelated side stories. Chapter progression is tracked via `player.chapterCompleted[]`.

**Cross-route chapter deadlock (guarded).** `pickNextEvent` skips any `once` event already in `player.history`, and every chapter transition resets `chapterCompleted`. If the same `once` event is registered as a main in chapter A and (as main or side) in chapter B, reaching B later used to freeze it forever — the run could never reach another chapter and ended only by lifespan. `reconcileChapterProgress()` in `storyProgression.ts` back-fills any `once` main event already in `history` when entering a chapter, `tryAdvanceChapter()` cascades if that immediately completes it, and `loadGame()` repairs saves already stuck this way. Intentional cross-route encounters are declared in `SHARED_CHAPTER_EVENTS` with their exact chapter list and a reason; reconciliation adds a memory to the story log without replaying rewards. `scripts/validate-game-data.ts` warns on undeclared reuse and rejects stale declarations, same-route duplicates, and route-incompatible main or side events. `check-chapter-validation.ts` guards these rules.

Event weighting in `eventPicker.ts`:
- **Cooldown decay**: recently-seen events get 0.15x (<3 turns) or 0.4x (<5 turns) weight
- **Rarity multiplier**: common 1x, rare 0.6x, legendary 0.28x
- **Divine sense bonus**: rare/legendary events get `1 + divineSense/400` weight multiplier
- **Romance chain boost**: 2x weight for romance events when `met_su_qing` or `has_companion` flag set; 2.2x if meta-progress `romanceBoost` unlocked
- **Story-specific boosts**: e.g., `beauty_rescue` gets 3x when `refused_all_sects && !met_su_qing`
- **Behavior multiplier**: karma≥15 boosts good events 1.5x; demonHeart≥40 boosts dark events 1.6x; rootBone≥35 boosts combat 1.4x; alchemyTier≥1 boosts alchemy 1.5x, etc.
- **Filler suppression**: filler events get 0.05x (<6 turns) or 0.2x (<10 turns)

Events with a `storyGroup` field are mutually exclusive — once one event from a group is in history, others in the same group are skipped.

Route switching: sect→wander (去留之问), wander→sect (山门再邀), sect→demon (心魔岔路), demon→sect (回头之路). Stats unlock these decisions; only an explicit choice changes the route. `currentChapter` is the only source of truth for the current route; use `getCurrentRoute()` rather than route flags. Event choices request a switch with the `route` effect, optionally naming a destination `chapter`, and `storyProgression.ts` consumes that transient intent. Legacy route flag conditions remain as a compatibility Adapter only.

`relationships.ts` clears partner identity and shared relationship progress when a companion leaves, prevents simultaneous partner identities, and reconciles hostile/friendly 墨离 flags. Old saves receive the same repair in `migrate.ts`.

Key historical/branch flags:
- `ever_joined_sect` / `ever_walked_wander_path` / `ever_walked_demon_path` — route history; never current-route state
- `has_companion` / `su_qing_companion` — romance chain
- `met_su_qing` — romance event gate
- `became_elder` — sect advancement
- `war_hero` — sect war outcome

### Realm progression

`mortal → qi_refining_1 → qi_refining_2 → qi_refining_3 → foundation → golden_core → nascent_soul → deity`

Each breakthrough grants a lifespan bonus (0/10/5/5/80/150/300/500). Cultivation reaches 100 to trigger breakthrough.

### Spirit roots (weighted random at game start)

heaven (3%) → single (10%) → dual (20%) → triple (30%) → quad (25%) → penta (12%). Higher quality = better stat ranges and longer base lifespan.

### localStorage keys

- `cultgame_save` — current `GameSession` (auto-persisted every state change)
- `cultgame_meta` — `MetaProgress` (cross-run unlocks, achievements, run count)

### Engine internals

- `gameEngine.ts` — create/load/save games, resolve choices, check endings
- `storyProgression.ts` — current route, chapter entry/progress/reconciliation, route switching, old-save repair
- `eventPicker.ts` — chapter-based event selection with filler fallback
- `effects.ts` — applies `Effect[]` to `PlayerState`
- `conditions.ts` — checks `Condition[]` against `PlayerState`
- `rng.ts` — seed-based PRNG. `setSeed()` for deterministic mode, `getDailySeed()` for daily challenge
- `metaProgress.ts` — cross-run unlocks persisted in `localStorage` under key `cultgame_meta`
- `achievements.ts` / `milestone.ts` — achievement and milestone detection
- `storylineTracker.ts` — computes storyline progress from player flags
- `novelExporter.ts` — exports playthrough as a formatted novel text file

### Event content

Events are split across 11 data files and merged in `events.ts`:
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
- `CONSEQUENCE_EVENTS` (eventsConsequences.ts) — explicit route decisions and follow-ups for abandonment, counterespionage, and sect sacrifice choices

Additional data files: `talents.ts` (12 talents across 4 categories), `exploreAreas.ts`, `sects.ts`, `cultivationSystems.ts` (tier labels + defaults). Full storyline docs in `STORYLINES.md`.

### Key fields for adding events

`GameEvent`: `id`, `title`, `description`, `weight` (higher = more likely), `years` (time cost, default 1), `once` (one-shot), `maxTimes`, `cooldown`, `minGap`, `storyGroup` (mutually exclusive group), `act` (qi/foundation/golden/any), `rarity` (common/rare/legendary), `conditions`, `choices`.

`Choice`: `id`, `text`, `narrative` (shown after choosing), `hint`, `requirements` (conditions to be selectable), `effects` (direct), `outcomes` (probabilistic with `chance` 0-1, `luckBonus`, `successEffects`, `failEffects`).

`GameEvent.followUpOf` requires at least one referenced event in history. `priority: 'consequence'` responds before ordinary events; consequence events must be `once` and declare `followUpOf` so they cannot starve the main story.

`Condition` variants: `stat` (PlayerStats key + min/max), `realm` (min), `flag` (key + value), `resource`, `age`, `cultivation`, `lifespan_remaining`, `divineSense`, `alchemyTier`, `formationTier`, `swordTier`, `bloodlineTier`, `techniqueTier`, `divineWeaponTier`, `cultivationPath`, `origin`.

`Effect` variants: `stat`, `cultivation`, `lifespan`, `spiritStones`, `flag`, `artifact`, `log`, `age`, `breakthrough`, `endLife`, `hint`, `divineSense`, `alchemyTier`, `formationTier`, `swordTier`, `bloodline`, `bloodlineTier`, `technique`, `techniqueTier`, `divineWeapon`, `divineWeaponTier`, `spiritBeast`, `cultivationPath`, `inventory`.

### UI system

Four modal buttons in StatusPanel: 📊属性, ⚔修炼, 👜乾坤袋, 📜剧情线

- `AttributeModal` — stats, realm, age, lifespan, bloodline
- `CultivationModal` — cultivation path, tiers, techniques, divine weapons
- `InventoryModal` — spirit stones, beasts, techniques, weapons, artifacts, usable items (all clickable with detail views)
- `StorylinePanel` — 12 storyline progress trackers

Modals use `createPortal` to `document.body`. All modals support ESC key to close.

The ending screen has a novel export (📖 导出为小说) that compiles the full playthrough into a structured text file. Each run also has one 🔄 回溯 (snapshot rollback) that rewinds to before the previous choice; the snapshot is persisted so a page refresh doesn't lose it.

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
- `scripts/` uses `tsx` (not in deps — use `npx tsx`). Scripts import from `../src/` directly with `.ts` extensions.
- Adding new `Condition` or `Effect` variants requires updating types in `types/game.ts` AND the handler in `conditions.ts` / `effects.ts`
- Adding new artifact IDs in events requires registering them in `data/artifacts.ts` ARTIFACTS map
- Chapter events should NOT have realm conditions (chapter order controls pacing)
- `pickFillerEvent` checks `maxTimes`, `cooldown`, AND `checkConditions` — filler events with unmet conditions are skipped
- `cloneSystems` in effects.ts clones ALL mutable arrays (history, inventory, chapterCompleted, spiritBeastsSeen)
- `rng.ts` uses module-level mutable seed — single instance, not safe for concurrent use
- Shop item effects are hardcoded in `useGame.ts` `ITEM_EFFECTS` map — adding new usable items requires updating both `data/shop.ts` and this map
