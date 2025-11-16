export class Input {
	constructor() {
		this.pressed = {};
		this.upevents = [];
		this.downevents = [];
		window.addEventListener(
			"keyup",
			(event) => {
				delete this.pressed[event.keyCode];
				for (let i = 0; i < this.upevents.length; i++) {
					if (this.upevents[i].key === event.keyCode) {
						this.upevents[i].event();
					}
				}
				for (let i = 0; i < this.downevents.length; i++) {
					if (this.downevents[i].pressed) {
						this.downevents[i].pressed = false;
					}
				}
			},
			false,
		);
		window.addEventListener(
			"keydown",
			(event) => {
				this.pressed[event.keyCode] = true;
				for (let i = 0; i < this.downevents.length; i++) {
					if (
						this.downevents[i].key === event.keyCode &&
						!this.downevents[i].pressed
					) {
						this.downevents[i].event();
						this.downevents[i].pressed = true;
					}
				}
			},
			false,
		);
	}

	ClearInputEvents() {
		this.pressed = {};
		this.upevents = [];
		this.downevents = [];
	}

	AddKeyDownEvent(key, event) {
		this.downevents.push({ key: key, event: event, pressed: false });
	}

	AddKeyUpEvent(key, event) {
		this.upevents.push({ key: key, event: event });
	}

	IsDown(keyCode) {
		return this.pressed[keyCode];
	}
}
