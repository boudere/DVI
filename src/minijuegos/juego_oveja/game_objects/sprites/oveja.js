import GamesGameObjects from "/src/minijuegos/games_game_objects.js";
import { DATA_INFO, MINIJUEGO_MANAGER } from "/src/data/scene_data.js";

class Oveja extends GamesGameObjects {
    constructor(scene, x, y) {
        let OVEJA_IMG = 'oveja_';

        super(scene, x, y, OVEJA_IMG+'1');
        this.OVEJA_IMG = OVEJA_IMG;
        this.last_updtate = 0;
        this.frame_index = 1;
        this.frame_delay = [ 150, 400];
        this.setDepth(3);
    }

    enter() {
        super.enter();
        this.set_forces();
    }

    set_forces() {
        this.jumping = false;
        setTimeout(() => {
            this.setBounce(0);
            this.set_gravity_force(800);
            this.setVelocityX(-500);
        }, 10);

        this._set_colliders(0.7, 0.7);
    }

    exit() {
        super.exit();
    }

    set_gravity_force(gravity) {
        this.body.setGravityY(gravity);
    }

    _update(time, delta) {
        super._update(time, delta);
    }

    _set_event(event) {
    }

    _remove_event(event) {
    }

    _update(time, delta) {
        if (!this.scene) return;
        if (this.last_updtate + this.frame_delay[this.frame_index] < time) {
            this.last_updtate = time;
            let img = this.scene.scene.get(DATA_INFO).get_img(MINIJUEGO_MANAGER, this.OVEJA_IMG+this.next_frame());
            this.setTexture(img);
        }

        if (this.body && this.body.velocity.y < -10) {
            this.setRotation(Phaser.Math.DegToRad(20));  // Subiendo
        } else if (this.body && this.body.velocity.y > 10) {
            this.setRotation(Phaser.Math.DegToRad(-20));   // Cayendo
        } else {
            this.setRotation(Phaser.Math.DegToRad(0));    // Quieto
        }
    }

    next_frame() {
        if (!this.body.onFloor()) {
            this.jumping = true;
            return 1;
        } else if (this.jumping) {
            this.jumping = false;
            return 0;
        }

        this.frame_index++;
        if (this.frame_index > 1) {
            this.frame_index = 0;
        }
        return this.frame_index;
    }

}

export default Oveja;
