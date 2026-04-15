# Level Generator Rework Plan

## Goal

Replace the current chunk-driven generator in `platforms.js` with a path-first, metadata-heavy procedural system that creates a new and distinct level on every run while preserving fairness, readability, and replay value.

The new generator should maximize all of the following at once:

- unique layouts across seeds
- two clearly differentiated playable routes
- intentional optional decor and branch platforms
- enough safe space for power-ups and rewards
- correct handling of jump and dash traversal
- hazard placement that stays fair
- enemy placement that feels designed, not random
- stronger visual cohesion so the level feels like a world, not floating rectangles

The target is not just randomness. The target is high-variance levels with stable play quality.

## Core Design Principles

1. Generate gameplay first, scenery second.
   The generator should first guarantee a complete, interesting route from start to goal. Decorative geometry should be built around the route, not the other way around.

2. Treat the level as authored structure, not random noise.
   Each run should feel intentional. The player should be able to read where to go, spot optional detours, and identify high-risk shortcuts.

3. Separate required gameplay from optional content.
   Critical path platforms, branch platforms, hazards, scenery, and enemy anchors should all be represented differently in metadata.

4. Preserve fairness under variation.
   Randomness should increase novelty, not create impossible jumps, blind hazards, or unreadable enemy setups.

5. Use layered generation passes.
   Each pass should solve one problem well: route shape, shell carving, branch placement, rewards, hazards, enemies, then visuals.

## Success Criteria

The reworked generator succeeds if it consistently produces levels where:

- the player can always reach the goal
- the easy path can be completed without mandatory dash-gates
- the hard path regularly rewards dash skill and route choice
- shared anchors allow switching between the two routes
- optional branches feel tempting and meaningful
- power-ups fit naturally on safe or intentionally risky platforms
- hazards and enemies increase tension without invalidating traversal
- the world looks spatially coherent rather than made of disconnected planks

## High-Level Generator Architecture

The new `generateLevel(seed, difficulty, worldWidth, worldHeight)` should run as a multi-stage pipeline:

1. Seed initialization and world profile generation
2. Shared anchor planning
3. Easy spine generation
4. Hard spine generation
5. Route validation and repair
6. Action platform synthesis
7. Negative-space shell generation
8. Optional branch and decor platform generation
9. Reward and power-up allocation
10. Hazard decoration
11. Enemy anchoring
12. Visual layering and metadata finalization
13. Final solvability validation and cleanup

This should remain behind the existing top-level API so `game.js` does not need a major rewrite.

## Stage 1: Seed Initialization and World Profile

The generator should not rely on raw randomness alone. Each seed should produce a distinct level profile that biases the rest of generation.

Create a seeded `levelProfile` object early with fields such as:

- `verticalBias`: low, medium, high
- `openness`: cavernous, mixed, compact
- `branchDensity`: sparse, medium, dense
- `hazardPressure`: low, medium, high
- `enemyPressure`: low, medium, high
- `rewardDensity`: low, medium, high
- `anchorCount`: number of shared hubs between start and goal
- `theme`: ruins, cavern, fortress, industrial, overgrown

This gives each seed an identity and prevents every level from feeling like the same generator with shuffled coordinates.

The seed should influence not only geometry but pacing, route rhythm, spacing, branch temptation, and enemy density.

## Stage 2: Shared Anchor Planning

The backbone of the entire system should be a set of shared anchor platforms placed between start and goal.

These anchors are large, stable platforms that:

- reconnect the easy and hard routes
- act as pacing checkpoints
- give players route-switch opportunities
- provide safe spaces for rewards, power-up recovery, or breathing room

Rules for anchors:

- start and goal are always anchors
- anchors should be spaced evenly enough for rhythm, but jittered enough for uniqueness
- anchors should occupy safe vertical bands
- anchors should be wider than regular platforms
- anchors should never contain unfair hazards that block recovery

Recommended anchor rhythm:

