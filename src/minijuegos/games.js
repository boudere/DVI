import Phaser from 'phaser';

import { MINIJUEGO_MANAGER } from '/src/data/scene_data';

class Games extends Phaser.Scene {
    constructor(scene) {
        super(scene);
    }

    _update(time, delta) {
        // Placeholder for update logic
    }

    enter() {
        // Placeholder for enter logic
    }

    exit() {
        // Placeholder for exit logic
    }

    _set_event(event) {
        // Placeholder for setting event logic
    }

    _remove_event(event) {
        // Placeholder for removing event logic
    }

    game_created() {
        this.scene.get(MINIJUEGO_MANAGER).game_created(this.scene.key);
    }

    start_game() {}

    finnish_game() {}
}

export default Games;