import PantallaInicioDefault from "/src/minijuegos/pantalla_inicio_default";
import FloortPantalla3 from "/src/minijuegos/juego_oveja/pantallas/pantalla_3/floor.js";
import OvejaPantalla3 from "/src/minijuegos/juego_oveja/pantallas/pantalla_3/oveja.js";
import VallaPantalla3 from "/src/minijuegos/juego_oveja/pantallas/pantalla_3/valla.js";

import { DATA_INFO, MINIJUEGO_MANAGER } from "/src/data/scene_data.js";

class PantallaIncio extends PantallaInicioDefault {
    constructor(scene, x, y) {
        let TEXTURE = 'pantalla_inicio_juego_oveja';
        super(scene, x, y, TEXTURE);

        let width = this.displayWidth;
        let height = this.displayHeight;

        let floor_img = scene.scene.get(DATA_INFO).get_img(MINIJUEGO_MANAGER, 'none');
        this.floor = new FloortPantalla3(scene, width * 0.5, height * 0.85, floor_img, 100, 2);

        this.oveja = new OvejaPantalla3(scene, width * 1.1, height * 0.72, 1.5);
        this.valla = new VallaPantalla3(scene, width * 0.35, height * 0.75, 1.5);

        this.create_text(width, height);

        this.total_components = 2;
        this.animacion_complete_number = 0;
    }

    create_text(width, height) {
        this.contadorTexto = this.scene.add.text(
            width * 0.5, height * 0.5,
            `GAME OVER`,
            {
                fontSize: '160px',
                fill: '#ff0000',
                fontFamily: 'Impact'
            }).setOrigin(0.5, 0.5).setDepth(1);
        this.contadorTexto.setVisible(false);
    }

    enter() {
        super.enter();

        this.scene.physics.add.collider(this.oveja, this.floor);
        this.scene.physics.add.collider(this.oveja, this.valla, (oveja, valla) => {
            oveja.choque();
        });
        this.oveja.enter();
        this.valla.enter();
    }

    _before_destroy() {
        super._before_destroy();

        this.oveja.exit();
        this.valla.exit();
        this.floor.destroy();
    }

    _update(time, delta) {
        super._update(time, delta);

        if (this.oveja) this.oveja._update(time, delta);
    }
    
    animacion_complete() {
        this.animacion_complete_number++;
        if (this.animacion_complete_number >= this.total_components) {
            this.animacion_complete_number = 0;

            this.valla.visible = true;
            this.contadorTexto.setVisible(false);
            this.oveja.reset_animation();
            let new_background = this.scene.scene.get(DATA_INFO).get_img(MINIJUEGO_MANAGER, 'pantalla_inicio_juego_oveja');
            this.setTexture(new_background);


        } else {
            this.valla.visible = false;
            this.oveja.visible = false;
            this.contadorTexto.setVisible(true);
            let new_background = this.scene.scene.get(DATA_INFO).get_img(MINIJUEGO_MANAGER, 'black_juego_oveja');
            this.setTexture(new_background);
            
            setTimeout(() => {
                this.scene.pantalla_inicio_animation_complete();
            }, 2000);
        }
    }
}

export default PantallaIncio;
