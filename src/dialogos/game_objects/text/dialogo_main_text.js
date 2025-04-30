import GameObjectsText from '/src/game_objects_text.js';

class DialogoMainText extends GameObjectsText {
    constructor(scene, x, y, container, container_width, texto, delay, animacion, opciones = {}) {
        super(scene, x, y, container, container_width, texto, delay, animacion, opciones);
    }
}

export default DialogoMainText;