# Arcade Hub Game Categories

This document defines the game categories, metadata structure, and tagging system for the Arcade Hub platform. These standards ensure consistent organization and discoverability of games.

## 1. Core Categories

### Arcade
Fast-paced, reflex-based games that typically feature simple mechanics but challenging gameplay.

**Examples:**
- Snake
- Breakout
- Space Invaders
- Racing games
- Platformers

**Key Characteristics:**
- Quick gameplay sessions
- Emphasis on reflexes and timing
- Often feature increasing difficulty
- Usually have simple controls
- Focus on high scores

### Puzzle
Games that challenge the player's problem-solving abilities, pattern recognition, or logical thinking.

**Examples:**
- Memory Match
- Sudoku
- Tetris
- Crosswords
- Block-sliding puzzles

**Key Characteristics:**
- Focus on mental challenge rather than reflexes
- Often have multiple difficulty levels
- Can be timed or untimed
- Usually have clear win conditions
- May feature procedurally generated content

### Strategy
Games that require planning, resource management, and thoughtful decision-making.

**Examples:**
- Chess
- Checkers
- Tower Defense
- Card games
- Resource management games

**Key Characteristics:**
- Emphasis on planning and foresight
- Often turn-based or allow for deliberate pacing
- May involve managing resources or units
- Usually have complex rule systems
- Can feature AI opponents of varying difficulty

### Educational
Games designed primarily to teach concepts or skills while entertaining.

**Examples:**
- Math Quiz
- Typing Tutor
- Geography games
- Language learning games
- Science simulations

**Key Characteristics:**
- Clear learning objectives
- Progression tied to mastery of concepts
- Balance between education and entertainment
- Often feature difficulty adaptation
- May include progress tracking

## 2. Metadata Structure

### Required Fields

Each game must include the following metadata:

| Field | Description | Type | Example |
|-------|-------------|------|---------|
| `id` | Unique identifier | String | `"snake"` |
| `title` | Display name | String | `"Snake"` |
| `description` | Short description | String | `"Classic snake game where you grow longer as you eat apples"` |
| `category` | Primary category | String | `"arcade"` |
| `tags` | Additional descriptors | Array | `["retro", "single-player", "keyboard"]` |
| `thumbnail` | Image path | String | `"/images/snake.jpg"` |
| `path` | Game directory | String | `"/games/snake/"` |
| `difficulty` | Difficulty level | String | `"easy"`, `"medium"`, or `"hard"` |
| `controls` | Control scheme | Object | `{"keyboard": true, "mouse": false, "touch": true}` |

### Optional Fields

Additional metadata that can enhance the game listing:

| Field | Description | Type | Example |
|-------|-------------|------|---------|
| `author` | Game creator | String | `"Jane Doe"` |
| `dateAdded` | Publication date | String | `"2025-03-09"` |
| `version` | Game version | String | `"1.0.0"` |
| `playTime` | Estimated play time | String | `"5-10 minutes"` |
| `features` | Special features | Array | `["high-scores", "multiplayer", "achievements"]` |
| `instructions` | Brief instructions | String | `"Use arrow keys to move the snake"` |

## 3. Tagging System

### Primary Tags (Game Mechanics)

- `action` - Fast-paced gameplay requiring quick reflexes
- `puzzle` - Problem-solving or pattern matching
- `strategy` - Planning and decision making
- `simulation` - Realistic simulation of activities or systems
- `educational` - Focus on learning and skill development
- `adventure` - Exploration and discovery
- `rpg` - Character progression and stats
- `shooter` - Shooting projectiles at targets
- `platformer` - Jumping between platforms
- `sports` - Based on real-world sports

### Secondary Tags (Features & Attributes)

#### Player Experience
- `single-player` - Designed for one player
- `multiplayer` - Supports multiple players
- `cooperative` - Players work together
- `competitive` - Players compete against each other
- `turn-based` - Players take turns
- `real-time` - Continuous gameplay

#### Technical Aspects
- `2d` - Two-dimensional graphics
- `3d` - Three-dimensional graphics
- `pixel-art` - Pixel-based art style
- `vector` - Vector-based graphics
- `physics` - Realistic physics simulation
- `procedural` - Procedurally generated content

#### Controls
- `keyboard` - Uses keyboard controls
- `mouse` - Uses mouse controls
- `touch` - Supports touchscreen
- `gamepad` - Supports gamepad/controller

#### Miscellaneous
- `retro` - Classic or vintage style
- `high-scores` - Features leaderboards
- `achievements` - Includes unlockable achievements
- `casual` - Easy to pick up and play
- `challenging` - Difficult or requires skill
- `short` - Can be completed quickly
- `endless` - No defined endpoint

## 4. Implementation

### Game Registry

Games are registered in a central array in `js/main.js`:

```javascript
const GAMES = [
  {
    id: "snake",
    title: "Snake",
    description: "Classic snake game where you grow longer as you eat apples",
    category: "arcade",
    tags: ["retro", "single-player", "keyboard"],
    thumbnail: "/images/snake.jpg",
    path: "/games/snake/",
    difficulty: "easy",
    controls: {
      keyboard: true,
      mouse: false,
      touch: true
    },
    author: "Arcade Hub Team",
    dateAdded: "2025-03-09",
    features: ["high-scores"]
  },
  // Additional games...
];
```

### Filtering Implementation

The main page uses JavaScript to filter games by category and tags:

```javascript
function filterGames(category, tags = []) {
  return GAMES.filter(game => {
    // If category is specified and doesn't match, exclude
    if (category && game.category !== category) return false;
    
    // If tags are specified, game must include ALL specified tags
    if (tags.length > 0) {
      return tags.every(tag => game.tags.includes(tag));
    }
    
    return true;
  });
}
```

### Adding New Games

To add a new game to the platform:

1. Create a new directory in `/games/[game-id]/`
2. Implement the game following the design principles
3. Add a thumbnail image to `/images/[game-id].jpg`
4. Add the game metadata to the `GAMES` array in `js/main.js`
5. Test filtering and display on the main page
