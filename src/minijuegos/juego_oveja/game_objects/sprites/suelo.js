import GamesGameObjects from "/src/minijuegos/games_game_objects.js";

class Suelo extends GamesGameObjects {
    constructor(scene, x, y, texture, size_x, size_y) {
        super(scene, x, y, texture);

        this.setScale(size_x, size_y);
    }

    enter() {
        super.enter();

        this.setImmovable(true);
        this.body.allowGravity = false;
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

export default Suelo;
