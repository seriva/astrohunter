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
		const pos1 = this.pos;
		const rad1 = this.radius;
		const pos2 = e.pos;
		const rad2 = e.radius;
		if (
			pos1.x + rad1 + rad2 > pos2.x &&
			pos1.x < pos2.x + rad1 + rad2 &&
			pos1.y + rad1 + rad2 > pos2.y &&
			pos1.y < pos2.y + rad1 + rad2
		) {
			if (pos1.DistanceTo(pos2) < rad1 + rad2) {
				return true;
			}
		}
		return false;
	}

	// Wraps position around screen edges for seamless scrolling.
	CapOnScreen(width, height) {
		const w = width !== undefined ? width : Constants.SCR_WIDTH;
		const h = height !== undefined ? height : Constants.SCR_HEIGHT;
		if (this.pos.x < -30) this.pos.x = w + 30;
		if (this.pos.x > w + 30) this.pos.x = -30;
		if (this.pos.y < -30) this.pos.y = h + 30;
		if (this.pos.y > h + 30) this.pos.y = -30;
	}
}
