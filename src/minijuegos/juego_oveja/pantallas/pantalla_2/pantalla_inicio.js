import PantallaInicioDefault from "/src/minijuegos/pantalla_inicio_default";
import PantallaInicio from "/src/minijuegos/juego_oveja/pantallas/pantalla_3/pantalla_inicio.js";
import FloortPantalla2 from "/src/minijuegos/juego_oveja/pantallas/pantalla_2/floor.js";
import OvejaPantalla2 from "/src/minijuegos/juego_oveja/pantallas/pantalla_2/oveja.js";
import VallaPantalla2 from "/src/minijuegos/juego_oveja/pantallas/pantalla_2/valla.js";
import ProtaPantalla2 from "/src/minijuegos/juego_oveja/pantallas/pantalla_2/prota.js";

import { DATA_INFO, MINIJUEGO_MANAGER } from "/src/data/scene_data.js";

class PantallaIncio extends PantallaInicioDefault {
    constructor(scene, x, y) {
        let TEXTURE = 'pantalla_inicio_juego_oveja';
        super(scene, x, y, TEXTURE);

        let width = this.displayWidth;
        let height = this.displayHeight;

        this.next_scene = new PantallaInicio(scene, x, y);

        let floor_img = scene.scene.get(DATA_INFO).get_img(MINIJUEGO_MANAGER, 'none');
        this.floor = new FloortPantalla2(scene, width * 0.5, height * 0.85, floor_img, 100, 2);

        this.oveja = new OvejaPantalla2(scene, width * 1.1, height * 0.72, 1.5);
        this.valla = new VallaPantalla2(scene, width * 0.35, height * 0.75, 1.5);
        this.prota = new ProtaPantalla2(scene, width * 0.37, height * 0.6, 1.2);

        this.total_components = 2;
        this.animacion_complete_number = 0;
        this.ovejas_contadas = 0;
        this.oveja_contada = false;
    }

    enter() {
        super.enter();

        this.scene.physics.add.collider(this.oveja, this.floor);

        this.oveja.enter();
        this.valla.enter();
        this.prota.enter();
    }

    _before_destroy() {
        super._before_destroy();

        this.oveja.exit();
        this.valla.exit();
        this.prota.exit();
        this.floor.destroy();
    }

    _update(time, delta) {
        super._update(time, delta);

        if (!this.oveja_contada && this.oveja.x < this.valla.x - this.valla.displayWidth * 0.5) {
            this.ovejas_contadas++;
            this.prota.oveja_contada(this.ovejas_contadas);
            this.oveja_contada = true;
        }

        this.oveja._update(time, delta);
    }
    
}

export default PantallaIncio;
