import DialogoGameObject from '/src/dialogos/dialogo_game_objects.js';
import DialogoMainText from "/src/dialogos/game_objects/text/dialogo_main_text.js";
import Animation from '/src/utils/animation.js';

class CuadradoDialogo extends DialogoGameObject {
    constructor(scene, x, y, nombre_img, delay, text) {
        super(scene, x, y, nombre_img, delay);

        this.delay = 200;
        this.text = text;

        this.finished_animation = 0;
        this.total_animations = 0;

        this.game_object_data = {
            'alpha': this.alpha,
            'scale': this.scale,
            'pos_x': this.x,
            'pos_y': this.y,
        }

        this.animation_data = {
            "animation_1": [
                {
                    "type": "fade_in", 
                    "duration": 1000
                },
                {
                    "type": "scale_center",
                    "duration": 1000,
                }
            ]
        }
        this.animation = new Animation(this.scene, this.animation_data, 1000);
    }

    finish_animation() {
        if (this.total_animations == 0) {
            this._load_main_text();
            return;
        }

        this.finished_animation++;
        if (this.finished_animation != this.total_animations) { return; }
        this.finished_animation = 0;
        this.scene.finish_animation();
    }

    _load_main_text() {
        let x = this.x - this.width / 2 - 100;
        let y = this.y - this.height / 2;
        this.main_text = new DialogoMainText(this.scene, x, y, this, this.width * 1.2, this.text, this.delay).setOrigin(0, 0).setDepth(1);
        
        this.total_animations++;
    }
}

export default CuadradoDialogo;