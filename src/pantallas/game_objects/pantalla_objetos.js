import PantallaGameObjects from '/src/pantallas/pantalla_game_objects.js';

class PantallaObjetos extends PantallaGameObjects {
    constructor(scene, x, y, nombre_img, on_click, nombre) {
        super(scene, x, y, nombre_img, 1, 1, 0, null, on_click, nombre);
    }
}

export default PantallaObjetos;