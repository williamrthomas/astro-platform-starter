#!/usr/bin/env python
"""
Game Helper Tool for Arcade Hub

This script provides utilities for game development and management tasks.
"""

import os
import json
import shutil
import argparse
from datetime import datetime


def create_game_scaffold(game_id, title, category):
    """
    Create a new game scaffold with the basic file structure.
    
    Args:
        game_id (str): The unique identifier for the game (used for directory name)
        title (str): The display title of the game
        category (str): The primary category (arcade, puzzle, strategy, educational)
    
    Returns:
        bool: True if successful, False otherwise
    """
    # Validate inputs
    if not game_id or not title or not category:
        print("Error: game_id, title, and category are required")
        return False
    
    if category not in ["arcade", "puzzle", "strategy", "educational"]:
        print(f"Error: category must be one of: arcade, puzzle, strategy, educational")
        return False
    
    # Create game directory
    game_dir = os.path.join("games", game_id)
    if os.path.exists(game_dir):
        print(f"Error: Game directory {game_dir} already exists")
        return False
    
    os.makedirs(game_dir, exist_ok=True)
    
    # Create HTML file
    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} - Arcade Hub</title>
    <link rel="stylesheet" href="/css/style.css">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <a href="/" class="back-button">← Back to Arcade Hub</a>
        <h1>{title}</h1>
    </header>
    
    <main>
        <!-- Game container -->
        <div id="game-container">
            <!-- Game canvas or elements go here -->
        </div>
        
        <!-- Controls explanation -->
        <div class="controls-info">
            <h2>How to Play</h2>
            <p>Explain the controls and basic rules here.</p>
        </div>
    </main>
    
    <!-- Include the shared high score system -->
    <script src="/js/main.js"></script>
    <!-- Include your game script -->
    <script src="game.js"></script>
</body>
</html>
"""
    
    with open(os.path.join(game_dir, "index.html"), "w") as f:
        f.write(html_content)
    
    # Create JavaScript file
    js_content = f"""// {title} Game
// Created: {datetime.now().strftime('%Y-%m-%d')}

// Game configuration
const CONFIG = {{
    // Game-specific settings
    gameId: '{game_id}',
    title: '{title}',
    difficulty: 'medium'
}};

// Game state
let gameState = {{
    // Variables to track game state
    score: 0,
    isRunning: false,
    level: 1
}};

// Game initialization
function initGame() {{
    console.log('Initializing {title}...');
    // Setup code
    
    // Add event listeners
    document.addEventListener('keydown', handleInput);
    
    // Start the game
    startGame();
}}

// Start the game
function startGame() {{
    gameState.isRunning = true;
    gameState.score = 0;
    gameState.level = 1;
    
    // Start the game loop
    requestAnimationFrame(gameLoop);
}}

// Main game loop
function gameLoop() {{
    if (!gameState.isRunning) return;
    
    update();
    render();
    
    requestAnimationFrame(gameLoop);
}}

// Update game state
function update() {{
    // Update logic
}}

// Render game
function render() {{
    // Drawing code
}}

// Event handlers
function handleInput(event) {{
    // Input handling
    console.log('Key pressed:', event.key);
}}

// High score integration
function checkHighScore(score) {{
    if (HighScores.isHighScore(CONFIG.gameId, score)) {{
        HighScores.showHighScoreForm(CONFIG.gameId, score);
    }}
}}

// Initialize the game when the page loads
window.addEventListener('load', initGame);
"""
    
    with open(os.path.join(game_dir, "game.js"), "w") as f:
        f.write(js_content)
    
    # Create CSS file
    css_content = f"""/* Styles for {title} */

#game-container {{
    width: 100%;
    max-width: 800px;
    height: 500px;
    margin: 0 auto;
    background-color: #f0f0f0;
    border: 2px solid #333;
    border-radius: 8px;
    position: relative;
    overflow: hidden;
}}

.controls-info {{
    max-width: 800px;
    margin: 20px auto;
    padding: 15px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}}

