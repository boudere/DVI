import { MINIJUEGO_MANAGER, DATA_INFO } from "/src/data/scene_data.js";

class GamesGameObjects extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, img_name) {
        let texture = scene.scene.get(DATA_INFO).get_img(MINIJUEGO_MANAGER, img_name);

        super(scene, x, y, texture);

        this._add_img();
        this._set_colliders();

        this.visible = false;
    }
    
    enter() {
        this.visible = true;
    }

    exit() {
        this.destroy();
    }

    _update(time, delta) {
        // Placeholder for update logic
    }

    _set_event(event) {
        // Placeholder for setting event logic
    }

    _remove_event(event) {
        // Placeholder for removing event logic
    }

    _set_colliders(size_x = 0.8, size_y = 0.8) {
        let sizeX = this.width * size_x;
        let sizeY = this.height * size_y;
        let offsetX = this.width * (1 - size_x) / 2;
        let offsetY = this.height * (1 - size_y) / 2;

        this.body.setSize(sizeX, sizeY);
        this.body.setOffset(offsetX, offsetY);
    }

    _add_img() {
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
    }
}

export default GamesGameObjects;