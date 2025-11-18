import { Canvas } from "./canvas.js";
import { Constants, IS_MOBILE } from "./constants.js";
import { GameOverState } from "./gameoverstate.js";
import { GameState } from "./gamestate.js";
import { Input } from "./input.js";
import { NewWaveState } from "./newwavestate.js";
import { Sound } from "./sound.js";
import { StartState } from "./startstate.js";
import { States } from "./states.js";
import { UIManager } from "./uimanager.js";

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

		// UI Manager for mobile controls
		this.uiManager = new UIManager(this.canvas);

		// Ensure resize after page is fully loaded (handles edge cases)
		if (document.readyState === "loading") {
			window.addEventListener("DOMContentLoaded", () => {
				this.canvas.Resize();
				this.uiManager.PlaceAndSizeButtons();
			});
		} else {
			// Page already loaded, do an immediate resize
			setTimeout(() => {
				this.canvas.Resize();
				this.uiManager.PlaceAndSizeButtons();
			}, 0);
		}

		//Input
		this.input = new Input();

		// Get button references from UIManager
		if (IS_MOBILE) {
			this.forward = this.uiManager.forward;
			this.left = this.uiManager.left;
			this.right = this.uiManager.right;
			this.fire = this.uiManager.fire;
		}

		// Initial button placement
		this.uiManager.PlaceAndSizeButtons();

		// Throttle resize handler for better performance
		let resizeTimeout;
		const handleResize = () => {
			clearTimeout(resizeTimeout);
			resizeTimeout = setTimeout(() => {
				this.canvas.Resize();
				this.uiManager.PlaceAndSizeButtons();
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
					this.uiManager.PlaceAndSizeButtons();
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
		this._time = undefined;
		this._currentState = null;
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
		if (IS_MOBILE) {
			document.addEventListener(
				"resume",
				() => {
					music.play();
					if (this.state === States.GAME) {
						this._currentState._pause = false;
					}
				},
				false,
			);
			document.addEventListener(
				"pause",
				() => {
					music.pause();
					if (this.state === States.GAME) {
						this._currentState._pause = true;
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
				now - (this._time || now),
				Constants.MATH.FRAME_TIME_MAX,
			);
			this._time = now;

			// Run the current state
			if (this._currentState != null) {
				// Update state
				this._currentState.Update();

				// Draw state (use logical dimensions for background)
				this.canvas.DrawRect(
					0,
					0,
					this.canvas.logicalWidth,
					this.canvas.logicalHeight,
					"#000000",
				);
				this._currentState.Draw();
			}

			// Trigger new loop
			window.requestAnimationFrame(GameLoop);
		};
		window.requestAnimationFrame(GameLoop);
	}

	// Public API: Switches to a different game state.
	SetState(state) {
		// Clean up previous state
		this._currentState?.Exit();

		this.state = state;
		delete this._currentState;

		// Create new state
		switch (state) {
			case States.START:
				this._currentState = new StartState(this);
				break;
			case States.GAME:
				this._currentState = new GameState(this);
				break;
			case States.NEWWAVE:
				this._currentState = new NewWaveState(this);
				break;
			case States.GAMEOVER:
				this._currentState = new GameOverState(this);
				break;
		}

		// Initialize new state
		this._currentState?.Enter();
	}

	// Shows or hides mobile control buttons.
	ShowControlButtons(visible) {
		this.uiManager.ShowControlButtons(visible);
	}

	// Handles collisions between asteroids (bouncing them apart).
	DoAsteroidColisions(asteroidMap) {
		const asteroids = Array.from(asteroidMap.values());
		const count = asteroids.length;

		for (let i = 0; i < count; i++) {
			const e1 = asteroids[i];
			const e1x = e1.pos.x;
			const e1y = e1.pos.y;
			const e1r = e1.radius;

			for (let j = i + 1; j < count; j++) {
				const e2 = asteroids[j];

				// Quick distance check before full collision test
				const dx = e2.pos.x - e1x;
				const dy = e2.pos.y - e1y;
				const distSq = dx * dx + dy * dy;
				const minDist = e1r + e2.radius;
				const minDistSq = minDist * minDist;

				// Only proceed if potentially colliding (skip IsColliding call - already have distSq)
				if (distSq < minDistSq) {
					// Handle case where asteroids are on top of each other
					const dist =
						distSq < Constants.COLLISION.MIN_DISTANCE_SQ
							? Constants.COLLISION.FALLBACK_DISTANCE
							: Math.sqrt(distSq);
					const invDist = 1 / dist;
					const nx = dx * invDist;
					const ny = dy * invDist;
					const overlap = minDist - dist;

					// Only separate if they're overlapping
					if (overlap > 0) {
						// Push apart by overlap amount plus a small extra to prevent sticking
						const pushAmount =
							(overlap + Constants.COLLISION.SEPARATION_EXTRA) *
							Constants.COLLISION.PUSH_FACTOR;
						e1.pos.x -= nx * pushAmount;
						e1.pos.y -= ny * pushAmount;
						e2.pos.x += nx * pushAmount;
						e2.pos.y += ny * pushAmount;
					}

					// Swap velocities for elastic collision (inline to avoid Vector allocation)
					const aci = e1.dir.x * nx + e1.dir.y * ny;
					const bci = e2.dir.x * nx + e2.dir.y * ny;
					const deltaAci = bci - aci;
					const deltaBci = aci - bci;

					e1.dir.x += deltaAci * nx;
					e1.dir.y += deltaAci * ny;
					e1.dir.Normalize();

					e2.dir.x += deltaBci * nx;
					e2.dir.y += deltaBci * ny;
					e2.dir.Normalize();
				}
			}
		}
	}
}
