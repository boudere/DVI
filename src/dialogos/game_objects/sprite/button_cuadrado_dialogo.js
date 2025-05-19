import DialogoGameObject from '/src/dialogos/dialogo_game_objects.js';
import DialogoMainText from "/src/dialogos/game_objects/text/dialogo_main_text.js";
import Animation from '/src/utils/animation.js';

class ButtonCuadradoDialogo extends DialogoGameObject {
    constructor(scene, x, y, nombre_img, text_data, next_text, animation, var_id) {
        super(scene, x, y, nombre_img, 200);

        this.setOrigin(1, 1);

        this.SCALE = 1.2;

        this.text = text_data;
        this.next_text = next_text;

        this.finished_animation = 0;
        this.total_animations = 0;
        this.animation_finished = false;

        this.game_object_data = {
            'alpha': this.alpha,
            'scale': this.scale,
            'pos_x': this.x,
            'pos_y': this.y,
        }

        this.on_click = {
            "scene": "dialogo",
            "name": this.next_text,
            "var_id": var_id
        }

        // animacion del boton al aparecer
        if (animation) {
            this.animation_data = {
                "animation_1": [
                    {
                        "type": "fade_in", 
                        "duration": 200
                    },
                    {
                        "type": "scale_up",
                        "duration": 200,
                        "var": {
                            "scaleX": this.SCALE,
                            "scaleY": this.SCALE
                        }
                    }
                ]
            }

            this.animation = new Animation(this.scene, this.animation_data, 1000);
        } else {
            this.setScale(this.SCALE);
        }
    }

    finish_animation() {
        if (this.total_animations == 0) {
            this._load_main_text();
            return;
        }
        this.finished_animation++;

        if (this.finished_animation != this.total_animations) { return; }
        this.finished_animation = 0;
        this.animation_finished = true;

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

        let x = this.x - this.width / 2 - 100;
        let y = this.y - this.height / 2;
        this.main_text = new DialogoMainText(this.scene, x - this.width / 2, y - this.height / 3, this, this.width * this.SCALE, this.text, this.delay, !this.animation_finished, {fontSize: "32px",}).setOrigin(0, 0)
        
        this.total_animations++;
    }

    before_destroy() {
        super.before_destroy();
        if (this.main_text) this.main_text.destroy();
    }

    pause() {
        super.pause();

        this._remove_events() 
    }

    unpause() {
        super.unpause();

        this._set_events()
    }

    _mouse_up() {
        super._mouse_up();
    }
}

export default ButtonCuadradoDialogo;