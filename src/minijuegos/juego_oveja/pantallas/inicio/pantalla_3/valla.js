import GamesGameObjects from "/src/minijuegos/games_game_objects.js";
import Valla from "/src/minijuegos/juego_oveja/game_objects/sprites/valla";

class VallaPantalla3 extends Valla {
    constructor(scene, x, y) {
        super(scene, x, y);

        this.setDepth(2);
        this.setImmovable(true);
    }
}

export default VallaPantalla3;