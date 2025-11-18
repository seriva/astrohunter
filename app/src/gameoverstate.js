// GameOverState - displays game over screen with final score.
import { Constants, IS_MOBILE, Keys } from "./constants.js";
import { State } from "./state.js";
import { States } from "./states.js";

export class GameOverState extends State {
	constructor(game) {
		super(game);
		this.game.input.ClearInputEvents();
		this.game.ShowControlButtons(false);

		this._showPressSpace = true;
		this._showPressSpaceTimer = setInterval(() => {
			this._showPressSpace = !this._showPressSpace;
		}, Constants.TIMERS.PRESS_SPACE_BLINK);

		if (this.game.score > this.game.highscore) {
			this.game.highscore = this.game.score;
			try {
				localStorage.highscore = this.game.highscore.toString();
			} catch (_e) {
				// localStorage not available or quota exceeded
			}
		}

		const continueGame = (e) => {
			clearInterval(this._showPressSpaceTimer);
			this.game.SetState(States.START);
			if (IS_MOBILE && e) {
				this.game.canvas.element.removeEventListener(
					"touchstart",
					continueGame,
					false,
				);
				this.game.canvas.element.removeEventListener(
					"touchend",
					continueGame,
					false,
				);
				e.preventDefault();
			}
		};
		this.game.input.AddKeyDownEvent(Keys.SPACE, continueGame);
		if (IS_MOBILE) {
			this.game.canvas.element.addEventListener(
				"touchstart",
				continueGame,
				false,
			);
			this.game.canvas.element.addEventListener(
				"touchend",
				continueGame,
				false,
			);
		}
	}

	// No updates needed for game over state.
	Update() {}

	// Draws game over screen with final score.
	Draw() {
		const textLines = [
			"game over!",
			`score : ${this.game.score}`,
			this._showPressSpace ? Constants.CONTINUE_TEXT : null,
		];
		this.game.canvas.DrawUIBox(textLines);
	}
}
