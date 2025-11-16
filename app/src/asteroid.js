import { Constants } from "./constants.js";
import { Entity } from "./entity.js";
import { Vector } from "./vector.js";

export class Asteroid extends Entity {
	constructor(id, type, x, y, dirx, diry) {
		super(id);
		this.pos.Set(x, y);
		this.dir.Set(dirx, diry);
		this.type = type;
		this.rotationSpeed = (-0.5 + Math.random(1)) / 5;
		this.radius = Constants.ASTEROID[type].RADIUS;
		this.hits = Constants.ASTEROID[type].HITS;
		this.points = [];
		const step = 360 / Constants.ASTEROID[type].POINTCOUNT;
		for (let i = 0; i < Constants.ASTEROID[type].POINTCOUNT; i++) {
			let size =
				Constants.ASTEROID[type].RADIUS - Constants.ASTEROID[type].RADIUS * 0.1;
			size = size + Math.random() * Constants.ASTEROID[type].RADIUS * 0.2;
			const point = new Vector(size, 0);
			point.Rotate(i * step);
			this.points.push(point);
		}
	}

	Update(frametime, _input) {
		// Update position
		this.pos.Add(
			this.dir.x * (Constants.ASTEROID[this.type].ACCELERATION * frametime),
			this.dir.y * (Constants.ASTEROID[this.type].ACCELERATION * frametime),
		);
		this.CapOnScreen();

		//Rotate the asteroid
		for (let i = 0; i < this.points.length; i++) {
			this.points[i].Rotate(this.rotationSpeed * frametime);
		}
	}

	Draw(canvas) {
		canvas.DrawPolyLine(this.points, this.pos.x, this.pos.y, 1);
	}
}
