function PhysicsObject(config) {

	if (config.vx) {
		this.vx = config.vx;
	} else {
		this.vx = 0;
	}

	if (config.vy) {
		this.vy = config.vy;
	} else {
		this.vy = 0;
	}

	if (config.ax) {
		this.ax = config.ax;
	} else {
		this.ax = 0;
	}

	if (config.ay) {
		this.ay = config.ay;
	} else {
		this.ay = 0;
	}

	if (config.mass) {
		this.mass = config.mass;
	} else {
		this.mass = 0;
	}

	if (config.mu) {
		this.mu = config.mu;
	} else {
		this.mu = 0;
	}

	if (config.beta) {
		this.beta = config.beta;
	} else {
		this.beta = 0;
	}

	if (config.w) {
		this.w = config.w;
	} else {
		this.w = 0;
	}

	this.shouldremove = false;

	this.nextProps = {
		x : 0,
		y : 0,
		vx : 0,
		vy : 0,
		ax : 0,
		ay : 0,
		w : 0,
		rotation : 0
	};

}

PhysicsObject.prototype = {

	getVx : function() {
		return this.vx;
	},

	getVy : function() {
		return this.vy;
	},

	getAx : function() {
		return this.ax;
	},

	getAy : function() {
		return this.ay;
	},

	getMass : function() {
		return this.mass;
	},

	getMu : function() {
		return this.mu;
	},
	getBeta : function() {
		return this.beta;
	},
	getW : function() {
		return this.w;
	},

	setVx : function(vx) {
		this.vx = vx;
	},

	setVy : function(vy) {
		this.vy = vy;
	},

	setAx : function(ax) {
		this.ax = ax;
	},

	setAy : function(ay) {
		this.ay = ay;
	},

	setMass : function(mass) {
		this.mass = mass;
	},

	setMu : function(mu) {
		this.mu = mu;
	},

	setBeta : function(beta) {
		this.beta = beta;
	},

	setW : function(w) {
		this.w = w;
	},

};

function PhysicsRect(config) {

	config.offset = {
		x : config.width / 2,
		y : config.height / 2,
	};

	this.radius = Math.sqrt(config.height * config.height + config.width
			* config.width) / 2;

	this.phi = Math.atan(config.height / config.width);

	PhysicsObject.call(this, config);
	Kinetic.Rect.call(this, config);
}

PhysicsRect.prototype = {

	getRadius : function() {
		return this.radius;
	},

	getPhi : function() {
		return this.phi;
	},

	getPoints : function() {
		var pts = Array();

		var theta = this.getRotation();

		var a = Math.cos(theta + this.phi) * this.radius;
		var b = Math.sin(theta + this.phi) * this.radius;
		var c = Math.cos(theta - this.phi) * this.radius;
		var d = Math.sin(theta - this.phi) * this.radius;

		var x = this.getX();
		var y = this.getY();

		// top right corner
		pts.push({
			x : x + a,
			y : y + b,
		});

		// bottom right corner
		pts.push({
			x : x + c,
			y : y + d,
		});

		// bottom left corner
		pts.push({
			x : x - a,
			y : y - b,
		});

		// top left corner
		pts.push({
			x : x - c,
			y : y - d,
		});

		return pts;
	},

	drawFunc : function(canvas) {
		var width = this.getWidth(), height = this.getHeight();
		var context = canvas.getContext();
		context.beginPath();
		context.rect(0, 0, width, height);
		context.closePath();
		canvas.fillStroke(this);

		context.beginPath();

		context.moveTo(width, 0);
		context.lineTo(width, height);
		context.lineTo(0, height);
		context.lineWidth = 2;

		context.strokeStyle = 'white';
		context.stroke();

	},
};

Kinetic.Global.extend(PhysicsRect, PhysicsObject);
Kinetic.Global.extend(PhysicsRect, Kinetic.Rect);

function applyPhyiscs(objs, dt) {

	for (o in objs) {

		objs[o].nextProps.x = 0;
		objs[o].nextProps.y = 0;
		objs[o].nextProps.vx = 0;
		objs[o].nextProps.vy = 0;
		objs[o].nextProps.w = 0;
		objs[o].nextProps.rotation = 0;

	}

	for ( var o = 0; o < objs.length; o++) {

		var current = {
			x : objs[o].getX(),
			y : objs[o].getY(),
			vx : objs[o].getVx(),
			vy : objs[o].getVy(),
			ax : objs[o].getAx(),
			ay : objs[o].getAy(),
			w : objs[o].getW(),
			rotation : objs[o].getRotation(),
		};

		current.bot = current.y + objs[o].getHeight();
		current.top = current.y;
		current.right = current.x + objs[o].getWidth();
		current.left = current.x;

		objs[o].nextProps.x = current.x + current.vx * dt + 0.5 * current.ax
				* dt * dt;
		objs[o].nextProps.y = current.y + current.vy * dt + 0.5 * current.ay
				* dt * dt;
		objs[o].nextProps.vy = current.vy + 0.5 * current.ay * dt * dt;
		objs[o].nextProps.vx = current.vx + 0.5 * current.ax * dt * dt;
		objs[o].nextProps.rotation = current.w * dt + current.rotation;
		objs[o].nextProps.w = current.w;

		objs[o].nextProps.bot = objs[o].nextProps.y + objs[o].getHeight() / 2;
		objs[o].nextProps.top = objs[o].nextProps.y - objs[o].getHeight() / 2;
		objs[o].nextProps.right = objs[o].nextProps.x + objs[o].getWidth() / 2;
		objs[o].nextProps.left = objs[o].nextProps.x - objs[o].getWidth() / 2;

		for ( var n = (o + 1); n < objs.length; n++) {

			if (rectCollision(objs[n], objs[o])) {

			}
		}

	}

	for (o in objs) {

		objs[o].setX(objs[o].nextProps.x);
		objs[o].setY(objs[o].nextProps.y);
		objs[o].setVx(objs[o].nextProps.vx);
		objs[o].setVy(objs[o].nextProps.vy);
		objs[o].setW(objs[o].nextProps.w);
		objs[o].setRotation(objs[o].nextProps.rotation);

	}

}

