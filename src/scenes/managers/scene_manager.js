import Managers from "/src/scenes/managers";

import { SCENE_MANAGER, DATA_INFO, PANTALLA_MANAGER, DIALOGO_MANAGER, MINIJUEGO_MANAGER, CURSOR_MANAGER } from "/src/data/scene_data.js";
import { SIGNAL_SCENE_CREATED } from "/src/data/signal_data.js";

// esta escena de momento solo lanza la escena de dialogo
class SceneManager extends Managers {
    constructor() {
        super({ key: SCENE_MANAGER });

        this.scenes = {}
        this.currentScene = null;
        this.currentSceneData = null;

        this.cursor_data = {
            edge_margin: 300,
            scroll_speed: 3
        };
    }

    create() {
        this.data_info_scene = this.scene.get(DATA_INFO)

        this.data = this.data_info_scene.get_data_json();
        this.data_json = this.data.Json;
        this.saves_data = this.data_info_scene.get_json(this.data_json.Saves);

        this.events.on(SIGNAL_SCENE_CREATED, this.scene_created, this);

        this.scene.launch(PANTALLA_MANAGER);
        this.scenes[PANTALLA_MANAGER] = this.scene.get(PANTALLA_MANAGER);
        this.currentScene = PANTALLA_MANAGER;
        this.currentSceneData = this.saves_data.Pantalla;

        this.scene.launch(DIALOGO_MANAGER);
        this.scenes[DIALOGO_MANAGER] = this.scene.get(DIALOGO_MANAGER);
        // this.currentScene = DIALOGO_MANAGER;
        // this.currentSceneData = this.saves_data.Dialogo;

        this.scene.launch(MINIJUEGO_MANAGER);
        this.scenes[MINIJUEGO_MANAGER] = this.scene.get(MINIJUEGO_MANAGER);
        // this.currentScene = MINIJUEGO_MANAGER;
        // this.currentSceneData = 'JuegoOveja';

        this.scene.launch(CURSOR_MANAGER);
        this.cursor = this.scene.get(CURSOR_MANAGER)
        this.cursor.enter(this.cursor_data);
    }

    signal_click(on_click) {
        this.scenes[this.currentScene].exit();
        this.currentScene = this._get_next_scene(on_click.scene);

        this.scenes[this.currentScene].enter(on_click.name);

    }

    scene_created(scene) {
        if (scene == this.currentScene) {
            this.scenes[scene].enter(this.currentSceneData);
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

    cursor_entered(name) {
        this.cursor.cursor_entered(name);
    }

    cursor_exited(name) {
        this.cursor.cursor_exited(name);
    }

    scroll(offsetX, offsetY) {
        if (PANTALLA_MANAGER == this.currentScene) {
            this.scenes[this.currentScene].scroll(offsetX, offsetY);
        }
    }
    exit() {
        this.pause();
    }

    enter(scene_data) {
        this.unpause();
    }

    update(time, delta) {
        this.scenes[this.currentScene]._update(time, delta);
    }

    _update() {
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
