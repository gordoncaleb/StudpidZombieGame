function Hero(config) {

	var spaceGuyAnimations = {
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

	this.moving = false;

	this.gun = new Gun({
		layer : config.layer,
		owner : this,
	});

	this.jetpack = new JetPack({
		x : this.x,
		y : this.y,
		thrust : 1.2,
		image : config.jetpackImage
	});

	// forward facing
	this.face = 0;

	this.speed = 4;
	this.ay = 1;
	this.ax = 0;

	this.sprite = new Kinetic.Sprite({ // This sprite was 3x4 tiles
		x : this.x,
		y : this.y,
		image : config.image,
		animation : 'down',
		animations : spaceGuyAnimations,
		framerate : 7
	});

	this.getGunProjectile = getRedBulletProjectile;
	this.boomImage = config.boomImage;

	config.layer.add(this.jetpack.getSprite());
	config.layer.add(this.sprite);

	this.sprite.start();

}

Hero.prototype = {
	getX : function() {
		return this.x;
	},

	setX : function(x) {

		if (x >= 0 && x <= this.sprite.getStage().getWidth() - this.width) {

			this.x = x;
			this.sprite.setX(x);

			if (this.face > 0) {
				this.jetpack.setX(x - 5);
			} else {
				this.jetpack.setX(x + 5);
			}

		}
	},

	getY : function() {
		return this.y;
	},

	setY : function(y) {
		this.y = y;
		this.sprite.setY(y);

		this.jetpack.setY(y + this.height - 15);

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

	getAY : function() {
		return this.ay - this.jetpack.getA();
	},

	getAX : function() {
		return this.ax;
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

	getWidth : function() {
		return this.width;
	},

	getHeight : function() {
		return this.height;
	},

	faceRight : function() {
		if (this.face <= 0) {
			this.sprite.setAnimation('right');

			this.face = 1;
		}
	},

	faceLeft : function() {
		if (this.face >= 0) {
			this.sprite.setAnimation('left');
			this.face = -1;
		}
	},

	moveRight : function() {

		this.faceRight();

		if (!this.moving) {
			this.sprite.start();
			this.moving = true;
		}

		this.setVX(this.getSpeed());
	},

	moveLeft : function() {

		this.faceLeft();

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

	propagate : function(gObjs, enemies) {
		
		this.gun.moveProjectiles(gObjs.concat(enemies));

		applyPhyiscs(this, gObjs);

	},

	jetPackOn : function() {
		this.jetpack.activate(this.face);
	},

	jetPackOff : function() {
		this.jetpack.deactivate();
	},

	shootGun : function(theta) {
		if (!theta) {
			if (this.face == 1) {
				theta = 0;
			} else {
				theta = Math.PI;
			}
		}

		this.gun.fire(this.getGunProjectile(this), theta);
		this.gun.fire(this.getGunProjectile(this), theta + Math.PI / 16);
		this.gun.fire(this.getGunProjectile(this), theta + -Math.PI / 16);
	},

	throwGrenade : function(theta) {

		if (!theta) {
			if (this.face == 1) {
				theta = Math.PI / 4;
			} else {
				theta = 3 * Math.PI / 4;
			}
		}

		this.gun.fire(getGrenadeProjectile(this), theta);
	},

	jump : function(goff) {
		if (this.vy == 0) {
			this.vy = -10;
		}
	}

};