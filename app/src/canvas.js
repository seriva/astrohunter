// Canvas - handles all rendering with uniform scaling and letterboxing.
// Canvas - handles all rendering with uniform scaling and letterboxing.
import { Constants } from "./constants.js";

export class Canvas {
	constructor(id, width, height) {
		this.element = document.getElementById(id);
		if (!this.element) {
			throw new Error(`Canvas element with id "${id}" not found`);
		}
		this.context = this.element.getContext("2d");
		// Fixed logical dimensions
		this.logicalWidth = width;
		this.logicalHeight = height;
		// Physical canvas dimensions
		this.width = width;
		this.height = height;
		// Scale factor from logical to physical pixels
		this._scale = 1;
		this.context.canvas.width = width;
		this.context.canvas.height = height;
	}

	// Resizes canvas to fill screen with uniform scaling.
	Resize() {
		const newWidth = window.innerWidth;
		const newHeight = window.innerHeight;

		// Calculate uniform scale to fill screen while maintaining aspect ratio
		const scaleX = newWidth / this.logicalWidth;
		const scaleY = newHeight / this.logicalHeight;
		this._scale = Math.min(scaleX, scaleY);

		// Physical canvas size (may be smaller than window to maintain aspect ratio)
		this.width = this.logicalWidth * this._scale;
		this.height = this.logicalHeight * this._scale;

		// Update canvas internal dimensions
		this.context.canvas.width = this.width;
		this.context.canvas.height = this.height;

		// Update CSS size
		this.element.style.width = `${this.width}px`;
		this.element.style.height = `${this.height}px`;

		// Center the canvas
		this.element.style.marginTop = `${-this.height / 2}px`;
		this.element.style.marginLeft = `${-this.width / 2}px`;
	}

	// Calculates responsive font size based on scale.
	GetResponsiveFontSize(baseSize) {
		return baseSize * this._scale;
	}

	// Calculates font size that fits within a box of given dimensions.
	GetFontSizeForBox(_boxWidth, boxHeight, _baseFontSize, padding = 0.125) {
		const availableHeight = boxHeight * (1 - padding * 2);
		// Use consistent 23% of available height for all text
		return availableHeight * 0.2;
	}

	// Gets the UI box dimensions scaled to screen size.
	GetUIBoxDimensions() {
		const scaledWidth = Constants.UI.BOX_WIDTH_MAX * this._scale;
		const scaledHeight = Constants.UI.BOX_HEIGHT_MAX * this._scale;
		const maxWidth = this.logicalWidth * Constants.UI.BOX_WIDTH_RATIO;
		const maxHeight = this.logicalHeight * Constants.UI.BOX_HEIGHT_RATIO;
		return {
			width: Math.min(scaledWidth, maxWidth),
			height: Math.min(scaledHeight, maxHeight),
		};
	}

	// Gets the center X coordinate of the canvas.
	GetCenterX() {
		return this.logicalWidth / 2;
	}

	// Gets the center Y coordinate of the canvas.
	GetCenterY() {
		return this.logicalHeight / 2;
	}

	// Draws text with automatic scaling and responsive sizing.
	DrawText(t, x, y, s, a, responsive = true) {
		this.context.fillStyle = "#ffffff";
		this.context.textAlign = a;
		this.context.textBaseline = a === "center" ? "middle" : "top";
		const fontSize = responsive
			? this.GetResponsiveFontSize(s)
			: s * this._scale;
		this.context.font = `bold ${fontSize}px GameFont`;
		this.context.fillText(t, x * this._scale, y * this._scale);
	}

	// Draws a rectangle with optional stroke.
	DrawRect(x, y, w, h, fs, ss, lw) {
		this.context.beginPath();
		this.context.fillStyle = fs;
		this.context.rect(
			x * this._scale,
			y * this._scale,
			w * this._scale,
			h * this._scale,
		);
		this.context.fill();

		if (lw !== undefined && ss !== undefined) {
			this.context.lineWidth = lw * this._scale;
			this.context.strokeStyle = ss;
			this.context.stroke();
		}
	}

	// Draws a polyline - used for ships, asteroids, and vector graphics.
	DrawPolyLine(data, x, y, s) {
		this.context.strokeStyle = "#ffffff";
		this.context.lineWidth = 2 * this._scale;
		this.context.beginPath();
		this.context.moveTo(
			(x + data[0].x * s) * this._scale,
			(y + data[0].y * s) * this._scale,
		);
		for (let i = 1; i < data.length; i++) {
			this.context.lineTo(
				(x + data[i].x * s) * this._scale,
				(y + data[i].y * s) * this._scale,
			);
		}
		this.context.lineTo(
			(x + data[0].x * s) * this._scale,
			(y + data[0].y * s) * this._scale,
		);
		this.context.stroke();
	}

	// Draws a UI box with centered text lines
	DrawUIBox(textLines, centerX = null, centerY = null) {
		if (centerX === null) centerX = this.GetCenterX();
		if (centerY === null) centerY = this.GetCenterY();

		const boxDims = this.GetUIBoxDimensions();
		this.DrawRect(
			centerX - boxDims.width / 2,
			centerY - boxDims.height / 2,
			boxDims.width,
			boxDims.height,
			"#000000",
			"#ffffff",
			Constants.UI.BOX_STROKE_WIDTH.toString(),
		);

		if (!textLines || textLines.length === 0) return;

		const textSize = this.GetFontSizeForBox(boxDims.width, boxDims.height, 50);
		const lineCount = textLines.length;

		// Calculate vertical spacing based on number of lines
		let offsets;
		if (lineCount === 3) {
			// Top, center, bottom
			offsets = [-0.3, 0, 0.3];
		} else if (lineCount === 2) {
			// Top and bottom
			offsets = [-0.12, 0.12];
		} else if (lineCount === 1) {
			// Centered
			offsets = [0];
		} else {
			// Distribute evenly
			const spacing = 0.6 / (lineCount - 1);
			offsets = textLines.map((_, i) => -0.3 + i * spacing);
		}

		textLines.forEach((line, index) => {
			if (line) {
				// Skip null/undefined lines (for conditional rendering)
				this.DrawText(
					line,
					centerX,
					centerY + boxDims.height * offsets[index],
					textSize,
					"center",
					false,
				);
			}
		});
	}
}
