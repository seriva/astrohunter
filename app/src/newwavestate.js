import { Constants } from "./constants.js";
import { State } from "./state.js";
import { States } from "./states.js";

export class NewWaveState extends State {
	constructor(game) {
		super(game);
		this.game.input.ClearInputEvents();
		this.game.ShowControlButtons(false);

		this.countDown = 3;
		this.game.asteroidCount = this.game.asteroidCount + Constants.WAVE_INC;
		this.newWaveTimer = setInterval(() => {
			this.countDown--;
			if (this.countDown === 0) {
				clearInterval(this.newWaveTimer);
				this.game.SetState(States.GAME);
			}
		}, 1000);
	}

	Update() {}

	Draw() {
		const centerX = this.game.canvas.logicalWidth / 2;
		const centerY = this.game.canvas.logicalHeight / 2;
		const boxWidth = Math.min(725, this.game.canvas.logicalWidth * 0.8);
		const boxHeight = Math.min(250, this.game.canvas.logicalHeight * 0.5);
		this.game.canvas.DrawRect(
			centerX - boxWidth / 2,
			centerY - boxHeight / 2,
			boxWidth,
			boxHeight,
			"#000000",
			"#ffffff",
			"3",
		);
		this.game.canvas.DrawText(
			"new wave in",
			centerX,
			centerY - 30,
			50,
			"center",
		);
		this.game.canvas.DrawText(
			`${this.countDown}`,
			centerX,
			centerY + 30,
			50,
			"center",
		);
	}
}
