import GamesGameObjects from '/src/minijuegos/games_game_objects.js';

class Barra extends GamesGameObjects {
    constructor(scene, x, y, scale_x, scale_y) {
        const BARRA_IMG = 'barra'; // Asegúrate que coincida con el nombre del sprite cargado
        super(scene, x, y, BARRA_IMG);
        
        this.setScale(scale_x, scale_y);
        this.setImmovable(true);
        this.speed = 600;
    }

    enter() {
        super.enter();
        this.setCollideWorldBounds(true);
        //this.cursors = this.scene.input.keyboard.createCursorKeys();
    }

    _update() {
        if (!this.active) return;

        this.setVelocityX(0);

        if (this.cursors.left.isDown) {
            this.setVelocityX(-this.speed);
        } else if (this.cursors.right.isDown) {
            this.setVelocityX(this.speed);
        }
    }

    exit() {
        super.exit();
    }

    _set_event(event) {
        super._set_event(event);
    }

    _remove_event(event) {
        super._remove_event(event);
    }
}

export default Barra;