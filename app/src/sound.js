// Sound manager - handles audio playback and caching.
export class Sound {
	constructor() {
		this.soundCache = {};
		this.cacheSize = 5;
	}

	// Loads and prepares a sound file.
	LoadSound(file, speed, volume) {
		const sound = new Audio(file);
		sound.playbackRate = speed;
		sound.volume = volume;
		sound.play();
		sound.pause();
		return sound;
	}

	// Caches multiple instances of a sound for overlapping playback.
	CacheSound(id, file, speed, volume) {
		if (!this.soundCache[`${id}_0`]) {
			for (let i = 0; i < this.cacheSize; i++) {
				const sound = this.LoadSound(file, speed, volume);
				this.soundCache[`${id}_${i}`] = sound;
			}
		}
	}

	// Plays a cached sound effect.
	PlaySound(id) {
		if (this.soundCache[`${id}_0`]) {
			let itr = 0;
			while (!this.soundCache[`${id}_${itr}`].paused) {
				itr++;
				if (itr >= this.cacheSize) return;
			}
			this.soundCache[`${id}_${itr}`].play();
		}
	}

	// Plays background music with looping.
	PlayMusic(file, speed, volume, loop) {
		const sound = this.LoadSound(file, speed, volume);
		sound.loop = loop;
		sound.play();
		return sound;
	}
}
