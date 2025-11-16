import { Constants } from "./constants.js";
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
		this.rotateLeft = false;
		this.rotateRight = false;
		this.moveForward = false;
	}

	Update(frametime, input, canvasWidth, canvasHeight) {
		// Ship rotation
		let rotation = 0;
		if (input.IsDown(37) || this.rotateLeft) {
			rotation = -(Constants.SHIP_ROTATIONSPEED * frametime);
		}
		if (input.IsDown(39) || this.rotateRight) {
			rotation = Constants.SHIP_ROTATIONSPEED * frametime;
		}
		this.dir.Rotate(rotation);
		for (let i = 0; i < this.shipPoints.length; i++) {
			this.shipPoints[i].Rotate(rotation);
		}
		for (let i = 0; i < this.flamePoints.length; i++) {
			this.flamePoints[i].Rotate(rotation);
		}

		//	Movement
		this.showFlame = false;
		if (input.IsDown(38) || this.moveForward) {
			this.velocity.Add(
				this.dir.x * (Constants.SHIP_ACCELERATION * frametime),
				this.dir.y * (Constants.SHIP_ACCELERATION * frametime),
			);
			const length = this.velocity.Length();
			if (length > Constants.SHIP_MAXVELOCITY) {
				this.velocity.Div(length);
				this.velocity.Mul(Constants.SHIP_MAXVELOCITY);
			}
			this.showFlame = true;
		}
		this.pos.Add(this.velocity.x, this.velocity.y);
		this.CapOnScreen(canvasWidth, canvasHeight);
	}

	Draw(canvas) {
		if (!this.isVisible) return;
		canvas.DrawPolyLine(this.shipPoints, this.pos.x, this.pos.y, 1);
		if (this.showFlame) {
			canvas.DrawPolyLine(this.flamePoints, this.pos.x, this.pos.y, 1);
		}
	}

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

	ResetShip(x, y) {
		this.pos.Set(x, y);
		this.dir.Set(0, -1);
		this.velocity.Set(0, 0);
		this.SetPoints();
		this.canBeHit = false;
		this.rotateLeft = false;
		this.rotateRight = false;
		this.rotateForward = false;
		let counter = Constants.SHIP_IMMUME - 1;
		const immumeHitTimer = setInterval(() => {
			counter--;
			if (counter === 0) {
				this.canBeHit = true;
				this.isVisible = true;
				clearInterval(immumeHitTimer);
				clearInterval(blinkTimer);
			}
		}, 1000);
		const blinkTimer = setInterval(() => {
			this.isVisible = !this.isVisible;
		}, 250);
	}
}
