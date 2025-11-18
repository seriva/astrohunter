// Ship entity - player controlled spaceship with rotation and movement.
import { Constants, Keys } from "./constants.js";
import { Entity } from "./entity.js";
import { Vector } from "./vector.js";

export class Ship extends Entity {
	constructor(id, x, y) {
		super(id);
		this.pos.Set(x, y);
		this.dir.Set(0, -1);
		this.radius = Constants.SHIP_RADIUS;
		this._velocity = new Vector(0, 0);
		this.canBeHit = false;
		this._showFlame = false;
		this._SetPoints();
		// Cache combined points array to avoid recreating every frame
		this._allPoints = [...this._shipPoints, ...this._flamePoints];
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
		this.dir.Rotate(rotation);
		for (let i = 0; i < this._allPoints.length; i++) {
			this._allPoints[i].Rotate(rotation);
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

	// Private: Defines the ship and flame shape points.
	_SetPoints() {
		this._shipPoints = [];
		this._shipPoints.push(new Vector(0, -18));
		this._shipPoints.push(new Vector(-13, 14));
		this._shipPoints.push(new Vector(0, 11));
		this._shipPoints.push(new Vector(13, 14));
		this._shipPoints.push(new Vector(0, -18));

		this._flamePoints = [];
		this._flamePoints.push(new Vector(-10, 13));
		this._flamePoints.push(new Vector(0, 11));
		this._flamePoints.push(new Vector(10, 13));
		this._flamePoints.push(new Vector(0, 19));
	}

	// Public API: Resets ship to position with invincibility period and blinking effect.
	ResetShip(x, y) {
		// Clear any existing timers from previous reset
		if (this._immuneTimer) clearInterval(this._immuneTimer);
		if (this._blinkTimer) clearInterval(this._blinkTimer);

		this.pos.Set(x, y);
		this.dir.Set(0, -1);
		this._velocity.Set(0, 0);
		this._SetPoints();
		// Rebuild cached points array
		this._allPoints = [...this._shipPoints, ...this._flamePoints];
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
