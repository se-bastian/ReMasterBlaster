window.onload = function() {
	//start crafty
	Crafty.init(608, 480);
//	Crafty.canvas();
	
	Crafty.sprite(32, "sprites.png", {
		wall: [0, 0],
		brick: [0, 1],
		bomb: [0, 2],
		fire: [0, 3],
	    empty: [4, 0]
	});
	
	Crafty.sprite("sprite_players.png", {
		sprite_player_1: [0, 0, 32, 44],
		sprite_player_2: [0, 44, 32, 88],
	});
	
	var brick_array = new Array(19)
	for (a=0; a <=18; a++)
	brick_array[a] = new Array(15)
	var string = "";
	

	
	/**
	 * Returns true fpr a bricks and filles the 
	 * array with a 1 at this position
	 */
	function generateBricks (i, j) {
		if(i > 0 && i < 18 && j > 0 && j < 14 && Crafty.randRange(0, 50) > 40){
			//fill Array, return true
			brick_array[i][j] = "1";
			//console.log(brick_array[i][j]);
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
			brick_array[i][j] = 2;
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
	

	function solidDown (x, y) {
		var xi = Math.round((x)/32);
		var xii = (x/32)%10;
		var yi = parseInt((y+44)/32);
		if (brick_array[xi][yi] >= 1) {
			return true;
		} else {
			return false;
		}
	}
	function solidUp (x, y) {
		var xi = Math.round((x)/32);
		var yi = parseInt((y+11)/32);
		if (brick_array[xi][yi] >= 1) {
			return true;
		} else {
			return false;
		}
	}
	function solidRight (x, y) {
		var xi = parseInt((x+32)/32);
		var yi = parseInt((y+27)/32);
		if (brick_array[xi][yi] >= 1) {
			return true;
		} else {
			return false;
		}
	}
	function solidLeft (x, y) {
		var xi = parseInt((x)/32);
		var yi = parseInt((y+27)/32);
		if (brick_array[xi][yi] >= 1) {
			return true;
		} else {
			return false;
		}
	}
	
	/**
	 * Generate the world, sets the wall and bricks on the board
	 */
	function generateWorld() {
		/**
		 * Initialize the array with 0
		 */
		for (var j = 0; j <= 14; j++) {
			for (var i = 0; i <= 18; i++) {
				brick_array[i][j] = "0";
			}
		};
		
		for(var j = 0; j <=14; j++) {
			for(var i = 0; i <=18; i++) {
				
				if(generateWall(i, j)) { 
				    Crafty.e("2D, DOM, wall")
				    .attr({ x: i * 32, y: j * 32, z: 0 })
				}
				
				if(generateBricks(i, j)) {
					var f = Crafty.e("2D, DOM, brick")
						.attr({ x: i * 32, y: j * 32, z: 3 })
				}
			}
		}
		/**
		 * Print the values of the array to the console 
		 */
		var string = "";
		for (var j = 0; j <= 14; j++) {
			for (var i = 0; i <= 18; i++) {
				string += brick_array[i][j];
				
				if(i==18)
					string+="\n";
			}
		};
		console.log(string);
	}
	
	//the loading screen that will display while our assets load
	Crafty.scene("loading", function() {
		//load takes an array of assets and a callback when complete
		Crafty.load(["sprites.png"], function() {
			Crafty.scene("main"); //when everything is loaded, run the main scene
		});
		
		//black background with some loading text
        Crafty.background("#337700");
		Crafty.e("2D, DOM, text").attr({w: 100, h: 20, x: 150, y: 120})
			.text("Loading")   
			.css({"text-align": "center"});
	});
	
	//automatically play the loading scene
	Crafty.scene("loading");
	
	Crafty.scene("main", function() {
		generateWorld();


		Crafty.c("SetBomb", {
			init:function(){
		        this.addComponent("2D","DOM","SpriteAnimation", "bomb", "animate", "explodable")
		        .animate('bomb', 0, 2, 2)
				.bind("enterframe", function(e){
					this.animate("bomb", 10);
				})
				.delay(function() {
                    //this.trigger("explode");
					Crafty.e("SetFire")
					.attr({x: this.x, y: this.x, z: 9})
					this.destroy();
                }, 3000)
				
			}
		});
		
		Crafty.c("SetFire", {
			init:function(){
		        this.addComponent("2D","DOM","SpriteAnimation", "fire", "animate", "explodable")
		        .animate('fire', 0, 3, 5)
				.bind("enterframe", function(e){
					console.log("blub");
					this.animate("fire", 10);
				})
				.delay(function() {
					this.destroy();  
                }, 1000)
			}
		});
		
		
		Crafty.c('CustomControls', {
			__move: {left: false, right: false, up: false, down: false},	
			__saveMove: {left: false, right: false, up: false, down: false},	
			
			_speed: 3,
			_bombset: false,
			CustomControls: function(speed) {
				if(speed) this._speed = speed;
				var move = this.__move;
				var saveMove = this.__saveMove;
				var bombset = this._bombset;
				this.bind('enterframe', function() {
					//move the player in a direction depending on the booleans
					//only move the player in one direction at a time (up/down/left/right)
					if(move.right) {
						if(!solidRight(this.x, this.y)){
							var r = yRelocator(this.y+12);
							this.y = r;
							this.x += this._speed;
							saveMove.right = true;
						}
					}
					else if(move.left) {
						if(!solidLeft(this.x, this.y)){
							var r = yRelocator(this.y+12);
							this.y = r;
							this.x -= this._speed; 
							saveMove.left = true;
						}
					}
					else if(move.up) {
						if(!solidUp(this.x, this.y)){
							var r = xRelocator (this.x);
							this.x = r;
							this.y -= this._speed;
							saveMove.up = true;
						}
					}
					else if(move.down) {
						if(!solidDown(this.x, this.y)){
							var r = xRelocator (this.x);
							this.x = r;
							this.y += this._speed;
							saveMove.down = true;
						}
					}
				}).bind('keydown', function(e) {
					//default movement booleans to false
					move.right = move.left = move.down = move.up = false;
					
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
						var n = xRelocator (this.x);
						var m = yRelocator(this.y)+12;
						//bombset = true;
						Crafty.e("SetBomb")
						.attr({x: n, y: m, z: 9})

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
					this.preventTypeaheadFind(e);
				});
				
				return this;
			}
		});
		
		//create our player entity with some premade components
		player = Crafty.e("2D, DOM, sprite_player_1, controls, CustomControls, animate")
			.attr({x: 32, y: 32-12, z: 10})
			.CustomControls(2)
			.animate("stay_left", [[192,0]])
			.animate("stay_right", [[288,0]])
			.animate("stay_up", [[96,0]])
			.animate("stay_down", [[0,0]])
			
			.animate("walk_left", [[192,0],[224,0],[256,0]])
            .animate("walk_right", [[288,0],[320,0],[352,0]])
            .animate("walk_up", [[96,0],[128,0],[160,0]])
            .animate("walk_down", [[0,0],[32,0],[64,0]])
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

			//.bombDropper(Crafty.keys.BACKSPACE);

            
	});
};