// Main entry point - initializes service worker and starts the game
import { Game } from "./game.js";
import { registerServiceWorker } from "./sw-registration.js";
import { preventScrollKeys } from "./utils.js";

// Register service worker for PWA
registerServiceWorker();

// Prevent arrow keys and space from scrolling the page
preventScrollKeys();

// Initialize and run the game
const game = new Game();
game.Run();
