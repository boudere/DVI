import TextoDialogo from "/src/gameObjects/dialogos/texto_dialogo.js";
// import { EVENT_SKIP_TEXTO_DIALOGO } from "../data/events_data";

// cuadro de dialogo principal
class CuadroDialogo extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, type, texto, skip_annimation) {
        super(scene, x, y, type);

        this.texto_finnished = false;
        this.tween_finnish = false;

        // añadir el cuadro de dialogo a la escena
        scene.add.existing(this);

        if (!skip_annimation) {
            this.scaleX = 0;
            this.scaleY = 0;
            this.alpha = 0;

            this.scene_tween = scene.tweens.add({
                targets: this,
                scaleX: 1,
                scaleY: 1,
                alpha: 1,
                duration: 1000,
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
        // this.scene.events.on(EVENT_SKIP_TEXTO_DIALOGO, () => {
        //     if (this.texto_finnished) {
        //         return;
        //     }
        //     skip_annimation = true;
        //     if (this.scene_tween) {
        //         this.scene_tween.stop();
        //         this.scaleX = 1;
        //         this.scaleY = 1;
        //         this.alpha = 1;
        //         if (this.tween_finnish)
        //             return;
        //         this.tween_finnished(scene, x, y, texto, true);
        //     }
        // }, this);
    }

    tween_finnished(scene, x, y, texto, skip_annimation) {
        // añade el texto de dialogo principal
        this.texto_dialogo = new TextoDialogo(scene, this, this.width - 10, x - this.width / 2 + 20, y - this.height / 2 + 20, texto, false, skip_annimation, {});
    }

    actualizar_texto(nuevoTexto) {
        if(this.texto_dialogo)  {
            this.texto_dialogo.destroy();
        }
        setTimeout(() => {
            this.texto_dialogo = new TextoDialogo(this.scene, this, this.width - 10, this.x - this.width / 2 + 20, this.y - this.height / 2 + 20, nuevoTexto, false, false, {});
        }, 10);
    }
}

export default CuadroDialogo;