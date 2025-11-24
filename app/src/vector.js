// Vector - 2D math operations for positions, directions, and calculations.
const DEG_TO_RAD = Math.PI / 180;

export class Vector {
	static Zero() {
		return new Vector(0, 0);
	}

	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	Set(x, y) {
		this.x = x;
		this.y = y;
	}

	Add(x, y) {
		this.x += x;
		this.y += y;
	}

	Sub(x, y) {
		this.x -= x;
		this.y -= y;
	}

	Mul(i) {
		this.x *= i;
		this.y *= i;
	}

	Div(i) {
		this.x /= i;
		this.y /= i;
	}

	Rotate(angle) {
		const rangle = angle * DEG_TO_RAD;
		const sin = Math.sin(rangle);
		const cos = Math.cos(rangle);
		const nx = this.x * cos - this.y * sin;
		const ny = this.x * sin + this.y * cos;
		this.x = nx;
		this.y = ny;
	}

	Length() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	DistanceTo(v) {
		const dx = this.x - v.x;
		const dy = this.y - v.y;
		return Math.sqrt(dx * dx + dy * dy);
	}

	Normalize() {
		const length = this.Length();
		if (length > 0) {
			const l = 1 / length;
			this.x *= l;
			this.y *= l;
		}
	}

	Dot(v) {
		return this.x * v.x + this.y * v.y;
	}

	Angle(v) {
		const dot = this.Dot(v);
		const mag = this.Length() * v.Length();
		const angle = Math.acos(dot / mag);
		return Number.isNaN(angle) ? 0 : angle;
	}
}
