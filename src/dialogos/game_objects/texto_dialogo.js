import Phaser from "phaser";

class TextoDialogo extends Phaser.GameObjects.Text {
    constructor(scene, parent, cuadro_dialogo_width, x, y, texto, botones, skip_annimation, opciones = {}) {

        // opciones por defecto para el Text
        let opcionesPorDefecto = {
            fontSize: "32px",
            fontFamily: "Arial",
            color: "#000000",
            align: "left",
            lineSpacing: 10,
            wordWrap: { width: cuadro_dialogo_width - 20 },
        };

        // mezclar opciones personalizadas con las predeterminadas
        opciones = { ...opcionesPorDefecto, ...opciones };

        // llamar al constructor de Text
        super(scene, x, y, "", opciones);
    }
}

export default TextoDialogo;
