// StartState - title screen with animated asteroids and start prompt.
import { Asteroid } from "./asteroid.js";
import { Constants, IS_MOBILE, Keys } from "./constants.js";
import { State } from "./state.js";
import { States } from "./states.js";
import { Vector } from "./vector.js";

export class StartState extends State {
	constructor(game) {
		super(game);
		this.game.input.ClearInputEvents();

		this.game.score = 0;
		this.game.ships = Constants.SHIPS;
		this.game.asteroidCount = Constants.WAVE_START;
		this.game.ShowControlButtons(false);

		this._asteroids = {};
		const canvasWidth = this.game.canvas.logicalWidth;
		const canvasHeight = this.game.canvas.logicalHeight;
		for (let i = 0; i < Constants.ASTEROID_START_SCREEN_COUNT; i++) {
			const dir = new Vector(0, 1);
			dir.Rotate(Math.random() * Constants.MATH.FULL_CIRCLE_DEG);
			this._asteroids[i] = new Asteroid(
				i,
				Math.floor(Math.random() * (Constants.MATH.MAX_ASTEROID_TYPE + 1)),
				Math.random() * canvasWidth,
				Math.random() * canvasHeight,
				dir.x,
				dir.y,
			);
		}

		this._showPressSpace = true;
		this._showPressSpaceTimer = setInterval(() => {
			this._showPressSpace = !this._showPressSpace;
		}, Constants.TIMERS.PRESS_SPACE_BLINK);

		const continueGame = () => {
			clearInterval(this._showPressSpaceTimer);
			this.game.SetState(States.GAME);
		};
		this.game.input.AddKeyDownEvent(Keys.SPACE, continueGame);
		if (IS_MOBILE) {
			this._setupMobileTouchHandler(continueGame);
		}
	}

	// Updates asteroids and handles their collisions.
	Update() {
		for (const key in this._asteroids)
			this._asteroids[key].Update(this.game.frameTime, this.game.canvas);
		this.game.DoAsteroidColisions(this._asteroids);
	}

	// Draws asteroids and title screen UI.
	Draw() {
		for (const key in this._asteroids)
			this._asteroids[key].Draw(this.game.canvas);
		const textLines = [
			"astrohunter",
			`highscore : ${this.game.highscore}`,
			this._showPressSpace ? Constants.START_TEXT : null,
		];
		this.game.canvas.DrawUIBox(textLines);
	}
}
