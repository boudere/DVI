import GamesGameObjects from "/src/minijuegos/games_game_objects.js";

class Carta extends GamesGameObjects {
    constructor(scene, x, y, frontKey, backKey, id) {
        super(scene, x, y, backKey);

        this.scene = scene;
        this.id = id;
        this.revelado = false;

        this.front = scene.add.image(x, y, frontKey).setVisible(false).setScale(0.5);
        this.back = this.setInteractive().setScale(0.5);

        this.back.on('pointerdown', () => {
            if (this.onClick) this.onClick(this);
        });
    }

    reveal() {
        if (this.revelado) return;
        this.revelado = true;
        this.back.setVisible(false);
        this.front.setVisible(true);
    }

    hide() {
        this.revelado = false;
        this.back.setVisible(true);
        this.front.setVisible(false);
    }

    setOnClick(callback) {
        this.onClick = callback;
    }

    destroy() {
        this.front.destroy();
        this.back.destroy();
    }

    enter() {
        super.enter();
    }

    exit() {
        super.exit();
    }

    _update(time, delta) {
        super._update(time, delta);
    }

    _set_event(event) {
        super._set_event(event);
    }

    _remove_event(event) {
        super._remove_event(event);
    }
}

export default Carta;