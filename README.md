# Arcade Hub

A lightweight, framework-free platform for hosting HTML5 games and web applications. Built with speed, simplicity, and beautiful UX in mind.

![Arcade Hub](https://via.placeholder.com/1200x630/6366F1/FFFFFF?text=Arcade+Hub)

## Features

- **Zero Build Step**: Pure HTML, CSS, and JavaScript - no frameworks or build tools required
- **Responsive Design**: Works beautifully on all devices from mobile to desktop
- **Fast Loading**: Minimal dependencies for lightning-fast performance
- **Game Features**: Built-in high score system with local storage
- **Social Sharing**: Easy sharing of games and scores
- **Beautiful UI**: Modern, clean interface with smooth animations
- **Easy to Extend**: Simple structure makes adding new games or apps straightforward
- **Development Tools**: Python-based tools for game creation and management

## Getting Started

### Local Development

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/arcade-hub.git
   cd arcade-hub
   ```

2. Set up the development environment:
   ```
   # JavaScript dependencies
   npm install
   
   # Python environment (optional, for development tools)
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

3. Serve the files with any static server:
   ```
   # Using the included script
   npm start
   
   # Or with Python
   python -m http.server
   ```

4. Visit `http://localhost:8000` (or the port shown in your terminal)

### Deployment

This project is designed to be deployed to Netlify:

1. Push your repository to GitHub
2. Connect your repository to Netlify
3. Configure the build settings:
   - Build command: (leave empty)
   - Publish directory: `/`

Alternatively, you can deploy to any static hosting service like GitHub Pages, Vercel, or Cloudflare Pages.

## Project Structure

```
arcade-hub/
├── index.html        # Main landing page
├── css/
│   └── style.css     # Custom styles
├── js/
│   └── main.js       # Shared JavaScript functionality
├── images/           # Game thumbnails and assets
├── games/            # Individual games
│   ├── snake/        # Example game: Snake
│   │   └── index.html
│   └── ...           # Add your own games here
├── docs/             # Documentation
│   ├── design_principles.md       # Design guidelines
│   ├── game_categories.md         # Game category definitions
│   ├── game_development_process.md # Development workflow
│   └── devlog.md                  # Development log
├── tools/            # Development tools
│   ├── game_helper.py             # Game scaffolding tool
│   └── game_idea_generator.py     # Game idea generation
├── proposals/        # Game proposals
└── netlify.toml      # Netlify configuration
```

## Documentation

The project includes comprehensive documentation:

- **Design Principles**: Visual design, code structure, and performance standards
- **Game Categories**: Defined categories, metadata structure, and tagging system
- **Game Development Process**: Ideation, development, testing, and publication workflow
- **Development Log**: Record of project changes and milestones

## Development Tools

### Game Helper Tool

Create a new game scaffold:

```bash
source venv/bin/activate
./tools/game_helper.py create tetris "Tetris" puzzle
```

Register a game in the main registry:

```bash
./tools/game_helper.py register tetris "Tetris" "Classic block-stacking puzzle game" puzzle --tags puzzle retro classic
```

### Game Idea Generator

Generate a game idea:

```bash
source venv/bin/activate
./tools/game_idea_generator.py --category arcade --print
```

## Adding a New Game

1. Generate a game idea (optional):
   ```
   ./tools/game_idea_generator.py --category puzzle
   ```

2. Create a game scaffold:
   ```
   ./tools/game_helper.py create your-game-id "Your Game Title" category
   ```

3. Implement your game in the created files
   
4. Register your game:
   ```
   ./tools/game_helper.py register your-game-id "Your Game Title" "Game description" category --tags tag1 tag2
   ```

5. For manual setup, see the [Game Development Process](docs/game_development_process.md)

## Customization

### Changing the Theme

Edit the CSS custom properties in `css/style.css` to change the colors:

```css
:root {
  --color-primary: #6366F1;
  --color-secondary: #EC4899;
  --color-dark: #111827;
  /* ... */
}
```

### Adding Categories

See the [Game Categories](docs/game_categories.md) documentation for details on adding new game categories.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Hero Icons](https://heroicons.com/) - Beautiful hand-crafted SVG icons
