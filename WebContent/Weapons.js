function Gun(config) {

	this.layer = config.layer;
	this.owner = config.owner;

	this.damage = 1;
	this.projectiles = Array();

}

Gun.prototype = {
	fire : function(newProj) {

		this.projectiles.push(newProj);

		this.layer.add(newProj.getImg());
		newProj.getImg().moveToBottom();

	},

	moveProjectiles : function(objects, goff) {
		var proj;
		for (p in this.projectiles) {
			proj = this.projectiles[p];

			if (proj.getX() > this.layer.getStage().getWidth()
					&& proj.getVX() > 0) {
				// flew off right side of screen
				this.removeProjectile(p, proj);
			} else {
				if (proj.getX() < (0 - proj.getWidth()) && proj.getVX() < 0) {
					// flew off left side of screen
					this.removeProjectile(p, proj);
				} else {
					if (proj.getY() >= goff) {
						// hit ground

						for (obj in objects) {
							if (distance(objects[obj].getX()
									+ objects[obj].getWidth() / 2, objects[obj]
									.getY()
									+ objects[obj].getHeight() / 2,
									proj.getX(), proj.getY()) <= proj
									.getBlastRadius()) {
								objects[obj].hit(proj.getDamage());
							}
						}

						var boomSprite = proj.getBoomSprite();

						boomSprite.setX(proj.getX() - boomSprite.avgWidth / 2);
						boomSprite.setY(goff - boomSprite.avgHeight / 2);

						this.layer.add(boomSprite);
						boomSprite.start();

						this.removeProjectile(p, proj);

					} else {
						for (obj in objects) {
							if (collision(objects[obj], proj)) {
								objects[obj].hit(proj.getDamage());

								var boomSprite = proj.getBoomSprite();

								boomSprite.setX(objects[obj].getX() - 39 + 16);
								boomSprite.setY(objects[obj].getY());

								this.layer.add(boomSprite);
								boomSprite.start();

								this.removeProjectile(p, proj);
							}
						}
					}
				}
			}

			applyPhyiscs(proj, proj.getA(), this.layer.getStage().getHeight());

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
	},

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
	this.blastRadius = config.blastRadius;
	this.done = false;
	this.boomSprite = config.boomSprite;
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

	getBlastRadius : function() {
		return this.blastRadius;
	},

	getBoomSprite : function() {
		return this.boomSprite;
	},

	setDone : function() {
		this.done = true;
	},

	isDone : function() {
		return this.done;
	}
};

function getGrenadeProjectile(owner, boomImage) {
	var cir = new Kinetic.Circle({
		x : 0,
		y : 0,
		radius : 4,
		fill : 'blue',
	});

	var boom = Array();
	for ( var i = 0; i < 4; i++) {
		boom[i] = {
			x : 78 * i,
			y : 0,
			width : 78,
			height : 79,
		};
	}

	var noBoom = {
		x : 78 * 5,
		y : 0,
		width : 78,
		height : 79,
	};

	var boomAnimations = {
		boom : boom,
		noboom : noBoom,
	};

	var boomSprite = new Kinetic.Sprite({
		x : 0,
		y : 0,
		image : boomImage,
		animation : 'boom',
		animations : boomAnimations,
		framerate : 7,
	});
	
	boomSprite.afterFrame(3, function() {
		boomSprite.stop();
		boomSprite.destroy();
	});

	boomSprite.avgHeight = 79;
	boomSprite.avgWidth = 78;

	var newProj = new Projectile({
		x : owner.getX() + owner.getWidth() / 2,
		y : owner.getY() + 30,
		vx : owner.getFace() * 10,
		vy : -5,
		a : .5,
		width : 8,
		height : 8,
		damage : 5,
		blastRadius : 50,
		image : cir,
		boomSprite : boomSprite,
	});

	return newProj;
}

function getRedBulletProjectile(owner, boomImage) {
	var cir = new Kinetic.Circle({
		x : 0,
		y : 0,
		radius : 3,
		fill : 'red',
	});

	var boom = Array();
	for ( var i = 0; i < 4; i++) {
		boom[i] = {
			x : 78 * i,
			y : 0,
			width : 78,
			height : 79,
		};
	}

	var noBoom = {
		x : 78 * 5,
		y : 0,
		width : 78,
		height : 79,
	};

	var boomAnimations = {
		boom : boom,
		noboom : noBoom,
	};

	var boomSprite = new Kinetic.Sprite({
		x : 0,
		y : 0,
		image : boomImage,
		animation : 'boom',
		animations : boomAnimations,
		framerate : 7,
	});
	
	boomSprite.afterFrame(3, function() {
		// boom.setAnimation('noboom');
		boomSprite.stop();
		boomSprite.destroy();
	});

	boomSprite.avgHeight = 79;
	boomSprite.avgWidth = 78;

	var newProj = new Projectile({
		x : owner.getX() + owner.getWidth() / 2,
		y : owner.getY() + 30,
		vx : owner.getFace() * 10,
		vy : 0,
		a : 0,
		width : 6,
		height : 6,
		damage : 1,
		blastRadius : 3,
		image : cir,
		boomSprite : boomSprite,
	});

	return newProj;
}

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
			height : 48,
		};
	}

	var jetleft = Array();
	for ( var i = 0; i < 5; i++) {
		jetleft[i] = {
			x : 28 * i,
			y : 48,
			width : 28,
			height : 48,
		};
	}

	var jetpackAnimations = Array();
	jetpackAnimations['right'] = jetright;
	jetpackAnimations['left'] = jetleft;
	jetpackAnimations['off'] = [ {
		x : 0,
		y : 96,
		width : 28,
		height : 48,
	} ];

	this.sprite = new Kinetic.Sprite({
		x : this.x,
		y : this.y,
		image : config.image,
		animation : 'off',
		animations : jetpackAnimations,
		framerate : 7,
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