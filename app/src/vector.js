export class Vector {
	constructor(x, y) {
		this.x = x;
		this.y = y;			
	}

	Set(x, y) {
		this.x = x;
		this.y = y;					
	}
		
	Add(x, y) {
		this.x = this.x + x;
		this.y = this.y + y;					
	}

	Min(x, y) {
		this.x = this.x - x;
		this.y = this.y - y;					
	}	

	Mul(i) {
		this.x = this.x * i;
		this.y = this.y * i;					
	}	

	Div(i) {
		this.x = this.x / i;
		this.y = this.y / i;					
	}

	Rotate(angle) {
		const rangle = angle * (Math.PI/180);
		const sin = Math.sin(rangle);
		const cos = Math.cos(rangle);
		const nx = (this.x*cos) - (this.y*sin);
		const ny = (this.x*sin) + (this.y*cos);	
		this.x = nx;
		this.y = ny;	
	}		
	
	Length() {
		return Math.sqrt((this.x *this.x) + (this.y * this.y));
	}	

	DistanceTo(v) {
		let distance = Math.sqrt(((this.x - v.x) * (this.x - v.x)) + ((this.y - v.y) * (this.y - v.y)));
		if (distance < 0) { distance = distance * -1; }
		return distance;
	}	

	Normalize() {
		const l = 1/this.Length();
		this.x = this.x * l;
		this.y = this.y * l;
	}		
	
	Dot(v) {
		return ((this.x*v.x) + (this.y*v.y));
	}
	
	Angle(v) {
		const dot = this.Dot(v);
		const mag = this.Length() * v.Length();
		const angle = Math.acos( dot / mag );
		if(isNaN(angle)){
			return 0
		} else{
			return angle;	
		}
	}
}