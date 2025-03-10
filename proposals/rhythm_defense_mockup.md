# Rhythm Defense: Visual Mockup

This document provides a visual representation of the Rhythm Defense game interface and key gameplay elements.

## Game Interface Layout

```
+--------------------------------------------------------------+
|                        RHYTHM DEFENSE                        |
+--------------------------------------------------------------+
| RESOURCES: 100  |  WAVE: 1/10  |  SCORE: 0  |  COMBO: 0x    |
+--------------------------------------------------------------+
|                                                              |
|  +--------------------------------------------------+        |
|  |                                                  |        |
|  |                                                  |        |
|  |                                                  |        |
|  |                GAME GRID (12x8)                  |        |
|  |                                                  |        |
|  |                                                  |        |
|  |                                                  |        |
|  +--------------------------------------------------+        |
|                                                              |
+--------------------------------------------------------------+
|                                                              |
|  [BEAM]  [PULSE]  [SHIELD]  [BOOST]     [PLAY/PAUSE] [MENU] |
|                                                              |
+--------------------------------------------------------------+
|                                                              |
|  |----|----|----|----|----|----|----|----|----|----|----|   |
|  |    |    |    |    |    |    |    |    |    |    |    |   |
|  |----|----|----|----|----|----|----|----|----|----|----|   |
|                                                              |
+--------------------------------------------------------------+
```

## Key UI Elements

### Top Bar
- Game title and logo
- Resource counter (for tower placement)
- Current wave indicator
- Score display
- Combo multiplier

### Game Grid
- 12x8 grid for tower placement
- Path visualization for enemy movement
- Tower placement indicators
- Enemy units with health bars

### Tower Selection
- Tower type buttons with icons and costs
- Selected tower highlight
- Tower upgrade options (when tower is selected)
- Tower activation keys (1-4)

### Rhythm Interface
- Beat timeline at bottom of screen
- Approaching beat markers
- Perfect/Good timing indicators
- Visual feedback for successful activations

### Game Controls
- Play/Pause button
- Menu button
- Volume controls
- Speed controls (normal/fast)

## Visual Style Examples

### Tower Designs

```
  BEAM TOWER          PULSE TOWER         SHIELD TOWER        BOOST TOWER
  
    ┌─┐                 ╭───╮               ╱‾‾‾‾╲               ┌┬┐
    │ │                ╱     ╲             ╱      ╲              │││
    │ │                │  •  │             │  ][  │              │││
    │ │                ╲     ╱             ╲      ╱              │││
    └─┘                 ╰───╯               ╲____╱               └┴┘
  
  Straight line       Area effect         Defensive           Enhances
  damage              damage              barrier             nearby towers
```

### Enemy Types

```
  RUNNER              TANK                FLYER               BOSS
  
    ◇                   ■                   ▲                  ╔═╗
   ╱ ╲                 ╔═╗                 ╱ ╲                 ║█║
   ╲_╱                 ║█║                ╱___╲                ╚═╝
                       ╚═╝
  
  Fast but             Slow with           Bypasses            Large with
  fragile              high health         obstacles           special abilities
```

### Beat Visualization

```
Timeline:
|----|----|----|----|----|----|----|----|----|----|----|----|

Approaching beats:
|----|----|----|----|--●-|--○-|----|----|----|----|----|----| 
                       ^    ^
                    Perfect Good
                     Zone  Zone

Activation feedback:
|----|----|----|----|--✓-|----|----|----|----|----|----|----|
                      ^
                   PERFECT!
```

## Game States

### Main Menu
- Game logo
- Play button
- Tutorial option
- High scores
- Settings

### Game Over Screen
- Final score
- Wave reached
- High score entry (if applicable)
- Retry button
- Return to menu button

### Level Complete
- Score summary
- Combo statistics
- Next level button
- Return to menu button

## Animation Concepts

### Tower Activation
1. Tower glows with increasing intensity as beat approaches
2. Player hits key at correct time
3. Tower flashes and emits attack animation
4. Damage numbers appear over enemies
5. Combo counter updates

### Enemy Defeat
1. Enemy flashes when taking damage
2. Health bar decreases
3. When health reaches zero, enemy plays defeat animation
4. Particle effects show explosion/disappearance
5. Score increase floats upward from defeated enemy

### Beat Synchronization
1. Background elements pulse with the beat
2. Tower activation effects sync with music
3. Enemy movement patterns follow musical phrases
4. UI elements subtly animate with rhythm

## Color Scheme

Following the Arcade Hub design principles:

- Primary Color: `#6366F1` (Indigo) - Used for UI elements and highlights
- Secondary Color: `#EC4899` (Pink) - Used for beat markers and special effects
- Dark Color: `#111827` (Dark Gray) - Used for background and UI borders
- Background Color: `#F9FAFB` (Light Gray) - Used for game grid

Tower colors:
- Beam Tower: Blue (`#3B82F6`)
- Pulse Tower: Purple (`#8B5CF6`)
- Shield Tower: Green (`#10B981`)
- Boost Tower: Yellow (`#F59E0B`)

Enemy colors:
- Runner: Red (`#EF4444`)
- Tank: Brown (`#92400E`)
- Flyer: Cyan (`#06B6D4`)
- Boss: Orange (`#F97316`)

## Responsive Design

### Mobile Layout
- Tower selection moves to side panel
- Beat timeline remains at bottom but larger touch targets
- Simplified UI with expandable menus
- Touch controls optimized for smaller screens

### Tablet Layout
- Similar to desktop but with adjusted proportions
- Touch targets sized appropriately
- Optional on-screen controls

### Desktop Layout
- Full interface as shown in main mockup
- Keyboard controls
- Detailed visual effects
