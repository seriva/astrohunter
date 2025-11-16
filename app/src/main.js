import { Canvas } from "./canvas.js";
import { Constants } from "./constants.js";
import { GameOverState } from "./gameoverstate.js";
import { GameState } from "./gamestate.js";
import { Input } from "./input.js";
import { NewWaveState } from "./newwavestate.js";
import { Sound } from "./sound.js";
import { StartState } from "./startstate.js";
import { States } from "./states.js";
import { mobileAndTabletcheck } from "./utils.js";
import { Vector } from "./vector.js";

// Game - main class managing game loop, states, and overall game logic.
export class Game {
	constructor() {
		//create canvas
		this.canvas = new Canvas(
			"canvas",
			Constants.SCR_WIDTH,
			Constants.SCR_HEIGHT,
		);
		// Initial resize
		this.canvas.Resize();

		// Ensure resize after page is fully loaded (handles edge cases)
		if (document.readyState === "loading") {
			window.addEventListener("DOMContentLoaded", () => {
				this.canvas.Resize();
				PlaceAndSizeButtons();
			});
		} else {
			// Page already loaded, do an immediate resize
			setTimeout(() => {
				this.canvas.Resize();
				PlaceAndSizeButtons();
			}, 0);
		}

		//Input
		this.input = new Input();
		this.forward = document.getElementById("forward");
		this.left = document.getElementById("left");
		this.right = document.getElementById("right");
		this.fire = document.getElementById("fire");

		// Helper function to place and size mobile buttons
		const PlaceAndSizeButtons = () => {
			if (mobileAndTabletcheck()) {
				const setButtons = (button, size, x, y) => {
					button.style.left = `${Math.round(x)}px`;
					button.style.top = `${Math.round(y)}px`;
					button.style.height = `${Math.round(size)}px`;
					button.style.width = `${Math.round(size)}px`;
					button.style.borderRadius = `${Math.round(size / 2)}px`;
				};
				const left = this.canvas.element.offsetLeft;
				const top = this.canvas.element.offsetTop;
				const height = this.canvas.element.clientHeight;
				const width = this.canvas.element.clientWidth;
				const size = Math.round(
					(Constants.MOB_BUTTON_SIZE * width) / this.canvas.logicalWidth,
				);
				setButtons(
					this.left,
					size,
					left + Constants.UI.BUTTON_MARGIN,
					top + (height - 2 * size) - Constants.UI.BUTTON_SPACING,
				);
				setButtons(
					this.right,
					size,
					left + size + Constants.UI.BUTTON_MARGIN,
					top + (height - size) - Constants.UI.BUTTON_SPACING,
				);
				setButtons(
					this.forward,
					size,
					left + (width - (size + Constants.UI.BUTTON_SPACING)),
					top + (height - 2 * size) - Constants.UI.BUTTON_SPACING,
				);
				setButtons(
					this.fire,
					size,
					left + (width - (size * 2 + Constants.UI.BUTTON_SPACING)),
					top + (height - size) - Constants.UI.BUTTON_SPACING,
				);
			}
		};
		PlaceAndSizeButtons();

		// Throttle resize handler for better performance
		let resizeTimeout;
		const handleResize = () => {
			clearTimeout(resizeTimeout);
			resizeTimeout = setTimeout(() => {
				this.canvas.Resize();
				PlaceAndSizeButtons();
			}, Constants.TIMERS.RESIZE_THROTTLE);
		};

		// Handle window resize
		window.addEventListener("resize", handleResize, false);

		// Handle orientation change on mobile devices
		window.addEventListener(
			"orientationchange",
			() => {
				// Delay to allow orientation change to complete
				setTimeout(() => {
					this.canvas.Resize();
					PlaceAndSizeButtons();
				}, Constants.TIMERS.ORIENTATION_DELAY);
			},
			false,
		);

		//Sounds
		this.sound = new Sound();
		const music = this.sound.PlayMusic("sounds/music.ogg", 1, 0.75, true);
		this.sound.CacheSound("fire", "sounds/fire.ogg", 1, 0.2, true);
		this.sound.CacheSound("explosion", "sounds/explosion.ogg", 1, 0.5, true);

		//Vars
		this.state = States.START;
		this.time = undefined;
		this.currentState = null;
		this.frameTime = 0;
		this.score = 0;
		this.ships = Constants.SHIPS;
		this.asteroidCount = Constants.WAVE_START;

		//Get highscore with error handling
		try {
			this.highscore = parseInt(localStorage.highscore, 10) || 0;
		} catch (_e) {
			this.highscore = 0;
		}

		// Set the start state
		this.SetState(States.START);

		//Pause game on phone
		if (mobileAndTabletcheck()) {
			document.addEventListener(
				"resume",
				() => {
					music.play();
					if (this.state === States.GAME) {
						this.currentState.pause = false;
					}
				},
				false,
			);
			document.addEventListener(
				"pause",
				() => {
					music.pause();
					if (this.state === States.GAME) {
						this.currentState.pause = true;
					}
				},
				false,
			);
		}
	}

