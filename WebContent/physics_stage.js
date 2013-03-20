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

	var ground = new PhysicsRect({
		x : stage.getWidth() / 2,
		y : stage.getHeight(),
		width : stage.getWidth() + 2,
		height : stage.getHeight() - goff + 1,
		fill : '#FF9640',
		stroke : 'black',
		strokeWidth : 1
	});

	layer.add(ground);

	var floatBlock = new PhysicsRect({
		x : stage.getWidth() * 0.35,
		y : 300,
		width : stage.getWidth() * 0.1,
		height : 20,
		fill : 'green',
		stroke : 'black',
		strokeWidth : 1,
		ay : 0,
		ax : 0,
		vy : 0,
		vx : 0,
		mass : 1,
		rotation : 0,
		w : 0,
	});

	// floatBlock.rotateDeg(90);

	layer.add(floatBlock);

	var floatBlock2 = new PhysicsRect({
		x : stage.getWidth() * 0.35,
		y : 550,
		width : stage.getWidth() * 0.1,
		height : 20,
		fill : 'red',
		stroke : 'black',
		strokeWidth : 1,
		ay : 0,
		ax : 0,
		vy : -5,
		vx : 0,
		mass : 1,
		rotation : 0,
		w : 0,
	});

	layer.add(floatBlock2);

	var floatBlock3 = new PhysicsRect({
		x : stage.getWidth() * 0.85,
		y : 50,
		width : 20,
		height : 50,
		fill : 'yellow',
		stroke : 'black',
		strokeWidth : 1,
		ay : 10,
		ax : 0,
		vy : 1,
		vx : 0,
		mass : 1,
		rotation : 0,
		w : 0,
	});

	// layer.add(floatBlock3);

	var gObjs = [ floatBlock, floatBlock2, floatBlock3 ];

	stage.add(layer);

	var anim = new Kinetic.Animation(function(frame) {

		applyPhyiscs(gObjs, frame.timeDiff / 60);

	}, layer);

	anim.start();
}

window.onload = function() {
	var sources = {
		spaceGuy : "./sprite.php_files/space_guy.png",
	};
	loadImages(sources, initStage);
};