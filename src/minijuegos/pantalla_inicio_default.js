import PantallaDefault from "/src/minijuegos/pantalla_default";

class PantallaInicioDefault extends PantallaDefault {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
    }

    action() {
        if (this.scene) this.scene.start_game();

        super.action();
    }

    _set_events() {
        super._set_events();
        
        // Crear una referencia a la tecla ESC
        this.keyEsc = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        // Escuchar cuando se presiona la tecla
        this.keyEsc.on('down', () => {
            this._key_esc_pressed();
        });
    }

    _remove_events() {
        super._remove_events();
        
        if (this.keyEsc) {
            this.keyEsc.off('down'); // elimina el listener asociado a 'down'
            this.keyEsc.destroy();   // opcional: elimina la referencia a la tecla
            this.keyEsc = null;
        }
    }

    enter(value = null) {
        super.enter(value);

        let width = this.displayWidth;
        let height = this.displayHeight;

        this.create_text(width, height);
    }

    exit() {
        super.exit();
    }

    _before_destroy() { 
        if (this.skip_text) {
            this.skip_text.setVisible(false);
            this.skip_text.destroy();
        }
        if (this.continue_text) {
            this.continue_text.setVisible(false);
            this.continue_text.destroy();
        }
    }


    _key_esc_pressed() {
        this._before_destroy();
        if (this.next_scene) this.next_scene.exit();
        if (this.last_scene) this.next_scene = this.last_scene;
        this.next_frame();
    }

    create_text(width, height) {
        if (this.scene && !this.continue_text) this.continue_text = this.scene.add.text(
            width * 0.88, height * 0.94,
            `Click to continue`,
            {
                fontSize: '48px',
                fill: '#ffffff',
                fontFamily: 'Impact'
            }).setOrigin(0.5, 0.5).setDepth(1);
    
        if (this.scene && !this.skip_text) this.skip_text = this.scene.add.text(
            width * 0.12, height * 0.94,
            `Press ESC to skip`,
            {
                fontSize: '48px',
                fill: '#ffffff',
                fontFamily: 'Impact'
            }).setOrigin(0.5, 0.5).setDepth(1);
        }
}

export default PantallaInicioDefault;
