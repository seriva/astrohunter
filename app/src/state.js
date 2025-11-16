// Base State class - all game states inherit from this.
export class State {
	constructor(game) {
		this.game = game;
	}

	Update() {}

	Draw() {}
}
