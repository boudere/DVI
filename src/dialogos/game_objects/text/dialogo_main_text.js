import GameObjectsText from '/src/game_objects_text.js';

class DialogoMainText extends GameObjectsText {
    constructor(scene, x, y, container, container_width, texto, delay, opciones = {}) {
        super(scene, x, y, container, container_width, texto, delay, opciones);
    }
}

export default DialogoMainText;