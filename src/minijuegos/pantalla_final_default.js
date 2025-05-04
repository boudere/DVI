import PantallaDefault from "/src/minijuegos/pantalla_default";
class PantallaFinalDefault extends PantallaDefault {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
    }

    action() {
        this.scene.finnish_game();
    }
}

export default PantallaFinalDefault;
