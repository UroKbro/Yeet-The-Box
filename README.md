# Yeet the Box: Unnecessarily Procedural Parkour Boogaloo

A lightweight, high-octane physics-driven platformer featuring a robust procedural level generator, chaotic power-up stacking, and a deadly gauntlet of obstacles. Built with Vanilla JavaScript and HTML5 Canvas.

## 🚀 Recent Upgrades

- **Power-Up Stacking**: You can now collect and stack multiple physics-warping power-ups simultaneously! The HUD dynamically tracks every active ability with individual countdown timers.
- **Cinematic Dash**: Hit `Space` for an explosive burst of movement. Features procedural ghost trails and impact sparks for maximum kinetic feel.
- **Improved Camera**: Sophisticated lerp-based camera tracking that responds instantly to high-speed dashes and vertical launches.

## 📦 Power-Ups (The Chaos Array)

- **Double Dash** (Cyan): Grants extra dash charges.
- **High Jump** (Green): Massive boost to your leap power.
- **Anti-Gravity** (Magenta): Defy physics with upward lift.
- **Super Speed** (Yellow): Move faster than the procedural generator intended.
- **Giant Box** (Red): Triple your physical presence (and hitbox).
- **Mini Box** (Orange): Shrink down to squeeze through tight gaps.
- **Ice Physics** (Glacial Blue): Zero friction movement for extreme sliding.
- **Ghost Mode** (Dark Grey): Dash through solid walls! (Ignores collisions during the dash).
- **Feather Flow** (Pink): Drastically reduces fall speed for graceful gliding.

## ⚠️ Hazard & Obstacle Systems

- **Lethal Spikes**: Sharp red traps anchored to platforms. Touch once to lose a life.
- **Roaming Sawblades**: Spinning metallic discs that patrol platforms. Features circular collision detection and aggressive visual rotation.
- **Bounce Pads** (Neon Cyan): Overrides gravity to launch you into the stratosphere.
- **Crumble Platforms**: Brown blocks that vibrate and vanish shortly after contact.
- **Solid Scenery**: Those statues and vases aren't just for show—you can now jump on them!

## ❤️ Game Systems

- **Lives System**: You start with 3 lives. Falling off the world or hitting hazards decrements your life count.
- **Procedural Re-roll**: On Game Over, the engine wipes the existing seed and generates a brand new, mathematically solvable gauntlet instantly.
- **Score/Goal Tracking**: Reach the Purple Exit at the end of the cavern to complete your run.

## ⌨️ Controls

- **Arrow Keys**: Move and Jump.
- **Space**: High-speed Dash.
- **Enter/Space (Game Over)**: Respawn with a fresh procedural level.

## 🛠️ Installation & Usage

1. Clone or download this project folder.
2. Open `index.html` in any modern browser.
3. Every refresh (or death-reset) provides a unique, guaranteed-solvable challenge.

## 🏗️ Architecture

- `index.html`: Entry point & basic CSS rules.
- `game.js`: Core game loop, multi-state physics engine, power-up management, and visual particle rendering.
- `platforms.js`: The "Brain". Handles path validation, hazard placement, and PRNG-based level architecture.
