function applyPhyiscs(actor, a, goff) {
	var dt = 1;

	actor.setX(actor.getX() + actor.getVX() * dt);
	actor.setY(Math.min(goff, actor.getY() + actor.getVY() * dt + 0.5 * a * dt
			* dt));

	if (actor.getY() > goff) {
		actor.setVY(0);
		actor.setY(goff);
	} else {
		actor.setVY(actor.getVY() + 0.5 * a * dt * dt);
	}

}