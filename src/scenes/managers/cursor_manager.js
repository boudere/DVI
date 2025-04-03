import Managers from "/src/scenes/managers";

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
    }

    enter(scene_data) {
        this.edge_margin = scene_data.edge_margin || 200;
        this.scroll_speed = scene_data.scroll_speed || 5;
    }

    update(time, delta) {
        // Este método se llama automáticamente cada frame
        if (this.can_move) {
            this.scene_manager.scroll(this.movement_x * delta, this.movement_y * delta);
        }
    }

    _set_events() {
        // this.input.on('pointermove', this._mouse_move, this);
    }

    _mouse_move(pointer) {
        const margin = this.edge_margin;
        const maxSpeed = this.scroll_speed;
    
        this.movement_x = 0;
        this.movement_y = 0;
    
        // Movimiento horizontal proporcional
        if (pointer.x < margin) {
            const factor = (margin - pointer.x) / margin;
            this.movement_x = maxSpeed * factor;
        } else if (pointer.x > this.sys.game.config.width - margin) {
            const factor = (pointer.x - (this.sys.game.config.width - margin)) / margin;
            this.movement_x = -maxSpeed * factor;
        }
    
        // Movimiento vertical proporcional
        if (pointer.y < margin) {
            const factor = (margin - pointer.y) / margin;
            this.movement_y = maxSpeed * factor;
        } else if (pointer.y > this.sys.game.config.height - margin) {
            const factor = (pointer.y - (this.sys.game.config.height - margin)) / margin;
            this.movement_y = -maxSpeed * factor;
        }
    
        this.can_move = (this.movement_x !== 0 || this.movement_y !== 0);
    }
    
}


export default CursorManager;
    