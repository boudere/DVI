import Managers from "/src/scenes/managers";
import { MINIJUEGO_MANAGER, SCENE_MANAGER, DIALOGO_MANAGER, DATA_INFO } from "/src/data/scene_data.js";

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
        this.start_minigame(scene_data);
    }

    start_minigame(minigame_name) {
        if (this.current_minigame) {
            this.current_minigame.scene.stop();
        }
        
        this.scene.launch(minigame_name);
        this.current_minigame = this.scene.get(minigame_name);
    }

    exit_minigame() {
        if (this.current_minigame) {
            this.current_minigame.scene.stop();
            this.current_minigame = null;
        }
        
        this.scene.get(SCENE_MANAGER).resume();
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
}

export default MinijuegosManager;
