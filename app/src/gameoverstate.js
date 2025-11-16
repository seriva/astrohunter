// GameOverState - displays game over screen with final score.
import { Constants } from "./constants.js";
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
		}, 800);

		if (this.game.score > this.game.highscore) {
			this.game.highscore = this.game.score;
			localStorage.highscore = this.game.highscore;
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
		this.game.input.AddKeyDownEvent(32, continueGame);
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
			"game over!",
			centerX,
			centerY - 60,
			70,
			"center",
		);
		this.game.canvas.DrawText(
			`score : ${this.game.score}`,
			centerX,
			centerY,
			40,
			"center",
		);
		if (this.showPressSpace) {
			this.game.canvas.DrawText(
				Constants.CONTINUE_TEXT,
				centerX,
				centerY + 60,
				40,
				"center",
			);
		}
	}
}
