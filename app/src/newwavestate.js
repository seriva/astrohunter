// NewWaveState - countdown screen between waves.
import { Constants } from "./constants.js";
import { State } from "./state.js";
import { States } from "./states.js";

export class NewWaveState extends State {
	constructor(game) {
		super(game);
		this.game.input.ClearInputEvents();
		this.game.ShowControlButtons(false);

		this.countDown = Constants.MATH.MAX_ASTEROID_TYPE;
		this.game.asteroidCount = this.game.asteroidCount + Constants.WAVE_INC;
		this.newWaveTimer = setInterval(() => {
			this.countDown--;
			if (this.countDown === 0) {
				clearInterval(this.newWaveTimer);
				this.game.SetState(States.GAME);
			}
		}, Constants.TIMERS.WAVE_COUNTDOWN);
	}

	// No updates needed for new wave state.
	Update() {}

	// Draws countdown screen for next wave.
	Draw() {
		const centerX = this.game.canvas.GetCenterX();
		const centerY = this.game.canvas.GetCenterY();
		const boxDims = this.game.canvas.GetUIBoxDimensions();
		const offsetScale = this.game.canvas.GetBoxOffsetScale(boxDims);
		this.game.canvas.DrawUIBox(centerX, centerY, "", 0, 0, boxDims);
		// Calculate font size that fits within the box
		const textSize = this.game.canvas.GetFontSizeForBox(
			boxDims.width,
			boxDims.height,
			50,
		);
		this.game.canvas.DrawText(
			"new wave in",
			centerX,
			centerY + Constants.TEXT_OFFSET.SMALL_OFFSET * offsetScale,
			textSize,
			"center",
			false,
		);
		this.game.canvas.DrawText(
			`${this.countDown}`,
			centerX,
			centerY + Constants.TEXT_OFFSET.SMALL_OFFSET_POS * offsetScale,
			textSize,
			"center",
			false,
		);
	}
}
