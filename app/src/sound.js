export class Sound {
	constructor() {
		this.soundCache = {};
		this.cachSize = 5;
	}

	LoadSound(file, speed, volume) {
		const sound = new Audio(file);
		sound.playbackRate = speed;
		sound.volume = volume;
		sound.play();
		sound.pause();
		return sound;
	}

	CacheSound(id, file, speed, volume) {
		if (!this.soundCache[`${id}_0`]) {
			for (let i = 0; i < this.cachSize; i++) {
				const sound = this.LoadSound(file, speed, volume);
				this.soundCache[`${id}_${i}`] = sound;
			}
		}
	}

	PlaySound(id) {
		if (this.soundCache[`${id}_0`]) {
			let itr = 0;
			while (!this.soundCache[`${id}_${itr}`].paused) {
				itr = itr + 1;
				if (itr > this.cachSize - 1) return;
			}
			this.soundCache[`${id}_${itr}`].play();
		}
	}

	PlayMusic(file, speed, volume, loop) {
		const sound = this.LoadSound(file, speed, volume);
		sound.loop = loop;
		sound.play();
		return sound;
	}
}
