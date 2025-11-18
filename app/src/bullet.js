// Bullet entity - projectiles fired by the ship.
import { Constants } from "./constants.js";
import { Entity } from "./entity.js";

export class Bullet extends Entity {
	constructor(id, x, y, dirx, diry) {
		super(id);
		this.pos.Set(x, y);
		this.dir.Set(dirx, diry);
		this.radius = Constants.BULLET_RADIUS;
	}

	// Updates bullet position and removes when lifetime expires.
	Update(frametime, canvasWidth, canvasHeight) {
		// Update position
		this.pos.Add(
			this.dir.x * (Constants.BULLET_ACCELERATION * frametime),
			this.dir.y * (Constants.BULLET_ACCELERATION * frametime),
		);
		this.CapOnScreen(canvasWidth, canvasHeight);

		// Update lifetime and remove if expired
		this.lifetime += frametime;
		if (this.lifetime > Constants.BULLET_LIFETIME) {
			this.OnDestroy();
		}
	}

	// Draws the bullet as a small white rectangle.
	Draw(canvas) {
		const offset = Constants.BULLET_DRAW_OFFSET;
		canvas.DrawRect(
			this.pos.x - offset,
			this.pos.y - offset,
			Constants.BULLET_RADIUS,
			Constants.BULLET_RADIUS,
			"#ffffff",
		);
	}
}
