import PantallaInicioDefault from "/src/minijuegos/pantalla_inicio_default";
import PantallaInicio from "/src/minijuegos/juego_oveja/pantallas/pantalla_2/pantalla_inicio.js";

import MousePantalla1 from "/src/minijuegos/juego_oveja/pantallas/pantalla_1/mouse.js";
import OvejaPantalla1 from "/src/minijuegos/juego_oveja/pantallas/pantalla_1/oveja.js";
import FloortPantalla1 from "/src/minijuegos/juego_oveja/pantallas/pantalla_1/floor.js";

import { DATA_INFO, MINIJUEGO_MANAGER } from "/src/data/scene_data.js";

class PantallaIncio extends PantallaInicioDefault {
    constructor(scene, x, y) {
        let TEXTURE = 'pantalla_inicio_juego_oveja';
        super(scene, x, y, TEXTURE);

        this.next_scene = new PantallaInicio(scene, x, y);

        let width = this.displayWidth;
        let height = this.displayHeight;

        this.mouse = new MousePantalla1(scene, width * 0.35, height * 0.5, 2);
        this.oveja = new OvejaPantalla1(scene, width * 0.65, height * 0.63, 1.5);
        
        let floor_img = scene.scene.get(DATA_INFO).get_img(MINIJUEGO_MANAGER, 'none');
        this.floor = new FloortPantalla1(scene, width * 0.65, height * 0.75, floor_img, 10, 2);

        this.setDepth(0);

        this.total_components = 2;
        this.animacion_complete_number = 0;
    }

    create() {
        super.create();
    }

    enter() {
        super.enter();
        this.scene.physics.add.collider(this.oveja, this.floor);

        this.mouse.enter();
        this.oveja.enter();
    }

    _before_destroy() {
        super._before_destroy();

        this.mouse.exit();
        this.oveja.exit();
        this.floor.destroy();
    }

    _update(time, delta) {
        super._update(time, delta);

        this.mouse._update(time, delta);
        this.oveja._update(time, delta);
    }

    animacion_complete() {
        this.animacion_complete_number++;
        if (this.animacion_complete_number >= this.total_components) {
            this.animacion_complete_number = 0;

            this.mouse.animation_complete = false;
        }
    }
}

export default PantallaIncio;
