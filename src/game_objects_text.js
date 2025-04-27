import { DATA_INFO } from "/src/data/scene_data.js";
class GameObjectsText extends Phaser.GameObjects.Text {
    constructor(scene, x, y, container, container_width, texto, delay, opciones_entrada = {}) {
        // opciones por defecto para el Text
        let opciones_por_defecto = {
            fontSize: "32px",
            fontFamily: "Times New Roman",
            color: "#000000",
            align: "left",
            lineSpacing: 10,
            wordWrap: { width: container_width - 20},
        };

        // sobre escribimos las opciones por defecto con las opciones de entrada (si hay)
        let opciones = { ...opciones_por_defecto, ...opciones_entrada };

        super(scene, x, y, '', opciones);

        this._reset_variables();

        this.texto = texto;
        this.containter = container;
        
        this.setOrigin(0, 0);
        this.setDepth(container.depth + 1); // para que se vea por encima del contenedor
        this.on('destroy', this.before_destroy, this);

        setTimeout(() => {
            this._add_text(true);
        }, delay);
    }

    _reset_variables() {          
        this.isPause = false;
    }

    _add_text(animation) {
        this.scene.add.existing(this);

        if (animation) {
            this.start_animation();
        } else {
            this.finish_animation();
        }
    }

    start_animation() {
        let i = 0;
        let texto_completo = this.texto;
        let texto_actual = '';
    
        // aseguramos que empiece vacío
        this.setText('');
        let rate = 1.5;
        this.scene.play_sfx('mechanical_keyboard');
    
        this.scene.time.addEvent({
            delay: 30,
            callback: () => {
                texto_actual += texto_completo.charAt(i);
                rate = this.cambiar_pitch(rate);
                this.setText(texto_actual);
                i++;
    
                if (i >= texto_completo.length) {
                    this.scene.stop_sfx('mechanical_keyboard');
                    this.containter.finish_animation();
                }
            },
            repeat: texto_completo.length - 1
        });
    }

    cambiar_pitch(pitch) {
        let max = 1.5;
        let min = 0.5;
        // suma o resta un valor aleatorio entre -0.05 y 0.05 a la pitch
        pitch += Phaser.Math.FloatBetween(-0.05, 0.05);
        pitch = Phaser.Math.Clamp(pitch, min, max);
        return pitch;
    }
    
    run_tween(animation_data) {}

    finish_animation() {}

    // se ejecuta al salir de la escena
    exit() { this.visible = false; }

    // se ejecuta al entrar en la escena
    enter() { this.visible = true; }

    // se ejecuta al actualizar la escena
    _update() { return !this.isPause; }

    // se ejecuta al pausar la escena
    pause() {
        if (this.mouse_over) {
            this._mouse_out();
        }
        this.disableInteractive();
    }

    // se ejecuta al despausar la escena
    unpause() {
        this.setInteractive();
    }

    _start_animation() {this.scene.start_animation();}

    _stop_animation() {}

    _set_events() {}

    before_destroy() {}
}

export default GameObjectsText;