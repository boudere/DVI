import Managers from "/src/scenes/managers";
import { MINIJUEGO_MANAGER, SCENE_MANAGER, DIALOGO_MANAGER, DATA_INFO, JUEGO_OVEJA, JUEGO_DISCOTECA, JUEGO_FRUIT } from "/src/data/scene_data.js";

import JuegoOveja from '/src/minijuegos/juego_oveja/juego_oveja2.js';
import JuegoDiscoteca from '/src/minijuegos/juego_discoteca/juego_discoteca';
import JuegoFruit from '/src/minijuegos/juego_fruit_merge/fruit_merge.js';

class MinijuegosManager extends Managers {
    constructor() {
        super({ key: MINIJUEGO_MANAGER });
    }

    _reset_data() {
        this.current_minigame = null;
    }

    create() {
        this.data_info_scene = this.scene.get(DATA_INFO);
        this.scene_created();
    }

    enter(scene_data) {
        if (!super.enter(scene_data)) { return; }
        this.scene_data = scene_data;  // guarda todo el objeto scene_data
        this.start_minigame(scene_data.name); // inicia el minijuego
    }

    return_to_dialogo() {
        console.log("Volviendo al diálogo desde el minijuego.");
        this.exit_minigame();
    
        if (this.scene_data && this.scene_data.return_dialogo) {
            this.scene.get(SCENE_MANAGER).signal_click({
                scene: 'dialogo',
                name: this.scene_data.return_dialogo
            });
        } else {
            console.error("No se encontró el return_dialogo para volver al diálogo.");
        }
    }
    
    exit() {
        if (!super.exit()) { return; }
        this.exit_minigame();
    }

    start_minigame(minigame_name) {
        if (this.current_minigame) {
            this.current_minigame.scene.stop();
        }

        this.add_scene_minijuego(minigame_name, this.get_minijuego(minigame_name));
    }

    exit_minigame() {
        if (this.current_minigame) {
            this.current_minigame.scene.stop();
            this.current_minigame = null;
        }
    }

    _update() {
        if (this.current_minigame) {
            this.current_minigame._update();
        }
    }

    open_dialog(dialog_data) {
        this.scene.get(DIALOGO_MANAGER).enter(dialog_data);
    }

    game_created() {
        this.current_minigame.enter();
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

export default MinijuegosManager;
