import Phaser from "phaser";

import { SCENE_MANAGER } from "/src/data/scene_data.js";
import { SIGNAL_SCENE_CREATED } from "/src/data/signal_data.js";

// esta escena de momento solo lanza la escena de dialogo
class Managers extends Phaser.Scene {
    constructor(scene) {
        super(scene);

        this.isPause = false;
        this.animations_finished = 0;
        this.total_animations = 0;
    }

    // se ejecuta al salir de la escena
    exit() { this.pause(); }

    // se ejecuta al entrar en la escena
    enter(scene_data) { 
        if (!scene_data) { return false; }
        return true;
    }

    // se ejecuta al actualizar la escena
    _update() { if (this.isPause) { return; } }

    // se ejecuta al pausar la escena
    pause() { this.isPause = true; }

    // se ejecuta al despausar la escena
    unpause() { this.isPause = false; }

    // se ejecuta al enviar una señal
    sendSignal(signal_data) {}

    // se ejecuta al recibir una señal
    onSignal(signal_data) {}

    scene_created() {
        this.scene.get(SCENE_MANAGER).events.emit(SIGNAL_SCENE_CREATED, this.scene.key);
    }

    starting_animation() {}

    cursor_entered(name) {
        this.scene.get(SCENE_MANAGER).cursor_entered(name);
    }

    cursor_exited(name) {
        this.scene.get(SCENE_MANAGER).cursor_exited(name);
    }

    move(offsetX, offsetY, can_move) {}
}

export default Managers;
