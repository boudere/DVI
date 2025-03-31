import Phaser from 'phaser';

import PantallaAnimation from "/src/pantallas/utils/pantalla_animation.js";
import GameObjectsSprite from '/src/game_objects_sprite';

class PantallaGameObjects extends GameObjectsSprite {
    constructor(scene, x, y, nombre_img, size_x, size_y, delay, animation, on_click, nombre) {
        super(scene, x, y, nombre_img, size_x, size_y);

        this.game_object_data = {
            "alpha" : this.alpha,
            "scale" : this.scale,
            "pos_x" : this.x,
            "pos_y" : this.y
        };

        this.delay = delay;
        this.anitmation_info = animation;

        //  si se puede hacer click en el objeto agregamos los eventos
        if (on_click) {
            this._set_events();
            this.on_click = on_click;
        }

        if (animation) {
            this.animation = new PantallaAnimation(scene);
        }

        this.nombre = nombre;
    }

    _reset_varaibles() {        
        super._reset_varaibles();  

        this.nombre = "";
        this.on_click = null;
        
        this.animation = null;
    }

    async start_animation(animation) {
        
        let animation_data = this.animation.get_animation_data(animation, this.game_object_data);
    
        for (const [key, value] of Object.entries(animation_data)) {
            const animation_tweens = value.map((val) => this.run_tween(val));
    
            await Promise.all(animation_tweens); // espera a que todos terminen antes de pasar al siguiente grupo
        }

        this.finish_animation();
    }
    

    run_tween(animation_data) {
        this.alpha = animation_data.alpha_start;
        this.scale = animation_data.scale_start;
        this.x = animation_data.pos_x_start;
        this.y = animation_data.pos_y_start;

        return new Promise((resolve) => {
            this.scene.tweens.add({
                targets: this,
                duration: animation_data.duration,
                alpha: animation_data.alpha_end,
                scale: animation_data.scale_end,
                x: animation_data.pos_x_end,
                y: animation_data.pos_y_end,
                ease: 'Power2',
                onComplete: () => {
                    resolve()
                }
            });
        });
    }

    finish_animation() {
        this.scene.finnish_animation();
    }

    // se ejecuta al salir de la escena
    exit() { super.exit(); }

    // se ejecuta al entrar en la escena
    enter() { 
        super.enter(); 
    
        setTimeout(() => {
            this._add_sprite(this.anitmation_info);
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

export default PantallaGameObjects;