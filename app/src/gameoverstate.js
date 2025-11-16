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

	Update() {}

	Draw() {
		this.game.canvas.DrawRect(88, 116, 725, 250, "#000000", "#ffffff", "3");
		this.game.canvas.DrawText("game over!", 450, 210, 70, "center");
		this.game.canvas.DrawText(
			`score : ${this.game.score}`,
			450,
			276,
			40,
			"center",
		);
		if (this.showPressSpace) {
			this.game.canvas.DrawText(
				Constants.CONTINUE_TEXT,
				450,
				342,
				40,
				"center",
			);
		}
	}
}