- start
- 3 to 6 shared anchors depending on world width and profile
- goal

This creates a reliable macro-structure even when the local geometry changes radically between seeds.

## Stage 3: Dual-Spine Action Path Generation

The main innovation should be generating two route spines before generating decorative or optional content.

### Easy Spine

The easy spine should be readable and forgiving.

Goals:

- low vertical volatility
- safe standard jump distances
- larger landing platforms
- fewer stacked hazards
- less punishment for missed timing

Construction rules:

- follow a low-frequency wave between shared anchors
- keep horizontal gaps inside standard jump distance
- clamp vertical shifts so the player can recover from small mistakes
- periodically include wide stable platforms for power-ups or recovery

The easy path should still be interesting. It should not just be a straight hallway. It should create satisfying movement while remaining understandable.

### Hard Spine

The hard spine should feel like a riskier route with stronger mobility checks.

Goals:

- sharper vertical swings
- deliberate dash-required gaps
- narrower or less forgiving landings
- stronger integration with hazards and enemy pressure
- faster traversal potential for skilled players

Construction rules:

- follow a higher-frequency curve between anchors
- periodically create segments where standard jump fails but jump plus dash succeeds
- include recovery platforms after high-risk segments
- allow occasional route shortcuts that pay off skill

The hard route should not simply be the easy route with more spikes. It should use movement systems differently.

### Shared Anchor Convergence

Both spines must terminate each segment at the same shared anchor.

This creates:

- route swapping
- pacing control
- natural checkpoint rhythm
- easier validation and repair
- stronger feeling of intentional level design

## Stage 4: Route Representation as a Graph

Do not treat the level as only a list of rectangles. Treat it as a directed platform graph.

Each node should represent a platform candidate or landing surface.
Each edge should represent an intended traversal relationship.

Recommended node metadata:

- `id`
- `x`, `y`, `w`, `h`
- `role`: `start`, `goal`, `anchor`, `path`, `branch`, `reward`, `hazard`, `decor`
- `pathType`: `easy`, `hard`, `shared`, `branch`
- `tier`: `critical`, `non_essential`, `hazardous`
- `layer`: `action`, `midground`, `background`, `foreground`
- `riskScore`
- `rewardScore`
- `supportsPowerUp`
- `supportsEnemy`
- `supportsHazard`
- `incomingEdges`, `outgoingEdges`

Recommended edge metadata:

- `fromId`, `toId`
- `traversalType`: `jump`, `dash_jump`, `drop`, `shortcut`
- `difficulty`
- `requiredDash`
- `safetyRating`

This graph is the correct abstraction for validation, branch generation, and reward placement.

## Stage 5: Platform Metadata and Hierarchy

The generator should export richer platform objects while staying compatible with the current engine.

Recommended gameplay-oriented fields:

- `type`
- `pathType`
- `tier`
- `layer`
- `collisionMode`
- `anchorId`
- `branchId`
- `isEssential`
- `supportsPowerUp`
- `supportsEnemy`
- `supportsHazard`
- `travelHint`
- `riskScore`
- `rewardScore`

Recommended advanced behavior fields:

- `durability`
- `degradeMode`
- `degradeState`
- `tileMask`
- `neighborMask`
- `visualTheme`
- `scenerySlots`

Platform categories should become explicit:

- Tier 1 Critical: required for level completion
- Tier 2 Optional: reachable branch and decor platforms
- Tier 3 Hazardous: false, degrading, bait, or trap platforms

This hierarchy gives the generator room to scale without overloading `type` with too many meanings.

## Stage 6: Traversal Solver and Fairness Engine

The single most important system for maximizing output quality is a stronger heuristic solver.

The generator must understand player movement well enough to reject bad content automatically.

The solver should model:

- standard jump reach
- fall arcs
- dash-extended reach
- vertical recovery after dash
- platform width requirements for landing
- approach direction and launch window quality

At minimum, every critical edge in the graph should be checked with a simplified traversal simulation.

Validation goals:

