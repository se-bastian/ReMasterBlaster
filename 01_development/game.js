window.onload = function() {
	//start crafty
	Crafty.init(608, 480);
	
	/**
	 * Sprites
	 */
	loadSprites("environment");
	loadSprites("players");
	
	/**
	 * initialize the arrays, where bricks, goodys and entitiys shall be saved
	 */
	var brick_array = new Array(19);
	var entity_array = new Array(19);
	var goody_array = new Array(19);
	var bomb_array = new Array(19);
	var player_position_array = new Array(19);
	
	for (i=0; i <=18; i++){
		brick_array[i] = new Array(15);
		entity_array[i] = new Array(15);
		goody_array[i] = new Array(15);
		bomb_array[i] = new Array(15);
	};
	
	var A = 65;
	var S = 83;
	var D = 68;
	var W = 87;
	var SPACE = 32;
	
	var LA = 37;
	var DA = 40;
	var RA = 39;
	var UA = 38;
	var ENTER = 13;
	
	var string = "";
	var MAX_PLAYERS = 2;
	var PLAYERS_ALIVE = 2;
	var PLAYER_1 = "MICHA";
	var PLAYER_2 = "DETECTIVE";
	var players = new Array(5);
	for (var i=0; i < players.length; i++) {
		players[i] = undefined;
	};
	
	var ranking = new Array(5);
	for (var i=1; i <= MAX_PLAYERS; i++) {
		ranking[i] = 0;
	};
	
	function checkForWinner(dyingPlayer){
		var help=0;
		if(PLAYERS_ALIVE<=1){
			for (var i=0; i < players.length; i++) {
				if(players[i] != undefined){
					console.log("Winner: " + players[i].PLAYER);
				} else {
					help = help +1;
				}
			};
			if(help == 4){
				for (var i=0; i < players.length; i++) {
					if(players[i] != undefined){
						ranking[1] = players[i].PLAYER_NUMBER;
					}
				}
			}
		}
		for (var i = MAX_PLAYERS; i >= 1; i--) {
			if(ranking[i]==0){
				ranking[i] = dyingPlayer.PLAYER_NUMBER;
				break;
			}
		};
		console.log("erster: " +  ranking[1]);
		console.log("zweiter: " + ranking[2]);
	}
	
	/**
	 * Returns true for a bricks and filles the 
	 * array with a 4 or 2 at this position
	 */
	function generateBricks (i, j) {
		if(i > 0 && i < 18 && j > 0 && j < 14 && Crafty.randRange(0, 50) > 40 && !(i == 1 && j == 1) && !(i == 1 && j == 2)
			&& !(i == 1 && j == 3) && !(i == 1 && j == 4) && !(i == 2 && j == 1) && !(i == 3 && j == 2) && !(i == 4 && j == 1)
		    && !(i == 17 && j == 13) && !(i == 16 && j == 13) && !(i == 15 && j == 13) && !(i == 17 && j == 12) && !(i == 17 && j == 11)){
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
	

	function xPlayerRelocator (x) {
		var distX = x % 32;
		var destinationX = 0;
		if(x%32 == 0) {
			return x;
		}else {
			if(distX > 16){
				destinationX = Math.round(x) + 1.0;;
			} else {					
				destinationX = Math.round(x) - 1.0;;
			}
			return destinationX;	
		}
	}
	
	function yPlayerRelocator (y) {
		var distY = y % 32;
		var destinationY = 0;
		if(y%32 == 0) {
			return y-12;
		}else {
			if(distY > 16){
				destinationY = Math.round(y) + 1.0;;
			} else {					
				destinationY = Math.round(y) - 1.0;;
			}
			return destinationY-12;	
		}
	}
	
	/**
	 * Checks if the position of the player is on the Grid,
	 * if not, it looks for the right position for the x-axis
	 */
	function xRelocator (x) {
		var distX = x % 32;
		var destinationX = 0;		
		if(x%32 == 0) {
			return x;
		}else {
			if(distX > 16){
				destinationX = x + 16 - ((x+16) % 16);; 
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
		var destinationY = 0;
		if(y % 32 == 0) {
			return y-12;
		}else {
			if(distY > 16){
				destinationY =  y + 16 - ((y+16) % 16) - 12;
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
				self.setInvincibleAnimation(self.PLAYER);
				break;
			default:
				break;
		}
	}
	
	/**
	 * Solid-testfunction - returns true if there is a number >= 1 for a solid block
	 * also checks for goodies
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
				if (Math.round(self.y+12)/32 == y ) {
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
		Crafty.e("2D, DOM, text")
			.attr({w: 32, h: 20, x: 304, y: 240})
			.text("Loading")  
			.css({"text-align": "center"});
	});
	

	//automatically play the loading scene
	Crafty.scene("loading");
	
	Crafty.scene("main", function() {
		generateWorld();

		/**
		 * gives the entity Explode animation and logic
		 */
		Crafty.c("Explode", {
			Explode: function(x, y, self){
				self.bombsPlanted -= 1;
				Crafty.e("SetFire")
					.setFire(x, y, 0, 0, self, 0);
				this.delay(function() {
						//fire left 
						Crafty.e("SetFire")
							.setFire(x, y, -1, 0, self, self.fireRange-1);
						//fire right 	
						Crafty.e("SetFire")
							.setFire(x, y, 1, 0, self, self.fireRange-1);
						//fire up
						Crafty.e("SetFire")
							.setFire(x, y, 0, -1, self, self.fireRange-1);
						//fire down
						Crafty.e("SetFire")
							.setFire(x, y, 0, 1, self, self.fireRange-1);
				}, 100);
			}   
		});
		
		function removeInvincibleFromPlayer(player){
			setTimeout(function(){
				player.removeComponent("InvincibleVanish")
				player.addComponent("Normal");
				player.setNormalAnimation(player.PLAYER);
				player.invincible = false;
			},2000);
		}
		/**
		 * Sets a fire and checks for stuff underneath
		 */
		Crafty.c("SetFire", {
			setFire:function(x, y, dx, dy, self, fireRangeLeft){
				var x = x+(dx*32);
				var y = y+(dy*32);
				
				if((x == 0) || (x == 576) || (y == 0) || (y == 448)){
					return;
				} else if(fireRangeLeft >= 0) {
		       	 this.addComponent("2D","DOM","SpriteAnimation", "fire", "animate")
					.attr({x: x, y: y, z: 100})
			        .animate('fire', 0, 3, 5)
					.bind("enterframe", function(e){
						this.animate("fire", 1);
					})
					.delay(function() {
						self.xDeath = xRelocator(self.x);
						self.yDeath = yRelocator(self.y)+12;
						
						for (var i=0; i < players.length; i++) {
			 	 			if(players[i] != undefined){							
			 	 				if(xRelocator(players[i].x) == x && yRelocator(players[i].y)+12 == y){
									if(players[i].invincible){
										players[i].removeComponent("Invincible");
										players[i].addComponent("InvincibleVanish");
										players[i].setInvincibleVanishAnimation(players[i].PLAYER);
										removeInvincibleFromPlayer(players[i]);
									}else{
										players[i].xDeath = xRelocator(x);
										players[i].yDeath = yRelocator(y)+12;
										players[i].trigger("explode");
									}			
								}
							}
			 	 		};
						this.destroy();  
	                }, 250);
				
					if(brick_array[x/32][y/32] < 10) {
						switch (brick_array[x/32][y/32]) {
							case 2:
								fireRangeLeft = 0;
								entity_array[x/32][y/32].trigger("explode");
								brick_array[x/32][y/32] = 0;
								break;
							case 3:
								fireRangeLeft = 0;
								entity_array[x/32][y/32].sprite(2, 1);
								brick_array[x/32][y/32] = 2;
								break;
							case 4:
								fireRangeLeft = 0;
								entity_array[x/32][y/32].sprite(1, 1);
								brick_array[x/32][y/32] = 3;
								break;
							case 5:
								fireRangeLeft = 0;
								bomb_array[x/32][y/32].trigger("explode");
								brick_array[x/32][y/32] = 0;
								break;
							default:
								brick_array[x/32][y/32] = 0;
								break;
						}
					} else { 
						fireRangeLeft = 0;
						brick_array[x/32][y/32] = 0;
						goody_array[x/32][y/32].trigger("explode");
					}
					this.delay(function	() {
						fireRangeLeft -= 1;
						Crafty.e("SetFire")
							.setFire(x, y, dx, dy, self, fireRangeLeft);
					}, 150);
			} else{}
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
			triggeredBomb: 0,
			bombsPlanted: 0,
			PLAYER: "",
			PLAYER_NUMBER: 1,
			CustomControlsPlayer: function(speed, maxBombs, PLAYER, L, R, U, D, B) {
				setReference0(this);
				if(speed) this.speed = speed;
				if(maxBombs) this.maxBombs = maxBombs;
				if(PLAYER) this.PLAYER = PLAYER;
			
				var costumKeys = {left: 0, right: 0, up: 0, down: 0};
				if( L && R && U && D && B){
					costumKeys.left = L;
					costumKeys.right = R;
					costumKeys.up = U;
					costumKeys.down = D;
					costumKeys.bomb = B;
				}
				
				var move = this.__move;
				var saveMove = this.__saveMove;
				var bombset = this._bombset;
				var self = this;
				var xOldRelativePlayerPosition = 0;
				var yOldRelativePlayerPosition = 0;

				var xNewRelativePlayerPosition = xRelocator(this.x)/32;
				var yNewRelativePlayerPosition = (yRelocator(this.y+12)+12)/32;
				this.z = yNewRelativePlayerPosition+9;

				this.bind('enterframe', function() {
					xNewRelativePlayerPosition = xRelocator(this.x)/32;
					yNewRelativePlayerPosition = (yRelocator(this.y+12)+12)/32;
					
					if(xOldRelativePlayerPosition != xNewRelativePlayerPosition || yOldRelativePlayerPosition != yNewRelativePlayerPosition){
						if(yNewRelativePlayerPosition > yOldRelativePlayerPosition){
							this.z +=1
						} 
						if(yNewRelativePlayerPosition < yOldRelativePlayerPosition){
							this.z -=1
						}
						
						xOldRelativePlayerPosition = xNewRelativePlayerPosition;
						yOldRelativePlayerPosition = yNewRelativePlayerPosition;						
					}
					if(move.right) {
						if(!solidRight(this)){
							var r = yPlayerRelocator(this.y+12);
							this.y = r;
							this.x += this.speed;
							saveMove.right = true;
						}
					}
					else if(move.left) {
						if(!solidLeft(this)){
							var r = yPlayerRelocator(this.y+12);
							this.y = r;
							this.x -= this.speed; 
							saveMove.left = true;
						}
					}
					else if(move.up) {
						if(!solidUp(this)){
							var r = xPlayerRelocator (this.x);
							this.x = r;
							this.y -= this.speed;
							saveMove.up = true;
						}
					}
					else if(move.down) {
						if(!solidDown(this)){
							var r = xPlayerRelocator (this.x);
							this.x = r;
							this.y += this.speed;
							saveMove.down = true;
						}
					}
				}).bind('keydownself', function(e) {
					if(e.which === costumKeys.right) {
						saveMove.right = true;
						move.right = true;
					}
					if(e.which === costumKeys.left) move.left = true;
					if(e.which === costumKeys.up) move.up = true;
					if(e.which === costumKeys.down) move.down = true;
					if(e.which === costumKeys.bomb) {
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
						if(!this.timeFuze){
							if(this.bombsPlanted < this.maxBombs){
								if(!(brick_array[xGrid/32][yGrid/32] == 5)){
									brick_array[xGrid/32][yGrid/32] = 5;
									this.bombsPlanted += 1;									
									bomb_array[xGrid/32][yGrid/32] = Crafty.e("2D","DOM","SpriteAnimation", "bomb", "animate", "explodable", "Explode")
												.attr({x: xGrid, y: yGrid, z: 10})
										        .animate('bomb', 0, 2, 2)
												.bind("enterframe", function(e){
													this.animate("bomb", 10);
												})
												.bind("explode", function() {
													brick_array[xGrid/32][yGrid/32] = 0;
								                    Crafty.e("Explode")
													  .Explode(xGrid, yGrid, self);
													this.destroy();
												})
										setTimeout(function(){
												brick_array[xGrid/32][yGrid/32] = 0;
												bomb_array[xGrid/32][yGrid/32].trigger("explode");
							                }, self.timeTillExplode * 1000);	
								}
							}
						} else {
							if(this.bombsPlanted < 1) {
								this.bombsPlanted = 1;
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
										this.destroy();
									})										
							}						
						}
	             };	
					
				}).bind('keyupself', function(e) {
					if(e.which === costumKeys.right) {
						move.right = false;
						saveMove.right = false;
						this.stop().animate("stay_right_"+PLAYER, 1);
					}
					if(e.which === costumKeys.left) {
						move.left = false;
						saveMove.left = false;
						this.stop().animate("stay_left_"+PLAYER, 1);
					}
					if(e.which === costumKeys.up){
						move.up = false;
						saveMove.up = false;
						this.stop().animate("stay_up_"+PLAYER, 1);
					} 
					if(e.which === costumKeys.down) {
						move.down = saveMove.down = false;
						this.stop().animate("stay_down_"+PLAYER, 1);
					}
					
					
					if(this.timeFuze){
						if(e.which === costumKeys.bomb) {
							triggeredBomb.trigger("explode");
							bombsPlanted = 0;
						}
					}			
				})

				
				return this;
			},
			detonateTriggeredBomb: function(){
				if(triggeredBomb){
					triggeredBomb.trigger("explode");
				}
			}
			
		});

		Crafty.c('CustomControls2', {
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
			triggeredBomb: 0,
			bombsPlanted: 0,
			PLAYER: "",
			PLAYER_NUMBER: 2,
			CustomControlsPlayer: function(speed, maxBombs, PLAYER, L, R, U, D, B) {
				setReference1(this);
				if(speed) this.speed = speed;
				if(maxBombs) this.maxBombs = maxBombs;
				if(PLAYER) this.PLAYER = PLAYER;
			
				var costumKeys = {left: 0, right: 0, up: 0, down: 0};
				if( L && R && U && D && B){
					costumKeys.left = L;
					costumKeys.right = R;
					costumKeys.up = U;
					costumKeys.down = D;
					costumKeys.bomb = B;
				}
				
				var move = this.__move;
				var saveMove = this.__saveMove;
				var bombset = this._bombset;
				var self = this;
				var xOldRelativePlayerPosition = 0;
				var yOldRelativePlayerPosition = 0;

				var xNewRelativePlayerPosition = xRelocator(this.x)/32;
				var yNewRelativePlayerPosition = (yRelocator(this.y+12)+12)/32;
				this.z = yNewRelativePlayerPosition+9;

				this.bind('enterframe', function() {
					xNewRelativePlayerPosition = xRelocator(this.x)/32;
					yNewRelativePlayerPosition = (yRelocator(this.y+12)+12)/32;
					
					if(xOldRelativePlayerPosition != xNewRelativePlayerPosition || yOldRelativePlayerPosition != yNewRelativePlayerPosition){
						if(yNewRelativePlayerPosition > yOldRelativePlayerPosition){
							this.z +=1
						} 
						if(yNewRelativePlayerPosition < yOldRelativePlayerPosition){
							this.z -=1
						}
						xOldRelativePlayerPosition = xNewRelativePlayerPosition;
						yOldRelativePlayerPosition = yNewRelativePlayerPosition;						
					}
					if(move.right) {
						if(!solidRight(this)){
							var r = yPlayerRelocator(this.y+12);
							this.y = r;
							this.x += this.speed;
							saveMove.right = true;
						}
					}
					else if(move.left) {
						if(!solidLeft(this)){
							var r = yPlayerRelocator(this.y+12);
							this.y = r;
							this.x -= this.speed; 
							saveMove.left = true;
						}
					}
					else if(move.up) {
						if(!solidUp(this)){
							var r = xPlayerRelocator (this.x);
							this.x = r;
							this.y -= this.speed;
							saveMove.up = true;
						}
					}
					else if(move.down) {
						if(!solidDown(this)){
							var r = xPlayerRelocator (this.x);
							this.x = r;
							this.y += this.speed;
							saveMove.down = true;
						}
					}
				}).bind('keydownself', function(e) {
					if(e.which === costumKeys.right) move.right = true;
					if(e.which === costumKeys.left) move.left = true;
					if(e.which === costumKeys.up) move.up = true;
					if(e.which === costumKeys.down) move.down = true;
					if(e.which === costumKeys.bomb) {
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
						if(!this.timeFuze){
							if(this.bombsPlanted < this.maxBombs){
								if(!(brick_array[xGrid/32][yGrid/32] == 5)){
									brick_array[xGrid/32][yGrid/32] = 5;
									this.bombsPlanted += 1;									
									bomb_array[xGrid/32][yGrid/32] = Crafty.e("2D","DOM","SpriteAnimation", "bomb", "animate", "explodable", "Explode")
												.attr({x: xGrid, y: yGrid, z: 10})
										        .animate('bomb', 0, 2, 2)
												.bind("enterframe", function(e){
													this.animate("bomb", 10);
												})
												.bind("explode", function() {
													brick_array[xGrid/32][yGrid/32] = 0;
								                    Crafty.e("Explode")
													  .Explode(xGrid, yGrid, self);
													this.destroy();
												})
										setTimeout(function(){
												brick_array[xGrid/32][yGrid/32] = 0;
												bomb_array[xGrid/32][yGrid/32].trigger("explode");
							                }, self.timeTillExplode * 1000);	
								}
							}
						} else {
							if(this.bombsPlanted < 1) {
								this.bombsPlanted = 1;
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
										this.destroy();
									})										
							}						
						}
	             };	
					
				}).bind('keyupself', function(e) {
					if(e.which === costumKeys.right) {
						move.right = false;
						saveMove.right = false;
						this.stop().animate("stay_right_"+PLAYER, 1);
					}
					if(e.which === costumKeys.left) {
						move.left = false;
						saveMove.left = false;
						this.stop().animate("stay_left_"+PLAYER, 1);
					}
					if(e.which === costumKeys.up){
						move.up = false;
						saveMove.up = false;
						this.stop().animate("stay_up_"+PLAYER, 1);
					} 
					if(e.which === costumKeys.down) {
						move.down = saveMove.down = false;
						this.stop().animate("stay_down_"+PLAYER, 1);
					}
					
					
					if(this.timeFuze){
						if(e.which === costumKeys.bomb) {
							triggeredBomb.trigger("explode");
							bombsPlanted = 0;
						}
					}			
				})

				
				return this;
			},
			detonateTriggeredBomb: function(){
				if(triggeredBomb){
					triggeredBomb.trigger("explode");
				}
			}
		});
		function getPlayerCord(playerString) {
			if (playerString == "POLICEMAN") {
				return 0;
			} else if(playerString == "DUKE"){
				return 132;
			} else if(playerString == "DETECTIVE"){
				return 264;
			} else if(playerString == "GREEN"){
				return 396;
			} else if(playerString == "CHINESE"){
				return 528;			
			} else if(playerString == "MICHA"){
				return 660;
			} else{
				return 1000;
			}
		};
		
		function removeReference(self) {
			for (var i=0; i < players.length; i++) {
				if(players[i] == self){
					players[i] = undefined;
				}
			};
		};
		
		Crafty.c("DeathAnimation", {
			setDeathAnimation:function(self){
				var PLAYERDEATHCORD = getPlayerCord(self.PLAYER) + 44;
				this.addComponent(self.PLAYER+"_DEATH")
				.animate(self.PLAYER+"_DEATH", [[0,PLAYERDEATHCORD],[32,PLAYERDEATHCORD],[64,PLAYERDEATHCORD],
				[96,PLAYERDEATHCORD],[128,PLAYERDEATHCORD],[160,PLAYERDEATHCORD],[192,PLAYERDEATHCORD],
				[224,PLAYERDEATHCORD],[256,PLAYERDEATHCORD]])
				//.animate('sprite_player_death_1', 0, 3, 8)
				.bind("enterframe", function(e){
					this.animate(self.PLAYER+"_DEATH", 10);
				})
				.delay(function() {
					console.log(self.PLAYER+" is dead");
					PLAYERS_ALIVE -=1;
					removeReference(self);
					checkForWinner(self);
					this.destroy();				
                }, 600)
			}
		});
		
		Crafty.c("Normal1", {
			setNormalAnimation: function(PLAYER){
				var PLAYERCORD = getPlayerCord(PLAYER);
			
				this.animate("stay_left_"+PLAYER, [[192,PLAYERCORD]])
				this.animate("stay_right_"+PLAYER, [[288,PLAYERCORD]])
				this.animate("stay_up_"+PLAYER, [[96,PLAYERCORD]])
				this.animate("stay_down_"+PLAYER, [[0,PLAYERCORD]])

				this.animate("walk_left_"+PLAYER, [[192,PLAYERCORD],[224,PLAYERCORD],[256,PLAYERCORD]])
	            this.animate("walk_right_"+PLAYER, [[288,PLAYERCORD],[320,PLAYERCORD],[352,PLAYERCORD]])
	            this.animate("walk_up_"+PLAYER, [[96,PLAYERCORD],[128,PLAYERCORD],[160,PLAYERCORD]])
	            this.animate("walk_down_"+PLAYER, [[0,PLAYERCORD],[32,PLAYERCORD],[64,PLAYERCORD]])
				this.bind("enterframe", function(e) {
					if(this.__move.left) {
						if(!this.isPlaying("walk_left_"+PLAYER))
							this.stop().animate("walk_left_"+PLAYER, 6);
					}
					if(this.__move.right) {
						if(!this.isPlaying("walk_right_"+PLAYER))
							this.stop().animate("walk_right_"+PLAYER, 6);
					}
					if(this.__move.up) {
						if(!this.isPlaying("walk_up_"+PLAYER))
							this.stop().animate("walk_up_"+PLAYER, 6);
					}
					if(this.__move.down) {
						if(!this.isPlaying("walk_down_"+PLAYER))
							this.stop().animate("walk_down_"+PLAYER, 6);
					}
				})
			}
		});
		
		Crafty.c("Invincible", {
			setInvincibleAnimation:function(PLAYER) {
				var PLAYERCORD = getPlayerCord(PLAYER)+88;
				this.animate("stay_left_"+PLAYER, [[192,PLAYERCORD]])
				this.animate("stay_right_"+PLAYER, [[288,PLAYERCORD]])
				this.animate("stay_up_"+PLAYER, [[96,PLAYERCORD]])
				this.animate("stay_down_"+PLAYER, [[0,PLAYERCORD]])

				this.animate("walk_left_"+PLAYER, [[192,PLAYERCORD],[224,PLAYERCORD],[256,PLAYERCORD]])
	            this.animate("walk_right_"+PLAYER, [[288,PLAYERCORD],[320,PLAYERCORD],[352,PLAYERCORD]])
	            this.animate("walk_up_"+PLAYER, [[96,PLAYERCORD],[128,PLAYERCORD],[160,PLAYERCORD]])
	            this.animate("walk_down_"+PLAYER, [[0,PLAYERCORD],[32,PLAYERCORD],[64,PLAYERCORD]])

			}
		});
		
		Crafty.c("InvincibleVanish", {
			setInvincibleVanishAnimation:function(PLAYER) {
				var PLAYERCORD = getPlayerCord(PLAYER);

				this.animate("stay_left_"+PLAYER, [[192,PLAYERCORD],[192,PLAYERCORD + 88]])
				this.animate("stay_right_"+PLAYER, [[288,PLAYERCORD],[192,PLAYERCORD + 88]])
				this.animate("stay_up_"+PLAYER, [[96,PLAYERCORD],[96,PLAYERCORD + 88]])
				this.animate("stay_down_"+PLAYER, [[0,PLAYERCORD], [0,PLAYERCORD + 88]])

				this.animate("walk_left_"+PLAYER, [[192,PLAYERCORD],[224,PLAYERCORD + 88],[256,PLAYERCORD]])
	            this.animate("walk_right_"+PLAYER, [[288,PLAYERCORD],[320,PLAYERCORD + 88],[352,PLAYERCORD]])
	            this.animate("walk_up_"+PLAYER, [[96,PLAYERCORD],[128,PLAYERCORD + 88],[160,PLAYERCORD]])
	            this.animate("walk_down_"+PLAYER, [[0,PLAYERCORD],[32,PLAYERCORD + 88],[64,PLAYERCORD]])
			}
		});
		

		//create our player entity with some premade components
	
		
		var player1 = Crafty.e("2D, DOM,"+ PLAYER_1 +", CustomControls, animate, explodable, Normal1")
			.attr({x: 32, y: 32-12, z: 10})
			.CustomControlsPlayer(1.7, 10, PLAYER_1, A, D, W, S, SPACE)
			.bind("explode", function() {
				if(this.timeFuze){
					this.detonateTriggeredBomb();
				}
				Crafty.e("DeathAnimation", "2D","DOM","SpriteAnimation", "animate")
					.attr({x: this.xDeath, y: this.yDeath-12, z: 10})
					.setDeathAnimation(this);
				this.destroy();
			})
			.setNormalAnimation(PLAYER_1);	
			
		var player2 = Crafty.e("2D, DOM,"+ PLAYER_2 +", CustomControls2, animate, explodable, Normal1")
			.attr({x: 32*17, y: 32*13-12, z: 10})
			.CustomControlsPlayer(1.7, 10, PLAYER_2, LA, RA, UA, DA, ENTER)
			.bind("explode", function() {
				if(this.timeFuze){
					this.detonateTriggeredBomb();
				}
				Crafty.e("DeathAnimation", "2D","DOM","SpriteAnimation", "animate")
					.attr({x: this.xDeath, y: this.yDeath-12, z: 10})
					.setDeathAnimation(this);
				this.destroy();
			})
			.setNormalAnimation(PLAYER_2);
			
	
		function setReference0(self){
			players[0] = self;
		};
		function setReference1(self){
			players[1] = self;
		};
		
		
		$(document).keydown(function(event){
 	 		for (var i=0; i < players.length; i++) {
 	 			if(players[i] != undefined){
 	 				players[i].trigger("keydownself", event);
				}
 	 		};

		});
		
		$(document).keyup(function(event){
			for (var i=0; i < players.length; i++) {
 	 			if(players[i] != undefined){
 	 				players[i].trigger("keyupself", event);
				}
 	 		};
		});

	});
};