// Canvas - handles all rendering with dynamic scaling to fill screen.
export class Canvas {
	constructor(id, width, height) {
		this.element = document.getElementById(id);
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

	// Draws text with automatic scaling.
	DrawText(t, x, y, s, a) {
		this.context.fillStyle = "#ffffff";
		this.context.textAlign = a;
		// Use "top" baseline for left/right aligned text, "middle" for center-aligned
		this.context.textBaseline = a === "center" ? "middle" : "top";
		// Use scaleX for font size (since scaleX = scaleY, either works)
		this.context.font = `bold ${s * this.scaleX}px GameFont`;
		this.context.fillText(t, x * this.scaleX, y * this.scaleX);
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
}