function rectCollision(rectA, rectB) {

	var rectDistance = Math.sqrt((rectA.getX() - rectB.getX())
			* (rectA.getX() - rectB.getX()) + (rectA.getY() - rectB.getY())
			* (rectA.getY() - rectB.getY()));

	if (rectDistance <= (rectA.getRadius() + rectB.getRadius())) {

		ptsA = rectA.getPoints();
		ptsB = rectB.getPoints();

		var col;
		var allCol = Array();
		for ( var a = 0; a < ptsA.length; a++) {

			for ( var b = 0; b < ptsB.length; b++) {
				col = lineSegmentCollision(ptsA[a], ptsA[a + 1] || ptsA[0],
						ptsB[b], ptsB[b + 1] || ptsB[0], a, b);

				if (col) {
					allCol.push(col);
				}

			}

		}

		if (allCol.length > 0) {
			var xavg = 0;
			var yavg = 0;
			for (i in allCol) {
				xavg += allCol[i].x;
				yavg += allCol[i].y;
			}

			xavg /= allCol.length;
			yavg /= allCol.length;

			return {
				x : xavg,
				y : yavg
			};
			
		} else {
			return null;
		}
	}

	return null;

}

function lineSegmentCollision(pa1, pa2, pb1, pb2, a, b) {

	var ma = null;
	var mb = null;

	if (pa1.x != pa2.x) {
		ma = (pa1.y - pa2.y) / (pa1.x - pa2.x);
	}

	if (pb1.x != pb2.x) {
		mb = (pb1.y - pb2.y) / (pb1.x - pb2.x);
	}

	if (ma == null && mb == null) {
		// vertical line segments

		if (pa1.x == pb1.x) {
			var ya1 = Math.max(pa1.y, pa2.y);
			var ya2 = Math.min(pa1.y, pa2.y);

			var yb1 = Math.max(pb1.y, pb2.y);
			var yb2 = Math.min(pb1.y, pb2.y);

			if ((yb1 >= ya1 && yb2 <= ya1)) {

				return {
					x : pa1.x,
					y : (ya1 + Math.max(ya2, yb2)) / 2,
				};

			} else {
				if ((yb1 <= ya1 && yb1 >= ya2)) {

					return {
						x : pa1.x,
						y : (yb1 + Math.max(ya2, yb2)) / 2,
					};

				} else {
					return null;
				}
			}

		} else {
			return null;
		}
	} else {

		if (ma == null || mb == null) {
			// one vertical line segment

			if (ma != null) {

				if (Math.min(pa1.x, pa2.x) <= pb1.x
						&& Math.max(pa1.x, pa2.x) >= pb1.x) {

					var y = ma * pb1.x - ma * pa1.x + pa1.y;

					if (Math.min(pb1.y, pb2.y) <= y
							&& Math.max(pb1.y, pb2.y) >= y) {
						return {
							x : pb1.x,
							y : y,
						};
					} else {
						return null;
					}
				}

			} else {

				if (Math.min(pb1.x, pb2.x) <= pa1.x
						&& Math.max(pb1.x, pb2.x) >= pa1.x) {

					var y = mb * pa1.x - mb * pb1.x + pb1.y;

					if (Math.min(pa1.y, pa2.y) <= y
							&& Math.max(pa1.y, pa2.y) >= y) {
						return {
							x : pa1.x,
							y : y,
						};
					} else {
						return null;
					}
				}
			}

		} else {
			if (ma == mb) {
				// parallel non-vertical segments

				if ((pa1.y - ma * pa1.x) == (pb1.y - mb * pb1.x)) {
					var xa1 = Math.max(pa1.x, pa2.x);
					var xa2 = Math.min(pa1.x, pa2.x);

					var xb1 = Math.max(pb1.x, pb2.x);
					var xb2 = Math.min(pb1.x, pb2.x);

					if ((xb1 >= xa1 && xb2 <= xa1)) {

						var xavg = (xa1 + Math.max(xb2, xa2)) / 2;

						return {
							x : xavg,
							y : ma * xavg - ma * pa1.x + pa1.y,
						};
					} else {

						if ((xb1 <= ax1 && xb1 >= xa2)) {

							var xavg = (xb1 + Math.max(xb2, xa2)) / 2;

							return {
								x : xavg,
								y : ma * xavg - ma * pa1.x + pa1.y,
							};
						} else {
							return null;
						}
					}

				} else {
					return null;
				}

			} else {
				// two normal segs with at most one intersection
				var x = (mb * pb1.x - pb1.y - ma * pa1.x + pa1.y) / (mb - ma);

				if (Math.min(pb1.x, pb2.x) <= x && Math.max(pb1.x, pb2.x) >= x
						&& Math.min(pa1.x, pa2.x) <= x
						&& Math.max(pa1.x, pa2.x) >= x) {

					return {
						x : x,
						y : ma * x - ma * pa1.x + pa1.y,
					};
				} else {
					return null;
				}
			}

		}

	}

}