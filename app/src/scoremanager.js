// ScoreManager - handles score, ships, asteroid count, and highscore persistence.
import { Constants } from "./constants.js";

export class ScoreManager {
	constructor() {
		this.score = 0;
		this.ships = Constants.SHIPS;
		this.asteroidCount = Constants.WAVE_START;

		// Load highscore with error handling
		try {
			this.highscore = parseInt(localStorage.highscore, 10) || 0;
		} catch (_e) {
			this.highscore = 0;
		}
	}

	// Resets game state for a new game
	Reset() {
		this.score = 0;
		this.ships = Constants.SHIPS;
		this.asteroidCount = Constants.WAVE_START;
	}

	// Adds points to the current score
	AddScore(points) {
		this.score += points;
	}

	// Decrements ship count and returns true if game over
	LoseShip() {
		this.ships--;
		return this.ships <= 0;
	}

	// Increments asteroid count for next wave
	NextWave() {
		this.asteroidCount += Constants.WAVE_INC;
	}

	// Updates highscore if current score is higher
	UpdateHighscore() {
		if (this.score > this.highscore) {
			this.highscore = this.score;
			try {
				localStorage.highscore = this.highscore.toString();
			} catch (_e) {
				// localStorage not available or quota exceeded
			}
			return true;
		}
		return false;
	}
}
