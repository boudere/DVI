import Phaser from 'phaser';

class GameObjectsText extends Phaser.GameObjects.Text {
    constructor(scene, x, y, container, container_width, texto, delay, opciones_entrada = {}) {
        // opciones por defecto para el Text
        let opciones_por_defecto = {
            fontSize: "32px",
            fontFamily: "Arial",
            color: "#000000",
            align: "left",
            lineSpacing: 10,
            wordWrap: { width: container_width - 20},
        };

        let opciones = { ...opciones_por_defecto, ...opciones_entrada };

        super(scene, x, y, '', opciones);

        this._reset_varaibles();

        this.texto = texto;
        this.containter = container;
        
        this.setOrigin(0, 0);
        this.setDepth(container.depth + 1);

        this.on('destroy', this.before_destroy, this);

        setTimeout(() => {
            this._add_text(true);
        }, delay);
    }

    _reset_varaibles() {          
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
    
        // Aseguramos que empiece vacío
        this.setText('');
    
        this.scene.time.addEvent({
            delay: 30,
            callback: () => {
                texto_actual += texto_completo.charAt(i);
                this.setText(texto_actual);
                i++;
    
                if (i >= texto_completo.length) {
                    this.containter.finish_animation();
                }
            },
            repeat: texto_completo.length - 1
        });
    }
    
    run_tween(animation_data) {}

    finish_animation() {}

    // se ejecuta al salir de la escena
    exit() { this.visible = false; }

    // se ejecuta al entrar en la escena
    enter() { this.visible = true; }

    // se ejecuta al actualizar la escena
    update() { return !this.isPause; }

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

    _mouse_enter() { return !this.isPause; }

    _mouse_over() {
        if (this.isPause) return false;
        this.mouse_over = true;
        this.setTint(0xdce8ff);
        return true;
    }

    _mouse_out() {
        if (this.isPause) return false;
        this.mouse_over = false;
        this.clearTint();
        return true;
    }

    _mouse_down() { return !this.isPause; }

    _mouse_up() { return !this.isPause; }

    _mouse_move() { return !this.isPause; }

    before_destroy() {}
}

export default GameObjectsText;