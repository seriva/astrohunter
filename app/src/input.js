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
				for (const e of this.upevents) if (e.key === keyCode) e.event();
				for (const e of this.downevents) if (e.pressed) e.pressed = false;
			},
			false,
		);
		window.addEventListener(
			"keydown",
			(event) => {
				const keyCode = event.keyCode;
				this.pressed[keyCode] = true;
				for (const e of this.downevents) {
					if (e.key === keyCode && !e.pressed) {
						e.event();
						e.pressed = true;
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
