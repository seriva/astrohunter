import { Asteroid } from "./asteroid.js";
import { Bullet } from "./bullet.js";
import { Constants } from "./constants.js";
import { Explosion } from "./explosion.js";
import { Ship } from "./ship.js";
import { State } from "./state.js";
import { States } from "./states.js";
import { mobileAndTabletcheck } from "./utils.js";
import { Vector } from "./vector.js";

export class GameState extends State {
	constructor(game) {
		super(game);
		const self = this;
		this.game.input.ClearInputEvents();
		this.game.ShowControlButtons(true);

		// Vars.
		this.ship = new Ship(
			"ship",
			this.game.canvas.logicalWidth / 2,
			this.game.canvas.logicalHeight / 2,
		);
		this.ship.ResetShip(
			this.game.canvas.logicalWidth / 2,
			this.game.canvas.logicalHeight / 2,
		);
		this.fireTimer = 0;
		this.bulletCounter = 0;
		this.bullets = {};
		this.asteroidCounter = 0;
		this.asteroids = {};
		this.explosionCounter = 0;
		this.explosions = {};
		this.pause = false;

		// Create the asteroids
		for (let i = 0; i < this.game.asteroidCount; i++) {
			const id = `Asteroid${this.asteroidCounter}`;
			const dir = new Vector(0, 1);
			dir.Rotate(Math.random() * 360);
			this.asteroids[id] = new Asteroid(
				id,
				0,
				Math.random() * this.game.canvas.logicalWidth,
				Math.random() * this.game.canvas.logicalHeight,
				dir.x,
				dir.y,
			);
			this.asteroidCounter++;
		}

		// fire functions
		const startFire = (e) => {
			if (self.fireTimer === 0) {
				const FireBullet = () => {
					if (self.pause) return;
					const x = self.ship.pos.x + self.ship.dir.x * Constants.SHIP_RADIUS;
					const y = self.ship.pos.y + self.ship.dir.y * Constants.SHIP_RADIUS;
					const id = `Bullet${self.bulletCounter}`;
					self.bullets[id] = new Bullet(
						id,
						x,
						y,
						self.ship.dir.x,
						self.ship.dir.y,
					);
					self.bullets[id].OnDestroy = function () {
						delete self.bullets[this.id];
					};
					self.bulletCounter++;
					self.game.sound.PlaySound("fire");
				};
				self.fireTimer = setInterval(() => {
					FireBullet();
				}, Constants.BULLET_FIRESPEED);
				FireBullet();
			}
			if (mobileAndTabletcheck()) {
				self.game.fire.style.opacity = Constants.BUTTON_PRESSED_OPACITY;
				e.preventDefault();
			}
		};
		const endFire = (e) => {
			clearInterval(self.fireTimer);
			self.fireTimer = 0;
			if (mobileAndTabletcheck()) {
				self.game.fire.style.opacity = Constants.BUTTON_IDOL_OPACITY;
				e.preventDefault();
			}
		};

		//touch Input
		if (mobileAndTabletcheck()) {
			this.game.left.addEventListener(
				"touchstart",
				(e) => {
					this.ship.rotateLeft = true;
					this.game.left.style.opacity = Constants.BUTTON_PRESSED_OPACITY;
					e.preventDefault();
				},
				false,
			);
			this.game.left.addEventListener(
				"touchend",
				(e) => {
					this.ship.rotateLeft = false;
					this.game.left.style.opacity = Constants.BUTTON_IDOL_OPACITY;
					e.preventDefault();
				},
				false,
			);
			this.game.right.addEventListener(
				"touchstart",
				(e) => {
					this.ship.rotateRight = true;
					this.game.right.style.opacity = Constants.BUTTON_PRESSED_OPACITY;
					e.preventDefault();
				},
				false,
			);
			this.game.right.addEventListener(
				"touchend",
				(e) => {
					this.ship.rotateRight = false;
					this.game.right.style.opacity = Constants.BUTTON_IDOL_OPACITY;
					e.preventDefault();
				},
				false,
			);
			this.game.forward.addEventListener(
				"touchstart",
				(e) => {
					this.ship.moveForward = true;
					this.game.forward.style.opacity = Constants.BUTTON_PRESSED_OPACITY;
					e.preventDefault();
				},
				false,
			);
			this.game.forward.addEventListener(
				"touchend",
				(e) => {
					this.ship.moveForward = false;
					this.game.forward.style.opacity = Constants.BUTTON_IDOL_OPACITY;
					e.preventDefault();
				},
				false,
			);
			this.game.fire.addEventListener("touchstart", startFire, false);
			this.game.fire.addEventListener("touchend", endFire, false);
		}

		// Key input events
		this.game.input.AddKeyDownEvent(32, startFire);
		this.game.input.AddKeyUpEvent(32, endFire);
		this.game.input.AddKeyDownEvent(80, () => {
			this.pause = !this.pause;
		});
	}

