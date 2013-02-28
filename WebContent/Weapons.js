function Gun(config) {

	this.layer = config.layer;
	this.owner = config.owner;

	this.boomImage = config.boomImage;

	var boom = Array();
	for ( var i = 0; i < 4; i++) {
		boom[i] = {
			x : 78 * i,
			y : 0,
			width : 78,
			height : 79
		};
	}

	var noBoom = {
		x : 78 * 5,
		y : 0,
		width : 78,
		height : 79,
	};

	this.boomAnimations = {
		boom : boom,
		noboom : noBoom,
	};

	this.damage = 1;
	this.projectiles = Array();

}

Gun.prototype = {
	fire : function() {

		var cir = new Kinetic.Circle({
			x : 0,
			y : 0,
			radius : 3,
			fill : 'red',
		});

		var newProj = new Projectile({
			x : this.owner.getX(),
			y : this.owner.getY() + 30,
			vx : this.owner.getFace() * 10,
			vy : 0,
			a : 0,
			width : 6,
			height : 6,
			damage : this.damage,
			image : cir
		});

		if (this.owner.getFace() > 0) {
			newProj.setX(this.owner.getX() + 32);
		}

		this.projectiles.push(newProj);

		this.layer.add(cir);

	},

	moveProjectiles : function(objects) {
		var proj;
		for (p in this.projectiles) {
			proj = this.projectiles[p];

			applyPhyiscs(proj, proj.getA(), this.layer.getStage().getHeight());

			if (proj.getX() > this.layer.getStage().getWidth()
					&& proj.getVX() > 0) {
				// flew off right side of screen
				this.removeProjectile(p, proj);
			} else {
				if (proj.getX() < (0 - proj.getWidth()) && proj.getVX() < 0) {
					// flew off left side of screen
					this.removeProjectile(p, proj);
				} else {
					for (obj in objects) {
						if (collision(objects[obj], proj)) {
							objects[obj].hit(proj.getDamage());

							var boom = new Kinetic.Sprite({
								x : objects[obj].getX() - 39 + 16,
								y : objects[obj].getY(),
								image : this.boomImage,
								animation : 'boom',
								animations : this.boomAnimations,
								framerate : 2
							});

							boom.afterFrame(3, function() {
								this.stop();
								this.destroy();
							});

							this.layer.add(boom);
							boom.start();

							this.removeProjectile(p, proj);
						}
					}
				}
			}

		}

		var i = 0;
		while (i < this.projectiles.length) {
			if (this.projectiles[i].isDone()) {
				this.projectiles.splice(i, 1);
			} else {
				i++;
			}
		}

	},

	removeProjectile : function(p, proj) {
		this.projectiles[p].setDone();
		proj.getImg().destroy();
	}

};

function Projectile(config) {
	this.x = config.x;
	this.y = config.y;
	this.vx = config.vx;
	this.vy = config.vy;
	this.a = config.a;
	this.img = config.image;
	this.img.setX(this.x);
	this.img.setY(this.y);
	this.damage = config.damage;
	this.width = config.width;
	this.height = config.height;
	this.done = false;
}

Projectile.prototype = {
	getX : function() {
		return this.x;
	},

	setX : function(x) {
		this.x = x;
		this.img.setX(x);
	},

	getY : function() {
		return this.y;
	},

	setY : function(y) {
		this.y = y;
		this.img.setY(y);
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

	getA : function() {
		return this.a;
	},

	setA : function(a) {
		this.a = a;
	},

	getImg : function() {
		return this.img;
	},

	getDamage : function() {
		return this.damage;
	},

	setDone : function() {
		this.done = true;
	},

	isDone : function() {
		return this.done;
	}
};

function JetPack(config) {
	this.a = 0;
	this.thrust = config.thrust;

	this.x = config.x;
	this.y = config.y;

	this.active = false;
	this.face = 0;

	var jetright = Array();
	for ( var i = 0; i < 5; i++) {
		jetright[i] = {
			x : 28 * i,
			y : 0,
			width : 28,
			height : 48
		};
	}

	var jetleft = Array();
	for ( var i = 0; i < 5; i++) {
		jetleft[i] = {
			x : 28 * i,
			y : 48,
			width : 28,
			height : 48
		};
	}

	var jetpackAnimations = Array();
	jetpackAnimations['right'] = jetright;
	jetpackAnimations['left'] = jetleft;
	jetpackAnimations['off'] = [ {
		x : 0,
		y : 96,
		width : 28,
		height : 48
	} ];

	this.sprite = new Kinetic.Sprite({
		x : this.x,
		y : this.y,
		image : config.image,
		animation : 'off',
		animations : jetpackAnimations,
		framerate : 7
	});

}

JetPack.prototype = {
	getA : function() {
		return this.a;
	},

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

	activate : function(face) {
		this.a = this.thrust;

		if (this.face != face) {
			if (face > 0) {
				this.sprite.setAnimation('right');
			}

			if (face < 0) {
				this.sprite.setAnimation('left');
			}
		}

		if (!this.active) {
			this.sprite.start();
			this.active = true;
		}

		this.face = face;

	},

	deactivate : function() {
		this.a = 0;

		if (this.active) {
			this.sprite.setAnimation('off');
			this.sprite.stop();
			this.active = false;
		}

		this.face = 0;
	}
};