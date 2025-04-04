import Managers from "/src/scenes/managers";
import CursorBackground from "/src/cursor/cursor_background";

import { CURSOR_MANAGER, DIALOGO_MANAGER, DATA_INFO, SCENE_MANAGER } from "/src/data/scene_data.js";

// esta escena de momento solo lanza la escena de dialogo
class CursorManager extends Managers {
    constructor() {
        super({ key: CURSOR_MANAGER });
    }

    _reset_data() {}

    create() {
        this.scene_manager = this.scene.get(SCENE_MANAGER);
        this._set_events();

        this.movement_x = 0;
        this.movement_y = 0;
        this.can_move = false;

        this.background = new CursorBackground(this, 0, 0, this.scene.get(DATA_INFO).get_img(CURSOR_MANAGER, "can_be_clicked"));

        this._set_events();
    }

    enter(scene_data) {
        this.edge_margin = scene_data.edge_margin;
        this.move_speed = scene_data.move_speed;
    }

    _update(time, delta) {
        // Este método se llama automáticamente cada frame
        if (this.can_move) {
            this.scene_manager.move(this.movement_x * delta, this.movement_y * delta);
        }
    }

    _set_events() {
        this.input.on('pointermove', this._mouse_move, this);
        this.input.on('pointerup', this._mouse_up, this);
    }

    _mouse_move(pointer) {
        this.background.move(pointer.x, pointer.y);


        const margin = this.edge_margin;
        const maxSpeed = this.move_speed;

        this.movement_x = 0;
        this.movement_y = 0;
    
        // Horizontal
        if (pointer.x < margin) {
            const factor = (margin - pointer.x) / margin;
            this.movement_x = maxSpeed * factor;
        } else if (pointer.x > this.sys.game.config.width - margin) {
            const factor = (pointer.x - (this.sys.game.config.width - margin)) / margin;
            this.movement_x = -maxSpeed * factor;
        }
    
        // Vertical
        if (pointer.y < margin) {
            const factor = (margin - pointer.y) / margin;
            this.movement_y = maxSpeed * factor;
        } else if (pointer.y > this.sys.game.config.height - margin) {
            const factor = (pointer.y - (this.sys.game.config.height - margin)) / margin;
            this.movement_y = -maxSpeed * factor;
        }
    
        this.can_move = (this.movement_x !== 0 || this.movement_y !== 0);
    }

    _mouse_up() {
        this.background.exit();
    }

    _load_background() {
    }
    
    cursor_entered(name) {
        this.background.enter(name);
    }

    cursor_exited(name) {
        this.background.exit(name);
    }
}


export default CursorManager;
    