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
		this.baseLogicalWidth = width;
		this.baseLogicalHeight = height;
		// Dynamic logical dimensions (adapt to screen aspect ratio)
		this.logicalWidth = width;
		this.logicalHeight = height;
		// Actual display dimensions
		this.width = width;
		this.height = height;
		this.scaleX = 1;
		this.scaleY = 1;
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
		const baseArea = this.baseLogicalWidth * this.baseLogicalHeight;

		// Adjust logical dimensions to match screen aspect ratio while maintaining similar area
		// logicalWidth / logicalHeight = screenAspectRatio
		// logicalWidth * logicalHeight = baseArea
		// Solving: logicalHeight = sqrt(baseArea / screenAspectRatio)
		//          logicalWidth = logicalHeight * screenAspectRatio
		this.logicalHeight = Math.sqrt(baseArea / screenAspectRatio);
		this.logicalWidth = this.logicalHeight * screenAspectRatio;

		// Calculate uniform scale (no stretching - scaleX = scaleY)
		this.scaleX = newWidth / this.logicalWidth;
		this.scaleY = newHeight / this.logicalHeight;

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
			this.baseLogicalWidth,
			this.baseLogicalHeight,
		);
		const scaleFactor = minDimension / baseDimension;
		return baseSize * scaleFactor;
	}

	// Calculates font size that fits within a box of given dimensions.
	GetFontSizeForBox(_boxWidth, boxHeight, baseFontSize, padding = 0.15) {
		const availableHeight = boxHeight * (1 - padding * 2);
		const heightBasedSize = availableHeight * 0.22; // ~22% of height for good fit
		const responsiveSize = this.GetResponsiveFontSize(baseFontSize);
		// Use smaller constraint, but ensure minimum 60% of responsive size
		return Math.max(
			Math.min(heightBasedSize, responsiveSize),
			responsiveSize * 0.6,
		);
	}

	// Gets the offset scale factor for text positioning relative to box size.
	GetBoxOffsetScale() {
		const boxDims = this.GetUIBoxDimensions();
		return boxDims.height / Constants.UI.BOX_HEIGHT_MAX;
	}

	// Gets the UI box dimensions (useful for calculating text positions).
	GetUIBoxDimensions() {
		const responsiveBoxWidth = Math.min(
			Constants.UI.BOX_WIDTH_MAX * (this.width / this.baseLogicalWidth),
			this.logicalWidth * Constants.UI.BOX_WIDTH_RATIO,
		);
		const responsiveBoxHeight = Math.min(
			Constants.UI.BOX_HEIGHT_MAX * (this.height / this.baseLogicalHeight),
			this.logicalHeight * Constants.UI.BOX_HEIGHT_RATIO,
		);
		return { width: responsiveBoxWidth, height: responsiveBoxHeight };
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
			: s * this.scaleX;
		this.context.font = `bold ${fontSize}px GameFont`;
		// Center text horizontally if center-aligned
		const drawX = a === "center" ? x * this.scaleX : x * this.scaleX;
		this.context.fillText(t, drawX, y * this.scaleX);
	}

	// Draws a rectangle with optional stroke.
	DrawRect(x, y, w, h, fs, ss, lw) {
		this.context.beginPath();
		this.context.fillStyle = fs;
		this.context.rect(
			x * this.scaleX,
			y * this.scaleX,
			w * this.scaleX,
			h * this.scaleX,
		);
		this.context.fill();

		if (lw !== undefined && ss !== undefined) {
			this.context.lineWidth = lw * this.scaleX;
			this.context.strokeStyle = ss;
			this.context.stroke();
		}
	}

	// Draws a polyline - used for ships, asteroids, and vector graphics.
	DrawPolyLine(data, x, y, s) {
		this.context.strokeStyle = "#ffffff";
		this.context.lineWidth = 2 * this.scaleX;
		this.context.beginPath();
		this.context.moveTo(
			(x + data[0].x * s) * this.scaleX,
			(y + data[0].y * s) * this.scaleX,
		);
		for (let i = 1; i < data.length; i++) {
			this.context.lineTo(
				(x + data[i].x * s) * this.scaleX,
				(y + data[i].y * s) * this.scaleX,
			);
		}
		this.context.lineTo(
			(x + data[0].x * s) * this.scaleX,
			(y + data[0].y * s) * this.scaleX,
		);
		this.context.stroke();
	}

	// Draws a UI box with centered text - used for pause, game over, etc.
	DrawUIBox(centerX, centerY, text, fontSize, textOffsetY = 0) {
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
