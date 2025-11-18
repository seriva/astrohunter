// Base State class - all game states inherit from this.
export class State {
	constructor(game) {
		this.game = game;
	}

	Update() {}

	Draw() {}

	// Helper: Set up mobile touch events that auto-cleanup
	_setupMobileTouchHandler(callback) {
		const handler = (e) => {
			callback();
			this.game.canvas.element.removeEventListener(
				"touchstart",
				handler,
				false,
			);
			this.game.canvas.element.removeEventListener("touchend", handler, false);
			e.preventDefault();
		};
		this.game.canvas.element.addEventListener("touchstart", handler, false);
		this.game.canvas.element.addEventListener("touchend", handler, false);
	}
}
