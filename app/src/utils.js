// Utility functions - mobile detection helper.
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
