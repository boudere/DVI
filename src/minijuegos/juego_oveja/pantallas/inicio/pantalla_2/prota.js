import GamesGameObjects from "/src/minijuegos/games_game_objects.js";
import Prota from "/src/minijuegos/juego_oveja/game_objects/sprites/prota.js";
import { MINIJUEGO_MANAGER } from "/src/data/scene_data.js";

class ProtaPantalla2 extends Prota {
    constructor(scene, x, y, scale) {
        super(scene, x, y);

        this.setDepth(1);
        this.setScale(scale);
        this.setOrigin(0.5, 0.5);
    }

    add_text() {
        let x = this.x + 28;
        if (this.puntuacion > 10) {
            x = this.x + 25;
        } else if (this.puntuacion > 100) {
            x = this.x + 20;
        }
        this.texto = this.scene.add.text(x, this.y - 100, `${this.puntuacion}`, {
            fontSize: '38px',
            fill: '#000000',
            fontFamily: 'Impact'
        }).setOrigin(0.5, 0.5);
        this.texto.setDepth(1);
    }
}

export default ProtaPantalla2;
