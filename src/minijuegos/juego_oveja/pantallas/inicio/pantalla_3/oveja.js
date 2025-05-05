import Oveja from '/src/minijuegos/juego_oveja/game_objects/sprites/oveja.js';

class OvejaPantalla3 extends Oveja {
    constructor(scene, x, y, size) {
        super(scene, x, y);
        this.initial_x = x;
        this.setDepth(1);
        this.body.setAllowGravity(false);
        this.setScale(size);
    }

    enter() {
        super.enter();
        this.setDepth(3);
        this.body.setAllowGravity(true);
        this.set_gravity_force(800);
        this.setVelocityX(-500);
    }

    set_forces() {}


    exit() {
        super.exit();
    }

    _update(time, delta) {
        super._update(time, delta);
    }

    jump_animation() {
        this.setVelocityY(-1000);
        this.animation = true;
    }

    next_frame() {
        if (this.has_choque) return 0;

        this.frame_index++;
        if (this.frame_index > 1) {
            this.frame_index = 0;
        }
        return this.frame_index;
    }

    choque() {
        this.setTint(0xff0000);
        this.setVelocityX(0);
        this.has_choque = true;

        setTimeout(() => {
            this.scene.pantalla_inicio_animation_complete();
        }, 600);
    }

    reset_animation() {
        this.has_choque = false;
        this.x = this.initial_x;
        this.visible = true;
        this.setVelocityX(-500);

        this.clearTint();
    }
}

export default OvejaPantalla3;