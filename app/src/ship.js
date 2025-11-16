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
		this.velocity = new Vector(0, 0);
		this.canBeHit = false;
		this.showFlame = false;
		this.SetPoints();
		// Cache combined points array to avoid recreating every frame
		this.allPoints = [...this.shipPoints, ...this.flamePoints];
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
		for (let i = 0; i < this.allPoints.length; i++) {
			this.allPoints[i].Rotate(rotation);
		}

		//	Movement
		this.showFlame = false;
		if (input.IsDown(Keys.UP) || this.moveForward) {
			this.velocity.Add(
				this.dir.x * (Constants.SHIP_ACCELERATION * frametime),
				this.dir.y * (Constants.SHIP_ACCELERATION * frametime),
			);
			const length = this.velocity.Length();
			if (length > Constants.SHIP_MAXVELOCITY) {
				// Normalize and scale in one operation
				this.velocity.Mul(Constants.SHIP_MAXVELOCITY / length);
			}
			this.showFlame = true;
		}
		this.pos.Add(this.velocity.x, this.velocity.y);
		this.CapOnScreen(canvasWidth, canvasHeight);
	}

	// Draws the ship and flame effect.
	Draw(canvas) {
		if (!this.isVisible) return;
		canvas.DrawPolyLine(this.shipPoints, this.pos.x, this.pos.y, 1);
		if (this.showFlame) {
			canvas.DrawPolyLine(this.flamePoints, this.pos.x, this.pos.y, 1);
		}
	}

	// Defines the ship and flame shape points.
	SetPoints() {
		this.shipPoints = [];
		this.shipPoints.push(new Vector(0, -18));
		this.shipPoints.push(new Vector(-13, 14));
		this.shipPoints.push(new Vector(0, 11));
		this.shipPoints.push(new Vector(13, 14));
		this.shipPoints.push(new Vector(0, -18));

		this.flamePoints = [];
		this.flamePoints.push(new Vector(-10, 13));
		this.flamePoints.push(new Vector(0, 11));
		this.flamePoints.push(new Vector(10, 13));
		this.flamePoints.push(new Vector(0, 19));
	}

	// Resets ship to position with invincibility period and blinking effect.
	ResetShip(x, y) {
		this.pos.Set(x, y);
		this.dir.Set(0, -1);
		this.velocity.Set(0, 0);
		this.SetPoints();
		// Rebuild cached points array
		this.allPoints = [...this.shipPoints, ...this.flamePoints];
		this.canBeHit = false;
		this.rotateLeft = false;
		this.rotateRight = false;
		let counter = Constants.SHIP_IMMUME - 1;
		const immumeHitTimer = setInterval(() => {
			counter--;
			if (counter === 0) {
				this.canBeHit = true;
				this.isVisible = true;
				clearInterval(immumeHitTimer);
				clearInterval(blinkTimer);
			}
		}, Constants.TIMERS.IMMUNE_INTERVAL);
		const blinkTimer = setInterval(() => {
			this.isVisible = !this.isVisible;
		}, Constants.TIMERS.BLINK_INTERVAL);
	}
}
