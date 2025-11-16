// GameOverState - displays game over screen with final score.
import { Constants, Keys } from "./constants.js";
import { State } from "./state.js";
import { States } from "./states.js";
import { mobileAndTabletcheck } from "./utils.js";

export class GameOverState extends State {
	constructor(game) {
		super(game);
		this.game.input.ClearInputEvents();
		this.game.ShowControlButtons(false);

		this.showPressSpace = true;
		this.showPressSpaceTimer = setInterval(() => {
			this.showPressSpace = !this.showPressSpace;
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
			clearInterval(this.showPressSpace);
			this.game.SetState(States.START);
			if (mobileAndTabletcheck()) {
				this.game.canvas.element.removeEventListener(
					"touchend",
					continueGame,
					false,
				);
				e.preventDefault();
			}
		};
		this.game.input.AddKeyDownEvent(Keys.SPACE, continueGame);
		if (mobileAndTabletcheck()) {
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
		const centerX = this.game.canvas.logicalWidth / 2;
		const centerY = this.game.canvas.logicalHeight / 2;
		this.game.canvas.DrawUIBox(centerX, centerY, "", 0);
		this.game.canvas.DrawText(
			"game over!",
			centerX,
			centerY + Constants.TEXT_OFFSET.TOP,
			70,
			"center",
		);
		this.game.canvas.DrawText(
			`score : ${this.game.score}`,
			centerX,
			centerY + Constants.TEXT_OFFSET.CENTER,
			40,
			"center",
		);
		if (this.showPressSpace) {
			this.game.canvas.DrawText(
				Constants.CONTINUE_TEXT,
				centerX,
				centerY + Constants.TEXT_OFFSET.BOTTOM,
				40,
				"center",
			);
		}
	}
}
