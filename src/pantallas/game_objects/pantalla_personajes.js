import PantallaGameObjects from '/src/pantallas/pantalla_game_objects.js';

class PantallaPersoanjes extends PantallaGameObjects {
    constructor(scene, x, y, nombre_img, size, delay, animation, on_click, nombre) {
        super(scene, x, y, nombre_img, size, size, delay, animation, on_click, nombre);
    }
}

export default PantallaPersoanjes;