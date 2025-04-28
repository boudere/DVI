
class PantallaDefault extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);

        this.setOrigin(0, 0);
        this.setScale(scene.scale.width/this.width, scene.scale.height/this.height);
        this.setInteractive();

        this.total_clicks = 0;
        this.clicks = 0;
    }

    enter(value=null) {
        this.scene.add.existing(this);
        this.total_clicks++;
        this._set_events();
    }

    exit() {
        this._remove_events();
        this.destroy();
    }

    next_frame() {
        this.clicks++;

        if (this.clicks >= this.total_clicks) {
            this.clicks = 0;
            this.action();
        }
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
}

export default PantallaDefault;
