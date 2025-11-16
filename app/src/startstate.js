import { Asteroid } from "./asteroid.js";
import { Constants } from "./constants.js";
import { State } from "./state.js";
import { States } from "./states.js";
import { mobileAndTabletcheck } from "./utils.js";
import { Vector } from "./vector.js";

export class StartState extends State {
	constructor(game) {
		super(game);
		this.game.input.ClearInputEvents();

		this.game.score = 0;
		this.game.ships = Constants.SHIPS;
		this.game.asteroidCount = Constants.WAVE_START;
		this.game.ShowControlButtons(false);

		this.asteroids = {};
		for (let i = 0; i < 20; i++) {
			const dir = new Vector(0, 1);
			dir.Rotate(Math.random() * 360);
			this.asteroids[i] = new Asteroid(
				i,
				Math.floor(Math.random() * 3),
				Math.random() * Constants.SCR_WIDTH,
				Math.random() * Constants.SCR_HEIGHT,
				dir.x,
				dir.y,
			);
		}

		this.showPressSpace = true;
		this.showPressSpaceTimer = setInterval(() => {
			this.showPressSpace = !this.showPressSpace;
		}, 800);

		const continueGame = (e) => {
			clearInterval(this.showPressSpace);
			this.game.SetState(States.GAME);
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

	Update() {
		Object.keys(this.asteroids).forEach((key) => {
			this.asteroids[key].Update(this.game.frameTime);
		});
		this.game.DoAsteroidColisions(this.asteroids);
	}

	Draw() {
		Object.keys(this.asteroids).forEach((key) => {
			this.asteroids[key].Draw(this.game.canvas);
		});
		this.game.canvas.DrawRect(88, 116, 725, 250, "#000000", "#ffffff", "3");
		this.game.canvas.DrawText("astrohunter", 450, 210, 80, "center");
		this.game.canvas.DrawText(
			`highscore : ${this.game.highscore}`,
			450,
			276,
			40,
			"center",
		);
		if (this.showPressSpace) {
			this.game.canvas.DrawText(Constants.START_TEXT, 450, 342, 40, "center");
		}
	}
}
