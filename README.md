# Yeet the Box: Unnecessarily Procedural Parkour Boogaloo

A lightweight, physics-driven platformer featuring smart procedural level generation and smooth player movement mechanics. Built entirely with Vanilla JavaScript and HTML5 Canvas.

## Features

- **Physics-Based Movement Engine**: Features momentum, acceleration, turning brakes, jump buffering, and coyote time for highly responsive controls.
- **Dash Mechanic**: A newly introduced multi-directional dash (using `Space`) that briefly suspends gravity and greatly extends jump reach. Dash charges regenerate automatically.
- **Smart Level Generation (`platforms.js`)**:
  - **Physics Validator**: Platforms are placed using simulated physics loops based on jump arcs and dash capabilities. Every generated gap is mathematically proven to be solvable.
  - **Bifurcated Paths**: Generates multiple primary paths (Standard "green" routes) that weave alongside one another vertically.
  - **High-Risk Pips**: Challenging branches of one-width platform "pips" (Orange) that require perfect timing.
  - **Dead-end "Fluff" Clusters**: Accessible but ultimately useless branches of varied-size platforms (Muted Maroon) scattered realistically throughout the negative space to build level volume.
  - **Structural Cohesion**: Background pylons and faded ghost scenery generate automatically to add architectural logic and visual depth without cluttering the gameplay route.

## Controls

- **Arrow Keys** (Left, Right): Move left or right.
- **Arrow Up**: Jump.
- **Space**: Dash in the direction of movement (or forward). Wait to recharge multiple dash charges.

## Installation & Usage

No build tools or servers are required!

1. Clone or download this project folder.
2. Double-click `index.html` to open it in any modern web browser.
3. Refresh the page to generate a completely new, mathematically guaranteed solvable level instantly.

## Architecture

- `index.html`: Entry point & basic CSS rules.
- `game.js`: Core game loop, canvas rendering layer, input handling, and player/camera physics tracking.
- `platforms.js`: Complete procedural level generator implementing the pathing algorithms, physics validator, PRNG seeding, and visual aesthetics.
