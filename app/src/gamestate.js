// GameState - main gameplay state with ship, asteroids, bullets, and collisions.
import { Asteroid } from "./asteroid.js";
import { Bullet } from "./bullet.js";
import { Constants, IS_MOBILE, Keys } from "./constants.js";
import { Explosion } from "./explosion.js";
import { Ship } from "./ship.js";
import { State } from "./state.js";
import { States } from "./states.js";
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
		this._bullets = new Map();
		this._asteroidCounter = 0;
		this._asteroids = new Map();
		this._explosionCounter = 0;
		this._explosions = new Map();
		this._pause = false;

		// Create the asteroids
		const canvasWidth = this.game.canvas.logicalWidth;
		const canvasHeight = this.game.canvas.logicalHeight;
		for (let i = 0; i < this.game.asteroidCount; i++) {
			const dir = new Vector(0, 1);
			dir.Rotate(Math.random() * Constants.MATH.FULL_CIRCLE_DEG);
			const id = this._asteroidCounter++;
			this._asteroids.set(
				id,
				new Asteroid(
					id,
					0,
					Math.random() * canvasWidth,
					Math.random() * canvasHeight,
					dir.x,
					dir.y,
				),
			);
		}

		// fire functions
		const startFire = (e) => {
			if (self._fireTimer === 0) {
				const FireBullet = () => {
					if (self._pause) return;
					const x = self._ship.pos.x + self._ship.dir.x * Constants.SHIP_RADIUS;
					const y = self._ship.pos.y + self._ship.dir.y * Constants.SHIP_RADIUS;
					const id = self._bulletCounter++;
					const bullet = new Bullet(
						id,
						x,
						y,
						self._ship.dir.x,
						self._ship.dir.y,
					);
					bullet.OnDestroy = function () {
						self._bullets.delete(this.id);
					};
					self._bullets.set(id, bullet);
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
					this._ship.rotateLeft = true;
				},
				() => {
					this._ship.rotateLeft = false;
				},
			);
			setupTouchButton(
				this.game.right,
				() => {
					this._ship.rotateRight = true;
				},
				() => {
					this._ship.rotateRight = false;
				},
			);
			setupTouchButton(
				this.game.forward,
				() => {
					this._ship.moveForward = true;
				},
				() => {
					this._ship.moveForward = false;
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

		// Mobile: tap HUD area (top 60px) to pause
		if (IS_MOBILE) {
			this._hudTapHandler = (e) => {
				const touch = e.touches[0] || e.changedTouches[0];
				const rect = this.game.canvas.element.getBoundingClientRect();
				const y = touch.clientY - rect.top;
				// Check if tap is in HUD area (top 60 scaled pixels)
				if (y < 60 * this.game.canvas._scale) {
					togglePause();
					e.preventDefault();
				}
			};
			this.game.canvas.element.addEventListener(
				"touchstart",
				this._hudTapHandler,
				false,
			);
			this._touchListeners.push({
				button: this.game.canvas.element,
				type: "touchstart",
				handler: this._hudTapHandler,
			});
		}
		this.game.input.AddKeyDownEvent(Keys.ESCAPE, togglePause);
	}

	// Called when leaving this state - cleanup resources
	Exit() {
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
		for (const bullet of this._bullets.values()) {
			bullet.Update(frameTime, canvas);
		}
		for (const asteroid of this._asteroids.values()) {
			asteroid.Update(frameTime, canvas);
		}
		for (const explosion of this._explosions.values()) {
			explosion.Update(frameTime);
		}

		this.game.DoAsteroidColisions(this._asteroids);
		this._DoShipAsteroidColision();
		this._DoBulletsAsteroidColision();
	}

	// Draws all game entities and UI elements.
	Draw() {
		this._ship.Draw(this.game.canvas);
		for (const bullet of this._bullets.values()) {
			bullet.Draw(this.game.canvas);
		}
		for (const asteroid of this._asteroids.values()) {
			asteroid.Draw(this.game.canvas);
		}
		for (const explosion of this._explosions.values()) {
			explosion.Draw(this.game.canvas);
		}

		// Align stats to top-left corner
		const margin = Constants.UI.TOP_MARGIN;
		// Draw score (just the number) on the left
		this.game.canvas.DrawText(
			`${this.game.score}`,
			margin,
			margin,
			Constants.UI.HUD_SCORE_SIZE,
			"left",
		);

		// Draw remaining ships as icons on the right (static ship shape pointing up)
		const shipIconSize = Constants.UI.HUD_SHIP_ICON_SIZE;
		const shipSpacing = Constants.UI.HUD_SHIP_SPACING;
		const maxShips = Constants.SHIPS;
		const shipIcon = [
			new Vector(0, -18),
			new Vector(-13, 14),
			new Vector(0, 11),
			new Vector(13, 14),
			new Vector(0, -18),
		];

		// Position ships from right, remove from left to right
		const canvasWidth = this.game.canvas.logicalWidth;
		const shipWidth = 13 * shipIconSize; // Half-width of ship scaled
		const shipHeight = 18 * shipIconSize; // Top point of ship scaled
		const totalShipsWidth = (maxShips - 1) * shipSpacing;
		const startX = canvasWidth - margin - totalShipsWidth - shipWidth;

		for (let i = 0; i < this.game.ships; i++) {
			const shipX = startX + (maxShips - this.game.ships + i) * shipSpacing;
			const shipY = margin + shipHeight; // Add ship height so top isn't cut off
			this.game.canvas.DrawPolyLine(shipIcon, shipX, shipY, shipIconSize);
		}

		if (this._pause) this.game.canvas.DrawUIBox(["pause"]);
	}

	// Private: Handles collision between ship and asteroids.
	_DoShipAsteroidColision() {
		if (!this._ship.canBeHit) return;
		for (const a of this._asteroids.values()) {
			if (!this._ship.IsColliding(a)) continue;
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
		for (const a of this._asteroids.values()) {
			for (const b of this._bullets.values()) {
				if (!b.IsColliding(a)) continue;
				this._CreateExplosion(
					b.pos.x,
					b.pos.y,
					Constants.EXPLOSION.BULLET.particles,
					Constants.EXPLOSION.BULLET.lifetime,
					Constants.EXPLOSION.BULLET.vibrate,
				);
				this._bullets.delete(b.id);
				if (--a.hits < 1) this._BreakupAsteroid(a);
			}
		}
	}

	// Private: Creates an explosion effect at the given position.
	_CreateExplosion(x, y, particlecount, lifetime, vibrate) {
		const id = this._explosionCounter++;
		const explosion = new Explosion(id, x, y, particlecount, lifetime, vibrate);
		const self = this;
		explosion.OnDestroy = function () {
			self._explosions.delete(this.id);
		};
		this._explosions.set(id, explosion);
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
		this._asteroids.delete(a.id);

		// Check if wave is complete (no asteroids left and this was the last large one)
		if (type > Constants.MATH.MAX_ASTEROID_TYPE) {
			if (this._asteroids.size === 0) {
				this.game.SetState(States.NEWWAVE);
			}
			return;
		}

		// Spawn new asteroids
		for (let i = 0; i < Constants.ASTEROID_SPAWN_COUNT; i++) {
			const dir = new Vector(0, 1);
			dir.Rotate(Math.random() * Constants.MATH.FULL_CIRCLE_DEG);
			const offset =
				Constants.ASTEROID_SPAWN_OFFSET_MIN +
				Math.random() * Constants.ASTEROID_SPAWN_OFFSET_MAX;
			const id = this._asteroidCounter++;
			this._asteroids.set(
				id,
				new Asteroid(id, type, pos.x + offset, pos.y + offset, dir.x, dir.y),
			);
		}
	}
}
