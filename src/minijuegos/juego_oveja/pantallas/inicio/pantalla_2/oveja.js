import Oveja from '/src/minijuegos/juego_oveja/game_objects/sprites/oveja.js';

class OvejaPantalla2 extends Oveja {
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

        if (this.x <= 960 && !this.animation) {
            this.jump_animation();
        }

        if (this.x <= 0 - this.width) {
            this.animation = false;
            this.x = this.initial_x;
            this.scene.pantalla_inicio.oveja_contada = false;
        }
    }

    jump_animation() {
        this.setVelocityY(-1000);
        this.animation = true;
    }
}

export default OvejaPantalla2;