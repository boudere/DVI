import { DATA_INFO, MINIJUEGO_MANAGER } from "/src/data/scene_data.js";

class PantallaDefault extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture) {
        let img = scene.scene.get(DATA_INFO).get_img(MINIJUEGO_MANAGER, texture);
        super(scene, x, y, img);

        this.setOrigin(0, 0);
        this.setInteractive();

        this.next_scene = null;
    }

    enter(value=null) {
        this.scene.add.existing(this);
        this._set_events();
    }

    exit() {
        this._remove_events();
        this._before_destroy();
        this.destroy();
    }

    next_frame() {
        if (this.next_scene) {
            this.scene.pantalla_inicio = this.next_scene;
            this.next_scene.enter();
            this.exit();
            return;
        }
        this.action();
    }

    action() {}

    _set_events() {
        this.on('pointerup', this._mouse_up, this);
    }
    
    _remove_events() {
        this.off('pointerup', this._mouse_up, this);
    }

    _mouse_up() {
        this.next_frame();
    }

    _before_destroy() {}

    _update(time, delta) {}

    animacion_complete() {}
}

export default PantallaDefault;
