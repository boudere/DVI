// ------------------------------------------------------------- //
//   esta función se encarga de cargar los datos de los assets   //
// ------------------------------------------------------------- //
class AnimationData {
    constructor(data) {
        this.animation_data = {};

        this.TYPE = "type";

        this.FADE_IN = "fade_in";
        this.FADE_OUT = "fade_out";

        this.DURATION = "duration";

        this.ALPHA = "alpha";
        this.ALPHA_ORIGINAL = "alpha_original";

        this.SCALE = "scale";
        this.SCALE_ORIGINAL = "scale_original";

        this.POS_X = "pos_x";
        this.POS_X_ORIGINAL = "pos_x_original";

        this.POS_Y = "pos_y";
        this.POS_Y_ORIGINAL = "pos_y_original";

        this.set_data(data);
    }

    set_data(data) {
        this.animation_data[this.DURATION] = data[this.DURATION];

        this.animation_data[this.ALPHA] = data[this.ALPHA];
        this.animation_data[this.ALPHA_ORIGINAL] = data[this.ALPHA];

        this.animation_data[this.SCALE] = data[this.SCALE];
        this.animation_data[this.SCALE_ORIGINAL] = data[this.SCALE];

        this.animation_data[this.POS_X] = data[this.POS_X];
        this.animation_data[this.POS_X_ORIGINAL] = data[this.POS_X];

        this.animation_data[this.POS_Y] = data[this.POS_Y];
        this.animation_data[this.POS_Y_ORIGINAL] = data[this.POS_Y];
    }

    get_animation_data(animation) {
        switch (animation[this.TYPE]) {
            case this.FADE_IN:
                this.fade_in(animation);
                break;
            case this.FADE_OUT:
                this.fade_out(animation);
                break;
            default:
                console.error("Tipo de animación no encontrado");
        }
        return this.animation_data;
    }

    fade_in(animation) {
        this.animation_data[this.DURATION] = animation[this.DURATION];

        this.animation_data[this.ALPHA] = 1;
        this.animation_data[this.ALPHA_ORIGINAL] = 0;
    }

    fade_out(animation) {
        this.animation_data[this.DURATION] = animation[this.DURATION];

        this.animation_data[this.ALPHA] = 0;
        this.animation_data[this.ALPHA_ORIGINAL] = 1;
    }
}

export default AnimationData;