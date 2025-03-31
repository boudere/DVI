import Phaser from 'phaser';

class GameObjectsSprite extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, nombre_img, size_x, size_y) {
        super(scene, x, y, nombre_img);
        this._reset_varaibles();

        this.setScale(size_x, size_y);

        this.on('destroy', this.before_destroy, this);
    }

    _reset_varaibles() {          
        this.isPause = false;
        this.mouse_over = false;
        
        this.game_object_data =  {}
    }

    _add_sprite(animation) {
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

export default GameObjectsSprite;