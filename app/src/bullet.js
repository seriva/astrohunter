import { Entity } from './entity.js';
import { Constants } from './constants.js';

export class Bullet extends Entity {
	constructor(id, x, y, dirx, diry) {
		super(id);
		this.pos.Set(x, y);
		this.dir.Set(dirx, diry);
		this.radius = Constants.BULLET_RADIUS;
	}

	Update(frametime) {
		// Update position
		this.pos.Add(this.dir.x * (Constants.BULLET_ACCELERATION*frametime), this.dir.y * (Constants.BULLET_ACCELERATION*frametime));
		this.CapOnScreen();

		// Update lifetime and remove if expands lifetime.
		const lifetime = Date.now() - this.created;
		if (lifetime > Constants.BULLET_LIFETIME){
			this.OnDestroy();
		}
	}	

	Draw(canvas) {
		canvas.DrawRect( this.pos.x-2, this.pos.y-2,Constants.BULLET_RADIUS, Constants.BULLET_RADIUS, '#ffffff');			
	}
}	