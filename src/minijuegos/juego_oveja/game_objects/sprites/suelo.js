import GamesGameObjects from "/src/minijuegos/games_game_objects.js";

class Suelo extends GamesGameObjects {
    constructor(scene, x, y, size_x, size_y) {
        let FONDO_IMG = 'suelo';
         
        super(scene, x, y, FONDO_IMG);

        this.setScale(1, 1);
        this.setImmovable(true);
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
    }

    _remove_event(event) {
    }
    _set_colliders(size_x = 1, size_y = 0.15) {
        super._set_colliders(size_x, size_y);
    }
}

export default Suelo;
