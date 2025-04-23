import GamesGameObjects from "/src/minijuegos/games_game_objects.js";

class Valla extends GamesGameObjects {
    constructor(scene, x, y) {
        let VALLA_IMG = 'valla';

        super(scene, x, y, VALLA_IMG);

        this.body.setAllowGravity(false);
    }

    enter() {
        super.enter();
        this._set_colliders(0.45, 0.65);
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
}

export default Valla;
