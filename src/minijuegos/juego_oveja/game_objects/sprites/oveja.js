import GamesGameObjects from "/src/minijuegos/games_game_objects.js";

class Oveja extends GamesGameObjects {
    constructor(scene, x, y) {
        let OVEJA_IMG = 'oveja';

        super(scene, x, y, OVEJA_IMG);
    }

    enter() {
        super.enter();

        setTimeout(() => {
            this.setBounce(0);
            this.set_gravity_force(800);
            this.setVelocityX(-500);
        }, 10);

        this._set_colliders(0.7, 0.7);
    }

    exit() {
        super.exit();
    }

    set_gravity_force(gravity) {
        this.body.setGravityY(gravity);
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

export default Oveja;