- easy edges must always be standard-jump solvable
- hard edges may be dash-required, but must still be consistent and fair
- hazard placement must not erase the only valid landing window
- enemy anchors must not create mathematically impossible states

This solver should also support repair logic:

- widen a landing platform
- shift platform position
- insert a rescue platform
- remove or move a hazard
- downgrade a hard edge to a standard edge

The generator should prefer repair over rejection so it can maintain variety without producing broken runs.

## Stage 7: Negative-Space Shell Generation

To avoid the current floating-platform look, the generator should build a surrounding world shell around the action paths.

The best implementation path is an internal tile grid used only during generation and rendering metadata.

Process:

1. Mark the critical action paths on a coarse grid.
2. Expand each path into a safe corridor several blocks tall.
3. Fill the rest of the world as solid shell.
4. Carve out the playable corridors and nearby navigation volume.
5. Apply smoothing or cellular automata to reduce harsh grid artifacts.

This produces a cave, ruin, fortress, or structural shell around the level.

Important constraint:

Use this shell primarily for visuals and spatial composition first. Keep collision rectangle-based until the engine is ready for tile collisions.

That gives the project the visual benefits without forcing a full physics rewrite.

## Stage 8: Optional Branch and Decor Platform Generation

The so-called useless platforms should become intentional optional branches.

These platforms should be generated after the core routes are complete, based on open negative space between or around the two spines.

Branch design goals:

- tempt the player off the critical path
- occasionally hide power-ups or scenery rewards
- sometimes act as enemy gates or risk-reward detours
- never become mandatory for completion

Branch generation rules:

- begin from an existing anchor or path node
- grow outward with limited depth
- prefer visually open areas and empty rooms
- terminate naturally at leaf nodes
- avoid cluttering the main route silhouette

Branch types:

- short scenic detour
- medium reward branch
- false branch with trap platform
- dead-end secret alcove
- loop-back branch that rejoins later

This is one of the strongest ways to increase content density without making the level unreadable.

## Stage 9: Space Reservation for Power-Ups

Power-ups should no longer be placed by simple probability alone. They need intentional landing and pickup space.

For each platform candidate, compute whether it can support a power-up safely:

- enough width for the pickup box and player overlap
- enough headroom above the platform
- no immediate collision with another hazard or enemy
- sufficient approach safety for the intended route type

Recommended placement classes:

- safe route reward: easy anchors, recovery platforms, large easy platforms
- risk reward: hard route landings after precise gaps
- branch reward: optional branch leaf or guarded side area
- utility reward: placed before a movement challenge to encourage experimentation

Power-up distribution should consider pacing:

- avoid frontloading too many in the first segment
- avoid stacking multiple on adjacent platforms unless it is a special reward room
- place movement-altering power-ups where they create interesting choices, not random chaos

The generator should actively reserve “power-up slots” during platform synthesis instead of hoping later placement fits.

## Stage 10: Hazard Decorator System

Hazards should be applied in a dedicated final decorator pass, never during route construction.

Hazard placement should depend on platform metadata, edge difficulty, and local available space.

Supported hazard roles:

- edge pressure hazards on hard route landings
- timing hazards on wide path platforms
- branch traps on optional dead ends
- area denial hazards that influence movement without blocking it completely

Hazard candidates include:

- spikes
- sawblades
- bounce pads
- crumble segments
- false dash-break platforms

Hazard rules:

- easy route hazard density stays low
- hard route hazard density can be higher, but never in a way that removes all valid approach windows
- hazards should create decisions, not blind punishment
- anchors should remain mostly safe

The hazard decorator should score placements, simulate them, and reject bad ones automatically.

## Stage 11: Enemy Anchoring and AI-Friendly Layout Support

Enemies should not be dropped into the level randomly. The geometry should provide explicit enemy anchor opportunities.

For each platform or region, compute support flags for enemy archetypes.

### Gap Guard Support

Best anchors:

