// Service Worker registration and initialization for PWA functionality

// Register Service Worker
export function registerServiceWorker() {
	if ("serviceWorker" in navigator) {
		window.addEventListener("load", () => {
			// Use relative path for GitHub Pages compatibility
			const swPath = "./sw.js";
			navigator.serviceWorker
				.register(swPath)
				.then((registration) => {
					console.log("SW registered: ", registration);

					// Check for updates
					registration.addEventListener("updatefound", () => {
						const newWorker = registration.installing;
						newWorker.addEventListener("statechange", () => {
							if (
								newWorker.state === "installed" &&
								navigator.serviceWorker.controller
							) {
								// New service worker available
								if (confirm("New version available! Reload to update?")) {
									newWorker.postMessage({ action: "skipWaiting" });
									window.location.reload();
								}
							}
						});
					});
				})
				.catch((registrationError) => {
					console.log("SW registration failed: ", registrationError);
				});

			// Listen for service worker updates
			let refreshing = false;
			navigator.serviceWorker.addEventListener("controllerchange", () => {
				if (!refreshing) {
					refreshing = true;
					window.location.reload();
				}
			});
		});
	}
}
