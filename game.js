window.onload = function() {
	//start crafty
	Crafty.init(608, 480);
//	Crafty.canvas();
	

	/**
	 * Sprites
	 */
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
	
	/**
	 * Player Sprites
	 */
	Crafty.sprite("sprite_players.png", {
		POLICEMAN: [0, 0, 32, 44],
		sprite_player_death_1: [0, 44, 32, 44],
		spirte_player_Invincible: [0, 88, 32, 44]
	});
	
	/**
	 * initialize the arrays, where bricks, goodys and entitiys shall be saved
	 */
	var brick_array = new Array(19);
	var entity_array = new Array(19);
	var goody_array = new Array(19);
	var bomb_array = new Array(19);
	for (i=0; i <=18; i++){
		brick_array[i] = new Array(15);
		entity_array[i] = new Array(15);
		goody_array[i] = new Array(15);
		bomb_array[i] = new Array(15);
		
	};
	
	var string = "";
	var bombsPlanted = 0;
	var PLAYER_1 = "POLICEMAN"
	
	/**
	 * Returns true for a bricks and filles the 
	 * array with a 4 or 2 at this position
	 */
	function generateBricks (i, j) {
		if(i > 0 && i < 18 && j > 0 && j < 14 && Crafty.randRange(0, 50) > 40 && !(i == 1 && j == 1) && !(i == 1 && j == 2)
			&& !(i == 1 && j == 3) && !(i == 1 && j == 4) && !(i == 2 && j == 1) && !(i == 3 && j == 2) && !(i == 4 && j == 1)){
			//fill Array, return true
			if(Crafty.randRange(0, 50) > 45){
				brick_array[i][j] = 4;
			}else {
				brick_array[i][j] = 2;
			}
			return true;
		} else {
			return false;
		};
	};

	/**
	 * Returns true, if recieved position is around the board 
	 * and filles the array with a 2 at this position
	 */
	function generateWall (i,j) {
		if(i === 0 || i === 18|| j === 0 || j === 14){
			brick_array[i][j] = 1;
			return true;
		} else {
			return false;
		}
	};
	
	/**
	 * Checks if the position of the player is on the Grid,
	 * if not, it looks for the right position for the x-axis
	 */
	function xRelocator (x) {
		var distX = x % 32;
		var help = 0;
		var destinationX = 0;
		
		if(x%32 == 0) {
			return x;
		}else {
			if(distX > 16){
				help = x + 16 - ((x+16) % 16);
				destinationX = help; 
			} else {					
				destinationX = x - distX;
			}
			return destinationX;	
		}
	}	

	/**
	 * Checks if the position of the player is on the Grid,
	 * if not, it looks for the right position for the y-axis
	 */
	function yRelocator (y) {
		var distY = y % 32;
		var help = 0;
		var destinationY = 0;
		
		if(y % 32 == 0) {
			return y-12;
		}else {
			if(distY > 16){
				help = y + 16 - ((y+16) % 16);
				destinationY = help - 12; 
			} else {					
				destinationY = y - distY - 12;
			}
			return destinationY;	
		}
	}	

	/**
	 * Checks if a goody lies at the delivered position
	 */
	function checkForGoody(x, y, self){
		switch (brick_array[x][y]) {
			case 10: // Speedup
				self.attr({speed: self.speed+1.0});
				brick_array[x][y] = 0;
				goody_array[x][y].trigger("explode");
				break;
			case 11: //Bombup
				self.attr({maxBombs: self.maxBombs+1.0});
				brick_array[x][y] = 0;
				goody_array[x][y].trigger("explode");
				break;
			case 12: //Fireup
				self.attr({fireRange: self.fireRange+1.0});
				brick_array[x][y] = 0;
				goody_array[x][y].trigger("explode");
				break;
			case 13: //Timefuze
				self.attr({timeFuze: true});
				brick_array[x][y] = 0;
				goody_array[x][y].trigger("explode");
				break;
			case 14: //DeathSkull
				self.xDeath = goody_array[x][y].x;
				self.yDeath = goody_array[x][y].y;
				self.trigger("explode");
				break;
			case 15: //Disease
				if(self.timeTillExplode > 1){
					self.attr({timeTillExplode: self.timeTillExplode - 2});
				}
				brick_array[x][y] = 0;
				goody_array[x][y].trigger("explode");
				break;
			case 16: //Invincible
				brick_array[x][y] = 0;
				goody_array[x][y].trigger("explode");	
				self.invincible = true;
				self.addComponent("Invincible");
				self.setInvincible(self.PLAYER);
				break;
			default:
				break;
		}
	}
	
	/**
	 * Solid-testfunctions - returns true if there is a number >= 1 for a solid block
	 * also checks for goodies
	 * There has to be a function for each direction
	 */

	function solidDown (self) {
		var x = Math.round((self.x)/32);
		var y = parseInt((self.y+44)/32);
		if (brick_array[x][y] >= 1) {	
			if(brick_array[x][y] >= 10){
				checkForGoody(x, y, self);
				return false;
			}
			if(brick_array[x][y]==5){
				if (Math.round(self.y+10)/32 == y ) {
					return false;
				};
			}
			return true;
		} else {
			return false;
		}
	}
	
	function solidUp (self) {
		var x = Math.round(self.x/32);
		var y = parseInt((self.y+11)/32);
		
		if (brick_array[x][y] >= 1) {
			if(brick_array[x][y] >= 10){
				checkForGoody(x, y, self);
				return false;
			}
			if(brick_array[x][y]==5){
				if (Math.round((self.y/32)) == y ) {
					return false;
				};
			}
			return true;
		} else {
			return false;
		}
	}
	
	function solidRight (self) {
		var x = parseInt((self.x+32)/32);
		var y = parseInt((self.y+27)/32);
		if (brick_array[x][y] >= 1) {
			if(brick_array[x][y] >= 10){
				checkForGoody(x, y, self);
				return false;
			}
			if(brick_array[x][y]==5){
				if (xRelocator(self.x)/32 == x || yRelocator(self.y)/32 == y ) {
					return false;
				};
			}
			return true;
		} else {
			return false;
		}
	}
	
	function solidLeft (self) {
		var x = parseInt((self.x)/32);
		var y = parseInt((self.y+27)/32);
		if (brick_array[x][y] >= 1) {
			if(brick_array[x][y] >= 10){
				checkForGoody(x, y, self);
				return false;
			}
			if(brick_array[x][y]==5){
				if (xRelocator(self.x)/32 == x || yRelocator(self.y)/32 == y ) {
					return false;
				};
			}
			return true;
		} else {
			return false;
		}
	}
	
	function getRandom (max) {
		return Crafty.randRange(0, max);
	};
	
	function generateGoody (type, x, y, typeNumber) {
		var goodyType = type;
		brick_array[x/32][y/32] = typeNumber;
		goody_array[x/32][y/32] = Crafty.e("2D", "DOM", goodyType, "explodable")
			.attr({x: x, y: y, z: 9})
			.bind('explode', function() {
            	this.destroy();
        	});
	};
	

	/**
	 * Generate the world, sets the wall and bricks on the board
	 */
	function generateWorld() {
		/**
		 * Initialize the arrays with 0
		 */
		for (var j = 0; j <= 14; j++) {
			for (var i = 0; i <= 18; i++) {
				brick_array[i][j] = 0;
				entity_array[i][j] = 0;
				goody_array[i][j] = 0;
			}
		};
		
		for(var j = 0; j <=14; j++) {
			for(var i = 0; i <=18; i++) {
				
				if(generateWall(i, j)) { 
				    Crafty.e("2D, DOM, wall")
				    .attr({ x: i * 32, y: j * 32, z: 3 })
				}
				
				if(generateBricks(i, j)) {
					entity_array[i][j] = Crafty.e("2D, DOM, brick, solid, explodable")
						.attr({ x: i * 32, y: j * 32, z: 3 })
						.bind('explode', function() {
							Crafty.e("SetBurningBrick")
								.setBurningBrick(this.x, this.y);
                            this.destroy();
                        })
				}
			}
		}
		/**
		 * Print the values of the array to the console 
		 */

		//console.log(string);
	}
	
	//the loading screen that will display while our assets load
	Crafty.scene("loading", function() {
		//load takes an array of assets and a callback when complete
		Crafty.load(["sprites.png", "sprite_players.png"], function() {
			Crafty.scene("main"); //when everything is loaded, run the main scene
		});
		
		//black background with some loading text
        Crafty.background("#337700");
		Crafty.e("2D, DOM, text").attr({w: 100, h: 20, x: 150, y: 120})
			.text("Loading")   
			.css({"text-align": "center"});
	});
	function printField () {
		var string = "";
		for (var j = 0; j <= 14; j++) {
			for (var i = 0; i <= 18; i++) {
				string += goody_array[i][j];
				if(i==18)
					string+="\n";
			}
		};
		console.log(string);
	}
	
	
	//automatically play the loading scene
	Crafty.scene("loading");
	
	Crafty.scene("main", function() {
		generateWorld();


		/**
		 * gives the entity SetBomb animation and logic
		 */

		/*
		Crafty.c("SetBomb", {
			init:function(){
			},
			setBomb: function(x, y){
				brick_array[x/32][y/32] = 5;
				bombsPlanted += 1;
		        this.addComponent("2D","DOM","SpriteAnimation", "bomb", "animate", "explodable", "Explode")
				.attr({x: x, y: y, z: 9})
		        .animate('bomb', 0, 2, 2)
				.bind("enterframe", function(e){
					this.animate("bomb", 10);
				})
				.bind("explode", function() {
					brick_array[x/32][y/32] = 0;
                    Crafty.e("Explode")
					  .Explode(x, y);
					bombsPlanted -= 1;
					this.destroy();
				})
				.delay(function() {
					brick_array[x/32][y/32] = 0;
                    Crafty.e("Explode")
					  .Explode(x, y);
					bombsPlanted -= 1;
					this.destroy();				
                }, player.timeTillExplode * 1000)				
			}
		});

		Crafty.c("SetTriggeredBomb", {
			init:function(){
				var dropper = this;
			},
			setTriggeredBomb: function(x, y){
				brick_array[x/32][y/32] = 5;
		        this.addComponent("2D","DOM","SpriteAnimation", "bomb", "animate", "explodable")
				.attr({x: x, y: y, z: 9})
		        .animate('bomb', 0, 2, 2)
				.bind("enterframe", function(e){
					this.animate("bomb", 10);
				})
				.bind("explode", function() {
					brick_array[x/32][y/32] = 0;
                    Crafty.e("Explode")
					  .Explode(x, y);
					this.destroy();				
                })				
			}
		});*/
		
		/**
		 * gives the entity Explode animation and logic
		 */
		Crafty.c("Explode", {
			Explode: function(x, y, self){
				Crafty.e("SetFire")
					.setFire(x, y, self)
				var solidDirection = {left: false, right: false, up: false, down: false};
				for (var i=1; i <= player.fireRange; i++) {
					if((x + 32*i < 576)) {
						if(i==1) {
							if (brick_array[(x+32)/32][y/32]>1) {
								solidDirection.right = true;
							};

							Crafty.e("SetFire")
								.setFire(x+32*i, y, self);	
						};
						if ((i>=2) && !solidDirection.right) {
							if (brick_array[(x+32*i)/32][y/32]>1) {
								solidDirection.right=true;
							};
							Crafty.e("SetFire")
								.setFire(x+32*i, y, self);
						};
					};
					
					if((x - 32*i > 0 )) {
						if(i==1) {
							if (brick_array[(x-32)/32][y/32]>1) {
								solidDirection.left = true;
							};
							Crafty.e("SetFire")
								.setFire(x-32*i, y, self);	
						};
						if ((i>=2) && !solidDirection.left) {
							if (brick_array[(x-32*i)/32][y/32]>1) {
								solidDirection.left=true;
							};
							Crafty.e("SetFire")
								.setFire(x-32*i, y, self);
						};
					};
					
					if(y + 32*i < 448) {
						if(i==1) {
							if (brick_array[x/32][(y+32*i)/32]>1) {
								solidDirection.down = true;
							};
							Crafty.e("SetFire")
								.setFire(x, y+32*i, self)
						};
						if ((i>=2) && !solidDirection.down) {
							if (brick_array[x/32][(y+32*i)/32]>1) {
								solidDirection.down=true;
							};
							Crafty.e("SetFire")
								.setFire(x, y+32*i, self)
						};
					};
					
					if(y - 32*i > 0) {
						if(i==1) {
							if (brick_array[x/32][(y-32*i)/32]>1) {
								solidDirection.up = true;
							};
							Crafty.e("SetFire")
								.setFire(x, y-32*i, self)
						};
						if ((i>=2) && !solidDirection.up) {
							if (brick_array[x/32][(y-32*i)/32]>1) {
								solidDirection.up=true;
							};
							Crafty.e("SetFire")
								.setFire(x, y-32*i, self)
						};
					};
				};
			}   
		});

		Crafty.c("SetFire", {
			setFire:function(x, y, self){
				if((x == 0) || (x == 576) || (y == 0) || (y == 448)){
					return;
				} else {
		        this.addComponent("2D","DOM","SpriteAnimation", "fire", "animate")
				.attr({x: x, y: y, z: 9})
		        .animate('fire', 0, 3, 5)
				.bind("enterframe", function(e){
					this.animate("fire", 1);
				})
				.delay(function() {
					self.xDeath = xRelocator(player.x);
					self.yDeath = yRelocator(player.y)+12;
					if(self.xDeath == x && self.yDeath == y){
						if(self.invincible){
							self.removeComponent("Invincible")
							self.addComponent("InvincibleVanish");
							setTimeout(function(){
								self.removeComponent("InvincibleVanish")
								self.addComponent("Normal");
								self.invincible = false;
							},2000);
						}else {
							self.trigger("explode");	
						}
						
					}
					this.destroy();  
                }, 250)

				if(brick_array[x/32][y/32] < 10) {
					switch (brick_array[x/32][y/32]) {
						case 2:
							entity_array[x/32][y/32].trigger("explode");
							brick_array[x/32][y/32] = 0;
							break;
						case 3:
							entity_array[x/32][y/32].sprite(2, 1);
							brick_array[x/32][y/32] = 2;
							break;
						case 4:
							entity_array[x/32][y/32].sprite(1, 1);
							brick_array[x/32][y/32] = 3;
							break;
						case 5:
							bomb_array[x/32][y/32].trigger("explode");
							brick_array[x/32][y/32] = 0;
							break;
						default:
							brick_array[x/32][y/32] = 0;
							break;
					}
				} else { 
					brick_array[x/32][y/32] = 0;
					goody_array[x/32][y/32].trigger("explode");
				}
			}
		}
		});


		/**
		 * animation for a burning brick   
		 */
		Crafty.c("SetBurningBrick", {

			init:function(){
				var dropper = this;
			},
			setBurningBrick: function(x, y){
			    this.addComponent("2D","DOM","SpriteAnimation", "burning_brick", "animate")
				.attr({x: x, y: y, z: 9})
		        .animate('burning_brick', 0, 4, 3)
				.bind("enterframe", function(e){
					this.animate("burning_brick", 10);
				})
				.delay(function() {
					if(Crafty.randRange(0, 50) > 25){
						switch (/*parseInt(getRandom(6))*/3) {
							case 0:
								generateGoody("speed_up", x, y, 10);
								break;
							case 1:
								generateGoody("bombs_up", x, y, 11);
								break;
							case 2:
								generateGoody("fire_up", x, y, 12);
								break;	
							case 3:
								generateGoody("time_fuze", x, y, 13);
								break;
							case 4: 
								generateGoody("death_skull", x, y, 14);
								break;
							case 5: 
								generateGoody("disease", x, y, 15);
								break;
							case 6: 
								generateGoody("invincible", x, y, 16);
								break;
							default:
								break;
						}
					}
					this.destroy();
                }, 500)				
			}
		});
		
		
		Crafty.c('CustomControls', {
			__move: {left: false, right: false, up: false, down: false},	
			__saveMove: {left: false, right: false, up: false, down: false},
			xDeath: 0,
			yDeath: 0,	
			maxBombs: 1,
			speed: 1.5,
			fireRange: 2,
			timeTillExplode: 3,
			timeFuze:false,
			_bombset: false,
			invincible: false,
			_playerReferenz:0,
			triggeredBomb: 0,
			PLAYER: "",
			CustomControls: function(speed, maxBombs, PLAYER) {
				if(speed) this.speed = speed;
				if(maxBombs) this.maxBombs = maxBombs;
				if(PLAYER) this.PLAYER = PLAYER;
				var move = this.__move;
				var saveMove = this.__saveMove;
				var bombset = this._bombset;
				var self = this;
				this.bind('enterframe', function() {
					//move the player in a direction depending on the booleans
					//only move the player in one direction at a time (up/down/left/right)
					if(move.right) {
						//console.log(this.speed);
						if(!solidRight(this)){
							var r = yRelocator(this.y+12);
							this.y = r;
							this.x += this.speed;
							saveMove.right = true;
						}
					}
					else if(move.left) {
						if(!solidLeft(this)){
							var r = yRelocator(this.y+12);
							this.y = r;
							this.x -= this.speed; 
							saveMove.left = true;
						}
					}
					else if(move.up) {
						if(!solidUp(this)){
							var r = xRelocator (this.x);
							this.x = r;
							this.y -= this.speed;
							saveMove.up = true;
						}
					}
					else if(move.down) {
						if(!solidDown(this)){
							var r = xRelocator (this.x);
							this.x = r;
							this.y += this.speed;
							saveMove.down = true;
						}
					}
				}).bind('keydown', function(e) {
					//default movement booleans to false
					move.right = move.left = move.down = move.up = false;
					if(e.keyCode === Crafty.keys.W) {

						
					};
					//if keys are down, set the direction
					if(e.keyCode === Crafty.keys.RA) move.right = true;
					if(e.keyCode === Crafty.keys.LA) move.left = true;
					if(e.keyCode === Crafty.keys.UA) move.up = true;
					if(e.keyCode === Crafty.keys.DA) move.down = true;
					//if key enter is down, set new entity 
					if(e.keyCode === Crafty.keys.A) {
						if(saveMove.right){
							move.right = true;
						}
						else if(saveMove.left){
							move.left = true;
						}
						else if(saveMove.up){
								move.up = true;
						}
						else if(saveMove.down){
							move.down = true;
						}
						var xGrid = xRelocator (this.x);
						var yGrid = yRelocator(this.y)+12;
						//bombset = true;
						if(!this.timeFuze){
							if(bombsPlanted < this.maxBombs){
								if(!(brick_array[xGrid/32][yGrid/32] == 5)){
									brick_array[xGrid/32][yGrid/32] = 5;
									bombsPlanted += 1;
									bomb_array[xGrid/32][yGrid/32] = Crafty.e("2D","DOM","SpriteAnimation", "bomb", "animate", "explodable", "Explode")
												.attr({x: xGrid, y: yGrid, z: 9})
										        .animate('bomb', 0, 2, 2)
												.bind("enterframe", function(e){
													this.animate("bomb", 10);
												})
												.bind("explode", function() {
													brick_array[xGrid/32][yGrid/32] = 0;
								                    Crafty.e("Explode")
													  .Explode(xGrid, yGrid, self);
													bombsPlanted -= 1;
													this.destroy();
												})
										setTimeout(function(){
												brick_array[xGrid/32][yGrid/32] = 0;
												bomb_array[xGrid/32][yGrid/32].trigger("explode");
												bombsPlanted -= 1;
							                }, self.timeTillExplode * 1000);	
								}
							}
						} else {
							if(bombsPlanted < 1) {
								bombsPlanted = 1;
								brick_array[xGrid/32][yGrid/32] = 5;
								triggeredBomb = Crafty.e("2D","DOM","SpriteAnimation", "bomb", "animate", "explodable")
									.attr({x: xGrid, y: yGrid, z: 9})
						        	.animate('bomb', 0, 2, 2)
									.bind("enterframe", function(e){
										this.animate("bomb", 10);
									})
									.bind("explode", function() {
										brick_array[xGrid/32][yGrid/32] = 0;
				                    	Crafty.e("Explode")
									  		.Explode(xGrid, yGrid, self);
											//bombsPlanted -= 1;
										this.destroy();
									})										
							}						
						}
	             };	
					
					this.preventTypeaheadFind(e);
				}).bind('keyup', function(e) {
					//if key is released, stop moving
					if(e.keyCode === Crafty.keys.RA) {
						move.right = false;
						saveMove.right = false;
						this.stop().animate("stay_right", 1);
					}
					if(e.keyCode === Crafty.keys.LA) {
						move.left = false;
						saveMove.left = false;
						this.stop().animate("stay_left", 1);
					}
					if(e.keyCode === Crafty.keys.UA){
						move.up = false;
						saveMove.up = false;
						this.stop().animate("stay_up", 1);
					} 
					if(e.keyCode === Crafty.keys.DA) {
						move.down = saveMove.down = false;
						this.stop().animate("stay_down", 1);
					}
					if(this.timeFuze){
						if(e.keyCode === Crafty.keys.A) {
							triggeredBomb.trigger("explode");
							bombsPlanted = 0;
						}
					}			
					this.preventTypeaheadFind(e);
				})

				
				return this;
			},
			detonateTriggeredBomb: function(){
				if(triggeredBomb){
					triggeredBomb.trigger("explode");
				}
			}
			
		});
		
		
		Crafty.c("PolicemanDeath", {
			init:function(){
				this.addComponent("2D","DOM","SpriteAnimation", "sprite_player_death_1", "animate")
				.animate("sprite_player_death_1", [[0,44],[32,44],[64,44],[96,44],[128,44],[160,44],[192,44],[224,44],[256,44]])
				//.animate('sprite_player_death_1', 0, 3, 8)
				.bind("enterframe", function(e){
					this.animate("sprite_player_death_1", 10);
				})
				.delay(function() {
					this.destroy();				
                }, 600)
			}
		});
		
		Crafty.c("Normal", {
			init:function() {
				var PLAYERCORD = 0;
				
				this.animate("stay_left", [[192,PLAYERCORD]])
				this.animate("stay_right", [[288,PLAYERCORD]])
				this.animate("stay_up", [[96,PLAYERCORD]])
				this.animate("stay_down", [[0,PLAYERCORD]])

				this.animate("walk_left", [[192,PLAYERCORD],[224,PLAYERCORD],[256,PLAYERCORD]])
	            this.animate("walk_right", [[288,0],[320,PLAYERCORD],[352,PLAYERCORD]])
	            this.animate("walk_up", [[96,PLAYERCORD],[128,PLAYERCORD],[160,PLAYERCORD]])
	            this.animate("walk_down", [[0,PLAYERCORD],[32,PLAYERCORD],[64,PLAYERCORD]])
			}
		});
		
		Crafty.c("Invincible", {
			setInvincible:function(PLAYER) {
				if (PLAYER == "POLICEMAN") {
					PLAYERCORD = 88;
				};
				this.animate("stay_left", [[192,PLAYERCORD]])
				this.animate("stay_right", [[288,PLAYERCORD]])
				this.animate("stay_up", [[96,PLAYERCORD]])
				this.animate("stay_down", [[0,PLAYERCORD]])

				this.animate("walk_left", [[192,PLAYERCORD],[224,PLAYERCORD],[256,PLAYERCORD]])
	            this.animate("walk_right", [[288,PLAYERCORD],[320,PLAYERCORD],[352,PLAYERCORD]])
	            this.animate("walk_up", [[96,PLAYERCORD],[128,PLAYERCORD],[160,PLAYERCORD]])
	            this.animate("walk_down", [[0,PLAYERCORD],[32,PLAYERCORD],[64,PLAYERCORD]])

			}
		});
		
		Crafty.c("InvincibleVanish", {
			init:function() {
				this.animate('stay_left', [[192,0],[192,88]])
				this.animate("stay_right", [[288,0],[192,88]])
				this.animate("stay_up", [[96,0],[96,88]])
				this.animate("stay_down", [[0,0], [0,88]])

				this.animate("walk_left", [[192,0],[224,88],[256,0]])
	            this.animate("walk_right", [[288,0],[320,88],[352,0]])
	            this.animate("walk_up", [[96,0],[128,88],[160,0]])
	            this.animate("walk_down", [[0,0],[32,88],[64,0]])
				this.bind("enterframe", function(e) {
					if(this.__move.left) {
						if(!this.isPlaying("walk_left"))
							this.stop().animate("walk_left", 10);
					}
					if(this.__move.right) {
						if(!this.isPlaying("walk_right"))
							this.stop().animate("walk_right", 10);
					}
					if(this.__move.up) {
						if(!this.isPlaying("walk_up"))
							this.stop().animate("walk_up", 10);
					}
					if(this.__move.down) {
						if(!this.isPlaying("walk_down"))
							this.stop().animate("walk_down", 10);
					}
				})
			}
		});
		
		
		//create our player entity with some premade components
		player = Crafty.e("2D, DOM,"+ PLAYER_1 +", controls, CustomControls, animate, explodable, Normal")
			.attr({x: 32, y: 32-12, z: 10})
			.CustomControls(1.7, 10, PLAYER_1)
			.bind("enterframe", function(e) {
				if(this.__move.left) {
					if(!this.isPlaying("walk_left"))
						this.stop().animate("walk_left", 6);
				}
				if(this.__move.right) {
					if(!this.isPlaying("walk_right"))
						this.stop().animate("walk_right", 6);
				}
				if(this.__move.up) {
					if(!this.isPlaying("walk_up"))
						this.stop().animate("walk_up", 6);
				}
				if(this.__move.down) {
					if(!this.isPlaying("walk_down"))
						this.stop().animate("walk_down", 6);
				}
			})
			.bind("explode", function() {
				if(this.timeFuze){
					this.detonateTriggeredBomb();
				}
				Crafty.e("PolicemanDeath")
					.attr({x: this.xDeath, y: this.yDeath-12, z: 10});
				console.log("player Killed");
				this.destroy();
			})
	});
};