// GameState - main gameplay state with ship, asteroids, bullets, and collisions.
import { Asteroid } from "./asteroid.js";
import { Bullet } from "./bullet.js";
import { Constants, IS_MOBILE, Keys } from "./constants.js";
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
		this._ship = new Ship("ship", centerX, centerY);
		this._ship.ResetShip(centerX, centerY);
		this._fireTimer = 0;
		this._bulletCounter = 0;
		this._bullets = {};
		this._asteroidCounter = 0;
		this._asteroids = {};
		this._explosionCounter = 0;
		this._explosions = {};
		this._pause = false;
		this._asteroidCount = 0; // Track count to avoid Object.keys().length		// Create the asteroids
		const canvasWidth = this.game.canvas.logicalWidth;
		const canvasHeight = this.game.canvas.logicalHeight;
		for (let i = 0; i < this.game.asteroidCount; i++) {
			const dir = new Vector(0, 1);
			dir.Rotate(Math.random() * Constants.MATH.FULL_CIRCLE_DEG);
			const id = `Asteroid${this._asteroidCounter++}`;
			this._asteroids[id] = new Asteroid(
				id,
				0,
				Math.random() * canvasWidth,
				Math.random() * canvasHeight,
				dir.x,
				dir.y,
			);
			this._asteroidCount++;
		} // fire functions
		const startFire = (e) => {
			if (self._fireTimer === 0) {
				const FireBullet = () => {
					if (self._pause) return;
					const x = self._ship.pos.x + self._ship.dir.x * Constants.SHIP_RADIUS;
					const y = self._ship.pos.y + self._ship.dir.y * Constants.SHIP_RADIUS;
					const id = `Bullet${self._bulletCounter}`;
					self._bullets[id] = new Bullet(
						id,
						x,
						y,
						self._ship.dir.x,
						self._ship.dir.y,
					);
					self._bullets[id].OnDestroy = function () {
						delete self._bullets[this.id];
					};
					self._bulletCounter++;
					self.game.sound.PlaySound("fire");
				};
				self._fireTimer = setInterval(() => {
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
			clearInterval(self._fireTimer);
			self._fireTimer = 0;
			if (IS_MOBILE) {
				self.game.fire.style.opacity = Constants.BUTTON_IDOL_OPACITY;
				e.preventDefault();
			}
		};

		//touch Input
		this._touchListeners = [];
		if (IS_MOBILE) {
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
				this._touchListeners.push(
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
			this._touchListeners.push(
				{ button: this.game.fire, type: "touchstart", handler: startFire },
				{ button: this.game.fire, type: "touchend", handler: endFire },
			);
		}

		// Key input events
		this.game.input.AddKeyDownEvent(Keys.SPACE, startFire);
		this.game.input.AddKeyUpEvent(Keys.SPACE, endFire);
		const togglePause = () => {
			this._pause = !this._pause;
		};
		this.game.input.AddKeyDownEvent(Keys.P, togglePause);
		this.game.input.AddKeyDownEvent(Keys.ESCAPE, togglePause);
	}

	// Removes all event listeners when leaving this state.
	RemoveEvents() {
		clearInterval(this._fireTimer);
		if (this._touchListeners) {
			this._touchListeners.forEach(({ button, type, handler }) => {
				button.removeEventListener(type, handler, false);
			});
			this._touchListeners = [];
		}
	}

	// Updates all game entities and handles collisions.
	Update() {
		if (this._pause) return;

		const frameTime = this.game.frameTime;
		const canvas = this.game.canvas;

		this._ship.Update(frameTime, this.game.input, canvas);
		for (const key in this._bullets)
			this._bullets[key].Update(frameTime, canvas);
		for (const key in this._asteroids)
			this._asteroids[key].Update(frameTime, canvas);
		for (const key in this._explosions) this._explosions[key].Update(frameTime);

		this.game.DoAsteroidColisions(this._asteroids);
		this._DoShipAsteroidColision();
		this._DoBulletsAsteroidColision();
	}

	// Draws all game entities and UI elements.
	Draw() {
		this._ship.Draw(this.game.canvas);
		for (const key in this._bullets) this._bullets[key].Draw(this.game.canvas);
		for (const key in this._asteroids)
			this._asteroids[key].Draw(this.game.canvas);
		for (const key in this._explosions)
			this._explosions[key].Draw(this.game.canvas);

		// Align stats to top-left corner
		const margin = Constants.UI.TOP_MARGIN;
		this.game.canvas.DrawText(
			`score : ${this.game.score}`,
			margin,
			margin,
			Constants.UI.TEXT_SIZE,
			"left",
		);
		this.game.canvas.DrawText(
			`ships : ${this.game.ships}`,
			margin,
			margin + Constants.UI.LINE_HEIGHT,
			Constants.UI.TEXT_SIZE,
			"left",
		);
		if (this._pause)
			this.game.canvas.DrawUIBox(
				this.game.canvas.GetCenterX(),
				this.game.canvas.GetCenterY(),
				"pause",
				90,
			);
	}

	// Private: Handles collision between ship and asteroids.
	_DoShipAsteroidColision() {
		if (!this._ship.canBeHit) return;
		for (const key in this._asteroids) {
			const a = this._asteroids[key];
			if (!a || !this._ship.IsColliding(a)) continue;
			this._CreateExplosion(
				this._ship.pos.x,
				this._ship.pos.y,
				Constants.EXPLOSION.SHIP.particles,
				Constants.EXPLOSION.SHIP.lifetime,
				Constants.EXPLOSION.SHIP.vibrate,
			);
			this.game.sound.PlaySound("explosion");
			this._BreakupAsteroid(a);
			if (--this.game.ships === 0) {
				this.RemoveEvents();
				this.game.SetState(States.GAMEOVER);
				return;
			}
			this._ship.ResetShip(
				this.game.canvas.GetCenterX(),
				this.game.canvas.GetCenterY(),
			);
			return;
		}
	}

	// Private: Handles collision between bullets and asteroids.
	_DoBulletsAsteroidColision() {
		for (const aKey in this._asteroids) {
			const a = this._asteroids[aKey];
			if (!a) continue;
			for (const bKey in this._bullets) {
				const b = this._bullets[bKey];
				if (!b || !b.IsColliding(a)) continue;
				this._CreateExplosion(
					b.pos.x,
					b.pos.y,
					Constants.EXPLOSION.BULLET.particles,
					Constants.EXPLOSION.BULLET.lifetime,
					Constants.EXPLOSION.BULLET.vibrate,
				);
				delete this._bullets[b.id];
				if (--a.hits < 1) this._BreakupAsteroid(a);
			}
		}
	}

	// Private: Creates an explosion effect at the given position.
	_CreateExplosion(x, y, particlecount, lifetime, vibrate) {
		const id = `Explosion${this._explosionCounter}`;
		this._explosions[id] = new Explosion(
			id,
			x,
			y,
			particlecount,
			lifetime,
			vibrate,
		);
		this._explosions[id].OnDestroy = () => {
			delete this._explosions[id];
		};
		this._explosionCounter++;
	}

	// Private: Breaks an asteroid into smaller pieces and awards points.
	_BreakupAsteroid(a) {
		const typeDiff = Constants.MATH.MAX_ASTEROID_TYPE - a._type;
		this._CreateExplosion(
			a.pos.x,
			a.pos.y,
			typeDiff * Constants.EXPLOSION.ASTEROID_MULTIPLIER.particles,
			typeDiff * Constants.EXPLOSION.ASTEROID_MULTIPLIER.lifetime,
			Constants.EXPLOSION.ASTEROID_MULTIPLIER.vibrate,
		);
		this.game.sound.PlaySound("explosion");
		this.game.score += Constants.ASTEROID[a._type].POINTS;
		const type = a._type + 1;
		const pos = a.pos;
		delete this._asteroids[a.id];
		if (
			--this._asteroidCount === 0 &&
			type > Constants.MATH.MAX_ASTEROID_TYPE
		) {
			this.RemoveEvents();
			this.game.SetState(States.NEWWAVE);
			return;
		}
		if (type > Constants.MATH.MAX_ASTEROID_TYPE) return;

		// Spawn new asteroids
		for (let i = 0; i < Constants.ASTEROID_SPAWN_COUNT; i++) {
			const dir = new Vector(0, 1);
			dir.Rotate(Math.random() * Constants.MATH.FULL_CIRCLE_DEG);
			const offset =
				Constants.ASTEROID_SPAWN_OFFSET_MIN +
				Math.random() * Constants.ASTEROID_SPAWN_OFFSET_MAX;
			const id = `Asteroid${this._asteroidCounter++}`;
			this._asteroids[id] = new Asteroid(
				id,
				type,
				pos.x + offset,
				pos.y + offset,
				dir.x,
				dir.y,
			);
			this._asteroidCount++;
		}
	}
}
