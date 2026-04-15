# Enemy System Implementation Plan

## Overview

`enemy.js` does not exist yet. Based on the current codebase, `game.js` owns all runtime behavior and rendering, while `platforms.js` generates level data and hazard metadata. `enemy.js` should therefore be a small runtime module that creates, updates, checks collisions for, and draws enemies without taking over broader game logic.

## Plan

1. Decide the module boundary for `enemy.js`.
   Keep it as a pure runtime module focused on enemy creation, updates, collision checks, and drawing.
   Match the current codebase style: plain browser JS with global-script loading rather than ES modules, unless the project is being modernized at the same time.

2. Define a shared enemy schema used by all variants.
   Every enemy should carry:
   - `id`, `type`
   - `x`, `y`, `w`, `h`
   - `vx`, `vy`
   - `platformId` or `homePlatform`
   - `state`
   - `facing`
   - `speed`
   - `detectionBox`
   - `spawnX`, `spawnY`
   - variant-specific config such as `patrolMinX`, `patrolMaxX`, `aggroRange`, `interceptLeadTime`, `activeUntil`

3. Standardize enemy states across all variants.
   Use a small shared state vocabulary so update logic stays consistent:
   - `IDLE`
   - `PATROL`
   - `PURSUIT`
   - `INTERCEPT`
   - `RETURN`
   - `ACTIVE`
   - `STUNNED` or `COOLDOWN` later if needed

4. Build `enemy.js` around four core APIs.
   Recommended functions:
   - `createEnemies(level)`
   - `updateEnemies(enemies, player, platforms, dt, now)`
   - `checkEnemyCollisions(enemies, player)`
   - `drawEnemies(ctx, enemies, camera, now)`

5. Add shared utility helpers inside `enemy.js`.
   Keep the file maintainable by centralizing repeated logic:
   - AABB overlap
   - detection-box calculation
   - ledge check on a platform
   - clamp-to-platform bounds
   - nearest/future landing estimate
   - state transition helper

6. Implement Variant A: Gap Guard.
   Purpose:
   - hazard placed in dash-heavy hard-path sections

   Behavior:
   - stationary by default
   - watches the player distance and dash state
   - when player is dashing nearby, enters `ACTIVE`
   - expands hurt area or enables a larger electrified collision zone for a short window

   Integration:
   - spawn on hard-path long-jump sections, especially `dash_gap`

   Notes for this codebase:
   - easiest signal is `player.state === "dash"`
   - keep the activation window short so the dash-timing challenge is readable

7. Implement Variant B: Pacing Stalker.
   Purpose:
   - territorial platform guard for easy-path flat segments

   Behavior:
   - patrols left/right on a single assigned platform
   - checks floor ahead before moving further
   - flips direction at edges
   - if player enters detection box, switches to `PURSUIT`
   - pursues only within that platform’s horizontal bounds
   - if player leaves range, goes to `RETURN` and recenters or resumes patrol

   Integration:
   - spawn on longer `standard` platforms with enough width

   Notes for this codebase:
   - use platform bounds instead of general terrain scanning whenever possible
   - only use actual “floor ahead” checks to preserve the ledge-aware feel

8. Implement Variant C: Intercepting Hoverer.
   Purpose:
   - gate secret/dead-end/trophy spaces and punish predictable jumps

   Behavior:
   - flying enemy, ignores ground collision
   - if player is airborne or approaching a target platform, estimate landing point
   - move toward predicted landing spot instead of current player position
   - if prediction is weak, drift back to a home hover point

   Integration:
   - spawn near `deadend` platforms, scenery rewards, or any future trophy/secret marker

   Notes for this codebase:
   - start with a lightweight prediction using current `player.x`, `player.y`, `player.vx`, `player.vy`, `gravity`
   - prefer “good enough” prediction over a full platform physics sim for v1

9. Use the existing Sense -> Think -> Move -> Animate loop per enemy.
   For each enemy update:
   - Sense: player overlap, detection-box hit, current platform edge/wall, dash state, airborne state
   - Think: choose state and target
   - Move: update velocity and clamp motion
   - Animate: set visual flags like alert marker, active glow, facing direction

10. Integrate enemy spawning into the level generator carefully.
    Recommended generator changes in `platforms.js`:
    - attach an `enemySpawn` descriptor to selected platforms instead of fully-instantiated enemies
    - examples:
      - hard path `dash_gap` or nearby landing platform -> `gapGuard`
      - long flat easy-path platforms -> `pacingStalker`
      - `deadend` or fake reward areas -> `hoverer`

    Reason:
    - `platforms.js` already generates metadata-driven hazards
    - `game.js` can convert these descriptors into live enemy objects via `createEnemies(level)`

11. Keep runtime enemy ownership in `game.js`.
    Add:
    - `let enemies = []`
    - enemy initialization during `initLevel()`
    - enemy reset when respawning or regenerating the level
    - `updateEnemies(...)` within `update(dt)`
    - `checkEnemyCollisions(...)` near existing hazard checks
    - `drawEnemies(...)` within `draw()`

12. Reuse the current hazard contract first.
    For v1, any enemy collision should call `die()`.
    Avoid adding stomp, damage, health, or invulnerability unless combat mechanics are also being introduced.

13. Layer enemy rendering on top of the existing visual style.
    Suggested visuals:
    - Gap Guard: grounded turret/block with pulsing electric field when active
    - Pacing Stalker: squat box with eye/facing indicator
    - Hoverer: floating orb or drone with a predictive targeting ring

    State indicators:
    - `!` or color shift when switching to `PURSUIT` or `ACTIVE`
    - detection box should remain debug-only, off by default

14. Add debug toggles while building.
    Temporary debug flags will make tuning much faster:
    - show detection boxes
    - show predicted landing point for hoverers
    - show current state text above enemy

    This should be easy to remove or disable later.

15. Implement in a safe order.
    Recommended sequence:
    - shared enemy schema and helpers
    - Pacing Stalker first
    - Gap Guard second
    - Hoverer third
    - generator metadata hookup
    - draw/state polish
    - balance/tuning pass

16. Verify against current systems.
    Test these cases:
    - enemy reset after death
    - enemy state reset after level regeneration
    - no enemy falls through crumble/hidden logic unexpectedly
    - dash vs Gap Guard timing feels fair
    - Stalker never leaves its platform
    - Hoverer prediction still works when player dashes mid-air
    - collisions remain consistent with player size-changing power-ups

17. Keep the first version intentionally narrow.
    Avoid adding:
    - pathfinding
    - combat
    - sprite sheets
    - enemy-enemy interactions
    - full AI planner logic

    The current codebase is single-file heavy, so the best first win is a compact `enemy.js` with deterministic hazard behavior.

## Recommended Spawn Rules

- Hard paths: one `gapGuard` near `dash_gap` sequences or on the receiving platform of a forced dash.
- Easy paths: one `pacingStalker` only on wide `standard` platforms to avoid clutter.
- Useless or fake platforms: one `hoverer` guarding `deadend` or future trophy areas.

## Open Choice

1. Keep `enemy.js` as a plain global-script helper to match the current architecture.
2. Convert the project to ES modules and make `enemy.js` a proper import.

Recommendation:
Use option 1 first because it is the smallest architectural change and fits the current project layout.
