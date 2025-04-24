import PantallaDefault from "/src/minijuegos/pantalla_default";

class PantallaInicioDefault extends PantallaDefault {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
    }
    
    action() {
        this.scene.start_game();
    }
}

export default PantallaInicioDefault;
