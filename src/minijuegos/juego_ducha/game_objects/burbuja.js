import GamesGameObjects from '/src/minijuegos/games_game_objects.js';

class Burbuja extends GamesGameObjects {
    constructor(scene, x, y, scale_x, scale_y) {
        const BURBUJA_IMG = 'burbuja';
        super(scene, x, y, BURBUJA_IMG);
        this.setScale(scale_x, scale_y);
        this.body.setAllowGravity(false);
        this.body.setImmovable(true);
        scene.add.existing(this);
    }


    enter() {
        super.enter();
        //this.setImmovable(true);
    }

    _update() {
        super._update();
    }

    exit() {
        super.exit();
    }

    _set_event(event) {
        super._set_event(event);
    }

    _remove_event(event) {
        super._remove_event(event);
    }

}

export default Burbuja;
