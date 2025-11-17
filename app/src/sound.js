// Sound manager - handles audio playback and caching.
export class Sound {
	constructor() {
		this._soundCache = {};
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
		if (!this._soundCache[`${id}_0`]) {
			for (let i = 0; i < this._cacheSize; i++) {
				const sound = this._loadSound(file, speed, volume);
				this._soundCache[`${id}_${i}`] = sound;
			}
		}
	}

	// Public API: Plays a cached sound effect.
	PlaySound(id) {
		if (this._soundCache[`${id}_0`]) {
			let itr = 0;
			while (!this._soundCache[`${id}_${itr}`].paused) {
				itr++;
				if (itr >= this._cacheSize) return;
			}
			const playPromise = this._soundCache[`${id}_${itr}`].play();
			if (playPromise !== undefined) {
				playPromise.catch(() => {
					// Ignore playback errors
				});
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
