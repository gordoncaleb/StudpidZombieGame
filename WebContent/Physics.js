function applyPhyiscs(actor, a, goff) {
	var dt = 1;

	actor.setX(actor.getX() + actor.getVX() * dt);
	actor.setY(actor.getY() + actor.getVY() * dt + 0.5 * a * dt * dt);

	if (actor.getY() > goff) {
		actor.setVY(0);
		actor.setY(goff);
	} else {
		actor.setVY(actor.getVY() + 0.5 * a * dt * dt);
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