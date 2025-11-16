export class Input {
	constructor() {
		this.pressed = {};
		this.upevents = [];
		this.downevents = [];	
	
		const self = this;
		window.addEventListener('keyup', (event) => { 
			delete self.pressed[event.keyCode];
			for (let i = 0; i < self.upevents.length; i++) {
				if (self.upevents[i].key === event.keyCode){
					self.upevents[i].event();
				}
			}
			for (let i = 0; i < self.downevents.length; i++) {
				if (self.downevents[i].pressed){
					self.downevents[i].pressed = false;
				}
			}		
		}, false);
		window.addEventListener('keydown', (event) => { 
			self.pressed[event.keyCode] = true;
			for (let i = 0; i < self.downevents.length; i++) {
				if (self.downevents[i].key === event.keyCode && (!self.downevents[i].pressed)){
					self.downevents[i].event();
					self.downevents[i].pressed = true;
				}
			}	
		}, false);
	}

	ClearInputEvents() {
		this.pressed    = {};
		this.upevents   = [];
		this.downevents = [];		
	}

	AddKeyDownEvent(key, event) {
		this.downevents.push({key : key, event : event, pressed : false});
	}

	AddKeyUpEvent(key, event) {
		this.upevents.push({key : key, event : event});
	}

	IsDown(keyCode) {
		return this.pressed[keyCode];
	}
}

