// NewWaveState - countdown screen between waves.
import { Constants } from "./constants.js";
import { State } from "./state.js";
import { States } from "./states.js";

export class NewWaveState extends State {
	constructor(game) {
		super(game);
		this.input.ClearInputEvents();
		this.uiManager.ShowControlButtons(false);

		this._countDown = Constants.MATH.MAX_ASTEROID_TYPE;
		this.scoreManager.NextWave();
		this._newWaveTimer = setInterval(() => {
			this._countDown--;
			if (this._countDown === 0) {
				clearInterval(this._newWaveTimer);
				this.game.SetState(States.GAME);
			}
		}, Constants.TIMERS.WAVE_COUNTDOWN);
	}

	// Called when leaving this state - cleanup resources
	Exit() {
		clearInterval(this._newWaveTimer);
	}

	// No updates needed for new wave state.
	Update(_frameTime, _canvasWidth, _canvasHeight) {}

	// Draws countdown screen for next wave.
	Draw() {
		const textLines = ["new wave in", `${this._countDown}`];
		this.canvas.DrawUIBox(textLines);
	}
}
