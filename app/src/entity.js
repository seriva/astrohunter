import { Constants } from "./constants.js";
import { Vector } from "./vector.js";

// Entity - base class for all game objects with position, collision, and screen wrapping.
export class Entity {
	constructor(id) {
		this.id = id;
		this.pos = new Vector(0, 0);
		this.dir = new Vector(0, 0);
		this.radius = 0;
		this.created = Date.now();
	}

	Update(_frametime) {}

	Draw() {}

	OnDestroy() {}

	// Checks circular collision with another entity.
	IsColliding(e) {
		const dx = this.pos.x - e.pos.x;
		const dy = this.pos.y - e.pos.y;
		const minDist = this.radius + e.radius;
		// Quick bounding box check first
		if (Math.abs(dx) > minDist || Math.abs(dy) > minDist) {
			return false;
		}
		// Precise distance check
		return Math.sqrt(dx * dx + dy * dy) < minDist;
	}

	// Wraps position around screen edges for seamless scrolling.
	CapOnScreen(width, height) {
		const w = width ?? Constants.SCR_WIDTH;
		const h = height ?? Constants.SCR_HEIGHT;
		// Use entity's radius plus small margin for smooth wrapping
		const margin = this.radius + Constants.SCREEN_WRAP_MARGIN;
		if (this.pos.x < -margin) this.pos.x = w + margin;
		if (this.pos.x > w + margin) this.pos.x = -margin;
		if (this.pos.y < -margin) this.pos.y = h + margin;
		if (this.pos.y > h + margin) this.pos.y = -margin;
	}
}
