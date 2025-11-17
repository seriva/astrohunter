// Utility functions - mobile detection and keyboard helpers.
// Detects if the device is a mobile or tablet.
export function mobileAndTabletcheck() {
	if (navigator.userAgentData?.mobile !== undefined) {
		return navigator.userAgentData.mobile;
	}
	return (
		window.matchMedia("(max-width: 768px)").matches ||
		/Mobi|Android/i.test(navigator.userAgent)
	);
}

// Disable scrolling by arrow keys and space bar
export function preventScrollKeys() {
	window.addEventListener(
		"keydown",
		(e) => {
			// space and arrow keys
			if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
				e.preventDefault();
			}
		},
		false,
	);
}
