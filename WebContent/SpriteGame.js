var UP = 0;
var RIGHT = 1;
var LEFT = 3;
var DOWN = 2;

var tS = 32;
var goff = tS * 17 - 10;

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

	var stage = new Kinetic.Stage({
		container : 'container',
		width : 640,
		height : 640
	});

	var layer = new Kinetic.Layer();
	var maplayer = new Kinetic.Layer();
	var objectlayer = new Kinetic.Layer();

	var clouds = Array();

	for ( var i = 0; i < 10; i++) {
		clouds[i] = new Cloud({
			x : stage.getWidth() * Math.random(),
			y : (goff - 100) * Math.random(),
			goff : goff - 100,
			image : images.cloud,
			layer : layer
		});

	}

	var spaceGuy = new Hero({
		x : tS * 1,
		y : goff,
		vx : 0,
		vy : 0,
		image : images.spaceGuy,
		layer : layer
	});

	var zombies = new Array();

	for ( var z = 0; z < 2; z++) {
		zombies[z] = new Zombie({
			x : tS * (10 + z),
			y : goff,
			vx : 0,
			vy : 0,
			image : images.zombie,
			layer : layer
		});
	}

	var ground = new Kinetic.Rect({
		x : 0,
		y : goff + 48,
		width : stage.getWidth(),
		height : stage.getHeight() - goff,
		fill : '#FF9640',
		stroke : 'black',
		strokeWidth : 4
	});

	layer.add(ground);

	// stage.add(maplayer);
	stage.add(layer);

	ground.moveToBottom();

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

	// stage.onFrame(function(frame) {// wasd, arrows

	var anim = new Kinetic.Animation(function(frame) {

		if (pressedInput[38] || pressedInput[87]) {
			spaceGuy.jump(goff);
		}
		
		if(pressedInput[83]){
			spaceGuy.shootGun();
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
		
		spaceGuy.propagate(goff);

		for (zombie in zombies) {
			moveAI(zombies[zombie], spaceGuy);
			applyPhyiscs(zombies[zombie], 1, goff);
		}

		for (cloud in clouds) {
			clouds[cloud].drift();
		}

		// clear pressed inputs
		for (key in pressedInput) {
			pressedInput[key] = false;
		}

	}, layer);

	anim.start();

	// var bakAnimation = new Kinetic.Animation(function(frame) {
	// for (cloud in clouds) {
	// clouds[cloud].setX(clouds[cloud].getX() + 1);
	// }
	// }, layer);
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
		zombie : "./sprite.php_files/zombie.png",
		skeleton : "./sprite.php_files/skeleton.png",
		cloud : "./sprite.php_files/cloud.png",
		// https://github.com/silveira/openpixels/blob/master/open_chars.xcf
		tileSet : "./sprite.php_files/free_tileset_CC.png", // CC-By-SA
	// http://silveiraneto.net/tag/tileset/
	// spaceGuy: "/kineticjs/tiletest/ranger_m.png" //32 by 36, ranger
	// http://opengameart.org/content/antifareas-rpg-sprite-set-1-enlarged-w-transparent-background
	};
	loadImages(sources, initStage);
};