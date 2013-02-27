function Cloud(config) {

	this.xoffset = 0;//config.image.width / 2;
	this.yoffset = 0;//config.image.height / 2;

	this.speed = Math.random() * 0.5;

	this.x = config.x - this.xoffset;
	this.y = config.y - this.yoffset;

	this.goff = config.goff;

	this.layer = config.layer;

	this.img = new Kinetic.Image({
		x : config.x,
		y : config.y,
		image : config.image,
		width : config.image.width,
		height : config.image.height,
		//offset : [ this.xoffset, this.yoffset ],
	// rotation : Math.random() * 3.14159 * 2,
	});

	this.layer.add(this.img);

}

Cloud.prototype = {
	getX : function() {
		return this.x;
	},

	setX : function(x) {
		this.x = x;
		this.img.setX(x + this.xoffset);
	},

	getY : function() {
		return this.y;
	},

	setY : function(y) {
		this.y = y;
		this.img.setY(y + this.yoffset);
	},

	getWidth : function() {
		return this.img.getWidth();
	},

	getHeight : function() {
		return this.img.getHeight();
	},

	drift : function() {
		this.x += this.speed;
		this.img.setX(this.x);

		if (this.getX() > this.layer.getStage().getWidth()) {
			this.setX(-this.getWidth());
			this.setY(this.goff * Math.random());
		}
	}
};