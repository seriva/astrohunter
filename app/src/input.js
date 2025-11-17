// Input handler - manages keyboard input and events.
export class Input {
	constructor() {
		this._pressed = {};
		this._upevents = [];
		this._downevents = [];
		window.addEventListener(
			"keyup",
			(event) => {
				const keyCode = event.keyCode;
				delete this._pressed[keyCode];
				for (const e of this._upevents) if (e.key === keyCode) e.event();
				for (const e of this._downevents) if (e.pressed) e.pressed = false;
			},
			false,
		);
		window.addEventListener(
			"keydown",
			(event) => {
				const keyCode = event.keyCode;
				this._pressed[keyCode] = true;
				for (const e of this._downevents) {
					if (e.key === keyCode && !e.pressed) {
						e.event();
						e.pressed = true;
					}
				}
			},
			false,
		);
	}

	// Public API: Clears all input events and pressed keys.
	ClearInputEvents() {
		this._pressed = {};
		this._upevents = [];
		this._downevents = [];
	}

	// Public API: Adds a callback for when a key is pressed down.
	AddKeyDownEvent(key, event) {
		this._downevents.push({ key: key, event: event, pressed: false });
	}

	// Public API: Adds a callback for when a key is released.
	AddKeyUpEvent(key, event) {
		this._upevents.push({ key: key, event: event });
	}

	// Public API: Checks if a key is currently pressed.
	IsDown(keyCode) {
		return this._pressed[keyCode];
	}
}
