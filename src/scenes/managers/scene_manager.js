import Managers from "/src/scenes/managers";

import { SCENE_MANAGER, DATA_INFO, PANTALLA_MANAGER, DIALOGO_MANAGER, MINIJUEGO_MANAGER, CURSOR_MANAGER } from "/src/data/scene_data.js";
import { SIGNAL_SCENE_CREATED } from "/src/data/signal_data.js";

// maneja todas las escenas del juego
class SceneManager extends Managers {
    constructor() {
        super({ key: SCENE_MANAGER });

        this.scenes = {}                // las escemas managers
        this.currentScene = null;       // la escena actual
        this.currentSceneData = null;   // los datos de la escena actual (necesaria para inicializar la escena)

        this.cursor_data = {
            edge_margin: 200,
            move_speed: 1
        };
    }

    create() {
        this.data_info_scene = this.scene.get(DATA_INFO)

        // carga los datos de la escena
        this.data = this.data_info_scene.get_data_json();
        this.data_json = this.data.Json;
        this.saves_data = this.data_info_scene.get_json(this.data_json.Saves);

        // activa la recepcion de señales de creacion de escenas
        this.events.on(SIGNAL_SCENE_CREATED, this.scene_created, this);

        // lanza las escenas managers
        // pantalla manager:
        this.scene.launch(PANTALLA_MANAGER);
        this.scenes[PANTALLA_MANAGER] = this.scene.get(PANTALLA_MANAGER);
        this.currentScene = PANTALLA_MANAGER;
        this.currentSceneData = this.saves_data.Pantalla;

        // dialogo manager:
        this.scene.launch(DIALOGO_MANAGER);
        this.scenes[DIALOGO_MANAGER] = this.scene.get(DIALOGO_MANAGER);
        // this.currentScene = DIALOGO_MANAGER;
        // this.currentSceneData = this.saves_data.Dialogo;

        // minijuego manager:
        this.scene.launch(MINIJUEGO_MANAGER);
        this.scenes[MINIJUEGO_MANAGER] = this.scene.get(MINIJUEGO_MANAGER);
        this.currentScene = MINIJUEGO_MANAGER;
        this.currentSceneData = 'JuegoOveja';

        // cursor manager:
        this.scene.launch(CURSOR_MANAGER);
        this.cursor = this.scene.get(CURSOR_MANAGER)
        this.cursor.enter(this.cursor_data);
    }

    // se ejecuta cuando hay un cambio de manaegr
    signal_click(on_click) {
        this.scenes[this.currentScene].exit();
        this.currentScene = this._get_next_scene(on_click.scene);

        this.scenes[this.currentScene].enter(on_click.name);

    }

    // se ejecuta cuando se termina de crear una escena
    scene_created(scene) {
        if (scene == this.currentScene) {
            console.log("SceneManager: Scene created: " + this.currentSceneData);
            this.scenes[scene].enter(this.currentSceneData);
        } else {
            this.scenes[scene].exit();
        }
    }

    // traduce el nombre de la escena a la escena manager correspondiente
    _get_next_scene(name) {
        switch (name) {
            case "dialogo":
                return DIALOGO_MANAGER;
            case "pantalla":
                return PANTALLA_MANAGER;
                break;
            case "minijuego":
                return MINIJUEGO_MANAGER;
                break;
            default:
                break;
        }
    }

    // se ejecuta cuando el cursor entra en un objeto
    cursor_entered(name) {
        this.cursor.cursor_entered(name);
    }

    // se ejecuta cuando el cursor sale de un objeto
    cursor_exited(name) {
        this.cursor.cursor_exited(name);
    }

    // se ejecuta cuando el cursor se mueve
    move(offsetX, offsetY) {
        this.scenes[this.currentScene].move(offsetX, offsetY);
    }
    
    exit() {
        this.pause();
    }

    enter(scene_data) {
        this.unpause();
    }

    // se ejecuta constantemente para actualizar la escena manager
    update(time, delta) {
        this.scenes[this.currentScene]._update(time, delta);
        this.cursor._update(time, delta);
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
