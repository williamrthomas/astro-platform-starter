# Arcade Hub Design Principles

This document outlines the design principles and standards for the Arcade Hub platform. These principles guide our development process and ensure consistency across the platform.

## 1. Visual Design

### Color System

- **Primary Color**: `#6366F1` (Indigo)
- **Secondary Color**: `#EC4899` (Pink)
- **Dark Color**: `#111827` (Dark Gray)
- **Background Color**: `#F9FAFB` (Light Gray)
- **Text Colors**:
  - Primary Text: `#111827` (Dark Gray)
  - Secondary Text: `#6B7280` (Medium Gray)
  - Light Text: `#F9FAFB` (Light Gray)

#### Accessibility Guidelines
- Maintain a minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text
- Provide visual cues beyond color for interactive elements
- Test color combinations for color blindness compatibility

### Typography

- **Primary Font**: Inter (Sans-serif)
- **Font Sizes**:
  - Headings: 2rem (32px), 1.5rem (24px), 1.25rem (20px)
  - Body: 1rem (16px)
  - Small Text: 0.875rem (14px)
- **Font Weights**:
  - Regular: 400
  - Medium: 500
  - Bold: 700

### Layout Rules

- **Grid System**: 12-column grid for desktop layouts
- **Spacing Scale**:
  - xs: 0.25rem (4px)
  - sm: 0.5rem (8px)
  - md: 1rem (16px)
  - lg: 1.5rem (24px)
  - xl: 2rem (32px)
  - 2xl: 3rem (48px)
- **Responsive Breakpoints**:
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px

## 2. Code Structure

### File Organization

```
arcade-hub/
├── index.html        # Main landing page
├── css/              # Stylesheets
│   └── style.css     # Main stylesheet
├── js/               # JavaScript files
│   └── main.js       # Shared functionality
├── images/           # Game thumbnails and assets
├── games/            # Individual games
│   ├── [game-name]/  # Each game in its own directory
│   │   ├── index.html
│   │   ├── game.js
│   │   └── style.css (optional)
├── docs/             # Documentation
└── venv/             # Python virtual environment (not committed)
```

### Naming Conventions

- **Files**: Use lowercase with hyphens for spaces (kebab-case)
  - Example: `memory-match.js`, `high-scores.js`
- **CSS Classes**: Use lowercase with hyphens (kebab-case)
  - Example: `game-card`, `score-display`
- **JavaScript**:
  - Variables and functions: camelCase
  - Classes: PascalCase
  - Constants: UPPER_SNAKE_CASE

### Code Standards

- **HTML**:
  - Use semantic HTML5 elements
  - Include proper accessibility attributes
  - Validate HTML using W3C validator
- **CSS**:
  - Use CSS custom properties for theme values
  - Organize properties logically (positioning, box model, typography, visual)
  - Minimize nesting to avoid specificity issues
- **JavaScript**:
  - Follow ESLint recommended rules
  - Use ES6+ features when appropriate
  - Document functions with JSDoc comments
- **Python**:
  - Follow PEP 8 style guide
  - Use type hints when appropriate
  - Document functions with docstrings

## 3. Performance

### Loading Speed

- **Target Metrics**:
  - First Contentful Paint (FCP): < 1.8s
  - Largest Contentful Paint (LCP): < 2.5s
  - Time to Interactive (TTI): < 3.5s
- **Budget**:
  - Total page weight: < 500KB
  - JavaScript: < 150KB
  - CSS: < 50KB
  - Images: < 300KB

### Asset Optimization

- **Images**:
  - Use appropriate format (JPEG for photos, PNG for graphics with transparency, SVG for icons)
  - Compress all images
  - Implement responsive images with `srcset`
- **Code**:
  - Minify CSS and JavaScript for production
  - Remove unused CSS
  - Lazy load non-critical resources

### Performance Metrics

- **Core Web Vitals**:
  - LCP (Largest Contentful Paint): < 2.5s
  - FID (First Input Delay): < 100ms
  - CLS (Cumulative Layout Shift): < 0.1
- **Game Performance**:
  - Target 60fps for all animations
  - Input response time: < 50ms
  - Memory usage: Monitor and optimize

## 4. Game Development Standards

### Game Requirements

- **Responsive Design**: Games must work on mobile, tablet, and desktop
- **Accessibility**: Support keyboard navigation and screen readers where possible
- **Performance**: Maintain 60fps on mid-range devices
- **Offline Support**: Games should function without internet after initial load
- **High Score System**: Implement the standard high score API

### Testing Requirements

- **Browser Compatibility**: Test on Chrome, Firefox, Safari, and Edge
- **Device Testing**: Test on mobile, tablet, and desktop
- **Performance Testing**: Verify frame rate and loading time
- **Accessibility Testing**: Verify keyboard navigation and screen reader compatibility

### Documentation Requirements

- **Code Comments**: Document complex logic and functions
- **README**: Include setup instructions and game rules
- **Controls**: Clearly document game controls in-game
