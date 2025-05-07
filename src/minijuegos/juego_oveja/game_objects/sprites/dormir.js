import GamesGameObjects from "/src/minijuegos/games_game_objects.js";
import { DATA_INFO, MINIJUEGO_MANAGER } from "/src/data/scene_data.js";

class DormirPantalla1 extends GamesGameObjects {
    constructor(scene, x, y) {
        let DORMIR_IMG = 'dormir';

        super(scene, x, y, DORMIR_IMG+'1');

        this.setOrigin(0.5, 0.5);
        this.setDepth(1);

        this.last_update = 0;
        this.frame_index = 1;
        this.update_interval = 200;
        
        this.setImmovable(true);
        this.body.setAllowGravity(false);
    }

    enter() {
        super.enter();
    }

    exit() {
        super.exit();
    }

    _update(time, delta) {
        super._update(time, delta);
        if (this.last_update + this.update_interval < time) {
            this.last_update = time;
            this.next_frame();
        }
    }

    _set_event(event) {
        super._set_event(event);
    }

    _remove_event(event) {
        super._remove_event(event);
    }

    _set_colliders(size_x = 0.8, size_y = 0.8) {}

    next_frame() {
        if (!this.scene) return;
        this.frame_index++;
        if (this.frame_index > 7) {
            this.frame_index = 1;
        }
        let img = this.scene.scene.get(DATA_INFO).get_img(MINIJUEGO_MANAGER, 'dormir'+this.frame_index);
        this.setTexture(img);
    }
}

export default DormirPantalla1;