	RemoveEvents() {
		clearInterval(this.fireTimer);
		if (mobileAndTabletcheck()) {
			this.game.left.removeEventListener("touchstart");
			this.game.left.removeEventListener("touchend");
			this.game.right.removeEventListener("touchstart");
			this.game.right.removeEventListener("touchend");
			this.game.forward.removeEventListener("touchstart");
			this.game.forward.removeEventListener("touchend");
			this.game.fire.removeEventListener("touchstart");
			this.game.fire.removeEventListener("touchend");
		}
	}

	Update() {
		if (this.pause) return;

		this.ship.Update(
			this.game.frameTime,
			this.game.input,
			this.game.canvas.logicalWidth,
			this.game.canvas.logicalHeight,
		);

		Object.keys(this.bullets).forEach((key) => {
			this.bullets[key].Update(
				this.game.frameTime,
				this.game.canvas.logicalWidth,
				this.game.canvas.logicalHeight,
			);
		});

		Object.keys(this.asteroids).forEach((key) => {
			this.asteroids[key].Update(
				this.game.frameTime,
				null,
				this.game.canvas.logicalWidth,
				this.game.canvas.logicalHeight,
			);
		});

		Object.keys(this.explosions).forEach((key) => {
			this.explosions[key].Update(this.game.frameTime);
		});

		this.game.DoAsteroidColisions(this.asteroids);
		this.DoShipAsteroidColision();
		this.DoBulletsAsteroidColision();
	}

	Draw() {
		this.ship.Draw(this.game.canvas);

		Object.keys(this.bullets).forEach((key) => {
			this.bullets[key].Draw(this.game.canvas);
		});

		Object.keys(this.asteroids).forEach((key) => {
			this.asteroids[key].Draw(this.game.canvas);
		});

		Object.keys(this.explosions).forEach((key) => {
			this.explosions[key].Draw(this.game.canvas);
		});

		// Align stats to top-left corner (small margin from edges)
		const topMargin = 10;
		const lineHeight = 35;
		this.game.canvas.DrawText(
			`score : ${this.game.score}`,
			10,
			topMargin,
			30,
			"left",
		);
		this.game.canvas.DrawText(
			`ships : ${this.game.ships}`,
			10,
			topMargin + lineHeight,
			30,
			"left",
		);
		if (this.pause) {
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
			this.game.canvas.DrawText("pause", centerX, centerY, 90, "center");
		}
	}

	DoShipAsteroidColision() {
		if (!this.ship.canBeHit) return;
		Object.keys(this.asteroids).forEach((key) => {
			const a = this.asteroids[key];
			if (this.ship.IsColliding(a)) {
				// Explosion
				this.CreateExplosion(this.ship.pos.x, this.ship.pos.y, 75, 300, 100);
				this.game.sound.PlaySound("explosion");

				// Break up asteroid
				this.BreakupAsteroid(a);

				// Check game over
				this.game.ships--;
				if (this.game.ships === 0) {
					this.RemoveEvents();
					this.game.SetState(States.GAMEOVER);
					return;
				}

				// Reset the ship
				this.ship.ResetShip(
					this.game.canvas.logicalWidth / 2,
					this.game.canvas.logicalHeight / 2,
				);
				return;
			}
		});
	}

	DoBulletsAsteroidColision() {
		Object.keys(this.asteroids).forEach((key) => {
			const a = this.asteroids[key];
			Object.keys(this.bullets).forEach((key) => {
				const b = this.bullets[key];
				if (b.IsColliding(a)) {
					this.CreateExplosion(b.pos.x, b.pos.y, 10, 100, 0);
					delete this.bullets[b.id];
					a.hits--;
					if (a.hits < 1) {
						this.BreakupAsteroid(a);
					}
				}
			});
		});
	}

	CreateExplosion(x, y, particlecount, lifetime, vibrate) {
		const id = `Explosion${this.explosionCounter}`;
		this.explosions[id] = new Explosion(
			id,
			x,
			y,
			particlecount,
			lifetime,
			vibrate,
		);
		this.explosions[id].OnDestroy = () => {
			delete this.explosions[id];
		};
		this.explosionCounter++;
	}

	BreakupAsteroid(a) {
		// Explosion
		this.CreateExplosion(
			a.pos.x,
			a.pos.y,
			(3 - a.type) * 50,
			(3 - a.type) * 120,
			50,
		);
		this.game.sound.PlaySound("explosion");

		// Calculate new type and score
		this.game.score = this.game.score + Constants.ASTEROID[a.type].POINTS;
		const type = a.type + 1;
		const pos = a.pos;
		delete this.asteroids[a.id];

		// Return of its the smallest type
		if (type > 2) {
			// Start next wave if there are no more asteroids
			if (Object.keys(this.asteroids).length === 0) {
				this.RemoveEvents();
				this.game.SetState(States.NEWWAVE);
			}
			return;
		}

		// Spawn 3 new ones if we get here
		for (let i = 0; i < 3; i++) {
			const id = `Asteroid${this.asteroidCounter}`;
			const dir = new Vector(0, 1);
			dir.Rotate(Math.random() * 360);
			this.asteroids[id] = new Asteroid(
				id,
				type,
				pos.x + (-15 + Math.random() * 30),
				pos.y + (-15 + Math.random() * 30),
				dir.x,
				dir.y,
			);
			this.asteroidCounter++;
		}
	}
}
