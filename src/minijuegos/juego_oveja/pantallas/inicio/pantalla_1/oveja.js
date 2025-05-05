import Oveja from '/src/minijuegos/juego_oveja/game_objects/sprites/oveja.js';

class OvejaPantalla1 extends Oveja {
    constructor(scene, x, y, size) {
        super(scene, x, y);
        this.setDepth(1);
        this.body.setAllowGravity(false);
        this.setScale(size);
    }

    enter() {
        super.enter();
        this.setDepth(1);
        this.body.setAllowGravity(true);
        this.set_gravity_force(800);

        this.jump_animation();
    }

    set_forces() {}


    exit() {
        super.exit();
    }

    next_frame() {
        if (!this.body.onFloor()) {
            this.jumping = true;
            return 1;
        } else if (this.jumping) {
            this.jumping = false;
            return 0;
        }
        return 0;
    }

    _update(time, delta) {
        super._update(time, delta);
        if (this.animation && this.body.onFloor()) {
            setTimeout(() => {
                if (this.scene) this.scene.pantalla_inicio_animation_complete();
                this.jump_animation();
                this.animation = false;
            }, 200);
        }
    }

    jump_animation() {
        setTimeout(() => {
            if (!this.body) return;
            this.setVelocityY(-1000);
            this.animation = true;
        }, 100);
    }
}

export default OvejaPantalla1;