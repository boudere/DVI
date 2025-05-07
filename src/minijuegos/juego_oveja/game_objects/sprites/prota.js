import GamesGameObjects from "/src/minijuegos/games_game_objects.js";
import { MINIJUEGO_MANAGER } from "/src/data/scene_data.js";

class Prota extends GamesGameObjects {
    constructor(scene, x, y) {
        let PROTA_IMG = 'prota1';

        super(scene, x, y, PROTA_IMG);

        this.PROTA_IMG = PROTA_IMG;
        this.PROTA_IMG_2 = 'prota2';
        
        this.body.setAllowGravity(false);
        this.puntuacion = 0;

    }

    oveja_contada(nueva_puntuacion) {
        let img = this.scene.data_info_scene.get_img(MINIJUEGO_MANAGER, this.PROTA_IMG_2);
        this.setTexture(img);
        this.puntuacion = nueva_puntuacion;
        this.add_text();

        setTimeout(() => {
            if (nueva_puntuacion != this.puntuacion) return;
            img = this.scene.data_info_scene.get_img(MINIJUEGO_MANAGER, this.PROTA_IMG);
            this.setTexture(img);
            this.destroy_text();
        }, 400);
    }

    add_text() {
        let x = this.x + 28;
        if (this.puntuacion > 10) {
            x = this.x + 25;
        } else if (this.puntuacion > 100) {
            x = this.x + 20;
        }
        this.texto = this.scene.add.text(x, this.y - 80, `${this.puntuacion}`, {
            fontSize: '32px',
            fill: '#000000',
            fontFamily: 'Impact'
        }).setOrigin(0.5, 0.5);
        this.texto.setDepth(1);
    }

    destroy_text() {
        if (this.texto) {
            this.texto.destroy();
        }
    }

    enter() {
        super.enter();
    }
    exit() {
        if (this.texto) {
            this.texto.destroy();
        }

        super.exit();
    }

    _update(time, delta) {
        super._update(time, delta);
    }

    _set_event(event) {
    }

    _remove_event(event) {
    }

    _set_colliders(size_x = 0.8, size_y = 0.8) {}
}

export default Prota;
