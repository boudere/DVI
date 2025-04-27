import DialogoGameObject from '/src/dialogos/dialogo_game_objects.js';
import DialogoMainText from "/src/dialogos/game_objects/text/dialogo_main_text.js";
import Animation from '/src/utils/animation.js';

class CuadradoDialogo extends DialogoGameObject {
    constructor(scene, x, y, nombre_img, text, animation) {
        super(scene, x, y, nombre_img, 200);

        this.SCALE = 1.2;

        this.text = text;

        this.finished_animation = 0;
        this.total_animations = 0;

        this.game_object_data = {
            'alpha': this.alpha,
            'scale': this.scale,
            'pos_x': this.x,
            'pos_y': this.y,
        }

        // animacion del cuadrado de dialogos al aparecer
        if (animation) {
            this.animation_data = {
                "animation_1": [
                    {
                        "type": "fade_in", 
                        "duration": 400
                    },
                    {
                        "type": "scale_center",
                        "duration": 400,
                        "var": {
                            "scale": this.SCALE
                        }
                    }
                ]
            }

            this.animation = new Animation(this.scene, this.animation_data, 1000);
        } else {
            this.setScale(SCALE);
        }
    }

    create() {
        this.on('destroy', this.before_destroy, this);
    }

    finish_animation() {
        if (this.total_animations == 0) {
            this._load_main_text();
            return;
        }

        this.finished_animation++;
        if (this.finished_animation != this.total_animations) { return; }
        this.scene.finish_animation();
    }

    setText(text) {
        this.total_animations = 0;
        this.finished_animation = 0;

        this.text = text;
        this._load_main_text();
    }

    _load_main_text() {
        if (this.main_text) {
            this.main_text.destroy();
        }
        let x = this.x - this.width / 2 - 110;
         let y = this.y - this.height / 2 + 25;
        this.main_text = new DialogoMainText(this.scene, x, y, this, this.width * 1.2, this.text, this.delay).setOrigin(0, 0)
        
        this.total_animations++;
    }

    before_destroy() {
        if (this.main_text) this.main_text.destroy();
        super.before_destroy();
    }
}

export default CuadradoDialogo;