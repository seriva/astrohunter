// Input handler - manages keyboard input and events.
export class Input {
	constructor() {
		this.pressed = {};
		this.upevents = [];
		this.downevents = [];
		window.addEventListener(
			"keyup",
			(event) => {
				const keyCode = event.keyCode;
				delete this.pressed[keyCode];
				// Execute matching up events
				for (let i = 0; i < this.upevents.length; i++) {
					if (this.upevents[i].key === keyCode) {
						this.upevents[i].event();
					}
				}
				// Reset pressed state for down events
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
				const keyCode = event.keyCode;
				this.pressed[keyCode] = true;
				for (let i = 0; i < this.downevents.length; i++) {
					const downEvent = this.downevents[i];
					if (downEvent.key === keyCode && !downEvent.pressed) {
						downEvent.event();
						downEvent.pressed = true;
					}
				}
			},
			false,
		);
	}

	// Clears all input events and pressed keys.
	ClearInputEvents() {
		this.pressed = {};
		this.upevents = [];
		this.downevents = [];
	}

	// Adds a callback for when a key is pressed down.
	AddKeyDownEvent(key, event) {
		this.downevents.push({ key: key, event: event, pressed: false });
	}

	// Adds a callback for when a key is released.
	AddKeyUpEvent(key, event) {
		this.upevents.push({ key: key, event: event });
	}

	// Checks if a key is currently pressed.
	IsDown(keyCode) {
		return this.pressed[keyCode];
	}
}
