function applyPhyiscs(actor, gObjs) {
	var dt = 1;

	// var actorPos1 = {
	// x : actor.getX(),
	// y : actor.getY()
	// };
	//
	// actorPos1.bot = actorPos1.y + actor.getHeight();
	// actorPos1.top = actorPos1.y;
	// actorPos1.right = actorPos1.x + actor.getWidth();
	// actorPos1.left = actorPos1.x;
	//
	// var actorPos2 = {
	// x : actor.getX() + actor.getVX() * dt + 0.5 * actor.getAX() * dt * dt,
	// y : actor.getY() + actor.getVY() * dt + 0.5 * actor.getAY() * dt * dt
	// };
	//
	// actor.setX(actorPos2.x);
	// actor.setY(actorPos2.y);
	//
	// actor.setVY(actor.getVY() + 0.5 * actor.getAY() * dt * dt);
	// actor.setVX(actor.getVX() + 0.5 * actor.getAX() * dt * dt);
	//
	// actorPos2.bot = actor.getY() + actor.getHeight();
	// actorPos2.top = actor.getY();
	// actorPos2.right = actor.getX() + actor.getWidth();
	// actorPos2.left = actor.getX();

	pos = moveTime(actor);

	for (o in gObjs) {
		if (collision(gObjs[o], actor)) {

			var obot = gObjs[o].getY() + gObjs[o].getHeight();
			var otop = gObjs[o].getY();
			var oright = gObjs[o].getX() + gObjs[o].getWidth();
			var oleft = gObjs[o].getX();

			// bumping head
			if (pos.pos1.top >= obot && pos.pos2.top <= obot) {
				actor.setVY(0);
				actor.setY(obot);
			}

			// landing on
			if (pos.pos1.bot <= otop && pos.pos2.bot >= otop) {
				actor.setVY(0);
				actor.setY(otop - actor.getHeight());

				// standing on
				if (actorPos1.bot == otop) {
					// actor.setVX(actor.getVX() + gObjs[o].vx);
				}
			}

			//
			if (pos.pos1.right <= oleft && pos.pos2.right >= oleft) {
				actor.setVX(0);
				actor.setX(oleft - actor.getWidth());
			}

			if (pos.pos1.left >= oright && pos.pos2.left <= oright) {
				actor.setVX(0);
				actor.setX(oright);
			}

		}
	}

}

function moveTime(obj) {
	var dt = 1;

	var pos1 = {
		x : obj.getX(),
		y : obj.getY()
	};

	pos1.bot = pos1.y + obj.getHeight();
	pos1.top = pos1.y;
	pos1.right = pos1.x + obj.getWidth();
	pos1.left = pos1.x;

	var pos2 = {
		x : obj.getX() + obj.getVX() * dt + 0.5 * obj.getAX() * dt * dt,
		y : obj.getY() + obj.getVY() * dt + 0.5 * obj.getAY() * dt * dt
	};

	obj.setX(pos2.x);
	obj.setY(pos2.y);

	obj.setVY(obj.getVY() + 0.5 * obj.getAY() * dt * dt);
	obj.setVX(obj.getVX() + 0.5 * obj.getAX() * dt * dt);

	pos2.bot = obj.getY() + obj.getHeight();
	pos2.top = obj.getY();
	pos2.right = obj.getX() + obj.getWidth();
	pos2.left = obj.getX();

	return {
		pos1 : pos1,
		pos2 : pos2
	};
}

// objA move from pos.pos1 to pos.pos2.
function checkCollision(objA, objB, posA) {
	if (collision(objA, objB)) {

		// objA collided with objB after moving from pos.pos1 to pos.pos2

		var obot = objB.getY() + objB.getHeight();
		var otop = objB.getY();
		var oright = objB.getX() + objB.getWidth();
		var oleft = objB.getX();

		// top of objA hit bottom of objB
		if (posA.pos1.top >= obot && posA.pos2.top <= obot) {

			if (objA.unmovable) {
				objB.setVY(objA.vy);
				objB.setY(posA.pos2.top - objB.getHeight());
			} else {
				objA.setVY(0);
				objA.setY(obot);
			}
		}

		// bottom side of objA hit top of objB
		if (posA.pos1.bot <= otop && posA.pos2.bot >= otop) {

			if (objA.unmovable) {
				objB.setVY(objA.vy);
				objB.setY(posA.pos2.bot);
			} else {
				objA.setVY(0);
				objA.setY(otop - objA.getHeight());
			}

			// standing on
			if (posA.pos1.bot == otop) {
				// sliding effect 0.9 friction
				objA.vx = objA.vx + 0.9 * (objB.vx - objA.vx);
			}
		}

		// right side of ojbA hit objB
		if (posA.pos1.right <= oleft && posA.pos2.right >= oleft) {

			if (objA.unmovable) {
				objB.setVX(objA.vx);
				objB.setX(posA.pos2.right);
			} else {
				objA.setVX(0);
				objA.setY(objB.x - objA.width);
			}

		}

		// left side of objA hit objB
		if (posA.pos1.left >= oright && posA.pos2.left <= oright) {

			if (objA.unmovable) {
				objB.setVX(objA.vx);
				objB.setX(objA.x - objB.width);
			} else {
				objA.setVY(0);
				objA.setY(oright);
			}

		}

	}
}

function collision(a, b) {
	if (rectObjAInsideRectObjB(a, b) || rectObjAInsideRectObjB(b, a)) {
		return true;
	} else {
		return false;
	}
}

function rectObjAInsideRectObjB(objA, objB) {
	if (within(objA.getX(), objA.getY(), objB.getX(), objB.getY(), objB.getWidth(), objB.getHeight())) {
		return true;
	} else {
		if (within(objA.getX() + objA.getWidth(), objA.getY(), objB.getX(), objB.getY(), objB.getWidth(), objB.getHeight())) {
			return true;
		} else {
			if (within(objA.getX(), objA.getY() + objA.getHeight(), objB.getX(), objB.getY(), objB.getWidth(), objB.getHeight())) {
				return true;
			} else {
				if (within(objA.getX() + objA.getWidth(), objA.getY() + objA.getHeight(), objB.getX(), objB.getY(), objB.getWidth(), objB.getHeight())) {
					return true;
				}
			}
		}
	}

	return false;
}

function within(px, py, bx, by, bwidth, bheight) {
	if (px >= bx && px <= (bx + bwidth) && py >= by && py <= (by + bheight)) {
		return true;
	} else {
		return false;
	}
}

function distance(x1, y1, x2, y2) {
	return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}