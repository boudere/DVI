import { DATA_INFO, MINIJUEGO_MANAGER } from "/src/data/scene_data.js";

class PantallaDefault extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture) {
        let img = scene.scene.get(DATA_INFO).get_img(MINIJUEGO_MANAGER, texture);
        super(scene, x, y, img);

        this.setOrigin(0, 0);
        this.setScale(scene.scale.width/this.width, scene.scale.height/this.height);
        this.setInteractive();

        this.next_scene = null;
        this.next_frame_value = null;
    }

    enter(value = null) {
        this.scene.add.existing(this);
        this._set_events();
    }

    exit() {
        this._remove_events();
        this._before_destroy();
        this.destroy();
    }

    next_frame(value = null) {
        if (this.next_scene) {
            this.scene.pantalla_inicio = this.next_scene;
            this._remove_events();
            this.next_scene.enter(value);
            this.exit();
            return;
        }
        this.action();
    }

    action() {
        this.exit();
    }

    _set_events() { }

    _remove_events() { }

    _mouse_up() {
        this.next_frame(this.next_frame_value);
    }

    _before_destroy() { }

    _update(time, delta) { }

    animacion_complete() { }

    finish_animation() { }
}

export default PantallaDefault;
