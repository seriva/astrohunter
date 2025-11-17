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
			if (IS_MOBILE) {
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
		const centerX = this.game.canvas.GetCenterX();
		const centerY = this.game.canvas.GetCenterY();
		const boxDims = this.game.canvas.GetUIBoxDimensions();
		const offsetScale = this.game.canvas.GetBoxOffsetScale(boxDims);
		this.game.canvas.DrawUIBox(centerX, centerY, "", 0, 0, boxDims);
		// Calculate font sizes that fit within the box
		const titleSize = this.game.canvas.GetFontSizeForBox(
			boxDims.width,
			boxDims.height,
			70,
		);
		const textSize = this.game.canvas.GetFontSizeForBox(
			boxDims.width,
			boxDims.height,
			40,
		);
		this.game.canvas.DrawText(
			"game over!",
			centerX,
			centerY + Constants.TEXT_OFFSET.TOP * offsetScale,
			titleSize,
			"center",
			false,
		);
		this.game.canvas.DrawText(
			`score : ${this.game.score}`,
			centerX,
			centerY + Constants.TEXT_OFFSET.CENTER * offsetScale,
			textSize,
			"center",
			false,
		);
		if (this._showPressSpace)
			this.game.canvas.DrawText(
				Constants.CONTINUE_TEXT,
				centerX,
				centerY + Constants.TEXT_OFFSET.BOTTOM * offsetScale,
				textSize,
				"center",
				false,
			);
	}
}
