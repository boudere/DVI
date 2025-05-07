import PantallaFinalDefault from "/src/minijuegos/pantalla_final_default.js";
import DormirPantalla1 from "/src/minijuegos/juego_oveja/game_objects/sprites/dormir.js";
import TextPantalla1 from "/src/minijuegos/juego_oveja/pantallas/final/pantalla_1/text.js";

class PantallaFinal extends PantallaFinalDefault {
    constructor(scene, x, y) {
        let TEXTURE = 'violete_juego_oveja';
        super(scene, x, y, TEXTURE);

        // this.next_scene = new PantallaInicio(scene, x, y);

        let width = this.scene.sys.game.config.width;
        let height = this.scene.sys.game.config.height;

        this.has_entered = false;

        this.dormir = new DormirPantalla1(scene, width / 2, height * 0.4);

        this.setDepth(0);

        this.next_frame_value = 'JuegoOveja';
    }

    create() {
        super.create();
    }

    enter(value = null) {
        super.enter(value);
        this.texts = []
        this.has_entered = true;
        this.show_text(value.ovejas, value.previus_record, value.record);
        this.dormir.enter();
    }

    _before_destroy() {
        super._before_destroy();

        this.dormir.exit();

        this.texts.forEach(text => {
            text.destroy();
        });
    }

    _update(time, delta) {
        if (!this.has_entered) {
            return;
        }
        super._update(time, delta);

        this.dormir._update(time, delta);
    }

    show_text(ovejas, previus_record, record) {
        if (record) this.new_record(ovejas, previus_record);
        else this.normal_text(ovejas, previus_record);
    }

    new_record(ovejas, previus_record) {
        let texto = "New Record: " + ovejas;
        this.add_text(texto, this.width * 0.5, this.height * 0.7, 0, {
            fontSize: '64px',
            color: '#000000',
            fontFamily: 'Impact' 
        });
    }

    normal_text(ovejas, previus_record) {
        let texto = "Score: " + ovejas;
        this.add_text(texto, this.width * 0.5, this.height * 0.7, 0, {
            fontSize: '64px',
            color: '#000000',
            fontFamily: 'Impact' 
        });
        
        texto = "Record personal: " + previus_record;
        this.add_text(texto, this.width * 0.5, this.height * 0.8, 0, {
            fontSize: '64px',
            color: '#000000',
            fontFamily: 'Impact' 
        });
    }

    add_text(texto, x, y, delay, opciones_entrada = {}) {
        let text = new TextPantalla1(this.scene, x, y, this, this.width, texto, delay, opciones_entrada);
        this.texts.push(text);
    }
}

export default PantallaFinal;