import DialogoGameObjectsText from "/src/dialogos/dialogo_game_objects_text";

class DialogoMainText extends DialogoGameObjectsText {
    constructor(scene, x, y, container, container_width, texto, delay, animacion, opciones = {}) {
        super(scene, x, y, container, container_width, texto, delay, animacion, opciones);
    }
}

export default DialogoMainText;