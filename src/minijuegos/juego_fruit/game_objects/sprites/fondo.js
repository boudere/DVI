import GamesGameObjects from "/src/minijuegos/games_game_objects.js";

class Fondo extends GamesGameObjects {
    constructor(scene, x, y, img_name, size_x, size_y) { // Añadido img_name
       let FONDO_IMG = "fondoFruit"

        super(scene, x, y, FONDO_IMG);
        this.setScale(size_x, size_y);
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

    _set_colliders(size_x = 0.8, size_y = 0.8) { }
}

export default Fondo;