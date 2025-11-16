// GameState - main gameplay state with ship, asteroids, bullets, and collisions.
import { Asteroid } from "./asteroid.js";
import { Bullet } from "./bullet.js";
import { Constants, Keys } from "./constants.js";
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
		const centerX = this.game.canvas.GetCenterX();
		const centerY = this.game.canvas.GetCenterY();
		this.ship = new Ship("ship", centerX, centerY);
		this.ship.ResetShip(centerX, centerY);
		this.fireTimer = 0;
		this.bulletCounter = 0;
		this.bullets = {};
		this.asteroidCounter = 0;
		this.asteroids = {};
		this.explosionCounter = 0;
		this.explosions = {};
		this.pause = false;
		this.asteroidCount = 0; // Track count to avoid Object.keys().length

		// Create the asteroids
		const canvasWidth = this.game.canvas.logicalWidth;
		const canvasHeight = this.game.canvas.logicalHeight;
		for (let i = 0; i < this.game.asteroidCount; i++) {
			const id = `Asteroid${this.asteroidCounter}`;
			const dir = new Vector(0, 1);
			dir.Rotate(Math.random() * Constants.MATH.FULL_CIRCLE_DEG);
			this.asteroids[id] = new Asteroid(
				id,
				0,
				Math.random() * canvasWidth,
				Math.random() * canvasHeight,
				dir.x,
				dir.y,
			);
			this.asteroidCounter++;
			this.asteroidCount++;
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
		this.touchListeners = [];
		if (mobileAndTabletcheck()) {
			const setupTouchButton = (button, onStart, onEnd) => {
				const startHandler = (e) => {
					if (onStart) onStart();
					button.style.opacity = Constants.BUTTON_PRESSED_OPACITY;
					e.preventDefault();
				};
				const endHandler = (e) => {
					if (onEnd) onEnd();
					button.style.opacity = Constants.BUTTON_IDOL_OPACITY;
					e.preventDefault();
				};
				button.addEventListener("touchstart", startHandler, false);
				button.addEventListener("touchend", endHandler, false);
				this.touchListeners.push(
					{ button, type: "touchstart", handler: startHandler },
					{ button, type: "touchend", handler: endHandler },
				);
			};
			setupTouchButton(
				this.game.left,
				() => {
					this.ship.rotateLeft = true;
				},
				() => {
					this.ship.rotateLeft = false;
				},
			);
			setupTouchButton(
				this.game.right,
				() => {
					this.ship.rotateRight = true;
				},
				() => {
					this.ship.rotateRight = false;
				},
			);
			setupTouchButton(
				this.game.forward,
				() => {
					this.ship.moveForward = true;
				},
				() => {
					this.ship.moveForward = false;
				},
			);
			this.game.fire.addEventListener("touchstart", startFire, false);
			this.game.fire.addEventListener("touchend", endFire, false);
			this.touchListeners.push(
				{ button: this.game.fire, type: "touchstart", handler: startFire },
				{ button: this.game.fire, type: "touchend", handler: endFire },
			);
		}

		// Key input events
		this.game.input.AddKeyDownEvent(Keys.SPACE, startFire);
		this.game.input.AddKeyUpEvent(Keys.SPACE, endFire);
		const togglePause = () => {
			this.pause = !this.pause;
		};
		this.game.input.AddKeyDownEvent(Keys.P, togglePause);
		this.game.input.AddKeyDownEvent(Keys.ESCAPE, togglePause);
	}

	// Removes all event listeners when leaving this state.
	RemoveEvents() {
		clearInterval(this.fireTimer);
		if (this.touchListeners) {
			this.touchListeners.forEach(({ button, type, handler }) => {
				button.removeEventListener(type, handler, false);
			});
			this.touchListeners = [];
		}
	}

	// Updates all game entities and handles collisions.
	Update() {
		if (this.pause) return;

		// Cache canvas dimensions to avoid repeated property access
		const canvasWidth = this.game.canvas.logicalWidth;
		const canvasHeight = this.game.canvas.logicalHeight;
		const frameTime = this.game.frameTime;

		this.ship.Update(frameTime, this.game.input, canvasWidth, canvasHeight);

		for (const key in this.bullets) {
			this.bullets[key].Update(frameTime, canvasWidth, canvasHeight);
		}

		for (const key in this.asteroids) {
			this.asteroids[key].Update(frameTime, null, canvasWidth, canvasHeight);
		}

		for (const key in this.explosions) {
			this.explosions[key].Update(frameTime);
		}

		this.game.DoAsteroidColisions(this.asteroids);
		this.DoShipAsteroidColision();
		this.DoBulletsAsteroidColision();
	}

	// Draws all game entities and UI elements.
	Draw() {
		this.ship.Draw(this.game.canvas);

		for (const key in this.bullets) {
			this.bullets[key].Draw(this.game.canvas);
		}

		for (const key in this.asteroids) {
			this.asteroids[key].Draw(this.game.canvas);
		}

		for (const key in this.explosions) {
			this.explosions[key].Draw(this.game.canvas);
		}

		// Align stats to top-left corner (small margin from edges)
		this.game.canvas.DrawText(
			`score : ${this.game.score}`,
			Constants.UI.TOP_MARGIN,
			Constants.UI.TOP_MARGIN,
			Constants.UI.TEXT_SIZE,
			"left",
		);
		this.game.canvas.DrawText(
			`ships : ${this.game.ships}`,
			Constants.UI.TOP_MARGIN,
			Constants.UI.TOP_MARGIN + Constants.UI.LINE_HEIGHT,
			Constants.UI.TEXT_SIZE,
			"left",
		);
		if (this.pause) {
			this.game.canvas.DrawUIBox(
				this.game.canvas.GetCenterX(),
				this.game.canvas.GetCenterY(),
				"pause",
				90,
			);
		}
	}

	// Handles collision between ship and asteroids.
	DoShipAsteroidColision() {
		if (!this.ship.canBeHit) return;
		for (const key in this.asteroids) {
			const a = this.asteroids[key];
			if (this.ship.IsColliding(a)) {
				// Explosion
				this.CreateExplosion(
					this.ship.pos.x,
					this.ship.pos.y,
					Constants.EXPLOSION.SHIP.particles,
					Constants.EXPLOSION.SHIP.lifetime,
					Constants.EXPLOSION.SHIP.vibrate,
				);
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
					this.game.canvas.GetCenterX(),
					this.game.canvas.GetCenterY(),
				);
				return;
			}
		}
	}

	// Handles collision between bullets and asteroids.
	DoBulletsAsteroidColision() {
		for (const aKey in this.asteroids) {
			const a = this.asteroids[aKey];
			for (const bKey in this.bullets) {
				const b = this.bullets[bKey];
				if (b.IsColliding(a)) {
					this.CreateExplosion(
						b.pos.x,
						b.pos.y,
						Constants.EXPLOSION.BULLET.particles,
						Constants.EXPLOSION.BULLET.lifetime,
						Constants.EXPLOSION.BULLET.vibrate,
					);
					delete this.bullets[b.id];
					a.hits--;
					if (a.hits < 1) {
						this.BreakupAsteroid(a);
					}
				}
			}
		}
	}

	// Creates an explosion effect at the given position.
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

	// Breaks an asteroid into smaller pieces and awards points.
	BreakupAsteroid(a) {
		// Explosion
		const typeDiff = Constants.MATH.MAX_ASTEROID_TYPE - a.type;
		this.CreateExplosion(
			a.pos.x,
			a.pos.y,
			typeDiff * Constants.EXPLOSION.ASTEROID_MULTIPLIER.particles,
			typeDiff * Constants.EXPLOSION.ASTEROID_MULTIPLIER.lifetime,
			Constants.EXPLOSION.ASTEROID_MULTIPLIER.vibrate,
		);
		this.game.sound.PlaySound("explosion");

		// Calculate new type and score
		this.game.score += Constants.ASTEROID[a.type].POINTS;
		const type = a.type + 1;
		const pos = a.pos;
		delete this.asteroids[a.id];
		this.asteroidCount--;

		// Return if it's the smallest type
		if (type > Constants.MATH.MAX_ASTEROID_TYPE) {
			// Start next wave if there are no more asteroids
			if (this.asteroidCount === 0) {
				this.RemoveEvents();
				this.game.SetState(States.NEWWAVE);
			}
			return;
		}

		// Spawn new asteroids
		for (let i = 0; i < Constants.ASTEROID_SPAWN_COUNT; i++) {
			const id = `Asteroid${this.asteroidCounter}`;
			const dir = new Vector(0, 1);
			dir.Rotate(Math.random() * Constants.MATH.FULL_CIRCLE_DEG);
			this.asteroids[id] = new Asteroid(
				id,
				type,
				pos.x +
					(Constants.ASTEROID_SPAWN_OFFSET_MIN +
						Math.random() * Constants.ASTEROID_SPAWN_OFFSET_MAX),
				pos.y +
					(Constants.ASTEROID_SPAWN_OFFSET_MIN +
						Math.random() * Constants.ASTEROID_SPAWN_OFFSET_MAX),
				dir.x,
				dir.y,
			);
			this.asteroidCounter++;
			this.asteroidCount++;
		}
	}
}
