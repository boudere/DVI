import GamesGameObjects from '/src/minijuegos/games_game_objects.js';

class Mampara extends GamesGameObjects {
    constructor(scene, x, y, scale_x, scale_y) {
        let MAMPARA_IMG = 'mampara';
        super(scene, x, y, MAMPARA_IMG);
        
        this.setScale(scale_x, scale_y); // se escalará al tamaño del canvas
        //this.setDepth(-1); // detrás de todo
        this.body.setAllowGravity(false);
    }

    enter() {
        super.enter();
    }

    exit() {
        super.exit();
    }

    _update() {
        super._update();
    }

     _set_event(event) {
        super._set_event(event);
    }

    _remove_event(event) {
        super._remove_event(event);
    }

     _set_colliders(size_x = 0.8, size_y = 0.8) {}
}

export default Mampara;
