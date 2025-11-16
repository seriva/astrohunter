// StartState - title screen with animated asteroids and start prompt.
import { Asteroid } from "./asteroid.js";
import { Constants, Keys } from "./constants.js";
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
		for (let i = 0; i < Constants.ASTEROID_START_SCREEN_COUNT; i++) {
			const dir = new Vector(0, 1);
			dir.Rotate(Math.random() * Constants.MATH.FULL_CIRCLE_DEG);
			this.asteroids[i] = new Asteroid(
				i,
				Math.floor(Math.random() * (Constants.MATH.MAX_ASTEROID_TYPE + 1)),
				Math.random() * this.game.canvas.logicalWidth,
				Math.random() * this.game.canvas.logicalHeight,
				dir.x,
				dir.y,
			);
		}

		this.showPressSpace = true;
		this.showPressSpaceTimer = setInterval(() => {
			this.showPressSpace = !this.showPressSpace;
		}, Constants.TIMERS.PRESS_SPACE_BLINK);

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
		this.game.input.AddKeyDownEvent(Keys.SPACE, continueGame);
		if (mobileAndTabletcheck()) {
			this.game.canvas.element.addEventListener(
				"touchend",
				continueGame,
				false,
			);
		}
	}

	// Updates asteroids and handles their collisions.
	Update() {
		for (const key in this.asteroids) {
			this.asteroids[key].Update(
				this.game.frameTime,
				null,
				this.game.canvas.logicalWidth,
				this.game.canvas.logicalHeight,
			);
		}
		this.game.DoAsteroidColisions(this.asteroids);
	}

	// Draws asteroids and title screen UI.
	Draw() {
		for (const key in this.asteroids) {
			this.asteroids[key].Draw(this.game.canvas);
		}
		const centerX = this.game.canvas.logicalWidth / 2;
		const centerY = this.game.canvas.logicalHeight / 2;
		this.game.canvas.DrawUIBox(centerX, centerY, "", 0);
		this.game.canvas.DrawText(
			"astrohunter",
			centerX,
			centerY + Constants.TEXT_OFFSET.TOP,
			80,
			"center",
		);
		this.game.canvas.DrawText(
			`highscore : ${this.game.highscore}`,
			centerX,
			centerY + Constants.TEXT_OFFSET.CENTER,
			40,
			"center",
		);
		if (this.showPressSpace) {
			this.game.canvas.DrawText(
				Constants.START_TEXT,
				centerX,
				centerY + Constants.TEXT_OFFSET.BOTTOM,
				40,
				"center",
			);
		}
	}
}
