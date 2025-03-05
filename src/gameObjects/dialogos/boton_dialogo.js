import TextoDialogo from "/src/gameObjects/dialogos/texto_dialogo.js";
import { EVENT_SKIP_TEXTO_DIALOGO, EVENT_NEXT_TEXTO_DIALOGO } from "/src/data/events_data.ts";
import { SCENE_MANAGER } from '/src/data/scene_data.ts';

// Es el botón que se muestra en el diálogo
class BotonDialogo extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, type, name, texto, skip_annimation) {
        super(scene, x, y, type);

        this.texto_finnished = false;
        this.tween_finnish = false;
        this.can_be_clicked = false;

        // lo hacemos interactuable
        this.setInteractive();

        // cambia el origen al centro a la derecha
        this.setOrigin(0, 0.5);

        // añade los eventos al botón
        this.set_event(name);

        // agregamos el botón a la escena dialogo
        scene.add.existing(this);

        this.x = x - this.width;

        // animación de entrada
        if (!skip_annimation) {
            this.scaleX = 0;
            this.alpha = 0;

            this.scene_tween = scene.tweens.add({
                targets: this,
                scaleX: 1,
                alpha: 1,
                duration: 200,
                ease: 'Power2',
                onComplete: () => {
                    this.tween_finnish = true;
                    this.tween_finnished(scene, x, y, texto, skip_annimation);
                }
            });
        } else {
            this.tween_finnished(scene, x, y, texto, skip_annimation);
        }

        // Evento para detener la animación
        this.scene.events.on(EVENT_SKIP_TEXTO_DIALOGO, () => {
            if (this.texto_finnished) {
                return;
            }
            skip_annimation = true;
            if (this.scene_tween) {
                this.scene_tween.stop();
                this.scaleX = 1;
                this.alpha = 1;
                if (this.tween_finnish)
                    return;
                this.tween_finnished(scene, x, y, texto, true);
            }
        }, this);

        // cuadno se elimina el boton
        this.on('destroy', this.beforeDestroy, this);
    }

    // al terminar la animación
    tween_finnished(scene, x, y, texto, skip_annimation) {
        this.setOrigin(1, 0.5);
        this.x = this.x + this.width;
        
        // agragamos el texto al botón y lo centramos (izquierda, centro)
        this.texto = new TextoDialogo(scene, this, this.width - 10, x - this.width / 2, y, texto, true, skip_annimation, {}).setOrigin(0, 0.5);
    }
    

    // añade los eventos al botón
    set_event(name) {

        // al ser clicado
        this.once("pointerdown", () => {
            if (!this.can_be_clicked)
                return;
            this.scene.events.emit(EVENT_NEXT_TEXTO_DIALOGO, name);
        });

        // al pasar el ratón por encima
        this.on("pointerover", () => {
            if (!this.can_be_clicked)
                return;
            this.setTint(0x787878);

            let scene_manager = this.scene.scene.get(SCENE_MANAGER);
            scene_manager.change_cursor("selected");
        });

        // al sacar el raton del boton
        this.on("pointerout", () => {
            this.clearTint();

            let scene_manager = this.scene.scene.get(SCENE_MANAGER);
            scene_manager.change_cursor("normal");
        });
    }

    actualizar_texto(texto) {
        this.texto.actualizar_texto(texto);
    }

    stop_animation() {
        this.texto.stop_animation();
    }

    // Función que se ejecuta antes de destruirse
    beforeDestroy() {
        this.texto.destroy();
    }
}

export default BotonDialogo;