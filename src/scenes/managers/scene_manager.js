import Managers from "/src/scenes/managers";

import { SCENE_MANAGER, DATA_INFO, PANTALLA_MANAGER, DIALOGO_MANAGER } from "/src/data/scene_data.js";
import { SIGNAL_SCENE_CREATED } from "/src/data/signal_data.js";

// esta escena de momento solo lanza la escena de dialogo
class SceneManager extends Managers {
    constructor() {
        super({ key: SCENE_MANAGER });

        this.scenes = {}
        this.currentScene = null;
    }

    create() {
        this.events.on(SIGNAL_SCENE_CREATED, this.scene_created, this);

        this.scene.start(PANTALLA_MANAGER);
        this.scenes[PANTALLA_MANAGER] = this.scene.get(PANTALLA_MANAGER);
        this.currentScene = PANTALLA_MANAGER;

        this.scene.start(DIALOGO_MANAGER);
        this.scenes[DIALOGO_MANAGER] = this.scene.get(DIALOGO_MANAGER);
    }

    signal_click(on_click) {
        this.scenes[this.currentScene].exit();
        this.currentScene = this._get_next_scene(on_click.scene);

        this.scenes[this.currentScene].enter(on_click.name);

    }

    scene_created(scene) {
        if (scene == this.currentScene) {
            this.scenes[scene].enter();
        } else {
            this.scenes[scene].exit();
        }
    }

    _get_next_scene(name) {
        switch (name) {
            case "dialogo":
                return DIALOGO_MANAGER;
            case "pantalla":
                return PANTALLA_MANAGER;
            default:
                break;
        }
    }

    exit() {
        this.pause();
    }

    enter(scene_data) {
        this.unpause();
    }

    update() {
        super.update();
    }

    pause(){
        super.pause();
    }

    unpause(){
        super.unpause();
    }
}

export default SceneManager;
