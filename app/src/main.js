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

export class Game {
	constructor() {
		//create canvas
		this.canvas = new Canvas(
			"canvas",
			Constants.SCR_WIDTH,
			Constants.SCR_HEIGHT,
		);
		this.canvas.Resize();

		//Input
		this.input = new Input();
		this.forward = document.getElementById("forward");
		this.left = document.getElementById("left");
		this.right = document.getElementById("right");
		this.fire = document.getElementById("fire");
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
					(Constants.MOB_BUTTON_SIZE * width) / Constants.SCR_WIDTH,
				);
				setButtons(this.left, size, left + 5, top + (height - 2 * size) - 10);
				setButtons(
					this.right,
					size,
					left + size + 5,
					top + (height - size) - 10,
				);
				setButtons(
					this.forward,
					size,
					left + (width - (size + 10)),
					top + (height - 2 * size) - 10,
				);
				setButtons(
					this.fire,
					size,
					left + (width - (size * 2 + 10)),
					top + (height - size) - 10,
				);
			}
		};
		PlaceAndSizeButtons();
		window.addEventListener(
			"resize",
			() => {
				this.canvas.Resize();
				PlaceAndSizeButtons();
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
		this.time;
		this.currentState = null;
		this.frameTime = 0;
		this.score = 0;
		this.ships = Constants.SHIPS;
		this.asteroidCount = Constants.WAVE_START;

		//Get highscore.
		this.highscore = localStorage.highscore;
		if (this.highscore === undefined) {
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

	Run() {
		const GameLoop = (currenttime) => {
			// Timing
			const now = currenttime;
			this.frameTime = now - (this.time || now);
			this.time = now;

			// Run the current state
			if (this.currentState != null) {
				// Update state
				this.currentState.Update();

				// Draw state
				this.canvas.DrawRect(
					0,
					0,
					Constants.SCR_WIDTH,
					Constants.SCR_HEIGHT,
					"#000000",
				);
				this.currentState.Draw();
			}

			// Trigger new loop
			window.requestAnimationFrame(GameLoop);
		};
		window.requestAnimationFrame(GameLoop);
	}

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

	ShowControlButtons(visible) {
		if (!mobileAndTabletcheck()) return;
		this.forward.style.opacity = Constants.BUTTON_IDOL_OPACITY;
		this.left.style.opacity = Constants.BUTTON_IDOL_OPACITY;
		this.right.style.opacity = Constants.BUTTON_IDOL_OPACITY;
		this.fire.style.opacity = Constants.BUTTON_IDOL_OPACITY;
		if (visible) {
			this.forward.style.visibility = "visible";
			this.left.style.visibility = "visible";
			this.right.style.visibility = "visible";
			this.fire.style.visibility = "visible";
		} else {
			this.forward.style.visibility = "hidden";
			this.left.style.visibility = "hidden";
			this.right.style.visibility = "hidden";
			this.fire.style.visibility = "hidden";
		}
	}

	DoAsteroidColisions(a) {
		Object.keys(a).forEach((key) => {
			const key1 = key;
			Object.keys(a).forEach((key) => {
				if (key1 !== key) {
					const e1 = a[key];
					const e2 = a[key1];
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
			});
		});
	}
}
