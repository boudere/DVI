import Managers from "/src/scenes/managers";
import { MINIJUEGO_MANAGER, SCENE_MANAGER, DIALOGO_MANAGER, DATA_INFO, JUEGO_OVEJA, JUEGO_DISCOTECA } from "/src/data/scene_data.js";

import JuegoOveja from '/src/minijuegos/juego_oveja/juego_oveja2.js';
import JuegoDiscoteca from '/src/minijuegos/juego_discoteca/juego_discoteca';

class MovilManager extends Managers {
    constructor() {
        super({ key: MOVIL_MANAGER });
    }

    _reset_data() {
        this.current_movil = null;
    }

    create() {
        this.data_info_scene = this.scene.get(DATA_INFO);
        this.scene_created();
    }

    enter(scene_data) {
        if (!super.enter(scene_data)) { return; }
        this.start_movil(scene_data);
    }

    exit() {
        if (!super.exit()) { return; }
        this.exit_movil();
    }

    start_movil(movil_name) {
        if (this.current_movil) {
            this.current_movil.scene.stop();
        }

        this.add_scene_movil(movil_name, this.get_movil(movil_name));
    }

    exit_movil() {
        if (this.current_movil) {
            this.current_movil.scene.stop();
            this.current_movil = null;
        }
    }

    _update() {
        if (this.current_movil) {
            this.current_movil._update();
        }
    }

    open_dialog(dialog_data) {
        this.scene.get(DIALOGO_MANAGER).enter(dialog_data);
    }

    game_created() {
        this.current_movil.enter();
    }

    // añade de manera dinamica las diferentes escenas
    add_scene_minijuego(scene_key, scene) {
        // en caso de que la escena ya exista, la elimina y la vuelve a añadir (no deberia de pasar)
        if (this.scene.get(scene_key)) {
            this.scene.remove(scene_key);
        }
        // añade la escena al scene manager y la lanza
        this.scene.add(scene_key, scene, false);
        this.scene.launch(scene_key);
        
        this.current_minigame = this.scene.get(scene_key);
    }

    get_minijuego(minijuego_name) {
        switch (minijuego_name) {
            case JUEGO_OVEJA:
                return JuegoOveja;
            case JUEGO_DISCOTECA:
                return JuegoDiscoteca;
            default:
                return null;
        }
    }
}

export default MovilManager;
