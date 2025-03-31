import Phaser from 'phaser';

import GameObjectsSprite from '/src/game_objects_sprite';

class DialogoGameObjects extends GameObjectsSprite {
    constructor(scene, x, y, nombre_img, delay) {
        super(scene, x, y, nombre_img, 1, 1);

        this.delauy = delay;
    }

    _reset_varaibles() { super._reset_varaibles(); }

    async start_animation(animation) {
        await this.run_tween(); 
        this.scene.finnish_animation();
    }
    

    run_tween(animation_data) {
        this.scaleX = 0;
        this.scaleY = 0;
        this.alpha = 0;

        return new Promise((resolve) => {
            this.scene.tweens.add({
                targets: this,
                scaleX: 1.2,
                scaleY: 1.2,
                alpha: 1,
                duration: 1000,
                ease: 'Power2',
                onComplete: () => {
                    resolve();
                }
            });
        });
    }

    finish_animation() {}

    // se ejecuta al salir de la escena
    exit() { super.exit(); }

    // se ejecuta al entrar en la escena
    enter() { 
        super.enter(); 
        
        setTimeout(() => {
            this._add_sprite(true);
        }, this.delay);
    }

    // se ejecuta al actualizar la escena
    update() { super.update(); }

    // se ejecuta al pausar la escena
    pause() { super.pause(); }

    // se ejecuta al despausar la escena
    unpause() { super.unpause(); }

    _start_animation() { super._start_animation(); }

    _stop_animation() { super._stop_animation(); }

    _set_events() { super._set_events(); }

    _mouse_enter() { super._mouse_enter(); }

    _mouse_over() { super._mouse_over(); }

    _mouse_out() { super._mouse_out(); }

    _mouse_down() { super._mouse_down(); }

    _mouse_up() { 
        super._mouse_up();

        this.scene.signal_click(this.on_click)
 }

    _mouse_move() { super._mouse_move(); }

    before_destroy() { super.before_destroy(); }
}

export default DialogoGameObjects;