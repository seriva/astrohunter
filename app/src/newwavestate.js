// NewWaveState - countdown screen between waves.
import { Constants } from "./constants.js";
import { State } from "./state.js";
import { States } from "./states.js";

export class NewWaveState extends State {
	constructor(game) {
		super(game);
		this.game.input.ClearInputEvents();
		this.game.ShowControlButtons(false);

		this._countDown = Constants.MATH.MAX_ASTEROID_TYPE;
		this.game.asteroidCount = this.game.asteroidCount + Constants.WAVE_INC;
		this._newWaveTimer = setInterval(() => {
			this._countDown--;
			if (this._countDown === 0) {
				clearInterval(this._newWaveTimer);
				this.game.SetState(States.GAME);
			}
		}, Constants.TIMERS.WAVE_COUNTDOWN);
	}

	// No updates needed for new wave state.
	Update() {}

	// Draws countdown screen for next wave.
	Draw() {
		const textLines = ["new wave in", `${this._countDown}`];
		this.game.canvas.DrawUIBox(textLines);
	}
}
