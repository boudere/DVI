import PantallaInicioStartDefault from "/src/minijuegos/pantalla_inicio_start_default";

class PantallaIncioStart extends PantallaInicioStartDefault {
    constructor(scene, x, y) {
        let TEXTURE = 'pantalla_inicio_juego_oveja';
        super(scene, x, y, TEXTURE);
    }
}

export default PantallaIncioStart;
