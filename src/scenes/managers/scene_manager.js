import Managers from "/src/scenes/managers";

import DialogoManager from '/src/scenes/managers/dialogo_manager.js';
import CursorManager from '/src/scenes/managers/cursor_manager';
import MinijuegosManager from '/src/scenes/managers/minijuegos_manager';
import PantallaManager from '/src/scenes/managers/pantalla_manager.js';
import AfinidadDialogoManager from "/src/scenes/managers/afinidad_dialogo_manager";

import LoginScene from '/src/scenes/login_scene.js';
import AudioManager from "/src/scenes/managers/audio_manager";

import { SCENE_MANAGER, DATA_INFO, PANTALLA_MANAGER, DIALOGO_MANAGER, MINIJUEGO_MANAGER, CURSOR_MANAGER, AFINIDAD_DIALOGO_MANAGER, LOGIN_SCENE } from "/src/data/scene_data.js";
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
        this.audio_manager = new AudioManager(this);
        this.data_info_scene = this.scene.get(DATA_INFO)

        // carga los datos de la escena
        this.data = this.data_info_scene.get_data_json();
        this.data_json = this.data.Json;

        // añade la escena al scene manager y la lanza
        this.scene.add(LOGIN_SCENE, LoginScene, false);
        this.scene.launch(LOGIN_SCENE);
    }

    agregar_scenes(data) {
        this.scene.stop(LOGIN_SCENE);
        this.data_info_scene.save_firestore_data(data);
        this.saves_data = this.data_info_scene.get_json(this.data_json.Saves);
        // this.saves_data = this.data_info_scene.get_datos_usaurio();

         // activa la recepcion de señales de creacion de escenas
         this.events.on(SIGNAL_SCENE_CREATED, this.scene_created, this);

         // lanza las escenas managers
         // pantalla manager:
         this.add_scene(PANTALLA_MANAGER, PantallaManager, this.saves_data.Pantalla);
        //this.add_scene(PANTALLA_MANAGER, PantallaManager);
 
         // dialogo manager:
         this.add_scene(DIALOGO_MANAGER, DialogoManager, this.saves_data.Dialogo);
         //this.add_scene(DIALOGO_MANAGER, DialogoManager);
 
         // minijuego manager:
         //this.add_scene(MINIJUEGO_MANAGER, MinijuegosManager, 'JuegoDiscoteca');
         this.add_scene(MINIJUEGO_MANAGER, MinijuegosManager);

        this.add_scene(AFINIDAD_DIALOGO_MANAGER, AfinidadDialogoManager);
 
         // cursor manager:
         this.add_scene(CURSOR_MANAGER, CursorManager);
         this.cursor = this.scenes[CURSOR_MANAGER];
         this.cursor.enter(this.cursor_data);
    }

    // añade de manera dinamica las diferentes escenas
    add_scene(scene_key, scene, scene_data=null) {
        // en caso de que la escena ya exista, la elimina y la vuelve a añadir (no deberia de pasar)
        if (this.scene.get(scene_key)) {
            this.scene.remove(scene_key);
        }
        // añade la escena al scene manager y la lanza
        this.scene.add(scene_key, scene, false);
        this.scene.launch(scene_key);

        // la escena manager se añade a la lista de escenas
        this.scenes[scene_key] = this.scene.get(scene_key);

        // si la escena tiene datos, los asigna a la escena manager
        if (scene_data) {
            this.currentScene = scene_key;
            this.currentSceneData = scene_data;
        }
    }

    // se ejecuta cuando hay un cambio de manaegr
    signal_click(on_click) {
        this.scenes[this.currentScene].exit();
        this.currentScene = this._get_next_scene(on_click.scene);

        if (on_click.scene === 'minijuego') {
            // Si es minijuego, pasar TODO el on_click
            this.scenes[this.currentScene].enter(on_click);
        } else {
            // Si es cualquier otra cosa, pasar solo el name
            this.scenes[this.currentScene].enter(on_click.name);
        }

    }

    // se ejecuta cuando se termina de crear una escena
    scene_created(scene) {
        if (scene == this.currentScene) {
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
    cursor_entered(name, on_click) {
        this.cursor.cursor_entered(name, on_click);
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
        if (!this.currentScene) return; // si no hay escena actual, no hace nada
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

    play_music(key, music_key, config = {}) {
        if (key != this.currentScene) return; // si la escena no es la actual, no hace nada
        this.audio_manager.play_music(music_key, config);
    }

    stop_music(key) {
        if (key != this.currentScene) return; // si la escena no es la actual, no hace nada
        this.audio_manager.stop_music();
    }

    set_music_volume(key, volume) {
        if (key != this.currentScene) return; // si la escena no es la actual, no hace nada
        this.audio_manager.set_music_volume(volume);
    }

    // Efectos de sonido
    play_sfx(key, sfx_key, config = {}) {
        if (key != this.currentScene) return; // si la escena no es la actual, no hace nada
        this.audio_manager.play_sfx(sfx_key, config);
    }

    stop_all_sfx(key) {
        if (key != this.currentScene) return; // si la escena no es la actual, no hace nada
        this.audio_manager.stop_all_sfx();
    }

    set_sfx_volume(key, volume) {
        if (key != this.currentScene) return; // si la escena no es la actual, no hace nada
        this.audio_manager.set_sfx_volume(volume);
    }
}

export default SceneManager;
