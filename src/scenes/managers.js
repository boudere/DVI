
import { SCENE_MANAGER } from "/src/data/scene_data.js";
import { SIGNAL_SCENE_CREATED } from "/src/data/signal_data.js";

// esta escena de momento solo lanza la escena de dialogo
class Managers extends Phaser.Scene {
    constructor(scene_key) {
        super(scene_key);

        this.isPause = false;
        this.animations_finished = 0;
        this.total_animations = 0;
        this.scene_name = scene_key.key;
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

    cursor_entered(name, on_click) {
        this.scene.get(SCENE_MANAGER).cursor_entered(name, on_click);
    }

    cursor_exited(name) {
        this.scene.get(SCENE_MANAGER).cursor_exited(name);
    }

    move(offsetX, offsetY, can_move) {}

    play_music(key, config={}) {
        this.scene.get(SCENE_MANAGER).play_music(this.scene_name, key, config);
    }

    stop_music(scene_key, key) {
        this.scene.get(SCENE_MANAGER).stop_music(scene_key, key);
    }

    play_sfx(key, config={}) {
        this.scene.get(SCENE_MANAGER).play_sound(this.scene_name, key, config);
    }

    stop_sfx(scene_key, key) {
        this.scene.get(SCENE_MANAGER).stop_sound(scene_key, key);
    }
}

export default Managers;
