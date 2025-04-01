import Phaser from 'phaser';

class GameObjectsText extends Phaser.GameObjects.Text {
    constructor(scene, x, y, container_width, texto, delay, opciones_entrada = {}) {
        // opciones por defecto para el Text
        let opciones_por_defecto = {
            fontSize: "32px",
            fontFamily: "Arial",
            color: "#000000",
            align: "left",
            lineSpacing: 10,
            wordWrap: { width: container_width - 20 },
        };

        let opciones = { ...opciones_por_defecto, ...opciones_entrada };

        super(scene, x, y, texto, opciones);
        this._reset_varaibles();

        this.on('destroy', this.before_destroy, this);

        setTimeout(() => {
            this._add_text();
        }, delay);
    }

    _reset_varaibles() {          
        this.isPause = false;
    }

    _add_text(animation) {
        this.scene.add.existing(this);

        if (animation) {
            this.start_animation(animation);
        } else {
            this.finish_animation();
        }
    }

    async start_animation(animation) {}
    
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

    _start_animation() {}

    _stop_animation() {}

    _set_events() {
        this.on('pointerenter', this._mouse_enter, this);
        this.on('pointerover', this._mouse_over, this);
        this.on('pointerout', this._mouse_out, this);
        this.on('pointerupoutside', this._mouse_out, this);
        this.on('pointerdown', this._mouse_down, this);
        this.on('pointerup', this._mouse_up, this);
        this.on('pointermove', this._mouse_move, this);
    }

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