

function applyPhyiscs(actor, gObjs) {
	var dt = 1;

	var actorPos1 = {
		x : actor.getX(),
		y : actor.getY()
	};

	actorPos1.bot = actorPos1.y + actor.getHeight();
	actorPos1.top = actorPos1.y;
	actorPos1.right = actorPos1.x + actor.getWidth();
	actorPos1.left = actorPos1.x;

	var actorPos2 = {
		x : actor.getX() + actor.getVX() * dt + 0.5 * actor.getAX() * dt * dt,
		y : actor.getY() + actor.getVY() * dt + 0.5 * actor.getAY() * dt * dt
	};

	actor.setX(actorPos2.x);
	actor.setY(actorPos2.y);

	actor.setVY(actor.getVY() + 0.5 * actor.getAY() * dt * dt);
	actor.setVX(actor.getVX() + 0.5 * actor.getAX() * dt * dt);

	actorPos2.bot = actor.getY() + actor.getHeight();
	actorPos2.top = actor.getY();
	actorPos2.right = actor.getX() + actor.getWidth();
	actorPos2.left = actor.getX();

	for (o in gObjs) {
		if (collision(gObjs[o], actor)) {

			var obot = gObjs[o].getY() + gObjs[o].getHeight();
			var otop = gObjs[o].getY();
			var oright = gObjs[o].getX() + gObjs[o].getWidth();
			var oleft = gObjs[o].getX();

			// bumping head
			if (actorPos1.top >= obot && actorPos2.top <= obot) {
				actor.setVY(0);
				actor.setY(obot);
			}

			// landing on
			if (actorPos1.bot <= otop && actorPos2.bot >= otop) {
				actor.setVY(0);
				actor.setY(otop - actor.getHeight());
				
				//standing on
				if(actorPos1.bot == otop){
					//actor.setVX(actor.getVX() + gObjs[o].vx);
				}
			}

			//
			if (actorPos1.right <= oleft && actorPos2.right >= oleft) {
				actor.setVX(0);
				actor.setX(oleft - actor.getWidth());
			}

			if (actorPos1.left >= oright && actorPos2.left <= oright) {
				actor.setVX(0);
				actor.setX(oright);
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
	if (within(objA.getX(), objA.getY(), objB.getX(), objB.getY(), objB
			.getWidth(), objB.getHeight())) {
		return true;
	} else {
		if (within(objA.getX() + objA.getWidth(), objA.getY(), objB.getX(),
				objB.getY(), objB.getWidth(), objB.getHeight())) {
			return true;
		} else {
			if (within(objA.getX(), objA.getY() + objA.getHeight(),
					objB.getX(), objB.getY(), objB.getWidth(), objB.getHeight())) {
				return true;
			} else {
				if (within(objA.getX() + objA.getWidth(), objA.getY()
						+ objA.getHeight(), objB.getX(), objB.getY(), objB
						.getWidth(), objB.getHeight())) {
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