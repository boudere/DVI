import { SCENE_PLAY, SCENE_MANAGER, SCENE_PANTALLAS, SCENE_DIALOGO } from '/src/data/scene_data.ts';
import { EVENT_DATOS_CARAGDOS, EVENT_START_DIALOGO } from "/src/data/events_data.ts";

import AssetsData from '/src/data/assets_data.js';

// esta escena de momento solo lanza la escena de dialogo
class ScenePlay extends Phaser.Scene {
    constructor() {
        super({ key: SCENE_PLAY });
        this.assets_data = new AssetsData(this);
    }

    preload() {
        // Cargar datos y esperar a que se emita la señal EVENT_DATOS_CARAGDOS
        this.assets_data.cargar_datos();

        this.events.once(EVENT_DATOS_CARAGDOS, () => {
            this.assets_data.cargar_dialogos();
            this.assets_data.cargar_pantallas();
        });

        this.scene.get(SCENE_PANTALLAS).events.on(EVENT_START_DIALOGO, this.start_dialogo, this);
    }

    create() {
        this.scene.launch(SCENE_MANAGER);
        // lanzamos la escena de dialogo, pero scene_play sigue activa
        // this.scene.launch(SCENE_DIALOGO, "dialogo_1");
        this.pantallas = this.scene.start(SCENE_PANTALLAS, "demo_habitacion_1");
    }

    start_dialogo(dialogo) {
        this.scene.launch(SCENE_DIALOGO, dialogo);
    }
}

export default ScenePlay;
