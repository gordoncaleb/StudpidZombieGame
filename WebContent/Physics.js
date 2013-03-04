function applyPhyiscs(actor, gObjs) {
	var dt = 1;

	var ax1 = actor.getX();
	var ay1 = actor.getY();
	var ax2 = actor.getX() + actor.getVX() * dt + 0.5 * actor.getAX() * dt * dt;
	var ay2 = actor.getY() + actor.getVY() * dt + 0.5 * actor.getAY() * dt * dt;

	actor.setX(ax2);
	actor.setY(ay2);

	actor.setVY(actor.getVY() + 0.5 * actor.getAY() * dt * dt);
	actor.setVX(actor.getVX() + 0.5 * actor.getAX() * dt * dt);

	var abot = actor.getY() + actor.getHeight();
	var atop = actor.getY();
	var aleft = actor.getX() + actor.getWidth();
	var aright = actor.getX();

	for (o in gObjs) {
		if (collision(gObjs[o], actor)) {

			var obot = gObjs[o].getY() + gObjs[o].getHeight();
			var otop = gObjs[o].getY();
			var oleft = gObjs[o].getX() + gObjs[o].getWidth();
			var oright = gObjs[o].getX();

			// bumping head
			if (atop >= obot) {
				actor.setVY(0);
				actor.setY(obot);
			}

			// landing on
			if (abot <= otop) {
				actor.setVY(0);
				actor.setY(otop - actor.getHeight());
			}

			//
			if (aright >= oleft) {
				actor.setVX(0);
				actor.setX(oleft - actor.getWidth());
			}

			if (aleft <= oright) {
				actor.setVX(0);
				actor.setX(oright);
			}

			break;
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