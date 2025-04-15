
import Animation from "/src/utils/animation.js";
import GameObjectsSprite from '/src/game_objects_sprite';

class PantallaGameObjects extends GameObjectsSprite {
    constructor(scene, x, y, nombre_img, size_x, size_y, delay, animation, on_click, nombre) {
        super(scene, x, y, nombre_img, size_x, size_y, on_click);

        this.game_object_data = {
            "alpha" : this.alpha,
            "scaleX" : this.scaleX,
            "scaleY" : this.scaleY,
            "pos_x" : this.x,
            "pos_y" : this.y
        };

        this.delay = delay;
        this.anitmation_info = animation;

        if (animation) {
            this.animation = new Animation(scene);
        }

        this.nombre = nombre;
    }

    _reset_varaibles() {        
        super._reset_varaibles();  

        this.nombre = "";
        this.on_click = null;
        
        this.animation = null;
    }

    finish_animation() {
        this.scene.finish_animation();
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

export default PantallaGameObjects;