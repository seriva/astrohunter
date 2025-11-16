import { mobileAndTabletcheck } from "./utils.js";

export const Constants = {
	SCR_WIDTH: 1100,
	SCR_HEIGHT: 620,
	MOB_BUTTON_SIZE: 100,

	SHIPS: 3,

	WAVE_START: 1,
	WAVE_INC: 1,

	SHIP_RADIUS: 15,
	SHIP_ROTATIONSPEED: 0.25,
	SHIP_ACCELERATION: 0.008,
	SHIP_MAXVELOCITY: 4.0,
	SHIP_IMMUME: 4.0,

	BULLET_FIRESPEED: 250,
	BULLET_RADIUS: 4,
	BULLET_LIFETIME: 500,
	BULLET_ACCELERATION: 1.0,

	EXPLOSION_ACCELERATION: 0.5,
	EXPLOSION_PART_RADIUS: 2.0,

	ASTEROID: [
		{
			RADIUS: 40,
			ACCELERATION: 0.02,
			HITS: 7,
			POINTCOUNT: 15,
			POINTS: 1000,
		},
		{
			RADIUS: 25,
			ACCELERATION: 0.04,
			HITS: 3,
			POINTCOUNT: 15,
			POINTS: 500,
		},
		{
			RADIUS: 15,
			ACCELERATION: 0.06,
			HITS: 1,
			POINTCOUNT: 15,
			POINTS: 250,
		},
	],

	START_TEXT: "hit space to start game",
	CONTINUE_TEXT: "hit space to continue",

	BUTTON_IDOL_OPACITY: 0.4,
	BUTTON_PRESSED_OPACITY: 0.8,
};

if (mobileAndTabletcheck()) {
	Constants.START_TEXT = "tap to start game";
	Constants.CONTINUE_TEXT = "tap to continue";
}
