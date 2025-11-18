// Asteroid entity - obstacles that move and rotate, break into smaller pieces when hit.
import { Constants } from "./constants.js";
import { Entity } from "./entity.js";
import { Vector } from "./vector.js";

export class Asteroid extends Entity {
	constructor(id, type, x, y, dirx, diry) {
		super(id);
		this.pos.Set(x, y);
		this.dir.Set(dirx, diry);
		this._type = type;
		this._rotationSpeed = (-0.5 + Math.random()) / 5;
		this.radius = Constants.ASTEROID[type].RADIUS;
		this.hits = Constants.ASTEROID[type].HITS;
		this._points = [];
		const step =
			Constants.MATH.FULL_CIRCLE_DEG /
			Constants.ASTEROID[this._type].POINTCOUNT;
		for (let i = 0; i < Constants.ASTEROID[this._type].POINTCOUNT; i++) {
			let size =
				Constants.ASTEROID[this._type].RADIUS -
				Constants.ASTEROID[this._type].RADIUS * 0.1;
			size = size + Math.random() * Constants.ASTEROID[this._type].RADIUS * 0.2;
			const point = new Vector(size, 0);
			point.Rotate(i * step);
			this._points.push(point);
		}
	}

	// Updates asteroid position and rotation.
	Update(frametime, canvasWidth, canvasHeight) {
		// Update position
		this.pos.Add(
			this.dir.x * (Constants.ASTEROID[this._type].ACCELERATION * frametime),
			this.dir.y * (Constants.ASTEROID[this._type].ACCELERATION * frametime),
		);
		this.CapOnScreen(canvasWidth, canvasHeight);

		//Rotate the asteroid
		for (let i = 0; i < this._points.length; i++) {
			this._points[i].Rotate(this._rotationSpeed * frametime);
		}
	}

	// Draws the asteroid as a polyline shape.
	Draw(canvas) {
		canvas.DrawPolyLine(this._points, this.pos.x, this.pos.y, 1);
	}
}
