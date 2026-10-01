# Domain Context

## Route and chapter progression

- **Current Route（当前路线）**: The route of `PlayerState.currentChapter`. It is derived from chapter data and is the only source of truth for where the player is now. Do not infer it from boolean flags.
- **Route Intent（路线意图）**: A transient request produced by an event choice to enter a route. The story progression Module consumes it immediately after the event resolves.
- **Route History（路线历史）**: A durable fact that the player has entered a route before. It is stored as `ever_joined_sect`, `ever_walked_wander_path`, or `ever_walked_demon_path`; it never decides the Current Route.
- **Chapter Progress（章节进度）**: `currentChapter` plus the main events completed in that chapter. The story progression Module owns entry, reconciliation, cascading advancement, and cross-route transitions.

Legacy content may still express route requirements with `loyal_to_sect`, `refused_all_sects`, or `accepted_demon_path`. The conditions Adapter derives those requirements from Current Route; these keys are never stored or written. New content uses the `route` condition/effect.

Use “route” for sect/wander/demon story paths and “cultivation path” for balanced/body/law mechanics.
