export class Canvas {
	constructor(id, width, height) {
		this.element = document.getElementById(id);
		this.context = this.element.getContext("2d");
		this.width = width;
		this.height = height;
		this.context.canvas.width = width;
		this.context.canvas.height = height;
	}

	Resize() {
		const newWidth = window.innerWidth;
		const newHeight = window.innerHeight;

		// Update canvas internal dimensions to match display size
		this.width = newWidth;
		this.height = newHeight;
		this.context.canvas.width = newWidth;
		this.context.canvas.height = newHeight;

		// Update CSS size to fill the window
		this.element.style.width = `${newWidth}px`;
		this.element.style.height = `${newHeight}px`;

		// Center the canvas
		this.element.style.marginTop = `${-newHeight / 2}px`;
		this.element.style.marginLeft = `${-newWidth / 2}px`;
	}

	DrawText(t, x, y, s, a) {
		this.context.fillStyle = "#ffffff";
		this.context.textAlign = a;
		// Use "top" baseline for left/right aligned text, "middle" for center-aligned
		this.context.textBaseline = a === "center" ? "middle" : "top";
		this.context.font = `bold ${s}px GameFont`;
		this.context.fillText(t, x, y);
	}

	DrawRect(x, y, w, h, fs, ss, lw) {
		this.context.beginPath();
		this.context.fillStyle = fs;
		this.context.rect(x, y, w, h);
		this.context.fill();

		if (lw !== undefined && ss !== undefined) {
			this.context.lineWidth = lw;
			this.context.strokeStyle = ss;
			this.context.stroke();
		}
	}

	DrawPolyLine(data, x, y, s) {
		this.context.strokeStyle = "#ffffff";
		this.context.lineWidth = "2";
		this.context.beginPath();
		this.context.moveTo(x + data[0].x * s, y + data[0].y * s);
		for (let i = 1; i < data.length; i++) {
			this.context.lineTo(x + data[i].x * s, y + data[i].y * s);
		}
		this.context.lineTo(x + data[0].x * s, y + data[0].y * s);
		this.context.stroke();
	}
}
