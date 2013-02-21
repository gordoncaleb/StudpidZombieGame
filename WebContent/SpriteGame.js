var UP = 0;
var RIGHT = 1;
var LEFT = 3;
var DOWN = 2;

function loadImages(sources, callback) {
	var images = {};
	var loadedImages = 0;
	var numImages = 0;
	for ( var src in sources) {
		numImages++;
	}
	for ( var src in sources) {
		images[src] = new Image();
		images[src].onload = function() {
			if (++loadedImages >= numImages) {
				callback(images);
			}
		};
		images[src].src = sources[src];
	}
}

function initStage(images) {
	var stage = new Kinetic.Stage("container", 640, 640);
	var layer = new Kinetic.Layer();
	var maplayer = new Kinetic.Layer();
	var objectlayer = new Kinetic.Layer();

	var tS = 32;

	var goff = tS * 17 - 10;

	// spaceGuy
	var spaceGuyImg = new Kinetic.QImage({ // This sprite was 3x4 tiles
		x : tS * 1,
		y : goff,
		image : images.spaceGuy,
		width : 32,
		height : 48,
		name : "image",
		srcx : 32 * 1, // x source position
		srcy : 48 * 2, // y source position
		srcwidth : 32, // source width
		srcheight : 48, // source height
	});
	spaceGuyImg.col = 1; // this is where the default row is
	spaceGuyImg.count = 6; // this stores when to move
	spaceGuyImg.speed = 5; // this is how fast the sprite moves
	layer.add(spaceGuyImg);

	var zombies = new Array();

	for ( var z = 0; z < 2; z++) {
		// spaceGuy
		zombies[z] = new Kinetic.QImage({ // This sprite was 3x4 tiles
			x : tS * (10 + z),
			y : goff,
			image : images.zombie,
			width : 32,
			height : 48,
			name : "image",
			srcx : 32 * 1, // x source position
			srcy : 48 * 2, // y source position
			srcwidth : 32, // source width
			srcheight : 48, // source height
		});
		zombies[z].col = 1; // this is where the default row is
		zombies[z].count = 3+z*2; // this stores when to move
		zombies[z].speed = 5; // this is how fast the sprite moves
		layer.add(zombies[z]);
	}

	// Map (background)
	var map = new Array();
	for ( var j = 0; j < 20; j++) {
		map[j] = new Array();
		for ( var i = 0; i < 20; i++) {

			if (j >= 18) {
				map[j][i] = new Kinetic.QImage({ // This sprite was 3x4 tiles
					x : 32 * i,
					y : 32 * j,
					image : images.tileSet,
					width : 32,
					height : 32,
					name : "image",
					srcx : tS * 4,// Math.floor(Math.random() * 2 + 4), // x
					// source
					// position
					srcy : tS * 0,// Math.floor(Math.random() * 2 + 4), // y
					// source
					// position
					srcwidth : 32, // source width
					srcheight : 32
				// source height
				});
			} else {
				map[j][i] = new Kinetic.QImage({ // This sprite was 3x4 tiles
					x : 32 * i,
					y : 32 * j,
					image : images.tileSet,
					width : 32,
					height : 32,
					name : "image",
					srcx : tS * 0,// Math.floor(Math.random() * 2 + 4), // x
					// source
					// position
					srcy : tS * 0,// Math.floor(Math.random() * 2 + 4), // y
					// source
					// position
					srcwidth : 32, // source width
					srcheight : 32
				// source height
				});
			}
			// map[j][i].draggable(true); //drag em? sure...
			// add the shape to the layer
			maplayer.add(map[j][i]);
		}
	}

	// Obects (background)
	var tS = 32;
	var collisions = new Array();
	var objects = new Array();
	for ( var j = 0; j < 20; j++) {
		objects[j] = new Array();
		collisions[j] = new Array();
		for ( var i = 0; i < 20; i++) {
			// if (Math.floor(Math.random() * 100) > 90) // 10%
			// {
			// objects[j][i] = new Kinetic.QImage({ // This sprite was 3x4
			// // tiles
			// x : 32 * i,
			// y : 32 * j,
			// image : images.tileSet,
			// width : 32,
			// height : 32,
			// name : "image",
			// srcx : tS * (2 + 2 * Math.floor(Math.random() * 2)), // x
			// // source
			// // position
			// srcy : tS * 34, // y source position
			// srcwidth : 32, // source width
			// srcheight : 36
			// // source height
			// });
			// collisions[j][i] = true;
			// // objects[j][i].draggable(true); //drag em? sure...
			// // add the shape to the layer
			// objectlayer.add(objects[j][i]);
			// } else
			collisions[j][i] = false;
		}
	}// End Obect Layer

	stage.add(maplayer); // only the order you add them to the stage
	// determines which is on top
	stage.add(objectlayer); // rockts,trees for collisions
	stage.add(layer);
	stage.draw();

	// This allows multiple keys to be pressed at the same time
	var input = {};
	var pressedInput = {};
	document.addEventListener('keydown', function(e) {
		var keyCode = e.which;

		if (!input[keyCode]) {
			pressedInput[keyCode] = true;
		}

		input[keyCode] = true;
		if (keyCode == 38 || keyCode == 40 || keyCode == 32)
			e.preventDefault(); // disables page viewing
	});
	document.addEventListener('keyup', function(e) {
		var keyCode = e.which;
		input[keyCode] = false;
	});

	stage.onFrame(function(frame) {// wasd, arrows

		// moveObjects(spaceGuyImg, objects, collisions);

		if (pressedInput[38] || pressedInput[87]) {
			jump(spaceGuyImg, goff);

			pressedInput[38] = false;
			pressedInput[87] = false;
		}

		if (input[37] || input[65]) {
			// left
			spaceGuyImg.setVX(-4);
		} else {
			if (input[39] || input[68]) {
				// right
				spaceGuyImg.setVX(4);
			} else {
				spaceGuyImg.setVX(0);

				spaceGuyImg.srcy = spaceGuyImg.srcheight * 2;
			}
		}

		// The order here allows for down+left or right to have down's animation
		moveguy(3, 37, 65, -1, 0, input, spaceGuyImg, collisions);// left, a
		moveguy(1, 39, 68, 1, 0, input, spaceGuyImg, collisions);// right, da
		// moveguy(0, 38, 87, 0, -1, input, spaceGuyImg, collisions);// up, w
		// moveguy(2, 40, 83, 0, 1, input, spaceGuyImg, collisions);// down, s

		applyPhyiscs(spaceGuyImg, 1, goff);
		
		for (zombie in zombies) {
			moveAI(zombies[zombie], spaceGuyImg);
			applyPhyiscs(zombies[zombie], 1, goff);
			zombies[zombie].count++;
		}

		defaultdir(spaceGuyImg); // checks to stand still
		spaceGuyImg.count++; // make walk cycle sooner
		layer.draw(); // think this might be faster than stage.draw()? not
		// sure...
	});

	stage.start();
}

