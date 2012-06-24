function loadSprites(which){
	/**
	 * Environmental Sprites
	 */
	if(which === "environment"){
		Crafty.sprite(32, "sprites.png", {
			wall: [0, 0],
			brick: [0, 1],
			brick_cracked_1: [1, 1],
			brick_cracked_2: [2, 1],
			bomb: [0, 2],
			fire: [0, 3],
			burning_brick: [0, 4],
			speed_up: [0, 5],
			bombs_up: [1, 5],
			fire_up: [2, 5],
			time_fuze: [3, 5],
			disease: [4, 5],
			invincible: [0, 6],
			death_skull: [0, 7],
		    empty: [0, 5]
		});
	}
	
	/**
	 * Player Sprites
	 */
	if(which === "players"){
		Crafty.sprite("sprite_players.png", {
			POLICEMAN: [0, 0, 32, 44],
			POLICEMAN_DEATH: [0, 44, 32, 44],
			DUKE: [0, 132, 32, 44],
			DUKE_DEATH: [0, 176, 32, 44],
			DETECTIVE: [0, 264, 32, 44],
			DETECTIVE_DEATH: [0, 308, 32, 44],
			GREEN: [0, 396, 32, 44],
			GREEN_DEATH: [0, 440, 32, 44],
			CHINESE: [0, 528, 32, 44],
			CHINESE_DEATH: [0, 572, 32, 44],
			MICHA: [0, 660, 32, 44],
			MICHA_DEATH: [0, 748, 32, 44]
		});
	}
};

