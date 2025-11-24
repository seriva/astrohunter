// Explosion entity - particle effects for collisions and destruction.
import { Constants, IS_MOBILE } from "./constants.js";
import { Entity } from "./entity.js";
import { Vector } from "./vector.js";

export class Explosion extends Entity {
	constructor(id, x, y, particleCount, lifetime, vibrate) {
		super(id);
		this.pos.Set(x, y);
		this._lifetime = lifetime;
		this._points = [];
		this._dirs = [];

		for (let i = 0; i < particleCount; i++) {
			this._points.push(Vector.Zero());
			const dir = new Vector(
				0,
				1 * (Math.random() * Constants.EXPLOSION_ACCELERATION),
			);
			dir.Rotate(Math.random() * Constants.MATH.FULL_CIRCLE_DEG);
			this._dirs.push(dir);
		}

		if (IS_MOBILE && vibrate > 0) {
			navigator.vibrate(vibrate);
		}
	}

	// Updates explosion particles and removes when lifetime expires.
	Update(frametime) {
		// Animate particles
		for (let i = 0, len = this._points.length; i < len; i++) {
			this._points[i].Add(
				this._dirs[i].x * frametime,
				this._dirs[i].y * frametime,
			);
		}

		// Update lifetime and remove if expired
		this.lifetime += frametime;
		if (this.lifetime > this._lifetime) {
			this.OnDestroy();
		}
	}

	// Draws explosion particles as small white rectangles.
	Draw(canvas) {
		const offset = Constants.EXPLOSION_DRAW_OFFSET;
		for (let i = 0, len = this._points.length; i < len; i++) {
			canvas.DrawRect(
				this.pos.x + this._points[i].x - offset,
				this.pos.y + this._points[i].y - offset,
				Constants.EXPLOSION_PART_RADIUS,
				Constants.EXPLOSION_PART_RADIUS,
				"#ffffff",
			);
		}
	}
}
