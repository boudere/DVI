import PantallaInicioDefault from "/src/minijuegos/pantalla_inicio_default";

class PantallaIncioStartDefault extends PantallaInicioDefault {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
    }

    create_text(width, height) {
        if (this.scene) this.start_text = this.scene.add.text(
            width * 0.5, height * 0.5,
            `START`,
            {
                fontSize: '160px',
                fill: '#000000',
                fontFamily: 'Impact'
            }).setOrigin(0.5, 0.5).setDepth(1);
    }

    enter(value = null) {
        super.enter(value);
        
        setTimeout(() => {
            this.next_frame();
        }, 1000);
    }

    _before_destroy() {
        super._before_destroy();
        if (this.start_text) { this.start_text.destroy(); }
    }

    _update(time, delta) {
        super._update(time, delta);
    }
}

export default PantallaIncioStartDefault;
