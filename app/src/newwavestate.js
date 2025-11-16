import { State } from './state.js';
import { Constants } from './constants.js';
import { States } from './states.js';

export class NewWaveState extends State {
	constructor(game) {
		super(game);
		this.game.input.ClearInputEvents();
		this.game.ShowControlButtons(false);

		this.countDown = 3;
		this.game.asteroidCount = this.game.asteroidCount + Constants.WAVE_INC;
		const self = this;
		this.newWaveTimer = setInterval(() => {
			self.countDown--;
			if (self.countDown === 0){
				clearInterval(self.newWaveTimer);
				self.game.SetState(States.GAME);
			}
		},1000);
	}

	Update() {
	}

	Draw() {
		this.game.canvas.DrawRect(88, 116 ,725 , 250, '#000000', '#ffffff', "3");
		this.game.canvas.DrawText("new wave in",  450, 226, 50, "center");
		this.game.canvas.DrawText("" + this.countDown, 450, 310, 50, "center");
	}
}
