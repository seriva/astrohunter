// UIManager - handles mobile control button placement and visibility.
import { Constants, IS_MOBILE } from "./constants.js";

export class UIManager {
	constructor(canvas) {
		this.canvas = canvas;

		if (!IS_MOBILE) return;

		// Get button elements
		this.forward = document.getElementById("forward");
		this.left = document.getElementById("left");
		this.right = document.getElementById("right");
		this.fire = document.getElementById("fire");
		this.buttons = [this.forward, this.left, this.right, this.fire];
	}

	// Places and sizes mobile control buttons.
	PlaceAndSizeButtons() {
		if (!IS_MOBILE) return;

		const setButtons = (button, size, x, y) => {
			button.style.left = `${Math.round(x)}px`;
			button.style.top = `${Math.round(y)}px`;
			button.style.height = `${Math.round(size)}px`;
			button.style.width = `${Math.round(size)}px`;
			button.style.borderRadius = `${Math.round(size / 2)}px`;
		};

		const left = this.canvas.element.offsetLeft;
		const top = this.canvas.element.offsetTop;
		const height = this.canvas.element.clientHeight;
		const width = this.canvas.element.clientWidth;
		const size = Math.round(
			(Constants.MOB_BUTTON_SIZE * width) / this.canvas.logicalWidth,
		);

		setButtons(
			this.left,
			size,
			left + Constants.UI.BUTTON_MARGIN,
			top + (height - 2 * size) - Constants.UI.BUTTON_SPACING,
		);
		setButtons(
			this.right,
			size,
			left + size + Constants.UI.BUTTON_MARGIN,
			top + (height - size) - Constants.UI.BUTTON_SPACING,
		);
		setButtons(
			this.forward,
			size,
			left + (width - (size + Constants.UI.BUTTON_SPACING)),
			top + (height - 2 * size) - Constants.UI.BUTTON_SPACING,
		);
		setButtons(
			this.fire,
			size,
			left + (width - (size * 2 + Constants.UI.BUTTON_SPACING)),
			top + (height - size) - Constants.UI.BUTTON_SPACING,
		);
	}

	// Shows or hides mobile control buttons.
	ShowControlButtons(visible) {
		if (!IS_MOBILE) return;

		this.buttons.forEach((button) => {
			button.style.opacity = Constants.BUTTON_IDOL_OPACITY;
			button.style.visibility = visible ? "visible" : "hidden";
		});
	}
}