- hard-route dash gates
- receiving platforms after long gaps
- narrow bridge-style platforms

Requirements:

- enough room to read the enemy before engagement
- no unavoidable overlap with the player’s only landing position
- enough safe margin before and after the encounter

### Pacing Stalker Support

Best anchors:

- wide, flat platforms on easy or mixed routes
- branch corridors with room to patrol

Requirements:

- reliable ledge bounds
- enough platform width for patrol and pursuit
- not placed where it can instantly body-block a required spawn or landing

### Intercepting Hoverer Support

Best anchors:

- open rooms between routes
- branch leaf nodes guarding rewards
- spaces above optional structures or recovery zones

Requirements:

- enough vertical space to read its motion
- enough room for the prediction-based intercept behavior to matter
- not too many nearby hazards that make the encounter unreadable

Enemy placement should be capped per segment to preserve readability. A smaller number of meaningful encounters is better than constant noise.

## Stage 12: Dash-Aware Geometry Design

Because dash is a core mechanic, the generator must reason about it explicitly.

Critical dash-aware design rules:

- some hard edges should require dash
- some edges should reward dash but not require it
- some branches should only be reachable with skilled dash use
- there should be recovery space after high-speed traversal
- hazards and enemies near dash sections must leave readable timing windows

Each critical edge should be tagged with one of:

- `standard_only`
- `standard_preferred`
- `dash_optional`
- `dash_required`
- `dash_reward_branch`

This classification should drive both hazard placement and power-up placement.

## Stage 13: Pacing and Difficulty Curve

A strong generator is not just about placement. It is about flow.

Each level should follow a rough pacing arc:

1. onboarding segment
2. route split and discovery
3. moderate challenge escalation
4. first major risk-reward detours
5. strongest hazard and enemy pressure in the mid-late game
6. final convergence and goal approach

This should be adapted per seed profile, not hardcoded identically every time.

Suggested controls:

- earlier anchors are safer and wider
- hazard density ramps gradually
- enemy pressure peaks in the middle, not at spawn
- goal segment reduces noise and increases clarity

This avoids procedural levels that feel flat from beginning to end.

## Stage 14: Visual Layering and Depth

To maximize the perceived quality of the generator, the world should use a 3-plane or 4-plane depth system.

### Foreground

- silhouettes, framing walls, vines, ruins
- no collision
- high contrast

### Action Layer

- critical platforms, hazards, enemies, power-ups
- full detail and collision
- highest saturation and clarity

### Midground

- branch platforms, decor shelves, optional structures
- lower saturation
- may be solid if intentionally reachable

### Background

- cave walls, distant architecture, atmospheric shapes
- no collision
- low contrast, parallax scroll

The generator should tag output by layer so rendering can become much richer later without changing generation again.

## Stage 15: Breadcrumb Secret System

Optional platforms become much more valuable when they terminate in something memorable.

After branch generation, identify leaf nodes in the branch graph.

Each leaf node can then be scored for secret potential based on:

- branch depth
- local danger
- distance from critical path
- available space
- thematic fit

Secret payload options:

- scenic statue or flag
- lore-style environmental prop
- power-up cache
- guarded hoverer encounter
- high-risk false platform bait

This creates environmental storytelling and makes dead ends feel authored instead of accidental.

## Stage 16: World Variety Maximization Strategy

To maximize unique output across seeds without sacrificing quality, vary at multiple scales instead of relying on small random offsets.

### Macro variation

- anchor count
- route weaving frequency
- vertical band usage
- shell openness
- branch density

### Meso variation

- platform widths and landing styles
- route crossing frequency
- hazard decorator patterns
- enemy encounter cadence
- reward distribution

### Micro variation

- exact positions
- local scenery props
- false-platform placement
- decorative shelves
- parallax and silhouette arrangement

The more variation is distributed across all three scales, the less repetitive the generator will feel.

## Stage 17: Quality Scoring and Reroll Logic

The best way to maximize generator output is to score candidate levels and reroll weak ones.

