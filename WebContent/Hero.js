function Hero(config) {

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

	this.moving = false;

	this.gun = new Gun({
		layer : config.layer,
		owner : this,
	});

	// forward facing
	this.face = 0;

	this.speed = 4;
	this.a = 1;

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

Hero.prototype = {
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

	getFace : function() {
		return this.face;
	},

	getSpeed : function() {
		return this.speed;
	},

	setSpeed : function(speed) {
		this.speed = speed;
	},

	moveRight : function() {
		if (this.face <= 0) {
			this.sprite.setAnimation('right');

			

			this.face = 1;
		}

		if (!this.moving) {
			this.sprite.start();
			this.moving = true;
		}
		
		this.setVX(this.getSpeed());
	},

	moveLeft : function() {
		if (this.face >= 0) {
			this.sprite.setAnimation('left');
			this.face = -1;
		}

		if (!this.moving) {
			this.sprite.start();
			this.moving = true;
		}
		
		this.setVX(-this.getSpeed());
	},

	standStill : function() {
		// this.sprite.setAnimation('down');
		this.moving = false;
		this.setVX(0);
		this.sprite.stop();
	},

	propagate : function(goff) {
		this.gun.moveProjectiles();

		applyPhyiscs(this, this.a, goff);
	},

	shootGun : function() {
		this.gun.fire();
	},

	jump : function(goff) {
		if (this.y >= goff) {
			this.vy = -10;
		}
	}

};