// Ship entity - player controlled spaceship with rotation and movement.
import { Constants, Keys } from "./constants.js";
import { Entity } from "./entity.js";
import { Vector } from "./vector.js";

// Static ship shape points (reused for all ships)
const SHIP_POINTS = [
	new Vector(0, -18),
	new Vector(-13, 14),
	new Vector(0, 11),
	new Vector(13, 14),
	new Vector(0, -18),
];

const FLAME_POINTS = [
	new Vector(-10, 13),
	new Vector(0, 11),
	new Vector(10, 13),
	new Vector(0, 19),
];

export class Ship extends Entity {
	constructor(id, x, y) {
		super(id);
		this.pos.Set(x, y);
		this.dir.Set(0, -1);
		this.radius = Constants.SHIP_RADIUS;
		this._velocity = Vector.Zero();
		this.canBeHit = false;
		this._showFlame = false;
		// Create instance copies of shape points for rotation
		this._shipPoints = SHIP_POINTS.map((p) => new Vector(p.x, p.y));
		this._flamePoints = FLAME_POINTS.map((p) => new Vector(p.x, p.y));
		this.rotateLeft = false;
		this.rotateRight = false;
		this.moveForward = false;
	}

	// Updates ship rotation, movement, and position based on input.
	Update(frametime, input, canvasWidth, canvasHeight) {
		// Ship rotation
		let rotation = 0;
		if (input.IsDown(Keys.LEFT) || this.rotateLeft) {
			rotation = -(Constants.SHIP_ROTATIONSPEED * frametime);
		}
		if (input.IsDown(Keys.RIGHT) || this.rotateRight) {
			rotation = Constants.SHIP_ROTATIONSPEED * frametime;
		}
		if (rotation !== 0) {
			this.dir.Rotate(rotation);
			// Rotate both ship and flame points
			const shipLen = this._shipPoints.length;
			const flameLen = this._flamePoints.length;
			for (let i = 0; i < shipLen; i++) {
				this._shipPoints[i].Rotate(rotation);
			}
			for (let i = 0; i < flameLen; i++) {
				this._flamePoints[i].Rotate(rotation);
			}
		}

		//	Movement
		this._showFlame = false;
		if (input.IsDown(Keys.UP) || this.moveForward) {
			this._velocity.Add(
				this.dir.x * (Constants.SHIP_ACCELERATION * frametime),
				this.dir.y * (Constants.SHIP_ACCELERATION * frametime),
			);
			const length = this._velocity.Length();
			if (length > Constants.SHIP_MAXVELOCITY) {
				// Normalize and scale in one operation
				this._velocity.Mul(Constants.SHIP_MAXVELOCITY / length);
			}
			this._showFlame = true;
		}
		this.pos.Add(this._velocity.x, this._velocity.y);
		this.CapOnScreen(canvasWidth, canvasHeight);
	}

	// Draws the ship and flame effect.
	Draw(canvas) {
		if (!this.isVisible) return;
		canvas.DrawPolyLine(this._shipPoints, this.pos.x, this.pos.y, 1);
		if (this._showFlame) {
			canvas.DrawPolyLine(this._flamePoints, this.pos.x, this.pos.y, 1);
		}
	}

	// Public API: Resets ship to position with invincibility period and blinking effect.
	ResetShip(x, y) {
		// Clear any existing timers from previous reset
		clearInterval(this._immuneTimer);
		clearInterval(this._blinkTimer);

		this.pos.Set(x, y);
		this.dir.Set(0, -1);
		this._velocity.Set(0, 0);
		// Reset points to original positions
		for (let i = 0, len = SHIP_POINTS.length; i < len; i++) {
			this._shipPoints[i].Set(SHIP_POINTS[i].x, SHIP_POINTS[i].y);
		}
		for (let i = 0, len = FLAME_POINTS.length; i < len; i++) {
			this._flamePoints[i].Set(FLAME_POINTS[i].x, FLAME_POINTS[i].y);
		}
		this.canBeHit = false;
		this.rotateLeft = false;
		this.rotateRight = false;
		let counter = Constants.SHIP_IMMUME - 1;
		this._immuneTimer = setInterval(() => {
			counter--;
			if (counter === 0) {
				this.canBeHit = true;
				this.isVisible = true;
				clearInterval(this._immuneTimer);
				clearInterval(this._blinkTimer);
				this._immuneTimer = null;
				this._blinkTimer = null;
			}
		}, Constants.TIMERS.IMMUNE_INTERVAL);
		this._blinkTimer = setInterval(() => {
			this.isVisible = !this.isVisible;
		}, Constants.TIMERS.BLINK_INTERVAL);
	}
}