function defaultdir(spaceGuyImg) {
	if (spaceGuyImg.count > 10) {
		spaceGuyImg.srcx = spaceGuyImg.col * spaceGuyImg.srcwidth; // switch to
		// middle
		// column
		spaceGuyImg.count %= 10;
	}
}

function moveguy(row, in1, in2, xfac, yfac, input, spaceGuyImg, collisions) {
	if (input[in1] || input[in2]) // these are input values to be checked
	{
		tS = 32;
		spaceGuyImg.srcy = spaceGuyImg.srcheight * row; // this changes the row

		// spaceGuyImg.x += spaceGuyImg.speed * xfac; // -1,1,0 => left, right,

		// stationary
		// spaceGuyImg.y += spaceGuyImg.speed * yfac; // -1,1,0 => up, down,
		// stationary
		if (spaceGuyImg.x > 20 * tS)
			spaceGuyImg.x -= 21 * tS;
		if (spaceGuyImg.y > 20 * tS)
			spaceGuyImg.y -= 21 * tS;
		if (spaceGuyImg.x < -tS)
			spaceGuyImg.x += 21 * tS;
		if (spaceGuyImg.y < -tS)
			spaceGuyImg.y = -tS;

		var i = Math.floor((spaceGuyImg.x - 16) / tS + 1); // collisions were
		// left shifted
		var j = Math.floor((spaceGuyImg.y + 10) / tS + 1); // 32 is the bG tile
		// size
		if (collisions[j] && collisions[j][i]) // don't allow movement if true
		{
			spaceGuyImg.x -= spaceGuyImg.speed * xfac; // -1,1,0 => left,
			// right, stationary
			spaceGuyImg.y -= spaceGuyImg.speed * yfac; // -1,1,0 => up, down,
			// stationary
		}

		if (spaceGuyImg.count > 6) // ready to change walk columns?
		{
			spaceGuyImg.srcx += 2 * spaceGuyImg.srcwidth; // first and last
			// column
			if (spaceGuyImg.srcx >= spaceGuyImg.srcwidth * 3) // overflow?
				// start at
				// srcx=0
				spaceGuyImg.srcx = 0; // bring the walk cycle to the far left
			// column
			spaceGuyImg.count %= 6; // start the count for the walk cycle over
			// again
		}
	}
}

function moveAI(enemy, player) {
	if (player.x > enemy.x) {
		enemy.vx = 1;
		enemy.srcy = enemy.srcheight * RIGHT;
	} else {

		if (player.x < enemy.x) {
			enemy.vx = -1;
			enemy.srcy = enemy.srcheight * LEFT;
		} else {
			enemy.vx = 0;
			enemy.srcy = enemy.srcheight * DOWN;
		}
	}

	if (enemy.count > 6) // ready to change walk columns?
	{
		enemy.srcx += 2 * enemy.srcwidth; // first and last
		// column
		if (enemy.srcx >= enemy.srcwidth * 3) // overflow?
			// start at
			// srcx=0
			enemy.srcx = 0; // bring the walk cycle to the far left
		// column
		enemy.count %= 6; // start the count for the walk cycle over
		// again
	}
}

function jump(img, goff) {
	if (img.y >= goff) {
		img.vy = -10;
	}
}

function isColision(a, b) {

}

function applyPhyiscs(img, a, goff) {
	var dt = 1;

	img.x = img.x + img.getVX() * dt;
	img.y = Math.min(goff, img.y + img.getVY() * dt + 0.5 * a * dt * dt);

	if (img.y > goff) {
		img.vy = 0;
		img.y = goff;
	} else {
		img.vy = img.vy + 0.5 * a * dt * dt;
	}

}

// function moveObjects(spaceGuyImg, collisions) {
// for ( var x = 0; x < 20; x++) {
// for ( var y = 0; y < 20; y++) {
// if(collisions[x][y])
// }
// }
// }

window.onload = function() {
	var sources = {
		spaceGuy : "./sprite.php_files/space_guy.png",
		zombie : "./sprite.php_files/zombie.png",
		skeleton : "./sprite.php_files/skeleton.png",
		// https://github.com/silveira/openpixels/blob/master/open_chars.xcf
		tileSet : "./sprite.php_files/free_tileset_CC.png", // CC-By-SA
	// http://silveiraneto.net/tag/tileset/
	// spaceGuy: "/kineticjs/tiletest/ranger_m.png" //32 by 36, ranger
	// http://opengameart.org/content/antifareas-rpg-sprite-set-1-enlarged-w-transparent-background
	};
	loadImages(sources, initStage);
};