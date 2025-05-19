import GamesGameObjects from "/src/minijuegos/games_game_objects.js";

class Huevox extends GamesGameObjects {
    constructor(scene, x, y, size_x, size_y) {
        let HUEVOX_IMG = 'huevox';
        super(scene, x, y, HUEVOX_IMG);

        this.setScale(size_x, size_y);
    }

    enter() {
        super.enter();

        this.setGravityY(800);
        this.setBounce(0);
        this.setCollideWorldBounds(true);
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

export default Huevox;
