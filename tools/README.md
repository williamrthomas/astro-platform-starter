# Arcade Hub Development Tools

This directory contains tools to assist with the development and management of the Arcade Hub platform.

## Game Helper Tool

The `game_helper.py` script provides utilities for game development and management tasks.

### Prerequisites

- Python 3.6 or higher
- Activate the virtual environment:
  ```
  source ../venv/bin/activate
  ```

### Usage

#### Create a New Game Scaffold

Creates the basic file structure for a new game, including HTML, JavaScript, and CSS files.

```bash
./game_helper.py create <game_id> "<title>" <category>
```

Example:
```bash
./game_helper.py create tetris "Tetris" puzzle
```

This will create:
- `games/tetris/index.html`
- `games/tetris/game.js`
- `games/tetris/style.css`

#### Register a Game in the Registry

Adds a game to the main registry in `js/main.js`.

```bash
./game_helper.py register <game_id> "<title>" "<description>" <category> --tags <tag1> <tag2> ...
```

Example:
```bash
./game_helper.py register tetris "Tetris" "Classic block-stacking puzzle game" puzzle --tags puzzle retro classic
```

### Help

For more information on available commands:

```bash
./game_helper.py --help
```

For help with a specific command:

```bash
./game_helper.py create --help
./game_helper.py register --help
```

## Game Idea Generator Tool

The `game_idea_generator.py` script provides a simple way to generate game ideas. Currently, it uses a set of predefined templates, but future versions will incorporate AI for more creative and detailed game concepts.

### Usage

Generate a random game idea:

```bash
./game_idea_generator.py
```

Filter by category:

```bash
./game_idea_generator.py --category arcade
```

Filter by complexity:

```bash
./game_idea_generator.py --complexity medium
```

Print the proposal to the console:

```bash
./game_idea_generator.py --print
```

Specify an output filename:

```bash
./game_idea_generator.py --output my_game_idea.md
```

### Help

For more information:

```bash
./game_idea_generator.py --help
```

## Future Tools

Additional tools planned for future development:

1. **Game Tester**: Automated testing for games
2. **Asset Optimizer**: Optimize images and other assets
3. **Performance Analyzer**: Analyze game performance
