// Sound manager - handles audio playback and caching.
export class Sound {
	constructor() {
		this._soundCache = new Map();
		this._cacheSize = 5;
	}

	// Private: Loads and prepares a sound file.
	_loadSound(file, speed, volume) {
		const sound = new Audio(file);
		sound.playbackRate = speed;
		sound.volume = volume;
		const playPromise = sound.play();
		if (playPromise !== undefined) {
			playPromise
				.then(() => {
					sound.pause();
				})
				.catch(() => {
					// Ignore errors during preload
				});
		}
		return sound;
	}

	// Public API: Caches multiple instances of a sound for overlapping playback.
	CacheSound(id, file, speed, volume) {
		if (!this._soundCache.has(id)) {
			const sounds = [];
			for (let i = 0; i < this._cacheSize; i++) {
				sounds.push(this._loadSound(file, speed, volume));
			}
			this._soundCache.set(id, sounds);
		}
	}

	// Public API: Plays a cached sound effect.
	PlaySound(id) {
		const sounds = this._soundCache.get(id);
		if (sounds) {
			// Find first available (paused) sound
			for (let i = 0, len = sounds.length; i < len; i++) {
				if (sounds[i].paused) {
					const playPromise = sounds[i].play();
					if (playPromise !== undefined) {
						playPromise.catch(() => {
							// Ignore playback errors
						});
					}
					return;
				}
			}
		}
	}

	// Public API: Plays background music with looping.
	PlayMusic(file, speed, volume, loop) {
		const sound = this._loadSound(file, speed, volume);
		sound.loop = loop;
		const playPromise = sound.play();
		if (playPromise !== undefined) {
			playPromise.catch(() => {
				// Ignore playback errors
			});
		}
		return sound;
	}
}