After generation, compute a quality score using factors like:

- successful route validation
- distinction between easy and hard routes
- branch usefulness
- power-up fit quality
- hazard fairness
- enemy readability
- visual density balance
- replay novelty relative to previous profile dimensions

If the score falls below a threshold, reroll portions of the level or regenerate the seed-derived profile section.

Recommended repair order:

1. fix broken traversal
2. reduce unfair hazards
3. move enemies
4. improve power-up fit
5. inject or prune branches
6. rebalance density

This is better than accepting every generated level equally.

## Stage 18: Recommended Internal Data Structures

Use these internal structures during generation:

- `levelProfile`
- `anchorNodes`
- `pathGraph`
- `platformRecords`
- `shellGrid`
- `branchGraph`
- `hazardCandidates`
- `enemyCandidates`
- `rewardCandidates`
- `qualityReport`

Only convert to the flatter runtime `platforms` array at the end.

This keeps the generator maintainable and makes future systems easier to add.

## Stage 19: Suggested Function Breakdown for `platforms.js`

Refactor the file into generator stages similar to these:

- `createLevelGenerator()`
- `createLevelProfile(seed, worldWidth, worldHeight)`
- `buildSharedAnchors(profile, worldWidth, worldHeight)`
- `buildEasySpine(profile, anchors)`
- `buildHardSpine(profile, anchors)`
- `validateAndRepairPaths(pathGraph, playerSpec)`
- `synthesizeActionPlatforms(pathGraph)`
- `buildShellGrid(profile, pathGraph, worldWidth, worldHeight)`
- `carveSafetyCorridors(shellGrid, pathGraph)`
- `generateOptionalBranches(profile, shellGrid, pathGraph)`
- `reservePowerUpSlots(platformRecords, profile)`
- `attachHazards(platformRecords, pathGraph, profile)`
- `attachEnemySpawns(platformRecords, pathGraph, profile)`
- `assignSceneryAndSecrets(branchGraph, platformRecords, profile)`
- `finalizeVisualLayers(platformRecords, shellGrid, profile)`
- `scoreLevelOutput(levelData)`
- `finalizeLevel(levelData)`

This is a better long-term structure than continuing to expand chunk grammar logic.

## Stage 20: Migration Plan

This should be implemented incrementally to avoid destabilizing the game.

### Phase A

- keep current API shape
- add richer metadata to platform objects
- preserve current rectangle collision in `game.js`

### Phase B

- replace chunk generation with shared anchors and dual spines
- keep hazards simple during the first pass

### Phase C

- add branch generation and power-up slot reservation
- replace fake-platform logic

### Phase D

- add shell grid and visual layering metadata
- use shell visually first, not for physics

### Phase E

- move hazard placement to decorators with validation
- add enemy spawn descriptors for future `enemy.js`

### Phase F

- add quality scoring and reroll heuristics
- tune profile weights for better variety across seeds

This preserves stability while steadily improving generation quality.

## Recommended First Implementation Slice

The highest-value first slice is:

1. add shared anchors
2. generate easy and hard spines between them
3. validate and repair route edges
4. attach metadata-rich platform records
5. replace fake platforms with intentional branch platforms
6. reserve proper power-up slots
7. move hazard placement into a final validator-backed pass

This already delivers most of the gameplay gain before shell carving and advanced visuals are complete.

## Final Recommendation

The best possible level generator for this project is not a pure random platform placer and not a fully simulated tile-world builder. It is a hybrid procedural authoring system with:

- a stable shared macro-structure
- two differentiated routes
- a traversal-aware solver
- metadata-rich platforms
- optional branch content
- reserved reward space
- decorator-based hazards and enemies
- shell-based visual cohesion
- reroll and repair logic for weak outputs

That combination will maximize uniqueness per run while keeping the level readable, fair, stylish, and rich enough to support power-ups, hazards, dash mechanics, decor platforms, and enemy encounters.
