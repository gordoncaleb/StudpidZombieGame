function Zombie(config) {

	var animations = {
		up : [ {
			x : 0,
			y : 0,
			width : 32,
			height : 48
		}, {
			x : 32,
			y : 0,
			width : 32,
			height : 48
		}, {
			x : 32 * 2,
			y : 0,
			width : 32,
			height : 48
		} ],
		right : [ {
			x : 0,
			y : 48,
			width : 32,
			height : 48
		}, {
			x : 32,
			y : 48,
			width : 32,
			height : 48
		}, {
			x : 32 * 2,
			y : 48,
			width : 32,
			height : 48
		} ],
		down : [ {
			x : 32,
			y : 48 * 2,
			width : 32,
			height : 48
		} ],
		left : [ {
			x : 0,
			y : 48 * 3,
			width : 32,
			height : 48
		}, {
			x : 32,
			y : 48 * 3,
			width : 32,
			height : 48
		}, {
			x : 32 * 2,
			y : 48 * 3,
			width : 32,
			height : 48
		} ],
	};

	this.x = config.x;
	this.y = config.y;
	this.vx = config.vx;
	this.vy = config.vy;

	this.width = 32;
	this.height = 48;

	this.speed = 1;

	this.hp = 2;

	this.sprite = new Kinetic.Sprite({ // This sprite was 3x4 tiles
		x : this.x,
		y : this.y,
		image : config.image,
		animation : 'down',
		animations : animations,
		framerate : 7
	});

	config.layer.add(this.sprite);

	this.sprite.start();

}

Zombie.prototype = {
	getX : function() {
		return this.x;
	},

	setX : function(x) {
		this.x = x;
		this.sprite.setX(x);
	},

	getY : function() {
		return this.y;
	},

	setY : function(y) {
		this.y = y;
		this.sprite.setY(y);
	},

	getSprite : function() {
		return this.sprite;
	},

	setSprite : function(sprite) {
		this.sprite = sprite;
	},

	getWidth : function() {
		return this.width;
	},

	getHeight : function() {
		return this.height;
	},

	getVX : function() {
		return this.vx;
	},

	setVX : function(vx) {
		this.vx = vx;
	},

	getVY : function() {
		return this.vy;
	},

	setVY : function(vy) {
		this.vy = vy;
	},

	getSpeed : function() {
		return this.speed;
	},

	setSpeed : function(speed) {
		this.speed = speed;
	},

	animateRight : function() {
		this.sprite.setAnimation('right');
	},

	animateLeft : function() {
		this.sprite.setAnimation('left');
	},

	standStill : function() {
		this.sprite.setAnimation('down');
	},

	hit : function(damage) {
		this.hp -= damage;
	},

	die : function() {
		this.sprite.destroy();
	},

	getHp : function() {
		return this.hp;
	},

	jump : function(goff) {
		if (this.y >= goff) {
			this.vy = -10;
		}
	}

};