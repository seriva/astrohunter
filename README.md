## About

This is just another clone of the famous Asteroid game. Originally written in pure ES5, it has been modernized to use ES6 modules, microtastic for development and building, and configured as a Progressive Web App (PWA).

The game features onscreen controls for mobile browsers and can be installed as a standalone application on mobile devices and desktops.

**Note**: This project is no longer actively maintained or updated.

## Features

- **Classic Asteroids Gameplay**: Navigate your ship, shoot asteroids, and avoid collisions
- **Progressive Web App (PWA)**: Installable on mobile devices and desktops with offline support
- **Mobile Support**: Touch controls optimized for mobile devices with HUD tap-to-pause
- **Pause Functionality**: Pause gameplay anytime (P/ESC on desktop, HUD tap on mobile)
- **Sound Effects**: Background music and sound effects for enhanced gameplay
- **Progressive Difficulty**: Multiple waves with increasing challenge
- **Responsive Design**: Adapts to different screen sizes
- **Modern JavaScript**: Built with ES6 modules and classes
- **Code Quality**: Automated linting and formatting with Biome

## Tech Stack

- **Language**: ES6+ JavaScript with ES6 modules
- **Rendering**: HTML5 Canvas
- **Build Tool**: [Microtastic](https://www.npmjs.com/package/microtastic) - ES6 module bundler
- **Code Quality**: [Biome](https://biomejs.dev/) - Fast formatter and linter
- **Git Hooks**: [Husky](https://typicode.github.io/husky/) - Pre-commit code quality checks
- **Architecture**: ES6 classes with game state management
- **PWA**: Service worker for offline support and installability
- **Audio**: Web Audio API with OGG format support
- **Controls**: Keyboard and touch input support

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Development
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd astrohunter
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The server will start on `http://localhost:8181` (default microtastic port)

4. Open your browser and start playing!

### Production Build
1. Build for production (includes code quality checks):
   ```bash
   npm run prod
   ```
   This will:
   - Run Biome code quality checks
   - Build optimized bundle with microtastic
   - Generate service worker for PWA
   - Output to `public/` directory

2. Serve the `public/` directory with any static file server:
   ```bash
   # Using Python
   cd public && python3 -m http.server 8000
   
   # Using Node.js http-server
   npx http-server public -p 8000
   ```
   
   **Note**: Service workers require HTTPS or localhost to function properly.

## Usage

### Desktop Controls
- **Arrow Keys**: Rotate and thrust
- **Spacebar**: Fire bullets
- **P or ESC**: Pause game
- **Spacebar**: Start game / Continue

### Mobile Controls
- **Touch Buttons**: On-screen controls for movement and firing
- **Tap HUD (top area)**: Pause/unpause game
- **Tap Screen**: Start game / Continue

### Gameplay
- Destroy all asteroids to advance to the next wave
- Avoid collisions with asteroids
- Use thrust and rotation to navigate
- Collect points for destroying asteroids of different sizes

## Project Structure

```
astrohunter/
├── app/                    # Source files
│   ├── css/                # Stylesheets
│   ├── src/                # ES6 module source code
│   │   ├── main.js         # Main game controller
│   │   ├── ship.js         # Player ship
│   │   ├── asteroid.js     # Asteroid entities
│   │   ├── bullet.js       # Bullet system
│   │   ├── states.js       # Game state constants
│   │   ├── entity.js       # Base entity class
│   │   ├── vector.js       # Vector math utilities
│   │   └── ...             # Other game modules
│   ├── icons/              # PWA icons and favicons
│   │   ├── favicon.ico     # Standard favicon
│   │   ├── favicon-*.png   # Favicon sizes
│   │   └── icon-*.png      # PWA app icons
│   ├── sounds/             # Audio files
│   ├── images/             # Game assets
│   ├── manifest.json       # PWA manifest
│   └── index.html          # Main entry point
├── public/                 # Production build output (generated)
│   ├── sw.js               # Service worker (auto-generated)
│   └── ...                 # Built and optimized files
├── .husky/                 # Git hooks configuration
├── biome.json              # Biome code quality configuration
├── .microtastic            # Microtastic build configuration
├── package.json            # npm configuration
└── README.md               # This file
```

## Development Scripts

### Build & Development
- `npm run dev` - Start development server with hot reload (port 8181)
- `npm run prod` - Build optimized production bundle (runs code checks first)
- `npm start` - Alias for `npm run dev`
- `npm run dependencies` - Prepare microtastic dependencies

### Code Quality

- `npm run check` - Check code formatting, linting, and import sorting
- `npm run format` - Format code with Biome
- `npm run prepare` - Initialize Husky and microtastic (runs automatically on `npm install`)

### Git Hooks

This project uses [Husky](https://typicode.github.io/husky/) for Git hooks. The pre-commit hook automatically runs `npm run check` to ensure code quality before commits. If the check fails, the commit will be blocked until issues are resolved.

**Note**: Code quality checks are enforced automatically. Fix issues with `npm run format` or manually address linting errors.

## Progressive Web App (PWA)

This game is configured as a Progressive Web App with offline support, installability, and all required icons. The service worker (auto-generated by microtastic) caches game assets for offline play. To test, build with `npm run prod`, serve the `public/` directory over HTTPS or localhost, and check the install prompt in Chrome/Edge.
