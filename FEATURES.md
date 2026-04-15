# Platformer Features Guide

This document outlines the essential "Game Feel" and "Iconic" features to transform a basic platformer into a professional-feeling title.

---

## 1. Game Feel & Responsiveness
*These features forgive human error and make controls feel "snappy."*

### Coyote Time
* **Concept:** Allows the player to jump for a few frames (5–10) after they have physically left the ledge of a platform.
* **Why:** Prevents the feeling of the game "ignoring" a jump input when a player reacts slightly too late at the edge.

### Input Buffering
* **Concept:** Stores a "Jump" or "Dash" input if pressed briefly before hitting the ground, then executes it the instant the player lands.
* **Why:** Makes movement transitions feel fluid rather than clunky.

### Squash and Stretch
* **Concept:** Procedurally scaling the player sprite (e.g., flattening on landing, elongating on jump).
* **Why:** Adds "Juice" and weight to the character movement.

---

## 2. Advanced Navigation & Mechanics

### Seamless Dynamic Rooms
* **Camera Interpolation (Lerp):** Instead of following the player constantly, move the camera only when the player enters a new "Room" boundary.
* **Constraint Locking:** In vertical sections, lock the X-axis of the camera to focus the player on the climb.

### Momentum-Preserving Teleporters
* **Vector Transfer:** If a player dashes into a portal, they must exit the other side with that same velocity and direction.
* **Visual Cue:** Use a "Radial Gradient" and particle effects to signal the entry/exit points.

### Dash Echoes (Ghost Trails)
* **Visual Polish:** Leave semi-transparent "ghosts" of the player's sprite behind during a dash.
* **Implementation:** Store coordinates in an array and render them with decreasing `globalAlpha`.

---

## 3. World Intelligence & Signposting

### Light Guidance
* **Signposting:** Use brighter colors or light sources (torches/glow-plants) to mark the entrance to "Hard Paths."
* **The Look Ahead:** The camera should always show more space in the direction the player is facing.

### Reactive Environment
* **Visual Feedback:** Grass that bends, vines that sway when dashed through, and pebbles that fall off "Useless Platforms" when landed on.
* **The Secret Loopback:** Occasionally design paths that look like dead ends but drop the player back into an earlier, safe part of the level.

---

## 4. Hazard Logic (Non-Combat)

### The 3-Beat Rule
* Never place more than three high-intensity obstacles in a row without a "Breather Platform" (a safe zone).

### Dash-Triggered Traps
* Platforms that only begin to crumble *after* a dash is detected within a certain proximity, forcing rapid reaction.
