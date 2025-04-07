import Phaser from "phaser";

class GamesGameObjects extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);

    }
    
    enter() {
        this._add_img();
        this._set_colliders();
    }

    exit() {
        // Placeholder for exit logic
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