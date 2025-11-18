// GameOverState - displays game over screen with final score.
import { Constants, IS_MOBILE, Keys } from "./constants.js";
import { State } from "./state.js";
import { States } from "./states.js";

export class GameOverState extends State {
	constructor(game) {
		super(game);
		this.input.ClearInputEvents();
		this.uiManager.ShowControlButtons(false);

		this._showPressSpace = true;
		this._showPressSpaceTimer = setInterval(() => {
			this._showPressSpace = !this._showPressSpace;
		}, Constants.TIMERS.PRESS_SPACE_BLINK);

		this.scoreManager.UpdateHighscore();

		const continueGame = () => {
			clearInterval(this._showPressSpaceTimer);
			this.game.SetState(States.START);
		};
		this.input.AddKeyDownEvent(Keys.SPACE, continueGame);
		if (IS_MOBILE) {
			this._setupMobileTouchHandler(continueGame);
		}
	}

	// Called when leaving this state - cleanup resources
	Exit() {
		clearInterval(this._showPressSpaceTimer);
	}

	// No updates needed for game over state.
	Update(_frameTime, _canvasWidth, _canvasHeight) {}

	// Draws game over screen with final score.
	Draw() {
		const textLines = [
			"game over!",
			`score : ${this.scoreManager.score}`,
			this._showPressSpace ? Constants.CONTINUE_TEXT : null,
		];
		this.canvas.DrawUIBox(textLines);
	}
}
