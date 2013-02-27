function Gun(config) {

	this.layer = config.layer;
	this.owner = config.owner;

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
			y : this.owner.getY() + 24,
			vx : this.owner.getFace() * 10,
			vy : 0,
			a : 0,
			image : cir
		});

		if (this.owner.getFace() > 0) {
			newProj.setX(this.owner.getX() + 32);
		}

		this.projectiles.push(newProj);

		this.layer.add(cir);

	},

	moveProjectiles : function() {
		var proj;
		for (p in this.projectiles) {
			proj = this.projectiles[p];

			applyPhyiscs(proj, proj.getA(), this.layer.getStage().getHeight());

			if (proj.getX() > this.layer.getStage().getWidth()
					&& proj.getVX() > 0) {
				// flew off right side of screen
				this.removeProjectile(p, proj);
			} else {
				if (proj.getX() < -proj.getWidth() && proj.getVX() < 0) {
					// flew off left side of screen
					this.removeProjectile(p, proj);
				}
			}
		}
	},

	removeProjectile : function(p, proj) {
		this.projectiles.splice(p, 1);
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

	getWidth : function() {
		return this.img.width;
	},

	getHeight : function() {
		return this.img.height;
	}
};

function JetPack(config){
	this.owner = config.owner;
	
}