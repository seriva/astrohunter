import { Entity } from './entity.js';
import { Constants } from './constants.js';
import { Vector } from './vector.js';
import { mobileAndTabletcheck } from './utils.js';

export class Explosion extends Entity {
	constructor(id, x, y, particlecount, lifetime, vibrate) {
		super(id);
		this.pos.Set(x, y);
		this.lifetime = lifetime;
		this.points = [];
		this.dirs = [];

		for (let i = 0; i < particlecount; i++) {
			this.points.push(new Vector(0, 0));
			const dir = new Vector(0, 1*(Math.random()*Constants.EXPLOSION_ACCELERATION));
			dir.Rotate(Math.random()*360);
			this.dirs.push(dir);
		}

		if (mobileAndTabletcheck() && (vibrate > 0)){
			navigator.vibrate(vibrate);
		}
	}

	Update(frametime) {
		// Animate particles
		for (let i = 0; i < this.points.length; i++) {
			this.points[i].Add(this.dirs[i].x * frametime, this.dirs[i].y * frametime);
		}

		// Update lifetime and remove if expands lifetime
		const delta = Date.now() - this.created;
		if (delta > this.lifetime){
			this.OnDestroy();
		}
	}

	Draw(canvas) {
		for (let i = 0; i < this.points.length; i++) {
			canvas.DrawRect((this.pos.x + this.points[i].x)-2, (this.pos.y + this.points[i].y)-2, Constants.EXPLOSION_PART_RADIUS, Constants.EXPLOSION_PART_RADIUS, '#ffffff');
		}
	}
}
