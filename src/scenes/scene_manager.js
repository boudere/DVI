import { SCENE_MANAGER, SCENE_PANTALLAS, SCENE_DIALOGO } from '/src/data/scene_data.ts';
import { EVENT_START_DIALOGO, EVENT_START_PANTALLA } from "/src/data/events_data.ts";

import AssetsData from '/src/data/assets_data.js';
import Cursor from '/src/gameObjects/cursor.js';

// esta escena de momento solo lanza la escena de dialogo
class SceneManager extends Phaser.Scene {
    constructor() {
        super({ key: SCENE_MANAGER });
        this.assets_data = new AssetsData(this);
    }

    init() {
        this.assets_data.recargar_datos();
    }

    preload() {
        this.assets_data.cargar_img_cursor();
        setTimeout(() => {
            this.change_cursor("normal");
        }, 1000);
    }

    create() {
        this.cursor = new Cursor(this, 400, 300, this.assets_data.get_background_cursor(), this.assets_data);

        this.events.on(EVENT_START_DIALOGO, this.start_dialogo, this);
        this.events.on(EVENT_START_PANTALLA, this.start_pantalla, this);
    }

    start_dialogo(dialogo) {
        this.stop_scenes();
        this.scene.launch(SCENE_DIALOGO, dialogo);
    }

    start_pantalla(pantalla) {
        this.stop_scenes();
        this.scene.launch(SCENE_PANTALLAS, pantalla);
    }

    stop_scenes() {
        this.change_cursor("normal");
        this.show_background_cursor(false);

        if (this.scene.isActive(SCENE_PANTALLAS)) {
            this.scene.stop(SCENE_PANTALLAS);
        }
        
        if (this.scene.isActive(SCENE_DIALOGO)) {
            this.scene.stop(SCENE_DIALOGO);
        }
    }

    change_cursor(cursor) {
        this.cursor.change_cursor(cursor);
    }

    show_background_cursor(active, name) {
        this.cursor.show_background_cursor(active, name);
    }
}

export default SceneManager;