// Canvas - handles all rendering with dynamic scaling to fill screen.
import { Constants } from "./constants.js";

export class Canvas {
	constructor(id, width, height) {
		this.element = document.getElementById(id);
		if (!this.element) {
			throw new Error(`Canvas element with id "${id}" not found`);
		}
		this.context = this.element.getContext("2d");
		// Base logical dimensions (used as reference for area calculation)
		this._baseLogicalWidth = width;
		this._baseLogicalHeight = height;
		// Dynamic logical dimensions (adapt to screen aspect ratio)
		this.logicalWidth = width;
		this.logicalHeight = height;
		// Actual display dimensions
		this.width = width;
		this.height = height;
		this._scaleX = 1;
		this._scaleY = 1;
		this.context.canvas.width = width;
		this.context.canvas.height = height;
	}

	// Resizes canvas to fill screen, adjusting logical dimensions to match aspect ratio.
	Resize() {
		const newWidth = window.innerWidth;
		const newHeight = window.innerHeight;

		// Calculate screen aspect ratio
		const screenAspectRatio = newWidth / newHeight;

		// Calculate base area to maintain roughly consistent gameplay area
		const baseArea = this._baseLogicalWidth * this._baseLogicalHeight;

		// Adjust logical dimensions to match screen aspect ratio while maintaining similar area
		// logicalWidth / logicalHeight = screenAspectRatio
		// logicalWidth * logicalHeight = baseArea
		// Solving: logicalHeight = sqrt(baseArea / screenAspectRatio)
		//          logicalWidth = logicalHeight * screenAspectRatio
		this.logicalHeight = Math.sqrt(baseArea / screenAspectRatio);
		this.logicalWidth = this.logicalHeight * screenAspectRatio;

		// Calculate uniform scale (no stretching - scaleX = scaleY)
		this._scaleX = newWidth / this.logicalWidth;
		this._scaleY = newHeight / this.logicalHeight;

		// Use full window dimensions (no letterboxing)
		this.width = newWidth;
		this.height = newHeight;

		// Update canvas internal dimensions to match display size
		this.context.canvas.width = this.width;
		this.context.canvas.height = this.height;

		// Update CSS size to fill the window
		this.element.style.width = `${this.width}px`;
		this.element.style.height = `${this.height}px`;

		// Center the canvas
		this.element.style.marginTop = `${-this.height / 2}px`;
		this.element.style.marginLeft = `${-this.width / 2}px`;
	}

	// Calculates responsive font size based on screen dimensions.
	GetResponsiveFontSize(baseSize) {
		// Scale based on the smaller dimension to ensure text fits on all screens
		const minDimension = Math.min(this.width, this.height);
		const baseDimension = Math.min(
			this._baseLogicalWidth,
			this._baseLogicalHeight,
		);
		const scaleFactor = minDimension / baseDimension;
		return baseSize * scaleFactor;
	}

	// Calculates font size that fits within a box of given dimensions.
	GetFontSizeForBox(boxWidth, boxHeight, baseFontSize, padding = 0.15) {
		const availableWidth = boxWidth * (1 - padding * 2);
		const availableHeight = boxHeight * (1 - padding * 2);
		// Calculate size based on height (primary constraint for vertical text)
		const heightBasedSize = availableHeight * 0.22;
		// Also consider width to prevent text from being too wide
		// Estimate: average character width is about 0.6 * font size
		// Typical text length is ~15-25 chars, use 20 as average
		const avgCharWidth = 0.6;
		const estimatedChars = 20;
		const widthBasedSize = (availableWidth / estimatedChars) * avgCharWidth;
		// Use the smaller constraint to ensure text fits both dimensions
		const boxConstrainedSize = Math.min(heightBasedSize, widthBasedSize);
		// Scale base size to current screen
		const responsiveSize = this.GetResponsiveFontSize(baseFontSize);
		// Use smaller of box constraint or responsive size, but ensure minimum readability
		return Math.max(
			Math.min(boxConstrainedSize, responsiveSize),
			responsiveSize * 0.5,
		);
	}

	// Gets the offset scale factor for text positioning relative to box size.
	GetBoxOffsetScale(boxDims = null) {
		if (!boxDims) {
			boxDims = this.GetUIBoxDimensions();
		}
		return boxDims.height / Constants.UI.BOX_HEIGHT_MAX;
	}

	// Gets the UI box dimensions scaled to screen size.
	GetUIBoxDimensions() {
		// Scale based on the smaller dimension to maintain aspect ratio
		const scaleFactor = Math.min(
			this.width / this._baseLogicalWidth,
			this.height / this._baseLogicalHeight,
		);
		// Calculate base dimensions scaled to screen
		const scaledWidth = Constants.UI.BOX_WIDTH_MAX * scaleFactor;
		const scaledHeight = Constants.UI.BOX_HEIGHT_MAX * scaleFactor;
		// Ensure box doesn't exceed logical dimensions (with some margin)
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
		// Use "top" baseline for left/right aligned text, "middle" for center-aligned
		this.context.textBaseline = a === "center" ? "middle" : "top";
		// Use responsive scaling for better text sizing across different screens
		const fontSize = responsive
			? this.GetResponsiveFontSize(s)
			: s * this._scaleX;
		this.context.font = `bold ${fontSize}px GameFont`;
		// Center text horizontally if center-aligned
		const drawX = a === "center" ? x * this._scaleX : x * this._scaleX;
		this.context.fillText(t, drawX, y * this._scaleX);
	}

	// Draws a rectangle with optional stroke.
	DrawRect(x, y, w, h, fs, ss, lw) {
		this.context.beginPath();
		this.context.fillStyle = fs;
		this.context.rect(
			x * this._scaleX,
			y * this._scaleX,
			w * this._scaleX,
			h * this._scaleX,
		);
		this.context.fill();

		if (lw !== undefined && ss !== undefined) {
			this.context.lineWidth = lw * this._scaleX;
			this.context.strokeStyle = ss;
			this.context.stroke();
		}
	}

	// Draws a polyline - used for ships, asteroids, and vector graphics.
	DrawPolyLine(data, x, y, s) {
		this.context.strokeStyle = "#ffffff";
		this.context.lineWidth = 2 * this._scaleX;
		this.context.beginPath();
		this.context.moveTo(
			(x + data[0].x * s) * this._scaleX,
			(y + data[0].y * s) * this._scaleX,
		);
		for (let i = 1; i < data.length; i++) {
			this.context.lineTo(
				(x + data[i].x * s) * this._scaleX,
				(y + data[i].y * s) * this._scaleX,
			);
		}
		this.context.lineTo(
			(x + data[0].x * s) * this._scaleX,
			(y + data[0].y * s) * this._scaleX,
		);
		this.context.stroke();
	}

	// Draws a UI box with centered text - used for pause, game over, etc.
	DrawUIBox(centerX, centerY, text, fontSize, textOffsetY = 0, boxDims = null) {
		if (!boxDims) {
			boxDims = this.GetUIBoxDimensions();
		}
		this.DrawRect(
			centerX - boxDims.width / 2,
			centerY - boxDims.height / 2,
			boxDims.width,
			boxDims.height,
			"#000000",
			"#ffffff",
			Constants.UI.BOX_STROKE_WIDTH.toString(),
		);
		if (text) {
			const boxFontSize = this.GetFontSizeForBox(
				boxDims.width,
				boxDims.height,
				fontSize,
			);
			this.DrawText(
				text,
				centerX,
				centerY + textOffsetY,
				boxFontSize,
				"center",
				false,
			);
		}
	}
}
