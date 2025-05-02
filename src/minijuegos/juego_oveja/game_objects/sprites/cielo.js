import GamesGameObjects from "/src/minijuegos/games_game_objects.js";

class Cielo extends GamesGameObjects {
    constructor(scene, x, y) {
        let CIELO_IMG = 'cielo';

        super(scene, x, y, CIELO_IMG);

        this.body.setAllowGravity(false);

    }

    enter() {
        super.enter();
    }

    exit() {
        super.exit();
    }

    _update(time, delta) {
        super._update(time, delta);
    }

    _set_event(event) {
        super._set_event(event);
    }

    _remove_event(event) {
        super._remove_event(event);
    }

    _set_colliders(size_x = 0.8, size_y = 0.8) {}
}

export default Cielo;
