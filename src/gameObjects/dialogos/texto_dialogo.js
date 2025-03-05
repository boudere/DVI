import { EVENT_TEXTO_DIALOGO, EVENT_SKIP_TEXTO_DIALOGO } from "/src/data/events_data.ts";

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

        this.scene.events.on(EVENT_SKIP_TEXTO_DIALOGO, this.stop_animation, this);

        this.parent = parent;
        this.playing_animation = true;

        // ajustar el origen (centrado)
        this.setOrigin(0, 0);

        // en caso de ser un botón, centrar el texto
        if (botones) {
            let texto_final = scene.add.text(this.x, this.y, texto, opcionesPorDefecto);
            
            this.x -= texto_final.width / 2;
            texto_final.destroy();
        }

        // agregar el objeto a la escena
        scene.add.existing(this);

        // mostrar el texto con animación
        if (!skip_annimation) {
            this.actualizar_texto(texto);
        }
        else {
            this.setText(texto);
            this.scene.events.emit(EVENT_TEXTO_DIALOGO);
        }
    }

    // método para actualizar el texto con animación
    actualizar_texto(nuevoTexto) {
        this.setText("");
        this.parent.texto_finnished = false;
        this.animacion_texto(nuevoTexto);
    }

    stop_animation() {
        this.playing_animation = false;
    }

    // método para animar el texto tipo máquina de escribir con colores aleatorios
    animacion_texto(texto) {
        let i = 0;
        let texto_animado = "";
        let texto_completo = texto;


        setTimeout(() => {
            let intervalo = setInterval(() => {
                if (!this.playing_animation) {
                    clearInterval(intervalo);
                    this.setText(texto);

                    this.playing_animation = true;
                    this.parent.texto_finnished = true;
                    this.scene.events.emit(EVENT_TEXTO_DIALOGO);
                    return;
                }
                texto_animado += texto_completo[i];
                this.setText(texto_animado);
                i++;
                if (i === texto_completo.length) {
                    clearInterval(intervalo);

                    this.parent.texto_finnished = true;
                    this.scene.events.emit(EVENT_TEXTO_DIALOGO);
                }
            }, 50);
        }, 100);
    }
}

export default TextoDialogo;
