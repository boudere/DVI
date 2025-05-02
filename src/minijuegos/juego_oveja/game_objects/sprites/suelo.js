import GamesGameObjects from "/src/minijuegos/games_game_objects.js";

class Suelo extends GamesGameObjects {
    constructor(scene, x, y, size_x, size_y) {
        let FONDO_IMG = 'fondo';
         
        super(scene, x, y, FONDO_IMG);

        this.setScale(size_x, size_y);
        this.setImmovable(true);
        this.body.setAllowGravity(false);
    }

    enter() {
        super.enter();

        this._set_colliders(1, 0.4);
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

export default Suelo;
