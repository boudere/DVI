import DialogoGameObject from '/src/dialogos/dialogo_game_objects.js';
import Animation from '/src/utils/animation.js';

class DialogoPersonaje extends DialogoGameObject {
    constructor(scene, x, y, nombre_img, delay) {
        super(scene, x, y, nombre_img, delay);

        this.finished_animation = 0;
        this.total_animations = 0;
        this.animation_finished = false;

        this.game_object_data = {
            'alpha': this.alpha,
            "scaleX" : this.scaleX,
            "scaleY" : this.scaleY,
            'pos_x': this.x,
            'pos_y': this.y,
        }

        // animacion del personaje al aparecer
        this.animation_data = {
            "animation_1": [
                {
                    "type": "fade_in", 
                    "duration": 1000
                },
                {
                    "type": "move_right",
                    "duration": 1000,
                    "var": {
                        "pos_x": 500
                    }
                }
            ]
        }
        
        this.animation = new Animation(this.scene, this.animation_data, 1000);
        this.total_animations++;
    }

    finish_animation() {
        this.finished_animation++;

        if (this.finished_animation != this.total_animations) { return; }
        this.finished_animation = 0;
        this.scene.finish_animation();
    }

    change_personaje(nombre_img) {
        this.setTexture(nombre_img);
    }
}

export default DialogoPersonaje;