/* Add your game-specific styles below */
"""
    
    with open(os.path.join(game_dir, "style.css"), "w") as f:
        f.write(css_content)
    
    # Create placeholder for thumbnail
    placeholder_dir = "images"
    os.makedirs(placeholder_dir, exist_ok=True)
    
    # We're not creating an actual image here, just noting that it's needed
    print(f"✓ Game scaffold created successfully in {game_dir}")
    print(f"! Don't forget to add a thumbnail image at: images/{game_id}.jpg")
    
    return True


def update_game_registry(game_id, title, description, category, tags=None):
    """
    Update the game registry in main.js with a new game entry.
    
    Args:
        game_id (str): The unique identifier for the game
        title (str): The display title of the game
        description (str): Short description of the game
        category (str): The primary category
        tags (list): List of tags for the game
    
    Returns:
        bool: True if successful, False otherwise
    """
    if tags is None:
        tags = []
    
    # Read the current main.js file
    try:
        with open("js/main.js", "r") as f:
            content = f.read()
    except FileNotFoundError:
        print("Error: js/main.js not found")
        return False
    
    # Check if GAMES array exists
    if "const GAMES = [" not in content:
        print("Error: GAMES array not found in js/main.js")
        return False
    
    # Create new game object
    game_entry = f"""  {{
    id: "{game_id}",
    title: "{title}",
    description: "{description}",
    category: "{category}",
    tags: {json.dumps(tags)},
    thumbnail: "/images/{game_id}.jpg",
    path: "/games/{game_id}/",
    difficulty: "medium",
    controls: {{
      keyboard: true,
      mouse: false,
      touch: true
    }},
    author: "Arcade Hub Team",
    dateAdded: "{datetime.now().strftime('%Y-%m-%d')}",
    features: ["high-scores"]
  }}"""
    
    # Find the position to insert the new game
    games_start = content.find("const GAMES = [")
    if games_start == -1:
        print("Error: Could not find GAMES array in js/main.js")
        return False
    
    # Find the first game entry or the end of the array
    games_content_start = games_start + len("const GAMES = [")
    
    # Check if there are existing games
    if content[games_content_start:].strip().startswith("{"):
        # There are existing games, add a comma after the last one
        game_entry = ",\n" + game_entry
    
    # Find the position to insert the new game (after the opening bracket)
    insert_pos = games_content_start
    
    # Create the new content
    new_content = content[:insert_pos] + game_entry + content[insert_pos:]
    
    # Write the updated content back to the file
    with open("js/main.js", "w") as f:
        f.write(new_content)
    
    print(f"✓ Game '{title}' added to the registry in js/main.js")
    return True


def main():
    """Main entry point for the script."""
    parser = argparse.ArgumentParser(description="Game Helper Tool for Arcade Hub")
    subparsers = parser.add_subparsers(dest="command", help="Command to run")
    
    # Create game scaffold command
    create_parser = subparsers.add_parser("create", help="Create a new game scaffold")
    create_parser.add_argument("game_id", help="Unique identifier for the game (used for directory name)")
    create_parser.add_argument("title", help="Display title of the game")
    create_parser.add_argument("category", choices=["arcade", "puzzle", "strategy", "educational"], 
                              help="Primary category of the game")
    
    # Register game command
    register_parser = subparsers.add_parser("register", help="Register a game in the main.js registry")
    register_parser.add_argument("game_id", help="Unique identifier for the game")
    register_parser.add_argument("title", help="Display title of the game")
    register_parser.add_argument("description", help="Short description of the game")
    register_parser.add_argument("category", choices=["arcade", "puzzle", "strategy", "educational"], 
                               help="Primary category of the game")
    register_parser.add_argument("--tags", nargs="+", default=[], 
                               help="Tags for the game (space-separated)")
    
    args = parser.parse_args()
    
    if args.command == "create":
        create_game_scaffold(args.game_id, args.title, args.category)
    elif args.command == "register":
        update_game_registry(args.game_id, args.title, args.description, args.category, args.tags)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
