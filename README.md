## About

This is just another clone of the famous Asteroid game. I wrote it to get myself familiar with JavaScript when I was starting frontend development. It is written in pure ES5 and uses the HTML5 canvas for rendering.

Later on I added onscreen controls for mobile browsers and leveraged Cordova to deploy it as a standalone application on Android. 

**Note**: Currently all work on this project has stopped and it will not be updated anymore.

## Features

- **Classic Asteroids Gameplay**: Navigate your ship, shoot asteroids, and avoid collisions
- **Mobile Support**: Touch controls optimized for mobile devices
- **Sound Effects**: Background music and sound effects for enhanced gameplay
- **Progressive Difficulty**: Multiple waves with increasing challenge
- **Responsive Design**: Adapts to different screen sizes
- **Cross-Platform**: Works in browsers and as a native Android app

## Tech Stack

- **Language**: Pure ES5 JavaScript
- **Rendering**: HTML5 Canvas
- **Mobile Framework**: Apache Cordova/PhoneGap
- **Architecture**: Object-oriented with game states
- **Audio**: Web Audio API with OGG format support
- **Controls**: Keyboard and touch input support

## Quick Start

### Web Version
1. Clone the repository
2. Open `www/index.html` in a web browser
3. Start playing!

### Android App
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
www/
├── css/           # Stylesheets
├── js/            # Game logic
│   ├── main.js    # Main game controller
│   ├── ship.js    # Player ship
│   ├── asteroid.js # Asteroid entities
│   ├── bullet.js  # Bullet system
│   └── ...
├── sounds/        # Audio files
├── images/        # Game assets
└── index.html     # Main entry point
```
