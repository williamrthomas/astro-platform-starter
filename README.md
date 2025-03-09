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

## Getting Started

### Local Development

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/arcade-hub.git
   cd arcade-hub
   ```

2. Serve the files with any static server. For example, using Python:
   ```
   python -m http.server
   ```
   
   Or with Node.js:
   ```
   npx serve
   ```

3. Visit `http://localhost:8000` (or the port shown in your terminal)

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
└── netlify.toml      # Netlify configuration
```

## Adding a New Game

1. Create a new folder in the `games` directory:
   ```
   mkdir games/your-game-name
   ```

2. Create an `index.html` file in your game folder with your game code
3. To use the built-in high score system, include the main.js file:
   ```html
   <script src="/js/main.js"></script>
   ```
4. Use the HighScores API in your game:
   ```javascript
   // Check if a score is a high score
   if (HighScores.isHighScore('your-game-id', score)) {
     // Show high score input form
     HighScores.showHighScoreForm('your-game-id', score);
   }
   
   // Display high scores
   HighScores.showHighScores('your-game-id');
   ```
5. Add your game to the array in `index.html`

## Customization

### Changing the Theme

Edit the Tailwind configuration in `index.html` to change the primary and secondary colors:

```javascript
tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary: '#6366F1',   // Change this for primary color
        secondary: '#EC4899', // Change this for secondary color
        dark: '#111827',
      },
      // ...
    }
  }
}
```

### Adding Categories

To add new categories beyond 'game' and 'app', modify the filter buttons in `index.html` and update your game objects with the new category.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Alpine.js](https://alpinejs.dev/) - Lightweight JavaScript framework
- [Hero Icons](https://heroicons.com/) - Beautiful hand-crafted SVG icons