	// Starts the main game loop.
	Run() {
		const GameLoop = (currenttime) => {
			// Timing
			const now = currenttime;
			this.frameTime = Math.min(
				now - (this.time || now),
				Constants.MATH.FRAME_TIME_MAX,
			);
			this.time = now;

			// Run the current state
			if (this.currentState != null) {
				// Update state
				this.currentState.Update();

				// Draw state (use logical dimensions for background)
				this.canvas.DrawRect(
					0,
					0,
					this.canvas.logicalWidth,
					this.canvas.logicalHeight,
					"#000000",
				);
				this.currentState.Draw();
			}

			// Trigger new loop
			window.requestAnimationFrame(GameLoop);
		};
		window.requestAnimationFrame(GameLoop);
	}

	// Switches to a different game state.
	SetState(state) {
		this.state = state;
		delete this.currentState;
		switch (state) {
			case States.START:
				this.currentState = new StartState(this);
				break;
			case States.GAMEOVER:
				this.currentState = new GameOverState(this);
				break;
			case States.NEWWAVE:
				this.currentState = new NewWaveState(this);
				break;
			case States.GAME:
				this.currentState = new GameState(this);
				break;
		}
	}

	// Shows or hides mobile control buttons.
	ShowControlButtons(visible) {
		if (!mobileAndTabletcheck()) return;
		const buttons = [this.forward, this.left, this.right, this.fire];
		buttons.forEach((button) => {
			button.style.opacity = Constants.BUTTON_IDOL_OPACITY;
			button.style.visibility = visible ? "visible" : "hidden";
		});
	}

	// Handles collisions between asteroids (bouncing them apart).
	DoAsteroidColisions(a) {
		const keys = Object.keys(a);
		for (let i = 0; i < keys.length; i++) {
			for (let j = i + 1; j < keys.length; j++) {
				const e1 = a[keys[i]];
				const e2 = a[keys[j]];
				if (e1.IsColliding(e2)) {
					const dx = e2.pos.x - e1.pos.x;
					const dy = e2.pos.y - e1.pos.y;
					const nx1 = dx / e1.radius;
					const ny1 = dy / e1.radius;
					const nx2 = dx / e2.radius;
					const ny2 = dy / e2.radius;
					e1.pos.x = e1.pos.x - nx1;
					e1.pos.y = e1.pos.y - ny1;
					e2.pos.x = e2.pos.x + nx2;
					e2.pos.y = e2.pos.y + ny2;

					const d = new Vector(dx, dy);
					d.Div(d.Length());
					const aci = e1.dir.Dot(d);
					const bci = e2.dir.Dot(d);
					const acf = bci;
					const bcf = aci;

					e1.dir.Set((acf - aci) * d.x, (acf - aci) * d.y);
					e1.dir.Normalize();
					e2.dir.Set((bcf - bci) * d.x, (bcf - bci) * d.y);
					e2.dir.Normalize();
				}
			}
		}
	}
}
