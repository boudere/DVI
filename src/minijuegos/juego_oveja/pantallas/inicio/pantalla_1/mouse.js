import Mouse from '/src/minijuegos/juego_oveja/game_objects/sprites/mouse.js';

class MousePantalla1 extends Mouse {
    constructor(scene, x, y, size) {
        super(scene, x, y);

        this.setScale(size);
    }

    enter() {
        super.enter();
        
        this.setDepth(1);
    }
}

export default MousePantalla1;