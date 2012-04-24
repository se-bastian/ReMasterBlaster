window.onload = function() {
	//start crafty
	Crafty.init(608, 480);
//	Crafty.canvas();
	
	Crafty.sprite(32, "sprites.png", {
		wall: [0, 0],
		brick: [0, 1],
	    empty: [4, 0]
	});
	
	Crafty.sprite("sprite_players.png", {
		sprite_player_1: [0, 0, 32, 44],
		sprite_player_2: [0, 44, 32, 88],
	    empty: [1, 0]
	});
	
	var brick_array = new Array(19)
	for (a=0; a <=18; a++)
	brick_array[a] = new Array(15)
	var string = "";
	
	for (var j = 0; j <= 14; j++) {
		for (var i = 0; i <= 18; i++) {
			brick_array[i][j] = "0";
		}
	};
	
	function generateBricks (i, j) {
		if(i > 0 && i < 18 && j > 0 && j < 14 && Crafty.randRange(0, 50) > 40){
			//fill Array, return true
			brick_array[i][j] = "1";
			console.log(brick_array[i][j]);
			return true;
		} else {
			return false;
		};
	};

	function generateWall (i,j) {
		if(i === 0 || i === 18|| j === 0 || j === 14){
			brick_array[i][j] = 2;
			return true;
		} else {
			return false;
		}
	};
	
	
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


		/*
		if(distX == 0) {
			if((x+16) % 32 == 0) {
				return x+16;
			}else {
				return 0;
			}
		}else {
			if ((figurX - 32) > 32) {
				if((figurX + distX) % 32 == 0) {
					destinationX = figurX + distX;
					return destinationX - 16;
				}
				if(((figurX - distX) % 32 == 0)){
					destinationX = figurX - distX;
					return destinationX - 16;	
				}			
			} else{
				destinationX = 64;
				return destinationX - 32;			
			}
		}*/
	
	function generateWorld() {
		
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
		var string = "";
		for (var j = 0; j <= 14; j++) {
			for (var i = 0; i <= 18; i++) {
				string += brick_array[i][j];
				
				if(i==18)
					string+="\n";
			}
		};
		console.log(string);
		
		//alert(string);
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
		
		Crafty.c('CustomControls', {
			__move: {left: false, right: false, up: false, down: false},	
			_speed: 3,
			
			CustomControls: function(speed) {
				if(speed) this._speed = speed;
				var move = this.__move;
				
				this.bind('enterframe', function() {
					//move the player in a direction depending on the booleans
					//only move the player in one direction at a time (up/down/left/right)
					if(move.right) {

						this.x += this._speed;
					}
					else if(move.left) this.x -= this._speed; 
					else if(move.up) this.y -= this._speed;
					else if(move.down) {
						var r = xRelocator (this.x);
						console.log(this.x);
						console.log(r);
						this.x = r;
						this.y += this._speed;
					}
				}).bind('keydown', function(e) {
					//default movement booleans to false
					move.right = move.left = move.down = move.up = false;
					
					//if keys are down, set the direction
					if(e.keyCode === Crafty.keys.RA) move.right = true;
					if(e.keyCode === Crafty.keys.LA) move.left = true;
					if(e.keyCode === Crafty.keys.UA) move.up = true;
					if(e.keyCode === Crafty.keys.DA) move.down = true;
					
					this.preventTypeaheadFind(e);
				}).bind('keyup', function(e) {
					//if key is released, stop moving
					if(e.keyCode === Crafty.keys.RA) {
						move.right = false;
						this.stop().animate("stay_right", 1);
					}
					if(e.keyCode === Crafty.keys.LA) {
						move.left = false;
						this.stop().animate("stay_left", 1);
					}
					if(e.keyCode === Crafty.keys.UA){
						move.up = false;
						this.stop().animate("stay_up", 1);
					} 
					if(e.keyCode === Crafty.keys.DA) {
						move.down = false;
						this.stop().animate("stay_down", 1);
					}
					this.preventTypeaheadFind(e);
				});
				
				return this;
			}
		});
		
		//create our player entity with some premade components
		player = Crafty.e("2D, DOM, sprite_player_1, controls, CustomControls, animate")
			.attr({x: 32, y: 32, z: 10})
			.CustomControls(3)
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
						this.stop().animate("walk_left", 8);
				}
				if(this.__move.right) {
					if(!this.isPlaying("walk_right"))
						this.stop().animate("walk_right", 8);
				}
				if(this.__move.up) {
					if(!this.isPlaying("walk_up"))
						this.stop().animate("walk_up", 8);
				}
				if(this.__move.down) {
					if(!this.isPlaying("walk_down"))
						this.stop().animate("walk_down", 8);
				}
			}).bind("keyup", function(e) {
				
			});
	});
};