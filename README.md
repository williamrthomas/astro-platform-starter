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
- **Testing Framework**: Comprehensive Jest and Python unittest setup for quality assurance

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
├── tests/            # Testing framework
│   ├── README.md     # Detailed documentation on the testing framework
│   ├── js/           # JavaScript tests for frontend components
│   └── python/       # Python tests for development tools
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

## Testing

The project includes a comprehensive testing framework for both JavaScript and Python components:

### Running Tests

You can run all tests with a single command:

```bash
# Make sure your virtual environment is activated
source venv/bin/activate

# Run all tests
./run_tests.py
```

To run only JavaScript tests:

```bash
npm test
# or
./run_tests.py --js-only
```

To run only Python tests:

```bash
./run_tests.py --python-only
```

### Test Structure

- `tests/js/`: JavaScript tests for frontend components
- `tests/python/`: Python tests for development tools
- `tests/README.md`: Detailed documentation on the testing framework

### Adding New Tests

See the [Testing Documentation](tests/README.md) for details on adding new tests.

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
