import GamesGameObjects from '/src/minijuegos/games_game_objects.js';

class Gota extends GamesGameObjects {
    constructor(scene, x, y, scale_x, scale_y) {
        const GOTA_IMG = 'gota';
        super(scene, x, y, GOTA_IMG);
        this.scene = scene;
        this.scale_x=0.5;
        this.scale_y=0.5;
        this.setScale(scale_x, scale_y);
    }

    enter() {
        super.enter();
    }

    _update() {
        if (!this.active) return;
        // Aquí puedes agregar lógica adicional si quieres
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

export default Gota;
