import Phaser from 'phaser';

import GameObjectsSprite from '/src/game_objects_sprite';

class DialogoGameObjects extends GameObjectsSprite {
    constructor(scene, x, y, nombre_img, delay) {
        super(scene, x, y, nombre_img, 1, 1);

        this.delauy = delay;
    }

    _reset_varaibles() { super._reset_varaibles(); }

    finish_animation() {}

    // se ejecuta al salir de la escena
    exit() { 
        this.musica.stop();
        super.exit();
    }

    // se ejecuta al entrar en la escena
    enter() { 
        super.enter(); 
        
        //this.musica.play();

        setTimeout(() => {
            this._add_sprite(this.animation_data);
        }, this.delay);
    }

    // se ejecuta al actualizar la escena
    _update() { super.update(); }

    // se ejecuta al pausar la escena
    pause() { super.pause(); }

    // se ejecuta al despausar la escena
    unpause() { super.unpause(); }

    _start_animation() { super._start_animation(); }

    _stop_animation() { super._stop_animation(); }

    _set_events() { super._set_events(); }

    _remove_events() { super._remove_events(); }

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