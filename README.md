## About

This is just another clone of the famous Asteroid game. I wrote it to get myself familiar with JavaScript when I was starting frontend development. Originally written in pure ES5, it has been modernized to use ES6 modules and microtastic for development and building.

Later on I added onscreen controls for mobile browsers and leveraged Cordova to deploy it as a standalone application on Android.

## Features

- **Classic Asteroids Gameplay**: Navigate your ship, shoot asteroids, and avoid collisions
- **Mobile Support**: Touch controls optimized for mobile devices
- **Sound Effects**: Background music and sound effects for enhanced gameplay
- **Progressive Difficulty**: Multiple waves with increasing challenge
- **Responsive Design**: Adapts to different screen sizes
- **Cross-Platform**: Works in browsers and as a native Android app

## Tech Stack

- **Language**: ES6 JavaScript with modules
- **Rendering**: HTML5 Canvas
- **Build Tool**: Microtastic (ES6 module bundler)
- **Mobile Framework**: Apache Cordova/PhoneGap (optional)
- **Architecture**: ES6 classes with game states
- **Audio**: Web Audio API with OGG format support
- **Controls**: Keyboard and touch input support

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Development
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser to the URL shown (typically `http://localhost:3000`)
5. Start playing!

### Production Build
1. Build for production:
   ```bash
   npm run prod
   ```
2. The production-ready files will be in the `public/` directory
3. Serve the `public/` directory with any static file server

### Android App (Optional)
1. Install Cordova CLI: `npm install -g cordova`
2. Add Android platform: `cordova platform add android`
3. Build the app: `cordova build android`
4. Install on device: `cordova run android`

## Usage

### Desktop Controls
- **Arrow Keys**: Rotate and thrust
- **Spacebar**: Fire bullets
- **Spacebar**: Start game / Continue

### Mobile Controls
- **Touch Buttons**: On-screen controls for movement and firing
- **Tap**: Start game / Continue

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
│   │   └── ...             # Other game modules
│   ├── sounds/             # Audio files
│   ├── images/             # Game assets
│   └── index.html          # Main entry point
├── public/                  # Production build output (generated)
├── package.json            # npm configuration
└── README.md               # This file
```

## Development Scripts

- `npm run dev` - Start development server with hot reload
- `npm run prod` - Build optimized production bundle
- `npm run build` - Alias for `npm run prod`
- `npm start` - Alias for `npm run dev`

### Code Quality

- `npm run lint` - Run Biome linter
- `npm run lint:fix` - Run Biome linter and auto-fix issues
- `npm run format` - Format code with Biome
- `npm run check` - Check code formatting, linting, and import sorting
- `npm run check:fix` - Check and auto-fix all issues

### Git Hooks

This project uses [Husky](https://typicode.github.io/husky/) for Git hooks. The pre-commit hook automatically runs `npm run check` to ensure code quality before commits. If the check fails, the commit will be blocked until issues are resolved.
