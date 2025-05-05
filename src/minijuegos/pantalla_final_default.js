import PantallaDefault from "/src/minijuegos/pantalla_default";
import PantallaRanking from "/src/minijuegos/pantallas/final/ranking/ranking";
class PantallaFinalDefault extends PantallaDefault {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);

        this.next_scene = new PantallaRanking(scene, x, y);
    }

    action() {
        this.scene.finnish_game();

        super.action();
    }
}

export default PantallaFinalDefault;
