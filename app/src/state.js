// Base State class - all game states inherit from this.
export class State {
	constructor(game) {
		this.game = game;
		// Cache frequently accessed game properties to reduce coupling
		this.canvas = game.canvas;
		this.input = game.input;
		this.sound = game.sound;
		this.scoreManager = game.scoreManager;
		this.uiManager = game.uiManager;
	}

	// Called when state becomes active
	Enter() {}

	// Called before state is destroyed
	Exit() {}

	// Update state - frameTime, canvasWidth and canvasHeight are cached once per frame
	Update(_frameTime, _canvasWidth, _canvasHeight) {}

	Draw() {}

	// Helper: Set up mobile touch events that auto-cleanup
	_setupMobileTouchHandler(callback) {
		const handler = (e) => {
			callback();
			this.canvas.element.removeEventListener("touchstart", handler, false);
			this.canvas.element.removeEventListener("touchend", handler, false);
			e.preventDefault();
		};
		this.canvas.element.addEventListener("touchstart", handler, false);
		this.canvas.element.addEventListener("touchend", handler, false);
	}
}
