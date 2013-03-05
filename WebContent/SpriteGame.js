var tS = 32;
var goff = tS * 18;

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

	window.gameImages = images;

	var stage = new Kinetic.Stage({
		container : 'container',
		width : 1200,
		height : 640
	});

	var layer = new Kinetic.Layer();
	var maplayer = new Kinetic.Layer();
	// var objectlayer = new Kinetic.Layer();

	var clouds = Array();

	for ( var i = 0; i < 10; i++) {
		clouds[i] = new Cloud({
			x : stage.getWidth() * Math.random(),
			y : (goff - 300) * Math.random(),
			goff : goff - 100,
			image : images.cloud,
			layer : layer
		});

	}

	var spaceGuy = new Hero({
		x : tS * 1,
		y : goff - 48,
		vx : 0,
		vy : 0,
		ay : 0,
		ax : 0,
		image : images.spaceGuy,
		jetpackImage : images.jetpackfire,
		boomImage : images.boomImage,
		layer : layer
	});

	var zombies = new Array();

	// for ( var z = 0; z < 2; z++) {
	// zombies[z] = new Zombie({
	// x : tS * (10 + z),
	// y : goff,
	// vx : 0,
	// vy : 0,
	// image : images.zombie,
	// layer : layer
	// });
	// }

	var ground = new Kinetic.Rect({
		x : -1,
		y : goff,
		width : stage.getWidth() + 2,
		height : stage.getHeight() - goff + 1,
		fill : '#FF9640',
		stroke : 'black',
		strokeWidth : 1
	});

	layer.add(ground);

	var floatBlock = new Kinetic.Rect({
		x : stage.getWidth() * 0.45,
		y : 300,
		width : stage.getWidth() * 0.1,
		height : 20,
		fill : '#FF9640',
		stroke : 'black',
		strokeWidth : 1,
		ay : 0,
		ax : 0,
		vy : 0,
		vx : 0,
	});

	layer.add(floatBlock);

	var floatBlock2 = new Kinetic.Rect({
		x : stage.getWidth() * 0.35,
		y : 500,
		width : stage.getWidth() * 0.1,
		height : 20,
		fill : '#FF9640',
		stroke : 'black',
		strokeWidth : 1,
		ay : 0,
		ax : 0,
		vy : 0,
		vx : 0,
	});

	layer.add(floatBlock2);

	var floatBlock3 = new Kinetic.Rect({
		x : stage.getWidth() * 0.85,
		y : goff - 50,
		width : 20,
		height : 50,
		fill : '#FF9640',
		stroke : 'black',
		strokeWidth : 1,
		ay : 0,
		ax : 0,
		vy : 0,
		vx : 0,
	});

	layer.add(floatBlock3);

	var gObjs = [ ground, floatBlock, floatBlock2, floatBlock3 ];

	stage.add(maplayer);
	stage.add(layer);

	// ground.moveToBottom();

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

	document.addEventListener('click', function(e) {
		var pos = stage.getMousePosition();

		if (!pos) {
			return;
		}

		var theta = Math
				.atan2(pos.x - spaceGuy.getX(), pos.y - spaceGuy.getY())
				- Math.PI / 2;

		if (theta < Math.PI / 2 && theta > -Math.PI / 2) {
			spaceGuy.faceRight();
		} else {
			spaceGuy.faceLeft();
		}

		spaceGuy.shootGun(theta);
	});

	// stage.onFrame(function(frame) {// wasd, arrows

	var level = 2;
	var fblocktheta = 0;

	var anim = new Kinetic.Animation(function(frame) {

		if (pressedInput[38] || pressedInput[87]) {
			spaceGuy.jump(goff);
		}

		if (pressedInput[83]) {
			spaceGuy.shootGun();
		}

		if (pressedInput[71]) {
			spaceGuy.throwGrenade();
		}

		if (input[32]) {
			spaceGuy.jetPackOn();
		} else {
			spaceGuy.jetPackOff();
		}

		if (input[37] || input[65]) {
			// left
			spaceGuy.moveLeft();
		} else {
			if (input[39] || input[68]) {
				// right
				spaceGuy.moveRight();
			} else {
				// stopped
				spaceGuy.standStill();
			}
		}

		fblocktheta = fblocktheta + Math.PI / 100;
		floatBlock2.setX(floatBlock2.getX() + 3 * Math.sin(fblocktheta));

		spaceGuy.propagate(gObjs, zombies);

		for (z in zombies) {
			if (zombies[z].getHp() <= 0) {
				zombies[z].die();
				zombies.splice(z, 1);
			}
		}

		if (zombies.length == 0) {
			level++;
			for ( var i = 0; i < level; i++) {
				zombies[i] = new Zombie({
					x : Math.random() * stage.getWidth(),
					y : -48,
					vx : 0,
					vy : 0,
					ax : 0,
					ay : 0.1,
					hp : 1,
					image : images.zombie,
					layer : layer
				});
			}

			// spaceGuy.getSprite().moveToBottom();
		}

		for (z in zombies) {
			// moveAI(zombies[z], spaceGuy);
			applyPhyiscs(zombies[z], gObjs);
		}

		for (c in clouds) {
			clouds[c].drift();
		}

		// clear pressed inputs
		for (key in pressedInput) {
			pressedInput[key] = false;
		}

		// maplayer.draw();

	}, layer);

	anim.start();

	// var bakAnimation = new Kinetic.Animation(function(frame) {
	// for (cloud in clouds) {
	// clouds[cloud].drift();
	// }
	// }, maplayer);
	//
	// bakAnimation.start();
}

function moveAI(enemy, player) {

	var d = player.getX() - enemy.getX();

	if (Math.abs(d) < enemy.getSpeed()) {
		// attack
		enemy.setVX(0);
		enemy.standStill();
		// enemy.jump(goff);
	} else {
		if (player.getX() > enemy.getX()) {

			if (enemy.getVX() <= 0) {
				enemy.animateRight();
			}

			enemy.setVX(enemy.getSpeed());

		} else {

			if (player.getX() < enemy.getX()) {

				if (enemy.getVX() >= 0) {
					enemy.animateLeft();
				}

				enemy.setVX(-enemy.getSpeed());
			} else {
				enemy.setVX(0);
				enemy.standStill();
			}
		}
	}
}

window.onload = function() {
	var sources = {
		spaceGuy : "./sprite.php_files/space_guy.png",
		jetpackfire : "./sprite.php_files/jetpackfire.png",
		boomImage : "./sprite.php_files/explosion1.png",
		zombie : "./sprite.php_files/zombie.png",
		skeleton : "./sprite.php_files/skeleton.png",
		cloud : "./sprite.php_files/cloud.png",
		grenade1 : "./sprite.php_files/grenade1.png",
		// https://github.com/silveira/openpixels/blob/master/open_chars.xcf
		tileSet : "./sprite.php_files/free_tileset_CC.png", // CC-By-SA
	// http://silveiraneto.net/tag/tileset/
	// spaceGuy: "/kineticjs/tiletest/ranger_m.png" //32 by 36, ranger
	// http://opengameart.org/content/antifareas-rpg-sprite-set-1-enlarged-w-transparent-background
	};
	loadImages(sources, initStage);
};