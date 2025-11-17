// Canvas - handles all rendering with dynamic scaling to fill screen.
import { Constants, IS_MOBILE } from "./constants.js";

// Mobile-specific scaling constants
const MOBILE_SCALE = {
	BOX_MULTIPLIER: 1.5,
	BOX_WIDTH_RATIO: 0.9,
	BOX_HEIGHT_RATIO: 0.6,
	FONT_HEIGHT_MULTIPLIER: 0.75,
	FONT_MIN_MULTIPLIER: 1.2,
};

const DESKTOP_SCALE = {
	BOX_WIDTH_RATIO: Constants.UI.BOX_WIDTH_RATIO,
	BOX_HEIGHT_RATIO: Constants.UI.BOX_HEIGHT_RATIO,
	FONT_HEIGHT_MULTIPLIER: 0.25,
	FONT_MIN_MULTIPLIER: 0.5,
};

export class Canvas {
	constructor(id, width, height) {
		this.element = document.getElementById(id);
		if (!this.element) {
			throw new Error(`Canvas element with id "${id}" not found`);
		}
		this.context = this.element.getContext("2d");
		this._baseLogicalWidth = width;
		this._baseLogicalHeight = height;
		this.logicalWidth = width;
		this.logicalHeight = height;
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
		const scale = IS_MOBILE ? MOBILE_SCALE : DESKTOP_SCALE;
		const availableWidth = boxWidth * (1 - padding * 2);
		const availableHeight = boxHeight * (1 - padding * 2);
		const heightBasedSize = availableHeight * scale.FONT_HEIGHT_MULTIPLIER;
		const widthBasedSize = (availableWidth / 20) * 0.6; // 20 chars avg, 0.6 char width ratio
		const boxConstrainedSize = Math.min(heightBasedSize, widthBasedSize);
		const responsiveSize = this.GetResponsiveFontSize(baseFontSize);
		return Math.max(
			Math.min(boxConstrainedSize, responsiveSize),
			responsiveSize * scale.FONT_MIN_MULTIPLIER,
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
		const scale = IS_MOBILE ? MOBILE_SCALE : DESKTOP_SCALE;
		const widthScale = this.width / this._baseLogicalWidth;
		const heightScale = this.height / this._baseLogicalHeight;
		const scaleFactor = IS_MOBILE
			? (widthScale + heightScale) * 0.5 * MOBILE_SCALE.BOX_MULTIPLIER
			: Math.min(widthScale, heightScale);
		const scaledWidth = Constants.UI.BOX_WIDTH_MAX * scaleFactor;
		const scaledHeight = Constants.UI.BOX_HEIGHT_MAX * scaleFactor;
		const maxWidth = this.logicalWidth * scale.BOX_WIDTH_RATIO;
		const maxHeight = this.logicalHeight * scale.BOX_HEIGHT_RATIO;
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
			: s * this._scaleX;
		this.context.font = `bold ${fontSize}px GameFont`;
		this.context.fillText(t, x * this._scaleX, y * this._scaleX);
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
