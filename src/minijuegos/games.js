
import { MINIJUEGO_MANAGER } from '/src/data/scene_data';

class Games extends Phaser.Scene {
    constructor(scene) {
        super(scene);
    }

    _update(time, delta) {
        // Placeholder for update logic
    }

    enter() {
        this._set_events(); // Establecer eventos de entrada
        // Placeholder for enter logic
    }

    exit() {
        this._remove_events(); // Eliminar eventos de entrada
        // Placeholder for exit logic
    }

    _set_events() {
        // Placeholder for setting event logic
    }

    _remove_events() {
        // Placeholder for removing event logic
    }

    game_created() {
        this.scene.get(MINIJUEGO_MANAGER).game_created(this.scene.key);
    }

    start_game() {}

    finnish_game() {}
}

export default Games;