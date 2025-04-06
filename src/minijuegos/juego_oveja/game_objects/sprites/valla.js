import GamesGameObjects from "/src/minijuegos/games_game_objects.js";

class Valla extends GamesGameObjects {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);

        this.setScale(200 / 626, 200 / 569);
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

export default Valla;
