import { DATA_INFO } from "/src/data/scene_data.js";
class GameObjectsText extends Phaser.GameObjects.Text {
    constructor(scene, x, y, container, container_width, texto_data, delay, animation=false, opciones_entrada = {}) {
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

        this.texto_data = texto_data;
        this.texto_data_index = 0;
        if (texto_data.text) {
            this.texto = texto_data.text;
        } else {
            this.texto = texto_data;
        }
        this.containter = container;
        
        this.setOrigin(0, 0);
        this.setDepth(container.depth + 1); // para que se vea por encima del contenedor
        this.on('destroy', this.before_destroy, this);

        
        this.animation_finished != animation;

        setTimeout(() => {
            this._add_text(animation);
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
    
        this.setText('');
        this.scene.play_sfx('mechanical_keyboard', {loop: true});
    
        const timerEvent = this.scene.time.addEvent({
            delay: 30,
            callback: () => {
                // Si se ha marcado como terminada la animación, mostramos el texto completo
                if (this.animation_finished) {
                    this.setText(texto_completo);
                    this.scene.stop_sfx('mechanical_keyboard');
                    this.containter.finish_animation();
                    timerEvent.remove(); // Detenemos el evento manualmente
                    return;
                }
                if (texto_completo.charAt(i) != '@') {
                    texto_actual += texto_completo.charAt(i);
                    this.setText(texto_actual);
                    i++;
                } else {
                    if (this.texto_data && this.texto_data.types && this.texto_data.values) {
                        let new_texto = this.apply_effects(this.texto_data.types[this.texto_data_index], this.texto_data.values[this.texto_data_index], i);
                        if (new_texto) {
                            texto_completo = new_texto; }
                        this.texto_data_index++;
                    }
                    i += 2;
                }
    
                if (i >= texto_completo.length) {
                    this.texto = texto_completo;
                    this.scene.stop_sfx('mechanical_keyboard');
                    this.containter.finish_animation();
                    timerEvent.remove(); // También detenemos el evento aquí
                }
            },
            loop: true // Usamos loop en lugar de repeat, así tenemos control total
        });
    }

    apply_effects(type, name, index) {}
    

    cambiar_pitch(pitch) {
        let max = 1.5;
        let min = 0.5;
        // suma o resta un valor aleatorio entre -0.05 y 0.05 a la pitch
        pitch += Phaser.Math.FloatBetween(-0.05, 0.05);
        pitch = Phaser.Math.Clamp(pitch, min, max);
        return pitch;
    }
    
    run_tween(animation_data) {}

    finish_animation() {
        this.setText(this.texto);
        this.containter.finish_animation();
    }

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

    skip_animation() {
        this.animation_finished = true;
    }
}

export default GameObjectsText;